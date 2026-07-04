<?php

namespace App\Services;

use App\Models\Event;

/**
 * Balances per event: balance = paid + settlements sent − owed − settlements
 * received. Positive means the member should receive money. All amounts are
 * integer minor units, so balances always net to exactly zero.
 */
class BalanceService
{
    // returns [member_id => net balance in minor units]
    public function balances(Event $event): array
    {
        $balances = [];

        foreach ($event->participants()->pluck('members.id') as $memberId) {
            $balances[$memberId] = 0;
        }

        foreach ($event->expenses()->with('shares')->get() as $expense) {
            $balances[$expense->payer_member_id] = ($balances[$expense->payer_member_id] ?? 0) + $expense->amount_minor;

            foreach ($expense->shares as $share) {
                $balances[$share->member_id] = ($balances[$share->member_id] ?? 0) - $share->amount_minor;
            }
        }

        foreach ($event->settlements as $settlement) {
            $balances[$settlement->from_member_id] = ($balances[$settlement->from_member_id] ?? 0) + $settlement->amount_minor;
            $balances[$settlement->to_member_id] = ($balances[$settlement->to_member_id] ?? 0) - $settlement->amount_minor;
        }

        return $balances;
    }

    /**
     * Greedy debt simplification: repeatedly match the largest debtor with
     * the largest creditor. Produces the short "who pays whom" list.
     * Returns [['from_member_id', 'to_member_id', 'amount_minor'], ...].
     */
    public function suggestTransfers(array $balances): array
    {
        $creditors = [];
        $debtors = [];

        foreach ($balances as $memberId => $balance) {
            if ($balance > 0) {
                $creditors[$memberId] = $balance;
            } elseif ($balance < 0) {
                $debtors[$memberId] = -$balance;
            }
        }

        $transfers = [];

        while ($creditors !== [] && $debtors !== []) {
            arsort($creditors);
            arsort($debtors);

            $creditorId = array_key_first($creditors);
            $debtorId = array_key_first($debtors);
            $amount = min($creditors[$creditorId], $debtors[$debtorId]);

            $transfers[] = [
                'from_member_id' => $debtorId,
                'to_member_id' => $creditorId,
                'amount_minor' => $amount,
            ];

            $creditors[$creditorId] -= $amount;
            $debtors[$debtorId] -= $amount;

            if ($creditors[$creditorId] === 0) {
                unset($creditors[$creditorId]);
            }
            if ($debtors[$debtorId] === 0) {
                unset($debtors[$debtorId]);
            }
        }

        return $transfers;
    }

    // all-time totals for the group tab: per-event balances summed up
    public function balancesForGroup(\App\Models\Group $group): array
    {
        $balances = [];

        foreach ($group->events as $event) {
            foreach ($this->balances($event) as $memberId => $amount) {
                $balances[$memberId] = ($balances[$memberId] ?? 0) + $amount;
            }
        }

        return $balances;
    }

    public function isSettled(Event $event): bool
    {
        foreach ($this->balances($event) as $balance) {
            if ($balance !== 0) {
                return false;
            }
        }

        return true;
    }

    // called after every expense/settlement write; an event with no expenses stays open
    public function refreshStatus(Event $event): void
    {
        $settled = $event->expenses()->exists() && $this->isSettled($event);
        $status = $settled ? Event::STATUS_SETTLED : Event::STATUS_OPEN;

        if ($event->status !== $status) {
            $event->status = $status;
            $event->save();
        }
    }
}
