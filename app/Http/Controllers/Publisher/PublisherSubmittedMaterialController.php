<?php

namespace App\Http\Controllers\Publisher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Material;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;


class PublisherSubmittedMaterialController extends Controller
{
    public function index(){
        return Inertia::render('Publisher/Material/Submitted/PublisherSubmittedMaterialIndex');
    }

    public function getData(Request $req){
        $user = Auth::user();

        $data = Material::where('status', 'submit')
            ->where('encoded_by_id', $user->id)
            ->paginate(10);

        return response()->json($data);
    }
}
