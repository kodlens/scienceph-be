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
        Schema::table('external_migrations', function (Blueprint $table) {
            $table->string('status')->default('idle')->after('last_migrated_at');
            $table->date('requested_from')->nullable()->after('status');
            $table->date('requested_to')->nullable()->after('requested_from');
            $table->unsignedInteger('total_count')->default(0)->after('requested_to');
            $table->unsignedInteger('processed_count')->default(0)->after('total_count');
            $table->text('error_message')->nullable()->after('processed_count');
            $table->timestamp('started_at')->nullable()->after('error_message');
            $table->timestamp('finished_at')->nullable()->after('started_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('external_migrations', function (Blueprint $table) {
            $table->dropColumn([
                'status',
                'requested_from',
                'requested_to',
                'total_count',
                'processed_count',
                'error_message',
                'started_at',
                'finished_at',
            ]);
        });
    }
};
