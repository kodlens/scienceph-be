<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CategoryController extends Controller
{

    public function loadCategories()
    {
        $categories = \App\Models\Category::where('active', 1)->get();
        return response()->json($categories);
    }
}
