<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\FilterType;
use Illuminate\Support\Str;

class AdminFilterTypeController extends Controller
{
    //

    public function index(){
        return Inertia::render('Admin/FilterType/AdminFilterTypeIndex');
    }

    public function getData(Request $request)
    {
        $query = FilterType::query();

        if ($request->has('search') && !empty($request->search)) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }


        $filterTypes = $query->orderBy('created_at', 'desc')->paginate(10);

        return $filterTypes;
    }

    public function show($id){
        return FilterType::find($id);
    }

    public function store(Request $req){
        $validated = $req->validate([
            'name' => 'required|string|max:255',
        ]);

        FilterType::create([
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

        $filterType = FilterType::find($id);
        if (!$filterType) {
            return response()->json(['error' => 'Filter Type not found'], 404);
        }

        $filterType->update([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'active' => $req->active ? 1 : 0
        ]);

        return response()->json([
            'status' => 'updated'
        ],200);
    }

    public function destroy($id){
        $filterType = FilterType::find($id);
        if (!$filterType) {
            return response()->json(['error' => 'Filter Type not found'], 404);
        }

        $filterType->delete();

        return response()->json([
            'status' => 'deleted'
        ],200);
    }


}
