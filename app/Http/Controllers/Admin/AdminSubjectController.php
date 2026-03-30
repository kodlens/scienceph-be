<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Subject;

class AdminSubjectController extends Controller
{
    //

    public function index(){
        return Inertia::render('Admin/Subject/AdminSubjectIndex');
    }


    public function getData(Request $req){

        $perpage = $req->perpage;
        //$sort = explode();
        $data = Subject::when($req->filled('search'), function($q) use($req) {
            $q->where('subject', 'like', $search . '%');
        })
        ->paginate($perpage);

        return $data;
    }
}
