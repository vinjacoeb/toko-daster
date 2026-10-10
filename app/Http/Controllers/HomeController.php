<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Setting;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $settings = Setting::pluck('value', 'key')->toArray();

        // 4 produk unggulan dengan status 'tayang' dan 'featured = true'
        $featuredProducts = Product::with(['images', 'variants'])
            ->where('status', 'tayang')
            ->where('featured', true)
            ->take(4)
            ->get();

        // Jika kurang dari 4, lengkapi dengan produk tayang terbaru
        if ($featuredProducts->count() < 4) {
            $excludeIds = $featuredProducts->pluck('id')->toArray();
            $fallback = Product::with(['images', 'variants'])
                ->where('status', 'tayang')
                ->whereNotIn('id', $excludeIds)
                ->latest()
                ->take(4 - $featuredProducts->count())
                ->get();
            
            $featuredProducts = $featuredProducts->concat($fallback);
        }

        return Inertia::render('Landing', [
            'title' => 'Beranda',
            'settings' => [
                'whatsappNumber' => $settings['whatsapp_number'] ?? '',
                'storeName' => $settings['store_name'] ?? 'Toko Daster',
                'storeTagline' => $settings['store_tagline'] ?? '',
                'storeDescription' => $settings['store_description'] ?? '',
            ],
            'featuredProducts' => $featuredProducts,
        ]);
    }
}
