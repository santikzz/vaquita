<?php

namespace App\Jobs;

use App\Mail\VerificationEmail;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;

class SendVerificationEmailJob implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;

    public $timeout = 60;

    public function __construct(
        public User $user
    ) {
        $this->delay(now()->addSeconds(2));
    }

    public function handle(): void
    {
        if ($this->user->hasVerifiedEmail()) {
            return;
        }

        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addHours(24),
            ['id' => $this->user->getKey(), 'hash' => sha1($this->user->getEmailForVerification())]
        );

        Mail::to($this->user->email)->send(new VerificationEmail($this->user, $verificationUrl));
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('Failed to send verification email', [
            'user_id' => $this->user->id,
            'email' => $this->user->email,
            'error' => $exception->getMessage(),
        ]);
    }
}
