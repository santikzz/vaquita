<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('auth/login');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $throttleKey = 'login:'.Str::lower($request->email).'|'.$request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            return back()->withErrors(['email' => 'Too many login attempts. Please try again later.']);
        }

        // check if this email belongs to a google-only account
        $user = User::where('email', Str::lower($request->email))->first();
        if ($user && ! is_null($user->provider)) {
            return back()->withErrors(['email' => 'This account uses Google Sign-In. Please use the Google button below.']);
        }

        if (! Auth::attempt($request->only('email', 'password'), true)) {
            RateLimiter::hit($throttleKey, 60);

            return back()->withErrors(['email' => 'Invalid email or password.']);
        }

        RateLimiter::clear($throttleKey);
        $request->session()->regenerate();

        return redirect()->intended(route('groups.index'));
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home');
    }
}
