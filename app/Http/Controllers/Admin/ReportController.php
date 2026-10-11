<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Variant;
use App\Models\ContactMessage;
use App\Models\OrderItem;
use App\Services\StockService;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    protected $stockService;

    public function __construct(StockService $stockService)
    {
        $this->stockService = $stockService;
    }

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

        // Varian stok menipis (stock <= stock_minimum)
        $varianStokMenipis = Variant::whereColumn('stok', '<=', 'stok_minimum')
            ->count();

        // Pesan belum dibaca (berdasarkan dibaca_at)
        $pesanBelumDibaca = ContactMessage::where('dibaca_at', null)
            ->count();

        // Produk terlaris 30 hari terakhir
        $produkTerlaris = OrderItem::select('product_id', DB::raw('SUM(qty) as total_terjual'))
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
        $varianStokMenipisList = Variant::whereColumn('stok', '<=', 'stok_minimum')
            ->with('product')
            ->limit(5)
            ->get()
            ->map(function ($variant) {
                return [
                    'id' => $variant->id,
                    'sku' => $variant->sku,
                    'ukuran' => $variant->ukuran,
                    'warna' => $variant->warna,
                    'stok' => $variant->stok,
                    'stok_minimum' => $variant->stok_minimum,
                    'product_nama' => $variant->product->nama,
                ];
            });

        // Pendapatan bulanan: omzet per minggu dalam bulan ini vs bulan lalu
        $kelompokTanggalBulanIni = [
            ['1-7', 1, 7],
            ['8-14', 8, 14],
            ['15-21', 15, 21],
            ['22-28', 22, 28],
            ['29-31', 29, $startOfMonth->copy()->format('t')], // jumlah hari di bulan ini
        ];
        $kelompokTanggalBulanLalu = [
            ['1-7', $lastMonth->copy()->startOfMonth()->day, $lastMonth->copy()->startOfMonth()->addDays(6)->day],
            ['8-14', 8, 14],
            ['15-21', 15, 21],
            ['22-28', 22, 28],
            ['29-31', 29, $lastMonth->copy()->endOfMonth()->day],
        ];
        $pendapatanBulanIni = [];
        $pendapatanBulanLalu = [];
        foreach ($kelompokTanggalBulanIni as $idx => $grup) {
            $namaGrup = $grup[0];
            $mulai = (int)$grup[1];
            $akhir = (int)$grup[2];
            $pendapatanBulanIni[] = Order::where('status', '!=', 'batal')
                ->whereBetween('dipesan_at', [
                    $startOfMonth->copy()->addDays($mulai - 1),
                    $startOfMonth->copy()->addDays($akhir - 1),
                ])
                ->sum('total');
            // bulan lalu
            $mulaiLalu = (int)$kelompokTanggalBulanLalu[$idx][1];
            $akhirLalu = (int)$kelompokTanggalBulanLalu[$idx][2];
            $pendapatanBulanLalu[] = Order::where('status', '!=', 'batal')
                ->whereBetween('dipesan_at', [
                    $lastMonthStart->copy()->addDays($mulaiLalu - 1),
                    $lastMonthStart->copy()->addDays($akhirLalu - 1),
                ])
                ->sum('total');
        }

        // Settings
        $settings = [
            'whatsappNumber' => '081234567890',
            'storeName' => 'Toko Daster',
            'storeTagline' => 'Nyaman dipakai seharian',
        ];

        return Inertia::render('Admin/Laporan/Index', [
            'title' => 'Laporan',
            'user' => auth()->user(),
            'data' => [
                'omzet_hari_ini' => $omzetHariIni,
                'omzet_bulan_ini' => $omzetBulanIni,
                'persentase_bulan_lalu' => $persentaseBulanLalu,
                'pesanan_perlu_diproses' => $pesananPerluDiproses,
                'varian_stok_menipis' => $varianStokMenipis,
                'pesan_belum_dibaca' => $pesanBelumDibaca,
                'produk_terlaris' => $produkTerlaris,
                'pesanan_terbaru' => $pesananTerbaru,
                'varian_stok_menipis_list' => $varianStokMenipisList,
                'pendapatan_bulanan' => [
                    'nama_bulan_ini' => $today->format('F'),
                    'nama_bulan_lalu' => $lastMonth->format('F'),
                    'kelompok' => array_map(fn($grup) => $grup[0], $kelompokTanggalBulanIni),
                    'bulan_ini' => $pendapatanBulanIni,
                    'bulan_lalu' => $pendapatanBulanLalu,
                    'total_bulan_ini' => $omzetBulanIni,
                    'total_bulan_lalu' => $omzetBulanLalu,
                ],
                'riwayat_pesanan_minggu_ini' => $pesananTerbaru, // gunakan pesanan terbaru sebagai placeholder untuk riwayat pesanan minggu ini
                'stok_menipis_daftar' => $varianStokMenipisList,
            ],
            'filters' => [],
            'settings' => $settings,
        ]);
    }
}