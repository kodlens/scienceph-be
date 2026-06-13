<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Material;
use App\Http\Controllers\Helpers\Fetcher;
use App\Http\Controllers\Base\MaterialController;

class AdminUncategorizedMaterialController extends MaterialController
{
    public function index()
    {
        return Inertia::render('Admin/Material/UncategorizedMaterials/AdminUncategorizedMaterialIndex');
    }

    public function getData(Request $req)
    {
        $perpage = $req->input('perpage', 10);
        $page = $req->input('page', 1);

        $data = Material::doesntHave('subject_headings')
            ->when($req->id, function($query) use ($req) {
                $query->where('id', $req->id);
            })
            ->select(
                'id',
                'title',
                'slug',
                'filter_type',
                'author',
                'encoded_by_id',
                'encoded_at',
                'modified_by_id',
                'modified_at',
                'submitted_at',
                'source_url',
                'publish_date',
                'is_publish',
                'status',
                'is_ojt',
                'tags'
            )
            ->orderBy('id', 'desc')
            ->paginate($perpage, ['*'], 'page', $page);

        return response()->json($data);
    }


    public function create(){

        //$CK_LICENSE = env('CK_EDITOR_LICENSE_KEY');
        $CK_LICENSE = config('app.ck_license');

        //$openController = new OpenController();
        $fetcher = new Fetcher();

        //$sections = $fetcher->getSections();
        $tags = $fetcher->getTags();
        $agencies = $fetcher->getAgencies();
        $regions = $fetcher->getRegions();
        //$regionalOffices = $fetcher->getRegionalOffices();
        //$categories = $fetcher->getCategories();
        $authors = $fetcher->getAuthorsAutocomplete();


        return Inertia::render('Admin/Material/UncategorizedMaterials/AdminUncategorizedMaterialAddEdit', [
            'id' => 0,
            'ckLicense' => $CK_LICENSE,
            'post' => null,
            'tags' => $tags,
            'agencies' => $agencies,
            'regions' => $regions,
            //'categories' => $categories,
            //'regionalOffices' => $regionalOffices,
            //'sections' => $sections,
            'authors' => $authors
        ]);
    }

    public function edit($id){

       //$CK_LICENSE = env('CK_EDITOR_LICENSE_KEY');
       $CK_LICENSE = config('app.ck_license');


        $fetcher = new Fetcher();

        //$sections = $fetcher->getSections();
        $tags = $fetcher->getTags();
        $agencies = $fetcher->getAgencies();
        $regions = $fetcher->getRegions();
       // $regionalOffices = $fetcher->getRegionalOffices();
       // $categories = $fetcher->getCategories();
        $authors = $fetcher->getAuthorsAutocomplete();
       $material = Material::with(['subject_headings'])->find($id);

        return Inertia::render('Admin/Material/UncategorizedMaterials/AdminUncategorizedMaterialAddEdit', [
            'id' => $id,
            'ckLicense' => $CK_LICENSE,
            'material' => $material,
            'tags' => $tags,
            'agencies' => $agencies,
            'regions' => $regions,
            //'regionalOffices' => $regionalOffices,
            //'categories' => $categories,
            'authors' => $authors
        ]);
    }
}
