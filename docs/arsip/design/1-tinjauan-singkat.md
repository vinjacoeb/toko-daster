# Tinjauan Singkat Tugas UI/UX K2: Spesifikasi Layar Toko Daster

Jelaskan spesifikasi layar untuk semua rute tahap 1 (publik + admin) dalam berkas terpisah di `docs/design/`. Setiap halaman meliputi: layout/wireframe, semua state (loading, error, kosong, sukses), microcopy, dan props/payload yang diperlukan agar frontend dan backend bisa mengimplementasi antarmuka secara konsisten. Fokus pada kebutuhan MVP, aturan PRD, dan design system.

## Pengguna Utama dan Sekunder
- **Pengunjung Publik**: melihat katalog, detail produk, menghubungi toko, memesan via WhatsApp.
- **Admin Toko**: mengelola produk, stok, pesanan, laporan, mengatur konten dan akun admin.

## Tujuan dan Hasil Bisnis yang Didukung
- Menyediakan pengalaman toko daster yang sederhana dan cepat tanpa keranjang/checkout online.
- Pengunjung bisa menemukan produk dan menghubungi toko melalui WhatsApp dalam beberapa ketukan.
- Admin bisa mengelola katalog dan transaksi secara akurat, melihat omzet, dan membaca pesan.

## Rute yang Terdampak (14 halaman)
1. `/` (landing)
2. `/product` (daftar produk)
3. `/product/{slug}` (detail produk)
4. `/kontak-kami` (form kontak)
5. `/login` (login admin)
6. `/admin` (dashboard)
7. `/admin/produk` (manajemen produk)
8. `/admin/kategori` (kategori)
9. `/admin/stok` (stok & mutasi)
10. `/admin/pesanan` (pesanan manual)
11. `/admin/pesan-masuk` (pesan kontak)
12. `/admin/laporan` (laporan penjualan)
13. `/admin/pengaturan` (pengaturan toko)
14. `/admin/akun` (akun admin)

## Batasan Ruang Lingkup
- Ikuti `design.md` (warna, tipografi, komponen, layout) dan `PRD.md` (fitur dan aturan MVP).
- Jangan termasuk fitur di luar MVP: keranjang, checkout, akun pembeli, wishlist, ulasan, voucher, notifikasi otomatis, lupa password, multi-gudang, ekspor Excel, aplikasi mobile.
- Stack: Laravel + Inertia + React, Tailwind CSS, MySQL `toko-daster`.
- Halaman publik menggunakan props Inertia dari routes Laravel, bukan endpoint `/api`.
- Paket yang diizinkan: Recharts, React Hook Form + Zod, TanStack Table.
- Jangan membuat UI kit baru; gunakan komponen headless bila memungkinkan implementasi proyek.

## Requirement yang Belum Terpetakan
- Prop kontrak dan skema data Inertia (field-specific, jenis, kasus penggunaan) – tentukan pada `docs/kontrak-props.md` oleh backend; frontend menunggu dokumentasi ini.
- Kontrol kuantitas pesanan dalam form pemesanan admin – apakah CRUD atau list terpisah.
- Detail properti filter pesanan (status, kanal, rentang tanggal) dan integrasi search.
- Semantik akhir dari status stok “Habis” vs “Habis?” dan UI pemberitahuan stok menipis.
- Konfirmasi modal untuk aksi destruktif (hapus, batalkan pesanan) apakah modal dialog atau fungsi native.
- Path foto fallback local vs placeholder dalam reusable komponen.
- Penanganan kasus error spesifik untuk setiap halaman (404, 403, timeout).
- Gap aksesibilitas tambahan (misalnya status, status, urutan fokus tab) untuk setiap tipe formulir.
- Kebutuhan data untuk screenshot laporan, penjualan per hari, dan ringkasan dashboard.
- Konfirmasi modal untuk back button di halaman login bila sedang login (tidak pernah kosong).

## Scope MVP vs Usulan Tambahan
**MVP Fokus:**
- Halaman publik sesuai design system.
- Alur user sederhana, dengan navigable navigasi.
- Admin: CRUD dasar untuk produk & stok, pencatatan pesanan manual, panel laporan.

**Usulan di Luar MVP (untuk proyek selanjutnya):**
- Keranjang, checkout, pembayaran online.
- Akun pembeli, wishlist, ulasan produk, voucher, notifikasi.
- Ekspor Excel, laporan canggih, notifikasi otomatis, komponen FAQ, mode gelap, SSO, caching server.

## Catatan
- Jika ada pertentangan dengan PRD/design system, diskusikan dengan Tech Lead. Jangan memutuskan sendiri.
- Fokus pada kerapian dan kesederhanaan sesuai design system (`design.md`).
