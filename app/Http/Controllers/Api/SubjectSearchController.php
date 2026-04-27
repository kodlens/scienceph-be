<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Info;
use App\Models\InfoSubjectHeading;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Helpers\SubjectSearch;

class SubjectSearchController extends Controller
{

    private $limit = 0;
    private $paginate = 10;

    public function searchLatest(Request $req){

        $yearNow = now()->year;

        $validated = $req->validate([
            's'  => 'nullable|string',
            'subj' => 'nullable|string',
            'sh'   => 'nullable|string',
        ]);

        $search = trim($validated['s']  ?? '');
        $subj   = trim($validated['subj'] ?? '');
        $sh     = trim($validated['sh']   ?? '');

        //$searchObject = new SubjectSearch();
        //return $searchObject->searchLatestNoKeyword($subj, $sh, $yearNow);

        $subQuery = DB::table('infos as a')
            ->join('material_subject_headings as b', 'a.id', '=', 'b.info_id')
            ->join('subject_headings as c', 'b.subject_heading_id', '=', 'c.id')
            ->join('categories as d', 'c.category_id', '=', 'd.id')
            ->select([
                'a.id',
                'a.title',
                'a.description',
                'a.description_text',
                'a.alias as slug',
                'a.source_url',
                'a.publish_date',
                'c.subject_heading',
                'c.slug as subject_heading_slug',
                'd.category',
                'd.slug as category_slug'
            ])

            ->whereYear('publish_date', '<=', $yearNow)
            ->whereYear('publish_date', '>=', $yearNow - 4) // older than 5 years
            ->groupBy('a.id');

        /**
        🔍 FULLTEXT SEARCH (only when keyword exists)
         */
        if ($search !== '') {
            $subQuery->selectRaw(
                "MATCH(a.title, a.description_text)
                AGAINST (? IN NATURAL LANGUAGE MODE) AS relevance",
                [$search]
            )
            ->whereRaw(
                "MATCH(a.title, a.description_text)
                AGAINST (? IN NATURAL LANGUAGE MODE)",
                [$search]
            )
            ->orderByDesc('relevance', 'DESC');
        }else{
            if ($this->limit > 0) {
                $subQuery->limit($this->limit); //default limit if no search term
            }
        }

        $results = DB::query()
            ->fromSub($subQuery, 't1');

        if ($subj !== '' && $subj !== 'all') {
            $results->where('t1.subject_slug', $subj);
        }

        if ($sh !== '' && $sh !== 'all') {
            $results->where('t1.subject_heading_slug', $sh);
        }

        return $results->paginate($this->paginate);

    }

    public function searchOthers(Request $req){

        $yearNow = now()->year;

        $validated = $req->validate([
            's'  => 'nullable|string',
            'subj' => 'nullable|string',
            'sh'   => 'nullable|string',
        ]);

        $search = trim($validated['s']  ?? '');
        $subj   = trim($validated['subj'] ?? '');
        $sh     = trim($validated['sh']   ?? '');

        $subQuery = DB::table('materials as a')
            ->join('material_subject_headings as b', 'a.id', '=', 'b.material_id')
            ->join('subject_headings as c', 'b.subject_heading_id', '=', 'c.id')
            ->join('subjects as d', 'c.category_id', '=', 'd.id')
            ->select([
                'a.id',
                'a.title',
                'a.description',
                'a.description_text',
                'a.alias as slug',
                'a.source_url',
                'a.publish_date',
                'c.subject_heading',
                'c.slug as subject_heading_slug',
                'd.subject',
                'd.slug as subject_slug'
            ])
            ->whereYear('publish_date', '<', $yearNow - 4)// older than 5 years
            ->groupBy('a.id');

        /**
        🔍 FULLTEXT SEARCH (only when keyword exists)
         */
        if ($search !== '') {
            $subQuery->selectRaw(
                "MATCH(a.title, a.description_text)
                AGAINST (? IN NATURAL LANGUAGE MODE) AS relevance",
                [$search]
            )
            ->whereRaw(
                "MATCH(a.title, a.description_text)
                AGAINST (? IN NATURAL LANGUAGE MODE)",
                [$search]
            )
            ->orderByDesc('relevance');
        }else{
            if ($this->limit > 0) {
                $subQuery->limit($this->limit); //default limit if no search term
            }
        }

        $results = DB::query()
            ->fromSub($subQuery, 't1');

        /**
         * 📚 Subject filter
         * if subject is not empty and not all
         */
        if ($subj !== '' && $subj !== 'all') {
            $results->where('t1.subject_slug', $subj);
        }

        /**
         * 🧩 Subject heading filter
         * if subject heading is not empty and not all
         */
        if ($sh !== '' && $sh !== 'all') {
            $results->where('t1.subject_heading_slug', $sh);
        }


        return $results->paginate($this->paginate);

    }


    /*=====================================
    SUBJECT LABELS FOR SEARCH FILTER
    This will return the list and count of categories based on search key
    =====================================*/
    public function categoryLabels(Request $req){

        $validated = $req->validate([
            's'  => 'nullable|string',
            'category' => 'nullable|string',
            'topic'   => 'nullable|string',
        ]);

        $search = trim($validated['s'] ?? '');
        //$category   = trim($validated['category'] ?? '');
        $topic     = trim($validated['topic']   ?? '');

        $subQuery = DB::table('materials as a')
            ->join('material_subject_headings as b', 'a.id', '=', 'b.material_id')
            ->join('subject_headings as c', 'b.subject_heading_id', '=', 'c.id')
            ->join('categories as d', 'c.category_id', '=', 'd.id')
            ->groupBy('a.id')
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
        }else{
            if ($this->limit > 0) {
                $subQuery->limit($this->limit); //default limit if no search term
            }
        }

        /**
         * 📚 Category filter
         * if category is not empty and not all
         */
        // if ($category !== '' && $category !== 'all') {
        //     $subQuery->where('d.slug', $category);
        // }

        /**
         * 🧩 Topic filter
         * if topic is not empty and not all
         */
        if ($topic !== '' && $topic !== 'all') {
            $subQuery->where('c.slug', $topic);
        }

        //for accurate, we need to count on the subquery
        $categories = DB::query()
            ->fromSub($subQuery, 't1')
            ->select(
                't1.*',
                DB::raw('COUNT(t1.category) as count')
            )
            ->groupBy('t1.category')
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
            ->groupBy('a.id')
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
        }else{
            if ($this->limit > 0) {
                $subQuery->limit($this->limit); //default limit if no search term
            }
        }

        //for accurate, we need to count on the subquery
        $res = DB::query()
            ->fromSub($subQuery, 't1')
            ->select(
                't1.*',
                DB::raw('COUNT(t1.subject_heading) as count')
            );


        if ($category !== '' && $category !== 'all') {
            $res->where('category_slug', $category);
        }


        if ($topic !== '' && $topic !== 'all') {
            $res->where('subject_heading_slug', $topic);
        }



        return $res->groupBy('t1.subject_heading')
            ->orderByDesc('count')
            ->get();

    }


}
