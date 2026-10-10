<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    protected ProductService $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function index(Request $request)
    {
        $filters = [
            'search' => $request->query('search'),
            'status' => $request->query('status'),
            'category_id' => $request->query('category_id'),
            'per_page' => $request->query('per_page', 10),
        ];

        $products = $this->productService->getAllProducts($filters);
        $categories = Category::all(['id', 'name']);

        return Inertia::render('Admin/Produk', [
            'title' => 'Manajemen Produk',
            'data' => $products,
            'categories' => $categories,
            'filters' => (object) $filters,
        ]);
    }

    public function create()
    {
        $categories = Category::all(['id', 'name']);

        return Inertia::render('Admin/Produk/Form', [
            'title' => 'Tambah Produk',
            'categories' => $categories,
            'product' => null,
        ]);
    }

    public function store(StoreProductRequest $request)
    {
        $this->productService->createProduct($request->validated());

        return redirect()->route('admin.produk.index')->with('success', 'Produk berhasil disimpan.');
    }

    public function edit(int $id)
    {
        $product = Product::with(['variants', 'images'])->findOrFail($id);
        $categories = Category::all(['id', 'name']);

        return Inertia::render('Admin/Produk/Form', [
            'title' => 'Edit Produk',
            'categories' => $categories,
            'product' => $product,
        ]);
    }

    public function update(StoreProductRequest $request, int $id)
    {
        $product = Product::findOrFail($id);
        $this->productService->updateProduct($product, $request->validated());

        return redirect()->route('admin.produk.index')->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy(int $id)
    {
        $product = Product::findOrFail($id);
        $this->productService->deleteProduct($product);

        return redirect()->route('admin.produk.index')->with('success', 'Produk berhasil dihapus.');
    }
}
