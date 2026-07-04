<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Settlement extends Model
{
    use HasFactory;
    use HasUuid;

    protected $fillable = [
        'event_id',
        'from_member_id',
        'to_member_id',
        'amount_minor',
        'note',
        'settled_at',
    ];

    protected function casts(): array
    {
        return [
            'amount_minor' => 'integer',
            'settled_at' => 'date',
        ];
    }

    // ------------------------------------------------------------------------------
    // RELATIONS
    // ------------------------------------------------------------------------------

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function fromMember(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'from_member_id');
    }

    public function toMember(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'to_member_id');
    }
}
