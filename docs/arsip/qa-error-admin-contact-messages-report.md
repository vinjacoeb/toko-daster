# Laporan QA: Error QueryException Unknown Column `read_at` di /admin

## 1. Informasi Defect
- **ID Kartu Kanban:** `t_3d0d64fb`
- **Komponen:** Backend / Database / Admin Dashboard
- **Severity:** High (Menyebabkan HTTP 500 / unhandled QueryException saat mengakses halaman admin `/admin`)
- **Prioritas:** P0
- **Status:** Ditemukan & Dilaporkan

## 2. Bukti & Analisis Kesalahan (Screenshot `error6.png`)
Berdasarkan analisis tangkapan layar `error6.png` pada halaman `/admin`:
- **Exception:** `Illuminate\Database\QueryException`
- **SQLSTATE:** `[42S22]` (Column not found)
- **Pesan Error:** `SQLSTATE[42S22]: Column not found: 1054 Unknown column 'read_at' in 'where clause'`
- **SQL Query:** `select count(*) as aggregate from contact_messages where read_at is null`

## 3. Akar Masalah (Root Cause)
1. **Ketidaksesuaian Nama Kolom dengan PRD (`docs/PRD.md`):**
   - Berdasarkan `docs/PRD.md` (bagian 8, tabel `contact_messages`), kolom yang ditentukan adalah:
     `id, nama, kontak, pesan, dibaca_at (nullable), ip, created_at`
   - Namun, kode controller dan model merujuk pada kolom `read_at` (misalnya `ContactMessage::whereNull('read_at')`).
2. **Kekurangan Struktur Tabel Migrasi:**
   - Migrasi `database/migrations/2026_10_09_065831_create_contact_messages_table.php` saat ini hanya membuat kolom `id` dan `timestamps()`, belum mendefinisikan kolom `nama`, `kontak`, `pesan`, `dibaca_at`, dan `ip`.

## 4. File yang Terdampak / Perlu Diperbaiki oleh Backend Developer
- `database/migrations/2026_10_09_065831_create_contact_messages_table.php` (atau buat migrasi baru untuk menambahkan kolom-kolom tabel `contact_messages` sesuai PRD).
- `app/Models/ContactMessage.php` (mengubah fillable/casts dari `read_at` menjadi `dibaca_at`).
- `app/Http/Controllers/AdminDashboardController.php` (mengubah `read_at` menjadi `dibaca_at`).
- `app/Http/Controllers/Admin/DashboardController.php` (mengubah `read_at` menjadi `dibaca_at`).
- `app/Http/Controllers/Admin/ReportController.php` (mengubah `read_at` menjadi `dibaca_at`).
- `resources/js/Pages/Admin/PesanMasuk.jsx` (mengubah `message.read_at` menjadi `message.dibaca_at`).

## 5. Rekomendasi Tindakan
1. Backend Developer menyesuaikan seluruh referensi `read_at` menjadi `dibaca_at` di seluruh kode backend dan frontend agar konsisten dengan `docs/PRD.md`.
2. Melengkapi migrasi tabel `contact_messages` dengan kolom yang sesuai spesifikasi PRD.
3. Menjalankan ulang migrasi/refresh database pada environment pengujian.
