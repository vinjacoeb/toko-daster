# Laporan QA: Diagnosa Masalah /admin/pesan-masuk

## Temuan Diagnosa
| Masalah | Temuan | Status | Bukti |
|---|---|---|---|
| Hapus Pesan | Rute `admin.pesan-masuk.destroy` tidak ada. `PesanMasuk/Index.jsx` menggunakan `admin.pesanan.destroy` yang salah. | Dikonfirmasi | `routes/web.php` (baris 31), `resources/js/Pages/Admin/PesanMasuk/Index.jsx` (baris 14) |
| Tandai Dibaca | Rute `admin.pesan-masuk.dibaca` tidak ada. `PesanMasuk/Index.jsx` menggunakan `admin.pesanan.update` yang salah. | Dikonfirmasi | `routes/web.php` (baris 31), `resources/js/Pages/Admin/PesanMasuk/Index.jsx` (baris 9) |
| Seeder \n Literal | `PesanMasukSeeder` menggunakan string `'... \n\n'` (kutip tunggal) sehingga `\n` dianggap karakter literal. | Dikonfirmasi | `database/seeders/PesanMasukSeeder.php` (baris 51) |
| Font Serif | Admin dashboard belum menggunakan Hanken Grotesk secara konsisten. | Dikonfirmasi | `design.md` (bagian 5), observasi komponen admin. |
| Fitur Komentar | Tabel `contact_message_comments` belum ada. | Dikonfirmasi | Tidak ditemukan di migrasi/seeder. |

## Rencana Perbaikan (Chained Tasks)
1. **Backend (A)**: Perbaiki hapus/tandai dibaca (tambah rute/controller) dan seeder pesan masuk.
2. **Backend (B)**: Komentar internal pesan masuk (tabel, relasi, controller).
3. **Frontend (C)**: Perbaiki tombol dan tambah komentar.
4. **QA (D)**: Verifikasi ulang putaran 1.
