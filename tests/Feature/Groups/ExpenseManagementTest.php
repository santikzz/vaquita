<?php

use App\Models\Event;
use App\Models\Expense;
use App\Models\ExpenseShare;
use App\Models\Group;
use App\Models\Member;
use App\Models\User;

beforeEach(function () {
    $this->owner = User::factory()->create();
    $this->memberUser = User::factory()->create();

    $this->group = Group::factory()->create(['owner_id' => $this->owner->id]);
    $this->ownerMember = Member::factory()->for($this->group)->forUser($this->owner)->owner()->create();
    $this->member = Member::factory()->for($this->group)->forUser($this->memberUser)->create();
    $this->guest = Member::factory()->for($this->group)->create(['nickname' => 'Gus']);

    $this->event = Event::factory()->for($this->group)->create();
    $this->event->participants()->attach([$this->ownerMember->id, $this->member->id, $this->guest->id]);

    $this->url = "/groups/{$this->group->uuid}/events/{$this->event->uuid}/expenses";
});

// ---------------------------------------------------------------------------
// create
// ---------------------------------------------------------------------------

test('a participant can add an equal split expense', function () {
    $this->actingAs($this->memberUser)
        ->post($this->url, [
            'description' => 'Carne',
            'amount_minor' => 10000,
            'split_method' => 'equal',
            'spent_at' => '2026-07-04',
            'payer_member' => $this->member->uuid,
            'splits' => [
                ['member' => $this->ownerMember->uuid],
                ['member' => $this->member->uuid],
                ['member' => $this->guest->uuid],
            ],
        ])
        ->assertRedirect();

    $expense = Expense::first();

    expect($expense->amount_minor)->toBe(10000);
    expect($expense->shares)->toHaveCount(3);
    expect($expense->shares->sum('amount_minor'))->toBe(10000);
    expect($expense->shares->firstWhere('member_id', $this->ownerMember->id)->amount_minor)->toBe(3334);
});

test('an amounts split stores the exact amounts', function () {
    $this->actingAs($this->memberUser)
        ->post($this->url, [
            'description' => 'Bebidas',
            'amount_minor' => 5000,
            'split_method' => 'amounts',
            'spent_at' => '2026-07-04',
            'payer_member' => $this->member->uuid,
            'splits' => [
                ['member' => $this->member->uuid, 'amount_minor' => 4000],
                ['member' => $this->guest->uuid, 'amount_minor' => 1000],
            ],
        ])
        ->assertRedirect();

    $expense = Expense::first();
    expect($expense->shares->firstWhere('member_id', $this->member->id)->amount_minor)->toBe(4000);
});

test('an amounts split that does not sum to the total is rejected', function () {
    $this->actingAs($this->memberUser)
        ->post($this->url, [
            'description' => 'Bebidas',
            'amount_minor' => 5000,
            'split_method' => 'amounts',
            'spent_at' => '2026-07-04',
            'payer_member' => $this->member->uuid,
            'splits' => [
                ['member' => $this->member->uuid, 'amount_minor' => 4000],
                ['member' => $this->guest->uuid, 'amount_minor' => 500],
            ],
        ])
        ->assertSessionHasErrors('splits');

    expect(Expense::count())->toBe(0);
});

test('a shares split weighs members by units', function () {
    $this->actingAs($this->memberUser)
        ->post($this->url, [
            'description' => 'Alquiler cabana',
            'amount_minor' => 12000,
            'split_method' => 'shares',
            'spent_at' => '2026-07-04',
            'payer_member' => $this->member->uuid,
            'splits' => [
                ['member' => $this->member->uuid, 'units' => 2],
                ['member' => $this->guest->uuid, 'units' => 1],
            ],
        ])
        ->assertRedirect();

    $expense = Expense::first();
    expect($expense->shares->firstWhere('member_id', $this->member->id)->amount_minor)->toBe(8000);
    expect($expense->shares->firstWhere('member_id', $this->member->id)->share_units)->toBe(2);
});

test('the payer must participate in the event', function () {
    $nonParticipant = Member::factory()->for($this->group)->create();

    $this->actingAs($this->memberUser)
        ->post($this->url, [
            'description' => 'Carne',
            'amount_minor' => 1000,
            'split_method' => 'equal',
            'spent_at' => '2026-07-04',
            'payer_member' => $nonParticipant->uuid,
            'splits' => [['member' => $this->member->uuid]],
        ])
        ->assertSessionHasErrors('payer_member');
});

test('split members must participate in the event', function () {
    $nonParticipant = Member::factory()->for($this->group)->create();

    $this->actingAs($this->memberUser)
        ->post($this->url, [
            'description' => 'Carne',
            'amount_minor' => 1000,
            'split_method' => 'equal',
            'spent_at' => '2026-07-04',
            'payer_member' => $this->member->uuid,
            'splits' => [['member' => $nonParticipant->uuid]],
        ])
        ->assertSessionHasErrors('splits');
});

test('expense validation rejects bad input', function () {
    $this->actingAs($this->memberUser)
        ->post($this->url, [
            'description' => '',
            'amount_minor' => 0,
            'split_method' => 'percentages',
            'spent_at' => 'nope',
            'payer_member' => '',
            'splits' => [],
        ])
        ->assertSessionHasErrors(['description', 'amount_minor', 'split_method', 'spent_at', 'payer_member', 'splits']);
});

test('group members that do not participate in the event cannot add expenses', function () {
    $otherUser = User::factory()->create();
    Member::factory()->for($this->group)->forUser($otherUser)->create();

    $this->actingAs($otherUser)
        ->post($this->url, [
            'description' => 'Carne',
            'amount_minor' => 1000,
            'split_method' => 'equal',
            'spent_at' => '2026-07-04',
            'payer_member' => $this->member->uuid,
            'splits' => [['member' => $this->member->uuid]],
        ])
        ->assertForbidden();
});

// ---------------------------------------------------------------------------
// update / delete
// ---------------------------------------------------------------------------

test('updating an expense recomputes its shares', function () {
    $this->actingAs($this->memberUser)->post($this->url, [
        'description' => 'Carne',
        'amount_minor' => 9000,
        'split_method' => 'equal',
        'spent_at' => '2026-07-04',
        'payer_member' => $this->member->uuid,
        'splits' => [
            ['member' => $this->member->uuid],
            ['member' => $this->guest->uuid],
            ['member' => $this->ownerMember->uuid],
        ],
    ]);

    $expense = Expense::first();

    $this->actingAs($this->memberUser)
        ->post("{$this->url}/{$expense->uuid}", [
            'description' => 'Carne y carbon',
            'amount_minor' => 10000,
            'split_method' => 'equal',
            'spent_at' => '2026-07-04',
            'payer_member' => $this->member->uuid,
            'splits' => [
                ['member' => $this->member->uuid],
                ['member' => $this->guest->uuid],
            ],
        ])
        ->assertRedirect();

    $expense->refresh();
    expect($expense->amount_minor)->toBe(10000);
    expect($expense->shares)->toHaveCount(2);
    expect($expense->shares->sum('amount_minor'))->toBe(10000);
});

test('only the payer or the owner can edit a user expense', function () {
    $this->actingAs($this->owner)->post($this->url, [
        'description' => 'Del owner',
        'amount_minor' => 1000,
        'split_method' => 'equal',
        'spent_at' => '2026-07-04',
        'payer_member' => $this->ownerMember->uuid,
        'splits' => [['member' => $this->ownerMember->uuid]],
    ]);

    $expense = Expense::first();

    $this->actingAs($this->memberUser)
        ->delete("{$this->url}/{$expense->uuid}")
        ->assertForbidden();

    $this->actingAs($this->owner)
        ->delete("{$this->url}/{$expense->uuid}")
        ->assertRedirect("/groups/{$this->group->uuid}/events/{$this->event->uuid}");

    expect(Expense::count())->toBe(0);
});

test('guest expenses can be edited by any participant', function () {
    $this->actingAs($this->owner)->post($this->url, [
        'description' => 'Del guest',
        'amount_minor' => 1000,
        'split_method' => 'equal',
        'spent_at' => '2026-07-04',
        'payer_member' => $this->guest->uuid,
        'splits' => [['member' => $this->guest->uuid]],
    ]);

    $expense = Expense::first();

    $this->actingAs($this->memberUser)
        ->delete("{$this->url}/{$expense->uuid}")
        ->assertRedirect();

    expect(Expense::count())->toBe(0);
});

test('deleting an expense also deletes its shares', function () {
    $this->actingAs($this->memberUser)->post($this->url, [
        'description' => 'Carne',
        'amount_minor' => 3000,
        'split_method' => 'equal',
        'spent_at' => '2026-07-04',
        'payer_member' => $this->member->uuid,
        'splits' => [['member' => $this->member->uuid], ['member' => $this->guest->uuid]],
    ]);

    $expense = Expense::first();
    expect($expense->shares)->toHaveCount(2);

    $this->actingAs($this->memberUser)->delete("{$this->url}/{$expense->uuid}");

    expect(Expense::count())->toBe(0);
    expect(ExpenseShare::count())->toBe(0);
});
