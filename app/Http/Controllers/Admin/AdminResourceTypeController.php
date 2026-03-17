<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\ResourceType;

class AdminResourceTypeController extends Controller
{
    //

    public function index(){
        return Inertia::render('Admin/ResourceTypes/AdminResourceTypeIndex');
    }

    public function getData(Request $request)
    {
        $query = ResourceType::query()->where('active', 1);

        if ($request->has('search') && !empty($request->search)) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }


        $resourceTypes = $query->orderBy('created_at', 'desc')->paginate(10);

        return $resourceTypes;
    }
}
