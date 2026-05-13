<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExternalMigrationLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'external_migration_id',
        'migrated_id',
        'total_count',
        'migrated_at'
    ];
}
