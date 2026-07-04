<?php

namespace App\Policies;

use App\Models\Group;
use App\Models\User;

/**
 * Any active member can view a group. Structural changes (settings, members,
 * invite code, deletion) are owner-only.
 */
class GroupPolicy
{
    public function view(User $user, Group $group): bool
    {
        return $group->hasActiveMember($user);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Group $group): bool
    {
        return $group->owner_id === $user->id;
    }

    public function delete(User $user, Group $group): bool
    {
        return $group->owner_id === $user->id;
    }

    public function manageMembers(User $user, Group $group): bool
    {
        return $group->owner_id === $user->id;
    }

    // any active member except the owner can walk away from a group
    public function leave(User $user, Group $group): bool
    {
        return $group->owner_id !== $user->id && $group->hasActiveMember($user);
    }

    public function regenerateInvite(User $user, Group $group): bool
    {
        return $group->owner_id === $user->id;
    }
}
