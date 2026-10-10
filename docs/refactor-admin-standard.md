# Standar Struktur Admin — Proyek Toko Daster

## 1. Tujuan
Menyeragamkan struktur controller dan komponen Inertia pada panel admin untuk mempermudah maintenance.

## 2. Standar Struktur (Refactor Target)

### Controller
Semua controller admin harus berada di namespace `App\Http\Controllers\Admin\*` dan mewarisi `App\Http\Controllers\Controller`.

- **Contoh:** `App\Http\Controllers\Admin\DashboardController`

### Komponen Inertia
Semua komponen halaman admin harus berada di dalam folder `resources/js/Pages/Admin/NamaModul/Index.jsx`.

- **Contoh:** `resources/js/Pages/Admin/Dashboard/Index.jsx`

## 3. Rencana Aksi (Refactor)

### Backend (BackendDeveloper)
1. Pindahkan/Rename controller yang tidak sesuai namespace `Admin/`.
2. Hapus controller duplikat (misal: `AdminDashboardController` dihapus, gunakan `Admin\DashboardController`).
3. Update `routes/web.php` untuk merujuk pada namespace baru.

### Frontend (FrontendDeveloper)
1. Pindahkan komponen `Admin/NamaModul.jsx` menjadi `Admin/NamaModul/Index.jsx`.
2. Update path impor pada `resources/js/app.jsx` (jika perlu, secara otomatis terhandle oleh `import.meta.glob`).
3. Update `router.visit` atau link pada komponen Inertia jika ada hardcode path.
