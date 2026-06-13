<?php

namespace App\Http\Controllers\ExternalEncoder;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Material;
use Illuminate\Support\Facades\Auth;

class EEMaterialController extends Controller
{
        public function index()
    {
        return Inertia::render('ExternalEncoder/Material/ExternalEncoderMaterialIndex');
    }

    public function getData(Request $req)
    {

        $sort = explode('.', $req->sort_by);

        $userId = Auth::user()->id;

        $data = Material::with(['section', 'category', 'encodedBy', 'modifiedBy'])
            ->where('trash', 0)
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
        $CK_LICENSE = config('app.ck_license');

        //$openController = new OpenController();
        $fetcher = new Fetcher();

        $tags = $fetcher->getTags();
        $agencies = $fetcher->getAgencies();
        $regionalOffices = $fetcher->getRegionalOffices();
        $regions = $fetcher->getRegions();
        //$categories = $fetcher->getCategories();
        $authors = $fetcher->getAuthorsAutocomplete();

        return Inertia::render('Encoder/Material/EncoderMaterialCreateEdit', [
            'id' => 0,
            'ckLicense' => $CK_LICENSE,
            'material' => null,
            'tags' => $tags,
            'agencies' => $agencies,
            'regions' => $regions,
            //'regionalOffices' => $regionalOffices,
            //'categories' => $categories,
            'authors' => $authors
        ]);
    }



    public function edit($id)
    {
        $CK_LICENSE = config('app.ck_license');

        $fetcher = new Fetcher();
        $sections = $fetcher->getSections();
        $tags = $fetcher->getTags();
        $agencies = $fetcher->getAgencies();
        $regions = $fetcher->getRegions();
        //$regionalOffices = $fetcher->getRegionalOffices();
        //$categories = $fetcher->getCategories();
        $authors = $fetcher->getAuthorsAutocomplete();
        $material = Material::with(['subject_headings'])->find($id);


        return Inertia::render('Encoder/Material/EncoderMaterialCreateEdit', [
            'id' => $id,
            'ckLicense' => $CK_LICENSE,
            'material' => $material,
            'tags' => $tags,
            'agencies' => $agencies,
            'regions' => $regions,
            //'regionalOffices' => $regionalOffices,
            //'categories' => $categories,
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
}
