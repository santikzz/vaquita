<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Expense extends Model
{
    use HasFactory;
    use HasUuid;

    protected $fillable = [
        'event_id',
        'payer_member_id',
        'description',
        'amount_minor',
        'split_method',
        'spent_at',
    ];

    protected function casts(): array
    {
        return [
            'amount_minor' => 'integer',
            'spent_at' => 'date',
        ];
    }

    // ------------------------------------------------------------------------------
    // RELATIONS
    // ------------------------------------------------------------------------------

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function payer(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'payer_member_id');
    }

    public function shares(): HasMany
    {
        return $this->hasMany(ExpenseShare::class);
    }
}
