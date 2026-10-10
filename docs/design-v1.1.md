# design-v1.1.md: Tambahan Desain (Toko Daster)

Tambahan untuk `design.md`. Semua aturan di `design.md` tetap berlaku (token warna, font, radius 4px, tanpa gradien, tanpa bayangan kartu, satu garis jahitan per layar ponsel, tanpa animasi masuk). Fungsi mengikuti `PRD-v1.1.md`.

## 1. Carousel hero (menggantikan foto hero tunggal di landing)
```
┌────────────────────────────────────────────────────────────┐
│ Judul slide (Young Serif 56)        ┌────────────────────┐ │
│ Subjudul 18px, maks 2 kalimat       │                    │ │
│ [Teks tombol]                       │  foto slide 4:5    │ │
│                                     │                    │ │
│ ‹  ›    1 / 3   ● ○ ○              └────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```
- Teks 5 kolom, foto 7 kolom. Ponsel: teks dulu, foto di bawah, kontrol di bawah foto.
- Kontrol: tombol "‹" dan "›" berukuran 44x44px (garis 1px `--arang`, latar transparan, hover `--pasir`), penghitung "1 / 3" (14px `--abu`), titik penunjuk 8px (aktif `--pandan`, lainnya `--garis`; setiap titik tombol 44px sasaran sentuh). Tanpa panah di atas foto.
- Tanpa autoplay. Geser horizontal di ponsel. Pergantian: foto dan teks bertukar dengan memudar 200 ms; tanpa gerak jika `prefers-reduced-motion`.
- Satu slide: kontrol disembunyikan. Tanpa slide aktif: tampilkan judul dan subjudul cadangan dan placeholder foto (`design.md` bagian 13).
- Aksesibilitas: wadah `role="region"` dengan `aria-roledescription="carousel"` dan label "Sorotan toko"; tiap slide `aria-label="1 dari 3"`; tombol berlabel "Slide sebelumnya" dan "Slide berikutnya"; area teks `aria-live="polite"`; fokus keyboard pada tombol dan titik.
- Foto slide pertama dimuat langsung (layar pertama), yang lain `loading="lazy"`.

## 2. FAQ (akordeon)
- Judul "Pertanyaan yang sering ditanyakan" (Young Serif 40). Landing: judul di kolom kiri (4 kolom), daftar di kanan (8 kolom). `/kontak-kami`: di bawah info dan formulir, lebar penuh, dengan satu garis jahitan di atasnya. Ponsel: judul di atas daftar.
- Satu baris per item: tombol penuh selebar baris, tinggi minimal 56px, pertanyaan 18px/600 `--arang`, ikon panah di kanan (diputar saat terbuka), garis bawah 1px `--garis`. Terbuka: jawaban 16px `--abu` tinggi baris 1,6, jarak 16px. Boleh membuka lebih dari satu.
- `button` dengan `aria-expanded` dan `aria-controls`; Enter dan Spasi membuka. Jawaban memuat baris baru apa adanya (teks biasa).
- FAQ kosong: bagian disembunyikan di halaman publik.

## 3. Admin: Pengaturan
- Tab horizontal di bawah judul halaman: Identitas, Kontak, Beranda, FAQ, Pesan WhatsApp, SEO dan footer, Banner. Tab aktif ditandai garis bawah 3px `--pandan` dan teks 600; ponsel: baris tab bisa digeser.
- Setiap tab adalah formulir sendiri dengan tombol "Simpan perubahan" di bawah (lengket di ponsel). Menyimpan satu tab tidak mengirim tab lain. Perubahan belum disimpan: peringatan saat pindah tab. Berhasil: toast "Pengaturan disimpan".
- **Logo:** kotak pratinjau 160x64px di atas latar `--kapas` dan `--arang` berdampingan, tombol "Pilih berkas" dan "Hapus logo", teks bantu "PNG, JPG, atau WebP, maks 2 MB". Galat berupa pesan di bawah kotak.
- **Beranda:** bagian "Carousel hero" berisi daftar slide sebagai baris: thumbnail 4:5 (64x80), judul, badge Aktif atau Nonaktif, tombol naik, turun, ubah, hapus; tombol "Tambah slide" (nonaktif di 5 slide dengan catatan "Maksimal 5 slide"). Ubah atau tambah membuka panel samping: foto (pratinjau), judul, subjudul, teks tombol, tautan, urutan, aktif. Di bawahnya: tiga butir keunggulan dan tiga langkah (judul dan isi), judul dan tombol penutup, judul dan subjudul cadangan.
- **FAQ:** tabel baris: pertanyaan, badge Aktif atau Nonaktif, naik, turun, ubah, hapus. Tombol "Tambah pertanyaan". Dialog: pertanyaan, jawaban (area teks), aktif.
- **Pesan WhatsApp:** isian templat (area teks), daftar variabel yang bisa disalin, pratinjau pesan dengan contoh produk.
- Hapus slide atau pertanyaan memakai dialog konfirmasi.

## 4. Admin: Laporan dan cetak
- Atas halaman: pilihan periode, lalu tombol "Cetak" (sekunder, ikon printer) dan "Unduh CSV" (sekunder). Grafik tetap tampil di layar.
- **Stylesheet cetak** (`@media print`): A4 potret, margin 16mm, font 11pt Hanken Grotesk hitam di atas putih. Sembunyikan sidebar, bar atas, tombol, pilihan periode, dan toast. Tanpa latar berwarna, tanpa bayangan, garis tabel 0,5pt hitam. Baris tabel tidak terpotong antar halaman (`break-inside: avoid`), header tabel berulang di setiap halaman.
- Urutan isi cetak: nama toko (Young Serif 22pt), judul "Laporan penjualan", periode, tanggal cetak (WIB), tiga angka ringkasan dalam satu baris berbingkai (omzet, jumlah pesanan, rata-rata nilai pesanan), tabel per hari, 10 produk terlaris, rincian per kanal, dan catatan kaki "Dicetak dari dashboard Toko Daster". Grafik diganti tabel pada cetakan.

## 5. Admin: Akun
Tiga bagian bertumpuk: **Profil** (nama, email), **Ganti password** (password saat ini, password baru, ulangi), **Admin lain** (tabel nama, email, status; tombol tambah, nonaktifkan). Mengubah email atau password meminta password saat ini; galat validasi tampil di bawah isian.

## 6. Spesifikasi admin yang harus ditulis lengkap oleh UI/UX
`docs/design/admin-stok.md`, `admin-pesanan.md`, `admin-laporan.md`, `admin-pesan-masuk.md`, `admin-akun.md` sekarang hanya kerangka. Setiap berkas minimal memuat: tata letak (wireframe teks), kolom tabel, bentuk formulir, semua state (loading, kosong, galat, sukses), dialog konfirmasi, teks antarmuka, dan props yang dibutuhkan. Mengacu `design.md` bagian 8 dan 10, dan bagian 3 sampai 5 di dokumen ini.
