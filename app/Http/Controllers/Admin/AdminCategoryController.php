<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;

class AdminCategoryController extends Controller
{
    //

    public function index(){
        return Inertia::render('Admin/Category/AdminCategoryIndex');
    }


    public function getData(Request $req){

        $perpage = $req->perpage;
        //$sort = explode();
        $data = Category::when($req->filled('search'), function($q) use($req) {
            $q->where('subject', 'like', $search . '%');
        })
        ->paginate($perpage);

        return $data;
    }
}
