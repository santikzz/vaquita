<?php

namespace App\Http\Controllers;

use App\Http\Traits\PresentsMembers;
use App\Models\Event;
use App\Models\Expense;
use App\Models\Group;
use App\Models\Member;
use App\Services\BalanceService;
use App\Services\ExpenseSplitter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use InvalidArgumentException;

class ExpenseController extends Controller
{
    use PresentsMembers;

    public function __construct(
        private ExpenseSplitter $splitter,
        private BalanceService $balances,
    ) {}

    public function create(Group $group, Event $event)
    {
        $this->authorize('create', [Expense::class, $event]);

        return Inertia::render('groups/expenses/manage', [
            'group' => ['uuid' => $group->uuid, 'name' => $group->name, 'currency' => $group->currency],
            'event' => ['uuid' => $event->uuid, 'name' => $event->name],
            'participants' => $event->participants->load('user')->map(fn (Member $member) => $this->presentMember($member)),
        ]);
    }

    public function store(Request $request, Group $group, Event $event)
    {
        $this->authorize('create', [Expense::class, $event]);

        $validated = $this->validateData($request);

        $this->saveExpense($event, $validated, new Expense);

        return redirect()->route('events.show', [$group, $event])->with('success', 'toast:expense_created');
    }

    public function edit(Group $group, Event $event, Expense $expense)
    {
        $this->authorize('update', $expense);

        $expense->load('payer', 'shares.member');

        return Inertia::render('groups/expenses/manage', [
            'group' => ['uuid' => $group->uuid, 'name' => $group->name, 'currency' => $group->currency],
            'event' => ['uuid' => $event->uuid, 'name' => $event->name],
            'participants' => $event->participants->load('user')->map(fn (Member $member) => $this->presentMember($member)),
            'expense' => [
                'uuid' => $expense->uuid,
                'description' => $expense->description,
                'amount_minor' => $expense->amount_minor,
                'split_method' => $expense->split_method,
                'spent_at' => $expense->spent_at->toDateString(),
                'payer_member' => $expense->payer->uuid,
                'splits' => $expense->shares->map(fn ($share) => [
                    'member' => $share->member->uuid,
                    'amount_minor' => $share->amount_minor,
                    'units' => $share->share_units,
                ]),
            ],
        ]);
    }

    public function update(Request $request, Group $group, Event $event, Expense $expense)
    {
        $this->authorize('update', $expense);

        $validated = $this->validateData($request);

        $this->saveExpense($event, $validated, $expense);

        return redirect()->route('events.show', [$group, $event])->with('success', 'toast:expense_updated');
    }

    public function destroy(Group $group, Event $event, Expense $expense)
    {
        $this->authorize('delete', $expense);

        $expense->delete();
        $this->balances->refreshStatus($event);

        // back() would land on the deleted expense's edit page (404)
        return redirect()->route('events.show', [$group, $event])->with('success', 'toast:expense_deleted');
    }

    // ------------------------------------------------------------------------------

    private function validateData(Request $request): array
    {
        return $request->validate([
            'description' => ['required', 'string', 'max:255'],
            'amount_minor' => ['required', 'integer', 'min:1'],
            'split_method' => ['required', Rule::in(ExpenseSplitter::METHODS)],
            'spent_at' => ['required', 'date'],
            'payer_member' => ['required', 'string'],
            'splits' => ['required', 'array', 'min:1'],
            'splits.*.member' => ['required', 'string'],
            'splits.*.amount_minor' => ['required_if:split_method,amounts', 'integer', 'min:0'],
            'splits.*.units' => ['required_if:split_method,shares', 'integer', 'min:1'],
        ]);
    }

    // resolves uuids to event participants, computes shares, persists everything
    private function saveExpense(Event $event, array $validated, Expense $expense): void
    {
        $participants = $event->participants()->pluck('members.id', 'members.uuid');

        $payerId = $participants->get($validated['payer_member']);
        if (! $payerId) {
            throw ValidationException::withMessages([
                'payer_member' => 'The payer must be a participant of this event.',
            ]);
        }

        $splitterInput = [];
        foreach ($validated['splits'] as $split) {
            $memberId = $participants->get($split['member']);

            if (! $memberId) {
                throw ValidationException::withMessages([
                    'splits' => 'Every split member must be a participant of this event.',
                ]);
            }

            $splitterInput[$memberId] = match ($validated['split_method']) {
                ExpenseSplitter::METHOD_EQUAL => $memberId,
                ExpenseSplitter::METHOD_AMOUNTS => $split['amount_minor'],
                ExpenseSplitter::METHOD_SHARES => $split['units'],
            };
        }

        if ($validated['split_method'] === ExpenseSplitter::METHOD_EQUAL) {
            $splitterInput = array_values($splitterInput);
        }

        try {
            $shares = $this->splitter->split(
                (int) $validated['amount_minor'],
                $validated['split_method'],
                $splitterInput,
            );
        } catch (InvalidArgumentException $e) {
            throw ValidationException::withMessages(['splits' => $e->getMessage()]);
        }

        DB::transaction(function () use ($event, $validated, $expense, $payerId, $shares) {
            $expense->fill([
                'event_id' => $event->id,
                'payer_member_id' => $payerId,
                'description' => $validated['description'],
                'amount_minor' => $validated['amount_minor'],
                'split_method' => $validated['split_method'],
                'spent_at' => $validated['spent_at'],
            ])->save();

            $expense->shares()->delete();
            $expense->shares()->createMany(
                collect($shares)->map(fn (array $share, int $memberId) => [
                    'member_id' => $memberId,
                    'amount_minor' => $share['amount_minor'],
                    'share_units' => $share['share_units'],
                ])->values()->all()
            );
        });

        $this->balances->refreshStatus($event);
    }
}
