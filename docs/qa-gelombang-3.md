# Laporan QA Gelombang 3 — Proyek Toko Daster

Tanggal: 10 Oktober 2026
QA Engineer: qatesting profile
Status: Sedang Debug Gelombang 3

## 1. Ringkasan Temuan (Akar Masalah)

| ID | Komponen | Masalah | Dampak |
|---|---|---|---|
| M1 | Dashboard | Duplikasi Controller (`AdminDashboardController` vs `Admin\DashboardController`). Rute merujuk ke yang tanpa namespace. | Potensi kebingungan maintenance dan rute yang tidak sinkron. |
| M2 | Pesan Masuk | Inkonsistensi lokasi komponen: `AdminPesanMasuk.jsx` (root) vs `Admin/PesanMasuk/Index.jsx` (terstruktur). | Inkonsistensi arsitektur, menyulitkan routing di masa depan. |
| M3 | Pesanan | Inkonsistensi komponen: `Admin/Pesanan.jsx` vs `Admin/Order/Index.jsx`. | Potensi kebingungan maintenance. |

## 2. Rencana Perbaikan (Kartu Kanban)
1. Perbaikan struktur file & namespace controller (Backend).
2. Perbaikan referensi rute di `web.php` agar konsisten (Backend/Devops).

## 3. Status Pengujian (Putaran 1)
- **Admin Dashboard:** Belum diverifikasi (terblokir oleh isu duplikasi).
- **Admin Laporan:** Belum diverifikasi.
- **Admin Pesanan:** Belum diverifikasi.
- **Admin Pesan Masuk:** Belum diverifikasi.
