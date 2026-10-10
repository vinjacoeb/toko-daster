<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductDetailController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MessageController;
use App\Http\Controllers\Admin\StockController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\AccountController;

Route::get('/', [HomeController::class, 'index']);
Route::get('/product', [ProductController::class, 'index']);
Route::get('/product/{slug}', [ProductDetailController::class, 'index']);
Route::get('/kontak-kami', [ContactController::class, 'index']);
Route::post('/kontak-kami', [ContactController::class, 'store']);

Route::get('/login', [LoginController::class, 'show'])->middleware(['guest'])->name('login');
Route::post('/login', [LoginController::class, 'store'])->middleware(['guest']);
Route::post('/logout', [LogoutController::class, 'destroy'])->middleware(['auth']);

Route::prefix('admin')->middleware(['auth'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('admin.index');
    Route::get('/pesan-masuk', [MessageController::class, 'index'])->name('admin.pesan-masuk.index');
    Route::get('/stok', [StockController::class, 'index'])->name('admin.stok.index');
    Route::post('/stok', [StockController::class, 'store'])->name('admin.stok.store');
    Route::get('/stok/{id}/riwayat', [StockController::class, 'history'])->name('admin.stok.history');
    Route::get('/pesanan', [OrderController::class, 'index'])->name('admin.pesanan.index');
    Route::get('/pesanan/create', [OrderController::class, 'create'])->name('admin.pesanan.create');
    Route::post('/pesanan', [OrderController::class, 'store'])->name('admin.pesanan.store');
    Route::get('/pesanan/{id}', [OrderController::class, 'show'])->name('admin.pesanan.show');
    Route::put('/pesanan/{id}', [OrderController::class, 'update'])->name('admin.pesanan.update');
    Route::patch('/pesanan/{id}', [OrderController::class, 'update']);
    Route::delete('/pesanan/{id}', [OrderController::class, 'destroy'])->name('admin.pesanan.destroy');
    Route::post('/pesanan/{id}/batal', [OrderController::class, 'batal'])->name('admin.pesanan.batal');
    Route::post('/pesanan/{id}/kirim', [OrderController::class, 'kirim'])->name('admin.pesanan.kirim');
    Route::get('/pesanan/{id}/cetak', [OrderController::class, 'cetak'])->name('admin.pesanan.cetak');
    // CRUD Produk
    Route::get('/produk', [AdminProductController::class, 'index'])->name('admin.produk.index');
    Route::post('/produk', [AdminProductController::class, 'store'])->name('admin.produk.store');
    Route::put('/produk/{id}', [AdminProductController::class, 'update'])->name('admin.produk.update');
    Route::patch('/produk/{id}', [AdminProductController::class, 'update']);
    Route::delete('/produk/{id}', [AdminProductController::class, 'destroy'])->name('admin.produk.destroy');

    // CRUD Kategori
    Route::get('/kategori', [CategoryController::class, 'index'])->name('admin.kategori.index');
    Route::post('/kategori', [CategoryController::class, 'store'])->name('admin.kategori.store');
    Route::put('/kategori/{id}', [CategoryController::class, 'update'])->name('admin.kategori.update');
    Route::patch('/kategori/{id}', [CategoryController::class, 'update']);
    Route::delete('/kategori/{id}', [CategoryController::class, 'destroy'])->name('admin.kategori.destroy');
    Route::get('/laporan', [ReportController::class, 'index'])->name('admin.laporan.index');
    Route::get('/pengaturan', [SettingController::class, 'index'])->name('admin.pengaturan.index');
    Route::get('/akun', [AccountController::class, 'index'])->name('admin.akun.index');
});


