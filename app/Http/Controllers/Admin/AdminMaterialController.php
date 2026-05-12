<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Auth;
use App\Models\Material;
use App\Http\Controllers\Helpers\FilterDom;
use App\Http\Controllers\Helpers\RecordTrail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\User;
use App\Rules\ValidateSlug;
use App\Rules\ValidateTitle;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Base\MaterialController;
use App\Http\Controllers\Helpers\Fetcher;
use Illuminate\Http\JsonResponse;

class AdminMaterialController extends MaterialController
{

    private $fileCustomPath = 'public/upfiles/'; //this is for delete, or checking if file is exist

    public function index()
    {
        return Inertia::render('Admin/Material/AdminMaterialIndex');
    }

    public function getData(Request $req){

        $sort = explode('.', $req->sort_by);
        $status = '';

        if($req->status != '' || $req->status != null){
            $status = $req->status;
        }
        $data = Material::with(['section', 'category', 'encodedBy', 'modifiedBy'])
            ->where('trash', 0)
            ->where('classification', 'scienceph');

        if ($status != '') {
            $data = $data->where('status', $status);
        }
        $data->where('title', 'like', '%'. $req->title . '%');
        return $data->orderBy('id', 'desc')
            ->paginate($req->perpage);
    }


    public function create(){

        $CK_LICENSE = env('CK_EDITOR_LICENSE_KEY');
        //$openController = new OpenController();
        $fetcher = new Fetcher();

        $sections = $fetcher->getSections();
        $tags = $fetcher->getTags();
        $agencies = $fetcher->getAgencies();
        $regions = $fetcher->getRegions();
        $regionalOffices = $fetcher->getRegionalOffices();
        $categories = $fetcher->getCategories();
        $authors = $fetcher->getAuthorsAutocomplete();


        return Inertia::render('Admin/Material/AdminMaterialCreateEdit', [
            'id', 0,
            'ckLicense' => $CK_LICENSE,
            'post' => null,
            'tags' => $tags,
            'agencies' => $agencies,
            'regions' => $regions,
            'categories' => $categories,
            'regionalOffices' => $regionalOffices,
            'sections' => $sections,
            'authors' => $authors
        ]);
    }




    public function edit($id){

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

        return Inertia::render('Admin/Material/AdminMaterialCreateEdit', [
            'id' => $id,
            'ckLicense' => $CK_LICENSE,
            'material' => $material,
            'tags' => $tags,
            'agencies' => $agencies,
            'regions' => $regions,
            'regionalOffices' => $regionalOffices,
            'categories' => $categories,
            'authors' => $authors
        ]);
    }


}
