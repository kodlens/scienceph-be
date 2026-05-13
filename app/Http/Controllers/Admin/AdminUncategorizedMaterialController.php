<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Material;

class AdminUncategorizedMaterialController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Material/UncategorizedMaterials/UncategorizedMaterialIndex');
    }

    public function getData(Request $request)
    {
        $perpage = $request->input('perpage', 10);
        $page = $request->input('page', 1);

        $uncategorizedMaterials = Material::doesntHave('subject_headings')
            ->orderBy('id', 'desc')
            ->paginate($perpage, ['*'], 'page', $page);

        return response()->json($uncategorizedMaterials);
    }
}
