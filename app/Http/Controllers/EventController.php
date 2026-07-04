<?php

namespace App\Http\Controllers;

use App\Http\Traits\PresentsMembers;
use App\Models\Event;
use App\Models\Expense;
use App\Models\ExpenseShare;
use App\Models\Group;
use App\Models\Member;
use App\Models\Settlement;
use App\Services\BalanceService;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class EventController extends Controller
{
    use PresentsMembers;

    public function __construct(private BalanceService $balances) {}

    public function create(Group $group)
    {
        $this->authorize('create', [Event::class, $group]);

        $group->load('activeMembers.user');

        return Inertia::render('groups/events/manage', [
            'group' => ['uuid' => $group->uuid, 'name' => $group->name, 'currency' => $group->currency],
            'members' => $group->activeMembers->map(fn (Member $member) => $this->presentMember($member)),
        ]);
    }

    public function store(Request $request, Group $group)
    {
        $this->authorize('create', [Event::class, $group]);

        $validated = $this->validateData($request);
        $participantIds = $this->resolveParticipants($group, $validated['participants']);

        $event = DB::transaction(function () use ($request, $group, $validated, $participantIds) {
            $event = $group->events()->create([
                'name' => $validated['name'],
                'event_date' => $validated['event_date'],
                'created_by' => $group->memberFor($request->user())?->id,
            ]);

            $event->participants()->attach($participantIds->all());

            return $event;
        });

        return redirect()->route('events.show', [$group, $event])->with('success', 'toast:event_created');
    }

    public function show(Group $group, Event $event)
    {
        $this->authorize('view', $event);

        $event->load([
            'participants.user',
            'expenses.payer.user',
            'expenses.shares',
            'settlements.fromMember.user',
            'settlements.toMember.user',
        ]);

        $membersById = $event->participants->keyBy('id');
        $uuidOf = fn (int $memberId) => $membersById->get($memberId)?->uuid;

        $balances = $this->balances->balances($event);
        $transfers = $this->balances->suggestTransfers($balances);

        return Inertia::render('groups/events/show', [
            'group' => ['uuid' => $group->uuid, 'name' => $group->name, 'currency' => $group->currency],
            'event' => [
                'uuid' => $event->uuid,
                'name' => $event->name,
                'event_date' => $event->event_date->toDateString(),
                'status' => $event->status,
                'can_manage' => request()->user()->can('update', $event),
            ],
            'participants' => $event->participants->map(fn (Member $member) => $this->presentMember($member)),
            'expenses' => $event->expenses->map(fn (Expense $expense) => [
                'uuid' => $expense->uuid,
                'description' => $expense->description,
                'amount_minor' => $expense->amount_minor,
                'split_method' => $expense->split_method,
                'spent_at' => $expense->spent_at->toDateString(),
                'payer' => [
                    'uuid' => $expense->payer->uuid,
                    'display_name' => $expense->payer->display_name,
                ],
                'shares' => $expense->shares->map(fn (ExpenseShare $share) => [
                    'member_uuid' => $uuidOf($share->member_id),
                    'amount_minor' => $share->amount_minor,
                    'share_units' => $share->share_units,
                ]),
            ]),
            'settlements' => $event->settlements->map(fn (Settlement $settlement) => [
                'uuid' => $settlement->uuid,
                'amount_minor' => $settlement->amount_minor,
                'note' => $settlement->note,
                'settled_at' => $settlement->settled_at->toDateString(),
                'from' => ['uuid' => $settlement->fromMember->uuid, 'display_name' => $settlement->fromMember->display_name],
                'to' => ['uuid' => $settlement->toMember->uuid, 'display_name' => $settlement->toMember->display_name],
            ]),
            'balances' => collect($balances)->map(fn (int $amount, int $memberId) => [
                'member_uuid' => $uuidOf($memberId),
                'amount_minor' => $amount,
            ])->values(),
            'transfers' => collect($transfers)->map(fn (array $transfer) => [
                'from_member_uuid' => $uuidOf($transfer['from_member_id']),
                'to_member_uuid' => $uuidOf($transfer['to_member_id']),
                'amount_minor' => $transfer['amount_minor'],
            ]),
        ]);
    }

    public function edit(Group $group, Event $event)
    {
        $this->authorize('update', $event);

        $group->load('activeMembers.user');

        return Inertia::render('groups/events/manage', [
            'group' => ['uuid' => $group->uuid, 'name' => $group->name, 'currency' => $group->currency],
            'members' => $group->activeMembers->map(fn (Member $member) => $this->presentMember($member)),
            'event' => [
                'uuid' => $event->uuid,
                'name' => $event->name,
                'event_date' => $event->event_date->toDateString(),
                'participants' => $event->participants->pluck('uuid'),
            ],
        ]);
    }

    public function update(Request $request, Group $group, Event $event)
    {
        $this->authorize('update', $event);

        $validated = $this->validateData($request);
        $participantIds = $this->resolveParticipants($group, $validated['participants']);

        // participants with money in this event must stay on the list
        $locked = $this->memberIdsWithHistory($event);
        if ($locked->diff($participantIds)->isNotEmpty()) {
            throw ValidationException::withMessages([
                'participants' => 'Participants with expenses or payments cannot be removed from the event.',
            ]);
        }

        DB::transaction(function () use ($event, $validated, $participantIds) {
            $event->update([
                'name' => $validated['name'],
                'event_date' => $validated['event_date'],
            ]);

            $event->participants()->sync($participantIds->all());
        });

        return redirect()->route('events.show', [$group, $event])->with('success', 'toast:event_updated');
    }

    public function destroy(Group $group, Event $event)
    {
        $this->authorize('delete', $event);

        $event->delete();

        return redirect()->route('groups.show', $group)->with('success', 'toast:event_deleted');
    }

    // ------------------------------------------------------------------------------

    private function validateData(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'event_date' => ['required', 'date'],
            'participants' => ['required', 'array', 'min:1'],
            'participants.*' => ['required', 'string'],
        ]);
    }

    // map participant uuids to active members of this group; reject unknowns
    private function resolveParticipants(Group $group, array $uuids): Collection
    {
        $uuids = array_values(array_unique($uuids));

        $members = $group->activeMembers()->whereIn('uuid', $uuids)->pluck('id', 'uuid');

        if ($members->count() !== count($uuids)) {
            throw ValidationException::withMessages([
                'participants' => 'One or more participants do not belong to this group.',
            ]);
        }

        return $members->values();
    }

    private function memberIdsWithHistory(Event $event): Collection
    {
        $expenseIds = $event->expenses()->pluck('id');

        return $event->expenses()->pluck('payer_member_id')
            ->merge(ExpenseShare::whereIn('expense_id', $expenseIds)->pluck('member_id'))
            ->merge($event->settlements()->pluck('from_member_id'))
            ->merge($event->settlements()->pluck('to_member_id'))
            ->unique()
            ->values();
    }
}
