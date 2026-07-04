<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * A person inside a group. Linked to a User account or a plain guest
 * (user_id null). All financial records reference members, never users,
 * so guests and departed users keep their history.
 */
class Member extends Model
{
    use HasFactory;
    use HasUuid;

    public const ROLE_OWNER = 'owner';

    public const ROLE_MEMBER = 'member';

    protected $fillable = [
        'group_id',
        'user_id',
        'nickname',
        'role',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    // ------------------------------------------------------------------------------
    // RELATIONS
    // ------------------------------------------------------------------------------

    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function paidExpenses(): HasMany
    {
        return $this->hasMany(Expense::class, 'payer_member_id');
    }

    public function shares(): HasMany
    {
        return $this->hasMany(ExpenseShare::class);
    }

    // ------------------------------------------------------------------------------
    // ATTRIBUTES
    // ------------------------------------------------------------------------------

    protected function displayName(): Attribute
    {
        return Attribute::make(get: fn () => $this->nickname ?? $this->user?->name ?? '?');
    }

    protected function isGuest(): Attribute
    {
        return Attribute::make(get: fn () => $this->user_id === null);
    }

    // ------------------------------------------------------------------------------
    // METHODS
    // ------------------------------------------------------------------------------

    // members with money history must never be hard-deleted, only deactivated
    public function hasFinancialHistory(): bool
    {
        return $this->paidExpenses()->exists()
            || $this->shares()->exists()
            || Settlement::where('from_member_id', $this->id)->orWhere('to_member_id', $this->id)->exists();
    }

    // someone who arrives mid-group becomes a participant of every event
    // still being settled; settled events keep their original participants
    public function joinOpenEvents(): void
    {
        $this->group->events()
            ->where('status', Event::STATUS_OPEN)
            ->get()
            ->each(fn (Event $event) => $event->participants()->syncWithoutDetaching($this->id));
    }
}
