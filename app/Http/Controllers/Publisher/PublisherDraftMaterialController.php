<?php

namespace App\Http\Controllers\Publisher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use App\Models\Material;
use App\Models\MaterialAssignment;


class PublisherDraftMaterialController extends Controller
{
    public function index()
    {
        return Inertia::render('Publisher/Material/Draft/PublisherDraftMaterialIndex');
    }

    public function getData(Request $request)
    {
        $userId = Auth::id();
        $usersData = MaterialAssignment::where('publisher_user_id', $userId)
            ->get();
        //assigned material ids
        $assignedMaterialIds = $usersData->pluck('encoder_user_id')->toArray();


        $draftMaterials = Material::where('status', 'draft')
            ->with('encodedBy')
            ->where('classification', 'scienceph')
            ->where('trash', 0)
            ->whereIn('encoded_by_id', $assignedMaterialIds)
            ->paginate(10);

        return response()->json($draftMaterials);
    }
}
