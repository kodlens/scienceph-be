<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/test', function (Request $request) {
    return response()->json(['message' => 'API is running']);
});


/* ============================
    Search route
============================= */

Route::get('/load-categories', [\App\Http\Controllers\Api\CategoryController::class, 'loadCategories']);

/* ============================
    MATERIALS
============================= */
Route::get('/load-latest-materials', [\App\Http\Controllers\Api\MaterialController::class, 'loadLatestMaterials']);
Route::get('/load-popular-materials', [\App\Http\Controllers\Api\MaterialController::class, 'loadPopularMaterials']);

Route::get('/get-material/{slug}', [\App\Http\Controllers\Api\MaterialController::class, 'getMaterial']);


/* ============================
    Display materials by category
    Category Page
============================= */
//search materials (results are by category) for category page
Route::get('/search-materials-by-category/{slug}', [\App\Http\Controllers\Api\MaterialController::class, 'searchMaterialsByCategory']);



/* ============================
    MAIN SEARCH
============================= */
Route::get('/search-latest', [\App\Http\Controllers\Api\SearchController::class, 'searchLatest']);
Route::get('/search-others', [\App\Http\Controllers\Api\SearchController::class, 'searchOthers']);
/* ============================
    Sidebar category(subject) and topics(subject headings) search
============================= */
Route::get('/side-menu/category-labels', [\App\Http\Controllers\Api\SearchController::class, 'categoryLabels']);
Route::get('/side-menu/topic-labels', [\App\Http\Controllers\Api\SearchController::class, 'topicLabels']);

/* ============================
    END
============================= */



/* ============================
    BY CATEGORY SEARCH
============================= */

Route::get('/category-search-latest', [\App\Http\Controllers\Api\CategorySearchController::class, 'searchLatest']);
Route::get('/category-search-others', [\App\Http\Controllers\Api\CategorySearchController::class, 'searchOthers']);

Route::get('/category-side-menu/category-labels', [\App\Http\Controllers\Api\CategorySearchController::class, 'categoryLabels']);
Route::get('/category-side-menu/topic-labels', [\App\Http\Controllers\Api\CategorySearchController::class, 'topicLabels']);

/* ============================
    END
============================= */

//load related materials
Route::get('/load-related-material/{slug}', [\App\Http\Controllers\Api\MaterialController::class, 'loadRelatedMaterial']);



//category and topic menu in articles side
Route::get('/material-side-menu/category-labels', [\App\Http\Controllers\Api\MaterialController::class, 'categoryLabels']);
Route::get('/material-side-menu/topic-labels', [\App\Http\Controllers\Api\MaterialController::class, 'topicLabels']);



//Route::get('/category/{cat}', [\App\Http\Controllers\Api\SubjectSearchController::class, 'topicLabels']);



/* ===============================
This route is for by subject search
================================= */



/* ============================
    display list of materials by category
============================= */
//Route::get('/search-materials-by-category/{slug}', [\App\Http\Controllers\Api\MaterialSearchByCategoryController::class, 'searchMaterialsByCategory']);



// /* ============================
//     Sidebar subject and subject headings search
// ============================= */
// //Subject page api call for subject list
// Route::get('/subject-labels/search', [\App\Http\Controllers\Api\SearchController::class, 'subjectLabels']);
// //Subject page api call for subject-headings list
// Route::get('/subject-headings/search', [\App\Http\Controllers\Api\SearchController::class, 'subjectHeadingLabels']);




/* ============================
This route is for by subject
============================= */
//calling the list of subject and subject headings on SUBJECT SEARCH
// Route::get('/subject/search-latest', [\App\Http\Controllers\Api\SubjectSearchController::class, 'searchLatest']);
// Route::get('/subject/search-others', [\App\Http\Controllers\Api\SubjectSearchController::class, 'searchOthers']);






/* ============================
This route is for by subject headings label
============================= */
//calling the list of subject labels on SUBJECT HEADINGS SEARCH
//Route::get('/subject-headings/search/latest', [\App\Http\Controllers\Api\SubjectHeadingSearchController::class, 'searchLatest']);
//Route::get('/subject-headings/search/others', [\App\Http\Controllers\Api\SubjectHeadingSearchController::class, 'searchOthers']);
//Route::get('/subject-headings/subject-labels', [\App\Http\Controllers\Api\SubjectHeadingSearchController::class, 'subjectLabels']);
//Route::get('/subject-headings/subject-headings', [\App\Http\Controllers\Api\SubjectHeadingSearchController::class, 'subjectHeadingLabels']);

/* ============================
This route is for by subject headings label
************ END ****************
============================= */


//load broad classes with subject headings (subject with subject headings)
//Route::get('/load-category-class', [\App\Http\Controllers\Api\SubjectController::class, 'loadSubjects']);


// Route::get('/load-material/{slug}', [\App\Http\Controllers\Api\MaterialController::class, 'loadMaterial']);

//Route::get('/subjects/{subjectSlug}', [\App\Http\Controllers\Api\SubjectArticleController::class, 'loadArticle']);
//Route::get('/subject/materials-by-subject', [\App\Http\Controllers\Api\MaterialController::class, 'materialsBySubject']);
