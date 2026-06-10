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
        Schema::table('materials', function (Blueprint $table) {
            $table->fullText(['title', 'description_text'], 'materials_title_description_text_fulltext');
            $table->index(['status', 'publish_date'], 'materials_status_publish_date_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('materials', function (Blueprint $table) {
            $table->dropFullText('materials_title_description_text_fulltext');
            $table->dropIndex('materials_status_publish_date_index');
        });
    }
};
