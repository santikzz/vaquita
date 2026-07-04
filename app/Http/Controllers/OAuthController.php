<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class OAuthController extends Controller
{
    public function redirectToGoogleOAuth()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback(Request $request)
    {
        try {
            $socialiteUser = Socialite::driver('google')->user();
            $localUser = User::where('provider_id', $socialiteUser->getId())->first();

            if (! $localUser) {
                // check if a password-based account already exists with this email
                $existingUser = User::where('email', $socialiteUser->getEmail())->whereNull('provider')->first();
                if ($existingUser) {
                    return redirect()->route('login')
                        ->with('error', 'An account with this email already exists. Please sign in with your password.');
                }

                $localUser = User::create([
                    'name' => $socialiteUser->getName() ?? $socialiteUser->getNickname() ?? $socialiteUser->getId(),
                    'email' => $socialiteUser->getEmail(),
                    // 'avatar'            => $socialiteUser->getAvatar(),
                    'provider' => 'google',
                    'provider_id' => $socialiteUser->getId(),
                    'password' => bcrypt(uniqid()),
                    'email_verified_at' => now(),
                ]);
            }

            Auth::login($localUser, true);

            return redirect()->intended(route('groups.index'));

        } catch (Exception $e) {
            Log::error('Google OAuth Error: '.$e->getMessage());

            return redirect()->route('login')->with('error', 'Google sign-in failed. Please try again.');
        }
    }
}
