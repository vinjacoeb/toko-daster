<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        return Inertia::render('Admin/Akun/Index', [
            'title' => 'Akun',
            'user' => $user,
            'data' => $user,
            'filters' => [],
            'settings' => [
                'whatsappNumber' => '081234567890',
                'storeName' => 'Toko Daster',
                'storeTagline' => 'Nyaman dipakai seharian',
            ],
        ]);
    }
}