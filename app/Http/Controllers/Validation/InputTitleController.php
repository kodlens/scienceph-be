<?php

namespace App\Http\Controllers\Validation;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Material;

class InputTitleController extends Controller
{
    public function inputMaterial(Request $request, $id)
    {
        $exists = Material::where('title', $request->title)
            ->where('id', '!=', $id)
            ->exists();

        if($exists){
            return response()->json([
                'errors' => [
                    'title' => ['Title already exist.']
                ],
                'message' => 'Title already exist.'
            ], 422);
        }

    }
}
