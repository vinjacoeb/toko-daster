# PRD v1.1: Addendum Tahap 1 (Toko Daster)

Berlaku bersama `PRD.md`. Jika bertentangan, bagian di dokumen ini yang menang. Tampilan: `design.md` dan `design-v1.1.md`. Nama tabel dan kolom: `docs/db.md` adalah acuan (bukan PRD atau kontrak-props bila berbeda).
Tanda `[ASUMSI]` = keputusan default penulis, belum dikonfirmasi pemilik. `[CONTOH]` = isi pengganti.

## 1. Konteks dan tujuan
Ini **lanjutan Tahap 1**, bukan tahap baru. Kerangka, login (sudah terhubung ke tabel `users` database `toko-daster`), header, dan footer sudah ada. Isi halaman masih placeholder dan sebagian halaman error. Tujuan v1.1:
1. Semua halaman publik dan admin terbuka tanpa error dan berisi data dari database.
2. Pengaturan tampilan web (carousel, FAQ, logo, dan lainnya) dapat diatur dari `/admin/pengaturan`.
3. Laporan penjualan dapat dicetak.

## 2. Penegasan dan perubahan terhadap PRD.md
| Bagian | Keputusan |
|---|---|
| 6.4 Stok (`/admin/stok`) | Tetap: daftar varian, penyesuaian +/- dengan alasan, riwayat mutasi. Stok melekat pada varian, jadi tambah dan hapus varian dilakukan di halaman produk, bukan di halaman stok |
| 6.5 Pesanan (`/admin/pesanan`) | Tetap: buat, lihat, ubah status, batal. "Hapus" diwujudkan sebagai **Batal** (riwayat penjualan tidak dihapus permanen). Item hanya diubah saat status `baru`; data pelanggan, ongkir, resi, dan catatan boleh diubah sampai status `dikirim` |
| 6.7 Laporan | Tambah **Cetak** (P0, lihat bagian 5). Ekspor CSV tetap P1 |
| 6.8 Pengaturan | **Diganti** bagian 3 dokumen ini |
| 6.9 Akun | Tambah: ubah nama dan email sendiri (email unik; mengubah email meminta password saat ini). Ganti password dan kelola admin tetap |
| Warna dan font | Tidak bisa diatur dari admin (dikunci di `design.md`) |

## 3. Pengaturan tampilan web (`/admin/pengaturan`)
Satu halaman dengan tab. Data dibaca halaman publik lewat props Inertia (tanpa endpoint baru). Hanya admin.

### 3.1 Tab dan isi
| Tab | Isi |
|---|---|
| Identitas | Nama toko, tagline, **logo** (png/jpg/webp, maks 2 MB; tanpa SVG), favicon (png, maks 512 KB). Tanpa logo: tampil wordmark teks "Daster" |
| Kontak | Nomor WhatsApp (format `62812...`), email, alamat, jam buka, Instagram, tautan peta, tautan marketplace (Shopee, Tokopedia, TikTok Shop; opsional) |
| Beranda | **Carousel hero** (maks 5 slide), 3 butir "Kenapa daster ini", 3 langkah "Cara pesan", judul dan teks tombol blok penutup, judul dan subjudul hero cadangan |
| FAQ | Daftar tanya-jawab: pertanyaan, jawaban, urutan, aktif atau tidak |
| Pesan WhatsApp | Templat pesan bawaan dengan variabel `{produk}`, `{ukuran}`, `{warna}`, `{tautan}` |
| SEO dan footer | Judul situs, deskripsi situs, gambar untuk dibagikan, teks footer. Tahun hak cipta otomatis |
| Banner (P1) | Satu baris pengumuman di atas header: teks, tautan, aktif atau tidak |

### 3.2 Data
- Tabel baru `hero_slides`: id, judul, subjudul (nullable), teks_tombol (nullable), tautan (nullable), foto_path, urutan, aktif (boolean), timestamps.
- Tabel baru `faqs`: id, pertanyaan, jawaban, urutan, aktif (boolean), timestamps.
- Tabel `settings` (key, value) menyimpan sisanya. Kunci: `nama_toko`, `tagline`, `logo_path`, `favicon_path`, `whatsapp`, `email`, `alamat`, `jam_buka`, `instagram`, `peta_url`, `shopee_url`, `tokopedia_url`, `tiktokshop_url`, `hero_judul`, `hero_subjudul`, `beranda_keunggulan` (JSON, 3 butir {judul, isi}), `beranda_cara_pesan` (JSON, 3 langkah {judul, isi}), `penutup_judul`, `penutup_tombol`, `wa_templat`, `situs_judul`, `situs_deskripsi`, `og_image_path`, `footer_teks`, `banner_aktif`, `banner_teks`, `banner_tautan`. Nama kolom tabel lain mengikuti `docs/db.md`.
- Migrasi baru satu per tabel, memakai `php artisan migrate` (bukan `migrate:fresh`). Seeder pengaturan idempoten, berisi isi awal `[CONTOH]` agar halaman publik tidak kosong.

### 3.3 Aturan
- **Carousel:** maks 5 slide aktif; tanpa autoplay; tombol sebelumnya dan berikutnya, titik penunjuk, geser di ponsel. Tanpa slide aktif: pakai `hero_judul`, `hero_subjudul`, dan foto placeholder. Foto jpg/png/webp maks 2 MB, disarankan rasio 4:5.
- **Tautan** (slide dan marketplace): hanya jalur relatif (diawali `/`) atau `https://`. Tolak `javascript:` dan skema lain.
- **Teks** (FAQ, keunggulan, pesan) disimpan dan ditampilkan sebagai teks biasa (di-escape), tanpa HTML. Baris baru dipertahankan.
- **Unggahan:** tipe dan ukuran divalidasi di server, nama berkas dibuat sendiri, simpan di disk `public`. Mengganti logo atau foto slide menghapus berkas lama.
- **Templat WhatsApp:** maks 500 karakter; variabel yang tidak dikenal dibiarkan apa adanya; pratinjau di halaman. Frontend mengganti variabel lalu meng-encode URL.
- **FAQ:** landing menampilkan 5 aktif teratas, `/kontak-kami` menampilkan semua yang aktif. Urutan diubah dengan tombol naik-turun.
- **AC:** menyimpan satu tab tidak mengubah tab lain; perubahan langsung terlihat di halaman publik setelah muat ulang; unggahan tidak valid ditolak dengan pesan yang menjelaskan cara memperbaiki; tamu yang membuka `/admin/pengaturan` diarahkan ke `/login`.

## 4. Kelengkapan halaman
**Definition of Done semua halaman:** data dari database lewat props Inertia; tidak ada teks placeholder atau data yang ditulis mati di kode (kecuali teks bawaan berlabel `[CONTOH]`); semua state (loading, kosong, galat, sukses); validasi server dengan pesan jelas; tanpa galat di konsol; `npm run build` berhasil; responsif 360px (admin nyaman mulai 768px); sesuai `design.md` dan `docs/design/<halaman>.md`; tamu yang membuka `/admin/*` diarahkan ke `/login`.

| Halaman | Wajib ada |
|---|---|
| `/` | Hero (carousel setelah gelombang 4), produk pilihan dari database, keunggulan, cara pesan, FAQ (gelombang 4), penutup, footer dinamis |
| `/product` | Pencarian, filter, urutan, pagination 12, kartu produk, label Habis |
| `/product/{slug}` | Galeri, pilihan warna dan ukuran, tautan WhatsApp, 404 untuk draf dan arsip |
| `/kontak-kami` | Info toko, formulir (honeypot, batas laju), FAQ (gelombang 4) |
| `/login` | Sudah benar; jangan diubah |
| `/admin` | Kartu omzet dan pesanan, grafik 30 hari, terlaris, pesanan terbaru, stok menipis, pesan belum dibaca |
| `/admin/produk` | Tabel dan filter, buat dan ubah (foto, varian), ubah status cepat, hapus (soft delete) |
| `/admin/kategori` | Tambah, ubah, hapus (ditolak bila masih dipakai) |
| `/admin/stok` | Daftar varian, penyesuaian, riwayat mutasi, filter menipis dan habis |
| `/admin/pesanan` | Daftar dan filter, buat, detail, ubah status, batal |
| `/admin/laporan` | Periode, ringkasan, rincian, **Cetak**, CSV (P1) |
| `/admin/pesan-masuk` | Daftar, tandai dibaca, hapus, balas via WhatsApp |
| `/admin/pengaturan` | Bagian 3 |
| `/admin/akun` | Profil, ganti password, kelola admin |

## 5. Cetak laporan
Tombol "Cetak" memanggil `window.print()` dengan stylesheet cetak (A4 potret, bisa disimpan sebagai PDF dari browser). Isi cetak: nama toko, judul, periode, tanggal cetak (WIB), tiga angka ringkasan, tabel per hari, 10 produk terlaris, rincian per kanal. Tanpa sidebar, tombol, dan latar berwarna. Rincian visual di `design-v1.1.md`.

## 6. Gelombang kerja dan graf kartu
Satu gelombang selesai dulu (dengan uji pemilik) sebelum gelombang berikutnya. Kartu `GT` adalah gerbang: Tech Lead memanggil `kanban_block` dan menunggu pemilik menguji lalu Unblock. Kartu gelombang berikutnya memiliki parent gerbang, jadi tidak berjalan sebelum pemilik membuka gerbangnya. Kartu di dalam satu gelombang berantai agar tidak ada dua agent mengedit berkas bersama (`routes/web.php`, `app.jsx`, layout, `DatabaseSeeder`) bersamaan.

| Kode | Peran | Kartu | Parent |
|---|---|---|---|
| A0 | qatesting | Debug putaran 1: seluruh halaman publik dan admin (aturan bagian 7) | - |
| A1 | uiux | Lengkapi spesifikasi admin yang masih kerangka: stok, pesanan, laporan (termasuk cetak), pesan masuk, akun | - |
| A2 | uiux | Spesifikasi pengaturan (tab), carousel, FAQ (publik dan admin) dari `design-v1.1.md` | A1 |
| GT0 | techlead | Gerbang 0 | A0, A2 |
| B1 | backenddeveloper | Props halaman publik lengkap: landing, produk, detail, simpan pesan kontak | GT0 |
| F1 | frontenddeveloper | Landing `/` | B1 |
| F2 | frontenddeveloper | `/product` dan `/product/{slug}` | F1 |
| F3 | frontenddeveloper | `/kontak-kami` | F2 |
| Q1 | qatesting | Debug gelombang 1 | F3 |
| GT1 | techlead | Gerbang 1 | Q1 |
| B2 | backenddeveloper | Admin produk, varian, foto, kategori | GT1 |
| B3 | backenddeveloper | Admin stok (service stok, riwayat) | B2 |
| F4 | frontenddeveloper | Admin produk dan kategori | B2 |
| F5 | frontenddeveloper | Admin stok | B3, F4 |
| Q2 | qatesting | Debug gelombang 2 | F5 |
| GT2 | techlead | Gerbang 2 | Q2 |
| B4 | backenddeveloper | Admin pesanan | GT2 |
| B5 | backenddeveloper | Dashboard, laporan (data, cetak, CSV), pesan masuk | B4 |
| F6 | frontenddeveloper | Admin pesanan | B4 |
| F7 | frontenddeveloper | Dashboard, laporan (tampilan cetak), pesan masuk | B5, F6 |
| Q3 | qatesting | Debug gelombang 3 | F7 |
| GT3 | techlead | Gerbang 3 | Q3 |
| B6 | backenddeveloper | Pengaturan (tabel baru, unggahan) dan akun | GT3 |
| F8 | frontenddeveloper | Admin pengaturan (semua tab) dan akun | B6 |
| F9 | frontenddeveloper | Carousel hero, FAQ di landing dan kontak, logo dan footer dinamis | F8 |
| Q4 | qatesting | Debug gelombang 4 | F9 |
| GT4 | techlead | Gerbang akhir | Q4 |

Kartu UI/UX tidak ada di gelombang 1 sampai 4 karena spesifikasinya selesai di A1 dan A2. Frontend yang menemukan spesifikasi kurang menulis kanban_comment di kartu terkait, bukan mengarang.

## 7. Aturan debugging QA (disalin ke body setiap kartu QA)
1. QA **tidak mengubah kode**; hanya menulis di `docs/`. Tidak menyalakan server, tidak menyentuh `.env`, tidak menjalankan npm, composer, atau artisan.
2. Catat: untuk setiap halaman atau modul bermasalah, ambil bukti lewat HTTP ke server milik pemilik (Laravel `http://127.0.0.1:8000`, Vite port 5173), baca pesan galat, dan tulis satu baris di `docs/qa-gelombang-N.md`: halaman, status, pesan inti, berkas dan baris sumber, jenis penyebab.
3. Kelompokkan per **akar masalah**: satu penyebab bersama banyak halaman = satu kelompok.
4. Buat kartu perbaikan per kelompok untuk agent yang relevan (frontend, backend, atau devops), satu masalah satu kartu: `kanban_list` dulu, body maks 8 baris merujuk `docs/qa-gelombang-N.md`, workspace dan skills sesuai aturan.
5. Buat satu kartu "QA: verifikasi ulang" (qatesting) dengan parent = semua kartu perbaikan tadi. Verifikasi ulang mengulang pengecekan dan memperbarui dokumen.
6. Maksimal 2 putaran per akar masalah. Setelah putaran kedua masih gagal: `kanban_block` dengan bukti, dugaan penyebab, dan satu pertanyaan ke pemilik beserta rekomendasi.
7. Yang butuh browser (tampilan, responsif, interaksi) ditulis "Belum diuji, butuh browser". Jangan menulis "web sudah terbuka" tanpa bukti HTTP. Pemilik yang mengonfirmasi di gerbang.
8. Selesaikan kartu dengan `kanban_complete`: temuan, ID kartu yang dibuat, keputusan Go atau No-Go.

## 8. Aturan kerja tambahan (selain PRD.md bagian 12)
1. Nama komponen Inertia = jalur relatif dari `resources/js/Pages` tanpa `.jsx`, huruf besar-kecil persis (contoh `Admin/Dashboard`).
2. Nama kolom dan tabel mengikuti `docs/db.md`. Jika berbeda dari kode atau kontrak, catat di `docs/catatan-<peran>.md`; jangan mengubah migrasi lama.
3. Satu kartu = satu halaman atau satu modul. Jangan mengerjakan halaman lain.
4. Jangan membaca `docs/arsip/` kecuali kartu menyebutnya.
5. Impor komponen: pakai ekspor yang benar-benar ada (default atau named) dan nama folder yang sama persis. `app.jsx` memakai `import.meta.glob` tanpa `eager` agar galat satu halaman tidak mematikan situs.
6. `php artisan migrate` (tanpa `fresh`) boleh untuk migrasi baru oleh backenddeveloper; `migrate:fresh` hanya atas izin tertulis di komentar kartu.
7. Kartu baru yang dibuat worker: hanya bug milik agent lain yang belum punya kartu; satu masalah satu kartu.

## 9. Asumsi v1.1
| ID | Asumsi |
|---|---|
| A9 | Stok dan pesanan tidak memiliki hapus bebas (batal saja), logo tanpa SVG (risiko skrip), carousel tanpa autoplay dan maks 5 slide |
| A10 | FAQ tampil di landing (5 teratas) dan `/kontak-kami` (semua aktif) |
| A11 | Warna dan font tidak dapat diubah dari admin |
| A12 | Banner pengumuman P1; CSV laporan P1; cetak faktur pesanan P1 |
| A13 | Akhir tiap gelombang diuji pemilik di browser sebelum gerbang dibuka |
