<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Region;

class AdminRegionController extends Controller
{

    public function index(){
        return Inertia::render('Admin/Region/AdminRegionIndex');
    }


    public function show($id){
        return Region::find($id);
    }


    public function getData(Request $req){
        $sort = explode('.', $req->sort_by);

        $data = Region::where('name', 'like', $req->search . '%')
            ->orderBy($sort[0], $sort[1])
            ->paginate($req->perpage);
        return $data;
    }

    public function store(Request $req){

        $req->validate([
            'name' => ['required', 'unique:regions'],
        ]);

        Region::create([
            'name' => ucfirst($req->name),
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

        $data = Region::find($id);
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
        $data = Region::destroy($id);

        return response()->json([
            'status' => 'deleted'
        ], 200);
    }

}
