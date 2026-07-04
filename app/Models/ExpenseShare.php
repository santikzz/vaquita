<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExpenseShare extends Model
{
    use HasFactory;

    protected $fillable = [
        'expense_id',
        'member_id',
        'amount_minor',
        'share_units',
    ];

    protected function casts(): array
    {
        return [
            'amount_minor' => 'integer',
            'share_units' => 'integer',
        ];
    }

    // ------------------------------------------------------------------------------
    // RELATIONS
    // ------------------------------------------------------------------------------

    public function expense(): BelongsTo
    {
        return $this->belongsTo(Expense::class);
    }

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }
}
