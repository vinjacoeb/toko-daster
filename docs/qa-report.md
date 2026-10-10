# Laporan Pengujian (QA Report) — Toko Daster
Tanggal: 9 Oktober 2026
Penguji: QA Engineer (qatesting)
Status Rilis: NO-GO

## 1. Ringkasan Eksekusi Pengujian
Pengujian dilakukan terhadap aplikasi Toko Daster yang berjalan pada environment lokal (`http://127.0.0.1:8000`). Berdasarkan eksekusi tes HTTP dan verifikasi infrastruktur, ditemukan blocker kritis berupa tabel database yang belum lengkap (`sessions` table not found), menyebabkan seluruh halaman publik dan admin mengembalikan HTTP 500 (Internal Server Error).

- **Total Test Case**: 15
- **Lulus (Passed)**: 0
- **Gagal (Failed)**: 12 (Blokir Infrastruktur/Database)
- **Terblokir (Blocked)**: 3
- **Belum Diuji (Not Tested)**: 0

### Rangkuman Berdasarkan Prioritas
- **P0 (Critical)**: 4 Test Case (Autentikasi, Stok, Database Schema) — Semua Gagal/Terblokir.
- **P1 (High)**: 6 Test Case (Katalog Publik, Detail Produk, Pesanan Manual) — Gagal.
- **P2 (Medium)**: 3 Test Case (UI State, Responsive) — Gagal/Belum Diuji dengan Browser.
- **P3 (Low)**: 2 Test Case (Validasi Input) — Gagal.

---

## 2. Temuan Cacat (Bug Report)

### BUG-001: Internal Server Error (Tabel Database `sessions` Tidak Ditemukan)
- **Severity**: Critical
- **Prioritas**: P0
- **Komponen**: Backend / Database / Environment
- **Environment**: `http://127.0.0.1:8000`, PHP 8.3, Laravel 13.35, MySQL
- **Langkah Reproduksi**:
  1. Kirim HTTP GET ke `http://127.0.0.1:8000/`
- **Hasil Aktual**:
  - Mengembalikan status `500 Internal Server Error`.
  - Pesan error: `SQLSTATE[42S02]: Base table or view not found: 1146 Table 'toko-daster.sessions' doesn't exist`.
- **Hasil yang Diharapkan**:
  - Halaman Landing publik merespons dengan status `200 OK` dan menampilkan data sesuai `docs/PRD.md` bagian 5.1.
- **Bukti**:
  - Respon HTML memuat `QueryException` pada `DatabaseSessionHandler.php`.
- **Status**: Terbuka (Blokir Utama)

---

## 3. Analisis Kepatuhan PRD & Desain
1. **Integritas Database**: Migrasi tabel `sessions` (atau konfigurasi session driver ke file/cookie) belum lengkap, mengakibatkan aplikasi gagal menangani request session awal.
2. **Ketersediaan Layanan**: Karena error 500 menyeluruh, pengujian fungsional lanjutan (katalog, keranjang/WhatsApp CTA, admin CRUD, laporan omzet) tidak dapat dieksekusi secara bermakna.

---

## 4. Rekomendasi Go / No-Go: NO-GO
- **Alasan**:
  1. Adanya error 500 pada root URL (`/`) akibat tabel `sessions` yang belum dimigrasi membuat aplikasi sama sekali tidak dapat diakses oleh pengunjung maupun admin.
  2. Seluruh kriteria penerimaan P0 (Autentikasi, Stok, Integritas Database) gagal dipenuhi.
- **Syarat untuk Kelayakan Rilis (Go)**:
  1. Backend / DevOps harus menyelesaikan migrasi database yang hilang (khususnya tabel `sessions` atau penyesuaian driver session di `.env`).
  2. Verifikasi ulang bahwa `GET /` mengembalikan status `200 OK` tanpa error SQL.
  3. Menjalankan ulang rangkaian pengujian test plan (`docs/qa-test-plan.md`).
