# Spesifikasi Layar: Beranda (Landing)

## Tujuan
Halaman publik utama yang memperkenalkan toko daster, menampilkan produk unggulan, manfaat etiket gantung, langkah pemesanan, dan ajakan WhatsApp. Entry point utama untuk pengunjung.

## Entry & Exit Point
- **Entry**: `/` (langsung, tidak ada form login)
- **Exit**: `/product` (lihat semua produk), `/product/{slug}` (detail produk), `#whatsapp-cta` (ke WhatsApp), `/kontak-kami` (form kontak)

## Struktur Layout (Wireframe Teks)
```
┌────────────────────────────────────────────────────────────┐
│ Header: Daster      Beranda  Produk  Kontak kami   [Tanya WA] │
├────────────────────────────────────────────────────────────┤
│ Hero asimetris (desktop):                           │
│ ├─ Teks (5 kolom):                                    │
│ │ • Judul (56px, Young Serif, sentence case)       │
│ │ • Subjudul (18px, Hanken Grotesk, 2 kalimat)     │
│ │ • [Lihat produk] → `/product`                     │
│ │ • Tanya lewat WA → WhatsApp                        │
│ └─ Foto (7 kolom, 4:5, besar, lazy-load)          │
├────────────────────────────────────────────────────────────┤
│ Garis jahitan (putus 2px, dash 8px)                   │
├────────────────────────────────────────────────────────────┤
│ "Daster pilihan" (40px Young Serif):                 │
│ ┌─ [Kartu produk 4:5] [Kartu produk] [Kartu produk] [Kartu produk]─┐
│ │ (ponsel: 2 kolom, geser, tidak ada navigasi)     │
├────────────────────────────────────────────────────────────┤
│ "Kenapa daster ini" (40px Young Serif):             │
│ ├─ 1. Bahan konkret dari pemilik [CONTOH]            │
│ ├─ 2. Ukuran konkret dari pemilik [CONTOH]            │
│ └─ 3. Jahitan konkret dari pemilik [CONTOH]            │
├────────────────────────────────────────────────────────────┤
│ "Cara pesan": 3 langkah bernomor:                     │
│ ├─ 1 Pilih produk (dari `/product` atau `/product/{slug}`)│
│ ├─ 2 Kirim lewat WhatsApp (tombol CTA)               │
│ └─ 3 Konfirmasi dan kirim (konfirmasi admin)          │
├────────────────────────────────────────────────────────────┤
│ Blok gelap (--arang), judul pendek + tombol WhatsApp   │
├────────────────────────────────────────────────────────────┤
│ Footer: Daster (28px Young Serif, --pandan)          │
│ ├─ Kolom: toko, tautan, kontak                        │
│ └─ Baris hak cipta di bawah garis jahitan --abu       │
└────────────────────────────────────────────────────────────┘
```

## Hirarki Visual & Aksi Utama/Sekunder
- **Judul Hero** utama, visual, klik langsung ke produk.
- **Tombol CTA WhatsApp** sekunder, immediate.
- **Kartu produk** utama (klik ke detail), hover menampilkan detail harga.
- **Tombol hapus filter** sekunder (jika diterapkan filter).
- **Tombol kembali atas** sekunder (jika ada di tengah halaman).

## Komponen & Perilaku
### Header
- Wordmark "Daster" (Young Serif, 28px, --pandan) di kiri.
- Menu navigasi: Beranda (aktif), Produk, Kontak kami.
- Tombol "Tanya lewat WhatsApp" (sekunder).
- Di ponsel: tombol "Menu" menjadi panel geser penuh.

### Hero
- Judul dan subjudul (hero) adalah teks yang dapat diedit dari pengaturan (`/admin/pengaturan`).
- Teks berada di atas foto, desktop: teks mengambil 5 kolom, foto 7 kolom.
- Ponsel: teks dulu, foto di bawah (stacked).
- Tombol "Lihat produk" menuju `/product`.
- Tombol WhatsApp membuka URL WhatsApp yang dihasilkan dari pengaturan (`settings.whatsapp_number`).

### Garis Jahitan
- Satu-satunya hiasan di halaman publik.
- Di desktop: pemisah antar section.
- Di ponsel: tidak ada (hemat ruang).

### Kartu Produk (4 kartu)
- Header: gambar (loading skeleton, placeholder `--pasir` dengan "[CONTOH] Foto belum tersedia" jika tidak ada foto, rasio 4:5, klik ke `/product/{slug}`).
- Body: nama produk (Hanken Grotesk 16/600, maks 2 baris), harga (Hanken Grotesk 600, format `Rp89.000`, coret harga kalau ada) di bawah.
- Footer: daftar ukuran yang tersedia (Hanken Grotesk 14, warna abu), teks "Habis" (`--cabai`, putih, pojok kiri atas foto) jika semua varian habis.
- Hover: kartu terangkat (box-shadow 0 4px 12px `--pandan-muda`), tombol WhatsApp muncul (sekunder).

### Bagian "Kenapa daster ini"
- Daftar bernomor (1., 2., 3.).
- Setiap butir satu kalimat konkret dari pemilik (`[CONTOH]`).
- Jangan mengarang klaim bahan/ukuran/jahitan yang tidak diberikan pemilik.

### Bagian "Cara pesan"
- Tiga langkah vertikal, ikon tidak digunakan.
- Setiap langkah: ikon panah kanan (Lucide, 16px) ke langkah berikutnya.
- Langkah 2 menampilkan nomor WhatsApp dari pengaturan, dapat diklik untuk membuka WhatsApp.

### Blok Ajakan Penutup
- Latar `--arang`, teks `--kapas`.
- Judul singkat + tombol "Tanya lewat WhatsApp" (utama).

### Footer
- Latar `--arang`, teks `--kapas`.
- Tiga kolom: toko (nama, alamat, jam buka), tautan (Beranda, Produk, Kontak kami), kontak (WhatsApp, email, Instagram).
- Baris hak cipta di bawah garis jahitan `--abu`.

## State & Microcopy
### Default
- Hero, produk unggulan, bagian cara pesan ditampilkan.

### Loading
- Skeleton untuk gambar produk (blok `--pasir` datar, denyut opasitas pelan, hormati `prefers-reduced-motion`).

### Empty (jika tidak ada produk tayang)
- Judul: "Belum ada daster yang ditampilkan"
- Deskripsi: "Semua produk daster baru saja diluncurkan. Silakan kunjungi kembali nanti."
- Tombol: "Jelajahi Katalog" → `/product`

### Error (gagal memuat produk unggulan)
- Judul: "Gagal memuat daster unggulan"
- Deskripsi: "Produk belum bisa dimuat. Coba lagi."
- Tombol: "Coba lagi" (reload produk unggulan via retry API), "Lihat Semua" (ke `/product`).

### Success
- Produk ditampilkan sesuai daftar dari backend.
- WhatsApp CTA muncul hanya jika `settings.whatsapp_number` tidak kosong.
- Nama hero, subjudul, judul section diedit dari pengaturan.

### Disabled
- Tombol WhatsApp saat nomor kosong (disembunyikan).
- Tombol "Lihat produk" jika filter diterapkan yang menyembunyikan semua produk (dengan disabled style).

### Partial (filter/search)
- Grid kartu menyempit sesuai filter.
- Chip filter aktif ditampilkan (dapat dihapus).

## Validasi, Urutan Fokus, Konsekuensi Aksi
- Tombol WhatsApp membuka URL ter-encode: `https://wa.me/<nomor>?text=<pesan>`. Pesan mencakup nama produk dan URL: `Hi, I’d like to ask about Daster Batik Parang (size=X, color=Y). Can you tell me availability?

  https://example.com/product/daster-batik-parang`

## Responsif
- Mobile (< 768px): hero stacked, kartu 2 kolom, tanpa garis jahitan, footer 1 kolom.
- Tablet (768-1024): kartu 3 kolom, footer 2 kolom.
- Desktop (>= 1024): kartu 4 kolom, footer 3 kolom.

## Microcopy
### Judul Halaman
Daster – Toko Daster (Young Serif, 22px+)

### Header
- Wordmark: "Daster"
- Menu: Beranda, Produk, Kontak kami
- CTA: "Tanya lewat WhatsApp", "Menu" (ponsel)

### Hero
- Judul: `[CONTOH] Daster yang enak dipakai seharian.` (masker `CONTOH` diganti pemilik)
- Subjudul: `[CONTOH] Temukan daster yang nyaman untuk ke kantor, pesta, atau santai.`
- Tombol:
  - "Lihat produk": menuju `/product`
  - "Tanya lewat WhatsApp" → membuka WhatsApp

### Bagian Kartu Produk
- Label status "Habis": "Habis"
- Label status "Baru": "Baru"

### Bagian "Kenapa daster ini"
- Setiap nomor: Concrete claim from owner

### Bagian "Cara pesan"
- Langkah 1: "Pilih daster"
- Langkah 2: "Kirim lewat WhatsApp"
- Langkah 3: "Konfirmasi dan kirim"

### Blok Ajakan Penutup
- Judul: "Mulai koleksi daster Anda hari ini"
- Tombol: "Tanya lewat WhatsApp"

### Footer
- Kolom toko: "Toko Daster", alamat `[CONTOH]`, jam buka `[CONTOH]`
- Tautan: Beranda, Produk, Kontak kami
- Kontak: "WhatsApp", "email", "Instagram"
- Hak cipta: "© 2024 Daster. Semua hak dilindungi."

## Aksesibilitas & Fokus Keyboard
- Fokus urutan: tombol WhatsApp → link produk → tautan footer.
- Tombol WhatsApp memiliki `aria-label="Chat via WhatsApp"`
- Kartu produk memiliki `role="button"` dan `aria-label="Lihat detail Daster Batik Parang (Rp89.000)"`
- Fokus yang terlihat (ring fokus pandan) dan tidak mengabaikan `prefers-reduced-motion`.

## Kebutuhan Data/Props
### Data dari Backend (props Inertia)
1. `settings.whatsapp_number` (string, opsional)
2. `settings.hero_title` (string, default: `[CONTOH] Daster yang enak dipakai seharian.`)
3. `settings.hero_subtitle` (string, default: `[CONTOH] Temukan daster yang nyaman...`)
4. `featured_products` (array produk): setiap produk:
   - id, slug, nama, harga, harga_coret, status
   - gambar utama: URL atau null
   - unggulan: boolean
   - varian: array ukuran/warna/stok
   - dihitung oleh backend: tidak ada varian habis?
5. `owner_claims` (array): klaim "kenapa daster ini" yang disimpan di pengaturan (`settings.why_daster` atau properti khusus).

### Alur Pengambilan Data
- Semua data diambil sekali di `/` (route controller `HomeController@index`).
- Cache layer (Redis/Laravel Cache) opsional di frontend.

### Validasi
- Nomor WhatsApp: string, hanya digit, mulai dengan `62`.
- Judul dan subjudul: tidak boleh hanya spasi.
- Produk: hanya `featured = true` yang ditampilkan; maksimal 4; jika kurang dari 4, tambahkan produk tayang terbaru.

## Daftar Periksa (Self-Review)
- [ ] Sesuai PRD bagian 5 (landing page: produk unggulan, CTA WhatsApp, bagian cara pesan) dan design.md bagian 9 (hero, kartu, keunggulan bernomor, bagian cara pesan, footer).
- [ ] Semua larangan keras design.md (tanpa gradien, tanpa glassmorphism, tanpa bayangan kartu, tidak ada sudut bulat, tidak ada ikon emoji, tidak ada judul + dua tombol di atas gambar abstrak, Young Serif untuk judul, Hanken Grotesk untuk isi, dsb.) terpenuhi.
- [ ] Tidak ada fitur di luar MVP (keranjang, checkout, wishlist, ulasan, voucher, notifikasi, lupa password, multi-gudang, ekspor Excel, aplikasi mobile) yang muncul di spec.
- [ ] Setiap layar (hero, CTA, kartu produk) memiliki state default, loading, empty, error, success, disabled, partial, dengan microcopy yang sesuai.
- [ ] Responsif untuk 360, 768, 1024, 1280px.
- [ ] Aksesibilitas dasar: kontras teks memenuhi WCAG AA, fokus keyboard terlihat, semua kontrol dapat dioperasikan dengan keyboard, label form terhubung, alt gambar produk, hormati `prefers-reduced-motion`.
- [ ] Semua kebutuhan data props tercakup; tidak ada asumsi inventarisasi backend yang tidak terperiksa.
- [ ] Asumsi dan pertanyaan terbuka dicatat di `docs/design/1-tinjauan-singkat.md`.
- [ ] Semua keputusan UI/UX dicatat dalam komentar kartu Kanban.
- [ ] Definisi Done tugas UI/UX terpenuhi: berkas spesifikasi dibuat di `docs/design/` untuk `/`, semua requirement layar tercakup.

## Handoff
### Ke Frontend
- Lokasi berkas: `docs/design/landing.md`.
- Komponen UI kit: gunakan komponen dasar yang dibuat oleh frontenddeveloper (K8), tidak boleh mendefinisikan komponen baru.
- Komponen wajib: Header, Footer, KartuProduk, TombolWhatsApp, Hero, GarisJahitan, BagianBagaimanaCaraPesan (bernomor, bukan ikon).
- Elemen tampilan: layout grid, spasi, warna, tipografi, radius, fokus, skrip gambar lazy-load, retry tombol coba lagi.
- State: `loading = true` awal, `error = null`, `retry()` berfungsi.
- Interaksi: klik kartu → navigasi ke `/product/{slug}`, hover kartu → tampilkan tombol WhatsApp sekunder, klik WhatsApp → buka URL, klik tombol "Lihat semua" → `/product`.

### Ke Backend melalui Tech Lead
- Data props: `settings.whatsapp_number`, `settings.hero_title`, `settings.hero_subtitle`, produk unggulan (field: id, slug, nama, harga, harga_coret, unggulan, gambar, varian).
- Filter: `featured = true` dan status `tayang`.
- Urutan: unggulan dulu, lalu produk tayang terbaru.
- Jika `whatsapp_number` kosong, sembunyikan tombol CTA di frontend.
- Validasi: WhatsApp number format.
- Urutan fokus: tidak ada fokus khusus (tidak ada form).

### Ke QA
- Acceptance criteria per halaman:
  - Semua komponen ditampilkan dengan benar.
  - WhatsApp CTA terbuka saat nomor ada; tidak ada tombol saat nomor kosong.
  - Judul hero, subjudul, konten bagian dapat diedit di admin.
  - Kartu produk menampilkan gambar, nama, harga, ukuran, status habis.
  - Highlight hover dan fokus dapat dilihat.
  - Responsif: desktop (grid 5 kolom hero), tablet (4 kartu), ponsel (2 kartu, geser), footer multi-kolom.
  - Aksesibilitas: label semantik, alt gambar, urutan fokus keyboard, hormati `prefers-reduced-motion`.
  - Keadaan kosong/error: tampilkan pesan konkret dan tombol aksi (Coba lagi, Lihat Semua).
  - Tidak ada fitur terlarang (mis. keranjang, wishlist, ulasan, voucher, notifikasi, lupa password, multi-gudang, ekspor Excel, aplikasi mobile) yang muncul di spec.

## Pertanyaan Terbuka / Asumsi
1. **Prop produk unggulan**: Backend mempertahankan field `unggulan` boolean; apakah frontend harus menampilkan badge "Baru" (kunyit) di kartu produk unggulan?
   - Asumsi: badge unggulan ditampilkan di kartu (kuning, label "Baru"). Jika tidak ada badge unggulan di design system, hanya menampilkan produk unggulan tanpa label.
   - BLOCKING jika badge "Baru" bukan bagian dari komponen kartu produk yang disetujui.

2. **Konten bagian "Kenapa daster ini"**: Apakah konten disediakan melalui setting yang disimpan di DB (mis. `settings.why_text_1`, `.2`, `.3`) atau disematkan statis di frontend? Data apa yang harus diminta dari backend?
   - Asumsi: endpoint settings (`settings.why_daster`) berisi array `"keunggulan": ["[CONTOH] Bahan katun yang lembut dan adem.", ...]` yang diambil admin dari Pengaturan.
   - NON-BLOCKING: jika admin memiliki panel untuk mengedit konten bagian di Pengaturan, dapatkan dari props settings yang sama yang dipakai halaman publik.

3. **Tombol Coba Lagi / Pesan WhatsApp gagal**: Haruskah tombol ini menampilkan notifikasi toast atau hanya memuat ulang bagian produk unggulan? Haruskah retry API menampilkan pesan error khusus atau mengulang UI?
   - Asumsi: retry ulang bagian produk unggulan dengan skeleton; jika tetap gagal, tampilkan pesan error "Gagal memuat daster unggulan" + tombol "Lihat Semua".
   - NON-BLOCKING: format presentasi error (toast vs inline) diserahkan ke frontenddeveloper.

