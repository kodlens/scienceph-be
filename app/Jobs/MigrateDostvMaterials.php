<?php

namespace App\Jobs;

use App\Models\ExternalMigration;
use App\Models\ExternalMigrationLog;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class MigrateDostvMaterials implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 1200;

    public int $tries = 1;

    public function __construct(
        private readonly int $externalMigrationId,
        private readonly string $from,
        private readonly string $to
    ) {
    }

    public function handle(): void
    {
        $migration = ExternalMigration::findOrFail($this->externalMigrationId);

        $migration->update([
            'status' => 'processing',
            'started_at' => now(),
            'finished_at' => null,
            'error_message' => null,
        ]);

        $apiKey = config('cache.DOSTV_API_KEY');
        $url = config('cache.DOSTV_API_URL');

       // $apiKey = env('DOSTV_API_KEY');
        //$url = env('DOSTV_API_URL');

        $response = Http::timeout(120)
            ->retry(2, 1000)
            ->withHeaders([
                'X-API-TOKEN' => $apiKey,
            ])
            ->get($url, [
                'from' => $this->from,
                'to' => $this->to,
            ]);

        if (! $response->successful()) {
            throw new \RuntimeException('DOSTv API request failed with status ' . $response->status() . '.');
        }

        $payload = $response->json();

        if (! is_array($payload)) {
            throw new \RuntimeException('DOSTv API returned an invalid payload.');
        }

        $totalCount = count($payload);

        $migration->update([
            'total_count' => $totalCount,
            'processed_count' => 0,
        ]);

        foreach ($payload as $index => $item) {
            if (! is_array($item) || ! isset($item['post_id'], $item['title'], $item['slug'])) {
                continue;
            }

            $materialValues = [
                'title' => $item['title'],
                'slug' => $item['slug'],
                'description' => $item['content'] ?? '',
                'description_text' => $item['description'] ?? '',
                'filter_type' => 'video',
                'encoded_at' => now(),
                'encoded_by_id' => 1,
                'urls' => 'https://dostv.ph',
                'source_url' => '/post/' . $item['slug'],
                'status' => 'publish',
                'is_publish' => 1,
                'guest' => $item['guest'] ?? null,
                'credits' => $item['credits'] ?? null,
                'updated_at' => now(),
            ];

            $existingMaterial = DB::table('materials')
                ->where('source_id', $item['post_id'])
                ->where('classification', 'dostv')
                ->exists();

            if ($existingMaterial) {
                DB::table('materials')
                    ->where('source_id', $item['post_id'])
                    ->where('classification', 'dostv')
                    ->update($materialValues);
            } else {
                DB::table('materials')->insert([
                    ...$materialValues,
                    'source_id' => $item['post_id'],
                    'classification' => 'dostv',
                    'created_at' => now(),
                ]);
            }

            ExternalMigrationLog::create([
                'external_migration_id' => $migration->id,
                'migrated_id' => $item['post_id'],
                'total_count' => $totalCount,
                'migrated_at' => now(),
            ]);

            $migration->update([
                'last_migrated_id' => $item['post_id'],
                'last_migrated_at' => now()->toDateString(),
                'processed_count' => $index + 1,
            ]);
        }

        $migration->update([
            'status' => 'completed',
            'finished_at' => now(),
        ]);
    }

    public function failed(\Throwable $exception): void
    {
        ExternalMigration::whereKey($this->externalMigrationId)->update([
            'status' => 'failed',
            'finished_at' => now(),
            'error_message' => $exception->getMessage(),
        ]);
    }
}
