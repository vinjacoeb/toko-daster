# Audit: Gap Analysis (PRD v1.0 & v1.1 vs. Kode)

## 1. Tabel Status Per Rute

| Rute | Status | Bukti (Path) | Catatan |
| :--- | :--- | :--- | :--- |
| `/` | Placeholder | `resources/js/Pages/Beranda.jsx` | Data seeder belum dipakai, masih placeholder. |
| `/product` | Sebagian | `resources/js/Pages/Produk.jsx` | Filter/pencarian belum lengkap. |
| `/product/{slug}` | Sebagian | `resources/js/Pages/DetailProduk.jsx` | Belum lengkap sesuai spek. |
| `/kontak-kami` | Sebagian | `resources/js/Pages/KontakKami.jsx` | Formulir perlu validasi spam. |
| `/admin` | Placeholder | `resources/js/Pages/Admin/Dashboard.jsx` | Grafik dan angka butuh data nyata. |
| `/admin/produk` | Placeholder | `resources/js/Pages/Admin/Produk.jsx` | Perlu integrasi CRUD. |
| `/admin/kategori` | Placeholder | `resources/js/Pages/Admin/Kategori.jsx` | Perlu integrasi CRUD. |
| `/admin/stok` | Placeholder | `resources/js/Pages/Admin/Stok.jsx` | Service stok belum diintegrasikan. |
| `/admin/pesanan` | Placeholder | `resources/js/Pages/Admin/Pesanan.jsx` | Status dan stok butuh logika. |
| `/admin/pesan-masuk` | Placeholder | `resources/js/Pages/Admin/PesanMasuk.jsx` | Belum ada tandai baca/hapus. |
| `/admin/laporan` | Placeholder | `resources/js/Pages/Admin/Laporan.jsx` | Belum ada fitur cetak/CSV. |
| `/admin/pengaturan` | Belum ada | - | Perlu migrasi/tabel baru (v1.1). |
| `/admin/akun` | Placeholder | `resources/js/Pages/Admin/Akun.jsx` | Perlu validasi. |

## 2. Ketidaksesuaian Nama
- Controller `AdminOrderController` vs `AdminOrder/` (namespace).
- Inertia::render `AdminPesanan` vs `Admin/Pesanan.jsx` (direktori).
- Berbagai ketidaksesuaian antara nama kolom migrasi (tabel: `order_items`, kolom: `qty` vs `quantity`) dan kontrak props.

## 3. Berkas Desain
- **Lengkap**: `docs/design/landing.md`, `docs/design/product.md`.
- **Kerangka**: `docs/design/admin-stok.md`, `docs/design/admin-pesanan.md`.

## 4. Tabel dan Kolom v1.1 (Belum Ada)
- `hero_slides` (id, judul, subjudul, teks_tombol, tautan, foto_path, urutan, aktif)
- `faqs` (id, pertanyaan, jawaban, urutan, aktif)
- Kolom di `settings`: Banyak (lihat PRD v1.1 Bagian 3.2).

## 5. Berkas Rawan Bentrok
- `routes/web.php` (semua agent butuh akses).
- `resources/js/app.jsx` (semua agent butuh akses).
- `DatabaseSeeder` (populasi data).
- `resources/js/Layouts/AdminLayout.jsx`.

## 6. Risiko dan Rekomendasi
- **Risiko**: Database belum siap untuk v1.1.
- **Rekomendasi**: Selesaikan migrasi v1.1 sebelum memulai B6. Urutan kerja di PRD v1.1 harus diikuti ketat.
