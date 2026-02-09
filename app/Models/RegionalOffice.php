<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegionalOffice extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'order_no',
        'active'
    ];
}
