<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    use HasFactory;


    protected $primaryKey = 'section_id';

    protected $fillable = [
        'title',
        'alias',
        'order_no',
        'active'
    ];

}
