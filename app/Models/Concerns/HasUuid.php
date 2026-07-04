<?php

namespace App\Models\Concerns;

use Illuminate\Support\Str;

/**
 * Generates a uuid on create and binds routes by it so public URLs
 * never expose the numeric id.
 */
trait HasUuid
{
    protected static function bootHasUuid(): void
    {
        static::creating(function ($model) {
            $model->uuid ??= (string) Str::uuid();
        });
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }
}
