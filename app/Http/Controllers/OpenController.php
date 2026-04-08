<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Section;
use App\Models\Category;
use App\Models\Agency;
use App\Models\Material;
use App\Models\Region;
use App\Models\Subject;
use App\Models\SubjectHeading;
use App\Models\FilterType;
use Illuminate\Http\JsonResponse;



class OpenController extends Controller
{

    public function getSubjects(){
        $subjects = Subject::where('active', 1)->with('subject_headings')->get();
        return response()->json($subjects);
    }

    public function getSubjectHeadingsWithParams(Request $req, $subjectId){
        if($req->has('search') && $req->search != ''){

            if($subjectId == 0){
                $subjectHeadings = SubjectHeading::where('active', 1)
                ->where('subject_heading', 'like', '%'.$req->search.'%')
                ->get();
            }else {
                $subjectHeadings = Category::find($subjectId)->subject_headings()
                    ->where('active', 1)
                    ->where('subject_heading', 'like', '%'.$req->search.'%')
                    ->get();
            }
            return response()->json($subjectHeadings);
        }else{
            if($subjectId == 0){
                $subjectHeadings = SubjectHeading::where('active', 1)->get();
            } else {
                $subjectHeadings = Category::find($subjectId)->subject_headings()
                    ->where('active', 1)
                    ->get();
            }

            return response()->json($subjectHeadings);
        }
    }


    public function getSubjectHeadings(Request $req){

        if($req->has('search') && $req->search != ''){
            $data = SubjectHeading::where('active', 1)
            ->where('subject_heading', 'like', '%'.$req->search.'%')
            ->get();
            return response()->json($data);
        } else {

            $data = SubjectHeading::where('active', 1)->get();
            return response()->json($data);
        }
    }


    public function getSections() : JsonResponse{
        $data = Section::where('active', 1)->get();
        return response()->json($data);
    }

    public function getCategories(): JsonResponse{
        $data = Category::where('active', 1)->get();
        return response()->json($data);
    }

     public function getRegions(): JsonResponse{
        $data = Region::where('active', 1)
        ->orderBy('order_no', 'asc')
        ->get();
        return response()->json($data);
    }

     public function getAgencies(): JsonResponse{
        $data = Agency::where('active', 1)->get();
        return response()->json($data);
    }

    public function getFilterTypes(): JsonResponse{
        $data = FilterType::where('active', 1)->get();
        return response()->json($data);
    }

    public function getAuthorsAutocomplete(Request $req): JsonResponse{

        if($req->has('search') && $req->search != ''){
            $data = Article::where('author', 'like', $req->search.'%')
                ->distinct('author')
                ->select('author')
                ->orderBy('author', 'asc')
                ->get();
        } else {
            $data = Article::distinct('author')
                ->select('author')
                ->orderBy('author', 'asc')
                ->limit(10)
                ->get();
        }

        return response()->json($data);
    }


    public function getTags():JsonResponse{
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

        return response()->json($tags);
    }


}

