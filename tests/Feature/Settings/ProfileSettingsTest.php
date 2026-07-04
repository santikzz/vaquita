<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->user = User::factory()->create([
        'password' => Hash::make('password123'),
    ]);
});

// ---------------------------------------------------------------------------
// access control
// ---------------------------------------------------------------------------

test('guests are redirected to login', function () {
    $this->get('/profile')->assertRedirect('/login');
    $this->post('/profile', [])->assertRedirect('/login');
    $this->put('/password', [])->assertRedirect('/login');
});

test('the profile page loads for an authenticated user', function () {
    $this->actingAs($this->user)->get('/profile')->assertOk();
});

// ---------------------------------------------------------------------------
// profile information
// ---------------------------------------------------------------------------

test('the user can update name and email', function () {
    $this->actingAs($this->user)
        ->post('/profile', [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
        ])
        ->assertRedirect('/profile');

    $this->user->refresh();
    expect($this->user->name)->toBe('Updated Name');
    expect($this->user->email)->toBe('updated@example.com');
});

test('changing the email resets verification', function () {
    $this->user->forceFill(['email_verified_at' => now()])->save();

    $this->actingAs($this->user)
        ->post('/profile', [
            'name' => $this->user->name,
            'email' => 'changed@example.com',
        ]);

    expect($this->user->refresh()->email_verified_at)->toBeNull();
});

test('email stays verified when it is unchanged', function () {
    $this->user->forceFill(['email_verified_at' => now()])->save();

    $this->actingAs($this->user)
        ->post('/profile', [
            'name' => 'New Name',
            'email' => $this->user->email,
        ]);

    expect($this->user->refresh()->email_verified_at)->not->toBeNull();
});

test('profile update validates required fields and unique email', function () {
    $other = User::factory()->create(['email' => 'taken@example.com']);

    $this->actingAs($this->user)
        ->post('/profile', ['name' => '', 'email' => 'not-an-email'])
        ->assertSessionHasErrors(['name', 'email']);

    $this->actingAs($this->user)
        ->post('/profile', ['name' => 'Name', 'email' => $other->email])
        ->assertSessionHasErrors('email');
});

// ---------------------------------------------------------------------------
// avatar
// ---------------------------------------------------------------------------

test('uploading an avatar stores a file and saves the path', function () {
    Storage::fake(mediaDisk());

    $this->actingAs($this->user)
        ->post('/profile', [
            'name' => $this->user->name,
            'email' => $this->user->email,
            'avatar' => UploadedFile::fake()->image('avatar.png'),
        ]);

    $path = $this->user->refresh()->getRawOriginal('avatar');

    expect($path)->not->toBeNull();
    Storage::disk(mediaDisk())->assertExists($path);
});

test('the user can remove their avatar', function () {
    Storage::fake(mediaDisk());

    $this->user->setAvatar(UploadedFile::fake()->image('avatar.png'));
    $this->user->save();
    $path = $this->user->getRawOriginal('avatar');

    $this->actingAs($this->user)
        ->post('/profile', [
            'name' => $this->user->name,
            'email' => $this->user->email,
            'remove_avatar' => '1',
        ]);

    expect($this->user->refresh()->getRawOriginal('avatar'))->toBeNull();
    Storage::disk(mediaDisk())->assertMissing($path);
});

// ---------------------------------------------------------------------------
// password
// ---------------------------------------------------------------------------

test('the user can update their password', function () {
    $this->actingAs($this->user)
        ->put('/password', [
            'current_password' => 'password123',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ])
        ->assertSessionHasNoErrors();

    expect(Hash::check('new-password', $this->user->refresh()->password))->toBeTrue();
});

test('the password update requires the correct current password', function () {
    $this->actingAs($this->user)
        ->put('/password', [
            'current_password' => 'wrong-password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ])
        ->assertSessionHasErrors('current_password');
});

test('the new password must be confirmed', function () {
    $this->actingAs($this->user)
        ->put('/password', [
            'current_password' => 'password123',
            'password' => 'new-password',
            'password_confirmation' => 'different',
        ])
        ->assertSessionHasErrors('password');
});
