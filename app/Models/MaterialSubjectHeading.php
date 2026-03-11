<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaterialSubjectHeading extends Model
{
    use HasFactory;

    protected $fillable = [
        'material_id',
        'subject_heading_id',
        'score',
        'analysis'
    ];


}
