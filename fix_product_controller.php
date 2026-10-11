var head = `<?php

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

        return Inertia::render('Admin/Produk/Index', [`;

var tail = `);

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
}`;

// Perform header-only replace
if (!file_exists('app/Http/Controllers/Admin/ProductController.php')) {
    throw new Exception('ProductController.php not found');
}

$content = file_get_contents('app/Http/Controllers/Admin/ProductController.php');

// Replace only the line containing 'Admin/Produk' within Inertia::render call in index()
preg_match_all('/Inertia::render\((.*?)\)/s', $content, $matches);
foreach ($matches as $match) {
    $block = $match[0];
    if (preg_match('/Inertia::render\\((.*?)\\)/s', $block, $inner)) {
        $innerPath = $inner[1];
        if (strpos($innerPath, 'Admin/Produk') !== false && !strpos($innerPath, '/Index')) {
            // Replace the path within the inner block
            $newBlock = str_replace($innerPath, 'Admin/Produk/Index', $block);
            $content = str_replace($block, $newBlock, $content, 1);
            break;
        }
    }
}

file_put_contents('app/Http/Controllers/Admin/ProductController.php', $content);

echo 'ProductController updated successfully';
