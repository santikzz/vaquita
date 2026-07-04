<?php

namespace App\Support;

use App\Models\User;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Notification as Notifications;

// thin wrapper over laravel's notification system that names the three targeting
// modes. nothing here is magic - it's the standard $user->notify() / Notification::send()
// flow, grouped so call sites read clearly. see docs/notifications.md.
class Notify
{
    // single recipient
    public static function user(User $user, Notification $notification): void
    {
        $user->notify($notification);
    }

    // many recipients (collection, array, or any iterable of notifiables)
    public static function users(iterable $users, Notification $notification): void
    {
        Notifications::send($users, $notification);
    }

    // every user. chunked so it scales past a few thousand rows without loading them all.
    public static function all(Notification $notification): void
    {
        User::query()->chunkById(500, function ($users) use ($notification) {
            Notifications::send($users, $notification);
        });
    }
}
