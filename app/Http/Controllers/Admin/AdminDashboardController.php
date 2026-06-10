<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;


class AdminDashboardController extends Controller
{
    //
    public function index(){
        return Inertia::render('Admin/AdminDashboard');
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

    // public function topArticles()
    // {
    //     return Article::select('id','title','hits','publish_date')
    //         ->orderByDesc('hits')
    //         ->limit(5)
    //         ->get();
    // }


}
