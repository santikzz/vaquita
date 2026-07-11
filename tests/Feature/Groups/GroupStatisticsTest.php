<?php

use App\Models\Event;
use App\Models\Expense;
use App\Models\Group;
use App\Models\Member;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();

    $this->owner = User::factory()->create();
    $this->memberUser = User::factory()->create();
    $this->outsider = User::factory()->create();

    $this->group = Group::factory()->create(['owner_id' => $this->owner->id]);
    $this->ownerMember = Member::factory()->for($this->group)->forUser($this->owner)->owner()->create();
    $this->member = Member::factory()->for($this->group)->forUser($this->memberUser)->create();

    $this->event = Event::factory()->for($this->group)->create();

    $this->statsUrl = "/groups/{$this->group->uuid}/stats";
});

// ---------------------------------------------------------------------------
// access control
// ---------------------------------------------------------------------------

test('guests are redirected to login', function () {
    $this->get($this->statsUrl)->assertRedirect('/login');
});

test('non-members cannot view stats', function () {
    $this->actingAs($this->outsider)->get($this->statsUrl)->assertForbidden();
});

test('members can view stats', function () {
    $this->actingAs($this->memberUser)->get($this->statsUrl)->assertOk();
});

// ---------------------------------------------------------------------------
// aggregation
// ---------------------------------------------------------------------------

test('monthly totals sum expenses per month, newest first', function () {
    Expense::factory()->for($this->event)->create(['amount_minor' => 10000, 'spent_at' => '2026-03-05']);
    Expense::factory()->for($this->event)->create(['amount_minor' => 5000, 'spent_at' => '2026-03-20']);
    Expense::factory()->for($this->event)->create(['amount_minor' => 8000, 'spent_at' => '2026-02-14']);

    $this->actingAs($this->owner)
        ->get($this->statsUrl)
        ->assertInertia(fn (Assert $page) => $page
            ->component('groups/stats')
            ->has('months', 2)
            ->where('months.0.month', '2026-03')
            ->where('months.0.total_minor', 15000)
            ->where('months.1.month', '2026-02')
            ->where('months.1.total_minor', 8000)
        );
});

test('a group with no expenses returns an empty month list', function () {
    $this->actingAs($this->owner)
        ->get($this->statsUrl)
        ->assertInertia(fn (Assert $page) => $page->component('groups/stats')->has('months', 0));
});
