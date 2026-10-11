<?php

namespace App\Services;

use App\Models\Variant;
use App\Models\StockMovement;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StockService
{
    /**
     * Mengambil riwayat mutasi stok untuk varian tertentu (paginate).
     */
    public function getVariantHistory(int $variantId, int $perPage = 10)
    {
        return StockMovement::with(['user', 'order'])
            ->where('variant_id', $variantId)
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Menyesuaikan stok varian.
     */
    public function adjustStock(int $variantId, int $quantity, string $reason, ?int $orderId = null, ?string $note = null): void
    {
        DB::transaction(function () use ($variantId, $quantity, $reason, $orderId, $note) {
            $variant = Variant::lockForUpdate()->find($variantId);

            if (!$variant) {
                throw new \Exception("Varian tidak ditemukan.");
            }

            $newStock = $variant->stok + $quantity;

            if ($newStock < 0) {
                throw ValidationException::withMessages([
                    'stok' => 'Stok tidak cukup untuk transaksi ini.',
                ]);
            }

            $variant->update(['stok' => $newStock]);

            StockMovement::create([
                'variant_id' => $variantId,
                'jumlah' => $quantity,
                'stok_akhir' => $newStock,
                'alasan' => $reason,
                'order_id' => $orderId,
                'user_id' => auth()->id(),
                'catatan' => $note,
            ]);
        });
    }

    /**
     * Get stock list with pagination and optional filters.
     */
    public function getStockList(array $filters = [], int $perPage = 10)
    {
        $query = Variant::with(['product.category']);

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('sku', 'like', "%{$search}%")
                  ->orWhere('color', 'like', "%{$search}%")
                  ->orWhere('size', 'like', "%{$search}%")
                  ->orWhereHas('product', function ($sub) use ($search) {
                      $sub->where('name', 'like', "%{$search}%");
                  });
            });
        }

        if (!empty($filters['status_stok'])) {
            switch ($filters['status_stok']) {
                case 'habis':
                    $query->where('stok', '<=', 0);
                    break;

                case 'menipis':
                    $query->where('stok', '>', 0)
                        ->where(function ($q) {
                            $q->where('stok_minimum', '>', 0)
                              ->whereColumn('stok', '<=', 'stok_minimum')
                              ->orWhere(function ($sub) {
                                  $sub->where('stok_minimum', '<=', 0)
                                      ->where('stok', '<=', 3);
                              });
                        });
                    break;

                case 'aman':
                    $query->where('stok', '>', 3);
                    break;
            }
        }

        return $query->latest()->paginate($perPage);
    }

    public function getGlobalStats(array $filters = []): array
    {
        $query = Variant::query();

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('sku', 'like', "%{$search}%")
                  ->orWhere('color', 'like', "%{$search}%")
                  ->orWhere('size', 'like', "%{$search}%")
                  ->orWhereHas('product', function ($sub) use ($search) {
                      $sub->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $menipisQuery = clone $query;
        $habisQuery = clone $query;

        $countMenipis = $menipisQuery->where('stok', '>', 0)
            ->where(function ($q) {
                $q->where('stok_minimum', '>', 0)
                  ->whereColumn('stok', '<=', 'stok_minimum')
                  ->orWhere(function ($sub) {
                      $sub->where('stok_minimum', '<=', 0)
                          ->where('stok', '<=', 3);
                  });
            })
            ->count();

        $countHabis = $habisQuery->where('stok', '<=', 0)
            ->count();

        return [
            'menipis' => $countMenipis,
            'habis' => $countHabis,
        ];
    }
}
