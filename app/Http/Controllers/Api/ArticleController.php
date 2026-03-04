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
use App\Models\Article;
use Illuminate\Support\Facades\DB;
use \Carbon\Carbon;

class ArticleController extends Controller
{

    /* ============================
    Load latest articles with description containing images
    This is for the latest articles on the welcome main page
    ============================= */
    public function loadLatestArticles()
    {
        $latestNews = Article::where('status', 'publish')
            ->where('description', 'like', '%'. '<img src' . '%')
            ->orderBy('publish_date', 'desc')
            ->take(11)
            ->get([
                'id',
                'title',
                'alias as slug',
                'description',
                'description_text',
                'author',
                'publish_date',
                'is_press_release'
            ]);

        return response()->json($latestNews);
    }

    public function loadPopularArticles() {
        $monthsAgo = Carbon::now()->subMonths(3);

        $data = Article::where('status', 'publish')
            ->with('category')
            ->orderBy('hits', 'desc')
            ->whereDate('publish_date', '>=', $monthsAgo)
            ->take(6)
            ->get([
                'id',
                'title',
                'alias as slug',
                'description',
                'description_text',
                'author',
                'publish_date',
                'is_press_release',
                'category_id'
            ]);

        return response()->json($data);
    }



    public function loadArticle($slug){
        return Info::where('alias', $slug)
            ->select('id', 'title', 'description', 'description_text', 'alias as slug',
                'publish_date')
            ->first();
    }

    public function articlesBySubject(Request $req){

        $search = $req->search;
        $subject = $req->subject;

        // ===== GET RELATED SUBJECTS =====
        $subjects = DB::table('info_subject_headings as a')
            ->join('infos as b', 'a.info_id', '=', 'b.id')
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

    public function loadRelatedArticle($slug) {

        $info = Info::where('alias', $slug)->first();

        $relatedArticles = Info::select('id', 'title', 'alias as slug', 'description_text', 'publish_date')
            ->selectRaw("MATCH(title, description_text) AGAINST (? IN NATURAL LANGUAGE MODE) AS relevance", [$info->title])
            ->whereRaw("MATCH(title, description_text) AGAINST (? IN NATURAL LANGUAGE MODE)", [$info->title])
            ->where('id', '!=', $info->id)  // exclude current article
            ->orderByDesc('publish_date')
            ->orderByDesc('relevance')
            ->limit(10)
            ->get();


        return $relatedArticles;
    }
}
