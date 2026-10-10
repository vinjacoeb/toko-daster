<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::first();
        
        if (!$settings) {
            $settings = (object) [
                'whatsappNumber' => '081234567890',
                'storeName' => 'Toko Daster',
                'storeTagline' => 'Nyaman dipakai seharian',
            ];
        }

        return Inertia::render('Admin/Pengaturan/Index', [
            'title' => 'Pengaturan',
            'user' => auth()->user(),
            'data' => $settings,
            'filters' => [],
            'settings' => $settings,
        ]);
    }

    public function update()
    {
        // Implementasi update akan ditangani oleh OrderController atau OrderController.php
        // Ini adalah placeholder untuk implementasi update nanti
    }
}