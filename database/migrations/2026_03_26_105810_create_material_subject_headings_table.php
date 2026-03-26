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
        Schema::create('material_subject_headings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('material_id');
            $table->unsignedBigInteger('subject_heading_id');
            $table->foreign('material_id')->references('id')->on('materials')->onDelete('cascade');
            $table->foreign('subject_heading_id')->references('id')->on('subject_headings')->onDelete('cascade');
            $table->double('score')->default(0);
            $table->text('analysis')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('material_subject_headings');
    }
};
