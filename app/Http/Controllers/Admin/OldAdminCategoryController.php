<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use Inertia\Inertia;
use Inertia\Response;
use Auth;
use Illuminate\Support\Str;


class OldAdminCategoryController extends Controller
{
    //

    public function index(){

        return Inertia::render('Admin/Category/AdminCategoryIndex');
    }


    public function show($id){
        return Category::find($id);
    }


    public function getData(Request $req){
        $sort = explode('.', $req->sort_by);

        $data = Category::where('name', 'like', $req->search . '%')
            ->orderBy($sort[0], $sort[1])
            ->paginate($req->perpage);

        return $data;
    }

    public function store(Request $req){

        $req->validate([
            'name' => ['required', 'unique:categories'],
        ]);

        Category::create([
            'name' => ucfirst($req->name),
            'slug' => Str::slug($req->name),
            'description' => $req->description,
            'active' => $req->active ? 1: 0
        ]);

        return response()->json([
            'status' => 'saved'
        ], 200);
    }



    public function update(Request $req, $id){

        $req->validate([
            'name' => ['required', 'unique:categories,name,' . $id . ',id'],
        ]);

        $data = Category::find($id);
        $data->name = strtoupper($req->name);
        $data->slug = Str::slug($req->name);
        $data->description = $req->description;
        $data->active = $req->active ? 1: 0;
        $data->save();

        return response()->json([
            'status' => 'updated'
        ], 200);
    }

    public function destroy($id){
        $data = Category::destroy($id);

        return response()->json([
            'status' => 'deleted'
        ], 200);
    }
}
