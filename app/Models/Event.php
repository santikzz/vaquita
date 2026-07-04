<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    use HasFactory;
    use HasUuid;

    public const STATUS_OPEN = 'open';

    public const STATUS_SETTLED = 'settled';

    protected $fillable = [
        'group_id',
        'name',
        'event_date',
        'status',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'date',
        ];
    }

    // ------------------------------------------------------------------------------
    // RELATIONS
    // ------------------------------------------------------------------------------

    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'created_by');
    }

    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(Member::class, 'event_member');
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }

    public function settlements(): HasMany
    {
        return $this->hasMany(Settlement::class);
    }
}
