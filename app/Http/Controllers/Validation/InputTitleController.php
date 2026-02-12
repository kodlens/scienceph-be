<?php

namespace App\Http\Controllers\Validation;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Article;

class InputTitleController extends Controller
{
    public function inputTitle(Request $request, $id)
    {
        $exists = Article::where('title', $request->title)
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
