<?php

namespace App\Http\Controllers\Base;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Article;
use App\Models\User;
use App\Rules\ValidateSlug;
use App\Rules\ValidateTitle;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Helpers\FilterDom;
use App\Http\Controllers\Helpers\RecordTrail;


class ArticleController extends Controller
{
    //
    public function store(Request $req)
    {
        $req->validate([
            'title' => ['required', new ValidateTitle(0)],
            'author' => ['required', 'string', 'nullable'],
            'description' => ['required'],
            'category' => ['required'],
            'section' => ['required'],
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

                $user = Auth::user();
                $name = $user->lname . ',' . $user->fname;

                $post = Article::create([
                    'title' => $req->title,
                    'alias' => Str::slug($req->title),
                    //'excerpt' => $req->excerpt,
                    'description' => $modifiedHtml,
                    'description_text' => $content,
                    'section_id' => $req->section,
                    'category_id' => $req->category,
                    'author' => $req->author,
                    'encoded_by_id' => $user->id,
                    'encoded_at' => now(),
                    'region' => $req->region,
                    'agency' => $req->agency,
                    'tags' => $req->tags,
                    'source_url' => $req->source_url,
                    'status' => $req->status,
                    'publish_date' => $dateFormated,
                    'is_publish' => 0,
                    'is_press_release' => $req->is_press_release ? 1 : 0,
                    'record_trail' => (new RecordTrail())
                        ->recordTrail('', 'insert', $user->id, $name),
                ]);
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
        //return $req;
        $req->validate([
            'title' => ['required', 'unique:articles,title,' . $id . ',id'],
            'description' => ['required', 'string'],
            'category' => ['required'],
            'section' => ['required'],
        ]);


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
        // $tagsString = '';
        // foreach($req->tags as $key => $tag){
        //     if($key == 0){
        //         $tagsString = $tag;
        //     }else{
        //         $tagsString = $tagsString . ',' .$tag;
        //     }
        // }

        //call user for record trail
        $user = Auth::user();
        $name = $user->lname . ',' . $user->fname;

        //update data in table articles
        $data = Article::find($id);
        $data->title = $req->title;
        $data->alias = Str::slug($req->title);
        $data->description = $modifiedHtml;
        $data->description_text = $content;
        $data->section_id = $req->section;
        $data->category_id = $req->category;
        $data->author = $req->author;
        $data->modified_by_id = $user->id;
        $data->modified_at = now();
        $data->region = $req->region;
        //$data->tags = $tagsString;
        $data->source_url = $req->source_url;
        $data->status = $req->status;
        $data->publish_date = $dateFormated;
        $data->is_press_release = $req->is_press_release ? 1 : 0;
        $data->record_trail = (new RecordTrail())->recordTrail($data->record_trail, 'update', $user->id, $name);
        $data->save();

        // $info = Information::where('article_id', $id)
        //     ->update([
        //         'title' => $req->title,
        //         'description' => $modifiedHtml,
        //         'alias' => Str::slug($req->title),
        //         'agency_code' => 'DOST-STII',
        //         'tags' => $tagsString,
        //         'source' => 'scienceph',
        //         'source_url' => 'https://www.science.ph',
        //         'content_type' => 'blog',
        //         'region' => $req->region,
        //         'is_publish' => 0,
        //     ]);

        return response()->json([
            'status' => 'updated'
        ], 200);

    }



}
