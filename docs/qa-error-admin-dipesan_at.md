# Defect Report: Unknown column 'dipesan_at' in /admin

## ID dan judul
- **ID:** DEFECT-ADMIN-001
- **Judul:** Error pada dashboard admin saat menghitung laporan pesanan: Column `dipesan_at` not found.

## Severity dan prioritas
- **Severity:** High
- **Prioritas:** P0 (Bloker akses laporan/dashboard admin)

## Komponen
- Backend (Database Schema / Query)

## Environment
- URL: `/admin` (dashboard)
- PHP: 8.3.32
- Laravel: 13.35.0

## Langkah reproduksi
1. Akses halaman `/admin`.
2. Halaman memuat widget laporan pesanan yang mencoba melakukan query `sum(total)`.
3. Aplikasi melempar `Illuminate\Database\QueryException`.

## Hasil aktual
Aplikasi crash dengan pesan: `SQLSTATE[42S22]: Column not found: 1054 Unknown column 'dipesan_at' in 'where clause'`.

## Hasil yang diharapkan
Laporan pesanan pada dashboard admin tampil tanpa error.

## Bukti
- Screenshot `error19.png` menunjukkan pengecualian `QueryException` pada query: `select sum(total) as aggregate from orders where status != batal and date(dipesan_at) = 2026-10-10`.

## Dugaan penyebab
- Kolom `dipesan_at` tidak ada pada tabel `orders`. Kemungkinan besar kolom yang dimaksud adalah `created_at` atau perlu ditambahkan melalui migrasi baru.
