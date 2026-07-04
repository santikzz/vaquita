<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('group_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->date('event_date');
            $table->string('status')->default('open');
            $table->foreignId('created_by')->nullable()->constrained('members')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('event_member', function (Blueprint $table) {
            $table->foreignId('event_id')->constrained()->cascadeOnDelete();
            $table->foreignId('member_id')->constrained()->cascadeOnDelete();
            $table->primary(['event_id', 'member_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_member');
        Schema::dropIfExists('events');
    }
};
