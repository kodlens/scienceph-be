<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\DB;
use App\Models\Material;

class ValidateTitle implements ValidationRule
{

    private $id;

    public function __construct($id) {
        $this->id = $id;
    }

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {

        $material = Material::where('title', $value);

        if($this->id > 0){
            $material = $material->where('id', '!=', $this->id);
        }

        $material = $material->first();

        if ($material === null) {
            return; // Validation passes
        }

        // If the post exists, check the 'trash' column
        if ($material->trash != 1) {
            // If the title is not marked as trash, validation fails

            $fail('The title already exists from rule.');
        }

        // If the post exists and trash is 1, validation passes (title is considered reusable)
    }
}
