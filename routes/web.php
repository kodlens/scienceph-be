<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\ReportController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');


/** =======================================
 * CATEGORY PAGES HERE
 * ========================================
 */
Route::get('/login', [App\Http\Controllers\WelcomePageController::class, 'index'])->name('welcome');

Route::get('/get-sections', [App\Http\Controllers\OpenController::class, 'getSections'])->name('open.sections');
Route::get('/get-categories', [App\Http\Controllers\OpenController::class, 'getCategories'])->name('open.categories');
Route::get('/get-agencies', [App\Http\Controllers\OpenController::class, 'getAgencies'])->name('open.agencies');
Route::get('/get-regions', [App\Http\Controllers\OpenController::class, 'getRegions'])->name('open.regions');
Route::get('/get-authors-autocomplete', [App\Http\Controllers\OpenController::class, 'getAuthorsAutocomplete'])->name('open.authors-autocomplete');
Route::get('/get-tags', [App\Http\Controllers\OpenController::class, 'getTags'])->name('open.tags');



Route::middleware('auth')->group(function () {

    Route::post('/classify-content', [App\Http\Controllers\Base\ClassifyController::class, 'classify']);

    Route::post('/material/validate-title/{id}', [App\Http\Controllers\Validation\InputTitleController::class, 'inputMaterial']);

    Route::get('/my-account', [App\Http\Controllers\Auth\MyAccountController::class, 'index'])->name('my-account.index');
    Route::patch('/my-account-update', [App\Http\Controllers\Auth\MyAccountController::class, 'update'])->name('my-account.update');

    Route::get('/change-password', [App\Http\Controllers\Auth\ChangePasswordController::class, 'index'])->name('change-password.index');
    Route::post('/change-password', [App\Http\Controllers\Auth\ChangePasswordController::class, 'changePassword'])->name('change-password.store');

    //common report for dashboard, only authenticated can access this route
    Route::get('/dashboard/stats', [App\Http\Controllers\DashboardController::class, 'stats']);
    Route::get('/dashboard/recent', [App\Http\Controllers\DashboardController::class, 'recent']);
    Route::get('/dashboard/monthly', [App\Http\Controllers\DashboardController::class, 'monthly']);
    Route::get('/dashboard/top-articles', [App\Http\Controllers\DashboardController::class, 'topArticles']);
    Route::get('/dashboard/top-last-six-months', [App\Http\Controllers\DashboardController::class, 'topLastSixMonths']);
    Route::get('/dashboard/articles-last-six-months', [App\Http\Controllers\DashboardController::class, 'articlesLastSixMonths']);

    Route::get('/get-subjects', [App\Http\Controllers\OpenController::class, 'getSubjects'])->name('open.subjects');
    Route::get('/get-subject-headings/{subjectId}', [App\Http\Controllers\OpenController::class, 'getSubjectHeadingsWithParams'])->name('open.subject-headings-with-params');
    Route::get('/get-subject-headings', [App\Http\Controllers\OpenController::class, 'getSubjectHeadings'])->name('open.subject-headings');

});


Route::prefix('admin')->middleware('auth', 'admin')->group(function () {

    // Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    // Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    // Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/dashboard', [App\Http\Controllers\Admin\AdminDashboardController::class, 'index'])->name('admin.dashboard.index');

    Route::resource('/sections', App\Http\Controllers\Admin\AdminSectionController::class)->names('admin.sections');
    Route::get('/get-sections', [App\Http\Controllers\Admin\AdminSectionController::class, 'getData'])->name('sections.get-data');
    Route::get('/load-sections', [App\Http\Controllers\Admin\AdminSectionController::class, 'loadData'])->name('sections.load');

    Route::resource('/categories', App\Http\Controllers\Admin\AdminCategoryController::class)->names('admin.categories');
    Route::get('/get-categories', [App\Http\Controllers\Admin\AdminCategoryController::class, 'getData'])->name('admin.categories-get-data');

     Route::resource('/regions', App\Http\Controllers\Admin\AdminRegionController::class)->names('admin.regions');
    Route::get('/get-regions', [App\Http\Controllers\Admin\AdminRegionController::class, 'getData'])->name('admin.regions-get-data');


    Route::resource('/materials', App\Http\Controllers\Admin\AdminMaterialController::class)->names('admin.materials');
    Route::get('/get-materials', [App\Http\Controllers\Admin\AdminMaterialController::class, 'getData'])->name('admin.materials.getdata');

    Route::post('/material-trash/{id}', [App\Http\Controllers\Admin\AdminMaterialController::class, 'trash'])->name('admin.material.trash');
    Route::post('/material-publish/{id}', [App\Http\Controllers\Admin\AdminMaterialController::class, 'publish'])->name('admin.material.published');

    Route::post('/material-draft/{id}', [App\Http\Controllers\Admin\AdminMaterialController::class, 'draft'])->name('admin.material.draft');

    //Route::post('/article-pending/{id}', [App\Http\Controllers\Admin\AdminArticleController::class, 'pending'])->name('article.pending');
    //Route::post('/article-submit-for-publishing/{id}', [App\Http\Controllers\Admin\AdminArticleController::class, 'submit'])->name('article.submit-for-publishing');
    //Route::post('/article-featured/{id}', [App\Http\Controllers\Admin\AdminArticleController::class, 'featured'])->name('article.featured');
    //Route::post('/article-unfeatured/{id}', [App\Http\Controllers\Admin\AdminArticleController::class, 'unfeatured'])->name('article.unfeatured');
    //Route::post('/article-set-publish-date/{id}', [App\Http\Controllers\Admin\AdminArticleController::class, 'setPublishDate'])->name('admin.post-set-publish-date');

    Route::resource('/trash-materials', App\Http\Controllers\Admin\AdminTrashController::class)->names('admin.trash-articles');
    Route::get('/get-trash-materials', [App\Http\Controllers\Admin\AdminTrashController::class, 'getData'])->name('admin.trash-materials.getdata');

    // ARCHIVES CONTORLLER AND LOGICS
    //Route::resource('/post-archives', App\Http\Controllers\Admin\AdminPostArchiveController::class);
    // Route::post('/post-unarchive/{id}', [App\Http\Controllers\Admin\AdminPostArchiveController::class, 'unArchive'])->name('admin.post-archives.get-data');
    // Route::get('/get-post-archives', [App\Http\Controllers\Admin\AdminPostArchiveController::class, 'getData'])->name('admin.post-archives.get-data');
    // Route::resource('/post-featured', App\Http\Controllers\Admin\AdminPostFeaturedController::class);
    // Route::get('/get-post-featured', [App\Http\Controllers\Admin\AdminPostFeaturedController::class, 'getData']);
    // Route::post('/post-featured-update-order-no', [App\Http\Controllers\Admin\AdminPostFeaturedController::class, 'postFeaturedUpdateOrderNo']);

    Route::resource('/ojt-materials', App\Http\Controllers\Admin\AdminOjtMaterialController::class)->names('admin.ojt-materials');
    Route::get('/get-ojt-materials', [App\Http\Controllers\Admin\AdminOjtMaterialController::class, 'getData'])->name('admin.ojt-materials.getdata');



    Route::resource('/users', App\Http\Controllers\Admin\AdminUserController::class);
    Route::get('/get-users', [App\Http\Controllers\Admin\AdminUserController::class, 'getData'])->name('users.getdata');
    Route::post('/users-change-password/{id}', [App\Http\Controllers\Admin\AdminUserController::class, 'changePassword'])->name('users.change-password');
    Route::post('/change-password/{id}', [App\Http\Controllers\Admin\AdminUserController::class, 'changePassword'])->name('users.change-password');


    // Route::resource('/roles', App\Http\Controllers\Admin\AdminRoleController::class);
    // Route::get('/get-roles', [App\Http\Controllers\Admin\AdminRoleController::class, 'getData'])->name('roles.getdata');

    // Route::resource('/permissions', App\Http\Controllers\Admin\AdminPermissionController::class);
    // Route::get('/get-permissions', [App\Http\Controllers\Admin\AdminPermissionController::class, 'getData'])->name('permissions.getdata');

    // Route::resource('/role-has-permissions', App\Http\Controllers\Admin\AdminRoleHasPermissionController::class);
    // Route::get('/get-role-has-permissions', [App\Http\Controllers\Admin\AdminRoleHasPermissionController::class, 'getData'])->name('role-has-permissions.getdata');

});



/** THIS ROUTE IS FOR PUBLISHER */
Route::prefix('publisher')->middleware('auth', 'publisher')->group(function () {

    Route::get('/dashboard', [App\Http\Controllers\Publisher\PublisherDashboardController::class, 'index'])->name('publisher.dashboard.index');

    Route::get('/materials', [App\Http\Controllers\Publisher\PublisherMaterialController::class, 'index'])->name('publisher.materials.index');
    Route::get('/get-materials', [App\Http\Controllers\Publisher\PublisherMaterialController::class, 'getData'])->name('publisher.materials.get-data');

    Route::get('/materials/create', [App\Http\Controllers\Publisher\PublisherMaterialController::class, 'create'])->name('publisher.materials.create');
    Route::post('/materials', [App\Http\Controllers\Publisher\PublisherMaterialController::class, 'store'])->name('publisher.materials.store');
    Route::get('/materials/{id}/edit', [App\Http\Controllers\Publisher\PublisherMaterialController::class, 'edit'])->name('publisher.materials.edit');
    Route::patch('/materials/{id}', [App\Http\Controllers\Publisher\PublisherMaterialController::class, 'update'])->name('publisher.materials.update');

    Route::get('/publish-materials', [App\Http\Controllers\Publisher\Publish\PublisherPublishMaterialController::class, 'index'])->name('publisher.publish-materials.index');
    Route::get('/get-publish-materials', [App\Http\Controllers\Publisher\Publish\PublisherPublishMaterialController::class, 'getData'])->name('publisher.get-publish-materials.index');

    Route::get('/ojt-materials', [App\Http\Controllers\Publisher\Ojt\PublisherOjtMaterialController::class, 'index'])->name('publisher.ojt-materials.index');
    Route::get('/get-ojt-materials', [App\Http\Controllers\Publisher\Ojt\PublisherOjtMaterialController::class, 'getData'])->name('publisher.get-ojt-materials.index');


    //Route::get('/trash-materials', [App\Http\Controllers\Publisher\PublisherTrashMaterialController::class, 'index'])->name('publisher.trash-materials.index');
    //Route::get('/get-trash-materials', [App\Http\Controllers\Publisher\PublisherTrashMaterialController::class, 'getData'])->name('publisher.trash-materials.get-data');

    Route::post('/material-publish/{id}', [App\Http\Controllers\Publisher\PublisherMaterialController::class, 'publish'])->name('publisher.materials.publish');
    Route::post('/material-draft/{id}', [App\Http\Controllers\Publisher\PublisherMaterialController::class, 'draft'])->name('publisher.materials.draft');
    Route::post('/material-submit/{id}', [App\Http\Controllers\Publisher\PublisherMaterialController::class, 'submit'])->name('publisher.materials.submit');
    //Route::post('/materials-return-to-encoder/{id}', [App\Http\Controllers\Publisher\PublisherMaterialController::class, 'postReturnToEncoder'])->name('publisher.materials.return-to-encoder');
    Route::post('/material-trash/{id}', [App\Http\Controllers\Publisher\PublisherMaterialController::class, 'trash'])->name('publisher.materials.trash');

});

/** THIS ROUTE IS FOR ENCODER */
Route::prefix('encoder')->middleware('auth', 'encoder')->group(function () {

    Route::get('/dashboard', [App\Http\Controllers\Encoder\EncoderDashboardController::class, 'index'])->name('encoder.dashboard.index');

    Route::get('/materials', [App\Http\Controllers\Encoder\EncoderMaterialController::class, 'index'])->name('encoder.materials.index');
    Route::get('/get-materials', [App\Http\Controllers\Encoder\EncoderMaterialController::class, 'getData'])->name('encoder.materials.get-data');

    Route::get('/draft-materials', [App\Http\Controllers\Encoder\Draft\EncoderDraftController::class, 'index'])->name('encoder.draft-materials.index');
    Route::get('/get-draft-materials', [App\Http\Controllers\Encoder\Draft\EncoderDraftController::class, 'getData'])->name('encoder.get-draft-materials');

    Route::get('/submit-materials', [App\Http\Controllers\Encoder\Submit\EncoderSubmitController::class, 'index'])->name('encoder.submit-materials.index');
    Route::get('/get-submit-materials', [App\Http\Controllers\Encoder\Submit\EncoderSubmitController::class, 'getData'])->name('encoder.get-submit-materials');

    Route::get('/publish-materials', [App\Http\Controllers\Encoder\Publish\EncoderPublishController::class, 'index'])->name('encoder.publish-materials.index');
    Route::get('/get-publish-materials', [App\Http\Controllers\Encoder\Publish\EncoderPublishController::class, 'getData'])->name('encoder.get-publish-materials');


    Route::get('/materials/create', [App\Http\Controllers\Encoder\EncoderMaterialController::class, 'create'])->name('encoder.materials.create');
    Route::post('/materials', [App\Http\Controllers\Encoder\EncoderMaterialController::class, 'store'])->name('encoder.materials.store');
    Route::get('/materials/{id}/edit', [App\Http\Controllers\Encoder\EncoderMaterialController::class, 'edit'])->name('encoder.materials.edit');
    Route::patch('/materials/{id}', [App\Http\Controllers\Encoder\EncoderMaterialController::class, 'update'])->name('encoder.materials.update');
    //Route::get('/posts/{id}', [App\Http\Controllers\Author\AuthorPostController::class, 'show'])->name('author.post-show');
    Route::delete('/materials/{id}', [App\Http\Controllers\Encoder\EncoderMaterialController::class, 'destroy'])->name('encoder.materials.destroy');

    //Route::resource('/posts', App\Http\Controllers\Encoder\EncoderArticleController::class);

    Route::post('/material-submit/{id}', [App\Http\Controllers\Encoder\EncoderMaterialController::class, 'submit'])->name('encoder.materials.submit');
    Route::post('/material-trash/{id}', [App\Http\Controllers\Encoder\EncoderMaterialController::class, 'trash'])->name('encoder.materials.trash');
    //   Route::post('/temp-upload', [App\Http\Controllers\Author\AuthorPostController::class, 'tempUpload'])->name('posts.temp-upload');
    //   Route::post('/temp-remove/{filename}', [App\Http\Controllers\Author\AuthorPostController::class, 'removeUpload'])->name('posts.temp-remove');
    //   Route::post('/image-remove/{id}/{filename}', [App\Http\Controllers\Author\AuthorPostController::class, 'imageRemove'])->name('posts.image-remove');

    //   Route::post('/posts-published/{id}', [App\Http\Controllers\Author\AuthorPostController::class, 'postPublished'])->name('posts.published');
    //   Route::post('/posts-archived/{id}', [App\Http\Controllers\Author\AuthorPostController::class, 'postArchived'])->name('posts.archived');
    Route::post('/material-draft/{id}', [App\Http\Controllers\Encoder\EncoderMaterialController::class, 'draft'])->name('encoder.articles.draft');
    //   Route::post('/posts-pending/{id}', [App\Http\Controllers\Author\AuthorPostController::class, 'postPending'])->name('posts.pending');

    Route::post('/material-submit-for-publishing/{id}', [App\Http\Controllers\Encoder\EncoderMaterialController::class, 'postSubmitForPublishing'])->name('posts.submit-for-publishing');


});
/** END AUTHOR */

require __DIR__.'/auth.php';



// logout auth (use for debuggin only)
Route::get('/applogout', function(Request $req){

    Auth::guard('web')->logout();
    $req->session()->invalidate();

    $req->session()->regenerateToken();

    return redirect('/');
});

use Illuminate\Support\Facades\Hash;
if(env('APP_DEBUG')){
    // logout auth (use for debuggin only)
    Route::get('/gen/pass/{pass}', function($pass){
        return Hash::make($pass);
    });

}
