<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Setting;
use App\Models\Category;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $settings = Setting::where('key', 'whatsapp_number')->value('value');

        $query = Product::with(['category', 'variants'])
            ->where('status', 'tayang')
            ->when(request('search'), function ($q) {
                $search = '%' . request('search') . '%';
                $q->where(function ($q) use ($search) {
                    $q->where('name', 'like', $search)
                      ->orWhereHas('category', function ($q) use ($search) {
                          $q->where('categories.name', 'like', $search);
                      })
                      ->orWhereHas('variants', function ($q) use ($search) {
                          $q->where(function ($q) use ($search) {
                              $q->where('variants.color', 'like', $search)
                                ->orWhere('variants.size', 'like', $search)
                                ->orWhere('variants.sku', 'like', $search)
                                ->orWhere('variants.price', 'like', $search)
                                ->orWhere('variants.stock', 'like', $search);
                          });
                      })
                      ->orWhere('price_crossed', 'like', $search)
                      ->orWhere('price', 'like', $search)
                      ->orWhere('description', 'like', $search)
                      ->orWhere('material', 'like', $search)
                      ->orWhere('care', 'like', $search)
                      ->orWhere('slug', 'like', $search);
                });
            })
            ->when(request('category'), function ($q) {
                $q->whereHas('category', function ($q) {
                    $q->where('categories.id', request('category'));
                });
            })
            ->when(request('size'), function ($q) {
                $q->whereHas('variants', function ($q) {
                    $q->whereIn('variants.size', request('size'));
                });
            })
            ->when(request('min_price') || request('max_price'), function ($q) {
                $min = request('min_price');
                $max = request('max_price');
                $q->whereHas('variants', function ($q) use ($min, $max) {
                    if ($min) $q->where('variants.price', '>=', $min);
                    if ($max) $q->where('variants.price', '<=', $max);
                });
            })
            ->when(request('in_stock'), function ($q) {
                $q->whereHas('variants', function ($q) {
                    $q->where('variants.stock', '>', 0);
                });
            });

        switch (request('sort', 'latest')) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            default:
                $query->latest();
        }

        $products = $query->paginate(12);

        return Inertia::render('Produk', [
            'title' => 'Produk',
            'products' => $products,
            'categories' => Category::all(['id', 'name']),
            'filters' => (object) request()->only(['search', 'category', 'size', 'min_price', 'max_price', 'in_stock', 'sort']),
            'settings' => [
                'whatsappNumber' => $settings ?? '',
            ],
        ]);
    }
}
