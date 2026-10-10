# Spesifikasi Layar: Pengaturan (/admin/pengaturan) + Carousel & FAQ Publik

Kartu: t_69930c51 (A2). Sumber: PRD-v1.1 bagian 3, design-v1.1 bagian 1-3,
design.md bagian 4, 8, 10-13, PRD bagian 5-6. Menggantikan kerangka lama di berkas ini.

## 1. Tujuan & Cakupan

Halaman `/admin/pengaturan` adalah satu-satunya tempat admin mengatur
tampilan web: identitas toko, kontak, carousel hero beranda, keunggulan,
cara pesan, FAQ, templat WhatsApp, SEO/footer, dan banner (P1).
Halaman publik membaca semuanya lewat props Inertia; tidak ada endpoint
`/api` baru (PRD-v1.1 bagian 3, PRD bagian 9/12).

Berkas ini juga menspesifikasikan dampak publik yang dikerjakan
frontend di F9: carousel hero di `/`, FAQ di `/` dan `/kontak-kami`,
serta logo/footer/SEO dinamis. Backend terkait B6 (admin) dan B1 (publik).

## 2. Entry & Exit

- Entry: sidebar admin -> Pengaturan; deep link `/admin/pengaturan`
  (tab lewat query `?tab=beranda`, default `identitas`). Tamu ke `/login`.
- Exit: halaman terminal. Perubahan terlihat di publik setelah muat ulang.

## 3. Arsitektur Informasi: 7 Tab

Urutan tab (design-v1.1 bag 3): Identitas, Kontak, Beranda, FAQ,
Pesan WhatsApp, SEO dan footer, Banner.

- Setiap tab adalah formulir sendiri dengan tombol "Simpan perubahan"
  di bawah (lengket di ponsel). Menyimpan satu tab tidak mengirim tab lain.
- Tab kotor + pindah tab -> dialog "Buang perubahan?" (bag 6.4).
- Label tab kotor: titik 8px `--kunyit` + aria-label ada perubahan.
- Ponsel: baris tab geser horizontal, target sentuh tetap 44px.

## 4. Layout Admin

Konten `--kapas` maks 1280px, kartu putih garis 1px `--garis` radius 4px,
isi tab maks 800px rata kiri (konsisten A-A1-10 di admin-akun).
Sidebar 240px `--pandan-gelap`, bar atas 56px (design.md bag 10).

## 5. Perilaku per Tab

### 5.1 Identitas (?tab=identitas)

- Nama toko* (2-100), Tagline (maks 160).
- Logo: PNG/JPG/WebP maks 2 MB, tanpa SVG. Pratinjau 160x64 di atas
  latar `--kapas` DAN `--arang` berdampingan. Tombol "Pilih berkas" +
  "Hapus logo". Bantuan: "PNG, JPG, atau WebP, maks 2 MB."
- Favicon: PNG maks 512 KB + pratinjau 32px + "Hapus favicon".
- Hapus logo -> dialog "Hapus logo? Header kembali memakai tulisan
  Daster." Tanpa logo publik memakai wordmark teks "Daster".
- Ganti logo/favicon menghapus berkas lama di server.

### 5.2 Kontak (?tab=kontak)

- Nomor WhatsApp*: hanya angka, diawali 62, 10-15 digit.
  Placeholder [CONTOH] 6281234567890. Bantuan: "Tanpa +, tanpa 0."
- Email (opsional, format email), Alamat (textarea 3 baris, maks 500),
  Jam buka (maks 120, placeholder [CONTOH] Senin-Sabtu 08.00-17.00 WIB).
- Instagram: @handle atau URL https, selain itu ditolak.
- Tautan peta, Shopee, Tokopedia, TikTok Shop: opsional, aturan tautan
  bag 7. Bantuan marketplace: "Kosongkan bila tidak berjualan di sana."

### 5.3 Beranda (?tab=beranda)

Tiga blok: (a) Carousel hero, (b) Keunggulan + Cara pesan, (c) Penutup
+ Cadangan. Tombol "Simpan perubahan" menyimpan (b)+(c); (a) aksi per
baris langsung tersimpan dengan toast.

(a) Carousel hero - baris: thumbnail 64x80 4:5, judul (clamp 2 baris),
badge Aktif (pandan-muda+pandan-gelap) / Nonaktif (pasir+arang),
tombol ikon naik, turun, ubah, hapus (44px + tooltip + aria-label).
Naik nonaktif di urutan 1, Turun di terakhir. Tambah nonaktif saat
5 slide + catatan "Maksimal 5 slide" [ASUMSI A-A2-01: total 5 baris;
PRD menulis "5 aktif" - Tech Lead memutuskan bila berbeda].
Tambah/ubah membuka panel samping (bag 6.1): Foto* (PNG/JPG/WebP 2 MB,
disarankan 4:5), Judul* (maks 80), Subjudul (maks 200, 2 kalimat),
Teks tombol (maks 30; tampil hanya bila teks DAN tautan terisi),
Tautan (aturan bag 7), Urutan (baru = terakhir, read-only),
Aktif (checkbox). Hapus -> dialog 6.3. Hapus satu-satunya slide aktif
-> publik memakai cadangan (bag 9).

(b) Keunggulan 1-3 {judul* maks 40, isi* maks 200} + Langkah 1-3
{judul* maks 40, isi* maks 200}. Bantuan: "Daftar bernomor di landing.
Jangan menambah klaim bahan dari pemilik." Nilai awal [CONTOH] seeder.

(c) Judul blok penutup* (maks 80), Teks tombol penutup* (maks 30),
Judul hero cadangan* (maks 80; "Dipakai bila tidak ada slide aktif"),
Subjudul cadangan (maks 200).

### 5.4 FAQ (?tab=faq)

Info: "Landing menampilkan 5 aktif teratas. Kontak menampilkan semua
yang aktif. FAQ kosong: bagian disembunyikan di publik."
Baris: nomor, pertanyaan (truncate + title), badge Aktif/Nonaktif,
naik/turun/ubah/hapus. Tambah -> dialog (bag 6.2): Pertanyaan* (160),
Jawaban* (textarea 5 baris, maks 2000, newline dipertahankan, teks
biasa di-escape tanpa HTML), Aktif (default aktif). Hapus -> dialog.

### 5.5 Pesan WhatsApp (?tab=pesan-wa)

- Templat*: textarea 5 baris, maks 500 + penghitung "123 / 500".
  Variabel {produk} {ukuran} {warna} {tautan}. Bantuan: "Variabel yang
  tidak dikenal dibiarkan apa adanya."
- 4 chip variabel + tombol "Salin" (toast "Disalin.").
- Pratinjau gelembung chat dengan contoh [CONTOH] Daster Batik Parang /
  M / Cokelat / tautan halaman + URL wa.me hasil encode (read-only,
  bisa disalin). Update tiap ketikan (debounce 300ms).
- Bawaan [CONTOH]: Halo, saya tertarik dengan {produk} ({warna},
  {ukuran}). Apakah masih tersedia? {tautan} [ASUMSI A-A2-07].

### 5.6 SEO dan footer (?tab=seo)

- Judul situs* (maks 60 + hitung; [CONTOH] Daster - Toko Daster Rumahan),
  Deskripsi* (textarea 3 baris, maks 160 + hitung).
- Gambar bagikan (opsional, PNG/JPG/WebP 2 MB; "Disarankan 1200x630",
  pratinjau 160x84), Teks footer (maks 300), Hak cipta read-only:
  "Tahun hak cipta terisi otomatis."

### 5.7 Banner (?tab=banner, P1)

- Aktif (switch, default mati), Teks (wajib bila aktif, maks 120),
  Tautan (opsional, aturan bag 7). Lencana "P1" + info: "Banner belum
  tampil di publik pada gelombang 4. Tersimpan dan siap dipakai nanti."

## 6. Panel & Dialog

### 6.1 Panel samping slide

Drawer kanan 440px (ponsel lembar bawah penuh). Judul "Tambah slide" /
"Ubah slide". [Batal] + [Simpan slide] ("Menyimpan…" saat kirim).
Sukses: tutup + toast "Slide disimpan." role=dialog, Esc, fokus kembali.

### 6.2 Dialog FAQ

Tengah maks 560px. "Tambah/Ubah pertanyaan", 3 isian, [Batal]+[Simpan].
Toast "Pertanyaan disimpan." Esc, fokus kembali, cegah double-submit.

### 6.3 Dialog hapus

"Hapus slide ini?" / "Hapus pertanyaan ini?" / "Hapus logo?" + dampak:
slide permanen hilang dari beranda bila aktif; pertanyaan hilang dari
publik; logo -> header kembali tulisan Daster. [Batal] fokus awal +
[Hapus] (garis+teks --cabai). Toast sesuai objek.

### 6.4 Dialog pindah tab kotor

"Pindah tab? Perubahan di tab {nama} belum disimpan." [Tetap di sini]
(utama) + [Buang perubahan]. Query ?tab= tidak diterapkan sebelum putus.

## 7. Validasi

Error di bawah isian (aria-describedby), garis --cabai. Pesan:
- Wajib kosong: "Kolom ini wajib diisi." / "Nama toko minimal 2 karakter."
- Tautan: "Tautan hanya boleh jalur relatif (/product) atau https://."
- Gambar: "Berkas harus PNG, JPG, atau WebP dan maksimal 2 MB."
- SVG: "SVG tidak diizinkan (risiko skrip). Pakai PNG, JPG, atau WebP."
- Favicon: "Favicon harus PNG maksimal 512 KB."
- WA: "Nomor WhatsApp harus diawali 62, hanya angka, 10-15 digit."
- Email: "Masukkan email yang valid."
- Instagram: "Isi dengan @namaakun atau tautan https://."
- Templat: "Templat maksimal 500 karakter."
- Judul/deskripsi: "Maksimal {n} karakter."
- Tombol timpang: info "Tombol tidak tampil karena tautan kosong."
  [ASUMSI A-A2-08], bukan galat blokir.
- Tamu -> /login. 419 -> /login + toast "Sesi berakhir. Masuk lagi."
- Double-submit dicegah; offline: input tidak hilang + "Gagal menyimpan.
  Periksa koneksi, coba lagi."

## 8. State Admin

Default terisi DB; Loading skeleton --pasir; Gagal "Data pengaturan
belum bisa dimuat. Coba lagi" + "Coba lagi"; Kotor titik kunyit;
Menyimpan "Menyimpan…"; Sukses toast "Pengaturan disimpan." (putih,
garis kiri 4px --pandan, 5 dtk); Galat alert --cabai-muda + error per
isian; Kosong slide "Belum ada slide. Tambahkan hingga 5 slide." /
FAQ "Belum ada pertanyaan. Tambahkan yang pertama."; Banner lencana P1.

## 9. Publik A: Carousel Hero di /

Menggantikan foto tunggal (design-v1.1 bag 1). Teks 5 kolom, foto 7
kolom; ponsel teks dulu, foto, kontrol di bawah foto. Kontrol ‹ ›
44x44 (garis --arang, hover --pasir), "1 / 3" 14px --abu, titik 8px
(aktif --pandan, lain --garis, target 44px). Tanpa panah di foto.
Tanpa autoplay. Geser ponsel. Fade 200ms; tanpa gerak bila
prefers-reduced-motion. Satu slide: kontrol sembunyi. Tanpa slide
aktif: hero_judul + hero_subjudul + placeholder --pasir 4:5 "[CONTOH]
Foto belum tersedia" + jahitan. Foto 1 eager, lain lazy; gagal -> placeholder
(onerror). Tombol slide (teks+tautan): utama --pandan; relatif navigasi,
absolut tab baru rel=noopener [ASUMSI A-A2-09]. Akses: region +
aria-roledescription=carousel + label "Sorotan toko"; slide
aria-label "1 dari 3"; tombol "Slide sebelumnya/berikutnya"; teks
aria-live=polite. Galat muat -> render cadangan tanpa pesan teknis
[ASUMSI A-A2-10].

## 10. Publik B: FAQ Akordeon

Judul "Pertanyaan yang sering ditanyakan" (Young Serif 40). Landing:
judul 4 kolom kiri, daftar 8 kanan. /kontak-kami: bawah info+form,
penuh, satu jahitan di atas. Ponsel judul atas daftar. Baris: tombol
penuh min 56px, pertanyaan 18/600 --arang, panah kanan putar saat buka,
garis bawah --garis. Jawaban 16 --abu lh 1,6 jarak 16. Multi-buka boleh.
button + aria-expanded + aria-controls; teks pre-line di-escape.
Landing 5 aktif teratas; kontak semua aktif; kosong disembunyikan.

## 11. Publik C: Logo, Footer, WA, SEO

- logo_path ada -> img tinggi 32px maks 160px alt="Logo {toko}"; rusak ->
  fallback wordmark Daster (Young Serif 28 --pandan); tanpa logo langsung
  wordmark.
- Footer --arang/--kapas: toko (nama, alamat, jam), tautan (Produk,
  Kontak + marketplace terisi), kontak (WA, email, IG; kosong sembunyi).
  Hak cipta: "© {tahun} {toko}." + footer_teks.
- WA kosong -> semua CTA WA sembunyi (PRD 5.1). Format wa.me/<nomor> +
  ?text= encode dari templat.
- SEO: title situs_judul, meta situs_deskripsi, og:image bila ada.

## 12. Responsif

>=1024 konten 800; drawer 440; <768 tab geser-x, kartu padding 16,
Simpan lengket full-width 44, baris jadi kartu, drawer/dialog penuh,
carousel & FAQ menumpuk.

## 13. Microcopy

Judul "Pengaturan", sub "Atur identitas, tampilan beranda, dan pesan
toko." Tombol: Simpan perubahan, Menyimpan…, Tambah slide/pertanyaan,
Pilih berkas, Ganti, Hapus logo/favicon, Salin, Naik, Turun, Ubah,
Hapus, Batal, Tetap di sini, Buang perubahan, Coba lagi.
Toast: Pengaturan/Slide/Pertanyaan disimpan; Slide/Pertanyaan/Logo dihapus.
Cap: "Maksimal 5 slide". Banner: "P1 - belum tampil publik."

## 14. Edge Case

1. Hapus satu-satunya slide aktif -> publik cadangan + info admin.
2. Tombol timpang -> sembunyi + info, bukan galat.
3. javascript: ditolak + pesan bag 7.
4. Tepat 2 MB lolos; 2 MB+1 ditolak.
5. Ganti logo hapus lama; gagal -> lama tetap dipakai.
6. Templat tanpa variabel sah [ASUMSI A-A2-11].
7. Templat >500 ditolak dengan hitung, bukan potong diam.
8. Urutan bersamaan -> tulis terakhir (tanpa lock).
9. FAQ duplikat diizinkan.
10. Sesi habis -> /login; draf tidak bertahan (MVP).
11. Banner aktif tidak merusak publik (tidak dirender).

## 15. Aksesibilitas

Tablist/tab/tabpanel + aria-selected + panah pindah + ring 2px --pandan.
Label htmlFor/id, error aria-describedby, hitung aria-live polite.
Badge kata+warna AA. Dialog Esc + fokus kembali. Sentuh >=44px. Zoom
200% dan 360px tanpa potong. Carousel & akordeon ikut bag 9-10.

## 16. Props Inertia (usulan; kontrak final B6/B1)

pengaturan {nama_toko, tagline, logo_url, favicon_url, whatsapp, email,
alamat, jam_buka, instagram, peta_url, shopee_url, tokopedia_url,
tiktokshop_url, beranda_keunggulan[{judul,isi}], beranda_cara_pesan[{judul,isi}],
penutup_judul, penutup_tombol, hero_judul, hero_subjudul, wa_templat,
situs_judul, situs_deskripsi, og_image_url, footer_teks, banner_aktif,
banner_teks, banner_tautan}, hero_slides [{id, judul, subjudul,
teks_tombol, tautan, foto_url, urutan, aktif}], faqs [{id, pertanyaan,
jawaban, urutan, aktif}]. Key snake_case Indonesia. Aksi: PATCH per tab
(multipart bila berkas); CRUD slide/FAQ; naik/turun PATCH urutan.
Publik / butuh carousel aktif + 5 FAQ + pengaturan ringkas; kontak butuh
semua FAQ aktif + info toko. Validasi server semua bag 7; nama berkas
acak; disk public.

## 17. Self-Review

- [x] Sesuai PRD-v1.1 bag 3 + design-v1.1 bag 1-3.
- [x] Konsisten design.md (token, radius 4, badge kata+warna, skeleton,
  placeholder, microcopy ID).
- [x] Tanpa fitur terlarang MVP.
- [x] Semua state; tanpa jalan buntu; responsif 360/768/1024/1280.
- [x] Copy konkret; [CONTOH] untuk milik pemilik.
- [x] Aksesibilitas dasar; props jelas; asumsi A-A2-01..12 dicatat.
- [x] DoD: spesifikasi lengkap di path yang diminta.

## 18. Handoff

Frontend (F8/F9): TabPengaturan, FormIdentitas/Kontak/Beranda/Faq/
PesanWA+PratinjauWA/SEO/Banner, DaftarSlide, PanelSlide, DialogFaq,
CarouselHero, FaqAkordeon, Toast, DialogKonfirmasi, PenghitungKarakter.
Wajib: 7 tab + panel/dialog + semua state + carousel + akordeon +
logo/footer/WA/SEO. Aman disederhanakan: drawer jadi dialog; pratinjau
on-blur; titik tetap 44px. Aset dari disk public via props; placeholder
--pasir 4:5 tanpa internet.

Backend via Tech Lead (B6/B1): kunci settings PRD-v1.1 3.2; tabel baru
hero_slides, faqs; migrasi satu per tabel via migrate; seeder idempoten
[CONTOH]. Validasi bag 7; hapus berkas lama; allowlist tautan;
teks di-escape; tamu -> /login. Konflik: (1) cap slide total-5 vs
5-aktif (UI total-5, A-A2-01); (2) lanjutan A1: users tanpa kolom aktif
(kebutuhan B6). Konfirmasi: wa_templat bawaan (A-A2-07), tab baru
(A-A2-09), cadangan galat (A-A2-10).

QA: simpan bertahan reload; tab A tidak ubah B; galat di bawah isian;
slide ke-6 ditolak; naik puncak disabled; hapus satu-satunya -> cadangan;
>2MB/SVG/javascript: ditolak; FAQ landing<=5, kontak semua, kosong hilang;
carousel tanpa autoplay, 1 tanpa kontrol, keyboard penuh, reduced-motion
tanpa fade, lazy kecuali 1; WA kosong -> CTA hilang; logo hilang ->
wordmark; tahun berjalan; 4 breakpoint; keyboard-only dialog.

## 19. Asumsi

- A-A2-01: cap total 5 (vs "5 aktif"); tunggu Tech Lead.
- A-A2-02: (b)+(c) satu tombol; (a) aksi per baris.
- A-A2-03: WA wajib; seeder [CONTOH] valid.
- A-A2-04: IG @handle atau https (B6 normalisasi bila perlu).
- A-A2-05: urutan bersamaan tulis-terakhir.
- A-A2-06: kontak opsional kecuali WA.
- A-A2-07: wa_templat bawaan bag 5.5.
- A-A2-08: tombol timpang sembunyi + info.
- A-A2-09: absolut tab baru.
- A-A2-10: galat carousel -> cadangan.
- A-A2-11: templat tanpa variabel sah.
- A-A2-12: draf hilang saat sesi habis.
- docs/asumsi.md belum ada (temuan A1) - asumsi tinggal di berkas ini.

## 20. Usulan Luar Scope

Seret-urutkan, crop browser, autosave, pratinjau landing di admin,
multi-banner, riwayat revisi. Tidak MVP.

