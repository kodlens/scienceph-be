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

    Route::get('/my-account', [App\Http\Controllers\Auth\MyAccountController::class, 'index']);
    Route::patch('/my-account-update', [App\Http\Controllers\Auth\MyAccountController::class, 'update']);

    Route::get('/change-password', [App\Http\Controllers\Auth\ChangePasswordController::class, 'index']);
    Route::post('/change-password', [App\Http\Controllers\Auth\ChangePasswordController::class, 'changePassword']);

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

    Route::resource('/articles', App\Http\Controllers\Admin\AdminArticleController::class);
    Route::get('/get-articles', [App\Http\Controllers\Admin\AdminArticleController::class, 'getData'])->name('admin.articles.getdata');

    Route::post('/articles-trash/{id}', [App\Http\Controllers\Admin\AdminArticleController::class, 'trash'])->name('articles.trash');
    Route::post('/articles-publish/{id}', [App\Http\Controllers\Admin\AdminArticleController::class, 'publish'])->name('articles.published');
    Route::post('/articles-archive/{id}', [App\Http\Controllers\Admin\AdminArticleController::class, 'archive'])->name('articles.archived');
    Route::post('/articles-draft/{id}', [App\Http\Controllers\Admin\AdminArticleController::class, 'draft'])->name('articles.draft');
    Route::post('/articles-pending/{id}', [App\Http\Controllers\Admin\AdminArticleController::class, 'pending'])->name('articles.pending');
    Route::post('/articles-submit-for-publishing/{id}', [App\Http\Controllers\Admin\AdminArticleController::class, 'submit'])->name('articles.submit-for-publishing');
    Route::post('/articles-featured/{id}', [App\Http\Controllers\Admin\AdminArticleController::class, 'featured'])->name('articles.featured');
    Route::post('/articles-unfeatured/{id}', [App\Http\Controllers\Admin\AdminArticleController::class, 'unfeatured'])->name('articles.unfeatured');
    Route::post('/post-set-publish-date/{id}', [App\Http\Controllers\Admin\AdminArticleController::class, 'setPublishDate'])->name('admin.post-set-publish-date');



    Route::resource('/post-trashes', App\Http\Controllers\Admin\AdminTrashController::class);
    Route::get('/get-post-trashes', [App\Http\Controllers\Admin\AdminTrashController::class, 'getData'])->name('trashes.get-data');

    // ARCHIVES CONTORLLER AND LOGICS
    Route::resource('/post-archives', App\Http\Controllers\Admin\AdminPostArchiveController::class);

    Route::post('/post-unarchive/{id}', [App\Http\Controllers\Admin\AdminPostArchiveController::class, 'unArchive'])->name('admin.post-archives.get-data');
    Route::get('/get-post-archives', [App\Http\Controllers\Admin\AdminPostArchiveController::class, 'getData'])->name('admin.post-archives.get-data');


    Route::resource('/post-featured', App\Http\Controllers\Admin\AdminPostFeaturedController::class);
    Route::get('/get-post-featured', [App\Http\Controllers\Admin\AdminPostFeaturedController::class, 'getData']);
    Route::post('/post-featured-update-order-no', [App\Http\Controllers\Admin\AdminPostFeaturedController::class, 'postFeaturedUpdateOrderNo']);



    Route::resource('/users', App\Http\Controllers\Admin\AdminUserController::class);
    Route::get('/get-users', [App\Http\Controllers\Admin\AdminUserController::class, 'getData'])->name('users.getdata');
    Route::post('/users-change-password/{id}', [App\Http\Controllers\Admin\AdminUserController::class, 'changePassword'])->name('users.change-password');
    Route::post('/change-password/{id}', [App\Http\Controllers\Admin\AdminUserController::class, 'changePassword'])->name('users.change-password');


    Route::resource('/roles', App\Http\Controllers\Admin\AdminRoleController::class);
    Route::get('/get-roles', [App\Http\Controllers\Admin\AdminRoleController::class, 'getData'])->name('roles.getdata');

    Route::resource('/permissions', App\Http\Controllers\Admin\AdminPermissionController::class);
    Route::get('/get-permissions', [App\Http\Controllers\Admin\AdminPermissionController::class, 'getData'])->name('permissions.getdata');

    Route::resource('/role-has-permissions', App\Http\Controllers\Admin\AdminRoleHasPermissionController::class);
    Route::get('/get-role-has-permissions', [App\Http\Controllers\Admin\AdminRoleHasPermissionController::class, 'getData'])->name('role-has-permissions.getdata');

});



/** THIS ROUTE IS FOR PUBLISHER */
Route::prefix('publisher')->middleware('auth', 'publisher')->group(function () {

    Route::get('/dashboard', [App\Http\Controllers\Publisher\PublisherDashboardController::class, 'index'])->name('publisher.dashboard.index');

    Route::get('/articles', [App\Http\Controllers\Publisher\PublisherArticleController::class, 'index'])->name('publisher.articles.index');
    Route::get('/articles/create', [App\Http\Controllers\Publisher\PublisherArticleController::class, 'create'])->name('publisher.articles.create');
    Route::post('/articles', [App\Http\Controllers\Publisher\PublisherArticleController::class, 'store'])->name('publisher.articles.store');
    Route::get('/articles/{id}/edit', [App\Http\Controllers\Publisher\PublisherArticleController::class, 'edit'])->name('publisher.articles.edit');
    Route::patch('/articles/{id}', [App\Http\Controllers\Publisher\PublisherArticleController::class, 'update'])->name('publisher.articles.update');;


    Route::get('/get-articles', [App\Http\Controllers\Publisher\PublisherArticleController::class, 'getData'])->name('publisher.articles.get-data');


    Route::post('/articles-publish/{id}', [App\Http\Controllers\Publisher\PublisherArticleController::class, 'publish'])->name('publisher.articles.publish');
    Route::post('/articles-draft/{id}', [App\Http\Controllers\Publisher\PublisherArticleController::class, 'draft'])->name('publisher.articles.unpublish');
    //Route::post('/articles-return-to-encoder/{id}', [App\Http\Controllers\Publisher\PublisherArticleController::class, 'postReturnToEncoder'])->name('publisher.articles.return-to-encoder');
    Route::post('/articles-trash/{id}', [App\Http\Controllers\Publisher\PublisherArticleController::class, 'trash'])->name('publisher.articles.trash');

    // Route::get('/post-publish', [App\Http\Controllers\Publisher\PublisherPostPublishController::class, 'index']);
    // Route::get('/get-post-publish', [App\Http\Controllers\Publisher\PublisherPostPublishController::class, 'getData'])->name('author.post-publish-get-data');

    // Route::get('/post-unpublish', [App\Http\Controllers\Publisher\PublisherPostUnpublishController::class, 'index']);
    // Route::get('/get-post-unpublish', [App\Http\Controllers\Publisher\PublisherPostUnpublishController::class, 'getData'])->name('author.post-unpublish-get-data');

    // //Route::get('/post-set-publish-date', [App\Http\Controllers\Publisher\PublisherPostController::class, 'index']);
    // Route::post('/post-set-publish-date/{id}', [App\Http\Controllers\Publisher\PublisherPostController::class, 'setPublishDate'])->name('author.post-set-publish-date');
});

/** THIS ROUTE IS FOR ENCODER */
Route::prefix('encoder')->middleware('auth', 'encoder')->group(function () {

    Route::get('/dashboard', [App\Http\Controllers\Encoder\EncoderDashboardController::class, 'index'])->name('encoder.dashboard.index');

    Route::get('/articles', [App\Http\Controllers\Encoder\EncoderArticleController::class, 'index'])->name('encoder.articles.index');
    Route::get('/articles/create', [App\Http\Controllers\Encoder\EncoderArticleController::class, 'create'])->name('encoder.articles.create');
    Route::post('/articles', [App\Http\Controllers\Encoder\EncoderArticleController::class, 'store'])->name('encoder.articles.store');
    Route::get('/articles/{id}/edit', [App\Http\Controllers\Encoder\EncoderArticleController::class, 'edit'])->name('encoder.articles.edit');
    Route::patch('/articles/{id}', [App\Http\Controllers\Encoder\EncoderArticleController::class, 'update'])->name('encoder.articles.update');
    //Route::get('/posts/{id}', [App\Http\Controllers\Author\AuthorPostController::class, 'show'])->name('author.post-show');
    Route::delete('/articles/{id}', [App\Http\Controllers\Encoder\EncoderArticleController::class, 'destroy'])->name('encoder.articles.destroy');

    //Route::resource('/posts', App\Http\Controllers\Encoder\EncoderArticleController::class);
    Route::get('/get-articles', [App\Http\Controllers\Encoder\EncoderArticleController::class, 'getData'])->name('encoder.articles.get-data');

    Route::post('/article-trash/{id}', [App\Http\Controllers\Encoder\EncoderArticleController::class, 'trash'])->name('encoder.articles.trash');
    //   Route::post('/temp-upload', [App\Http\Controllers\Author\AuthorPostController::class, 'tempUpload'])->name('posts.temp-upload');
    //   Route::post('/temp-remove/{filename}', [App\Http\Controllers\Author\AuthorPostController::class, 'removeUpload'])->name('posts.temp-remove');
    //   Route::post('/image-remove/{id}/{filename}', [App\Http\Controllers\Author\AuthorPostController::class, 'imageRemove'])->name('posts.image-remove');

    //   Route::post('/posts-published/{id}', [App\Http\Controllers\Author\AuthorPostController::class, 'postPublished'])->name('posts.published');
    //   Route::post('/posts-archived/{id}', [App\Http\Controllers\Author\AuthorPostController::class, 'postArchived'])->name('posts.archived');
        Route::post('/article-draft/{id}', [App\Http\Controllers\Encoder\EncoderArticleController::class, 'postDraft'])->name('encoder.articles.draft');
    //   Route::post('/posts-pending/{id}', [App\Http\Controllers\Author\AuthorPostController::class, 'postPending'])->name('posts.pending');

    Route::post('/article-submit-for-publishing/{id}', [App\Http\Controllers\Encoder\EncoderArticleController::class, 'postSubmitForPublishing'])->name('posts.submit-for-publishing');

  //   //Route::get('/get-posts-comments/{id}', [App\Http\Controllers\Author\AuthorPostController::class, 'getComments'])->name('posts.get-comments');

  //   Route::get('/post-publish', [App\Http\Controllers\Author\AuthorPostPublishController::class, 'index']);
  //   Route::get('/get-post-publish', [App\Http\Controllers\Author\AuthorPostPublishController::class, 'getData'])->name('author.post-trash-get-data');

  //   Route::get('/post-trashes', [App\Http\Controllers\Author\AuthorPostTrashController::class, 'index']);
  //   Route::get('/get-post-trashes', [App\Http\Controllers\Author\AuthorPostTrashController::class, 'getData'])->name('author.post-trash-get-data');

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
