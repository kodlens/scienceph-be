<?php

namespace App\Http\Controllers\Publisher\Publish;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Material;
//use Illuminate\Support\Facades\JsonResponse;
use Illuminate\Http\JsonResponse;
use App\Models\MaterialAssignment;
use Illuminate\Support\Facades\Auth;

class PublisherPublishMaterialController extends Controller
{

    public function index()
    {
        return Inertia::render('Publisher/Material/Publish/PublisherPublishMaterialIndex');
    }

    public function getData(Request $request): JsonResponse
    {
        $perPage = $request->integer('perpage', 10);
        $status  = $request->string('status')->toString();
        $title  = $request->string('title')->toString();

        $userId = Auth::id();
        $usersData = MaterialAssignment::where('publisher_user_id', $userId)
            ->get();
        //assigned material ids
        $assignedMaterialIds = $usersData->pluck('encoder_user_id')->toArray();

        $query = Material::query()
            ->with(['section', 'category', 'encodedBy', 'modifiedBy'])
            ->where('trash', 0)
            ->where('status', 'publish')
            ->whereIn('encoded_by_id', $assignedMaterialIds);

        if(!empty($request->encoder)){
            $query->whereHas('encodedBy', function($q) use ($request){
                $q->where('lname', $request->encoder)
                ->orWhere('fname', $request->encoder);
            });
        }

        if(!empty($request->modifier)){
            $query->whereHas('modifiedBy', function($q) use ($request){
                $q->where('lname', $request->modifier)
                ->orWhere('fname', $request->modifier);
            });
        }

        // Search filter
        $query->when($title, function ($q) use ($title) {
            $q->where(function ($qq) use ($title) {
                $qq->where('title', 'like', "%{$title}%")
                ->orWhere('id', 'like', "%{$title}%");
            });
        });

        // Sorting & pagination
        $materials = $query
            ->orderByDesc('id')
            ->paginate($perPage);

        return response()->json($materials);
    }

}
