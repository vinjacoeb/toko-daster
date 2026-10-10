# QA: Analisis ProdukSeeder dan Tampilan Produk

## Fokus Tes
- Memverifikasi ProdukSeeder berhasil mengisi database.
- Memverifikasi ProdukSeeder mengisi tepat 20 produk.
- Memverifikasi komposisi status benar (18 tayang, 1 draf, 1 arsip).
- Memverifikasi setiap produk memiliki 3 foto SVG placeholder unik.
- Memverifikasi SKU mengikuti pola yang benar.
- Memverifikasi pengecekan ulang seeder (idempotensi).
- Memverifikasi data produk yang dihasilkan tersedia melalui API publik.

## Tes yang Dijalankan

### 1. Eksekusi ProdukSeeder (Gagal)
**ID**: TS-000
**Persyaratan**: ProdukSeeder berhasil dijalankan tanpa error.
**Hasil**: Gagal - `php artisan db:seed --class=ProdukSeeder` gagal dijalankan.
**Detail**: Seeder gagal menemukan data kategori di database (`Category::where(...)` mengembalikan `null`), menyebabkan produk diskip (`continue`). Tidak ada seeder untuk tabel `categories`.
**Bukti**: Log error seeder saat eksekusi.

### 2. Komposisi Produk (Gagal - Blocker)
**ID**: TS-001
**Persyaratan**: 20 nama/slug/sku unik.
**Hasil**: Gagal - Produk tidak berhasil masuk ke database karena kegagalan seeding kategori.

### 3. Komposisi Status Produk (Gagal - Blocker)
**ID**: TS-002
**Persyaratan**: Komposisi status benar (18 tayang, 1 draf, 1 arsip).
**Hasil**: Gagal - Data tidak terisi.

### 4. Foto Produk – Jumlah dan format (Gagal - Blocker)
**ID**: TS-003
**Persyaratan**: 60 foto SVG placeholder.
**Hasil**: Gagal - Data tidak terisi.

### 5. Format SKU unik (Lulus - Berdasarkan Review Kode)
**ID**: TS-004
**Persyaratan**: Pola SKU DS-{NN}-{UKURAN}-{n} benar.
**Hasil**: Lulus - Logika `generateSku` pada `ProdukSeeder.php` sudah benar.

### 6. Idempotensi seeder (Lulus - Berdasarkan Review Kode)
**ID**: TS-005
**Persyaratan**: Menjalankan seeder dua kali menghasilkan data yang sama.
**Hasil**: Lulus - Penggunaan `updateOrCreate` pada `ProdukSeeder.php` sudah benar.

### 7. Aksesibilitas publik – GET /product dan detail (Belum Diuji)
**ID**: TS-006/TS-007
**Persyaratan**: Halaman katalog publik menampilkan produk tayang.
**Hasil**: Belum Diuji - Menunggu seeding berhasil.

## Ringkasan Defect
- **Defect ID**: DEF-001
- **Severity**: Critical
- **Judul**: ProdukSeeder gagal karena tidak ada data kategori.
- **Dampak**: Database kosong, aplikasi tidak dapat digunakan untuk pengembangan/demo.

## Rekomendasi
1. Buat `CategorySeeder` untuk mengisi data kategori (`Daster Batik`, `Daster Rumahan`, `Daster Kancing Depan`, `Daster Lengan Panjang`).
2. Perbarui `DatabaseSeeder.php` untuk memanggil `CategorySeeder` sebelum `ProdukSeeder.php`.
3. Jalankan kembali seeder.
4. Setelah seeding berhasil, lanjutkan pengujian aksesibilitas publik.
