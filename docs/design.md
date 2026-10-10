# design.md: Toko Daster

Sumber kebenaran tampilan, dibaca oleh `uiux` dan `frontenddeveloper`. Fungsi dan data mengikuti `PRD.md`. Jika dua dokumen berbeda, tanyakan lewat Tech Lead; jangan memilih sendiri.
Agent mungkin tidak bisa melihat gambar, jadi semua keputusan visual ditulis sebagai teks di sini.

## 1. Arah

Hangat, rapi, rumahan. Bayangkan etiket gantung dan jahitan di toko kain, bukan template startup. Foto produk adalah bintangnya; antarmuka tenang di sekitarnya. Dashboard admin: datar, padat, cepat dibaca, tanpa hiasan.

## 2. Larangan keras (agar tidak terlihat buatan AI)

1. Tanpa gradien (latar, tombol, kartu, grafik). Semua warna datar.
2. Tanpa efek kaca (glassmorphism), blur, lingkaran transparan dekoratif, atau blob.
3. Tanpa bayangan kartu. Pemisah memakai garis 1px. Satu-satunya bayangan: panel dropdown/menu.
4. Tanpa sudut sangat bulat. Radius 4px untuk tombol, input, kartu. Bentuk pil (999px) hanya untuk badge status dan chip.
5. Tanpa ikon emoji dan tanpa ikon warna-warni. Satu set ikon garis (misalnya Lucide) dengan stroke 1,5px, warna mengikuti teks.
6. Tanpa baris "3 kartu fitur dengan ikon di tengah". Keunggulan ditulis sebagai daftar bernomor dengan kalimat konkret.
7. Tanpa hero terpusat dengan satu judul dan dua tombol di atas gambar abstrak. Hero asimetris: teks di kiri, foto di kanan.
8. Tanpa font Inter, Roboto, Poppins, atau font sistem sebagai identitas. Pakai font di bagian 5.
9. Tanpa ungu atau biru-ungu. Tanpa warna neon.
10. Tanpa teks "lorem ipsum", "Elevate", "Seamless", "Unlock", "Discover the", atau slogan generik. Teks Indonesia yang konkret (bagian 11).
11. Tanpa animasi masuk per bagian saat scroll, parallax, atau gerak yang tidak merespons tindakan pengguna.
12. Tanpa foto stok yang tidak relevan. Belum ada foto: pakai placeholder di bagian 13.
13. Tanpa pusat-semua. Rata kiri sebagai dasar; pusat hanya untuk blok pendek (mis. penutup ajakan).
14. Tanpa kartu di dalam kartu, tanpa garis tepi tebal, tanpa warna lebih dari yang tertulis di bagian 4.

## 3. Referensi (hanya inspirasi struktur, bukan untuk ditiru)

Gambar ada di `docs/referensi/`. Itu karya pihak ketiga; jangan menyalin warna, merek, ilustrasi, atau teksnya.

| Referensi | Ambil | Jangan ambil |
|---|---|---|
| `halaman_product.jpg` (detail produk sepatu) | Susunan dua kolom: foto besar + deretan thumbnail dengan "+N" di kiri; kanan: nama, harga besar, pilihan warna (thumbnail kecil), chip ukuran (terpilih = terisi penuh), tautan panduan ukuran, tombol utama selebar kolom. Breadcrumb di atas | Rating bintang, penghitung Cart/Favorites di header, tombol hitam, lencana kuning |
| `halaman_landing.jpg` (landing kaos custom) | Ritme halaman panjang: hero dengan judul besar dan foto, barisan keunggulan singkat, blok teks+foto yang selang-seling, judul section yang besar, langkah-langkah, ajakan penutup di blok gelap lebar, footer berkolom | Doodle, blob biru, pita, logo klien, kolom berlangganan, kartu mengambang |
| `halaman_admin.jpg` (dashboard admin) | Kerangka: sidebar kiri, bar atas dengan pencarian dan avatar, deretan kartu statistik, tabel dengan kolom status | Gradien ungu/biru/oranye, lingkaran transparan di kartu, badge hijau neon, ikon berwarna, avatar di sidebar |
| `halaman_login.jpg` (login) | Layout dua kolom (visual kiri, formulir kanan), kolom isian bergaris bawah, judul "Login" yang besar | Ilustrasi penuh detail, tombol pil, tautan daftar (tidak ada pendaftaran), "Forgot password" (tidak ada di tahap 1) |

## 4. Warna

Komposisi: 60% kapas/putih, 25% arang dan pasir, 10% pandan, 5% aksen (cabai, kunyit, lawon).

| Token | Hex | Pakai untuk |
|---|---|---|
| `--kapas` | `#F6F2E9` | Latar halaman |
| `--putih` | `#FFFFFF` | Permukaan kartu, input, tabel |
| `--pasir` | `#EAE3D3` | Latar blok kedua, baris tabel selang-seling, placeholder foto |
| `--garis` | `#D6CDB8` | Semua garis dan garis jahitan |
| `--arang` | `#1E1B18` | Teks utama, blok gelap penutup |
| `--abu` | `#6B645A` | Teks sekunder, label, placeholder isian |
| `--pandan` | `#2E5E4E` | Warna utama: tombol utama, tautan, elemen terpilih, header admin aktif |
| `--pandan-gelap` | `#234A3D` | Hover/tekan tombol utama, latar sidebar admin |
| `--pandan-muda` | `#DCE7DF` | Latar terpilih, info, status "dibayar" |
| `--cabai` | `#B73A25` | Harga coret, "Habis", galat, status "batal", tombol hapus |
| `--cabai-muda` | `#F6DAD3` | Latar pesan galat |
| `--kunyit` | `#E2A72E` | Sorotan kecil: label "Baru", "Sisa N", status "baru" (selalu dengan teks `--arang`) |
| `--kunyit-muda` | `#F7E7BE` | Latar peringatan |
| `--lawon` | `#2D5B87` | Informasi sekunder, status "dikirim", deret kedua di grafik |

Kontras (dihitung kasar; frontend wajib memverifikasi dengan alat sebelum selesai): `--arang` di `--kapas` sekitar 15:1; `--pandan` di `--kapas` sekitar 6,6:1; putih di `--pandan` sekitar 7,4:1; `--cabai` di `--kapas` sekitar 5,1:1; `--arang` di `--kunyit` sekitar 8:1; `--abu` di `--kapas` sekitar 5,2:1. Jangan menaruh teks `--kunyit` di atas latar terang.

Aturan: satu tombol utama (`--pandan`) per tampilan. Status selalu berupa kata + warna, tidak pernah warna saja. Tidak ada mode gelap di tahap 1.

## 5. Tipografi

- **Judul:** Young Serif (400). Hanya untuk judul >= 22px di halaman publik, wordmark "Daster", dan angka besar di kartu statistik admin boleh memakai Hanken Grotesk.
- **Isi, formulir, tabel, harga, seluruh admin:** Hanken Grotesk (400, 500, 600). Angka memakai `font-variant-numeric: tabular-nums`.
- Pasang lewat paket `@fontsource/young-serif` dan `@fontsource-variable/hanken-grotesk` (self-host). Jika paket tidak ditemukan, pakai Google Fonts dengan `font-display: swap`. Cadangan: `Georgia, serif` untuk judul; `system-ui, sans-serif` untuk isi.
- Skala (px): 14 / 16 / 18 / 22 / 28 / 40 / 56. Isi 16px, tinggi baris 1,6. Judul tinggi baris 1,1 sampai 1,2. Panjang baris maks 68 karakter.
- Judul memakai huruf kecil biasa (sentence case). Jangan huruf kapital semua, kecuali label kecil 12px dengan jarak huruf 0,04em (maksimal satu jenis di tiap halaman).
- Harga: Hanken Grotesk 600, format `Rp89.000`. Harga coret: `--cabai`, dicoret, lebih kecil.

## 6. Grid, spasi, bentuk

- Kontainer maks 1200px, padding samping 20px (ponsel), 32px (>= 768px). Grid 12 kolom, jarak 24px.
- Spasi kelipatan 4px: 4, 8, 12, 16, 24, 32, 48, 64, 96. Jarak antar section: 96px (desktop), 56px (ponsel).
- Radius 4px. Garis 1px `--garis`. Tinggi tombol dan input 44px (target sentuh minimal 44x44px).
- Fokus: ring 2px `--pandan` dengan offset 2px, selalu terlihat.
- Foto produk: rasio 4:5, tanpa bingkai, tanpa sudut membulat tambahan.

## 7. Elemen khas: garis jahitan dan etiket

Satu-satunya hiasan di seluruh situs, dipakai hemat.

- **Garis jahitan:** garis putus 2px, dash 8px jarak 6px, warna `--garis`. Dipakai sebagai pemisah antar section di halaman publik, dan di grafik admin sebagai garis bantu. Maksimal satu garis jahitan terlihat per layar ponsel.
- **Etiket harga:** di halaman detail produk, harga ditaruh dalam kotak bergaris putus (jahitan) dengan satu lubang kecil bulat 8px di kiri atas, seperti etiket gantung. Di kartu produk, harga biasa tanpa etiket.

## 8. Komponen

| Komponen | Spesifikasi |
|---|---|
| Tombol utama | Latar `--pandan`, teks putih, 16px/600, tinggi 44px, radius 4px. Hover `--pandan-gelap`. Nonaktif: `--pasir` dengan teks `--abu` |
| Tombol sekunder | Latar transparan, garis 1px `--arang`, teks `--arang`. Hover latar `--pasir` |
| Tombol hapus | Garis dan teks `--cabai`; konfirmasi lewat dialog, bukan langsung |
| Tautan | `--pandan`, garis bawah 1px, hover `--pandan-gelap` |
| Isian teks (publik) | Garis bawah 1px `--arang`, tanpa kotak, label kecil di atas (gaya login referensi). Galat: garis `--cabai` + pesan di bawah |
| Isian teks (admin) | Kotak putih, garis 1px `--garis`, radius 4px, label di atas. Fokus: ring pandan |
| Chip ukuran | Kotak 44x44px (lebar menyesuaikan), garis 1px `--garis`. Terpilih: latar `--pandan`, teks putih. Habis: teks `--abu`, dicoret diagonal, tidak bisa dipilih |
| Swatch warna | Kotak 44x44px berisi foto/warna varian, garis 1px; terpilih: garis 2px `--pandan` |
| Kartu produk | Foto 4:5; di bawahnya nama (16/600, maks 2 baris), harga, daftar ukuran tersedia (14px `--abu`: "S M L XL"). Tanpa bayangan, tanpa bingkai. Label "Habis" (`--cabai`, teks putih, pojok kiri atas foto) atau "Baru" (`--kunyit`, teks `--arang`) |
| Badge status (admin) | Pil 24px, teks 13/600, titik 8px di depan. `baru`: kunyit-muda + arang; `dibayar`: pandan-muda + pandan-gelap; `dikemas`: pasir + arang; `dikirim`: latar `#DCE8F3` + lawon; `selesai`: pandan + putih; `batal`: cabai-muda + cabai. `tayang`: pandan-muda + pandan-gelap; `draf`: pasir + arang; `arsip`: putih dengan garis + abu |
| Kartu statistik | Latar putih, garis 1px `--garis`, radius 4px, padding 20px. Label 14px `--abu`; angka 28px/600 `--arang`; perbandingan 14px (naik: `--pandan`, turun: `--cabai`) dengan ikon panah. Tidak ada gradien dan tidak ada ikon besar |
| Tabel admin | Header 13px/600 `--abu` pada `--pasir`, baris 48px, garis bawah 1px `--garis`, hover baris `--kapas`. Angka rata kanan. Aksi di kolom terakhir (ikon + tooltip) |
| Grafik | Recharts. Garis 2px `--pandan`; deret kedua `--lawon`, ketiga `--kunyit`. Tanpa isian area bergradien (isian datar `--pandan-muda` boleh). Garis bantu berupa garis jahitan. Tooltip berkotak putih dengan garis 1px |
| Notifikasi (toast) | Kotak putih, garis kiri 4px (pandan/cabai/kunyit), teks 14px, hilang otomatis 5 detik, bisa ditutup |
| Dialog | Latar putih, radius 4px, garis 1px, overlay `--arang` 50%. Tombol konfirmasi di kanan |
| Skeleton | Blok `--pasir` datar tanpa animasi shimmer berlebihan (denyut opasitas pelan, hormati `prefers-reduced-motion`) |
| Keadaan kosong | Satu kalimat konkret + satu tindakan. Tanpa ilustrasi |

## 9. Halaman publik

### 9.1 Header dan footer
- Header: wordmark "Daster" (Young Serif, 28px, `--pandan`) di kiri; menu Beranda, Produk, Kontak kami; tombol "Tanya lewat WhatsApp" (sekunder). Ponsel: menu jadi tombol "Menu" dengan panel penuh. Latar `--kapas`, garis bawah 1px. Tidak lengket (sticky) di desktop; di ponsel boleh lengket setinggi 56px.
- Footer: latar `--arang`, teks `--kapas`. Tiga kolom: toko (nama, alamat, jam buka), tautan (Produk, Kontak kami), kontak (WhatsApp, email, Instagram). Baris hak cipta di bawah garis jahitan `--abu`.

### 9.2 Landing `/`
```
┌────────────────────────────────────────────────────────────┐
│ Daster           Beranda  Produk  Kontak kami  [Tanya WA]  │
├────────────────────────────────────────────────────────────┤
│ Judul besar rata kiri,            ┌────────────────────┐   │
│ 56px, 2-3 baris                   │                    │   │
│ Subjudul 18px, maks 2 kalimat     │   foto besar 4:5   │   │
│ [Lihat produk]  Tanya lewat WA →  │                    │   │
│                                   └────────────────────┘   │
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌ garis jahitan ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤
│ Daster pilihan                          Lihat semua produk │
│ [kartu] [kartu] [kartu] [kartu]                            │
├────────────────────────────────────────────────────────────┤
│ Kenapa daster ini        1  Bahan  .......................│
│ (daftar bernomor,        2  Ukuran ........................│
│  bukan 3 kartu ikon)     3  Jahitan .......................│
├────────────────────────────────────────────────────────────┤
│ Cara pesan: 1 Pilih  2 Kirim lewat WA  3 Konfirmasi        │
├────────────────────────────────────────────────────────────┤
│ Blok gelap (--arang), judul pendek + tombol WhatsApp       │
├────────────────────────────────────────────────────────────┤
│ footer                                                     │
└────────────────────────────────────────────────────────────┘
```
- Hero: teks mengambil 5 kolom, foto 7 kolom; di ponsel teks dulu, foto di bawah. Judul dan subjudul dari pengaturan toko; bawaan `[CONTOH]`.
- "Daster pilihan": 4 kartu (ponsel: 2 kolom, geser tidak diperlukan). Judul section 40px Young Serif.
- "Kenapa daster ini": tiga butir bernomor, setiap butir satu kalimat konkret dari pemilik `[CONTOH]`. Jangan mengarang klaim bahan.
- Testimoni tidak ada di tahap 1.

### 9.3 Daftar produk `/product`
```
┌────────────────────────────────────────────────────────────┐
│ Beranda / Produk                                           │
│ Semua produk                       [cari........] [Urutkan▾]│
├──────────────┬─────────────────────────────────────────────┤
│ Kategori     │ [kartu] [kartu] [kartu] [kartu]             │
│ Ukuran       │ [kartu] [kartu] [kartu] [kartu]             │
│ Harga        │ [kartu] [kartu] [kartu] [kartu]             │
│ ☐ Tersedia   │            1 2 3 ›                          │
└──────────────┴─────────────────────────────────────────────┘
```
Desktop: filter sebagai kolom kiri 3 kolom. Ponsel: tombol "Filter" membuka panel dari bawah; hasil 2 kolom. Jumlah hasil ditulis ("24 produk"). Filter aktif tampil sebagai chip yang bisa dihapus.

### 9.4 Detail produk `/product/{slug}`
```
┌────────────────────────────────────────────────────────────┐
│ Beranda / Produk / Daster Batik Parang                     │
├─────────────────────────────┬──────────────────────────────┤
│ ┌─────────────────────────┐ │ Kategori                     │
│ │                         │ │ Nama produk (Young Serif 40) │
│ │      foto besar 4:5     │ │ ┌ ─ ─ ─ ─ ─ ─ ─ ─ ┐         │
│ │                         │ │ ╎ Rp89.000  Rp110.000╎ etiket │
│ └─────────────────────────┘ │ └ ─ ─ ─ ─ ─ ─ ─ ─ ┘         │
│ [t1] [t2] [t3] [t4] [+4]    │ Warna  [sw] [sw] [sw]        │
│                             │ Ukuran [S] [M] [L] [XL̶]      │
│                             │ Panduan ukuran (tautan)      │
│                             │ [ Pesan via WhatsApp ]       │
│                             │ Sisa 2 (hanya bila menipis)  │
│                             │ Bahan · Perawatan (lipat)    │
└─────────────────────────────┴──────────────────────────────┘
```
Ponsel: foto di atas (geser), info di bawah, tombol "Pesan via WhatsApp" menempel di bawah layar dengan harga di sampingnya. Deskripsi, bahan, perawatan dalam bagian yang bisa dilipat. Tidak ada rating atau ulasan.

### 9.5 Kontak `/kontak-kami`
Dua kolom: kiri info toko (alamat, jam buka, WhatsApp, email, Instagram, tautan peta) sebagai daftar berlabel; kanan formulir (nama, kontak, pesan, tombol "Kirim pesan"). Isian bergaris bawah. Setelah berhasil: pesan sukses menggantikan formulir. Ponsel: info di atas, formulir di bawah.

### 9.6 Login `/login`
```
┌───────────────────────┬────────────────────────────────────┐
│ latar --pandan        │                                    │
│                       │   Masuk                            │
│  Daster               │   Email ________________________   │
│  (wordmark besar,     │   Password _____________________   │
│   --kapas)            │   [ Masuk ]                        │
│  garis jahitan        │                                    │
│  Dashboard pengelola  │                                    │
└───────────────────────┴────────────────────────────────────┘
```
Kiri: blok datar `--pandan` dengan wordmark `--kapas` dan satu garis jahitan; tanpa ilustrasi. Kanan: judul "Masuk" (Young Serif 40px), isian bergaris bawah, tombol utama selebar kolom (radius 4px). Tanpa tautan daftar dan tanpa "lupa password". Ponsel: kolom kiri disembunyikan, wordmark kecil di atas formulir.

## 10. Dashboard admin

- **Kerangka:** sidebar kiri 240px berlatar `--pandan-gelap` (teks `--kapas`, item aktif latar `--pandan` + garis kiri 3px `--kunyit`); bar atas putih 56px (judul halaman, pencarian cepat, nama admin + menu Akun/Keluar). Konten berlatar `--kapas`, kontainer maks 1280px. Ponsel dan tablet: sidebar menjadi panel geser.
- **Menu:** Dashboard, Produk, Kategori, Stok, Pesanan, Pesan masuk (dengan penghitung belum dibaca), Laporan, Pengaturan. Ikon garis 20px.
- **Dashboard:** baris kartu statistik (5 kartu, ponsel 2 kolom); di bawahnya grafik omzet 30 hari (lebar 8 kolom) dan "Produk terlaris" (4 kolom); di bawahnya tabel "Pesanan terbaru" dan daftar "Stok menipis".
- **Halaman daftar:** judul + tombol utama di pojok kanan atas, baris pencarian dan filter, tabel, pagination.
- **Formulir produk:** satu halaman, kiri isian utama, kanan panel foto (seret untuk mengurutkan) dan status; bagian varian berupa tabel yang bisa diedit di tempat; tombol Simpan lengket di bawah.
- **Pesanan:** formulir pembuatan dengan pilihan varian yang bisa dicari dan menampilkan stok; ringkasan total di kolom kanan, dihitung ulang tiap perubahan (tampilan saja; total resmi dihitung server).
- Status dan angka selalu dengan teks, tidak hanya warna. Aksi merusak memakai dialog konfirmasi.

## 11. Teks dan suara

Bahasa Indonesia sehari-hari, ramah, langsung, tanpa janji berlebihan. Kalimat pendek.

| Situasi | Teks |
|---|---|
| Tombol WhatsApp | Pesan via WhatsApp · Tanya lewat WhatsApp |
| Ukuran habis | Ukuran M habis |
| Stok menipis | Sisa 2 |
| Belum pilih ukuran | Pilih ukuran dulu |
| Hasil kosong | Belum ada produk yang cocok. Hapus filter |
| Gagal memuat | Produk belum bisa dimuat. Coba lagi |
| Pesan kontak berhasil | Pesan terkirim. Kami balas secepatnya |
| Login gagal | Email atau password tidak cocok |
| Terlalu banyak percobaan | Terlalu banyak percobaan. Coba lagi dalam 1 menit |
| Simpan berhasil | Produk disimpan |
| Stok tidak cukup | Stok Daster Batik Parang ukuran M tinggal 2 |
| Konfirmasi hapus | Hapus produk ini? Riwayat pesanan tidak ikut terhapus |

Isi hero, keunggulan, dan "cara pesan" di database memakai `[CONTOH]` sampai pemilik menggantinya. Contoh judul hero `[CONTOH]`: "Daster yang enak dipakai seharian." Jangan menambah klaim (bahan, ukuran, jahitan) yang tidak diberikan pemilik.

## 12. Aksesibilitas, responsif, gerak

- Kontras WCAG AA (lihat bagian 4), fokus selalu terlihat, semua kontrol bisa dioperasikan dengan keyboard, urutan fokus mengikuti urutan baca.
- Label pada setiap isian, pesan galat terhubung ke isian (`aria-describedby`), gambar bermakna punya `alt`, gambar dekoratif `alt=""`.
- Breakpoint: 360 (dasar), 768, 1024, 1280. Rancang ponsel dulu.
- Gerak hanya sebagai respons tindakan (panel terbuka, dialog muncul, tombol ditekan), 150 sampai 200 ms, hormati `prefers-reduced-motion`.
- Target sentuh minimal 44x44px.

## 13. Foto dan placeholder

- Foto produk asli diberikan pemilik. Sebelum ada: placeholder lokal berupa blok datar `--pasir` rasio 4:5 dengan tulisan kecil "[CONTOH] Foto belum tersedia" dan satu garis jahitan di tengah bawah. Seeder membuat berkas gambar lokal dari spesifikasi ini; dilarang menautkan foto dari internet.
- Gambar bermakna di layar pertama dimuat langsung; sisanya `loading="lazy"`. Kegagalan memuat gambar jatuh ke placeholder yang sama.

## 14. Token CSS

Frontend memetakan ini ke konfigurasi Tailwind sesuai versi yang terpasang.

```css
:root {
  --kapas: #F6F2E9;  --putih: #FFFFFF;  --pasir: #EAE3D3;  --garis: #D6CDB8;
  --arang: #1E1B18;  --abu: #6B645A;
  --pandan: #2E5E4E; --pandan-gelap: #234A3D; --pandan-muda: #DCE7DF;
  --cabai: #B73A25;  --cabai-muda: #F6DAD3;
  --kunyit: #E2A72E; --kunyit-muda: #F7E7BE;
  --lawon: #2D5B87;
  --radius: 4px;
  --font-judul: "Young Serif", Georgia, serif;
  --font-isi: "Hanken Grotesk Variable", "Hanken Grotesk", system-ui, sans-serif;
}
```
