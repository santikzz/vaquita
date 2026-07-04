<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\Expense;
use App\Models\Member;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Expense>
 */
class ExpenseFactory extends Factory
{
    public function definition(): array
    {
        return [
            'event_id' => Event::factory(),
            'payer_member_id' => Member::factory(),
            'description' => fake()->words(2, true),
            'amount_minor' => fake()->numberBetween(1000, 100000),
            'split_method' => 'equal',
            'spent_at' => fake()->date(),
        ];
    }
}
