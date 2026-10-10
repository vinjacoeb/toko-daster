<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Variant;
use App\Services\StockService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    protected $stockService;

    public function __construct(StockService $stockService)
    {
        $this->stockService = $stockService;
    }

    public function index(Request $request)
    {
        $query = Order::query()
            ->with(['items.variant.product', 'user']);

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('kode', 'like', '%' . $request->search . '%')
                    ->orWhereHas('items.variant.product', function ($q2) use ($request) {
                        $q2->where('nama', 'like', '%' . $request->search . '%');
                    });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('kanal')) {
            $query->where('kanal', $request->kanal);
        }

        if ($request->filled('tanggal_dari')) {
            $query->whereDate('dipesan_at', '>=', $request->tanggal_dari);
        }

        if ($request->filled('tanggal_sampai')) {
            $query->whereDate('dipesan_at', '<=', $request->tanggal_sampai);
        }

        $data = $query->paginate($request->input('per_page', 20));

        return Inertia::render('Admin/Order/Index', [
            'title' => 'Manajemen Pesanan',
            'data' => $data,
            'filters' => $request->only(['search', 'status', 'kanal', 'tanggal_dari', 'tanggal_sampai']),
            'orderStatuses' => ['baru', 'dibayar', 'dikemas', 'dikirim', 'selesai', 'batal'],
            'orderChannels' => ['whatsapp', 'marketplace', 'langsung'],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_pelanggan' => 'required|string|max:100',
            'no_hp' => 'required|string|min:10',
            'alamat' => 'nullable|string|max:255',
            'channel' => 'required|in:whatsapp,marketplace,langsung',
            'items' => 'required|array|min:1',
            'items.*.variant_id' => 'required|exists:variants,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|integer|min:0',
            'items.*.note' => 'nullable|string',
            'ongkir' => 'required|integer|min:0',
            'diskon' => 'required|integer|min:0',
            'dipesan_at' => 'nullable|date',
            'status' => 'sometimes|in:baru,dibayar,dikemas,dikirim,selesai,batal',
        ]);

        DB::transaction(function () use ($validated) {
            // Generate order code
            $date = $validated['dipesan_at'] ? date('ymd', strtotime($validated['dipesan_at'])) : date('ymd');
            $lastOrder = Order::where('kode', 'like', 'TD-%' . $date . '-%')
                ->orderByDesc('id')
                ->first();
            $sequence = $lastOrder
                ? intval(explode('-', $lastOrder->kode)[2])
                : 0;
            $kode = 'TD-' . date('y') . $date . '-' . str_pad($sequence + 1, 3, '0', STR_PAD_LEFT);

            $order = Order::create([
                'kode' => $kode,
                'nama_pelanggan' => $validated['nama_pelanggan'],
                'no_hp' => $validated['no_hp'],
                'alamat' => $validated['alamat'],
                'kanal' => $validated['channel'],
                'status' => $validated['status'] ?? 'baru',
                'subtotal' => collect($validated['items'])->sum(fn ($item) => $item['price'] * $item['quantity']),
                'ongkir' => $validated['ongkir'],
                'diskon' => $validated['diskon'],
                'total' => collect($validated['items'])->sum(fn ($item) => $item['price'] * $item['quantity']) + $validated['ongkir'] - $validated['diskon'],
                'dipesan_at' => $validated['dipesan_at'] ?? now(),
                'user_id' => auth()->id(),
            ]);

            foreach ($validated['items'] as $item) {
                $variant = Variant::lockForUpdate()->find($item['variant_id']);

                if ($variant->stok < $item['quantity']) {
                    throw ValidationException::withMessages([
                        'items.' . array_search($item, $validated['items'], true) . '.quantity' => 'Stok tidak cukup untuk ' . $variant->product->nama . ' (Warna: ' . $variant->warna . ', Ukuran: ' . $variant->ukuran . ')',
                    ]);
                }

                OrderItem::create([
                    'order_id' => $order->id,
                    'variant_id' => $item['variant_id'],
                    'nama' => $variant->product->nama,
                    'warna' => $variant->warna,
                    'ukuran' => $variant->ukuran,
                    'harga' => $item['price'],
                    'qty' => $item['quantity'],
                ]);

                $this->stockService->adjustStock(
                    $item['variant_id'],
                    -$item['quantity'],
                    'Penjualan pesanan #' . $order->kode,
                    $order->id,
                    $item['note']
                );
            }
        });

        return redirect()->back()->with('success', 'Pesanan berhasil dibuat.');
    }

    public function show(int $id)
    {
        $order = Order::with(['items.variant.product', 'user'])->findOrFail($id);

        return Inertia::render('Admin/Order/Show', [
            'title' => 'Detail Pesanan ' . $order->kode,
            'data' => $order,
            'orderStatuses' => ['baru', 'dibayar', 'dikemas', 'dikirim', 'selesai', 'batal'],
            'orderChannels' => ['whatsapp', 'marketplace', 'langsung'],
        ]);
    }

    public function update(Request $request, int $id)
    {
        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:baru,dibayar,dikemas,dikirim,selesai,batal',
            'resi' => 'nullable|string|max:50',
        ]);

        if ($validated['status'] !== $order->status) {
            if ($validated['status'] === 'dibayar' && $order->status !== 'baru') {
                throw ValidationException::withMessages(['status' => 'Hanya pesanan dengan status baru yang boleh dibayar.']);
            }
            if ($validated['status'] === 'dikemas' && $order->status !== 'dibayar') {
                throw ValidationException::withMessages(['status' => 'Hanya pesanan dengan status dibayar yang boleh dikemas.']);
            }
            if ($validated['status'] === 'dikirim' && $order->status !== 'dikemas') {
                throw ValidationException::withMessages(['status' => 'Hanya pesanan dengan status dikemas yang boleh dikirim.']);
            }
            if ($validated['status'] === 'selesai' && $order->status !== 'dikirim') {
                throw ValidationException::withMessages(['status' => 'Hanya pesanan dengan status dikirim yang boleh diselesaikan.']);
            }
            if ($validated['status'] === 'batal') {
                if ($order->status === 'selesai') {
                    throw ValidationException::withMessages(['status' => 'Tidak bisa membatalkan pesanan yang sudah selesai.']);
                }
                // Kembali stok
                foreach ($order->items as $item) {
                    $this->stockService->adjustStock(
                        $item->variant_id,
                        $item->qty,
                        'Pembatalan pesanan #' . $order->kode,
                        $order->id,
                        'Pembatalan'
                    );
                }
            }
            $order->status = $validated['status'];
            $order->resi = $validated['resi'] ?? $order->resi;
            $order->save();
        }

        return redirect()->back()->with('success', 'Pesanan berhasil diperbarui.');
    }

    public function destroy(int $id)
    {
        $order = Order::findOrFail($id);

        // Cek apakah ada yang sedang diproses
        $processing = ['dibayar', 'dikemas', 'dikirim', 'selesai'];
        if (in_array($order->status, $processing)) {
            throw ValidationException::withMessages(['status' => 'Tidak bisa menghapus pesanan yang sudah dalam proses.']);
        }

        // Kembalikan stok
        foreach ($order->items as $item) {
            $this->stockService->adjustStock(
                $item->variant_id,
                $item->qty,
                'Penghapusan pesanan #' . $order->kode,
                $order->id,
                'Penghapusan'
            );
        }

        $order->delete();

        return redirect()->back()->with('success', 'Pesanan berhasil dihapus.');
    }

    public function batal(Request $request, int $id)
    {
        $order = Order::findOrFail($id);

        if ($order->status === 'selesai') {
            throw ValidationException::withMessages(['status' => 'Tidak bisa membatalkan pesanan yang sudah selesai.']);
        }

        $validated = $request->validate(['catatan' => 'nullable|string']);

        // Kembalikan stok
        foreach ($order->items as $item) {
            $this->stockService->adjustStock(
                $item->variant_id,
                $item->qty,
                'Pembatalan pesanan #' . $order->kode,
                $order->id,
                $validated['catatan'] ?? 'Pembatalan'
            );
        }

        $order->status = 'batal';
        $order->catatan = $validated['catatan'] ?? null;
        $order->save();

        return redirect()->back()->with('success', 'Pesanan berhasil dibatalkan.');
    }

    public function kirim(Request $request, int $id)
    {
        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'resi' => 'required|string|max:50',
        ]);

        $order->status = 'dikirim';
        $order->resi = $validated['resi'];
        $order->save();

        return redirect()->back()->with('success', 'Resi pesanan berhasil disimpan.');
    }

    public function cetak(int $id)
    {
        $order = Order::with(['items.variant.product'])->findOrFail($id);

        return Inertia::render('Admin/Order/Print', [
            'title' => 'Cetak Faktur',
            'data' => $order,
        ]);
    }
}
