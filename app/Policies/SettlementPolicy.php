<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\Settlement;
use App\Models\User;

class SettlementPolicy
{
    public function create(User $user, Event $event): bool
    {
        return $event->group->hasActiveMember($user);
    }

    public function delete(User $user, Settlement $settlement): bool
    {
        return $settlement->event->group->hasActiveMember($user);
    }
}
