# Laporan Defect QA: Halaman Admin Dashboard Tidak Ditemukan (AdminDashboard.jsx Missing)

- **ID Defect:** BUG-ADMIN-011
- **Severity:** Critical
- **Priority:** P0 (Blokir akses ke halaman utama Admin Dashboard `/admin`)
- **Komponen:** Backend (Controller) / Frontend (Inertia Component Resolution)
- **Environment:** Lokal (`http://127.0.0.1:8000/admin`)

## 1. Prasyarat
- Memiliki akun admin yang valid dan sudah masuk (login) ke aplikasi.

## 2. Langkah Reproduksi
1. Buka halaman `/login` dan masuk sebagai admin.
2. Akses route `/admin` (Admin Dashboard).
3. Perhatikan layar atau console browser.

## 3. Hasil Aktual
Aplikasi mengalami crash/error Inertia.js dengan pesan:
```text
Uncaught (in promise)
Error: Halaman AdminDashboard tidak ditemukan di ./Pages/AdminDashboard.jsx
```
Traceback:
- `resolve` di `app.jsx:12:19`
- `resolveComponent` di `@inertiajs_react.js`

## 4. Hasil yang Diharapkan
Route `/admin` yang ditangani oleh `AdminDashboardController@index` berhasil merender komponen React yang benar tanpa error `Halaman tidak ditemukan`.

## 5. Analisis Akar Masalah (Root Cause Analysis)
- **Controller (`app/Http/Controllers/AdminDashboardController.php` baris 121):**
  Memanggil `Inertia::render('AdminDashboard', [...])`.
- **Frontend (`resources/js/app.jsx`):**
  Melakukan resolusi file berdasarkan glob `./Pages/**/*.jsx` dengan mencocokkan string `AdminDashboard` ke file `./Pages/AdminDashboard.jsx`.
- **Kenyataan di File System (`resources/js/Pages/`):**
  File `./Pages/AdminDashboard.jsx` **tidak ada**. Yang tersedia adalah:
  - `resources/js/Pages/Admin.jsx` (yang berisi `export default function AdminDashboard()`)
  - `resources/js/Pages/Admin/Dashboard.jsx` (atau `Admin/Dashboard/Index.jsx`)

## 6. Bukti
- Tangkapan layar error: `error11.png` (menunjukkan `Error: Halaman AdminDashboard tidak ditemukan di ./Pages/AdminDashboard.jsx`).

## 7. Rekomendasi Solusi untuk Developer
Pilih salah satu pendekatan konsisten berikut:
1. **Opsi A (Menyesuaikan Controller):** Ubah `Inertia::render('AdminDashboard', ...)` di `AdminDashboardController.php` menjadi `Inertia::render('Admin', ...)` (jika menggunakan `resources/js/Pages/Admin.jsx`) atau `'Admin/Dashboard'`.
2. **Opsi B (Menyesuaikan File React):** Pindahkan/buat file `AdminDashboard.jsx` di direktori `resources/js/Pages/`.

---
*Dilaporkan oleh: Senior QA Engineer (qatesting)*
