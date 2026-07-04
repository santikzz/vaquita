<?php

namespace Database\Factories;

use App\Models\Group;
use App\Models\Member;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Member>
 */
class MemberFactory extends Factory
{
    public function definition(): array
    {
        return [
            'group_id' => Group::factory(),
            'user_id' => null,
            'nickname' => fake()->firstName(),
            'role' => Member::ROLE_MEMBER,
            'is_active' => true,
        ];
    }

    public function forUser(User $user): static
    {
        return $this->state(fn () => ['user_id' => $user->id, 'nickname' => null]);
    }

    public function owner(): static
    {
        return $this->state(fn () => ['role' => Member::ROLE_OWNER]);
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }
}
