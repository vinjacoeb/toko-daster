<?php

namespace App\Services;

use App\Models\Category;

class CategoryService
{
    public function getAllCategories()
    {
        return Category::paginate(10);
    }

    public function createCategory(array $data)
    {
        return Category::create([
            'name' => $data['name'],
            'slug' => $data['slug'],
            'parent_id' => $data['parent_id'] ?? null,
        ]);
    }

    public function updateCategory(Category $category, array $data)
    {
        return $category->update([
            'name' => $data['name'],
            'slug' => $data['slug'],
            'parent_id' => $data['parent_id'] ?? null,
        ]);
    }

    public function deleteCategory(Category $category)
    {
        return $category->delete();
    }
}
