<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Group;
use App\Models\Settlement;
use App\Services\BalanceService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class SettlementController extends Controller
{
    public function __construct(private BalanceService $balances) {}

    public function store(Request $request, Group $group, Event $event)
    {
        $this->authorize('create', [Settlement::class, $event]);

        $validated = $request->validate([
            'from_member' => ['required', 'string'],
            'to_member' => ['required', 'string', 'different:from_member'],
            'amount_minor' => ['required', 'integer', 'min:1'],
            'note' => ['nullable', 'string', 'max:255'],
            'settled_at' => ['nullable', 'date'],
        ]);

        $participants = $event->participants()->pluck('members.id', 'members.uuid');

        $fromId = $participants->get($validated['from_member']);
        $toId = $participants->get($validated['to_member']);

        if (! $fromId || ! $toId) {
            throw ValidationException::withMessages([
                'from_member' => 'Both members must be participants of this event.',
            ]);
        }

        $event->settlements()->create([
            'from_member_id' => $fromId,
            'to_member_id' => $toId,
            'amount_minor' => $validated['amount_minor'],
            'note' => $validated['note'] ?? null,
            'settled_at' => $validated['settled_at'] ?? now()->toDateString(),
        ]);

        $this->balances->refreshStatus($event);

        return back()->with('success', 'toast:settlement_recorded');
    }

    public function destroy(Group $group, Event $event, Settlement $settlement)
    {
        $this->authorize('delete', $settlement);

        $settlement->delete();
        $this->balances->refreshStatus($event);

        return back()->with('success', 'toast:settlement_deleted');
    }
}
