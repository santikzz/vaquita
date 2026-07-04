<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('group_id')->constrained()->cascadeOnDelete();
            // null user_id = guest member (no account); nullOnDelete keeps the
            // financial history alive as a guest if the user account is deleted.
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('nickname')->nullable();
            $table->string('role')->default('member');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['group_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
