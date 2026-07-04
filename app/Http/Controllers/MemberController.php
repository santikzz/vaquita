<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Member;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    public function store(Request $request, Group $group)
    {
        $this->authorize('manageMembers', $group);

        $validated = $request->validate([
            'nickname' => ['required', 'string', 'max:50'],
        ]);

        $member = $group->members()->create([
            'nickname' => $validated['nickname'],
        ]);
        $member->joinOpenEvents();

        return back()->with('success', 'toast:member_added');
    }

    public function update(Request $request, Group $group, Member $member)
    {
        $this->authorize('manageMembers', $group);

        $validated = $request->validate([
            // guests always need a nickname; for linked users it is an optional override
            'nickname' => [$member->is_guest ? 'required' : 'nullable', 'string', 'max:50'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        if (array_key_exists('is_active', $validated)
            && $validated['is_active'] === false
            && $member->role === Member::ROLE_OWNER) {
            abort(403, 'The group owner cannot be deactivated.');
        }

        if (array_key_exists('nickname', $validated)) {
            $member->nickname = $validated['nickname'];
        }
        if (array_key_exists('is_active', $validated)) {
            $member->is_active = (bool) $validated['is_active'];
        }
        $member->save();

        return back()->with('success', 'toast:member_updated');
    }

    public function leave(Request $request, Group $group)
    {
        $this->authorize('leave', $group);

        $member = $group->memberFor($request->user());

        // same rule as removal: keep the row if money already references it
        if ($member->hasFinancialHistory()) {
            $member->update(['is_active' => false]);
        } else {
            $member->delete();
        }

        return redirect()->route('groups.index')->with('success', 'toast:group_left');
    }

    public function destroy(Group $group, Member $member)
    {
        $this->authorize('manageMembers', $group);

        if ($member->role === Member::ROLE_OWNER) {
            abort(403, 'The group owner cannot be removed.');
        }

        // members with money history are deactivated, never deleted,
        // so past balances stay intact
        if ($member->hasFinancialHistory()) {
            $member->update(['is_active' => false]);

            return back()->with('success', 'toast:member_deactivated');
        }

        $member->delete();

        return back()->with('success', 'toast:member_removed');
    }
}
