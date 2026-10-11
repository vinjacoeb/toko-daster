<?php

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
        return Inertia::render('Admin/Kategori/Index', [
            'title' => 'Manajemen Kategori',
            'data' => $categories,
        ]);
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
}
