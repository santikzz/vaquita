<?php

namespace App\Providers;

use App\Meta\BaseMeta;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Inertia\Response;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // force HTTPS redirect
        if (config('app.force_https')) {
            URL::forceScheme('https');
        }

        // disable json "data" key wrapping
        JsonResource::withoutWrapping();

        // implicitly grant all abilities to "super" role users
        // (https://spatie.be/docs/laravel-permission/v6/basic-usage/super-admin)
        Gate::before(function ($user, $ability) {
            return $user->hasRole('super') ? true : null;
        });

        // global response macro to attach meta tags for Inertia pages. Usage:
        // return Inertia::render(...)->withMeta($meta);
        Response::macro('withMeta', function (?BaseMeta $meta = null) {
            if ($meta) {
                $this->withViewData([
                    'title' => $meta->toArray()['title'] ?? config('app.name'),
                    'meta_tags' => $meta->render(),
                ]);
            }

            return $this;
        });

    }
}
