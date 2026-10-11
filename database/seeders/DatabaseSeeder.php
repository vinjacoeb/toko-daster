<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Akun Admin Dev
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );

        // 2. Pengaturan Toko
        $this->call(SettingsSeeder::class);

        // 3. Kategori untuk produk (diperlukan oleh ProdukSeeder)
        $this->call(CategorySeeder::class);

        // 4. Produk Contoh (20 produk berbeda)
        $this->call(ProdukSeeder::class);

        // 5. Pesanan dan Pesan Masuk Contoh (khusus lokal)
        $this->call(PesananSeeder::class);
        $this->call(PesanMasukSeeder::class);
        $this->call(ContactMessageCommentSeeder::class);
    }
}