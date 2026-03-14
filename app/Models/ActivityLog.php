<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    use HasFactory;

     protected $fillable = [
        'source_table',
        'material_id',
        'usre_id',
        'action',
        'description',
        'old_values',
        'new_values',
        'ip_address'
    ];

}

