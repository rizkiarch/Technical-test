<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Categories\CategoriesController;
use App\Http\Controllers\Animals\AnimalsController;
use App\Http\Controllers\StorageController;

// Basic user route (existing)
// Route::get('/users', function (Request $request) {
//     return response()->json([
//         'id' => 1,
//         'name' => 'John Doe',
//         'email' => 'example@dev.com',
//     ]);
// });

// Categories routes
Route::prefix('categories')->group(function () {
    Route::get('/', [CategoriesController::class, 'index']); // GET /api/categories
    Route::get('/with-count', [CategoriesController::class, 'withCount']); // GET /api/categories/with-count
    Route::get('/{type}', [CategoriesController::class, 'show']); // GET /api/categories/{type}
    Route::post('/', [CategoriesController::class, 'store']); // POST /api/categories
    Route::put('/{type}', [CategoriesController::class, 'update']); // PUT /api/categories/{type}
    Route::delete('/{type}', [CategoriesController::class, 'destroy']); // DELETE /api/categories/{type}
});

// Animals routes
Route::prefix('animals')->group(function () {
    Route::get('/', [AnimalsController::class, 'index']); // GET /api/animals
    Route::get('/search', [AnimalsController::class, 'search']); // GET /api/animals/search?q=query
    Route::get('/checked-in', [AnimalsController::class, 'checkedIn']); // GET /api/animals/checked-in
    Route::get('/checked-out', [AnimalsController::class, 'checkedOut']); // GET /api/animals/checked-out
    Route::get('/rates', [AnimalsController::class, 'getHourlyRates']); // GET /api/animals/rates
    Route::get('/category/{category}', [AnimalsController::class, 'getByCategory']); // GET /api/animals/category/{category}
    Route::get('/{id}', [AnimalsController::class, 'show'])->where('id', '.*'); // GET /api/animals/{id}
    Route::post('/', [AnimalsController::class, 'store']); // POST /api/animals
    Route::put('/{id}', [AnimalsController::class, 'update'])->where('id', '.*'); // PUT /api/animals/{id}
    Route::post('/{id}/checkout', [AnimalsController::class, 'checkout'])->where('id', '.*'); // POST /api/animals/{id}/checkout
    Route::delete('/{id}', [AnimalsController::class, 'destroy'])->where('id', '.*'); // DELETE /api/animals/{id}
});

// Storage routes for serving uploaded files
Route::prefix('storage')->group(function () {
    Route::get('/{path}', [StorageController::class, 'serveFile'])->where('path', '.*'); // GET /api/storage/{path}
    Route::get('/info/{path}', [StorageController::class, 'getFileInfo'])->where('path', '.*'); // GET /api/storage/info/{path}
});
