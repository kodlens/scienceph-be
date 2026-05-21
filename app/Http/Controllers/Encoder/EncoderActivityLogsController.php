<?php

namespace App\Http\Controllers\Encoder;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;


class EncoderActivityLogsController extends Controller
{
    private function filteredQuery(Request $req)
    {
        $userId = Auth::user()->id;
        $from = $req->input('from');
        $to = $req->input('to');

        $query = ActivityLog::where('user_id', $userId);

        if (!empty($from)) {
            $query->where('created_at', '>=', Carbon::parse($from)->startOfDay());
        }

        if (!empty($to)) {
            $query->where('created_at', '<=', Carbon::parse($to)->endOfDay());
        }

        return $query;
    }

    public function index(){
        return Inertia::render('Encoder/ActivityLogs/ActivityLogsIndex');
    }



    public function getData(Request $req){
        $perPage = (int) $req->input('perpage', 10);

        $data = $this->filteredQuery($req)
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return response()->json($data, 200);
    }

    public function export(Request $req)
    {
        $logs = $this->filteredQuery($req)
            ->orderByDesc('created_at')
            ->get(['id', 'action', 'description', 'created_at']);

        $filename = 'encoder-activity-logs-' . now()->format('Ymd-His') . '.csv';

        return response()->streamDownload(function () use ($logs) {
            $handle = fopen('php://output', 'w');
            fwrite($handle, chr(0xEF) . chr(0xBB) . chr(0xBF));
            fputcsv($handle, ['ID', 'Action', 'Description', 'Logs Date']);

            foreach ($logs as $log) {
                fputcsv($handle, [
                    $log->id,
                    $log->action,
                    $log->description,
                    optional($log->created_at)->format('Y-m-d H:i:s'),
                ]);
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}
