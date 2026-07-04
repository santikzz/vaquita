<?php

use App\Http\Controllers\Auth\EmailVerificationController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\OAuthController;
use Illuminate\Support\Facades\Route;

// ----------------------------------------------------------------------------------------
// OAuth Routes
// ----------------------------------------------------------------------------------------
Route::get('/auth/google/redirect', [OAuthController::class, 'redirectToGoogleOAuth']);
Route::get('/auth/google/callback', [OAuthController::class, 'handleGoogleCallback']);

// ----------------------------------------------------------------------------------------
// Basic Authorization Routes
// ----------------------------------------------------------------------------------------
Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'show'])->name('login');
    Route::post('/login', [LoginController::class, 'store'])->name('login.store');
    Route::get('/register', [RegisteredUserController::class, 'show'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);
});

Route::post('/logout', [LoginController::class, 'destroy'])->middleware('auth')->name('logout');

// ----------------------------------------------------------------------------------------
// Email Verification Routes
// ----------------------------------------------------------------------------------------
Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
    ->middleware('signed')
    ->name('verification.verify');

Route::post('/email/resend', [EmailVerificationController::class, 'resend'])
    ->middleware(['auth', 'throttle:1,5'])
    ->name('verification.send');
