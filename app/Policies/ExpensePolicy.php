<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\Expense;
use App\Models\User;

/**
 * Expenses are created by event participants (or the group owner, who manages
 * guest-only events). Editing is limited to the payer's account and the owner;
 * guest-payer expenses can be edited by any participant since guests have no login.
 */
class ExpensePolicy
{
    public function create(User $user, Event $event): bool
    {
        return $this->isParticipant($user, $event)
            || $event->group->owner_id === $user->id;
    }

    public function update(User $user, Expense $expense): bool
    {
        $event = $expense->event;

        if ($event->group->owner_id === $user->id) {
            return true;
        }

        if ($expense->payer->is_guest) {
            return $this->isParticipant($user, $event);
        }

        return $expense->payer->user_id === $user->id;
    }

    public function delete(User $user, Expense $expense): bool
    {
        return $this->update($user, $expense);
    }

    private function isParticipant(User $user, Event $event): bool
    {
        return $event->participants()->where('user_id', $user->id)->exists();
    }
}
