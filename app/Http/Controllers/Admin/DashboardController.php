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
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /** Status yang dihitung sebagai omzet (PRD 6.7): bukan baru, bukan batal. */
    private const OMZET_STATUS = ['dibayar', 'dikemas', 'dikirim', 'selesai'];

    /** Status pesanan yang masih perlu diproses. */
    private const PERLU_DIPROSES = ['baru', 'dibayar', 'dikemas'];

    private const NAMA_BULAN = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ];

    public function index()
    {
        // -- PATCHED: dashboard baru kontrak §7 dan definisi PRD 6.7, lihat docs/kontrak-props.md dan dashboard-tambahan.md --
        $today = Carbon::today();
        $startOfMonth = $today->copy()->startOfMonth();
        $lastMonth = $today->copy()->subMonth();
        $lastMonthStart = $lastMonth->copy()->startOfMonth();
        $lastMonthEnd = $lastMonth->copy()->endOfMonth();

        // Omzet hari ini
        $omzetHariIni = Order::where('status', '!=', 'batal')
            ->whereDate('dipesan_at', $today)
            ->sum('total');

        // Omzet kemarin
        $kemarin = $today->copy()->subDay();
        $omzetKemarin = Order::where('status', '!=', 'batal')
            ->whereDate('dipesan_at', $kemarin)
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
        $varianStokMenipis = Variant::whereColumn('stok', '<=', 'stok_minimum')
            ->with('product')
            ->get()
            ->count();

        // Pesan belum dibaca (berdasarkan dibaca_at)
        $pesanBelumDibaca = ContactMessage::where('dibaca_at', null)
            ->count();

        // Perbandingan pembanding: hari_ini vs kemarin, minggu_ini vs minggu_lalu, bulan_ini vs bulan_lalu
                // Hari ini: label jam 00 s.d. jam sekarang
                $jamSekarang = $today->hour;
                $perbandinganHariIni = [
                    'label' => [],
                    'sekarang' => [],
                    'pembanding' => [],
                    'total_sekarang' => $omzetHariIni,
                    'total_pembanding' => $omzetKemarin,
                ];
                for ($h = 0; $h <= $jamSekarang; $h++) {
                    $perbandinganHariIni['label'][] = $h . ':00';
                    $perbandinganHariIni['sekarang'][] = Order::where('status', '!=', 'batal')
                        ->whereDate('dipesan_at', $today)
                        ->whereRaw('HOUR(dipesan_at) = ?', [$h])
                        ->sum('total');
                    $perbandinganHariIni['pembanding'][] = Order::where('status', '!=', 'batal')
                        ->whereDate('dipesan_at', $kemarin)
                        ->whereRaw('HOUR(dipesan_at) = ?', [$h])
                        ->sum('total');
                }

                // Minggu ini vs minggu lalu (Senin hingga Minggu)
                $startOfWeek = $today->copy()->startOfWeek(); // Senin
                $endOfWeek = $today->copy()->endOfWeek();       // Minggu
                $startOfLastWeek = $startOfWeek->copy()->subWeek();
                $endOfLastWeek = $endOfWeek->copy()->subWeek();

                $perbandinganMingguIni = [
                    'label' => [],
                    'sekarang' => [],
                    'pembanding' => [],
                    'total_sekarang' => Order::where('status', '!=', 'batal')
                        ->whereBetween('dipesan_at', [$startOfWeek, $endOfWeek])
                        ->sum('total'),
                    'total_pembanding' => Order::where('status', '!=', 'batal')
                        ->whereBetween('dipesan_at', [$startOfLastWeek, $endOfLastWeek])
                        ->sum('total'),
                ];
                for ($d = 0; $d < 7; $d++) {
                    $hari = $startOfWeek->copy()->addDays($d);
                    $perbandinganMingguIni['label'][] = $hari->format('D');
                    $perbandinganMingguIni['sekarang'][] = Order::where('status', '!=', 'batal')
                        ->whereDate('dipesan_at', $hari)
                        ->sum('total');
                    $hariPembanding = $startOfLastWeek->copy()->addDays($d);
                    $perbandinganMingguIni['pembanding'][] = Order::where('status', '!=', 'batal')
                        ->whereDate('dipesan_at', $hariPembanding)
                        ->sum('total');
                }

                // Bulan ini vs bulan lalu (per grup tanggal 1-7, 8-14, 15-21, 22-28, 29-31)
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
                $perbandinganBulanIni = [
                    'label' => [],
                    'sekarang' => [],
                    'pembanding' => [],
                    'total_sekarang' => $omzetBulanIni,
                    'total_pembanding' => $omzetBulanLalu,
                ];
                foreach ($kelompokTanggalBulanIni as $idx => $grup) {
                    $namaGrup = $grup[0];
                    $mulai = (int)$grup[1];
                    $akhir = (int)$grup[2];
                    $perbandinganBulanIni['label'][] = $namaGrup;
                    $perbandinganBulanIni['sekarang'][] = Order::where('status', '!=', 'batal')
                        ->whereBetween('dipesan_at', [
                            $startOfMonth->copy()->addDays($mulai - 1),
                            $startOfMonth->copy()->addDays($akhir - 1),
                        ])
                        ->sum('total');
                    // bulan lalu
                    $mulaiLalu = (int)$kelompokTanggalBulanLalu[$idx][1];
                    $akhirLalu = (int)$kelompokTanggalBulanLalu[$idx][2];
                    $perbandinganBulanIni['pembanding'][] = Order::where('status', '!=', 'batal')
                        ->whereBetween('dipesan_at', [
                            $lastMonthStart->copy()->addDays($mulaiLalu - 1),
                            $lastMonthStart->copy()->addDays($akhirLalu - 1),
                        ])
                        ->sum('total');
                }

                // Nama bulan ini dan bulan lalu
                $namaBulanIni = $today->format('F');
                $namaBulanLalu = $lastMonth->format('F');

                // 5 pesanan terbaru (riwayat pesanan minggu ini)
                $startOfWeek = $today->copy()->startOfWeek(); // Senin
                $riwayatPesananMingguIni = Order::with(['user', 'items.variant.product'])
                    ->where('dipesan_at', '>=', $startOfWeek)
                    ->orderByDesc('dipesan_at')
                    ->limit(5)
                    ->get()
                    ->map(function ($order) {
                        return [
                            'id' => $order->id,
                            'kode' => $order->kode,
                            'nama_pelanggan' => $order->nama_pelanggan,
                            'total' => $order->total,
                            'status' => $order->status,
                            'dipesan_at' => $order->dipesan_at,
                        ];
                    });

                // 5 varian stok menipis (stok <= stok_minimum)
                $varianStokMenipisList = Variant::whereColumn('stok', '<=', 'stok_minimum')
                    ->with('product')
                    ->limit(5)
                    ->get()
                    ->map(function ($variant) {
                        return [
                            'varian_id' => $variant->id,
                            'produk_nama' => $variant->product->nama,
                            'ukuran' => $variant->size,
                            'warna' => $variant->color,
                            'stok' => $variant->stok,
                            'stok_minimum' => $variant->stok_minimum,
                        ];
                    });

                // 5 produk terlaris (30 hari terakhir)
                $produkTerlaris = OrderItem::select('product_id', DB::raw('SUM(qty) as jumlah_terjual'))
                    ->join('orders', 'order_items.order_id', '=', 'orders.id')
                    ->where('orders.status', '!=', 'batal')
                    ->where('orders.dipesan_at', '>=', $today->copy()->subDays(30))
                    ->groupBy('product_id')
                    ->orderByDesc('jumlah_terjual')
                    ->limit(5)
                    ->with('product')
                    ->get()
                    ->map(function ($item) {
                        return [
                            'id' => $item->product_id,
                            'nama' => $item->product->nama,
                            'jumlah_terjual' => $item->jumlah_terjual,
                            'omzet' => $item->jumlah_terjual * $item->product->price,
                        ];
                    });

                // Pendapatan bulanan: omzet per minggu dalam bulan ini vs bulan lalu
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

        // Mapping data untuk frontend
        $kartu = [
            'omzet_hari_ini' => $omzetHariIni,
            'omzet_kemarin' => $omzetKemarin,
            'omzet_bulan_ini' => $omzetBulanIni,
            'omzet_bulan_lalu' => $omzetBulanLalu,
            'persentase_bulan_lalu' => $persentaseBulanLalu,
            'pesanan_perlu_diproses' => $pesananPerluDiproses,
            'stok_menipis' => $varianStokMenipis,
            'pesan_belum_dibaca' => $pesanBelumDibaca,
        ];

        // Graph omzet 30 hari
        $grafikOmzet30Hari = [];
        for ($i = 29; $i >= 0; $i--) {
            $tanggal = $today->copy()->subDays($i);
            $grafikOmzet30Hari[] = Order::where('status', '!=', 'batal')
                ->whereDate('dipesan_at', $tanggal)
                ->sum('total');
        }

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
                    'total' => $order->total,
                    'status' => $order->status,
                    'dipesan_at' => $order->dipesan_at,
                ];
            });

        return Inertia::render('Admin/Dashboard/Index', [
            'title' => 'Dashboard',
            'data' => [
                'omzet_hari_ini' => $omzetHariIni,
                'omzet_kemarin' => $omzetKemarin,
                'omzet_bulan_ini' => $omzetBulanIni,
                'omzet_bulan_lalu' => $omzetBulanLalu,
                'persentase_bulan_lalu' => $persentaseBulanLalu,
                'pesanan_perlu_diproses' => $pesananPerluDiproses,
                'varian_stok_menipis' => $varianStokMenipis,
                'pesan_belum_dibaca' => $pesanBelumDibaca,
                'grafik_omzet_30_hari' => $grafikOmzet30Hari,
                'produk_terlaris' => $produkTerlaris,
                'pesanan_terbaru' => $pesananTerbaru,
                'varian_stok_menipis_list' => $varianStokMenipisList,
                'pendapatan_bulanan' => [
                    'nama_bulan_ini' => $namaBulanIni,
                    'nama_bulan_lalu' => $namaBulanLalu,
                    'kelompok' => array_map(fn($grup) => $grup[0], $kelompokTanggalBulanIni),
                    'bulan_ini' => $pendapatanBulanIni,
                    'bulan_lalu' => $pendapatanBulanLalu,
                    'total_bulan_ini' => $omzetBulanIni,
                    'total_bulan_lalu' => $omzetBulanLalu,
                ],
                'riwayat_pesanan_minggu_ini' => $riwayatPesananMingguIni,
                'stok_menipis_daftar' => $varianStokMenipisList,
            ],
            'kartu' => $kartu,
            'perbandingan' => [
                'hari_ini' => $perbandinganHariIni,
                'minggu_ini' => $perbandinganMingguIni,
                'bulan_ini' => $perbandinganBulanIni,
            ],
            'settings' => $settings,
        ]);
    }
}