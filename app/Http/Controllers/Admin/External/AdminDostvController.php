<?php

namespace App\Http\Controllers\Admin\External;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

class AdminDostvController extends Controller
{
    public function index(){
        return Inertia::render('Admin/ExternalApi/Dostv/DostvIndex');
    }

    public function getData(Request $req)
    {
        $dostvs = DB::table('materials')
            ->where('classification', 'dostv')
            ->pagination();

        return $dostvs;
    }
}
