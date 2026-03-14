<?php

namespace App\Http\Controllers\Encoder\Submit;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Material;
use Illuminate\Support\Facades\Auth;

class EncoderSubmitController extends Controller
{
    public function index()
    {
        return Inertia::render('Encoder/Material/Submit/EncoderSubmitMaterialIndex');
    }

    public function getData(Request $req)
    {

        $sort = explode('.', $req->sort_by);

        $userId = Auth::user()->id;

        $data = Material::with(['section', 'category', 'encodedBy', 'modifiedBy'])
            ->where('trash', 0)
            ->where('status', 'submit')
            ->where('encoded_by_id', $userId);

        $data->where('title', 'like', '%'.$req->title.'%');

        return $data
            ->orderBy('id', 'desc')
            ->paginate($req->perpage);
    }
}
