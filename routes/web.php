<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductDetailController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AdminMessageController;
use App\Http\Controllers\Admin\StockController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\CategoryController;

Route::get('/', [HomeController::class, 'index']);
Route::get('/product', [ProductController::class, 'index']);
Route::get('/product/{slug}', [ProductDetailController::class, 'index']);
Route::get('/kontak-kami', [ContactController::class, 'index']);
Route::post('/kontak-kami', [ContactController::class, 'store']);

Route::get('/login', [LoginController::class, 'show'])->middleware(['guest']);
Route::post('/login', [LoginController::class, 'store'])->middleware(['guest']);
Route::post('/logout', [LogoutController::class, 'destroy'])->middleware(['auth']);

Route::prefix('admin')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index']);
    Route::get('/pesan-masuk', [AdminMessageController::class, 'index']);
    Route::get('/stok', [StockController::class, 'index']);
    Route::post('/stok', [StockController::class, 'store']);
    Route::get('/stok/{id}/riwayat', [StockController::class, 'history']);
    Route::get('/pesanan', [OrderController::class, 'index']);
    Route::get('/pesanan/create', [OrderController::class, 'create']);
    Route::post('/pesanan', [OrderController::class, 'store']);
    Route::get('/pesanan/{id}', [OrderController::class, 'show']);
    Route::put('/pesanan/{id}', [OrderController::class, 'update']);
    Route::patch('/pesanan/{id}', [OrderController::class, 'update']);
    Route::delete('/pesanan/{id}', [OrderController::class, 'destroy']);
    Route::post('/pesanan/{id}/batal', [OrderController::class, 'batal']);
    Route::post('/pesanan/{id}/kirim', [OrderController::class, 'kirim']);
    Route::get('/pesanan/{id}/cetak', [OrderController::class, 'cetak']);
    Route::get('/produk', [AdminProductController::class, 'index']);
    Route::get('/kategori', [CategoryController::class, 'index']);
});


