<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\Group;
use App\Models\User;

class EventPolicy
{
    public function view(User $user, Event $event): bool
    {
        return $event->group->hasActiveMember($user);
    }

    public function create(User $user, Group $group): bool
    {
        return $group->hasActiveMember($user);
    }

    public function update(User $user, Event $event): bool
    {
        return $event->creator?->user_id === $user->id
            || $event->group->owner_id === $user->id;
    }

    public function delete(User $user, Event $event): bool
    {
        return $this->update($user, $event);
    }
}
