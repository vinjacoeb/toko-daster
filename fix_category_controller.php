var head = `<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Models\Category;
use App\Services\CategoryService;
use Inertia\Inertia;

class CategoryController extends Controller
{
    protected CategoryService $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function index()
    {
        $categories = $this->categoryService->getAllCategories();
        return Inertia::render('Admin/Kategori/Index', [`;

var tail = `);

    }

    public function store(StoreCategoryRequest $request)
    {
        $this->categoryService->createCategory($request->validated());
        return redirect()->route('admin.kategori.index')->with('success', 'Kategori berhasil dibuat.');
    }

    public function update(StoreCategoryRequest $request, int $id)
    {
        $category = Category::findOrFail($id);
        $this->categoryService->updateCategory($category, $request->validated());
        return redirect()->route('admin.kategori.index')->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy(int $id)
    {
        $category = Category::findOrFail($id);
        $this->categoryService->deleteCategory($category);
        return redirect()->route('admin.kategori.index')->with('success', 'Kategori berhasil dihapus.');
    }
}`;

// Perform header-only replace
if (!file_exists('app/Http/Controllers/Admin/CategoryController.php')) {
    throw new Exception('CategoryController.php not found');
}

$content = file_get_contents('app/Http/Controllers/Admin/CategoryController.php');

// Replace only the line containing 'Admin/Kategori' within Inertia::render call in index()
preg_match_all('/Inertia::render\((.*?)\)/s', $content, $matches);
foreach ($matches as $match) {
    $block = $match[0];
    if (preg_match('/Inertia::render\\((.*?)\\)/s', $block, $inner)) {
        $innerPath = $inner[1];
        if (strpos($innerPath, 'Admin/Kategori') !== false && !strpos($innerPath, '/Index')) {
            // Replace the path within the inner block
            $newBlock = str_replace($innerPath, 'Admin/Kategori/Index', $block);
            $content = str_replace($block, $newBlock, $content, 1);
            break;
        }
    }
}

file_put_contents('app/Http/Controllers/Admin/CategoryController.php', $content);

echo 'CategoryController updated successfully';
