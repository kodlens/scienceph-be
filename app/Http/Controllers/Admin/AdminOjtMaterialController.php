<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Material;
use Illuminate\Http\JsonResponse;

class AdminOjtMaterialController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/OjtMaterial/AdminOjtMaterialIndex');
    }


    public function getData(Request $req): JsonResponse
    {
        $data = Material::with(['section', 'category', 'encodedBy', 'modifiedBy'])
            ->where('trash', 0)
            ->where('is_ojt', 1)
            ->when($req->filled('status'), function ($query) use ($req) {
                $query->where('status', $req->status);
            })
            ->when($req->filled('search'), function ($query) use ($req) {
                $query->where('title', 'like', '%' . $req->search . '%');
            })
            ->orderBy('id', 'desc')
            ->paginate($req->input('perpage', 10)); // default 10 if null

        return response()->json($data);
    }

}
