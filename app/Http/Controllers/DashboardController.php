<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'total' => Article::count(),
            'published' => Article::where('is_publish', 1)->count(),
            'draft' => Article::where('is_publish', 0)->count(),
            'trashed' => Article::where('trash', 1)->count(),
            'press' => Article::where('is_press_release', 1)->count(),
            'total_views' => Article::sum('hits'),
            'this_month' => Article::whereMonth('created_at', Carbon::now()->month)->count(),
        ]);
    }

    public function monthly()
    {
        return Article::select(
            DB::raw('MONTH(publish_date) as month'),
            DB::raw('COUNT(*) as total')
        )
        ->where('is_publish', 1)
        ->groupBy('month')
        ->orderBy('month')
        ->get();
    }


    public function recent()
    {
        return Article::select('id','title','status','publish_date','created_at')
            ->latest()
            ->limit(5)
            ->get();
    }

    public function topArticles()
    {
        return Article::select('id','title','hits','publish_date')
            ->orderByDesc('hits')
            ->limit(5)
            ->get();
    }

    public function topLastSixMonths()
    {
        return Article::select('id', 'title', 'hits', 'publish_date')
            ->where('is_publish', 1)
            ->where('publish_date', '>=', Carbon::now()->subMonths(6))
            ->orderByDesc('hits')
            ->limit(5)
            ->get();
    }


    public function articlesLastSixMonths()
    {
        $startDate = Carbon::now()->subMonths(5)->startOfMonth();
        $endDate = Carbon::now()->endOfMonth();

        $results = Article::select(
                DB::raw("YEAR(publish_date) as year"),
                DB::raw("MONTH(publish_date) as month"),
                DB::raw("COUNT(*) as total")
            )
            ->where('is_publish', 1)
            ->whereBetween('publish_date', [$startDate, $endDate])
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        return response()->json($results);
    }

}
