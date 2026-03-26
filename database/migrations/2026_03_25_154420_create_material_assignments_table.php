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
        Schema::create('material_assignments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('encoder_user_id');
            $table->unsignedBigInteger('publisher_user_id');
            $table->foreign('encoder_user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('publisher_user_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('material_assignments');
    }
};
