<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settlements', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('event_id')->constrained()->cascadeOnDelete();
            $table->foreignId('from_member_id')->constrained('members')->cascadeOnDelete();
            $table->foreignId('to_member_id')->constrained('members')->cascadeOnDelete();
            $table->unsignedBigInteger('amount_minor');
            $table->string('note')->nullable();
            $table->date('settled_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settlements');
    }
};
