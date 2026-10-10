<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $settings = [
            ['key' => 'store_name', 'value' => 'Toko Daster'],
            ['key' => 'store_tagline', 'value' => 'Nyaman dipakai seharian'],
            ['key' => 'store_description', 'value' => 'Toko daster dengan koleksi motif terlengkap dan nyaman.'],
            ['key' => 'whatsapp_number', 'value' => '628123456789'],
            ['key' => 'email', 'value' => 'info@tokodaster.test'],
            ['key' => 'address', 'value' => 'Jl. Contoh No. 1, Jakarta'],
            ['key' => 'jam_buka', 'value' => '08:00 - 17:00'],
            ['key' => 'instagram', 'value' => '@tokodaster.test'],
            ['key' => 'maps_url', 'value' => 'https://maps.google.com/?q=jakarta'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                ['value' => $setting['value']]
            );
        }
    }
}
