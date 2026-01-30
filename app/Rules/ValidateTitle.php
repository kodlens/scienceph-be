<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\DB;
use App\Models\Article;

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

        $article = Article::where('title', $value);

        if($this->id > 0){
            $article = $article->where('id', '!=', $this->id);
        }

        $article = $article->first();

        if ($article === null) {
            return; // Validation passes
        }

        // If the post exists, check the 'trash' column
        if ($article->trash != 1) {
            // If the title is not marked as trash, validation fails

            $fail('The title already exists from rule.');
        }

        // If the post exists and trash is 1, validation passes (title is considered reusable)
    }
}
