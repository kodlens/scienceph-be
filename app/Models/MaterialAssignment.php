<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaterialAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'encoder_user_id',
        'publisher_user_id',
    ];


    public function Publisher()
    {
        return $this->belongsTo(User::class, 'publisher_user_id');
    }


    public function Encoder()
    {
        return $this->hasMany(User::class, 'encoder_user_id');
    }
}
