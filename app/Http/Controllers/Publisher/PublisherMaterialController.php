<?php

namespace App\Http\Controllers\Publisher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use App\Models\Post;
use App\Rules\ValidateSlug;
use App\Rules\ValidateTitle;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Helpers\FilterDom;
use Illuminate\Http\JsonResponse;
use App\Models\Material;
use App\Http\Controllers\Helpers\RecordTrail;
use App\Http\Controllers\Helpers\Fetcher;
use App\Http\Controllers\Base\MaterialController;
use App\Models\MaterialAssignment;

class PublisherMaterialController extends MaterialController
{

    public function index()
    {
        return Inertia::render('Publisher/Material/PublisherMaterialIndex');
    }

    public function getData(Request $request) {
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
            ->whereIn('encoded_by_id', $assignedMaterialIds);

        // Status filter
        if (!empty($status)) {
            $query->where('status', $status);
        } else {
            //$query->whereIn('status', ['submit', 'unpublish']);
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


     public function create()
    {
        $CK_LICENSE = env('CK_EDITOR_LICENSE_KEY');
        //$openController = new OpenController();
        $fetcher = new Fetcher();

        //$sections = $fetcher->getSections();
        $tags = $fetcher->getTags();
        $agencies = $fetcher->getAgencies();
        $regions = $fetcher->getRegions();
        $regionalOffices = $fetcher->getRegionalOffices();
        $categories = $fetcher->getCategories();
        $authors = $fetcher->getAuthorsAutocomplete();


        return Inertia::render('Publisher/Material/PublisherMaterialCreateEdit', [
            'id' => 0,
            'ckLicense' => $CK_LICENSE,
            'material' => null,
            'tags' => $tags,
            'agencies' => $agencies,
            'regions' => $regions,
            'categories' => $categories,
            'regionalOffices' => $regionalOffices,
            //'sections' => $sections,
            'authors' => $authors
        ]);
    }



    public function edit($id)
    {
        $CK_LICENSE = env('CK_EDITOR_LICENSE_KEY');

        $fetcher = new Fetcher();

        //$sections = $fetcher->getSections();
        $tags = $fetcher->getTags();
        $agencies = $fetcher->getAgencies();
        $regions = $fetcher->getRegions();
        $regionalOffices = $fetcher->getRegionalOffices();
        $categories = $fetcher->getCategories();
        $authors = $fetcher->getAuthorsAutocomplete();
        $material = Material::with(['subject_headings'])->find($id);


        return Inertia::render('Publisher/Material/PublisherMaterialCreateEdit', [
            'id' => $id,
            'ckLicense' => $CK_LICENSE,
            'material' => $material,
            'tags' => $tags,
            'agencies' => $agencies,
            'regions' => $regions,
            'regionalOffices' => $regionalOffices,
            'categories' => $categories,
            //'sections' => $sections,
            'authors' => $authors
        ]);
    }


}
