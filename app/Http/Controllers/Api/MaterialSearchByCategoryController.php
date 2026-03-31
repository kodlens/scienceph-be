<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Material;
use App\Models\Category;



class MaterialSearchByCategoryController extends Controller
{
    //

    public function searchMaterialsByCategory(Request $req, $slug)
    {
        $perPage = $req->perpage ?? 10; // Default to 10 if not provided
        // $materials = Material::whereHas('subject_headings', function ($query) use ($slug) {
        //     $query->whereHas('category', function ($query) use ($slug) {
        //         $query->where('slug', $slug);
        //     });
        // })->get();

        //$category = Category::where('slug', $slug)->first();

        //return Material::with(['subject_headings'])->paginate($perPage);
        $materials = Material::with(['subject_headings'])
            ->whereHas('subject_headings', function ($query) use ($slug) {
                $query->where('slug', $slug);
            })
            ->paginate($perPage);

        return response()->json($materials);
    }
}
