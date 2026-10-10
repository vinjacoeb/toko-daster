# Laporan QA Gelombang 1 — Proyek Toko Daster

Tanggal: 10 Oktober 2026
QA Engineer: qatesting profile
Status: DSE / Selesai Pengujian Gelombang 1

## 1. Ringkasan Eksekutif
Pengujian Gelombang 1 mencakup validasi halaman publik (`/`, `/product`, `/kontak-kami`, `/login`) serta rute-rute admin utama (`/admin`, `/admin/produk`, `/admin/kategori`, `/admin/stok`, `/admin/pesanan`, `/admin/pesan-masuk`, `/admin/laporan`, `/admin/pengaturan`, `/admin/akun`).

Sebagian besar halaman publik dan rute admin berfungsi dengan baik, namun ditemukan satu isu penting (Critical/High) pada halaman Laporan (`/admin/laporan`) yang menyebabkan HTTP 500 Server Error karena ketidakcocokan nama kolom database pada query `ReportController`.

## 2. Hasil Pengujian Rute Publik
| Rute | Metode | Status HTTP | Hasil Pengamatan | Status |
|---|---|---|---|---|
| `/` | GET | 200 | Halaman Landing merender props dengan baik, data produk dan setting tampil dinamis. | Lulus |
| `/product` | GET | 200 | Katalog produk merender daftar produk dengan filter kategori, pagination, dan pencarian. | Lulus |
| `/kontak-kami` | GET | 200 | Halaman kontak merender formulir, informasi toko, dan FAQ dengan benar. | Lulus |
| `/login` | GET | 200 | Halaman login admin tampil normal, autentikasi berhasil dengan kredensial uji. | Lulus |

## 3. Hasil Pengujian Rute Admin
| Rute | Status HTTP | Hasil Pengamatan | Status |
|---|---|---|---|
| `/admin` | 200 | Dashboard admin merender ringkasan statistik dan data terbaru. | Lulus |
| `/admin/produk` | 200 | Manajemen produk menampilkan daftar, status tayang, dan aksi kelola. | Lulus |
| `/admin/kategori` | 200 | Manajemen kategori produk berfungsi normal. | Lulus |
| `/admin/stok` | 200 | Manajemen stok dan mutasi tampil sesuai skema. | Lulus |
| `/admin/pesanan` | 200 | Manajemen pesanan merender daftar transaksi dengan baik. | Lulus |
| `/admin/pesan-masuk` | 200 | Manajemen pesan masuk menampilkan daftar kontak pelanggan. | Lulus |
| `/admin/laporan` | 500 | **Gagal**: SQLSTATE[42S22]: Column not found: 1054 Unknown column 'dipesan_at' in 'where clause' pada `ReportController`. | **Gagal (Critical)** |
| `/admin/pengaturan` | 200 | Pengaturan toko merender form pengaturan umum dan WhatsApp. | Lulus |
| `/admin/akun` | 200 | Pengelolaan akun admin berfungsi. | Lulus |

## 4. Rincian Defect (Bug Report)

### BUG-01: HTTP 500 pada Halaman Laporan Admin
- **Komponen:** Backend (`ReportController`)
- **Severity:** High
- **Prioritas:** P0
- **Langkah Reproduksi:**
  1. Login ke panel admin (`/login`).
  2. Akses rute `/admin/laporan`.
- **Hasil Aktual:** Muncul halaman error 500 Laravel ("SQLSTATE[42S22]: Column not found: 1054 Unknown column 'dipesan_at' in 'where clause'").
- **Hasil yang Diharapkan:** Halaman laporan merender ringkasan pendapatan dan penjualan berdasarkan tanggal pesanan tanpa error.
- **Analisis Akar Masalah:** Pada `app/Http/Controllers/Admin/ReportController.php`, query menggunakan kolom `dipesan_at`, padahal migrasi tabel `orders` menggunakan kolom `ordered_at` (atau `created_at`).

## 5. Rekomendasi Go / No-Go
- **Status Rekomendasi:** **GO BERSYARAT**
- **Alasan:**
  1. Seluruh rute publik dan mayoritas rute admin (Dashboard, Produk, Kategori, Stok, Pesanan, Pesan Masuk, Pengaturan, Akun) berfungsi dengan baik dan lulus pengujian.
  2. Satu-satunya kendala kritis ada pada fitur Laporan (`/admin/laporan`) yang mengalami error 500 akibat salah nama kolom (`dipesan_at` vs `ordered_at`).
  3. **Syarat rilis:** Tim backend perlu memperbaiki query di `ReportController.php` (mengubah `dipesan_at` menjadi `ordered_at` atau `created_at`) sebelum rilis penuh ke production.
