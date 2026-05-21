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

    public function getData(Request $request)
    {
        $perpage = $request->input('perpage', 10);
        $page = $request->input('page', 1);

        $uncategorizedMaterials = Material::doesntHave('subject_headings')
            ->orderBy('id', 'desc')
            ->paginate($perpage, ['*'], 'page', $page);

        return response()->json($uncategorizedMaterials);
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
