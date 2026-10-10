<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Kategori untuk produk toko daster
        $categories = [
            ['name' => 'Daster Batik'],
            ['name' => 'Daster Rumahan'],
            ['name' => 'Daster Kancing Depan'],
            ['name' => 'Daster Lengan Panjang'],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['name' => $category['name']],
                ['slug' => Str::slug($category['name'])]
            );
        }
    }
}