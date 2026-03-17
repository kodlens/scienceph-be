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
                $q->where('lname', 'like', "%$search%");
            })->orWhereHas('encoder', function ($q) use ($search) {
                $q->where('fname', 'like', "%$search%");
            });
        }

        $materialAssignments = $query->paginate($perPage);

        return response()->json($materialAssignments);
    }


    // public function store(Request $req){

    //     $validate = $req->validate([
    //         'encoder_users' => ['required', 'array'],
    //         'publisher_user_id' => ['required', 'integer'],
    //     ]);

    //     $encoderUserId = [];
    //     foreach($req->encoder_users as $user){
    //         $data[] = [
    //             'encoder_user_id' => $user['encoder_user_id'],
    //             'publisher_user_id' => $req->publisher_user_id,
    //         ];
    //     }

    //     MaterialAssignment::insert($data);

    //     return response()->json([
    //         'status' => 'saved'
    //     ], 200);
    // }

    public function store(Request $req){

        $req->validate([
            'publisher_user_id',
            'encoder_user_id'
        ]);


        MaterialAssignment::create([
            'publisher_user_id' => $req->publisher_user_id,
            'encoder_user_id' => $req->encoder_user_id,
        ]);

        return response()->json([
            'status' => 'saved'
        ], 200);

    }

    public function destroy($id){
        MaterialAssignment::destroy($id);

        return response()->json([
            'status' => 'deleted'
        ], 200);
    }

}
