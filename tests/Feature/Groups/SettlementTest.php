<?php

use App\Models\Event;
use App\Models\Group;
use App\Models\Member;
use App\Models\Settlement;
use App\Models\User;
use App\Services\BalanceService;

beforeEach(function () {
    $this->owner = User::factory()->create();
    $this->memberUser = User::factory()->create();

    $this->group = Group::factory()->create(['owner_id' => $this->owner->id]);
    $this->ownerMember = Member::factory()->for($this->group)->forUser($this->owner)->owner()->create();
    $this->member = Member::factory()->for($this->group)->forUser($this->memberUser)->create();

    $this->event = Event::factory()->for($this->group)->create();
    $this->event->participants()->attach([$this->ownerMember->id, $this->member->id]);

    $this->eventUrl = "/groups/{$this->group->uuid}/events/{$this->event->uuid}";

    // owner pays 1000, split equally: member owes owner 500
    $this->actingAs($this->owner)->post("{$this->eventUrl}/expenses", [
        'description' => 'Carne',
        'amount_minor' => 1000,
        'split_method' => 'equal',
        'spent_at' => '2026-07-04',
        'payer_member' => $this->ownerMember->uuid,
        'splits' => [
            ['member' => $this->ownerMember->uuid],
            ['member' => $this->member->uuid],
        ],
    ]);
});

// ---------------------------------------------------------------------------
// balances
// ---------------------------------------------------------------------------

test('balances reflect who paid and who owes', function () {
    $balances = app(BalanceService::class)->balances($this->event);

    expect($balances[$this->ownerMember->id])->toBe(500);
    expect($balances[$this->member->id])->toBe(-500);
});

test('suggested transfers settle the event exactly', function () {
    $service = app(BalanceService::class);
    $transfers = $service->suggestTransfers($service->balances($this->event));

    expect($transfers)->toBe([
        ['from_member_id' => $this->member->id, 'to_member_id' => $this->ownerMember->id, 'amount_minor' => 500],
    ]);
});

// ---------------------------------------------------------------------------
// settlements
// ---------------------------------------------------------------------------

test('recording the settling payment closes the event', function () {
    $this->actingAs($this->memberUser)
        ->post("{$this->eventUrl}/settlements", [
            'from_member' => $this->member->uuid,
            'to_member' => $this->ownerMember->uuid,
            'amount_minor' => 500,
        ])
        ->assertRedirect();

    expect($this->event->refresh()->status)->toBe(Event::STATUS_SETTLED);

    $balances = app(BalanceService::class)->balances($this->event);
    expect(array_filter($balances))->toBe([]);
});

test('a partial settlement keeps the event open', function () {
    $this->actingAs($this->memberUser)->post("{$this->eventUrl}/settlements", [
        'from_member' => $this->member->uuid,
        'to_member' => $this->ownerMember->uuid,
        'amount_minor' => 200,
    ]);

    expect($this->event->refresh()->status)->toBe(Event::STATUS_OPEN);
});

test('a new expense reopens a settled event', function () {
    $this->actingAs($this->memberUser)->post("{$this->eventUrl}/settlements", [
        'from_member' => $this->member->uuid,
        'to_member' => $this->ownerMember->uuid,
        'amount_minor' => 500,
    ]);

    expect($this->event->refresh()->status)->toBe(Event::STATUS_SETTLED);

    $this->actingAs($this->memberUser)->post("{$this->eventUrl}/expenses", [
        'description' => 'Helado',
        'amount_minor' => 600,
        'split_method' => 'equal',
        'spent_at' => '2026-07-04',
        'payer_member' => $this->member->uuid,
        'splits' => [
            ['member' => $this->ownerMember->uuid],
            ['member' => $this->member->uuid],
        ],
    ]);

    expect($this->event->refresh()->status)->toBe(Event::STATUS_OPEN);
});

test('deleting a settlement reopens the event', function () {
    $this->actingAs($this->memberUser)->post("{$this->eventUrl}/settlements", [
        'from_member' => $this->member->uuid,
        'to_member' => $this->ownerMember->uuid,
        'amount_minor' => 500,
    ]);

    $settlement = Settlement::first();

    $this->actingAs($this->memberUser)
        ->delete("{$this->eventUrl}/settlements/{$settlement->uuid}")
        ->assertRedirect();

    expect(Settlement::count())->toBe(0);
    expect($this->event->refresh()->status)->toBe(Event::STATUS_OPEN);
});

// ---------------------------------------------------------------------------
// validation
// ---------------------------------------------------------------------------

test('a settlement cannot pay yourself', function () {
    $this->actingAs($this->memberUser)
        ->post("{$this->eventUrl}/settlements", [
            'from_member' => $this->member->uuid,
            'to_member' => $this->member->uuid,
            'amount_minor' => 500,
        ])
        ->assertSessionHasErrors('to_member');
});

test('settlement members must participate in the event', function () {
    $stranger = Member::factory()->for($this->group)->create();

    $this->actingAs($this->memberUser)
        ->post("{$this->eventUrl}/settlements", [
            'from_member' => $stranger->uuid,
            'to_member' => $this->ownerMember->uuid,
            'amount_minor' => 500,
        ])
        ->assertSessionHasErrors('from_member');
});

test('outsiders cannot record settlements', function () {
    $outsider = User::factory()->create();

    $this->actingAs($outsider)
        ->post("{$this->eventUrl}/settlements", [
            'from_member' => $this->member->uuid,
            'to_member' => $this->ownerMember->uuid,
            'amount_minor' => 500,
        ])
        ->assertForbidden();
});
