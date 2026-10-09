# Spesifikasi Layar: Daftar Produk (/product)

## Tujuan
Halaman daftar produk publik yang menampilkan katalog daster secara lengkap dengan kemampuan pencarian, filter (kategori, ukuran, rentang harga, ketersediaan stok), pengurutan, dan pagination (12 produk per halaman).

## Entry & Exit Point
- **Entry**: `/product` (dari menu Beranda, footer, atau navigasi langsung).
- **Exit**: `/product/{slug}` (detail produk), `/` (kembali ke Beranda).

## Struktur Layout (Wireframe Teks)
```
┌────────────────────────────────────────────────────────────┐
│ Beranda / Produk                                           │
├────────────────────────────────────────────────────────────┤
│ Semua produk (Young Serif 40px)                            │
│ Menampilkan "24 produk"     [Cari produk......] [Urutkan ▾] │
├──────────────────────┬─────────────────────────────────────┤
│ ┌─ Filter Kiri ─────┐ │ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │ Kategori          │ │ │          │ │          │ │          │ │
│ │   [x] Daster Rum. │ │ │  4:5     │ │  4:5     │ │  4:5     │ │
│ │   [ ] Daster Batik│ │ │  foto    │ │  foto    │ │  foto    │ │
│ │ Ukuran            │ │ └──────────┘ │ └──────────┘ │ └──────────┘ │
│ │   [x] M  [ ] L    │ │ Nama Produk  │ Nama Produk  │ Nama Produk  │
│ │ Rentang Harga     │ │ Rp89.000     │ Rp110.000    │ Rp75.000     │
│ │   Min – Max       │ │ S M L XL     │ S M L        │ S M L XL     │
│ │ ☐ Hanya tersedia  │ │              │              │              │
│ └───────────────────┘ ├──────────┤ ├──────────┤ ├──────────┤ │
│                       │ ┌──────────┐ │ ┌──────────┐ │ ┌──────────┐ │
│                       │ │          │ │ │          │ │ │          │ │
│                       │ │  4:5     │ │  4:5     │ │  4:5     │ │
│                       │ └──────────┘ │ └──────────┘ │ └──────────┘ │
│                       │ ...          │ ...          │ ...          │
│                       ├─────────────────────────────────────────────┤
│                       │             « 1  2  3  4  »             │
│                       └─────────────────────────────────────────────┘
```
- **Desktop**: Kolom kiri (lebar 3 kolom dari 12), konten katalog (9 kolom).
- **Mobile**: Tombol "Filter" di atas katalog, membuka panel dari bawah (drawer), hasil dalam 2 kolom grid.

## Hirarki Visual & Aksi Utama/Sekunder
- **Judul Halaman**: "Semua produk" (Young Serif 40px).
- **Jumlah Hasil**: "24 produk" (Hanken Grotesk 14px, `--abu`).
- **Pencarian**: Kotak isian dengan ikon kaca pembesar, langsung memicu debounce atau submit enter/pilih.
- **Urutkan**: Dropdown (Terbaru, Harga naik, Harga turun).
- **Filter**: Checkbox, rentang harga, tombol reset filter.
- **Pagination**: Nomor halaman + tombol navigasi (‹, ›).

## Komponen & Perilaku
### Panel Filter (Desktop / Drawer Mobile)
- **Kategori**: Daftar checkbox kategori produk (dari tabel kategori). Multiple select atau single select? Sesuai PRD, filter kategori mendukung pilihan.
- **Ukuran**: Checkbox atau pill kecil untuk ukuran (`All Size`, `S`, `M`, `L`, `XL`, `Jumbo`).
- **Rentang Harga**: Dua isian angka (Min dan Max), format Rupiah tanpa desimal.
- **Tersedia**: Checkbox tunggal "☐ Hanya yang tersedia" (stok > 0).
- **Chip Filter Aktif**: Filter yang sedang aktif ditampilkan di atas grid katalog sebagai chip kecil dengan ikon "×" (dapat diklik untuk menghapus filter tersebut). Tombol "Hapus semua filter" jika ada filter aktif.

### Grid Katalog Produk
- Menampilkan maksimal 12 produk per halaman (default).
- **Kartu Produk**:
  - Foto produk (rasio 4:5, placeholder `--pasir` dengan tulisan "[CONTOH] Foto belum tersedia" jika tidak ada foto, klik ke `/product/{slug}`).
  - Badge: "Habis" (`--cabai`, teks putih, pojok kiri atas foto) atau "Baru" (`--kunyit`, teks `--arang`).
  - Nama produk: Hanken Grotesk 16/600, maksimal 2 baris, terpotong dengan titik-titik (`line-clamp-2`).
  - Harga: Hanken Grotesk 600, format `Rp89.000`. Harga coret (`--cabai`, dicoret, lebih kecil) jika ada.
  - Varian ukuran tersedia: teks 14px `--abu`, misal: "S M L XL". Jika semua habis, label "Habis".

### Pagination
- Di bawah grid produk.
- Tombol nomor halaman (aktif bernomor latar `--pandan`, teks putih; lainnya transparan, garis `--garis`).
- Tombol navigasi halaman sebelumnya (‹) dan berikutnya (›).
- **Aturan**: Menggunakan query string di URL (`?page=2&kategori=1&sort=harga_asc&tersedia=1`) sehingga URL bisa dibagikan dan tombol "Kembali" di browser berfungsi.

## State & Microcopy
### Default
- Menampilkan daftar produk halaman 1 sesuai query string default (terbaru, semua kategori, semua ukuran).

### Loading
- Skeleton untuk grid kartu (12 kartu blok `--pasir` datar, denyut opasitas pelan, hormati `prefers-reduced-motion`).
- Indikator loading pada dropdown urutkan / filter.

### Empty (Hasil Kosong)
- Tampil ketika tidak ada produk yang cocok dengan pencarian atau filter.
- Judul: "Belum ada produk yang cocok"
- Deskripsi: "Coba ubah kata kunci pencarian atau sesuaikan filter yang digunakan."
- Tombol: "Hapus filter" (mereset semua filter ke default).

### Error (Gagal Memuat Produk)
- Tampil di dalam layout katalog (header tetap ada).
- Judul: "Produk belum bisa dimuat"
- Deskripsi: "Terjadi kesalahan saat memuat daftar produk. Coba lagi."
- Tombol: "Coba lagi" (reload halaman dengan parameter filter yang sama).

### Success
- Daftar produk dan pagination dirender dengan benar.
- Jumlah hasil aktual ditampilkan dengan akurat (misal: "24 produk").

### Disabled
- Tombol pagination sebelumnya (‹) pada halaman 1.
- Tombol pagination berikutnya (›) pada halaman terakhir.
- Tombol filter yang sedang diproses.

### Partial / Filter Aktif
- Chip filter aktif muncul di atas katalog.
- Filter yang tidak cocok dinonaktifkan atau disembunyikan jika diperlukan (tidak wajib).

## Validasi, Urutan Fokus, Konsekuensi Aksi
- Input pencarian: sanitasi string di server, max length 100 karakter.
- Rentang harga: validasi angka positif (Min <= Max). Jika Max < Min, tampilkan pesan galat di bawah isian.
- Query string diperbarui via Inertia router (`router.get('/product', params, { preserveState: true })`).

## Responsif
- Mobile (< 768px):
  - Sidebar filter disembunyikan.
  - Muncul tombol "Filter (N)" di atas katalog; klik membuka drawer dari bawah (full-screen modal atau panel bawah).
  - Grid produk 2 kolom.
- Tablet (768px - 1024px):
  - Filter sebagai sidebar kiri atau collapsible (opsional, ikuti PRD bagian 5.2: desktop kolom kiri 3 kolom, ponsel tombol filter).
  - Grid produk 3 kolom.
- Desktop (>= 1024px):
  - Kolom kiri (3 kolom dari 12) untuk filter.
  - Grid produk 9 kolom (3 kolom kartu).

## Microcopy
### Judul Halaman
- Heading: "Semua produk"
- Jumlah produk: "24 produk" (atau "0 produk", "1 produk")

### Filter & Pencarian
- Placeholder pencarian: "Cari produk atau motif..."
- Label filter: "Kategori", "Ukuran", "Rentang Harga", "Hanya yang tersedia"
- Tombol reset: "Hapus filter"
- Tombol filter (ponsel): "Filter"

### Urutkan
- Label: "Urutkan"
- Opsi:
  - "Terbaru" (default)
  - "Harga terendah"
  - "Harga tertinggi"

### Hasil Kosong & Error
- Empty: "Belum ada produk yang cocok. Hapus filter"
- Error: "Produk belum bisa dimuat. Coba lagi"

### Pagination
- Navigasi: "‹", "›"

## Aksesibilitas & Fokus Keyboard
- Urutan fokus: Kotak pencarian → Filter (kategori/ukuran/harga) → Urutkan dropdown → Grid kartu produk → Pagination.
- Kotak pencarian memiliki `aria-label="Cari produk"`.
- Checkbox filter memiliki `label` terkait secara eksplisit.
- Tombol filter ponsel memiliki `aria-expanded="false"` dan `aria-controls="filter-drawer"`.
- Kontras warna teks memenuhi WCAG AA.
- Fokus ring pandan terlihat pada setiap elemen interaktif.

## Kebutuhan Data/Props
### Data dari Backend (props Inertia)
1. `products` (Paginator object dari Laravel):
   - `data`: array produk (id, slug, nama, harga, harga_coret, status, kategori, varian, gambar utama, dll.)
   - `current_page`, `last_page`, `per_page`, `total`, `links` (untuk pagination)
2. `categories` (array): daftar kategori untuk filter sidebar (id, nama, slug, parent_id).
3. `filters` (object): nilai filter yang sedang aktif saat ini (`search`, `category`, `size`, `min_price`, `max_price`, `in_stock`, `sort`).

### Alur Pengambilan Data
- Controller menangani query string (`request()->all()`), menerapkan filter database (server-side, bukan client-side), dan mengirimkan props kembali melalui Inertia.

## Daftar Periksa (Self-Review)
- [ ] Sesuai PRD bagian 5.2 (hanya produk tayang, 12 per halaman, pencarian, filter, urutan, query string di URL, kartu produk dengan foto 4:5, harga, ukuran, label Habis/Baru, state loading, error, kosong, sukses) dan design.md bagian 9.3 (layout kolom kiri filter, responsif ponsel drawer, pagination).
- [ ] Tanpa fitur terlarang (keranjang, checkout, wishlist, ulasan, voucher, notifikasi, lupa password, multi-gudang, ekspor Excel, aplikasi mobile).
- [ ] State default, loading, empty, error, success, disabled, partial terdokumentasi.
- [ ] Responsif untuk 360, 768, 1024, 1280px.
- [ ] Aksesibilitas WCAG AA terpenuhi.
- [ ] Props Inertia didefinisikan dengan jelas.

## Handoff
### Ke Frontend
- File spesifikasi: `docs/design/product.md`.
- Komponen dasar: gunakan komponen dari `K8` (Header, Footer, KartuProduk, Input, Dropdown, Checkbox, Drawer, Pagination).
- State: kelola state filter lokal yang disinkronkan ke URL menggunakan `Inertia.get` dengan `preserveState: true`.
- Debounce pada pencarian (300ms) agar tidak mengirim request berlebihan.

### Ke Backend melalui Tech Lead
- Props Inertia yang diperlukan: `products` (paginated), `categories`, `filters`.
- Pastikan query mengabaikan produk non-tayang (`status != 'tayang'`).
- Filter server-side: pencarian nama/motif, filter kategori (id), filter ukuran (variants.ukuran), filter rentang harga (min-max), filter stok (variants.stok > 0), urutan (created_at desc, price asc/desc).
- Pagination diatur 12 per halaman.

### Ke QA
- Verifikasi pencarian mengembalikan produk yang benar.
- Verifikasi filter (kategori, ukuran, harga, stok) bekerja dengan benar di server.
- Verifikasi tombol "Hapus filter" mereset URL dan menampilkan semua produk.
- Verifikasi pagination mempertahankan parameter filter.
- Verifikasi state kosong menampilkan pesan konkret dan tombol reset.
- Verifikasi state error menampilkan pesan dan tombol "Coba lagi".
- Verifikasi responsif (drawer filter di ponsel, 2 kolom grid; 3 kolom di desktop).

## Pertanyaan Terbuka / Asumsi
1. **Filter ukuran**: Apakah filter ukuran mencakup ukuran varian yang habis?
   - Asumsi: filter ukuran mencakup semua ukuran yang ada di database; produk yang tidak memiliki ukuran tersebut disembunyikan oleh server.
   - NON-BLOCKING.
2. **Sort dropdown**: Apakah urutan default adalah "Terbaru" (`created_at desc`)?
   - Asumsi: Ya, sesuai PRD.
   - NON-BLOCKING.

