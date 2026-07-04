<?php

namespace App\Http\Traits;

use App\Models\Member;

trait PresentsMembers
{
    private function presentMember(Member $member): array
    {
        return [
            'uuid' => $member->uuid,
            'display_name' => $member->display_name,
            'avatar' => $member->user?->avatar,
            'payment_alias' => $member->user?->payment_alias,
            'is_guest' => $member->is_guest,
            'is_active' => $member->is_active,
            'is_me' => $member->user_id !== null && $member->user_id === auth()->id(),
            'role' => $member->role,
        ];
    }
}
