# Laporan Analisis Defect Akses Halaman Admin (/admin)

## 1. Informasi Defect
- **ID Kartu Kanban:** `t_e9425b87`
- **Komponen:** Backend / Database / Eloquent Model (`Order` & `OrderItem`)
- **Severity:** Critical
- **Prioritas:** P0 (Bloker Akses Admin & Dashboard)
- **Environment:** Laravel 13.35.0, PHP 8.3.32, MySQL 3306, Database `toko-daster`
- **URL Terdampak:** `http://127.0.0.1:8000/admin` dan seluruh route admin yang melakukan query ke tabel `orders` / `orders_items`.

---

## 2. Deskripsi Masalah & Bukti (`error5.png`)
Berdasarkan analisis visual pada `error5.png` dan inspeksi kode sumber aplikasi:
- Saat mengakses `/admin`, halaman gagal dimuat dan menampilkan **500 Internal Server Error** (`Illuminate\Database\QueryException`).
- Pesan SQL error: 
  `SQLSTATE[42S22]: Column not found: 1054 Unknown column 'orders.deleted_at' in 'where clause'`
- Query yang digenerate oleh Eloquent:
  ```sql
  select sum(`total`) as `aggregate` from `orders` where `status` != 'batal' and date(`created_at`) = '2026-10-09' and `orders`.`deleted_at` is null
  ```

---

## 3. Akar Masalah (Root Cause Analysis)
1. **Model Mismatch:** 
   - Di dalam `app/Models/Order.php` dan `app/Models/OrderItem.php`, trait `use SoftDeletes;` diaktifkan.
   - Laravel Eloquent secara otomatis menambahkan klausa pemeriksaan `deleted_at is null` pada setiap query yang melibatkan model tersebut.
2. **Skema Database:**
   - Berdasarkan file migrasi (`2026_10_09_065829_create_orders_table.php` dan `2026_10_09_080000_add_columns_to_orders_table.php`), tabel `orders` dan `orders_items` **tidak memiliki kolom `deleted_at`** (tidak ada pemanggilan `$table->softDeletes();`).
3. **Hasil:** Setiap kali controller admin (`AdminDashboardController`, `Admin\DashboardController`, `OrderController`, dll.) melakukan agregasi atau query ke tabel `orders`, database menolak kueri karena kolom `deleted_at` tidak ditemukan.

---

## 4. Rekomendasi Solusi untuk Backend Developer
Pilih salah satu dari dua opsi perbaikan berikut:
- **Opsi A (Jika Soft Deletes dibutuhkan sesuai PRD):**
  Buat migration baru untuk menambahkan kolom `deleted_at` pada tabel `orders` dan `orders_items` menggunakan `$table->softDeletes();`.
- **Opsi B (Jika Soft Deletes tidak dibutuhkan di MVP):**
  Hapus baris `use SoftDeletes;` dari file `app/Models/Order.php` dan `app/Models/OrderItem.php`.

---

## 5. Status QA & Rekomendasi Selanjutnya
- **Status Pengujian:** Gagal (Critical Defect / Bloker). Halaman admin tidak dapat diakses sama sekali.
- **Tindakan Lanjut:** Dibuat kartu child untuk `@backenddeveloper` agar segera memperbaiki ketidaksesuaian model `SoftDeletes` dan migrasi database.
