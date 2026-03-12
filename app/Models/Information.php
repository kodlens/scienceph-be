<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Information extends Model
{
    //

    protected $fillable = [
        'source_id',
        'title',
        'description',
        'description_text',
        'alias',
        'url',
        'agency_code',
        'url',
        'source',
        'agency',
        'regional_office',
        'is_publish',
        'material_type',
        'author',
        'publisher_name',
        'category'
    ];
}
