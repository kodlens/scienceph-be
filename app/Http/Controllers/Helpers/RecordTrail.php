<?php

namespace App\Http\Controllers\Helpers;
use App\Models\ActivityLog;

class RecordTrail
{
    public function __construct()
    {
    }

    public function recordTrail($recordTrail, $action, $userId, $name)
    {
        return $recordTrail . $action . "|" . $userId . "|" . $name . "|" . date('Y-m-d H:i:s') . ";";
    }

    public function activityLog($table, $materialId, $userId, $action,  $description, $oldValues, $newValues)
    {
        ActivityLog::create([
            'source_table' => $table,
            'material_id' => $materialId,
            'user_id' => $userId,
            'action' => $action,
            'description' => $description,
            'old_values' => $oldValues,
            'new_values' => $newValues
        ]);
    }
}
