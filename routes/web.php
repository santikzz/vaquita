<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\GroupInviteController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\SettlementController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => redirect()->route('groups.index'))->name('home');

// ----------------------------------------------------------------------------------------
// App
// ----------------------------------------------------------------------------------------
Route::middleware(['auth', 'verified'])->group(function () {

    Route::prefix('groups')->scopeBindings()->group(function () {

        // ------------------------------------------------------------------------------
        // Groups
        // ------------------------------------------------------------------------------
        Route::get('/', [GroupController::class, 'index'])->name('groups.index');
        Route::get('create', [GroupController::class, 'create'])->name('groups.create');
        Route::get('quick', [GroupController::class, 'quick'])->name('groups.quick');
        Route::post('quick', [GroupController::class, 'storeQuick'])->name('groups.quick.store');
        Route::post('/', [GroupController::class, 'store'])->name('groups.store');
        Route::get('{group}', [GroupController::class, 'show'])->name('groups.show');
        Route::get('{group}/edit', [GroupController::class, 'edit'])->name('groups.edit');
        Route::post('{group}', [GroupController::class, 'update'])->name('groups.update');
        Route::delete('{group}', [GroupController::class, 'destroy'])->name('groups.destroy');

        // ------------------------------------------------------------------------------
        // Members & invites
        // ------------------------------------------------------------------------------
        Route::post('{group}/members', [MemberController::class, 'store'])->name('members.store');
        Route::post('{group}/members/{member}', [MemberController::class, 'update'])->name('members.update');
        Route::delete('{group}/members/{member}', [MemberController::class, 'destroy'])->name('members.destroy');
        Route::post('{group}/invite/regenerate', [GroupInviteController::class, 'regenerate'])->name('groups.invite.regenerate');
        Route::post('{group}/leave', [MemberController::class, 'leave'])->name('groups.leave');

        // ------------------------------------------------------------------------------
        // Events
        // ------------------------------------------------------------------------------
        Route::get('{group}/events/create', [EventController::class, 'create'])->name('events.create');
        Route::post('{group}/events', [EventController::class, 'store'])->name('events.store');
        Route::get('{group}/events/{event}', [EventController::class, 'show'])->name('events.show');
        Route::get('{group}/events/{event}/edit', [EventController::class, 'edit'])->name('events.edit');
        Route::post('{group}/events/{event}', [EventController::class, 'update'])->name('events.update');
        Route::delete('{group}/events/{event}', [EventController::class, 'destroy'])->name('events.destroy');

        // ------------------------------------------------------------------------------
        // Expenses
        // ------------------------------------------------------------------------------
        Route::get('{group}/events/{event}/expenses/create', [ExpenseController::class, 'create'])->name('expenses.create');
        Route::post('{group}/events/{event}/expenses', [ExpenseController::class, 'store'])->name('expenses.store');
        Route::get('{group}/events/{event}/expenses/{expense}/edit', [ExpenseController::class, 'edit'])->name('expenses.edit');
        Route::post('{group}/events/{event}/expenses/{expense}', [ExpenseController::class, 'update'])->name('expenses.update');
        Route::delete('{group}/events/{event}/expenses/{expense}', [ExpenseController::class, 'destroy'])->name('expenses.destroy');

        // ------------------------------------------------------------------------------
        // Settlements
        // ------------------------------------------------------------------------------
        Route::post('{group}/events/{event}/settlements', [SettlementController::class, 'store'])->name('settlements.store');
        Route::delete('{group}/events/{event}/settlements/{settlement}', [SettlementController::class, 'destroy'])->name('settlements.destroy');
    });

    // ------------------------------------------------------------------------------
    // Join by invite link
    // ------------------------------------------------------------------------------
    Route::get('join/{code}', [GroupInviteController::class, 'show'])->name('groups.join.show');
    Route::post('join/{code}', [GroupInviteController::class, 'store'])->name('groups.join.store');

    // ------------------------------------------------------------------------------
    // Activity & profile (mobile app pages)
    // ------------------------------------------------------------------------------
    Route::get('activity', [ActivityController::class, 'index'])->name('activity');

    // ------------------------------------------------------------------------------
    // Profile & account
    // ------------------------------------------------------------------------------
    Route::get('profile', function () {
        $user = request()->user();

        return Inertia::render('profile', [
            'profile' => [
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'payment_alias' => $user->payment_alias,
            ],
        ]);
    })->name('app.profile');
    Route::get('profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('password', [PasswordController::class, 'update'])->middleware('throttle:6,1')->name('user-password.update');
});

require __DIR__.'/auth.php';
