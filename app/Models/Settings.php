<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Settings extends Model
{
    protected $fillable = ['key', 'value', 'type'];

    protected static function booted()
    {
        static::saved(fn ($setting) => Cache::forget('setting.'.$setting->key));
        static::deleted(fn ($setting) => Cache::forget('setting.'.$setting->key));
    }

    public static function get(string $key, $default = null)
    {
        return Cache::rememberForever('setting.'.$key, function () use ($key, $default) {
            $setting = self::where('key', $key)->first();

            if (! $setting) {
                return $default;
            }

            return match ($setting->type) {
                'integer' => (int) $setting->value,
                'decimal' => (float) $setting->value,
                'boolean' => filter_var($setting->value, FILTER_VALIDATE_BOOLEAN),
                default => $setting->value,
            };
        });
    }

    public static function set(string $key, $value, string $type = 'string')
    {
        return self::updateOrCreate(
            ['key' => $key],
            ['value' => $value, 'type' => $type]
        );
    }
}
