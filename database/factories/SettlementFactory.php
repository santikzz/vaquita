<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\Member;
use App\Models\Settlement;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Settlement>
 */
class SettlementFactory extends Factory
{
    public function definition(): array
    {
        return [
            'event_id' => Event::factory(),
            'from_member_id' => Member::factory(),
            'to_member_id' => Member::factory(),
            'amount_minor' => fake()->numberBetween(1000, 100000),
            'settled_at' => fake()->date(),
        ];
    }
}
