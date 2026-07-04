<?php

namespace App\Models;

use App\Models\Concerns\HasMediaAssets;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Http\UploadedFile;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory;
    use HasMediaAssets;
    use HasRoles;
    use Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'payment_alias',
        'provider',
        'provider_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'provider',
        'provider_id',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            $user->uuid ??= (string) Str::uuid();
        });

        static::deleting(function ($user) {
            $user->deleteAllMedia();
        });
    }

    // bind route models by uuid so public URLs never expose the numeric id.
    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    // ------------------------------------------------------------------------------
    // ATTRIBUTES
    // ------------------------------------------------------------------------------

    // column stores the raw path; expose the resolved URL on read via the media disk.
    protected function avatar(): Attribute
    {
        return Attribute::make(get: fn ($value) => mediaUrl($value));
    }

    // ------------------------------------------------------------------------------
    // METHODS
    // ------------------------------------------------------------------------------

    public function mediaDir(): string
    {
        return "avatar/{$this->uuid}";
    }

    public function setAvatar(UploadedFile $file): void
    {
        $this->replaceMedia('avatar', $file);
    }

    public function deleteAvatar(): void
    {
        $this->deleteMedia('avatar');
    }
}
