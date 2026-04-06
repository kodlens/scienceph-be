<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $table = 'categories';
    //protected $primaryKey = 'category_id';

    protected $fillable = [
        'category',
        'slug',
        'active'
    ];

    public function subject_headings(){
        return $this->hasMany(SubjectHeading::class);
    }

}
