<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\MaterialSubjectHeading;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SearchController extends Controller
{

    private $limit = 500;

    private function applyTypeFilter($query, string $type): void
    {
        $typeMap = [
            'articles' => 'text',
            'videos' => 'video',
            'people' => 'people',
        ];

        if ($type !== '' && $type !== 'all' && isset($typeMap[$type])) {
            $query->where('a.filter_type', $typeMap[$type]);
        }
    }


    public function searchLatest(Request $req){

        $yearNow = now()->year;

        $validated = $req->validate([
            's'  => 'nullable|string',
            'category' => 'nullable|string',
            'topic'   => 'nullable|string',
            'perpage' => 'nullable|integer',
            'type' => 'nullable|in:all,videos,articles,people',
        ]);

        $search = trim($validated['s'] ?? '');
        $category   = trim($validated['category'] ?? '');
        $topic     = trim($validated['topic']   ?? '');
        $type = trim($validated['type'] ?? 'all');
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
                'c.subject_heading as topic_name',
                'c.slug as topic_slug',
                'd.category as category_name',
                'd.slug as category_slug'
            ])

            ->whereYear('publish_date', '<=', $yearNow)
            ->whereYear('publish_date', '>=', $yearNow - 4); // older than 5 years

        $this->applyTypeFilter($subQuery, $type);

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
        }

        $results = DB::query()
            ->fromSub($subQuery, 't1');


        if (isset($req->category) && $category !== '') {
            $results->where('t1.category_slug', $category);
        }

        if (isset($req->topic) && $topic !== '') {
            $results->where('t1.topic_slug', $topic);
        }

        //add group concat to merge same material with multiple topics
        $results->selectRaw('t1.*,
            GROUP_CONCAT(DISTINCT t1.topic_name SEPARATOR ", ") as topic_names,
            GROUP_CONCAT(DISTINCT t1.topic_slug SEPARATOR ", ") as topic_slugs
        ')->groupBy('t1.id');


        return $results->paginate($perPage);

    }



    public function searchOthers(Request $req){

        $yearNow = now()->year;

        $validated = $req->validate([
            's'  => 'nullable|string',
            'category' => 'nullable|string',
            'topic'   => 'nullable|string',
            'perpage' => 'nullable|integer',
            'type' => 'nullable|in:all,videos,articles,people',
        ]);

        $search = trim($validated['s']  ?? '');
        $category   = trim($validated['category'] ?? '');
        $topic     = trim($validated['topic']   ?? '');
        $type = trim($validated['type'] ?? 'all');
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
                'c.subject_heading as topic_name',
                'c.slug as topic_slug',
                'd.category as category_name',
                'd.slug as category_slug'
            ])
            ->whereYear('publish_date', '<=', $yearNow - 5); // older than 5 years

        $this->applyTypeFilter($subQuery, $type);

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

        if (isset($req->category) && $category !== '') {
            $results->where('t1.category_slug', $category);
        }

        if (isset($req->topic) && $topic !== '' ) {
            $results->where('t1.topic_slug', $topic);
        }

        //add group concat to merge same material with multiple topics
        $results->selectRaw('t1.*,
            GROUP_CONCAT(DISTINCT t1.topic_name SEPARATOR ", ") as topic_names,
            GROUP_CONCAT(DISTINCT t1.topic_slug SEPARATOR ", ") as topic_slugs
        ')->groupBy('t1.id');


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



    // public function categoryLabels(Request $req){

    //     $validated = $req->validate([
    //         's'  => 'nullable|string',
    //         'category' => 'nullable|string',
    //         'topic'   => 'nullable|string',
    //     ]);

    //     $search = trim($validated['s'] ?? '');
    //     $category   = trim($validated['category'] ?? '');
    //     $topic     = trim($validated['topic']   ?? '');

    //     $subQuery = DB::table('materials as a')
    //     //$subQuery = Material::with()
    //         ->join('material_subject_headings as b', 'a.id', '=', 'b.material_id')
    //         ->join('subject_headings as c', 'b.subject_heading_id', '=', 'c.id')
    //         ->join('categories as d', 'c.category_id', '=', 'd.id')
    //         ->select(
    //             'd.id',
    //             'd.category',
    //             'd.slug as category_slug',
    //             'c.slug as topic_slug'
    //         );

    //     if (isset($req->s) && $search !== '') {
    //         $subQuery->whereRaw(
    //             "MATCH(a.title, a.description_text)
    //             AGAINST (? IN NATURAL LANGUAGE MODE)",
    //             [$search]
    //         );
    //     }

    //     //for accurate, we need to count on the subquery
    //     $categories = DB::query()
    //         ->fromSub($subQuery, 't1')
    //         ->select(
    //             't1.*',
    //             DB::raw('COUNT(t1.category_slug) as count')
    //         );

    //     if (!isset($req->s) && $search === '') {
    //         $categories->where('category_slug', $category);
    //     }

    //     // if (isset($req->category) && $category !== '') {
    //     //     $categories->where('category_slug', $category);
    //     // }

    //     // if (isset($req->topic) && $topic !== '') {
    //     //     $categories->where('topic_slug', $topic);
    //     // }

    //     $categories = $categories->groupBy('t1.category_slug')
    //         ->orderByDesc('count')
    //         ->get();

    //     return $categories;
    // }

    public function categoryLabels(Request $req){
        $validated = $req->validate([
            's'  => 'nullable|string',
            'category' => 'nullable|string',
            'topic'   => 'nullable|string',
            'type' => 'nullable|in:all,videos,articles,people',
        ]);

        $search = trim($validated['s'] ?? '');
        $category   = trim($validated['category'] ?? '');
        $topic     = trim($validated['topic']   ?? '');
        $type = trim($validated['type'] ?? 'all');

        $rows = DB::table('materials as a')
            ->join('material_subject_headings as b', 'a.id', '=', 'b.material_id')
            ->join('subject_headings as c', 'b.subject_heading_id', '=', 'c.id')
            ->join('categories as d', 'c.category_id', '=', 'd.id')
            ->select(
                'd.id as category_id',
                'd.category',
                'd.slug as category_slug',
                'c.id as subject_heading_id',
                'c.subject_heading',
                'c.slug as topic_slug',
                DB::raw('COUNT(DISTINCT a.id) as count')
            );

        $this->applyTypeFilter($rows, $type);

        if (isset($req->s) && $search !== '') {
            $rows->whereRaw(
                "MATCH(a.title, a.description_text)
                AGAINST (? IN NATURAL LANGUAGE MODE)",
                [$search]
            );
        }

        if (!isset($req->s) && $search === '') {
            $rows->where('d.slug', $category);
        }

        $rows = $rows
            ->groupBy(
                'd.id',
                'd.category',
                'd.slug',
                'c.id',
                'c.subject_heading',
                'c.slug'
            )
            ->orderBy('d.category')
            ->orderByDesc('count')
            ->get();

        $categories = $rows
            ->groupBy('category_id')
            ->map(function ($items) {
                $first = $items->first();

                return [
                    'id' => $first->category_id,
                    'category' => $first->category,
                    'category_slug' => $first->category_slug,
                    'count' => $items->sum('count'),
                    'topics' => $items->map(function ($item) {
                        return [
                            'id' => $item->subject_heading_id,
                            'subject_heading' => $item->subject_heading,
                            'slug' => $item->topic_slug,
                            'count' => $item->count,
                        ];
                    })->values(),
                ];
            })
            ->values();

        return $categories;

    }





    // public function topicLabels(Request $req){


    //     $validated = $req->validate([
    //         's'  => 'nullable|string',
    //         'category' => 'nullable|string',
    //         'topic'   => 'nullable|string',
    //     ]);

    //     $search = trim($validated['s'] ?? '');
    //     $category   = trim($validated['category'] ?? '');
    //     $topic     = trim($validated['topic']   ?? '');

    //     $subQuery = Material::query()
    //         ->join('material_subject_headings as b', 'materials.id', '=', 'b.material_id')
    //         ->join('subject_headings as c', 'b.subject_heading_id', '=', 'c.id')
    //         ->join('categories as d', 'c.category_id', '=', 'd.id')
    //         ->select(
    //             'c.id',
    //             'c.subject_heading as topic',
    //             'c.slug as topic_slug',
    //             'd.category',
    //             'd.slug as category_slug'
    //         );

    //     /**
    //     * 🔍 FULLTEXT search — SAME logic as main query
    //     */
    //     if ($search !== '') {
    //         $subQuery->whereRaw(
    //             "MATCH(materials.title, materials.description_text)
    //             AGAINST (? IN NATURAL LANGUAGE MODE)",
    //             [$search]
    //         );
    //     }


    //     //for accurate, we need to count on the subquery
    //     $res = DB::query()
    //         ->fromSub($subQuery, 't1')
    //         ->select(
    //             't1.*',
    //             DB::raw('COUNT(t1.topic_slug) as count')
    //         );

    //     if (isset($req->category) && $category !== '') {
    //         $res->where('category_slug', $category);
    //     }

    //     // if (isset($req->topic) && $topic !== '') {
    //     //     $res->where('topic_slug', $topic);
    //     // }

    //     return $res->groupBy('t1.topic_slug')
    //         ->orderByDesc('count')
    //         ->get();

    // }



}
