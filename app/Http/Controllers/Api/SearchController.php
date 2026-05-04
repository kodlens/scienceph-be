<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\MaterialSubjectHeading;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SearchController extends Controller
{

    private $limit = 50;


    public function searchLatest(Request $req){
        $yearNow = now()->year;

        $validated = $req->validate([
            's'  => 'nullable|string',
            'category' => 'nullable|string',
            'topics'   => 'nullable|string',
            'perpage' => 'nullable|integer',
        ]);

        $search = trim($validated['s'] ?? '');
        $category   = trim($validated['category'] ?? '');
        $topics     = trim($validated['topics']   ?? '');
        $perPage = $validated['perpage'] ?? 10;

        $subQuery = DB::table('materials as a')
            ->join('material_subject_headings as b', 'a.id', '=', 'b.material_id')
            ->join('subject_headings as c', 'b.subject_heading_id', '=', 'c.id')
            ->join('categories as d', 'c.category_id', '=', 'd.id')
            ->select([
                'a.id',
                'a.title',
                'a.description',
                'a.description_text',
                'a.slug',
                'a.source_url',
                'a.publish_date',
                'c.subject_heading',
                'c.slug as subject_heading_slug',
                'd.category',
                'd.slug as category_slug'
            ])

            // ->whereRaw(
            //     "MATCH(a.title, a.description_text) AGAINST (? IN NATURAL LANGUAGE MODE)",
            //     [$search]
            // )

            ->whereYear('publish_date', '<=', $yearNow)
            ->whereYear('publish_date', '>=', $yearNow - 4); // older than 5 years

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
            $subQuery->limit($this->limit); //default limit if no search term
        }

        $results = DB::query()
            ->fromSub($subQuery, 't1');


        if (isset($req->category) && $category !== '') {
            $results->where('t1.category_slug', $category);
        }

        if (isset($req->topics) && $topics !== '') {
            $results->where('t1.subject_heading_slug', $topics);
        }

        //count category
        // $categoryCounts = (clone $results)
        //     ->select('category', 'category_slug', DB::raw('COUNT(*) as total'))
        //     ->groupBy('category_slug')
        //     ->get();

        // //count subject heading
        // $subjectHCounts = (clone $results)
        //     ->select('subject_heading', 'subject_heading_slug', DB::raw('COUNT(*) as total'))
        //     ->groupBy('subject_heading_slug')
        //     ->get();



       // return $results->paginate(10);
        return $results->paginate($perPage);

    }



    public function searchOthers(Request $req){

        $yearNow = now()->year;

        $validated = $req->validate([
            's'  => 'nullable|string',
            'category' => 'nullable|string',
            'topic'   => 'nullable|string',
            'perpage' => 'nullable|integer',
        ]);

        $search = trim($validated['s']  ?? '');
        $category   = trim($validated['category'] ?? '');
        $topic     = trim($validated['topic']   ?? '');
        $perPage = $validated['perpage'] ?? 10;

        $subQuery = DB::table('materials as a')
            ->join('material_subject_headings as b', 'a.id', '=', 'b.material_id')
            ->join('subject_headings as c', 'b.subject_heading_id', '=', 'c.id')
            ->join('categories as d', 'c.category_id', '=', 'd.id')
            ->select([
                'a.id',
                'a.title',
                'a.description',
                'a.description_text',
                'a.slug',
                'a.source_url',
                'a.publish_date',
                'c.subject_heading',
                'c.slug as subject_heading_slug',
                'd.category',
                'd.slug as category_slug'
            ])
            ->whereYear('publish_date', '<=', $yearNow - 5); // older than 5 years

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
        }
        else{
            $subQuery->limit($this->limit); //default limit if no search term
        }

        $results = DB::query()
            ->fromSub($subQuery, 't1');

        /**
         * 📚 Category filter
         * if category is not empty and not all
         */
        if (isset($req->category) && $category !== '') {
            $results->where('t1.category_slug', $category);
        }
        if (isset($req->topic) && $topic !== '' ) {
            $results->where('t1.subject_heading_slug', $topic);
        }


        return $results->paginate($perPage);

    }



    public function HTMLCleaner($data){
        // If it's a paginator, get the collection
        if ($data instanceof \Illuminate\Pagination\AbstractPaginator) {
            $collection = $data->getCollection();
        } else {
            // Otherwise, assume it's already a collection
            $collection = $data;
        }

        $collection->transform(function ($item) {
            $clean = trim(
                preg_replace(
                    '/\s+/',
                    ' ',
                    html_entity_decode(strip_tags($item->description))
                )
            );

            $charLimit = 300;
            // Limit to 100 characters
            if (mb_strlen($clean) > $charLimit) {
                $clean = mb_substr($clean, 0, $charLimit) . '...';
            }

            $item->description = $clean;
            return $item;
        });

        // If paginator, set the cleaned collection back
        if ($data instanceof \Illuminate\Pagination\AbstractPaginator) {
            $data->setCollection($collection);
            return $data;
        }

        return $collection;
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
