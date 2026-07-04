<?php

namespace App\Http\Controllers;

use App\Http\Traits\PresentsMembers;
use App\Models\Group;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

/**
 * Join-by-link flow. Anyone with the invite code can join; a joiner may
 * "claim" an existing guest member so the guest's history becomes theirs.
 */
class GroupInviteController extends Controller
{
    use PresentsMembers;

    public function regenerate(Group $group)
    {
        $this->authorize('regenerateInvite', $group);

        $group->regenerateInviteCode();

        return back()->with('success', 'toast:invite_regenerated');
    }

    public function show(Request $request, string $code)
    {
        $group = Group::where('invite_code', $code)->firstOrFail();

        if ($group->hasActiveMember($request->user())) {
            return redirect()->route('groups.show', $group);
        }

        $group->load('activeMembers.user');

        return Inertia::render('groups/join', [
            'code' => $code,
            'group' => [
                'name' => $group->name,
                'currency' => $group->currency,
                'members' => $group->activeMembers->map(fn (Member $member) => $this->presentMember($member)),
            ],
            // unclaimed guests the joiner can identify as
            'claimable' => $group->activeMembers
                ->filter(fn (Member $member) => $member->is_guest)
                ->values()
                ->map(fn (Member $member) => $this->presentMember($member)),
        ]);
    }

    public function store(Request $request, string $code)
    {
        $group = Group::where('invite_code', $code)->firstOrFail();
        $user = $request->user();

        $existing = $group->memberFor($user);

        if ($existing) {
            $existing->update(['is_active' => true]);
            $existing->joinOpenEvents();

            return redirect()->route('groups.show', $group)->with('success', 'toast:group_joined');
        }

        $validated = $request->validate([
            'member_uuid' => ['nullable', 'string'],
        ]);

        if (! empty($validated['member_uuid'])) {
            $guest = $group->members()
                ->where('uuid', $validated['member_uuid'])
                ->whereNull('user_id')
                ->first();

            if (! $guest) {
                throw ValidationException::withMessages([
                    'member_uuid' => 'This guest can no longer be claimed.',
                ]);
            }

            $guest->update(['user_id' => $user->id, 'is_active' => true]);
            $guest->joinOpenEvents();

            return redirect()->route('groups.show', $group)->with('success', 'toast:group_joined');
        }

        $member = $group->members()->create(['user_id' => $user->id]);
        $member->joinOpenEvents();

        return redirect()->route('groups.show', $group)->with('success', 'toast:group_joined');
    }
}
