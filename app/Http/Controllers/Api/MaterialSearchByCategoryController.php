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
        // Query to get materials by category slug
        //direct to point query
        $data = Material::query()
            ->join('material_subject_headings as msh', 'materials.id', '=', 'msh.material_id')
            ->join('subject_headings as sh', 'msh.subject_heading_id', '=', 'sh.id')
            ->join('categories as c', 'sh.category_id', '=', 'c.id')
            ->where('c.slug', $slug)
            ->select('materials.*', 'c.slug as category_slug', 'c.category as category')
            ->distinct()
            ->orderBy('materials.publish_date', 'desc')
            ->where('resource_type', 'article')
            ->paginate($perPage);

        return response()->json($data);
    }
}
