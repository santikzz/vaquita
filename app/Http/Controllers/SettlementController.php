<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Group;
use App\Models\Settlement;
use App\Services\BalanceService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

        // guard against stale or duplicate submissions: the payer must still owe
        // at least this amount and the receiver must still be owed it, otherwise
        // the settlement would flip balances and re-suggest reversed transfers
        DB::transaction(function () use ($event, $validated, $fromId, $toId) {
            Event::whereKey($event->id)->lockForUpdate()->first();

            $balances = $this->balances->balances($event);

            if (($balances[$fromId] ?? 0) > -$validated['amount_minor'] || ($balances[$toId] ?? 0) < $validated['amount_minor']) {
                throw ValidationException::withMessages([
                    'amount_minor' => 'This payment no longer matches the current balances. It may have already been recorded.',
                ]);
            }

            $event->settlements()->create([
                'from_member_id' => $fromId,
                'to_member_id' => $toId,
                'amount_minor' => $validated['amount_minor'],
                'note' => $validated['note'] ?? null,
                'settled_at' => $validated['settled_at'] ?? now()->toDateString(),
            ]);
        });

        $event->unsetRelation('settlements');
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
