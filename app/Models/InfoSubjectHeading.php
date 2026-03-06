<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InfoSubjectHeading extends Model
{
    use HasFactory;

    protected $fillable = [
        'info_id',
        'subject_heading_id',
        'score',
        'analysis'
    ];


}
