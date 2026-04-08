<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Material;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'total' => Material::count(),
            'published' => Material::where('is_publish', 1)->count(),
            'draft' => Material::where('is_publish', 0)->count(),
            'trashed' => Material::where('trash', 1)->count(),
            'press' => Material::where('is_press_release', 1)->count(),
            'total_views' => Material::sum('hits'),
            'this_month' => Material::whereMonth('created_at', Carbon::now()->month)->count(),
        ]);
    }

    // public function materialCount(){
    //     return Material::count();
    // }

    // public function publishedCount(){
    //     $data = Material::where('is_publish', 1)->count();
    //     return response()->json(['count' => $data]);
    // }

    // public function draftCount(){
    //     $data = Material::where('is_publish', 0)->count();
    //     return response()->json(['count' => $data]);
    // }

    // public function trashedCount(){
    //     $data = Material::where('trash', 1)->count();
    //     return response()->json(['count' => $data]);
    // }

    // public function pressCount(){
    //     return Material::where('is_press_release', 1)->count();
    // }

    // public function totalViews(){
    //     return Material::sum('hits');
    // }

    // public function thisMonthCount(){
    //     return Material::whereMonth('created_at', Carbon::now()->month)->count();
    // }

    public function monthly()
    {
        return Material::select(
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
        return Material::select('id','title','status','publish_date','created_at')
            ->latest()
            ->limit(5)
            ->get();
    }

    public function topArticles()
    {
        return Material::select('id','title','hits','publish_date')
            ->orderByDesc('hits')
            ->limit(5)
            ->get();
    }

    public function topLastSixMonths()
    {
        return Material::select('id', 'title', 'hits', 'publish_date')
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

        $results = Material::select(
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
