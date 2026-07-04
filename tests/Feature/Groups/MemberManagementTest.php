<?php

use App\Models\Event;
use App\Models\Expense;
use App\Models\Group;
use App\Models\Member;
use App\Models\User;

beforeEach(function () {
    $this->owner = User::factory()->create();
    $this->memberUser = User::factory()->create();
    $this->joiner = User::factory()->create();

    $this->group = Group::factory()->create(['owner_id' => $this->owner->id]);
    $this->ownerMember = Member::factory()->for($this->group)->forUser($this->owner)->owner()->create();
    $this->member = Member::factory()->for($this->group)->forUser($this->memberUser)->create();
    $this->guest = Member::factory()->for($this->group)->create(['nickname' => 'Gus']);
});

// ---------------------------------------------------------------------------
// guests
// ---------------------------------------------------------------------------

test('the owner can add a guest member', function () {
    $this->actingAs($this->owner)
        ->post("/groups/{$this->group->uuid}/members", ['nickname' => 'Pipa'])
        ->assertRedirect();

    expect($this->group->members()->where('nickname', 'Pipa')->whereNull('user_id')->exists())->toBeTrue();
});

test('regular members cannot manage members', function () {
    $this->actingAs($this->memberUser)
        ->post("/groups/{$this->group->uuid}/members", ['nickname' => 'Pipa'])
        ->assertForbidden();

    $this->actingAs($this->memberUser)
        ->delete("/groups/{$this->group->uuid}/members/{$this->guest->uuid}")
        ->assertForbidden();
});

test('a guest without history is deleted outright', function () {
    $this->actingAs($this->owner)
        ->delete("/groups/{$this->group->uuid}/members/{$this->guest->uuid}")
        ->assertRedirect();

    expect(Member::find($this->guest->id))->toBeNull();
});

test('a member with financial history is deactivated, not deleted', function () {
    $event = Event::factory()->for($this->group)->create();
    $event->participants()->attach([$this->ownerMember->id, $this->guest->id]);

    Expense::factory()->for($event)->create(['payer_member_id' => $this->guest->id]);

    $this->actingAs($this->owner)
        ->delete("/groups/{$this->group->uuid}/members/{$this->guest->uuid}")
        ->assertRedirect();

    $this->guest->refresh();
    expect($this->guest->is_active)->toBeFalse();
});

test('the owner member cannot be removed or deactivated', function () {
    $this->actingAs($this->owner)
        ->delete("/groups/{$this->group->uuid}/members/{$this->ownerMember->uuid}")
        ->assertForbidden();

    $this->actingAs($this->owner)
        ->post("/groups/{$this->group->uuid}/members/{$this->ownerMember->uuid}", ['is_active' => false])
        ->assertForbidden();
});

test('members of another group are not found under this group', function () {
    $otherGroup = Group::factory()->create();
    $foreign = Member::factory()->for($otherGroup)->create();

    $this->actingAs($this->owner)
        ->delete("/groups/{$this->group->uuid}/members/{$foreign->uuid}")
        ->assertNotFound();
});

// ---------------------------------------------------------------------------
// invites
// ---------------------------------------------------------------------------

test('a user can join a group through the invite link', function () {
    $this->actingAs($this->joiner)
        ->post("/join/{$this->group->invite_code}")
        ->assertRedirect("/groups/{$this->group->uuid}");

    expect($this->group->members()->where('user_id', $this->joiner->id)->exists())->toBeTrue();
});

test('joining twice does not duplicate the member', function () {
    $this->actingAs($this->joiner)->post("/join/{$this->group->invite_code}");
    $this->actingAs($this->joiner)->post("/join/{$this->group->invite_code}");

    expect($this->group->members()->where('user_id', $this->joiner->id)->count())->toBe(1);
});

test('a deactivated member is reactivated on rejoin', function () {
    $this->member->update(['is_active' => false]);

    $this->actingAs($this->memberUser)
        ->post("/join/{$this->group->invite_code}")
        ->assertRedirect();

    expect($this->member->refresh()->is_active)->toBeTrue();
});

test('a joiner can claim a guest and inherit its history', function () {
    $this->actingAs($this->joiner)
        ->post("/join/{$this->group->invite_code}", ['member_uuid' => $this->guest->uuid])
        ->assertRedirect();

    $this->guest->refresh();
    expect($this->guest->user_id)->toBe($this->joiner->id);
    expect($this->group->members()->where('user_id', $this->joiner->id)->count())->toBe(1);
});

test('an already linked member cannot be claimed', function () {
    $this->actingAs($this->joiner)
        ->post("/join/{$this->group->invite_code}", ['member_uuid' => $this->member->uuid])
        ->assertSessionHasErrors('member_uuid');
});

test('an invalid invite code is not found', function () {
    $this->actingAs($this->joiner)
        ->get('/join/nope')
        ->assertNotFound();
});

// ---------------------------------------------------------------------------
// new members join the events still open
// ---------------------------------------------------------------------------

test('a joiner is added as participant to open events but not settled ones', function () {
    $open = Event::factory()->for($this->group)->create();
    $settled = Event::factory()->for($this->group)->create(['status' => Event::STATUS_SETTLED]);

    $this->actingAs($this->joiner)
        ->post("/join/{$this->group->invite_code}")
        ->assertRedirect();

    $member = $this->group->members()->where('user_id', $this->joiner->id)->first();

    expect($open->participants()->whereKey($member->id)->exists())->toBeTrue();
    expect($settled->participants()->whereKey($member->id)->exists())->toBeFalse();
});

test('a rejoining member is added to open events', function () {
    $open = Event::factory()->for($this->group)->create();
    $this->member->update(['is_active' => false]);

    $this->actingAs($this->memberUser)
        ->post("/join/{$this->group->invite_code}")
        ->assertRedirect();

    expect($open->participants()->whereKey($this->member->id)->exists())->toBeTrue();
});

test('a claimed guest is added to open events without duplicating existing participations', function () {
    $open = Event::factory()->for($this->group)->create();
    $open->participants()->attach($this->guest->id);

    $this->actingAs($this->joiner)
        ->post("/join/{$this->group->invite_code}", ['member_uuid' => $this->guest->uuid])
        ->assertRedirect();

    expect($open->participants()->whereKey($this->guest->id)->count())->toBe(1);
});

// ---------------------------------------------------------------------------
// leaving a group
// ---------------------------------------------------------------------------

test('a member without history is deleted when leaving', function () {
    $this->actingAs($this->memberUser)
        ->post("/groups/{$this->group->uuid}/leave")
        ->assertRedirect('/groups');

    expect(Member::find($this->member->id))->toBeNull();
});

test('a member with history is deactivated when leaving', function () {
    $event = Event::factory()->for($this->group)->create();
    $event->participants()->attach([$this->ownerMember->id, $this->member->id]);
    Expense::factory()->for($event)->create(['payer_member_id' => $this->member->id]);

    $this->actingAs($this->memberUser)
        ->post("/groups/{$this->group->uuid}/leave")
        ->assertRedirect('/groups');

    expect($this->member->refresh()->is_active)->toBeFalse();
});

test('the owner cannot leave their own group', function () {
    $this->actingAs($this->owner)
        ->post("/groups/{$this->group->uuid}/leave")
        ->assertForbidden();
});

test('a non-member cannot leave a group', function () {
    $this->actingAs($this->joiner)
        ->post("/groups/{$this->group->uuid}/leave")
        ->assertForbidden();
});

test('a new guest is added to open events', function () {
    $open = Event::factory()->for($this->group)->create();

    $this->actingAs($this->owner)
        ->post("/groups/{$this->group->uuid}/members", ['nickname' => 'Pipa'])
        ->assertRedirect();

    $member = $this->group->members()->where('nickname', 'Pipa')->first();

    expect($open->participants()->whereKey($member->id)->exists())->toBeTrue();
});

test('only the owner can regenerate the invite code', function () {
    $original = $this->group->invite_code;

    $this->actingAs($this->memberUser)
        ->post("/groups/{$this->group->uuid}/invite/regenerate")
        ->assertForbidden();

    $this->actingAs($this->owner)
        ->post("/groups/{$this->group->uuid}/invite/regenerate")
        ->assertRedirect();

    expect($this->group->refresh()->invite_code)->not->toBe($original);
});
