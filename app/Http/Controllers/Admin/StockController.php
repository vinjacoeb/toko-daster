<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StockMovement;
use App\Models\Variant;
use App\Services\StockService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class StockController extends Controller
{
    protected $stockService;

    public function __construct(StockService $stockService)
    {
        $this->stockService = $stockService;
    }

    public function index(Request $request)
    {
        $filters = [
            'search' => $request->query('cari'),
            'status_stok' => $request->query('stok'),
        ];

        $variants = $this->stockService->getStockList($filters, 20);

        return Inertia::render('Admin/Stok/Stok', [
            'title' => 'Manajemen Stok',
            'data' => $variants,
            'filters' => $filters,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'variant_id' => 'required|exists:variants,id',
            'quantity' => 'required|integer',
            'reason' => 'required|in:restock,koreksi,rusak-hilang',
            'note' => 'nullable|string',
        ]);

        try {
            $this->stockService->adjustStock(
                $validated['variant_id'],
                $validated['quantity'],
                $validated['reason'],
                null,
                $validated['note']
            );

            return back()->with('success', 'Stok berhasil diperbarui.');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors());
        }
    }

    public function history(int $id)
    {
        $variant = Variant::with('product')->findOrFail($id);
        $movements = $this->stockService->getVariantHistory($id, 20);

        return Inertia::render('Admin/Stok/Riwayat', [
            'title' => 'Riwayat Mutasi Stok',
            'variant' => $variant,
            'movements' => $movements,
        ]);
    }
}
