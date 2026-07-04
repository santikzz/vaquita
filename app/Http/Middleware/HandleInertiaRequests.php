<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();
        if ($user) {
            $userdata = [
                ...$user->toArray(),
                'permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
                'roles' => $user->getRoleNames()->toArray(),
            ];
        }

        return [
            ...parent::share($request),
            'auth' => ['user' => $userdata ?? null],
            'unreadNotifications' => fn () => $user ? $user->unreadNotifications()->count() : 0,
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
        ];
    }
}
