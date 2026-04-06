<?php
/* ============================
    CODED: ETIENNE WAYNE AMPZ
    COMPANY: DOST-STII
    MARCH 04, 2026

    SCIENCEPH BACKEND API
 ============================= */

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Material;
use Illuminate\Support\Facades\DB;
use \Carbon\Carbon;

class MaterialController extends Controller
{

    /* ============================
    Load latest articles with description containing images
    This is for the latest articles on the welcome main page
    ============================= */
    public function loadLatestMaterials()
    {
        $latestNews = Material::where('status', 'publish')
            ->where('description', 'like', '%'. '<img src' . '%')
            ->orderBy('publish_date', 'desc')
            ->take(11)
            ->get([
                'id',
                'title',
                'slug',
                'description',
                'description_text',
                'author',
                'publish_date',
                'is_press_release'
            ]);

        return response()->json($latestNews);
    }

    public function loadPopularMaterials() {
        $monthsAgo = Carbon::now()->subMonths(3);

        $data = Material::where('status', 'publish')
            ->with('category')

            ->whereDate('publish_date', '>=', $monthsAgo)
            ->where('description', 'NOT LIKE', '%<img src%')
            ->orderBy('hits', 'desc')
            ->take(6)
            ->get([
                'id',
                'title',
                'slug',
                'description',
                'description_text',
                'author',
                'publish_date',
                'is_press_release',
                'category_id'
            ]);

        return response()->json($data);
    }



    public function getMaterial($slug){
        return Material::where('slug', $slug)
            ->select('id', 'title', 'description', 'description_text', 'slug', 'category_id', 'author', 'publish_date', 'is_press_release')
            ->with('category')
            ->first();
    }

    public function materialsBySubject(Request $req){

        $search = $req->search;
        $subject = $req->subject;

        // ===== GET RELATED SUBJECTS =====
        $subjects = DB::table('info_subject_headings as a')
            ->join('materials as b', 'a.info_id', '=', 'b.id')
            ->join('subject_headings as c', 'a.subject_heading_id', '=', 'c.id')
            ->join('subjects as d', 'c.subject_id', '=', 'd.id')
            ->select(
                'b.id',
                'b.title',
                'b.description',
                'b.description_text',
                'c.subject_heading',
                'd.subject',
                'd.slug'
            )
            ->selectRaw("
                COALESCE(
                    MATCH(b.title, b.description) AGAINST (? IN NATURAL LANGUAGE MODE),
                    0
                ) AS relevance
            ", [$search])
            ->where('d.slug', $subject)
            ->where(function ($q) use ($search) {
                $q->whereRaw("MATCH(b.title, b.description) AGAINST (? IN NATURAL LANGUAGE MODE)", [$search])
                ->orWhere('b.title', 'LIKE', "%{$search}%")
                ->orWhere('b.description', 'LIKE', "%{$search}%");
            })
            ->orderByDesc('relevance')
            ->paginate(10);

            return $subjects;
    }

    public function loadRelatedMaterial($slug) {

        $info = Material::where('slug', $slug)->first();

        $relatedMaterials = Material::select('id', 'title', 'slug', 'description_text', 'publish_date')
            ->selectRaw("MATCH(title, description_text) AGAINST (? IN NATURAL LANGUAGE MODE) AS relevance", [$info->title])
            ->whereRaw("MATCH(title, description_text) AGAINST (? IN NATURAL LANGUAGE MODE)", [$info->title])
            ->where('id', '!=', $info->id)  // exclude current material
            ->orderByDesc('publish_date')
            ->orderByDesc('relevance')
            ->limit(10)
            ->get();


        return $relatedMaterials;
    }


    //get materials by category
    public function getMaterialsByCategory($slug) {
        
        $materials = Material::whereHas('category', function($query) use ($slug) {
            $query->where('slug', $slug);
        })
        ->where('status', 'publish')
        ->orderBy('publish_date', 'desc')
        ->select(['id', 'title', 'slug', 'description_text', 'publish_date'])
        ->paginate(10);

        return response()->json($materials);

    }
}
