<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\ResourceType;
use Illuminate\Support\Str;

class AdminResourceTypeController extends Controller
{
    //

    public function index(){
        return Inertia::render('Admin/ResourceTypes/AdminResourceTypeIndex');
    }

    public function getData(Request $request)
    {
        $query = ResourceType::query();

        if ($request->has('search') && !empty($request->search)) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }


        $resourceTypes = $query->orderBy('created_at', 'desc')->paginate(10);

        return $resourceTypes;
    }

    public function show($id){
        return ResourceType::find($id);
    }

    public function store(Request $req){
        $validated = $req->validate([
            'name' => 'required|string|max:255',
        ]);

        ResourceType::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'active' => $req->active ? 1 : 0
        ]);

        return response()->json([
            'status' => 'saved'
        ],200);
    }

    public function update(Request $req, $id){
        $validated = $req->validate([
            'name' => 'required|string|max:255',
        ]);

        $resourceType = ResourceType::find($id);
        if (!$resourceType) {
            return response()->json(['error' => 'Resource Type not found'], 404);
        }

        $resourceType->update([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'active' => $req->active ? 1 : 0
        ]);

        return response()->json([
            'status' => 'updated'
        ],200);
    }

    public function destroy($id){
        $resourceType = ResourceType::find($id);
        if (!$resourceType) {
            return response()->json(['error' => 'Resource Type not found'], 404);
        }

        $resourceType->delete();

        return response()->json([
            'status' => 'deleted'
        ],200);
    }


}
