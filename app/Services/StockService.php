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

            $newStock = $variant->stock + $quantity;

            if ($newStock < 0) {
                throw ValidationException::withMessages([
                    'stock' => 'Stok tidak cukup untuk transaksi ini.',
                ]);
            }

            $variant->update(['stock' => $newStock]);

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
            $query->where(function($q) use ($search) {
                $q->where('sku', 'like', "%{$search}%")
                  ->orWhere('color', 'like', "%{$search}%")
                  ->orWhere('size', 'like', "%{$search}%")
                  ->orWhereHas('product', function($sub) use ($search) {
                      $sub->where('name', 'like', "%{$search}%");
                  });
            });
        }

        if (!empty($filters['status_stok'])) {
            if ($filters['status_stok'] === 'habis') {
                $query->where('stock', '<=', 0);
            } elseif ($filters['status_stok'] === 'menipis') {
                $query->where('stock', '>', 0)->whereColumn('stock', '<=', 'stock_minimum');
            } elseif ($filters['status_stok'] === 'aman') {
                $query->where('stock', '>', 3);
            }
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function getGlobalStats(array $filters = []): array
    {
        $query = Variant::query();

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function($q) use ($search) {
                $q->where('sku', 'like', "%{$search}%")
                  ->orWhere('color', 'like', "%{$search}%")
                  ->orWhere('size', 'like', "%{$search}%")
                  ->orWhereHas('product', function($sub) use ($search) {
                      $sub->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $allQuery = clone $query;
        $menipisQuery = clone $query;
        $habisQuery = clone $query;

        $countMenipis = $menipisQuery->where('stock', '>', 0)
            ->where(function ($q) {
                $q->where('stock_minimum', '>', 0)
                  ->whereColumn('stock', '<=', 'stock_minimum')
                  ->orWhere(function ($sub) {
                      $sub->where('stock_minimum', '<=', 0)
                          ->where('stock', '<=', 3);
                  });
            })
            ->count();
        
        $countHabis = $habisQuery->where('stock', '<=', 0)
            ->count();

        return [
            'menipis' => $countMenipis,
            'habis' => $countHabis,
        ];
    }
}
