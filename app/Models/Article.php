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
        'excerpt',

        'alias',
        'intro_text',
        'content',

        'section_id',
        'category_id',

        'encoded_by',
        'encoded_by_alias',
        'encoded_date',

        'modified_by',
        'modified_by_alias',
        'modified_date',

        'region',
        'tags',

        'featured_image',

        'source_url',
        'hits',

        'record_trail',

        'publish_date',
        'is_publish',

        'trash',
        'is_archive'
    ];




    public function subjects(){
        return $this->hasMany(InfoSubjectHeading::class, 'info_id', 'id')
          ->join('subject_headings', 'info_subject_headings.subject_heading_id', '=', 'subject_headings.id')
          ->join('subjects', 'subject_headings.subject_id', '=', 'subjects.id')
          ->select('info_subject_headings.*', 'subject_heading', 'subject', 'subject_id');
    }

}
