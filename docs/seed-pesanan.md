# seed-pesanan.md: data contoh pesanan dan pesan masuk

Semua data **[CONTOH]**, hanya untuk database lokal. Sumber untuk `backenddeveloper` saat menulis `database/seeders/PesananSeeder.php` dan `PesanMasukSeeder.php`. Nama tabel dan kolom: ikuti `docs/db.md` dan migrasi yang benar-benar ada. Kolom yang tidak ada dicatat di `docs/catatan-backend.md`, bukan dibuatkan migrasi.

## 1. Aturan umum
- Hanya environment `local`. Dipanggil dari `DatabaseSeeder` setelah `ProdukSeeder`.
- Idempoten: sebelum membuat, hapus baris contoh lama saja (pesanan dengan `catatan` diawali `[CONTOH]` beserta item-nya; pesan kontak dengan `ip` = `127.0.0.1` yang berasal dari seeder ini), lalu buat ulang. Dijalankan dua kali: tetap 40 pesanan dan 12 pesan. Data buatan admin tidak boleh terhapus.
- Hasil harus deterministik (tanpa acak yang berubah tiap eksekusi). Tanggal dihitung relatif terhadap hari ini (zona Asia/Jakarta) agar dashboard selalu punya data.
- Data contoh tidak mengubah `stok` varian dan tidak membuat `stock_movements` (pesanan dianggap data historis). Catat ini di `docs/catatan-backend.md`.
- Jangan menyentuh produk, varian, kategori, dan pengguna.

## 2. Pesanan: 40 baris
**Sebaran tanggal (zona Asia/Jakarta):**
| Kelompok | Jumlah | Aturan |
|---|---|---|
| Hari ini | 3 | jam berbeda, sebelum jam sekarang (jika sekarang sebelum jam 08.00, tetap pakai jam sebelum sekarang atau 00.30) |
| Minggu ini, sebelum hari ini | 9 | tersebar di hari yang sudah lewat sejak Senin; jika hari ini Senin, jatuhkan ke hari ini |
| Bulan ini, di luar minggu ini | 10 | tersebar dari tanggal 1 sampai sebelum Senin minggu ini; jika tidak ada hari tersedia, jatuhkan ke hari-hari bulan ini yang sudah lewat |
| Bulan lalu | 18 | tersebar merata di seluruh bulan lalu, agar grafik batang punya 4 sampai 5 kelompok minggu |

**Status (total 40):** `baru` 4, `dibayar` 5, `dikemas` 4, `dikirim` 5, `selesai` 18, `batal` 4. Pastikan hari ini dan minggu ini memuat campuran status (minimal satu `baru`, satu `dibayar`, satu `selesai` hari ini atau minggu ini) dan bulan lalu hampir seluruhnya `selesai` (beberapa `dikirim` dan satu `batal`).

**Kanal:** `whatsapp` 24, `marketplace` 10, `langsung` 6.

**Kode:** format `TD-YYMMDD-NNN` dari tanggal pesanan, nomor urut harian dari 001, unik.

**Isi tiap pesanan:**
- Item: 1 sampai 3 baris, jumlah (qty) 1 sampai 3, varian dipilih dari varian milik produk berstatus `tayang` (bergilir deterministik agar semua produk terjual sebagian dan produk unggulan lebih sering). Salin ke item: nama produk, warna, ukuran, harga satuan saat itu (harga varian atau harga produk), qty.
- `subtotal` = jumlah harga x qty; `ongkir` bergilir 0, 10000, 15000, 20000; `diskon` 0 kecuali 6 pesanan yang bernilai 5000 atau 10000; `total` = subtotal + ongkir - diskon (harus tepat).
- `catatan` selalu diawali `[CONTOH]`. `dipesan_at` sesuai kelompok tanggal. `resi` terisi untuk status `dikirim` dan `selesai` (contoh `JNT000000001`, urut), kosong untuk lainnya. Alamat terisi untuk sekitar separuh pesanan (kota fiktif seperti "Jl. Contoh No. 12, Kota Contoh").
- Pelanggan (15 nama, dipakai bergantian, nomor HP fiktif `62812000000NN`): Siti Rahmawati, Dewi Lestari, Rina Wulandari, Fitri Handayani, Yuni Astuti, Nur Hidayah, Maya Putri, Lina Marlina, Rahma Sari, Tini Suryani, Wati Kusuma, Ani Purwanti, Sri Mulyani, Endah Pratiwi, Ratna Dewi.
- Nilai total pesanan bervariasi (sekitar Rp70.000 sampai Rp450.000).

## 3. Pesan masuk: 12 baris
Status dibaca: 7 belum dibaca, 5 sudah dibaca. `ip` = `127.0.0.1`. Waktu tersebar 14 hari terakhir (lihat kolom Hari lalu).

| # | Nama | Kontak | Pesan | Hari lalu | Dibaca |
|---|---|---|---|---|---|
| 1 | Rina Wulandari | 628120000001 | Halo kak, Daster Batik Parang Biru ukuran XL masih ada? Kalau ada, bisa dikirim ke Bandung? | 0 | tidak |
| 2 | Dewi Lestari | dewi.lestari@example.com | Mau tanya, ada harga untuk beli banyak? Saya butuh 12 daster untuk seragam arisan. | 0 | tidak |
| 3 | Tini Suryani | 628120000002 | Bahan Daster Lurik Kunyit panas tidak ya? Saya tinggal di daerah yang gerah. | 1 | tidak |
| 4 | Maya Putri | maya.putri@example.com | Pesanan saya belum sampai padahal sudah seminggu. Mohon dicek ya, terima kasih. | 1 | tidak |
| 5 | Siti Rahmawati | 628120000003 | Pesan panjang 700 sampai 900 karakter dengan 3 paragraf (baris kosong di antaranya) tentang syarat menjadi reseller: minimal pembelian, harga, pengiriman, dan apakah boleh memakai foto toko. | 2 | tidak |
| 6 | Andi Pratama | 628120000004 | Apakah toko buka hari Minggu? | 2 | tidak |
| 7 | Lina Marlina | lina.marlina@example.com | Daster Polos Pandan kapan ada lagi? Saya cari ukuran All Size. | 3 | tidak |
| 8 | Fitri Handayani | 628120000005 | Terima kasih kak, dasternya bagus dan sesuai foto 🙏 | 4 | ya |
| 9 | Yuni Astuti | yuni.astuti@example.com | Bisa kirim ke luar Jawa? Berapa ongkirnya ke Makassar? | 5 | ya |
| 10 | Rahma Sari | 628120000006 | Ukuran L itu muat sampai berapa lingkar dada ya? | 6 | ya |
| 11 | Jasa Promosi | promosi@example.com | Jasa promosi Instagram murah, hubungi kami di [LINK CONTOH]. | 8 | ya |
| 12 | Tono | tono@example.com | Uji karakter: <b>tebal</b> & 'kutip tunggal' "kutip ganda" dan baris baru:<br>dua. | 10 | ya |

Pesan 12 menguji bahwa teks ditampilkan apa adanya (di-escape), bukan sebagai HTML. Pesan 5 menguji teks panjang dan baris baru. Pesan 8 menguji emoji.

## 4. Verifikasi (dicatat di `docs/catatan-backend.md`)
- `php artisan db:seed --class=PesananSeeder` dan `PesanMasukSeeder`, masing-masing dua kali; `php artisan db:show --counts` menunjukkan pesanan 40, item sesuai (>= 40), pesan kontak 12 (belum termasuk data buatan admin).
- Rekap: jumlah pesanan per status, per kelompok tanggal, dan per kanal sesuai bagian 2; total pesanan `subtotal + ongkir - diskon` benar untuk semua baris.
- Tidak ada kode pesanan ganda; nilai `stok` varian tidak berubah setelah seeder dijalankan.
