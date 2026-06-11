<?php

namespace App\Http\Controllers\Admin\External;

use App\Http\Controllers\Controller;
use App\Jobs\MigrateDostvMaterials;
use App\Models\ExternalMigration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Material;
use Illuminate\Support\Facades\Http;

class AdminDostvController extends Controller
{
    public function index(){
        return Inertia::render('Admin/ExternalApi/Dostv/DostvIndex');
    }

    public function checkApiStatus(Request $req)
    {
        $dostvApiKey = config('app.DOSTV_API_KEY');
        $dostvBaseUrl = config('app.DOSTV_BASE_URL');
        $apiUrl = '/v1/scienceph/get-dostv-status';
        $uri = $dostvBaseUrl . $apiUrl;
        //return $uri;
        try {
            $response = Http::withHeaders([
                'X-API-TOKEN' => $dostvApiKey,
                'Accept' => 'application/json'
            ])->get($uri);

            return $response->json();

            return response()->json($response->json(), 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'API unreachable',
                'error' => $e->getMessage()
            ], 500);
        }

        return $dostvs;
    }

    public function getData(Request $req)
    {
        $perpage = $req->input('perpage', 10);
        $page = $req->input('page', 1);

        $dostvs = Material::where('classification', 'dostv')
            ->paginate($perpage, ['*'], 'page', $page);

        return $dostvs;
    }

    public function migrate(Request $req){
        $validated = $req->validate([
            'from' => ['required', 'date'],
            'to' => ['required', 'date', 'after_or_equal:from'],
        ]);

        // Keep the API filters as date-only values.
        $from = \Carbon\Carbon::parse($validated['from'], 'Asia/Singapore')->toDateString();
        $to = \Carbon\Carbon::parse($validated['to'], 'Asia/Singapore')->toDateString();

        $migration = ExternalMigration::firstOrCreate(
            ['slug' => 'dostv'],
            [
                'name' => 'DOSTv Migration',
                'last_migrated_id' => 0,
            ]
        );

        if ($migration->status === 'queued' || $migration->status === 'processing') {
            return response()->json([
                'message' => 'A DOSTv migration is already running.',
                'migration' => $migration,
            ], 409);
        }

        $migration->update([
            'status' => 'queued',
            'requested_from' => $from,
            'requested_to' => $to,
            'total_count' => 0,
            'processed_count' => 0,
            'error_message' => null,
            'started_at' => null,
            'finished_at' => null,
        ]);

        MigrateDostvMaterials::dispatch($migration->id, $from, $to)
            ->onConnection('database')
            ->onQueue('external-migrations');

        return response()->json([
            'message' => 'DOSTV migration queued successfully.',
            'migration' => $migration->fresh(),
        ], 202);
    }

    public function migrationStatus()
    {
        $migration = ExternalMigration::where('slug', 'dostv')->first();

        return response()->json([
            'migration' => $migration,
        ]);
    }
}
