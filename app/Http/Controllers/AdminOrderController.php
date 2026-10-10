<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Inertia\Inertia;

class AdminOrderController extends Controller
{
    public function index()
    {
        $orders = Order::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('AdminPesanan', [
            'title' => 'Pesanan',
            'orders' => $orders,
        ]);
    }
}
