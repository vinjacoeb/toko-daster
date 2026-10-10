<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Setting;
use Inertia\Inertia;

class ProductDetailController extends Controller
{
    public function index($slug)
    {
        $product = Product::with(['category', 'images', 'variants'])
            ->where('slug', $slug)
            ->where('status', 'tayang')
            ->firstOrFail();

        $whatsappNumber = Setting::where('key', 'whatsapp_number')->value('value');
        $storeName = Setting::where('key', 'store_name')->value('value');

        return Inertia::render('DetailProduk', [
            'title' => 'Detail Produk',
            'product' => $product,
            'settings' => [
                'whatsappNumber' => $whatsappNumber ?? '',
                'storeName' => $storeName ?? '',
            ],
        ]);
    }
}
