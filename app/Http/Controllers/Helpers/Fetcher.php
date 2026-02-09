<?php
namespace App\Http\Controllers\Helpers;
use App\Models\Section;
use App\Models\Category;
use App\Models\Region;
use App\Models\Agency;
use App\Models\Article;
use App\Models\RegionalOffice;

class Fetcher {

public function getSections() {
        $data = Section::where('active', 1)->get();
        return $data;
    }

    public function getCategories(){
        $data = Category::where('active', 1)->get();
        //return response()->json($data);
        return $data;
    }

    public function getRegions(){
        $data = Region::where('active', 1)
        ->orderBy('order_no', 'asc')
        ->get();
        return $data;

    }



    public function getRegionalOffices(){
        $data = RegionalOffice::where('active', 1)
        ->orderBy('order_no', 'asc')
        ->get();
        return $data;

    }

     public function getAgencies(){
        $data = Agency::where('active', 1)->get();
        return $data;

    }

    public function getAuthorsAutocomplete(){
            $data = Article::distinct('author')
            ->select('author')
            ->orderBy('author', 'asc')
            ->get();

        return $data;

    }


    public function getTags(){
        $data = Article::distinct('tags')
            ->select('tags')
            ->orderBy('tags', 'asc')
            ->get();

        $tags = [];

        foreach($data as $key => $tag){
            if(empty($tag->tags)) continue;
            $explodedTags = explode(',', $tag->tags);
            foreach($explodedTags as $explodedTag){
                if(in_array(ucwords($explodedTag), $tags)) continue;
                array_push($tags, ucwords($explodedTag));
            }
        }

        return $tags;
    }


}
