<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\Group;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Event>
 */
class EventFactory extends Factory
{
    public function definition(): array
    {
        return [
            'group_id' => Group::factory(),
            'name' => fake()->words(3, true),
            'event_date' => fake()->date(),
            'status' => Event::STATUS_OPEN,
        ];
    }
}
