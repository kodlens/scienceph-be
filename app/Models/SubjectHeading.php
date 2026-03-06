<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubjectHeading extends Model
{
    use HasFactory;

    protected $fillable = [
        'subject_id',
        'subject_heading',
        'slug',
        'active',
    ];
}
