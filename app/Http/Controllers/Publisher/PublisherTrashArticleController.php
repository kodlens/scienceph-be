<?php

namespace App\Http\Controllers\Publisher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Article;

class PublisherTrashArticleController extends Controller
{
    //


    public function index(){
        return Inertia::render('Publisher/Article/Trash/TrashArticleIndex');
    }

    //get trash list
    public function getData(Request $req){

        $perPage = $req->integer('perpage', 10);
        $status  = $req->string('status')->toString();
        $title  = $req->string('title')->toString();

        $query = Article::query()
            ->with(['section', 'category', 'encodedBy', 'modifiedBy'])
            ->where('trash', 1);

        if(!empty($req->encoder)){
            $query->whereHas('encodedBy', function($q) use ($req){
                $q->where('lname', $req->encoder)
                ->orWhere('fname', $req->encoder);
            });
        }

        if(!empty($req->modifier)){
            $query->whereHas('modifiedBy', function($q) use ($req){
                $q->where('lname', $req->modifier)
                ->orWhere('fname', $req->modifier);
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
        $articles = $query
            ->orderByDesc('id')
            ->paginate($perPage);

        return response()->json($articles);
    }

}
