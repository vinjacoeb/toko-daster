# Spesifikasi Layar: Detail Produk (/product/{slug})

## Tujuan
Halaman detail produk publik yang menampilkan informasi lengkap suatu daster (galeri foto, pilihan warna dan ukuran, harga dengan etiket, stok menipis, deskripsi, bahan, perawatan), serta tombol "Pesan via WhatsApp" yang merangkai pesan otomatis.

## Entry & Exit Point
- **Entry**: `/product/{slug}` (dari klik kartu produk di Beranda atau Daftar Produk).
- **Exit**: `/product` (kembali ke katalog via breadcrumb), `/` (kembali ke Beranda), tautan WhatsApp (keluar ke aplikasi WhatsApp).

## Struktur Layout (Wireframe Teks)
```
┌────────────────────────────────────────────────────────────┐
│ Beranda / Produk / Daster Batik Parang                     │
├─────────────────────────────┬──────────────────────────────┤
│ ┌─────────────────────────┐ │ Kategori: Daster Batik       │
│ │                         │ │ Nama Produk (Young Serif 40) │
│ │      Foto Besar (4:5)   │ │ ┌─ Etiket Harga ───────────┐ │
│ │                         │ │ │ Rp89.000   Rp110.000     │ │
│ └─────────────────────────┘ │ └──────────────────────────┘ │
│ [t1] [t2] [t3] [t4] [+4]    │ Warna:                       │
│                             │ [swatch 1] [swatch 2]        │
│                             │ Ukuran:                      │
│                             │ [S] [M] [L] [XL̶ (Habis)]     │
│                             │ Panduan ukuran (tautan)      │
│                             │ [ Pesan via WhatsApp ]       │
│                             │ Sisa 2 (hanya bila menipis)  │
│                             │ ──────────────────────────── │
│                             │ V   Deskripsi produk         │
│                             │ V   Bahan & Perawatan        │
└─────────────────────────────┴──────────────────────────────┘
```
- **Desktop**: Dua kolom seimbang. Kolom kiri untuk galeri foto besar dan deretan thumbnail. Kolom kanan untuk detail produk, pilihan warna, pilihan ukuran, harga etiket, dan tombol pesan WhatsApp.
- **Mobile**: Foto di atas (dengan geser horizontal/thumbnail), info di bawahnya, tombol "Pesan via WhatsApp" menempel di bawah layar (sticky bottom bar) bersama ringkasan harga.

## Hirarki Visual & Aksi Utama/Sekunder
- **Breadcrumb**: Navigasi atas (Beranda / Produk / Nama Produk).
- **Judul Produk**: Young Serif, 40px (desktop) atau 28px (mobile).
- **Etiket Harga**: Kotak bergaris putus (jahitan) dengan satu lubang kecil bulat 8px di kiri atas (etiket gantung). Menampilkan harga aktif (`--arang`, tebal) dan harga coret (`--cabai`) jika ada.
- **Swatch Warna**: Kotak 44x44px berisi warna/motif atau foto varian; terpilih dengan garis 2px `--pandan`.
- **Chip Ukuran**: Kotak 44x44px dengan teks ukuran; terpilih: latar `--pandan`, teks putih; habis: teks `--abu`, dicoret diagonal (`XL̶`), tidak bisa dipilih.
- **Tombol WhatsApp**: Tombol utama (`--pandan`), tinggi 44px, teks putih, 16px/600. Nonaktif jika ukuran belum dipilih atau stok habis ("Stok habis").

## Komponen & Perilaku
### Galeri Foto
- Foto utama berukuran besar (rasio 4:5, placeholder `--pasir` dengan "[CONTOH] Foto belum tersedia" jika tidak ada foto).
- Deretan thumbnail di bawahnya (maks 8 thumbnail). Klik thumbnail mengganti foto utama. Jika lebih dari 8, thumbnail terakhir menunjukkan indikator `+N`.
- Efek transisi halus saat berganti foto.

### Pilihan Warna (Swatch)
- Menampilkan pilihan warna yang tersedia untuk produk tersebut.
- Mengklik swatch warna akan memperbarui pilihan warna aktif dan memfilter ukuran yang tersedia untuk warna tersebut (atau memperbarui stok varian yang sesuai).

### Pilihan Ukuran (Chip)
- Menampilkan ukuran yang tersedia (misal: S, M, L, XL, Jumbo).
- Ukuran dengan stok 0 (`stok === 0`) dicoret diagonal dan dinonaktifkan (`cursor-not-allowed`).
- Ukuran terpilih memiliki latar `--pandan` dan teks putih.

### Teks Stok Menipis
- Ditampilkan hanya jika stok varian yang dipilih kurang dari atau sama dengan stok minimum (misal: `stok <= stok_minimum`, default 3).
- Teks: "Sisa 2" (warna `--kunyit` atau `--arang` dengan latar `--kunyit-muda`).

### Bagian Informasi Lipat (Accordion)
- Bagian yang dapat dibuka/tutup: Deskripsi produk, Bahan, Perawatan.
- Default terbuka atau tertutup (deskripsi terbuka).

### Tombol "Pesan via WhatsApp"
- Membentuk URL WhatsApp secara dinamis: `https://wa.me/<nomor_whatsapp>?text=<pesan_encoded>`
- Pesan otomatis: `Halo, saya ingin memesan Daster Batik Parang (Warna: Merah, Ukuran: M). Apakah masih tersedia? Link: https://toko-daster.test/product/daster-batik-parang`
- Tombol nonaktif (disabled) dan bertuliskan "Pilih ukuran dulu" jika ukuran belum dipilih.
- Bertuliskan "Stok habis" jika varian yang dipilih (atau seluruh produk) stoknya habis.

## State & Microcopy
### Default
- Menampilkan produk dengan varian pertama terpilih secara default (jika ada).

### Loading
- Skeleton untuk galeri foto (blok `--pasir`) dan panel detail di sebelah kanan.

### Empty / 404 (Produk Tidak Ditemukan / Draf / Arsip)
- Jika slug tidak ditemukan, atau produk berstatus `draf` atau `arsip`.
- Menampilkan halaman 404 yang ramah:
  - Judul: "Daster tidak ditemukan"
  - Deskripsi: "Produk yang Anda cari mungkin sudah dihapus, diarsipkan, atau tidak tersedia."
  - Tombol: "Kembali ke Katalog" (`/product`).

### Error
- Gagal memuat detail produk.
- Judul: "Gagal memuat detail produk"
- Deskripsi: "Produk belum bisa dimuat. Coba lagi."
- Tombol: "Coba lagi" (reload halaman).

### Success
- Data produk, galeri, swatch, dan varian dimuat dengan benar.

### Disabled
- Chip ukuran dengan stok 0 dinonaktifkan (`disabled`, dicoret).
- Tombol WhatsApp dinonaktifkan jika belum memilih ukuran atau stok habis.

## Validasi, Urutan Fokus, Konsekuensi Aksi
- Memilih varian memperbarui status tombol WhatsApp secara reaktif.
- Pengguna harus memilih warna (jika ada) dan ukuran sebelum tombol WhatsApp aktif.

## Responsif
- Mobile (< 768px):
  - Galeri foto di atas (geser horizontal atau bertumpuk dengan thumbnail).
  - Info produk di bawah galeri.
  - Sticky bottom bar: menampilkan harga dan tombol "Pesan via WhatsApp" menempel di bagian bawah layar agar selalu mudah dijangkau dengan ibu jari.
- Tablet & Desktop (>= 768px):
  - Tata letak dua kolom berdampingan.

## Microcopy
### Tombol WhatsApp
- Default: "Pesan via WhatsApp"
- Belum pilih ukuran: "Pilih ukuran dulu"
- Stok habis: "Stok habis"

### Stok Menipis
- "Sisa 2" (atau "Sisa 1", dll.)

### Label Bagian
- "Warna"
- "Ukuran"
- "Panduan ukuran" (tautan)
- "Deskripsi"
- "Bahan"
- "Perawatan"

## Aksesibilitas & Fokus Keyboard
- Urutan fokus: Breadcrumb → Galeri thumbnail → Swatch warna → Chip ukuran → Tautan panduan ukuran → Tombol Pesan via WhatsApp → Bagian lipat (accordion).
- Chip ukuran dan swatch warna dapat dinavigasi dengan tombol panah keyboard (`ArrowLeft`, `ArrowRight`, `Space`, `Enter`).
- Tombol WhatsApp memiliki `aria-label="Pesan daster [Nama Produk] via WhatsApp"`.
- Kontras teks memenuhi WCAG AA.
- Fokus ring pandan terlihat.

## Kebutuhan Data/Props
### Data dari Backend (props Inertia)
1. `product` (object):
   - id, slug, nama, deskripsi, bahan, perawatan, harga, harga_coret, status, kategori (nama, slug).
   - `images`: array objek gambar (`id`, `path`, `urutan`).
   - `variants`: array objek varian (`id`, `sku`, `ukuran`, `warna`, `harga`, `stok`, `stok_minimum`).
2. `settings.whatsapp_number` (string): nomor WhatsApp toko untuk link CTA.

### Alur Pengambilan Data
- Controller mencari produk berdasarkan slug di tabel `products` di mana `status = 'tayang'`. Jika tidak ada atau bukan tayang, kembalikan 404 (`abort(404)`).

## Daftar Periksa (Self-Review)
- [ ] Sesuai PRD bagian 5.3 (galeri foto, pilihan warna/ukuran, stok varian, etiket harga, tombol WhatsApp ter-encode, penanganan 404 untuk slug tidak valid/draf/arsip) dan design.md bagian 9.4 (layout dua kolom, etiket harga gantung dengan lubang 8px, chip ukuran, swatch warna, sticky bottom bar di ponsel).
- [ ] Tanpa fitur terlarang (keranjang, checkout, wishlist, ulasan, voucher, notifikasi, lupa password, multi-gudang, ekspor Excel, aplikasi mobile).
- [ ] State default, loading, empty/404, error, success, disabled terdokumentasi.
- [ ] Responsif untuk 360, 768, 1024, 1280px.
- [ ] Aksesibilitas WCAG AA terpenuhi.
- [ ] Props Inertia didefinisikan dengan jelas.

## Handoff
### Ke Frontend
- File spesifikasi: `docs/design/product-detail.md`.
- Komponen dasar: gunakan komponen dari `K8` (Header, Footer, SwatchWarna, ChipUkuran, EtiketHarga, TombolWhatsApp, Accordion).
- State kelola lokal: `selectedColor`, `selectedSize`, `activeImageIndex`.
- Reaktivitas: Saat warna/ukuran dipilih, perbarui stok yang tersedia dan status tombol WhatsApp.

### Ke Backend melalui Tech Lead
- Props Inertia: `product` (dengan relasi `images` dan `variants`), `settings.whatsapp_number`.
- Pastikan route `product/{slug}` memeriksa `status == 'tayang'`, jika tidak kembalikan 404.
- Tautan WhatsApp harus di-encode dengan benar di frontend atau disiapkan template teksnya.

### Ke QA
- Verifikasi halaman 404 muncul saat slug salah, draf, atau diarsipkan.
- Verifikasi galeri foto mengganti foto utama saat thumbnail diklik.
- Verifikasi swatch warna dan chip ukuran memperbarui ketersediaan stok.
- Verifikasi chip ukuran yang habis (stok 0) dicoret dan tidak bisa dipilih.
- Verifikasi tombol WhatsApp nonaktif jika ukuran belum dipilih, dan aktif dengan pesan yang benar setelah ukuran dipilih.
- Verifikasi URL WhatsApp ter-encode dengan benar (nama produk, warna, ukuran, URL halaman).
- Verifikasi teks "Sisa N" muncul hanya saat stok <= stok minimum.
- Verifikasi sticky bottom bar di ponsel.

## Pertanyaan Terbuka / Asumsi
1. **Harga Varian**: Apakah varian bisa memiliki harga khusus yang berbeda dari harga produk utama?
   - Asumsi: Ya, sesuai PRD bagian 6.2 (`harga varian (opsional; kosong berarti ikut harga produk)`). Jika varian memiliki harga, etiket harga menampilkan harga varian tersebut saat dipilih.
   - NON-BLOCKING.
2. **Format Etiket Gantung**: Apakah lubang 8px di etiket harga adalah representasi visual murni via CSS?
   - Asumsi: Ya, div kecil atau pseudo-element lingkaran di pojok kiri atas etiket.
   - NON-BLOCKING.

