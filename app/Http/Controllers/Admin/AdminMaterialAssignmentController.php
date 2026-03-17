<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\MaterialAssignment;


class AdminMaterialAssignmentController extends Controller
{
    public function index(){
        return Inertia::render('Admin/MaterialAssignments/MaterialAssignmentIndex');
    }

    public function getData(Request $request){
        $search = $request->input('search');
        $perPage = $request->input('perPage', 10);

        $query = MaterialAssignment::query()
            ->with(['publisher', 'encoder']);

        if ($search) {
            $query->orWhereHas('publisher', function ($q) use ($search) {
                $q->where('name', 'like', "%$search%");
            })->orWhereHas('encoder', function ($q) use ($search) {
                $q->where('name', 'like', "%$search%");
            });
        }

        $materialAssignments = $query->paginate($perPage);

        return response()->json($materialAssignments);
    }



}
