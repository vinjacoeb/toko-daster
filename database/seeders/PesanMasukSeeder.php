<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ContactMessage;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class PesanMasukSeeder extends Seeder
{
    public function run(): void
    {
        // Hanya local
        if (!app()->isLocal()) return;

        DB::transaction(function () {
            // Hapus pesan masuk contoh (ip == 127.0.0.1)
            ContactMessage::where('ip', '127.0.0.1')->delete();

            // Data 12 pesan dari seed-pesanan.md
            $now = now('Asia/Jakarta');
            $pesanData = [
                [
                    'nama' => 'Rina Wulandari',
                    'kontak' => '628120000001',
                    'pesan' => 'Halo kak, Daster Batik Parang Biru ukuran XL masih ada? Kalau ada, bisa dikirim ke Bandung?',
                    'hari_lalu' => 0,
                    'dibaca' => false,
                ],[
                    'nama' => 'Dewi Lestari',
                    'kontak' => 'dewi.lestari@example.com',
                    'pesan' => 'Mau tanya, ada harga untuk beli banyak? Saya butuh 12 daster untuk seragam arisan.',
                    'hari_lalu' => 0,
                    'dibaca' => false,
                ],[
                    'nama' => 'Tini Suryani',
                    'kontak' => '628120000002',
                    'pesan' => 'Bahan Daster Lurik Kunyit panas tidak ya? Saya tinggal di daerah yang gerah.',
                    'hari_lalu' => 1,
                    'dibaca' => false,
                ],[
                    'nama' => 'Maya Putri',
                    'kontak' => 'maya.putri@example.com',
                    'pesan' => 'Pesanan saya belum sampai padahal sudah seminggu. Mohon dicek ya, terima kasih.',
                    'hari_lalu' => 1,
                    'dibaca' => false,
                ],[
                    'nama' => 'Siti Rahmawati',
                    'kontak' => '628120000003',
                    'pesan' => "Pesan panjang tentang syarat menjadi reseller: minimal pembelian, harga, dan pengiriman.\n\nBoleh menggunakan foto dari katalog resmi dengan mencantumkan sumber.\n\nSilakan hubungi admin via WhatsApp untuk pendaftaran resmi.",
                    'hari_lalu' => 2,
                    'dibaca' => false,
                ],[
                    'nama' => 'Andi Pratama',
                    'kontak' => '628120000004',
                    'pesan' => 'Apakah toko buka hari Minggu?',
                    'hari_lalu' => 2,
                    'dibaca' => false,
                ],[
                    'nama' => 'Lina Marlina',
                    'kontak' => 'lina.marlina@example.com',
                    'pesan' => 'Daster Polos Pandan kapan ada lagi? Saya cari ukuran All Size.',
                    'hari_lalu' => 3,
                    'dibaca' => false,
                ],[
                    'nama' => 'Fitri Handayani',
                    'kontak' => '628120000005',
                    'pesan' => 'Terima kasih kak, dasternya bagus dan sesuai foto 🙏',
                    'hari_lalu' => 4,
                    'dibaca' => true,
                ],[
                    'nama' => 'Yuni Astuti',
                    'kontak' => 'yuni.astuti@example.com',
                    'pesan' => 'Bisa kirim ke luar Jawa? Berapa ongkirnya ke Makassar?',
                    'hari_lalu' => 5,
                    'dibaca' => true,
                ],[
                    'nama' => 'Rahma Sari',
                    'kontak' => '628120000006',
                    'pesan' => 'Ukuran L itu muat sampai berapa lingkar dada ya?',
                    'hari_lalu' => 6,
                    'dibaca' => true,
                ],[
                    'nama' => 'Jasa Promosi',
                    'kontak' => 'promosi@example.com',
                    'pesan' => 'Jasa promosi Instagram murah, hubungi kami di [LINK CONTOH].',
                    'hari_lalu' => 8,
                    'dibaca' => true,
                ],[
                    'nama' => 'Tono',
                    'kontak' => 'tono@example.com',
                    'pesan' => "Uji karakter: <b>tebal</b> & 'kutip tunggal' \"kutip ganda\" dan baris baru:<br>dua.",
                    'hari_lalu' => 10,
                    'dibaca' => true,
                ],
            ];

            foreach ($pesanData as $data) {
                $created = $now->copy()->subDays($data['hari_lalu']);
                ContactMessage::updateOrCreate([
                    'nama' => $data['nama'],
                    'kontak' => $data['kontak'],
                    'pesan' => $data['pesan'],
                    'ip' => '127.0.0.1',
                ], [
                    'created_at' => $created,
                    'dibaca_at' => $data['dibaca'] ? $created->copy()->addHours(2) : null,
                ]);
            }
        });
    }
}
