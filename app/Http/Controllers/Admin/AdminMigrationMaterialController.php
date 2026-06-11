<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ExternalMigration;
use Inertia\Inertia;
use Inertia\Response;

class AdminMigrationMaterialController extends Controller
{
    public function index(){
        return Inertia::render('Admin/MigrationMaterial/AdminMigrationMaterialIndex');
    }


    public function getData(Request $req){
        $perPage = request('perpage', 10);

        $data = ExternalMigration::select(
            'id',
            'name',
            'last_migrated_id',
            'last_migrated_at',
            'status'
        )
            ->orderBy('id', 'desc')
            ->paginate($perPage);
        return $data;
    }



    public function destroy($id){

        ExternalMigration::destroy($id);

        return response()->json([
            'success' => true,
            'type' => 'deleted',
            'message' => 'Successfully deleted.'
        ],200);
    }
}
