<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Group extends Model
{
    use HasFactory;
    use HasUuid;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'currency',
        'owner_id',
    ];

    protected static function booted(): void
    {
        static::creating(function (Group $group) {
            $group->invite_code ??= self::generateInviteCode();
        });
    }

    // ------------------------------------------------------------------------------
    // RELATIONS
    // ------------------------------------------------------------------------------

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function members(): HasMany
    {
        return $this->hasMany(Member::class);
    }

    public function activeMembers(): HasMany
    {
        return $this->members()->where('is_active', true);
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    // ------------------------------------------------------------------------------
    // METHODS
    // ------------------------------------------------------------------------------

    public function memberFor(User $user): ?Member
    {
        return $this->members->firstWhere('user_id', $user->id)
            ?? $this->members()->where('user_id', $user->id)->first();
    }

    public function hasActiveMember(User $user): bool
    {
        return $this->members()->where('user_id', $user->id)->where('is_active', true)->exists();
    }

    public function regenerateInviteCode(): void
    {
        $this->invite_code = self::generateInviteCode();
        $this->save();
    }

    private static function generateInviteCode(): string
    {
        do {
            $code = Str::random(12);
        } while (self::withTrashed()->where('invite_code', $code)->exists());

        return $code;
    }
}
