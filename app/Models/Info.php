<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Info extends Model
{
    //

    protected $primaryKey = 'information_id';

    protected $fillable = [
        'article_id',
        'title',
        'description',
        'alias',
        'url',
        'agency_code',


        'content',
        'clean_content',



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
