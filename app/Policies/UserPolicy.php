<?php

namespace App\Policies;

use App\Models\User;

/**
 * Only admins manage users. A user can always view/update their own record;
 * destructive actions are admin-only and an admin cannot delete themselves.
 */
class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function view(User $user, User $model): bool
    {
        return $user->hasRole('admin') || $user->id === $model->id;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function update(User $user, User $model): bool
    {
        return $user->hasRole('admin') || $user->id === $model->id;
    }

    public function delete(User $user, User $model): bool
    {
        return $user->hasRole('admin') && $user->id !== $model->id;
    }
}
