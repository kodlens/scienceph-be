<?php

namespace App\Http\Controllers\Publisher\Ojt;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Material;
use Illuminate\Http\JsonResponse;


class PublisherOjtMaterialController extends Controller
{
    public function index()
    {
        return Inertia::render('Publisher/Material/Ojt/PublisherOjtMaterialIndex');
    }

    public function getData(Request $request): JsonResponse
    {
        $perPage = $request->integer('perpage', 10);
        $status  = $request->string('status')->toString();
        $title  = $request->string('title')->toString();

        $query = Material::query()
            ->with(['section', 'category', 'encodedBy', 'modifiedBy'])
            ->where('trash', 0)
            ->where('is_ojt', 1);

        if ($request->status != '' || $request->status != null) {
            $query->where('status', $request->status);
        }


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
