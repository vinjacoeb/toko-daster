# Laporan Defek QA: Error Akses Dashboard Admin (HTTP 500)

- **Tanggal**: 09 Oktober 2026
- **Pelapor**: Senior QA Engineer (`qatesting`)
- **Task ID**: `t_a377b534`
- **Status**: Terverifikasi melalui Lampiran `error3.png` dan Inspeksi Kode

---

## 1. Ringkasan Masalah
Ketika pengguna berhasil melakukan login dan diarahkan ke halaman dashboard admin (`/admin`), aplikasi mengalami `500 Internal Server Error` dengan layar debug khas Laravel Ignition.

## 2. Bukti & Analisis (Berdasarkan `error3.png`)
- **Pesan Error Utama**: 
  `Class "App\Http\Controllers\Order" not found`
- **Lokasi Stack Trace**:
  File: `app/Http/Controllers/AdminDashboardController.php`
  Method: `index()`
  Baris: 21 (dan baris-baris berikutnya yang mereferensikan model Eloquent).

## 3. Akar Masalah (Root Cause)
File `app/Http/Controllers/AdminDashboardController.php` menggunakan beberapa Model Eloquent secara langsung tanpa mendeklarasikan statement `use` pada bagian namespace controller tersebut. 
Akibatnya, PHP mencari class tersebut di dalam namespace controller (`App\Http\Controllers\...`), alih-alih di namespace model (`App\Models\...`).

Model yang belum di-*import* di `AdminDashboardController.php`:
1. `Order` (`App\Models\Order`)
2. `Variant` (`App\Models\Variant`)
3. `ContactMessage` (`App\Models\ContactMessage`)
4. `OrderItem` (`App\Models\OrderItem`)

## 4. Rekomendasi Perbaikan untuk Backend Developer
Tambahkan statement import berikut di bagian atas file `app/Http/Controllers/AdminDashboardController.php`:

```php
use App\Models\Order;
use App\Models\Variant;
use App\Models\ContactMessage;
use App\Models\OrderItem;
```

Setelah perbaikan diterapkan, akses ke `/admin` setelah login akan berfungsi normal tanpa error 500.
