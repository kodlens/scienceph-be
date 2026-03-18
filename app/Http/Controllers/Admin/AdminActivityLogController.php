<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ActivityLog;
use Inertia\Inertia;
use Inertia\Response;

class AdminActivityLogController extends Controller
{

    public function index()
    {
        return inertia('Admin/ActivityLogs/AdminActivityLogsIndex');
    }

    public function getData(Request $request){

        $search = $request->input('search', '');
        $perPage = $request->input('perpage', 10);
        $page = $request->input('page', 1);

        $data = ActivityLog::with(['user', 'material'])
            ->whereHas('material', function ($query) use ($search) {
                $query->where('title', 'like', "%{$search}%");
            })
            ->whereHas('user', function ($query) use ($search) {
                $query->where('lname', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json($data, 200);
    }

}
