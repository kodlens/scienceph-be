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
use App\Models\MaterialSubjectHeading;

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
         /**
         * ->whereRaw("LOWER(description) REGEXP ?", ['<[^a-zA-Z]*img'])
         * This regex pattern is designed to match <img> tags in a case-insensitive manner,
         * allowing for any non-alphabetic characters (like spaces or attributes)
         * between the '<' and 'img'. It effectively captures various forms of <img> tags, such as:
         *  <img
            < img
            <\nimg
            <(weird chars)img
        */

        // $latestNews = Material::where('status', 'publish')
        //     //->where('description', 'like', '%'. '<img src' . '%')
        //     ->whereRaw("LOWER(description) REGEXP ?", ['<[^a-zA-Z]*img'])
        //     ->orderBy('publish_date', 'desc')
        //     ->take(11)
        //     ->get([
        //         'id',
        //         'title',
        //         'slug',
        //         'description',
        //         'description_text',
        //         'author',
        //         'publish_date',
        //         'is_press_release'
        //     ]);

        $data = MaterialSubjectHeading::join('materials', 'material_subject_headings.material_id', '=', 'materials.id')
            ->join('subject_headings', 'material_subject_headings.subject_heading_id', '=', 'subject_headings.id')
            ->join('categories', 'subject_headings.category_id', '=', 'categories.id')
            ->where('materials.status', 'publish')
            ->whereRaw("LOWER(materials.description) REGEXP ?", ['<[^a-zA-Z]*img'])
            ->groupBy('materials.id')
            ->orderBy('materials.publish_date', 'desc')
            ->take(11)
            ->get([
                'materials.id',
                'materials.title',
                'materials.slug',
                'materials.description',
                'materials.description_text',
                'materials.author',
                'materials.publish_date',
                'materials.is_press_release',
                'categories.category as category_name',
                'categories.slug as category_slug',
                'subject_headings.subject_heading as topic_name',
                'subject_headings.slug as topic_slug'
            ]);

        return response()->json($data);
    }

    public function loadPopularMaterials() {
        $monthsAgo = Carbon::now()->subMonths(3);

        // $data = Material::where('status', 'publish')
        //     ->with('category')

        //     ->whereDate('publish_date', '>=', $monthsAgo)
        //     ->where('description', 'NOT LIKE', '%<img src%')
        //     ->orderBy('hits', 'desc')
        //     ->take(6)
        //     ->get([
        //         'id',
        //         'title',
        //         'slug',
        //         'description',
        //         'description_text',
        //         'author',
        //         'publish_date',
        //         'is_press_release',
        //         'category_id'
        //     ]);
        $data = MaterialSubjectHeading::join('materials', 'material_subject_headings.material_id', '=', 'materials.id')
            ->join('subject_headings', 'material_subject_headings.subject_heading_id', '=', 'subject_headings.id')
            ->join('categories', 'subject_headings.category_id', '=', 'categories.id')
            ->where('materials.status', 'publish')
            ->whereDate('materials.publish_date', '>=', $monthsAgo)
            ->where('materials.description', 'NOT LIKE', '%<img src%')
            ->groupBy('materials.id')
            ->orderBy('materials.hits', 'desc')
            ->take(6)
            ->get([
                'materials.id',
                'materials.title',
                'materials.slug',
                'materials.description',
                'materials.description_text',
                'materials.author',
                'materials.publish_date',
                'materials.is_press_release',
                'categories.category as category_name',
                'categories.slug as category_slug',
                'subject_headings.subject_heading as topic_name',
                'subject_headings.slug as topic_slug'
            ]);

        return response()->json($data);
    }



    public function getMaterial($slug){
        return Material::where('materials.slug', $slug)
            ->join('material_subject_headings', 'materials.id', '=', 'material_subject_headings.material_id')
            ->join('subject_headings', 'material_subject_headings.subject_heading_id', '=', 'subject_headings.id')
            ->select(
                'materials.id',
                'materials.title',
                'materials.description',
                'materials.description_text',
                'materials.slug',
                'materials.author',
                'materials.publish_date',
                'materials.is_press_release'
            )
            ->selectRaw('GROUP_CONCAT(subject_headings.subject_heading) as topics')
            ->groupBy('materials.id')
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

        $info = Material::where('slug', $slug)
            ->first(['id', 'title']);

        if (!$info) {
            abort(404, 'Material not found.');
        }

        $relatedMaterials = Material::query()
            ->select(
                'materials.id',
                'materials.title',
                'materials.slug',
                'materials.description_text',
                'materials.publish_date'
            )
            ->selectRaw("MATCH(materials.title, materials.description_text) AGAINST (? IN NATURAL LANGUAGE MODE) AS relevance", [$info->title])
            ->selectRaw('(
                SELECT GROUP_CONCAT(DISTINCT subject_headings.subject_heading SEPARATOR ", ")
                FROM material_subject_headings
                INNER JOIN subject_headings ON material_subject_headings.subject_heading_id = subject_headings.id
                WHERE material_subject_headings.material_id = materials.id
            ) as subject_heading')
            ->selectRaw('(
                SELECT GROUP_CONCAT(DISTINCT categories.category SEPARATOR ", ")
                FROM material_subject_headings
                INNER JOIN subject_headings ON material_subject_headings.subject_heading_id = subject_headings.id
                INNER JOIN categories ON subject_headings.category_id = categories.id
                WHERE material_subject_headings.material_id = materials.id
            ) as category')
            ->selectRaw('(
                SELECT categories.slug
                FROM material_subject_headings
                INNER JOIN subject_headings ON material_subject_headings.subject_heading_id = subject_headings.id
                INNER JOIN categories ON subject_headings.category_id = categories.id
                WHERE material_subject_headings.material_id = materials.id
                ORDER BY categories.id
                LIMIT 1
            ) as category_slug')
            ->whereRaw("MATCH(materials.title, materials.description_text) AGAINST (? IN NATURAL LANGUAGE MODE)", [$info->title])
            ->where('materials.id', '!=', $info->id)
            ->where('materials.status', 'publish')
            ->orderByDesc('relevance')
            ->orderByDesc('materials.publish_date')
            ->limit(10)
            ->get();


        return $relatedMaterials;
    }


    //get materials by category
    public function searchMaterialsByCategory($slug) {

        $materials = Material::whereHas('category', function($query) use ($slug) {
            $query->where('slug', $slug);
        })
        ->where('status', 'publish')
        ->orderBy('publish_date', 'desc')
        ->select(['id', 'title', 'slug', 'description_text', 'publish_date'])
        ->paginate(10);

        return response()->json($materials);

    }






    public function categoryLabels(Request $req){

        $validated = $req->validate([
            's'  => 'nullable|string',
            'category' => 'nullable|string',
            'topic'   => 'nullable|string',
        ]);

        $search = trim($validated['s'] ?? '');
        $category   = trim($validated['category'] ?? '');
        $topic     = trim($validated['topic']   ?? '');

        $subQuery = DB::table('materials as a')
            ->join('material_subject_headings as b', 'a.id', '=', 'b.material_id')
            ->join('subject_headings as c', 'b.subject_heading_id', '=', 'c.id')
            ->join('categories as d', 'c.category_id', '=', 'd.id')
            ->select(
                'd.id',
                'd.category',
                'd.slug'
            );

        /**
        * 🔍 FULLTEXT search if there is search keyword
        */
        if ($search !== '') {
            $subQuery->whereRaw(
                "MATCH(a.title, a.description_text)
                AGAINST (? IN NATURAL LANGUAGE MODE)",
                [$search]
            );
        }

        // if (isset($req->topic) && $topic !== '') {
        //     $subQuery->where('c.slug', $topic);
        // }

        //for accurate, we need to count on the subquery
        $categories = DB::query()
            ->fromSub($subQuery, 't1')
            ->select(
                't1.*',
                DB::raw('COUNT(t1.slug) as count')
            )
            ->groupBy('t1.slug')
            ->orderByDesc('count')
            ->get();

        return $categories;

    }

    public function topicLabels(Request $req){


        $validated = $req->validate([
            's'  => 'nullable|string',
            'category' => 'nullable|string',
            'topic'   => 'nullable|string',
        ]);

        $search = trim($validated['s'] ?? '');
        $category   = trim($validated['category'] ?? '');
        $topic     = trim($validated['topic']   ?? '');

        $subQuery = DB::table('materials as a')
            ->join('material_subject_headings as b', 'a.id', '=', 'b.material_id')
            ->join('subject_headings as c', 'b.subject_heading_id', '=', 'c.id')
            ->join('categories as d', 'c.category_id', '=', 'd.id')
            ->select(
                'c.id',
                'c.subject_heading',
                'c.slug as subject_heading_slug',
                'd.category',
                'd.slug as category_slug'
            );

        /**
        * 🔍 FULLTEXT search — SAME logic as main query
        */
        if ($search !== '') {
            $subQuery->whereRaw(
                "MATCH(a.title, a.description_text)
                AGAINST (? IN NATURAL LANGUAGE MODE)",
                [$search]
            );
        }
        //remove for the meantime
        // else{
        //     if ($this->limit > 0) {
        //         $subQuery->limit($this->limit); //default limit if no search term
        //     }
        // }

        //for accurate, we need to count on the subquery
        $res = DB::query()
            ->fromSub($subQuery, 't1')
            ->select(
                't1.*',
                DB::raw('COUNT(t1.subject_heading) as count')
            );


        if (isset($req->category) && $category !== '') {
            $res->where('category_slug', $category);
        }


        if (isset($req->topic) && $topic !== '') {
            $res->where('subject_heading_slug', $topic);
        }

        return $res->groupBy('t1.subject_heading')
            ->orderByDesc('count')
            ->get();

    }


}
