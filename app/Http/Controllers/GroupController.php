<?php

namespace App\Http\Controllers;

use App\Http\Traits\PresentsMembers;
use App\Models\Event;
use App\Models\Expense;
use App\Models\Group;
use App\Models\Member;
use App\Services\BalanceService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class GroupController extends Controller
{
    use PresentsMembers;

    public function __construct(private BalanceService $balances) {}

    public function index(Request $request)
    {
        $groups = Group::query()
            ->whereHas('members', fn ($q) => $q->where('user_id', $request->user()->id)->where('is_active', true))
            ->with('activeMembers.user')
            ->withCount(['events as open_events_count' => fn ($q) => $q->where('status', Event::STATUS_OPEN)])
            ->latest()
            ->get();

        return Inertia::render('groups/index', [
            'groups' => $groups->map(fn (Group $group) => [
                'uuid' => $group->uuid,
                'name' => $group->name,
                'currency' => $group->currency,
                'is_owner' => $group->owner_id === $request->user()->id,
                'open_events_count' => $group->open_events_count,
                'members' => $group->activeMembers->map(fn (Member $member) => $this->presentMember($member)),
            ]),
        ]);
    }

    public function create()
    {
        $this->authorize('create', Group::class);

        return Inertia::render('groups/manage');
    }

    public function store(Request $request)
    {
        $this->authorize('create', Group::class);

        $validated = $this->validateData($request);

        $group = DB::transaction(function () use ($request, $validated) {
            $group = Group::create([
                'name' => $validated['name'],
                'currency' => strtoupper($validated['currency']),
                'owner_id' => $request->user()->id,
            ]);

            $group->members()->create([
                'user_id' => $request->user()->id,
                'role' => Member::ROLE_OWNER,
            ]);

            return $group;
        });

        return redirect()->route('groups.show', $group)->with('success', 'toast:group_created');
    }

    public function show(Request $request, Group $group)
    {
        $this->authorize('view', $group);

        $group->load('members.user');

        $events = $group->events()
            ->withCount('participants')
            ->withSum('expenses as total_minor', 'amount_minor')
            ->orderByDesc('event_date')
            ->orderByDesc('id')
            ->get();

        $membersById = $group->members->keyBy('id');
        $balances = collect($this->balances->balancesForGroup($group))
            ->map(fn (int $amount, int $memberId) => [
                'member_uuid' => $membersById->get($memberId)?->uuid,
                'amount_minor' => $amount,
            ])
            ->values();

        return Inertia::render('groups/show', [
            'group' => $this->present($group, $request),
            'members' => $group->members->map(fn (Member $member) => $this->presentMember($member)),
            'balances' => $balances,
            'events' => $events->map(fn (Event $event) => [
                'uuid' => $event->uuid,
                'name' => $event->name,
                'event_date' => $event->event_date->toDateString(),
                'status' => $event->status,
                'participants_count' => $event->participants_count,
                'total_minor' => (int) ($event->total_minor ?? 0),
            ]),
        ]);
    }

    // total spent per calendar month, newest first; grouped in PHP so it stays
    // portable across sqlite/pgsql without date-format sql functions
    public function stats(Request $request, Group $group)
    {
        $this->authorize('view', $group);

        $eventIds = $group->events()->pluck('id');

        $months = Expense::whereIn('event_id', $eventIds)
            ->get(['spent_at', 'amount_minor'])
            ->groupBy(fn (Expense $expense) => $expense->spent_at->format('Y-m'))
            ->map(fn ($expenses, string $month) => [
                'month' => $month,
                'total_minor' => (int) $expenses->sum('amount_minor'),
            ])
            ->sortKeysDesc()
            ->values();

        return Inertia::render('groups/stats', [
            'group' => ['uuid' => $group->uuid, 'name' => $group->name, 'currency' => $group->currency],
            'months' => $months,
        ]);
    }

    public function edit(Request $request, Group $group)
    {
        $this->authorize('update', $group);

        return Inertia::render('groups/manage', [
            'group' => $this->present($group, $request),
        ]);
    }

    public function update(Request $request, Group $group)
    {
        $this->authorize('update', $group);

        $validated = $this->validateData($request);

        $group->update([
            'name' => $validated['name'],
            'currency' => strtoupper($validated['currency']),
        ]);

        return redirect()->route('groups.show', $group)->with('success', 'toast:group_updated');
    }

    public function destroy(Group $group)
    {
        $this->authorize('delete', $group);

        $group->delete();

        return redirect()->route('groups.index')->with('success', 'toast:group_deleted');
    }

    // ------------------------------------------------------------------------------
    // Quick split: group + guests + first event in one screen, for when
    // nobody else has the app.
    // ------------------------------------------------------------------------------

    public function quick()
    {
        $this->authorize('create', Group::class);

        return Inertia::render('groups/quick');
    }

    public function storeQuick(Request $request)
    {
        $this->authorize('create', Group::class);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'currency' => ['required', 'string', 'size:3', 'alpha'],
            'guests' => ['required', 'array', 'min:1'],
            'guests.*' => ['required', 'string', 'max:50'],
            'event_name' => ['required', 'string', 'max:100'],
            'event_date' => ['nullable', 'date'],
            'include_me' => ['nullable', 'boolean'],
        ]);

        $event = DB::transaction(function () use ($request, $validated) {
            $group = Group::create([
                'name' => $validated['name'],
                'currency' => strtoupper($validated['currency']),
                'owner_id' => $request->user()->id,
            ]);

            $owner = $group->members()->create([
                'user_id' => $request->user()->id,
                'role' => Member::ROLE_OWNER,
            ]);

            $participantIds = collect($validated['guests'])
                ->map(fn (string $name) => $group->members()->create(['nickname' => $name])->id);

            if ($validated['include_me'] ?? true) {
                $participantIds->push($owner->id);
            }

            $event = $group->events()->create([
                'name' => $validated['event_name'],
                'event_date' => $validated['event_date'] ?? now()->toDateString(),
                'created_by' => $owner->id,
            ]);

            $event->participants()->attach($participantIds->all());

            return $event;
        });

        return redirect()
            ->route('events.show', [$event->group, $event])
            ->with('success', 'toast:group_created');
    }

    // ------------------------------------------------------------------------------

    private function validateData(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'currency' => ['required', 'string', 'size:3', 'alpha'],
        ]);
    }

    private function present(Group $group, Request $request): array
    {
        return [
            'uuid' => $group->uuid,
            'name' => $group->name,
            'currency' => $group->currency,
            'invite_code' => $group->invite_code,
            'is_owner' => $group->owner_id === $request->user()->id,
        ];
    }
}
