<?php

namespace App\Http\Controllers\Encoder;

use App\Http\Controllers\Controller;
use App\Models\Material;

use App\Models\User;
use App\Rules\ValidateSlug;
use App\Rules\ValidateTitle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Helpers\FilterDom;
use App\Http\Controllers\Helpers\RecordTrail;

use App\Http\Controllers\Helpers\Fetcher; // <--extending the Fetch

use App\Http\Controllers\Base\MaterialController;


class EncoderMaterialController extends MaterialController
{


    public function index()
    {
        return Inertia::render('Encoder/Material/EncoderMaterialIndex');
    }

    public function getData(Request $req)
    {

        $sort = explode('.', $req->sort_by);

        $userId = Auth::user()->id;

        $data = Material::with(['section', 'category', 'encodedBy', 'modifiedBy'])
            ->where('trash', 0)
            ->where('encoded_by_id', $userId);

        if ($req->status != '' || $req->status != null) {
            $data->where('status', $req->status);
        }

        $data->where('title', 'like', '%'.$req->title.'%');

        return $data
            ->orderBy('id', 'desc')
            ->paginate($req->perpage);
    }

    public function create()
    {
        $CK_LICENSE = env('CK_EDITOR_LICENSE_KEY');
        //$openController = new OpenController();
        $fetcher = new Fetcher();

        $tags = $fetcher->getTags();
        $agencies = $fetcher->getAgencies();
        $regionalOffices = $fetcher->getRegionalOffices();
        $regions = $fetcher->getRegions();
        $categories = $fetcher->getCategories();
        $authors = $fetcher->getAuthorsAutocomplete();

        return Inertia::render('Encoder/Material/EncoderMaterialCreateEdit', [
            'id' => 0,
            'ckLicense' => $CK_LICENSE,
            'material' => null,
            'tags' => $tags,
            'agencies' => $agencies,
            'regions' => $regions,
            'regionalOffices' => $regionalOffices,
            'categories' => $categories,
            'authors' => $authors
        ]);
    }



    public function edit($id)
    {
        $CK_LICENSE = env('CK_EDITOR_LICENSE_KEY');

        $fetcher = new Fetcher();

        $sections = $fetcher->getSections();
        $tags = $fetcher->getTags();
        $agencies = $fetcher->getAgencies();
        $regions = $fetcher->getRegions();
        $regionalOffices = $fetcher->getRegionalOffices();
        $categories = $fetcher->getCategories();
        $authors = $fetcher->getAuthorsAutocomplete();
        $material = Material::with(['subject_headings'])->find($id);


        return Inertia::render('Encoder/Material/EncoderMaterialCreateEdit', [
            'id' => $id,
            'ckLicense' => $CK_LICENSE,
            'material' => $material,
            'tags' => $tags,
            'agencies' => $agencies,
            'regions' => $regions,
            'regionalOffices' => $regionalOffices,
            'categories' => $categories,
            'sections' => $sections,
            'authors' => $authors
        ]);
    }


    /** IMAGE HANDLING */
    /* ================= */
    public function tempUpload(Request $req)
    {
        // return $req;
        $req->validate([
            'featured_image' => ['required', 'mimes:jpg,jpeg,png', 'max:1024'],
        ], [
            'featured_image.max' => 'The upload image must not be greater than 1MB in size',
        ]);
        $file = $req->featured_image;
        $fileGenerated = md5($file->getClientOriginalName().time());
        $imageName = $fileGenerated.'.'.$file->getClientOriginalExtension();
        $imagePath = $file->storeAs('public/temp', $imageName);
        $n = explode('/', $imagePath);

        return $n[2];
    }

    public function removeUpload($fileName)
    {

        if (Storage::exists('public/temp/'.$fileName)) {
            Storage::delete('public/temp/'.$fileName);

            return response()->json([
                'status' => 'temp_deleted',
            ], 200);
        }

        // this will remove the image from featured_image
        if (Storage::exists('public/featured_images/'.$fileName)) {
            Storage::delete('public/featured_images/'.$fileName);

            Material::where('featured_image', $fileName)
                ->update([
                    'featured_image' => null,
                ]);

            return response()->json([
                'status' => 'removed',
            ], 200);
        }

        return response()->json([
            'status' => 'temp_error',
        ], 200);
    }

    public function postDraft($id)
    {
        $user = Auth::user();
        $data = Material::find($id);
        $data->status = 'draft'; // submit-for-publishing (static)
        $data->trash = 0; // be sure to set 0 the trash if draft
        $name = $user->lname . ',' . $user->fname;
        $data->record_trail = (new RecordTrail())->recordTrail($data->record_trail, 'draft', $user->id, $name);
        $data->save();

        return response()->json([
            'status' => 'draft',
        ], 200);
    }

    public function postArchived($id)
    {
        $user = Auth::user();
        $name = $user->lname . ',' . $user->fname;

        $data = Material::find($id);
        // $data->status_id = 3; //submit-for-publishing (static)
        $data->status = 'archive'; // submit-for-publishing (static)
        $data->record_trail = (new RecordTrail())->recordTrail($data->record_trail, 'archive', $user->id, $name);
        $data->save();

        return response()->json([
            'status' => 'archive',
        ], 200);
    }

    public function postSubmitForPublishing($id)
    {
        $user = Auth::user();
        $name = $user->lname . ',' . $user->fname;

        $data = Material::find($id);
        $data->status = 'submit'; // submit-for-publishing (static)
        // $data->status_id = 7; //submit-for-publishing (static)
        $data->record_trail = (new RecordTrail())->recordTrail($data->record_trail, 'submit', $user->id, $name);
        $data->save();

        return response()->json([
            'status' => 'submit-for-publishing',
        ], 200);
    }
}
