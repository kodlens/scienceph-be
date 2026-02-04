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
use App\Models\Article;
use App\Http\Controllers\Helpers\RecordTrail;
use App\Http\Controllers\Helpers\Fetcher;

class PublisherArticleController extends Controller
{

    private $uploadPath = 'storage/upfiles'; //this is the upload path
    private $fileCustomPath = 'public/upfiles/'; //this is for delete, or checking if file is exist



    public function index()
    {
        return Inertia::render('Publisher/Article/PublisherArticleIndex');
    }

    public function getData(Request $req) : JsonResponse {

        //$sort = explode('.', $req->sort_by);

        $data = Article::with(['section', 'category', 'encodedBy', 'modifiedBy'])
            ->where('trash', 0)
            ->whereIn('status', ['publish', 'draft', 'unpublish'])
            ->when($req->search, function ($q) use ($req) {
                $q->where(function ($qq) use ($req) {
                    $qq->where('title', 'like', '%' . $req->search . '%')
                    ->orWhere('id', 'like', '%' . $req->search . '%');
                });
            })
        ->orderBy('id', 'desc')
        ->paginate($req->perpage);

        return response()->json($data, 200);
    }


     public function create()
    {
        $CK_LICENSE = env('CK_EDITOR_LICENSE_KEY');
        //$openController = new OpenController();
        $fetcher = new Fetcher();

        $sections = $fetcher->getSections();
        $tags = $fetcher->getTags();
        $agencies = $fetcher->getAgencies();
        $regions = $fetcher->getRegions();
        $categories = $fetcher->getCategories();
        $authors = $fetcher->getAuthorsAutocomplete();


        return Inertia::render('Publisher/Article/PublisherArticleCreateEdit', [
            'id', 0,
            'ckLicense' => $CK_LICENSE,
            'post' => null,
            'tags' => $tags,
            'agencies' => $agencies,
            'regions' => $regions,
            'categories' => $categories,
            'sections' => $sections,
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
        $categories = $fetcher->getCategories();
        $authors = $fetcher->getAuthorsAutocomplete();

        $article = Article::find($id);


        return Inertia::render('Publisher/Article/PublisherArticleCreateEdit', [
            'id' => $id,
            'ckLicense' => $CK_LICENSE,
            'article' => $article,
            'tags' => $tags,
            'agencies' => $agencies,
            'regions' => $regions,
            'categories' => $categories,
            'sections' => $sections,
            'authors' => $authors
        ]);
    }



    /** ======================================
     * This is delete function
    ==========================================*/
    public function destroy($id){
        $user = Auth::user();

        $data = Post::find($id);

        if(!$data->description){
            return response()->json([
                'errors' => [
                    'empty_description' => 'No Content.'
                ],
                'message' => 'Error'
            ], 422);
        }
        /*------------------------------------------------------
            Before executing delete, image must remove from the storage
            to free some memory.
        ------------------------------------------------------*/
        $filterDom = new FilterDom();
        $filterDom->removeImagesFromDOM($data->description);

        $data->record_trail = (new RecordTrail())->recordTrail($data->record_trail, 'delete', $user->id, $user->fname . ' ' . $user->lname);
        $data->save();
        Post::destroy($id);


        return response()->json([
            'status' => 'deleted'
        ], 200);
    }


    /** ======================================
     * This is soft delete function
    ==========================================*/
    public function trash($id){
        $user = Auth::user();
        $data = Post::find($id);
        $data->trash = 1;
        $data->save();
        $data->record_trail = $data->record_trail . "trashed|".$user->id."|".$user->lname . ",". $user->fname . "|" . date('Y-m-d H:i:s') . ";";



        return response()->json([
            'status' => 'trashed'
        ], 200);
    }



    /** IMAGE HANDLING */
    /* ================= */
    public function tempUpload(Request $req){
        //return $req;
        $req->validate([
            'featured_image' => ['required', 'mimes:jpg,jpeg,png']
        ]);
        $file = $req->featured_image;
        $fileGenerated = md5($file->getClientOriginalName() . time());
        $imageName = $fileGenerated . '.' . $file->getClientOriginalExtension();
        $imagePath = $file->storeAs('public/temp', $imageName);
        $n = explode('/', $imagePath);
        return $n[2];
    }

    public function removeUpload($fileName){

        if(Storage::exists('public/temp/' .$fileName)) {

            Storage::delete('public/temp/' . $fileName);

            return response()->json([
                'status' => 'temp_deleted'
            ], 200);
        }

        return response()->json([
            'status' => 'temp_error'
        ], 200);
    }


    // //remove from featured_image folder
    public function imageRemove($id, $fileName){

        $data = Post::find($id);
        $data->featured_image = null;
        $data->save();

        if(Storage::exists('public/featured_images/' .$fileName)) {
            Storage::delete('public/featured_images/' . $fileName);

            if(Storage::exists('public/temp/' .$fileName)) {
                Storage::delete('public/temp/' . $fileName);
            }

            return response()->json([
                'status' => 'temp_deleted'
            ], 200);
        }

        return response()->json([
            'status' => 'temp_error'
        ], 200);
    }





    public function postPublish($id){
        $user = Auth::user();

        $data = Post::find($id);
        $data->status = 'publish'; //submit-for-publishing (static)
        $data->record_trail = $data->record_trail . 'publish|('.$user->id.')' . $user->lname . ', ' . $user->fname . '|' . date('Y-m-d H:i:s') . ';';
        $data->save();

        return response()->json([
            'status' => 'publish'
        ], 200);

    }

    public function postUnpublish($id){
        $user = Auth::user();
        $data = Post::find($id);
        $data->status = 'unpublish';
        $data->record_trail = $data->record_trail . 'unpublish|('.$user->id.')' . $user->lname . ', ' . $user->fname . '|' . date('Y-m-d H:i:s') . ';';
        $data->save();

        return response()->json([
            'status' => 'unpublish'
        ], 200);
    }

    public function postReturnToEncoder($id){
        $user = Auth::user();
        $data = Post::find($id);
        $data->status = 'return';
        $data->record_trail = $data->record_trail . 'return to encoder|('.$user->id.')' . $user->lname . ', ' . $user->fname . '|' . date('Y-m-d H:i:s') . ';';

        $data->save();

        return response()->json([
            'status' => 'return'
        ], 200);
    }

    // public function postArchived($id){
    //     $data = Post::find($id);
    //     $data->status_id = 3; //submit-for-publishing (static)
    //     $data->save();

    //     return response()->json([
    //         'status' => 'archived'
    //     ], 200);
    // }

    // public function postSubmitForPublishing($id){
    //     $data = Post::find($id);
    //     $data->status_id = 7; //submit-for-publishing (static)
    //     $data->save();

    //     return response()->json([
    //         'status' => 'submit-for-publishing'
    //     ], 200);
    // }

    public function setPublishDate(Request $req, $id){
        $validated = $req->validate([
            'publish_date' => ['required']
        ]);

        $dateFormatted = date('Y-m-d', strtotime($req->publish_date));
        //return $dateFormatted;
        $data = Post::find($id);
        $data->publication_date = $dateFormatted;
        $data->save();

        return response()->json([
            'status' => 'updated'
        ], 200);
    }



}
