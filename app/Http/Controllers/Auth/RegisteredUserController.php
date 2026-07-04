<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Jobs\SendVerificationEmailJob;
use App\Models\User;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    private $rateKey;

    public function show(Request $request): Response
    {
        return Inertia::render('auth/register', [
            'redirect' => $this->safeRedirect($request->query('redirect')),
            'turnstileEnabled' => (bool) config('services.turnstile.enabled'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        // rate limiting to prevent spam registrations
        $this->rateKey = 'register:'.$request->ip();
        if (RateLimiter::tooManyAttempts($this->rateKey, 10)) {
            return back()->withErrors(['email' => 'Too many registration attempts. Please try again later.']);
        }

        // turnstile is required only when enabled (disabled locally for dev)
        $turnstileEnabled = (bool) config('services.turnstile.enabled');

        // validate input
        $validated = $request->validate([
            'name' => 'required|string|min:3|max:30|regex:/^[a-zA-Z0-9_\-\s]+$/',
            'email' => 'required|string|lowercase|email|max:255',
            'password' => ['required', 'confirmed', Password::defaults()],
            'turnstile_token' => [$turnstileEnabled ? 'required' : 'nullable', 'string'],
        ], [
            'name.regex' => 'Name contains invalid characters.',
            'turnstile_token.required' => 'Please complete the captcha.',
        ]);

        // verify turnstile token to block bots
        if ($turnstileEnabled && ! $this->verifyTurnstile($validated['turnstile_token'] ?? '', $request->ip())) {
            return back()->withErrors(['turnstile_token' => 'Captcha verification failed. Please try again.']);
        }

        try {

            // normalize email to lowercase
            $validated['email'] = Str::lower($validated['email']);

            // double-check uniqueness to prevent race conditions
            $existing = User::where('email', $validated['email'])
                ->orWhere('name', $validated['name'])
                ->first();

            if ($existing) {
                if ($existing->email === $validated['email']) {
                    // check if collision is with a google account
                    if (! is_null($existing->provider)) {
                        return back()->withErrors(['email' => 'This email is registered with Google. Please sign in with Google.']);
                    }

                    return back()->withErrors(['email' => 'This email is already registered.']);
                }

                return back()->withErrors(['name' => 'This username is already taken.']);
            }

            // check allowed email domains
            if ($this->isValidEmailDomain($validated['email']) === false) {
                return back()->withErrors(['email' => 'Please use a common email provider (Gmail, Outlook, iCloud, etc.).']);
            }

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            SendVerificationEmailJob::dispatch($user);

            RateLimiter::clear($this->rateKey);

            Auth::login($user); // auto login after registration

        } catch (Exception $e) {
            RateLimiter::hit($this->rateKey, 60);

            return back()->withErrors(['email' => 'Registration failed. Please try again.']);
        }

        return redirect()->route('groups.index');
    }

    // verify a turnstile token against cloudflare siteverify.
    private function verifyTurnstile(string $token, ?string $ip): bool
    {
        if (! config('services.turnstile.enabled')) {
            return true;
        }

        $secret = config('services.turnstile.secret');

        // fail open only when no secret is configured (local/dev without turnstile)
        if (empty($secret)) {
            return true;
        }

        try {
            $response = Http::asForm()
                ->timeout(5)
                ->post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
                    'secret' => $secret,
                    'response' => $token,
                    'remoteip' => $ip,
                ]);

            return $response->successful() && $response->json('success') === true;
        } catch (Exception $e) {
            return false;
        }
    }

    // only allow same-app relative paths, never an absolute/external url.
    private function safeRedirect(?string $target): ?string
    {
        if (! $target || ! str_starts_with($target, '/') || str_starts_with($target, '//')) {
            return null;
        }

        return $target;
    }

    private function isValidEmailDomain(string $email): bool
    {
        $domains = [
            '@gmail.com',
            '@googlemail.com',
            '@outlook.com',
            '@hotmail.com',
            '@icloud.com',
            '@yahoo.com',
            '@proton.me',
            '@protonmail.com',
        ];

        foreach ($domains as $domain) {
            if (Str::endsWith($email, $domain)) {
                return true;
            }
        }

        return false;
    }
}
