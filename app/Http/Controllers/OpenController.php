<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Section;
use App\Models\Category;
use App\Models\Agency;
use App\Models\Region;
use Illuminate\Http\JsonResponse;
class OpenController extends Controller
{
    public function getSections() : JsonResponse{
        $data = Section::where('active', 1)->get();
        return response()->json($data);
    }

    public function getCategories(): JsonResponse{
        $data = Category::where('active', 1)->get();
        return response()->json($data);
    }

     public function getRegions(): JsonResponse{
        $data = Region::where('active', 1)
        ->orderBy('order_no', 'asc')
        ->get();
        return response()->json($data);
    }

     public function getAgencies(): JsonResponse{
        $data = Agency::where('active', 1)->get();
        return response()->json($data);
    }



}
