<?php

namespace App\Http\Controllers\External;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DostvPostController extends Controller
{
    //function that will call API
    //add header X-API-TOKEN with value of DOSTV_API_KEY in .env file

    public function getPosts(Request $req)
    {
        $apiKey = config('cache.DOSTV_API_KEY');
        $url = config('cache.DOSTV_API_URL') . '?from=' . $req->query('from') . '&to=' . $req->query('to');
        $options = [
            'http' => [
                'header' => "X-API-TOKEN: $apiKey\r\n"
            ]
        ];

        $context = stream_context_create($options);
        $response = file_get_contents($url, false, $context);
        $data = json_decode($response, true);
        return response()->json($data);
    }
}
