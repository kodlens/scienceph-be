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
        Schema::create('materials', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('description')->nullable();
            $table->string('description_text')->nullable();
            $table->unsignedBigInteger('category_id')->default(0);
            $table->string('filter_type', 50)->nullable();
            $table->string('resource_type', 50)->nullable();
            $table->string('author')->nullable();
            $table->unsignedBigInteger('encoded_by_id')->nullable();
            $table->datetime('encoded_at')->nullable();
            $table->unsignedBigInteger('modified_by_id')->nullable();
            $table->datetime('modified_at')->nullable();
            $table->datetime('submitted_at')->nullable();
            $table->datetime('publisher_publish_date')->nullable();
            $table->string('agency')->nullable();
            $table->string('region')->nullable();
            $table->string('regional_office')->nullable();
            $table->string('tags')->nullable();
            $table->string('source_url')->nullable();
            $table->unsignedBigInteger('hits')->default(0);
            $table->string('status')->default('draft');
            $table->datetime('publish_date')->nullable();
            $table->boolean('is_publish')->default(false);
            $table->boolean('is_press_release')->default(false);
            $table->boolean('trash')->default(false);
            $table->boolean('is_archive')->default(false);
            $table->boolean('record_trail')->default(false);
            $table->boolean('is_ojt')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materials');
    }
};
