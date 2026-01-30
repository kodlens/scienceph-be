<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;


    protected $table = 'articles';

    protected $primaryKey = 'article_id';

    protected $fillable = [
        'title',
       // 'excerpt',

        'alias',
        'description',
        'description_text',
        'section_id',
        'category_id',
        'author',
        'content_type',
        'encoded_by_id',
        //'encoded_at',
        'modified_by_id',
        //'modified_at',
        'region',
        'tags',
        'agency',
        //'featured_image',
        'source_url',
        'hits',
        'status',
        'publish_date',
        'is_publish',
        'is_press_release',
        'trash',
        'is_archive',
        'record_trail',
    ];




    public function section(){
        return $this->belongsTo(Section::class);
    }

    public function category(){
        return $this->belongsTo(Category::class);
    }

    public function encodedBy(){
        return $this->belongsTo(User::class, 'encoded_by_id', 'user_id');
    }

    public function modifiedBy(){
        return $this->belongsTo(User::class, 'modified_by_id', 'user_id');
    }

}
