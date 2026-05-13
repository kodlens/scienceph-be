<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExternalMigration extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'last_migrated_id',
        'last_migrated_at',
        'status',
        'requested_from',
        'requested_to',
        'total_count',
        'processed_count',
        'error_message',
        'started_at',
        'finished_at',
    ];
}
