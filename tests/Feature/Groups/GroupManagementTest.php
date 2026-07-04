<?php

use App\Models\Event;
use App\Models\Group;
use App\Models\Member;
use App\Models\User;

beforeEach(function () {
    // pages are rendered without built assets in tests
    $this->withoutVite();

    $this->owner = User::factory()->create();
    $this->memberUser = User::factory()->create();
    $this->outsider = User::factory()->create();

    $this->group = Group::factory()->create(['owner_id' => $this->owner->id]);
    $this->ownerMember = Member::factory()->for($this->group)->forUser($this->owner)->owner()->create();
    $this->member = Member::factory()->for($this->group)->forUser($this->memberUser)->create();
});

// ---------------------------------------------------------------------------
// access control
// ---------------------------------------------------------------------------

test('guests are redirected to login', function () {
    $this->get('/groups')->assertRedirect('/login');
    $this->get("/groups/{$this->group->uuid}")->assertRedirect('/login');
});

test('non-members cannot view a group', function () {
    $this->actingAs($this->outsider)
        ->get("/groups/{$this->group->uuid}")
        ->assertForbidden();
});

test('members can view a group', function () {
    $this->actingAs($this->memberUser)
        ->get("/groups/{$this->group->uuid}")
        ->assertOk();
});

test('deactivated members cannot view a group', function () {
    $this->member->update(['is_active' => false]);

    $this->actingAs($this->memberUser)
        ->get("/groups/{$this->group->uuid}")
        ->assertForbidden();
});

// ---------------------------------------------------------------------------
// create
// ---------------------------------------------------------------------------

test('creating a group also creates the owner member', function () {
    $this->actingAs($this->outsider)
        ->post('/groups', ['name' => 'Los Pibes', 'currency' => 'ars'])
        ->assertRedirect();

    $group = Group::where('name', 'Los Pibes')->first();

    expect($group)->not->toBeNull();
    expect($group->currency)->toBe('ARS');
    expect($group->invite_code)->not->toBeEmpty();

    $member = $group->members()->first();
    expect($member->user_id)->toBe($this->outsider->id);
    expect($member->role)->toBe(Member::ROLE_OWNER);
});

test('store validates name and currency', function () {
    $this->actingAs($this->outsider)
        ->post('/groups', ['name' => '', 'currency' => 'PESOS'])
        ->assertSessionHasErrors(['name', 'currency']);
});

// ---------------------------------------------------------------------------
// update / delete
// ---------------------------------------------------------------------------

test('only the owner can update the group', function () {
    $this->actingAs($this->memberUser)
        ->post("/groups/{$this->group->uuid}", ['name' => 'Hacked', 'currency' => 'USD'])
        ->assertForbidden();

    $this->actingAs($this->owner)
        ->post("/groups/{$this->group->uuid}", ['name' => 'Renamed', 'currency' => 'USD'])
        ->assertRedirect();

    $this->group->refresh();
    expect($this->group->name)->toBe('Renamed');
    expect($this->group->currency)->toBe('USD');
});

test('only the owner can delete the group', function () {
    $this->actingAs($this->memberUser)
        ->delete("/groups/{$this->group->uuid}")
        ->assertForbidden();

    $this->actingAs($this->owner)
        ->delete("/groups/{$this->group->uuid}")
        ->assertRedirect('/groups');

    expect(Group::find($this->group->id))->toBeNull();
    expect(Group::withTrashed()->find($this->group->id))->not->toBeNull();
});

// ---------------------------------------------------------------------------
// quick split
// ---------------------------------------------------------------------------

test('quick split creates group, guests and a first event in one shot', function () {
    $this->actingAs($this->outsider)
        ->post('/groups/quick', [
            'name' => 'Asado',
            'currency' => 'ARS',
            'guests' => ['Juan', 'Sofi', 'Marto'],
            'event_name' => 'Asado del sabado',
        ])
        ->assertRedirect();

    $group = Group::where('name', 'Asado')->first();

    expect($group->members)->toHaveCount(4); // owner + 3 guests
    expect($group->members()->whereNull('user_id')->count())->toBe(3);

    $event = $group->events()->first();
    expect($event->name)->toBe('Asado del sabado');
    expect($event->status)->toBe(Event::STATUS_OPEN);
    expect($event->participants)->toHaveCount(4);
});

test('quick split can exclude the creator from the participants', function () {
    $this->actingAs($this->outsider)
        ->post('/groups/quick', [
            'name' => 'Sin mi',
            'currency' => 'ARS',
            'guests' => ['Juan', 'Sofi'],
            'event_name' => 'Cena',
            'include_me' => false,
        ])
        ->assertRedirect();

    $event = Group::where('name', 'Sin mi')->first()->events()->first();

    expect($event->participants)->toHaveCount(2);
    expect($event->participants->every(fn ($member) => $member->user_id === null))->toBeTrue();
});

test('quick split requires at least one guest', function () {
    $this->actingAs($this->outsider)
        ->post('/groups/quick', [
            'name' => 'Solo',
            'currency' => 'ARS',
            'guests' => [],
            'event_name' => 'Nada',
        ])
        ->assertSessionHasErrors('guests');
});
