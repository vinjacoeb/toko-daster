# Laporan Defect: Error saat Restok dan Pengurangan Stok pada `/admin/stok`

## Deskripsi Defect
Terjadi `Internal Server Error` (HTTP 500) saat melakukan aksi restok atau pengurangan stok pada halaman `/admin/stok`. Aplikasi melempar `Illuminate\Database\QueryException`.

## Bukti
- Berdasarkan tangkapan layar `error18.png` dan laporan operator, terjadi error database.
- Exception: `Illuminate\Database\QueryException`
- Pesan Error: `SQLSTATE[42S22]: Column not found: 1054 Unknown column 'variant_id' in 'field list'`
- Query yang gagal: `insert into stock_movements (variant_id, jumlah, alasan, order_id, user_id, catatan, updated_at, created_at) values (18, 1, restock, ?, 1, ?, 2026-10-10 19:06:45, 2026-10-10 19:06:45)`

## Analisis Akar Masalah
- Model `StockMovement` dan `StockService` mencoba melakukan `insert` dengan kolom `variant_id`.
- Namun, kolom `variant_id` tidak ditemukan pada tabel database `stock_movements` saat query dijalankan, meskipun migration `2026_10_09_065828_create_stock_movements_table.php` terlihat sudah mendefinisikan kolom tersebut.
- Hal ini menunjukkan ketidaksinkronan antara skema database saat ini dengan definisinya di migration.

## Dampak
- Admin tidak dapat melakukan restok atau pengurangan stok.
- Fitur manajemen stok tidak dapat digunakan.

## Rekomendasi
- Backend Developer perlu memeriksa skema tabel `stock_movements` di database dan melakukan perbaikan (misalnya menjalankan migration ulang atau menambahkan kolom yang hilang jika belum ada).
