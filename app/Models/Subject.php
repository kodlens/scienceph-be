<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'subject',
        'active',
    ];

    public function subject_headings(){
        return $this->hasMany(SubjectHeading::class);
    }
}
