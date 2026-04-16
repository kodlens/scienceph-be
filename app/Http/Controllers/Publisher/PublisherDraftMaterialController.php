<?php

namespace App\Http\Controllers\Publisher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use App\Models\Material;

class PublisherDraftMaterialController extends Controller
{
    public function index()
    {
        return Inertia::render('Publisher/Material/Draft/PublisherDraftMaterialIndex');
    }

    public function getData(Request $request)
    {
        $user = Auth::user();

        $draftMaterials = Material::where('status', 'draft')
            ->where('encoded_by_id', $user->id)
            ->paginate(10);

        return response()->json($draftMaterials);
    }
}
