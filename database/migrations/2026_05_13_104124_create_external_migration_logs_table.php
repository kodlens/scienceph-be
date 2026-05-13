<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('external_migration_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('external_migration_id');
            $table->unsignedBigInteger('migrated_id');
            $table->integer('total_count')->default(0);
            $table->dateTime('migrated_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('external_migration_logs');
    }
};
