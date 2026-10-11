<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\DB;

class ProductService
{
    public function getAllProducts($filters)
    {
        $query = Product::query()->with(['category', 'variants', 'images']);

        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        return $query->paginate($filters['per_page'] ?? 10);
    }

    public function createProduct(array $data)
    {
        return DB::transaction(function () use ($data) {
            $product = Product::create([
                'category_id' => $data['category_id'],
                'name' => $data['name'],
                'slug' => $data['slug'],
                'description' => $data['description'] ?? null,
                'material' => $data['material'],
                'care' => $data['care'],
                'price' => $data['price'],
                'price_crossed' => $data['price_crossed'] ?? null,
                'status' => $data['status'],
                'featured' => $data['featured'] ?? false,
            ]);

            // Handle variants
            if (!empty($data['variants'])) {
                foreach ($data['variants'] as $variantData) {
                    $product->variants()->create($variantData);
                }
            }

            // Handle images
            if (!empty($data['product_images'])) {
                foreach ($data['product_images'] as $imageData) {
                    $product->images()->create($imageData);
                }
            }

            return $product;
        });
    }

    public function updateProduct(Product $product, array $data)
    {
        return DB::transaction(function () use ($product, $data) {
            $product->update([
                'category_id' => $data['category_id'],
                'name' => $data['name'],
                'slug' => $data['slug'],
                'description' => $data['description'] ?? null,
                'material' => $data['material'],
                'care' => $data['care'],
                'price' => $data['price'],
                'price_crossed' => $data['price_crossed'] ?? null,
                'status' => $data['status'],
                'featured' => $data['featured'] ?? false,
            ]);

            // Sync variants robustly without unique constraint violations
            if (!empty($data['variants'])) {
                $existingVariants = $product->variants()->withTrashed()->get();
                $processedVariantIds = [];

                foreach ($data['variants'] as $variantData) {
                    $existing = $existingVariants->first(function ($v) use ($variantData) {
                        return $v->sku === $variantData['sku'] || ($v->size === $variantData['size'] && $v->color === $variantData['color']);
                    });

                    if ($existing) {
                        if ($existing->trashed()) {
                            $existing->restore();
                        }
                        $existing->update([
                            'size' => $variantData['size'],
                            'color' => $variantData['color'],
                            'sku' => $variantData['sku'],
                            'price' => $variantData['price'] ?? null,
                            'stok' => $variantData['stok'],
                            'stok_minimum' => $variantData['stok_minimum'],
                        ]);
                        $processedVariantIds[] = $existing->id;
                    } else {
                        $newVariant = $product->variants()->create($variantData);
                        $processedVariantIds[] = $newVariant->id;
                    }
                }

                $toDelete = $existingVariants->reject(fn($v) => in_array($v->id, $processedVariantIds));
                foreach ($toDelete as $oldVariant) {
                    $hasOrders = $oldVariant->orders()->exists();
                    $hasMovements = $oldVariant->stockMovements()->exists();

                    if (!$hasOrders && !$hasMovements) {
                        try {
                            $oldVariant->forceDelete();
                        } catch (\Exception $e) {
                            $oldVariant->update(['sku' => 'DEL-' . $oldVariant->id . '-' . time()]);
                            $oldVariant->delete();
                        }
                    } else {
                        $oldVariant->update(['sku' => 'DEL-' . $oldVariant->id . '-' . time()]);
                        $oldVariant->delete();
                    }
                }
            }

            // Sync images (update or create)
            if (!empty($data['product_images'])) {
                $product->images()->delete(); // Simplified
                foreach ($data['product_images'] as $imageData) {
                    $product->images()->create($imageData);
                }
            }

            return $product;
        });
    }

    public function deleteProduct(Product $product)
    {
        return DB::transaction(function () use ($product) {
            $product->variants()->delete();
            $product->images()->delete();
            return $product->delete();
        });
    }
}
