<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\Variant;
use App\Models\ContactMessage;
use App\Models\OrderItem;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();
        $startOfMonth = $today->copy()->startOfMonth();
        $lastMonth = $today->copy()->subMonth();
        $lastMonthStart = $lastMonth->copy()->startOfMonth();
        $lastMonthEnd = $lastMonth->copy()->endOfMonth();

        // Omzet hari ini
        $omzetHariIni = Order::where('status', '!=', 'batal')
            ->whereDate('dipesan_at', $today)
            ->sum('total');

        // Omzet bulan ini dengan perbandingan persen terhadap bulan lalu
        $omzetBulanIni = Order::where('status', '!=', 'batal')
            ->whereBetween('dipesan_at', [$startOfMonth, $today])
            ->sum('total');

        $omzetBulanLalu = Order::where('status', '!=', 'batal')
            ->whereBetween('dipesan_at', [$lastMonthStart, $lastMonthEnd])
            ->sum('total');

        $persentaseBulanLalu = $omzetBulanLalu > 0
            ? round(($omzetBulanIni - $omzetBulanLalu) / $omzetBulanLalu * 100, 1)
            : 0;

        // Pesanan perlu diproses
        $pesananPerluDiproses = Order::whereIn('status', ['baru', 'dibayar', 'dikemas'])
            ->count();

        // Varian stok menipis (stok <= stok_minimum)
        $varianStokMenipis = Variant::where('stok', '<=', 'stok_minimum')
            ->with('product')
            ->get()
            ->count();

        // Pesan belum dibaca (berdasarkan dibaca_at)
        $pesanBelumDibaca = ContactMessage::where('dibaca_at', null)
            ->count();

        // Grafik omzet 30 hari terakhir
        $grafikOmzet30Hari = Order::where('status', '!=', 'batal')
            ->where('dipesan_at', '>=', $today->copy()->subDays(30))
            ->selectRaw('DATE(dipesan_at) as tanggal, SUM(total) as total')
            ->groupBy('tanggal')
            ->orderBy('tanggal')
            ->get()
            ->map(function ($item) {
                return [
                    'tanggal' => $item->tanggal,
                    'total' => (float) $item->total,
                ];
            });

        // Produk terlaris 30 hari terakhir
        $produkTerlaris = OrderItem::select('product_id', \DB::raw('SUM(qty) as total_terjual'))
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', '!=', 'batal')
            ->where('orders.dipesan_at', '>=', $today->copy()->subDays(30))
            ->groupBy('product_id')
            ->orderByDesc('total_terjual')
            ->limit(5)
            ->with('product')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->product_id,
                    'nama' => $item->product->nama,
                    'total_terjual' => $item->total_terjual,
                ];
            });

        // 5 pesanan terbaru
        $pesananTerbaru = Order::with(['user', 'items.variant.product'])
            ->orderByDesc('dipesan_at')
            ->limit(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'kode' => $order->kode,
                    'nama_pelanggan' => $order->nama_pelanggan,
                    'status' => $order->status,
                    'total' => $order->total,
                    'dipesan_at' => $order->dipesan_at,
                ];
            });

        // 5 varian stok menipis
        $varianStokMenipisList = Variant::where('stok', '<=', 'stok_minimum')
            ->with('product')
            ->limit(5)
            ->get()
            ->map(function ($variant) {
                return [
                    'id' => $variant->id,
                    'sku' => $variant->sku,
                    'size' => $variant->ukuran,
                    'color' => $variant->warna,
                    'stok' => $variant->stok,
                    'stok_minimum' => $variant->stok_minimum,
                    'product_nama' => $variant->product->nama,
                ];
            });

        // Settings
        $settings = [
            'whatsappNumber' => '081234567890',
            'storeName' => 'Toko Daster',
            'storeTagline' => 'Nyaman dipakai seharian',
        ];

        return Inertia::render('Admin/Dashboard/Index', [
            'title' => 'Dashboard',
            'data' => [
                'omzetHariIni' => $omzetHariIni,
                'omzetBulanIni' => $omzetBulanIni,
                'persentaseBulanLalu' => $persentaseBulanLalu,
                'pesananPerluDiproses' => $pesananPerluDiproses,
                'varianStokMenipis' => $varianStokMenipis,
                'pesanBelumDibaca' => $pesanBelumDibaca,
                'grafikOmzet30Hari' => $grafikOmzet30Hari,
                'produkTerlaris' => $produkTerlaris,
                'pesananTerbaru' => $pesananTerbaru,
                'varianStokMenipisList' => $varianStokMenipisList,
            ],
            'settings' => $settings,
        ]);
    }
}