# Ringkasan Tim: Toko Daster (Tahap 1 - v1.1)

## Tujuan
Tahap 1 versi 1.1: Pastikan semua halaman Toko Daster bisa dibuka tanpa error, data tampil dari database, pengelolaan tampilan web (carousel, FAQ, logo, dsb) lewat admin, laporan penjualan bisa dicetak dengan format A4.

## Ringkasan update v1.1
- Migrasi/tabel baru: carousel hero (`hero_slides`), FAQ (`faqs`), pengaturan (`settings`).
- Semua modifikasi data admin langsung terlihat di publik setelah reload.
- Cetak laporan: tombol "Cetak" di laporan admin, hasil A4, dompet sidebar, styling sesuai design-v1.1.
- Carousel max 5 slide, tanpa autoplay.
- FAQ tampil 5 teratas di landing, semua di kontak.
- Semua validasi server-side, pesan error jelas.
- Semua halaman DB-driven, tidak ada placeholder di frontend/produk.
- Semua state (loading, kosong, galat, sukses) wajib.
- Fitur banner pengumuman dan ekspor CSV ditunda (P1).
- Tidak ada pengaturan warna/font via admin.

## Aturan
- Semua bagian PRD.md tetap berlaku, kecuali diganti PRD-v1.1.md atau design-v1.1.md.
- Satu gelombang selesai total (termasuk QA & Go) sebelum gelombang berikutnya dikerjakan.

## Urutan Kerja v1.1
Lihat graf PRD-v1.1.md bagian 6 (kode kartu A0 s.d. GT4: QA debug, UI/UX detail, backend landing-export, frontend modern, QA, gerbang, hingga gelombang 4).

## Titik Berhenti
Gerbang GTx: menunggu uji pemilik sebelum lanjut ke gelombang berikut.
