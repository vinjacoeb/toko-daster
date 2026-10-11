# Laporan QA: Error pada Halaman Admin Pesanan

## 1. Pemahaman Fitur
Halaman Admin Pesanan (`/admin/pesanan`) berfungsi untuk menampilkan daftar pesanan pelanggan yang dapat diakses oleh admin.

## 2. Temuan Defect
Ditemukan `ReferenceError: route is not defined` saat mengakses `/admin/pesanan`.

- **Lokasi:** `resources/js/Pages/Admin/Order/Index.jsx`, baris 42.
- **Penyebab:** Penggunaan fungsi `route()` yang tidak terdefinisi/tidak tersedia (tidak ada package `ziggy-js` di `package.json`).
- **Dampak:** Halaman Pesanan tidak dapat dimuat (blank page/crash pada sisi client).
- **Prioritas:** P0 (Critical - Fitur utama admin pesanan tidak bisa digunakan).

## 3. Strategi Perbaikan
Mengganti penggunaan `route('admin.pesanan.show', order.id)` dengan template string URL langsung, konsisten dengan komponen lain di proyek ini:
`href={`/admin/pesanan/${order.id}`}`

## 4. Langkah Reproduksi
1. Buka aplikasi di `/admin/pesanan`.
2. Halaman akan menampilkan error di console dan gagal merender.

## 5. Rekomendasi
Membuat child task untuk `frontend-developer` untuk mengganti kode yang bermasalah.
