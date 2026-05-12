<?php

namespace App\Http\Controllers\Publisher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Material;
use App\Models\MaterialAssignment;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;


class PublisherSubmittedMaterialController extends Controller
{
    public function index(){
        return Inertia::render('Publisher/Material/Submitted/PublisherSubmittedMaterialIndex');
    }

    public function getData(Request $req){
        $userId = Auth::id();
        $usersData = MaterialAssignment::where('publisher_user_id', $userId)
            ->get();
        //assigned material ids
        $assignedMaterialIds = $usersData->pluck('encoder_user_id')->toArray();

        return $assignedMaterialIds;

        $data = Material::where('status', 'submit')
            ->where('classification', 'scienceph')
            ->where('trash', 0)
            ->whereIn('encoded_by_id', $assignedMaterialIds)
            ->paginate(10);

        return response()->json($data);
    }
}
