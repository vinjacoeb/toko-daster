# Ringkasan Tim: Toko Daster (Tahap 1)

## Tujuan
Membangun website Toko Daster tahap 1 (etalase publik + dashboard admin). Pengunjung memesan via WhatsApp, admin mencatat di dashboard. Fokus pada tampilan, pengelolaan stok, dan pelaporan yang rapi.

## Cakupan Tahap 1
- **Publik**: landing (`/`), daftar produk (`/product`), detail produk (`/product/{slug}`), kontak (`/kontak-kami`), login (`/login`).
- **Admin**: dashboard, produk, kategori, stok, pesanan manual, pesan masuk, laporan, pengaturan, manajemen admin.
- **Ditunda**: keranjang, checkout online, fitur pembeli (akun, wishlist, ulasan), notifikasi otomatis, ekspor Excel, aplikasi mobile.

## Ringkasan Aturan Kerja (PRD Bagian 12)
- **.env**: Milik pemilik. Jangan diubah/disentuh. Hanya `.env.example`.
- **Skill**: Jangan buat skill.
- **Workspace**: Wajib `C:/Users/LENOVO/Downloads/toko-daster`.
- **Tech Lead**: Hanya menulis di `docs/` dan buat kartu.
- **Bug**: Laporkan sebagai kartu baru, jangan perbaiki sendiri.
- **Server/Database**: Jangan nyalakan server/database (disediakan pemilik).
- **Contoh**: Jangan mengarang data. Gunakan seeder untuk data contoh.
- **Bahasa**: Indonesia.

## Urutan Kerja
Sesuai grafik kartu di PRD Bagian 13. Dimulai dari Setup (K1) oleh Devops, diikuti UI/UX, Backend, Frontend, QA, dan Review Akhir oleh Tech Lead.

## Titik Berhenti Pemilik
Di K1 (Setup), pemilik harus mengisi `.env` dan membuat database sebelum pekerjaan lanjut ke tahap berikutnya.
