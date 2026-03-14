<?php

namespace App\Http\Controllers\Base;

/*==================
Coded by: Eshen
Date: March 03, 2026
DOST-STII
Base controller for Materials

===================*/

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Material;
use App\Models\User;
use App\Rules\ValidateSlug;
use App\Rules\ValidateTitle;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Helpers\FilterDom;
use App\Http\Controllers\Helpers\RecordTrail;
use App\Models\Information;
use App\Models\MaterialSubjectHeading;


class MaterialController extends Controller
{
    //
    public function store(Request $req)
    {
        //return $req;

        $req->validate([
            'title' => ['required', new ValidateTitle(0)],
            'author' => ['string', 'nullable'],
            'description' => ['required'],
            'category' => ['required'],
            'filter_type' => ['required', 'string', 'max:50'],
            'subject_headings' => ['nullable', 'array']
            //'publish_date' => ['required'],
        ], [
            'description.required' => 'Description is required.',
        ]);

        try {

            DB::transaction(function () use ($req) {

                /* ==============================
                    Convert base64 images → files and rewrite HTML
                ============================== */
                $filterDom = new FilterDom();
                $modifiedHtml = $filterDom->filterDOM($req->description);

                /* ==============================
                    Clean HTML → plain text
                ============================== */
                $content = $filterDom->htmlToPlainText($req->description);

                $dateFormated = $req->publish_date
                    ? date('Y-m-d', strtotime($req->publish_date))
                    : null;

                /* ==============================
                Covert Array tags to string/plain text
                ============================== */
                $tagsString = null;
                if(isset($req->tags)){

                    foreach($req->tags as $key => $tag){
                        if($key == 0){
                            $tagsString = $tag;
                        }else{
                            $tagsString = $tagsString . ',' .$tag;
                        }
                    }
                }

                $user = Auth::user();
                $name = $user->lname . ',' . $user->fname;

                $data = Material::create([
                    'title' => $req->title,
                    'alias' => Str::slug($req->title),
                    'description' => $modifiedHtml,
                    'description_text' => $content,
                    'filter_type' => $req->filter_type,
                    'category_id' => $req->category,
                    'author' => $req->author,
                    'encoded_by_id' => $user->id,
                    'encoded_at' => now(),
                    'region' => $req->region,
                    'agency' => $req->agency,
                    //'regional_office' => $req->regional_office, //remove for the meantime as discussed last meeting
                    'tags' => $tagsString,
                    'source_url' => $req->source_url,
                    'status' => $req->status,
                    'publish_date' => $dateFormated,
                    'is_publish' => 0,
                    'is_ojt' => $user->role === 'encoder' ? $user->is_ojt : 0,
                    'is_press_release' => $req->is_press_release ? 1 : 0
                    // 'record_trail' => (new RecordTrail())
                    //     ->recordTrail('', 'insert', $user->id, $name),
                ]);


                $subjectHeadings = [];
                foreach ($req->input('subject_headings', []) as $item) {
                    $subjectHeadings[] = [
                        'material_id' => $data['id'],
                        'subject_heading_id' => $item['subject_heading_id'],
                        'score' => $item['score'],
                        'analysis' => $item['analysis'],
                    ];
                }

                MaterialSubjectHeading::insert($subjectHeadings);

                //record activity
                (new RecordTrail())->activityLog(
                    'materials',
                    $data->id,
                    $user->id,
                    'insert',
                    'material created by ' . $name,
                    $data,
                    null
                );

            });



            return response()->json([
                'status' => 'saved',
            ], 200);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function update(Request $req, $id){


        $req->validate([
            'title' => ['required', 'unique:materials,title,' . $id . ',id'],
            'description' => ['required', 'string'],
            'author' => ['string', 'nullable'],
            'category' => ['required'],
            'filter_type' => ['required', 'string', 'max:50'],
            //'publish_date' => ['required'],
        ]);


        try {
            DB::transaction(function () use ($req, $id) {
                // Database operations here

                $filterDom = new FilterDom();
                $modifiedHtml = $filterDom->filterDOM($req->description);

                /* ==============================
                    Clean HTML → plain text
                ============================== */
                $content = $filterDom->htmlToPlainText($req->description);

                $dateFormated = $req->publish_date
                    ? date('Y-m-d', strtotime($req->publish_date))
                    : null;

                //convert tags to string
                $tagsString = null;
                if(isset($req->tags)){

                    foreach($req->tags as $key => $tag){
                        if($key == 0){
                            $tagsString = $tag;
                        }else{
                            $tagsString = $tagsString . ',' .$tag;
                        }
                    }
                }

                //call user for record trail
                $user = Auth::user();
                $name = $user->lname . ',' . $user->fname;

                $data = Material::find($id);
                $data->title = $req->title;
                $data->alias = Str::slug($req->title);
                $data->description = $modifiedHtml;
                $data->description_text = $content;
                $data->filter_type = $req->filter_type;
                $data->category_id = $req->category;
                $data->author = $req->author;
                $data->modified_by_id = $user->id;
                $data->modified_at = now();
                $data->agency = $req->agency ? $req->agency : null;
                $data->region = $req->region ? $req->region : null;
                //$data->regional_office = $req->regional_office ? $req->regional_office : null; ////remove for the meantime as discussed last meeting
                $data->source_url = $req->source_url;
                $data->is_publish = $req->status === 'publish' ? 1 : 0;
                $data->status = $req->status;
                $data->publish_date = $dateFormated;
                $data->tags = $tagsString;

                if($user->role === 'encoder'){
                    $data->is_ojt = $user->is_ojt;
                }

                $data->is_press_release = $req->is_press_release ? 1 : 0;
                //$data->record_trail = (new RecordTrail())->recordTrail($data->record_trail, 'update', $user->id, $name);
                $data->save();

                MaterialSubjectHeading::where('material_id', $id)
                    ->delete();

                $subjectHeadings = [];
                foreach ($req->input('subject_headings', []) as $item) {
                    $subjectHeadings[] = [
                        'material_id' => $id,
                        'subject_heading_id' => $item['subject_heading_id'],
                        'score' => $item['score'],
                        'analysis' => $item['analysis'],
                    ];
                }

                MaterialSubjectHeading::insert($subjectHeadings);

                (new RecordTrail())->activityLog(
                    'materials',
                    $data->id,
                    $user->id,
                    'update',
                    'material updated by ' . $name,
                    $data,
                    Material::find($id)
                );

            });

            return response()->json([
                'status' => 'updated'
            ], 200);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }




    }


     /** ======================================
     * This is delete function
    */
    public function destroy($id)
    {
        $user = Auth::user();

        $data = Material::find($id);

        if (! $data->description) {
            return response()->json([
                'errors' => [
                    'description' => 'No Content.',
                ],
                'message' => 'No image to remove from the content.',
            ], 422);
        }
        /*------------------------------------------------------
            Before executing delete, image must remove from the storage
            to free some memory.
        ------------------------------------------------------*/
        $filterDom = new FilterDom();
        $filterDom->removeImagesFromDOM($data->description);

        $name = $user->lname . ',' . $user->fname;
        //$data->record_trail = (new RecordTrail())->recordTrail($data->record_trail, 'delete', $user->id, $name);
        $data->save();

        Material::destroy($id);

        (new RecordTrail())->activityLog(
            'materials',
            $data->id,
            $user->id,
            'deleted',
            'material deleted by ' . $name,
            $data,
            null
        );


        return response()->json([
            'status' => 'deleted',
        ], 200);
    }

    /** ======================================
     * This is soft trash/soft delete function
    */
    public function trash($id)
    {
        $user = Auth::user();
        $data = Material::find($id);
        $data->status = 'trash';
        $data->trash = 1;
        $name = $user->lname . ',' . $user->fname;
        //$data->record_trail = (new RecordTrail())->recordTrail($data->record_trail, 'trash', $user->id, $name);
        $data->save();

        (new RecordTrail())->activityLog(
            'materials',
            $data->id,
            $user->id,
            'draft',
            'material set to trash by ' . $name,
            $data,
            null
        );

        //remove to info table
        // Information::where('source_id', $id)
        //     ->update([
        //         'is_publish' => 0,
        //     ]);

        return response()->json([
            'status' => 'trash',
        ], 200);
    }

    public function publish($id){

        try {
            DB::transaction(function () use ($id) {
                // Database operations here
                $user = Auth::user();

                $data = Material::find($id);
                $data->status = 'publish'; //submit-for-publishing (static)
                //$data->record_trail = $data->record_trail . 'publish|('.$user->id.')' . $user->lname . ', ' . $user->fname . '|' . date('Y-m-d H:i:s') . ';';
                $data->save();

                (new RecordTrail())->activityLog(
                    'materials',
                    $data->id,
                    $user->id,
                    'publish',
                    'material set to publish by ' . $name,
                    $data,
                    null
                );

            });

            return response()->json([
                'status' => 'publish'
            ], 200);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function draft($id){

        try {
            DB::transaction(function () use ($id) {
                $user = Auth::user();
                $data = Material::find($id);
                $data->status = 'draft';
                $data->is_publish = 0;
                $data->trash = 0;
                //$data->record_trail = $data->record_trail . 'draft|('.$user->id.')' . $user->lname . ', ' . $user->fname . '|' . date('Y-m-d H:i:s') . ';';
                $data->save();

                (new RecordTrail())->activityLog(
                    'materials',
                    $data->id,
                    $user->id,
                    'draft',
                    'material set to draft by ' . $name,
                    $data,
                    null
                );

                // $infoExists = Information::where('alias', $data->alias)->exists();
                // if($infoExists){
                //     Information::where('alias', $data->alias)->update([
                //         'is_publish' => 0
                //     ]);
                // }

            });

            return response()->json([
                'status' => 'draft'
            ], 200);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }


    }





}
