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
        'user_id',
        'action',
        'description',
        'old_values',
        'new_values',
        'ip_address'
    ];

    public function  user(){
        return $this->belongsTo(User::class);
    }

    public function  material(){
        return $this->belongsTo(Material::class);
    }

}

