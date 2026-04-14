<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use App\Models\Material;

class MaterialEncodingReportController extends Controller
{
    public function index()
    {
        return Inertia::render('Reports/MaterialEncodingReport', [
            'title' => 'Material Encoding Report',
        ]);
    }

    public function getMaterialEncoding(Request $req){

        $user = Auth()->user();

        $dateFrom = $req->input('date_from');
        $dateTo = $req->input('date_to');

        $data = Material::with(['encodedBy'])
            ->where('encoded_by_id', $user->id)
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->get();

        return response()->json($data);
    }
}
