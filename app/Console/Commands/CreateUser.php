<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Spatie\Permission\Models\Role;

use function Laravel\Prompts\password as promptPassword;
use function Laravel\Prompts\select;
use function Laravel\Prompts\text;

class CreateUser extends Command
{
    protected $signature = 'user:create
        {--name= : The user name}
        {--email= : The user email}
        {--password= : The user password}
        {--role= : The role to assign}';

    protected $description = 'Create a user with a name, email, password and role';

    public function handle(): int
    {
        $roles = Role::pluck('name')->all();

        $name = $this->option('name') ?? text('Name', required: true);
        $email = $this->option('email') ?? text('Email', required: true);
        $password = $this->option('password') ?? promptPassword('Password', required: true);
        $role = $this->option('role') ?? select('Role', $roles);

        $validator = validator(
            compact('name', 'email', 'password', 'role'),
            [
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
                'password' => ['required', Password::min(6)],
                'role' => ['required', Rule::in($roles)],
            ]
        );

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }

            return self::FAILURE;
        }

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'email_verified_at' => now(),
        ]);

        $user->assignRole($role);

        $this->info("User {$email} created with role {$role}.");

        return self::SUCCESS;
    }
}
