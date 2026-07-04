<?php

use App\Models\Event;
use App\Models\Expense;
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
    $this->guest = Member::factory()->for($this->group)->create(['nickname' => 'Gus']);
});

// ---------------------------------------------------------------------------
// create
// ---------------------------------------------------------------------------

test('a member can create an event picking the participants', function () {
    $this->actingAs($this->memberUser)
        ->post("/groups/{$this->group->uuid}/events", [
            'name' => 'Cena de viernes',
            'event_date' => '2026-07-10',
            'participants' => [$this->member->uuid, $this->guest->uuid],
        ])
        ->assertRedirect();

    $event = $this->group->events()->first();

    expect($event->name)->toBe('Cena de viernes');
    expect($event->participants)->toHaveCount(2);
    expect($event->creator->id)->toBe($this->member->id);
});

test('non-members cannot create events', function () {
    $this->actingAs($this->outsider)
        ->post("/groups/{$this->group->uuid}/events", [
            'name' => 'Nope',
            'event_date' => '2026-07-10',
            'participants' => [$this->guest->uuid],
        ])
        ->assertForbidden();
});

test('participants must be active members of the group', function () {
    $foreign = Member::factory()->create();

    $this->actingAs($this->memberUser)
        ->post("/groups/{$this->group->uuid}/events", [
            'name' => 'Cena',
            'event_date' => '2026-07-10',
            'participants' => [$this->member->uuid, $foreign->uuid],
        ])
        ->assertSessionHasErrors('participants');
});

test('event creation validates required fields', function () {
    $this->actingAs($this->memberUser)
        ->post("/groups/{$this->group->uuid}/events", [
            'name' => '',
            'event_date' => 'not-a-date',
            'participants' => [],
        ])
        ->assertSessionHasErrors(['name', 'event_date', 'participants']);
});

// ---------------------------------------------------------------------------
// view
// ---------------------------------------------------------------------------

test('members can view an event, outsiders cannot', function () {
    $event = Event::factory()->for($this->group)->create();
    $event->participants()->attach($this->member->id);

    $this->actingAs($this->memberUser)
        ->get("/groups/{$this->group->uuid}/events/{$event->uuid}")
        ->assertOk();

    $this->actingAs($this->outsider)
        ->get("/groups/{$this->group->uuid}/events/{$event->uuid}")
        ->assertForbidden();
});

test('an event is scoped to its group', function () {
    $otherGroup = Group::factory()->create(['owner_id' => $this->owner->id]);
    Member::factory()->for($otherGroup)->forUser($this->owner)->owner()->create();
    $foreignEvent = Event::factory()->for($otherGroup)->create();

    $this->actingAs($this->owner)
        ->get("/groups/{$this->group->uuid}/events/{$foreignEvent->uuid}")
        ->assertNotFound();
});

// ---------------------------------------------------------------------------
// update
// ---------------------------------------------------------------------------

test('the creator can update the event and its participants', function () {
    $event = Event::factory()->for($this->group)->create(['created_by' => $this->member->id]);
    $event->participants()->attach([$this->member->id, $this->guest->id]);

    $this->actingAs($this->memberUser)
        ->post("/groups/{$this->group->uuid}/events/{$event->uuid}", [
            'name' => 'Renombrada',
            'event_date' => '2026-07-11',
            'participants' => [$this->member->uuid],
        ])
        ->assertRedirect();

    $event->refresh();
    expect($event->name)->toBe('Renombrada');
    expect($event->participants)->toHaveCount(1);
});

test('members that are not the creator nor the owner cannot update the event', function () {
    $event = Event::factory()->for($this->group)->create(['created_by' => $this->ownerMember->id]);
    $event->participants()->attach($this->member->id);

    $this->actingAs($this->memberUser)
        ->post("/groups/{$this->group->uuid}/events/{$event->uuid}", [
            'name' => 'Hackeada',
            'event_date' => '2026-07-11',
            'participants' => [$this->member->uuid],
        ])
        ->assertForbidden();
});

test('a participant with expenses cannot be removed from the event', function () {
    $event = Event::factory()->for($this->group)->create(['created_by' => $this->member->id]);
    $event->participants()->attach([$this->member->id, $this->guest->id]);

    Expense::factory()->for($event)->create(['payer_member_id' => $this->guest->id]);

    $this->actingAs($this->memberUser)
        ->post("/groups/{$this->group->uuid}/events/{$event->uuid}", [
            'name' => $event->name,
            'event_date' => '2026-07-11',
            'participants' => [$this->member->uuid],
        ])
        ->assertSessionHasErrors('participants');
});

// ---------------------------------------------------------------------------
// delete
// ---------------------------------------------------------------------------

test('the group owner can delete any event', function () {
    $event = Event::factory()->for($this->group)->create(['created_by' => $this->member->id]);

    $this->actingAs($this->owner)
        ->delete("/groups/{$this->group->uuid}/events/{$event->uuid}")
        ->assertRedirect("/groups/{$this->group->uuid}");

    expect(Event::find($event->id))->toBeNull();
});

test('regular members cannot delete events they did not create', function () {
    $event = Event::factory()->for($this->group)->create(['created_by' => $this->ownerMember->id]);

    $this->actingAs($this->memberUser)
        ->delete("/groups/{$this->group->uuid}/events/{$event->uuid}")
        ->assertForbidden();
});

// ---------------------------------------------------------------------------
// ordering
// ---------------------------------------------------------------------------

test('the group page lists events most recent first, newest created breaking ties', function () {
    $old = Event::factory()->for($this->group)->create(['event_date' => '2026-07-01']);
    $todayFirst = Event::factory()->for($this->group)->create(['event_date' => '2026-07-04']);
    $todaySecond = Event::factory()->for($this->group)->create(['event_date' => '2026-07-04']);

    $response = $this->actingAs($this->owner)->get("/groups/{$this->group->uuid}")->assertOk();

    $uuids = collect($response->viewData('page')['props']['events'])->pluck('uuid')->all();

    expect($uuids)->toBe([$todaySecond->uuid, $todayFirst->uuid, $old->uuid]);
});
