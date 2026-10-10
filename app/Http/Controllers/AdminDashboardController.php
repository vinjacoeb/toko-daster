<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Models\Order;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\Variant;
use App\Models\ContactMessage;
use App\Models\OrderItem;
use Carbon\CarbonImmutable;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $today = CarbonImmutable::today();
        $startOfMonth = CarbonImmutable::now()->startOfMonth();
        $startOfLastMonth = CarbonImmutable::now()->subMonth()->startOfMonth();
        $endOfLastMonth = CarbonImmutable::now()->subMonth()->endOfMonth();

        $settings = Setting::pluck('value', 'key')->toArray();

        // Omzet hari ini & bulan ini
        $todayRevenue = Order::where('status', '!=', 'batal')
            ->whereDate('created_at', $today)
            ->sum('total');
        $thisMonthRevenue = Order::where('status', '!=', 'batal')
            ->where('created_at', '>=', $startOfMonth)
            ->sum('total');
        $lastMonthRevenue = Order::where('status', '!=', 'batal')
            ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
            ->sum('total');
        $monthOverMonth = $lastMonthRevenue > 0 ? round((($thisMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 2) : 0;

        // Pesanan perlu diproses
        $pendingOrders = Order::whereIn('status', ['baru', 'dibayar', 'dikemas'])->count();

        // Stok menipis
        $lowStock = Variant::where('stock', '>', 0)
            ->where('stock', '<=', 'stock_minimum')
            ->count();

        // Pesan belum dibaca
        $unreadMessages = ContactMessage::whereNull('dibaca_at')->count();

        // Grafik omzet 30 hari terakhir
        $last30Days = collect(range(0, 29))->map(function ($day) {
            $date = CarbonImmutable::today()->subDays($day);
            return $date->toDateString();
        })->reverse();

        $revenueChart = Order::where('status', '!=', 'batal')
            ->whereBetween('created_at', [CarbonImmutable::now()->subDays(29), CarbonImmutable::now()])
            ->get()
            ->groupBy(function ($order) {
                return CarbonImmutable::parse($order->created_at)->toDateString();
            })
            ->map(function ($orders, $date) {
                return $orders->sum('total');
            })
            ->pipe(function ($data) use ($last30Days) {
                return $last30Days->map(function ($day) use ($data) {
                    return $data->get($day, 0);
                });
            })
            ->toArray();

        // Produk terlaris 30 hari terakhir
        $topProducts = OrderItem::selectRaw('products.name, SUM(order_items.qty) as total_sold')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->where('orders.status', '!=', 'batal')
            ->where('orders.created_at', '>=', CarbonImmutable::now()->subDays(29))
            ->groupBy('products.name')
            ->orderByDesc('total_sold')
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'product_name' => $item->products->name,
                    'total_sold' => $item->total_sold,
                ];
            });

        // Pesanan terbaru
        $recentOrders = Order::with('user')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($order) {
                return [
                    'code' => $order->code,
                    'customer_name' => $order->customer_name,
                    'total' => $order->total,
                    'status' => $order->status,
                    'ordered_at' => $order->created_at->toDateTimeString(),
                ];
            });

        // Stok menipis (daftar varian)
        $lowStockVariants = Variant::with('product')
            ->where('stock', '>', 0)
            ->where('stock', '<=', 'stock_minimum')
            ->limit(5)
            ->get()
            ->map(function ($variant) {
                return [
                    'id' => $variant->id,
                    'sku' => $variant->sku,
                    'size' => $variant->size,
                    'color' => $variant->color,
                    'stock' => $variant->stock,
                    'stock_minimum' => $variant->stock_minimum,
                    'product_name' => $variant->product->name ?? null,
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'title' => 'Dashboard',
            'stats' => [
                'todayRevenue' => $todayRevenue,
                'thisMonthRevenue' => $thisMonthRevenue,
                'monthOverMonth' => $monthOverMonth,
                'pendingOrders' => $pendingOrders,
                'lowStock' => $lowStock,
                'unreadMessages' => $unreadMessages,
            ],
            'grafik_omzet' => $revenueChart,
            'produk_terlaris' => $topProducts,
            'pesanan_terbaru' => $recentOrders,
            'stok_menipis' => $lowStockVariants,
            'settings' => [
                'whatsappNumber' => $settings['whatsapp_number'] ?? '',
                'storeName' => $settings['store_name'] ?? '',
            ],
        ]);
    }
}
