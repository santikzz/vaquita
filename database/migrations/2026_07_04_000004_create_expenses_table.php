<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('event_id')->constrained()->cascadeOnDelete();
            $table->foreignId('payer_member_id')->constrained('members')->cascadeOnDelete();
            $table->string('description');
            // money is always integer minor units (cents), never floats
            $table->unsignedBigInteger('amount_minor');
            $table->string('split_method');
            $table->date('spent_at');
            $table->timestamps();
        });

        Schema::create('expense_shares', function (Blueprint $table) {
            $table->id();
            $table->foreignId('expense_id')->constrained()->cascadeOnDelete();
            $table->foreignId('member_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('amount_minor');
            $table->unsignedSmallInteger('share_units')->nullable();
            $table->timestamps();

            $table->unique(['expense_id', 'member_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expense_shares');
        Schema::dropIfExists('expenses');
    }
};
