# PRD: Toko Daster (Tahap 1)

Versi 1.0 · Oktober 2026 · Sumber kebenaran untuk semua agent. Tampilan: lihat `design.md`.
Tanda `[ASUMSI]` = keputusan default dari penulis PRD, bukan fakta dari pemilik. Tanda `[CONTOH]` = isi pengganti yang harus diganti pemilik.

## 1. Ringkasan

Website toko daster dengan dua sisi:
- **Etalase publik** untuk pengunjung: landing page, daftar produk, detail produk, halaman kontak. Tanpa akun pembeli, tanpa keranjang, tanpa pembayaran online. Pengunjung memesan lewat WhatsApp.
- **Dashboard admin** untuk pemilik: kelola produk dan stok, mencatat pesanan, memantau penjualan, membaca pesan masuk, mengatur isi toko.

Alasan tanpa checkout online: tahap 1 fokus pada tampilan toko dan pengelolaan yang rapi. Pesanan yang masuk lewat WhatsApp dicatat admin agar stok dan laporan penjualan tetap benar.

## 2. Tujuan dan ukuran keberhasilan (target, bukan data terukur)

- Dari ponsel, pengunjung bisa membuka WhatsApp dengan pesan terisi (nama produk, ukuran, warna) dalam 3 ketukan dari halaman detail produk.
- Admin menambah satu produk lengkap (foto + 3 varian) dalam kurang dari 5 menit.
- Stok per varian akurat: tidak pernah negatif, setiap perubahan tercatat (siapa, kapan, alasan).
- Admin melihat omzet hari ini dan 30 hari terakhir tanpa membuka spreadsheet.
- Performa: LCP < 2,5 detik di 4G, Lighthouse mobile >= 85 untuk `/` dan `/product`.

## 3. Pengguna

| Peran | Kebutuhan |
|---|---|
| Pengunjung (publik) | Melihat produk, ukuran, harga; menghubungi toko; memesan lewat WhatsApp |
| Admin | Kelola produk, stok, pesanan, laporan, pengaturan toko |

Hanya satu peran login: `admin`. **Tidak ada pendaftaran publik**: rute `/register` tidak boleh ada (harus 404). Akun admin pertama dibuat seeder; admin lain dibuat oleh admin dari dashboard.

## 4. Cakupan

**Masuk Tahap 1:** landing `/`, `/product`, `/product/{slug}`, `/kontak-kami`, `/login`, logout, seluruh dashboard admin di bagian 6.

**Ditunda (jangan dikerjakan):** keranjang, checkout, pembayaran online, akun dan wishlist pembeli, ulasan, voucher, notifikasi otomatis (email/WhatsApp), lupa password lewat email, harga modal dan laba, ekspor Excel (CSV boleh), multi-gudang, aplikasi mobile.

## 5. Halaman publik

| Rute | Isi |
|---|---|
| `/` | Header, hero, produk unggulan, cara pesan, bahan dan perawatan, kontak ringkas, penutup ajakan, footer |
| `/product` | Daftar produk dengan pencarian, filter, urutan, pagination |
| `/product/{slug}` | Galeri, pilihan warna dan ukuran, harga, tombol Pesan via WhatsApp |
| `/kontak-kami` | Info toko, formulir pesan |
| `/login` | Masuk admin |
| `POST /logout` | Keluar |

### 5.1 Landing `/`
- Isi dibaca dari database (pengaturan toko dan produk), bukan ditulis mati di kode, kecuali teks tetap yang ditandai di `design.md`.
- Produk unggulan: 4 produk berstatus tayang dengan `unggulan = true`; jika kurang dari 4, lengkapi dengan produk tayang terbaru.
- Tombol WhatsApp memakai nomor dari pengaturan; jika nomor kosong, tombol disembunyikan.
- Bagian "Cara pesan" menjelaskan 3 langkah: pilih produk, kirim lewat WhatsApp, konfirmasi dan kirim.
- **AC:** halaman tampil tanpa error dengan data seeder; tidak ada teks "lorem ipsum"; responsif dari 360px; produk tanpa foto menampilkan placeholder, bukan gambar rusak.

### 5.2 Daftar produk `/product`
- Hanya produk berstatus `tayang`. 12 produk per halaman.
- Pencarian: nama produk, kategori, warna. Filter: kategori, ukuran, rentang harga, "hanya yang tersedia". Urutan: terbaru, harga naik, harga turun.
- Filter dan urutan disimpan di query string (URL bisa dibagikan, tombol kembali bekerja). Filter dikerjakan di server, bukan di browser atas daftar penuh.
- Kartu produk: foto 4:5, nama, harga (dan harga coret bila ada), ukuran tersedia. Produk yang semua variannya habis diberi label "Habis".
- **AC:** produk draf atau arsip tidak pernah tampil; hasil kosong menampilkan pesan dan tombol hapus filter; pindah halaman mempertahankan filter; loading menampilkan skeleton, dan kegagalan menampilkan pesan di dalam layout dengan tombol "Coba lagi".

### 5.3 Detail produk `/product/{slug}`
- Galeri: foto besar + thumbnail (maks 8), klik thumbnail mengganti foto utama.
- Pilihan warna (jika ada lebih dari satu) dan ukuran. Ukuran yang stoknya 0 dicoret dan tidak bisa dipilih. Stok varian terpilih ditampilkan; label "Sisa N" hanya jika stok <= stok minimum.
- Tombol "Pesan via WhatsApp" membuka `https://wa.me/<nomor>?text=<pesan>` berisi nama produk, warna, ukuran, dan tautan halaman. Tombol nonaktif sebelum ukuran dipilih, dan bertuliskan "Stok habis" bila varian habis.
- Slug tidak ada, atau produk draf/arsip: halaman 404 yang ramah.
- **AC:** tautan WhatsApp ter-encode benar (URL-encoded); mengganti warna mengganti ukuran yang tersedia; tidak ada rating atau ulasan palsu.

### 5.4 Kontak `/kontak-kami`
- Menampilkan alamat, jam buka, nomor WhatsApp, email, Instagram, tautan peta (dari pengaturan toko). Tidak menyematkan peta pihak ketiga; cukup tautan.
- Formulir: nama (wajib), kontak berupa email atau nomor HP (wajib), pesan (wajib, maks 1.000 karakter). Disimpan ke tabel `contact_messages`.
- Perlindungan spam: kolom jebakan (honeypot) tersembunyi dan batas 3 kiriman per 10 menit per IP.
- **AC:** validasi per kolom dengan pesan yang menjelaskan cara memperbaiki; setelah berhasil tampil pesan sukses dan formulir dikosongkan; kiriman muncul di dashboard Pesan masuk.

### 5.5 Login `/login` dan logout
- Email + password. Tanpa link daftar, tanpa "lupa password" di tahap 1.
- Salah email atau password: satu pesan umum ("Email atau password tidak cocok"), tidak membocorkan mana yang salah. Batas 5 percobaan per menit per kombinasi email+IP, lalu pesan tunggu.
- Berhasil: masuk ke `/admin`. Tamu yang membuka `/admin/*` diarahkan ke `/login`. Admin yang sudah masuk membuka `/login` diarahkan ke `/admin`.
- Logout memakai POST dengan CSRF, mengakhiri sesi, kembali ke `/login`.
- **AC:** tidak ada rute register; akun nonaktif tidak bisa masuk; sesi tidak bisa dipakai setelah logout (tombol kembali tidak membuka halaman admin).

## 6. Dashboard admin (`/admin/*`, wajib login)

| Rute | Modul |
|---|---|
| `/admin` | Dashboard |
| `/admin/produk` | Produk dan varian |
| `/admin/kategori` | Kategori |
| `/admin/stok` | Stok dan riwayat mutasi |
| `/admin/pesanan` | Pesanan (dicatat manual) |
| `/admin/pesan-masuk` | Pesan dari `/kontak-kami` |
| `/admin/laporan` | Laporan penjualan |
| `/admin/pengaturan` | Pengaturan toko |
| `/admin/akun` | Ganti password, kelola admin |

### 6.1 Dashboard (monitoring)
- Kartu: omzet hari ini, omzet bulan ini (dengan perbandingan persen terhadap bulan lalu), pesanan perlu diproses (status baru/dibayar/dikemas), varian stok menipis, pesan belum dibaca.
- Grafik omzet 30 hari terakhir; produk terlaris 30 hari (5 teratas); 5 pesanan terbaru; 5 varian stok menipis.
- **AC:** angka cocok dengan Laporan untuk periode yang sama; dengan database kosong semua kartu menampilkan 0 dan grafik menampilkan keadaan kosong, bukan error.

### 6.2 Produk dan varian
- Kolom produk: nama, slug (otomatis dari nama, unik, bisa diubah), kategori, deskripsi, bahan, perawatan, harga, harga coret (opsional, harus lebih besar dari harga), status (`draf`/`tayang`/`arsip`), unggulan (ya/tidak), foto.
- Foto: maks 8 per produk, jpg/png/webp, maks 2 MB per berkas, urutan dapat diubah, foto pertama jadi foto utama. Ekstensi dan isi berkas divalidasi di server.
- Varian: ukuran (pilihan: All Size, S, M, L, XL, Jumbo `[ASUMSI]`), warna/motif (teks), SKU (diusulkan otomatis, unik), harga varian (opsional; kosong berarti ikut harga produk), stok awal, stok minimum (default 3). Kombinasi produk+ukuran+warna harus unik.
- Draf boleh disimpan hanya dengan nama. Status `tayang` mensyaratkan: kategori, harga, minimal 1 foto, minimal 1 varian.
- Hapus = soft delete. Tabel: pencarian, filter status dan kategori, pagination 20, ubah status cepat.
- **AC:** produk tayang langsung muncul di `/product`; produk yang diarsipkan hilang dari publik tetapi riwayat pesanannya utuh; slug ganda ditolak dengan pesan yang jelas.

### 6.3 Kategori
- Tambah, ubah, hapus; bertingkat satu level (induk, anak). Hapus ditolak bila masih punya produk atau subkategori.
- Kategori awal `[CONTOH]`: Daster Rumahan, Daster Batik, Daster Kancing Depan, Daster Lengan Panjang.

### 6.4 Stok
- Daftar varian dengan stok; filter "menipis" (0 < stok <= stok minimum) dan "habis" (stok = 0).
- Penyesuaian cepat (+/-) dengan alasan: restock, koreksi, rusak/hilang. Riwayat mutasi per varian: waktu, jumlah, alasan, pelaku, pesanan terkait.
- **Semua perubahan stok lewat satu service** yang berjalan dalam transaksi database dengan row lock dan menulis ke `stock_movements`. Tidak ada kode lain yang mengubah kolom stok.
- **AC:** stok tidak pernah di bawah 0; dua penyesuaian bersamaan tidak membuat stok salah (diuji).

### 6.5 Pesanan (pencatatan manual)
- Admin membuat pesanan: nama pelanggan, nomor HP, alamat (opsional), kanal (`whatsapp`, `marketplace`, `langsung`), item (pilih varian, jumlah, harga satuan bawaan dari harga varian/produk dan bisa diubah), ongkir, diskon, catatan, tanggal pesanan (default sekarang, bisa diubah untuk mencatat pesanan lampau).
- Kode otomatis: `TD-YYMMDD-001` (nomor urut harian). Total dihitung di server, bukan dipercaya dari browser.
- Status: `baru` -> `dibayar` -> `dikemas` -> `dikirim` -> `selesai`. `batal` bisa dari status mana pun sebelum `selesai`. Nomor resi opsional.
- Nama produk, warna, ukuran, dan harga item disalin (snapshot) ke `order_items`; mengubah produk kemudian tidak mengubah pesanan lama.
- Stok berkurang saat pesanan dibuat dan dikembalikan saat pesanan dibatalkan `[ASUMSI]`. Stok tidak cukup: pesanan ditolak dengan pesan yang menyebut varian mana.
- Item hanya boleh diubah selama status `baru`. Daftar: filter status, kanal, rentang tanggal; cari kode atau nama; pagination 20.
- Cetak faktur sederhana (halaman cetak) `P1`.
- **AC:** membuat, mengubah status, dan membatalkan pesanan menghasilkan stok dan mutasi yang benar; omzet di dashboard ikut berubah.

### 6.6 Pesan masuk
- Daftar pesan dari `/kontak-kami`, penanda belum dibaca, tandai dibaca, hapus. Tombol "Balas via WhatsApp" bila kontak berupa nomor.

### 6.7 Laporan penjualan
- Periode: hari ini, 7 hari, 30 hari, bulan ini, rentang kustom.
- Ringkasan: total omzet, jumlah pesanan, rata-rata nilai pesanan. Rincian: per hari (tabel + grafik), per produk, per kategori, per kanal. Ekspor CSV `P1`.
- **Omzet** = jumlah `total` pesanan berstatus `dibayar`, `dikemas`, `dikirim`, `selesai` (bukan `baru`, bukan `batal`), berdasarkan tanggal pesanan.

### 6.8 Pengaturan toko
- Nama toko, tagline, nomor WhatsApp (format `62812...` tanpa `+` atau `0` di depan), email, alamat, jam buka, Instagram, tautan peta, judul dan subjudul hero landing, foto hero. Halaman publik membaca dari sini.

### 6.9 Akun
- Ganti password sendiri (password lama diminta). Tambah admin lain, nonaktifkan admin (tidak boleh menonaktifkan diri sendiri). Password minimal 10 karakter.

## 7. Alur utama

1. **Pengunjung memesan:** `/` atau `/product` -> detail produk -> pilih warna dan ukuran -> Pesan via WhatsApp -> chat dengan toko.
2. **Admin menambah produk:** Produk -> Tambah -> isi data -> unggah foto -> tambah varian -> status tayang -> cek di `/product`.
3. **Admin mencatat pesanan:** terima chat -> Pesanan -> Buat -> pilih varian dan jumlah -> simpan (stok berkurang) -> ubah status sampai selesai.
4. **Admin memantau:** buka Dashboard -> lihat omzet, stok menipis, pesan masuk -> buka Laporan untuk rincian.

## 8. Data

Nama tabel bahasa Inggris (jamak), nama kolom bahasa Indonesia. Uang = integer rupiah. Migrasi: satu migrasi per tabel, urutan induk sebelum anak, foreign key dengan `constrained()` dan tipe sama dengan kunci induk.

| Tabel | Kolom penting |
|---|---|
| `users` | id, nama, email (unik), password, aktif |
| `categories` | id, parent_id (nullable), nama, slug (unik) |
| `products` | id, category_id, nama, slug (unik), deskripsi, bahan, perawatan, harga, harga_coret (nullable), status, unggulan, deleted_at |
| `product_images` | id, product_id, path, urutan |
| `variants` | id, product_id, sku (unik), ukuran, warna, harga (nullable), stok, stok_minimum, deleted_at; unik (product_id, ukuran, warna) |
| `stock_movements` | id, variant_id, jumlah (+/-), alasan, order_id (nullable), user_id, catatan, created_at |
| `orders` | id, kode (unik), nama_pelanggan, no_hp, alamat (nullable), kanal, status, subtotal, ongkir, diskon, total, resi (nullable), catatan, dipesan_at, user_id |
| `order_items` | id, order_id, variant_id, nama, warna, ukuran, harga, qty (nama/warna/ukuran/harga adalah snapshot) |
| `contact_messages` | id, nama, kontak, pesan, dibaca_at (nullable), ip, created_at |
| `settings` | key (unik), value |

Aksi foreign key: `restrict` untuk riwayat (`order_items`, `stock_movements`, `variants`), `nullOnDelete` untuk relasi opsional.

## 9. Teknis

- **Stack:** Laravel (versi stabil terbaru yang tersedia), Inertia.js + React, Tailwind CSS, MySQL. Pustaka: Recharts (grafik), React Hook Form + Zod (formulir), TanStack Table (tabel admin). Tidak memakai kit komponen UI yang tampilannya bawaan (mis. gaya default shadcn atau Breeze); gaya mengikuti `design.md`. Komponen headless (Radix/Headless UI) boleh.
- **Database:** MySQL, nama database **`toko-daster`**. Tidak memakai SQLite.
- **Inertia, bukan API:** halaman menerima data sebagai props dari controller (`routes/web.php`). Tidak ada endpoint `/api` untuk halaman di tahap 1. Nama key props bahasa Indonesia snake_case dan didokumentasikan di `docs/kontrak-props.md` oleh backend sebelum frontend memakainya.
- **Starter kit:** jika Laravel menyediakan starter kit React + Inertia pada versi yang terpasang, boleh dipakai sebagai dasar scaffolding, dengan syarat: hapus pendaftaran (register), hapus halaman dan komponen bawaan yang tidak dipakai, dan jangan mempertahankan tampilan bawaannya. Jika tidak ada, pasang `inertiajs/inertia-laravel` dan `@inertiajs/react` secara manual.
- **Penyimpanan foto:** disk `public` + `storage:link`; simpan berkas asli dan thumbnail 480px `P1`; versi WebP `P1`.
- **Keamanan:** CSRF, validasi di server untuk semua input, query lewat ORM/terparameterisasi, password di-hash, pembatasan laju (login, kontak), otorisasi di setiap rute admin, jangan ada data sensitif di props atau log.
- **Zona waktu:** `Asia/Jakarta` (atur di `config/app.php`), bahasa antarmuka Indonesia.
- **Folder project:** `C:/Users/LENOVO/Downloads/toko-daster`. Folder ini sudah berisi `docs/`, jadi **bukan kosong**: `composer create-project` menolak folder yang tidak kosong. Pasang Laravel ke folder sementara `_laravel_tmp`, pindahkan seluruh isinya (termasuk berkas berawalan titik) ke root tanpa menimpa `docs/`, lalu hapus `_laravel_tmp`.

## 10. Non-fungsional

| Aspek | Syarat |
|---|---|
| Performa | LCP < 2,5 dtk di 4G; Lighthouse mobile >= 85 (`/`, `/product`); gambar `loading="lazy"` kecuali yang di layar pertama |
| Responsif | Mulai 360px; dashboard nyaman di tablet |
| Aksesibilitas | WCAG AA, semua kontrol bisa dioperasikan dengan keyboard, label pada formulir, teks alternatif gambar |
| SEO dasar | `<title>` dan meta deskripsi per halaman, URL ramah (`/product/{slug}`), satu `<h1>` per halaman; sitemap `P1` |
| Keandalan | Perubahan stok dalam transaksi; state loading, kosong, error, sukses di setiap halaman |

## 11. Data contoh (seeder, hanya untuk environment lokal)

- 4 kategori, 8 produk `[CONTOH]` (campuran tayang dan 1 draf), masing-masing 2 sampai 4 varian dengan stok bervariasi (termasuk satu yang menipis dan satu yang habis), 3 sampai 4 foto.
- 12 pesanan contoh dengan tanggal tersebar 30 hari terakhir dan status beragam, agar dashboard dan laporan punya data.
- Pengaturan toko berisi teks `[CONTOH]`.
- Satu akun admin untuk pengembangan lokal. Email dan password awal ditulis di `docs/akun-dev.md` (hanya lokal, wajib diganti sebelum dipakai sungguhan).
- Foto contoh dibuat oleh seeder sebagai berkas **lokal** (blok warna datar dari token `design.md` dengan tulisan "[CONTOH]"). Tidak ada tautan gambar dari internet.
- Seeder idempoten (aman dijalankan ulang tanpa data ganda).

## 12. Aturan kerja tim agent (WAJIB, berlaku untuk semua agent)

Aturan ini lahir dari kesalahan di proyek sebelumnya. Melanggarnya merusak pekerjaan pemilik.

1. **`.env` milik pemilik.** Jangan membaca, menulis, mengedit, menimpa, menyalin, mengganti nama, atau menduplikasi `.env`. Jangan membuat berkas `.env.*` apa pun (`.env.new`, `.env.backup`, `.env.testing`, dst.). Hanya `.env.example` yang boleh diubah. Jangan menjalankan `key:generate`, `config:cache`, `config:show`, `env:encrypt/decrypt`, `printenv`, atau perintah yang menampilkan atau menulis konfigurasi lingkungan. Satu-satunya pengecualian: `.env` yang dibuat otomatis oleh installer Laravel saat pemasangan awal; setelah itu tidak disentuh lagi. Butuh nilai baru di `.env`? Tulis sebagai langkah untuk pemilik di `docs/langkah-pemilik.md`, jangan dikerjakan sendiri.
2. **Tidak ada skill.** Kolom `skills` pada `kanban_create` selalu dikosongkan. Jangan membuat skill baru. Tidak ada skill khusus proyek ini.
3. **Workspace.** Semua kartu memakai `workspace_kind='dir'` dan `workspace_path='C:/Users/LENOVO/Downloads/toko-daster'` (garis miring biasa, folder `LENOVO` wajib ada). Bukan `scratch`, bukan worktree. Setelah membuat kartu, cek dengan `kanban_show` bahwa path-nya persis sama.
4. **Tech Lead hanya menulis di `docs/` dan membuat kartu.** Tidak mengubah kode, tidak menjalankan perintah yang mengubah database, tidak membuka `.env`.
5. **Kartu.** `kanban_list` dulu; satu tugas satu kartu; jangan duplikat. Body kartu pendek dan merujuk berkas di `docs/` (konteks yang terlalu panjang membuat worker crash). Assignee yang valid, persis: `uiux`, `backenddeveloper`, `frontenddeveloper`, `qatesting`, `devops`, `techlead`. Hanya Tech Lead yang membuat kartu rencana; worker lain hanya membuat kartu untuk bug yang belum punya kartu.
6. **Kapan boleh `kanban_block`:** (a) langkah yang memang harus dikerjakan manusia dan tertulis di kartu, (b) keputusan bisnis yang tidak bisa diturunkan dari `PRD.md` atau `design.md`, (c) `php`, `composer`, atau `node` tidak ditemukan. Selain itu: ambil asumsi, catat di `docs/asumsi.md` (tambahkan di akhir), lanjut bekerja. Temuan bug adalah laporan bug, bukan alasan memblokir.
7. **Lingkup.** Kerjakan hanya isi kartu. Jangan "melanjutkan setup proyek". Temuan di luar lingkup dicatat di `docs/catatan-<peran>.md`.
8. **Mengedit berkas (Windows).** Tulis ulang berkas utuh dengan `write_file`. Jika satu edit gagal dua kali, berhenti dan catat; jangan mengulang sampai jatah iterasi habis. Batasi keluaran perintah (`head`/`tail`); keluaran panjang disimpan ke berkas di `docs/` dan dibaca sebagian.
9. **Server dan database.** Server pengembangan (`php artisan serve`, `npm run dev`) dijalankan pemilik; agent tidak menyalakannya (port 8000 bentrok). `npm run build` boleh untuk verifikasi. Database hanya MySQL `toko-daster` lokal; tidak SQLite, tidak database lain. `migrate` dan `db:seed` hanya oleh `backenddeveloper` dan `devops`, hanya setelah langkah pemilik di kartu Setup selesai.
10. **Tidak ada `/api` untuk halaman.** Data halaman lewat props Inertia.
11. **Tanpa gambar dari internet.** Foto contoh dibuat lokal oleh seeder. Jangan menautkan foto stok.
12. **Git.** `devops` menjalankan `git init`, membuat `.gitignore` (mencakup `.env`, `.env.*`, `!.env.example`, `vendor`, `node_modules`) dan commit awal. Setiap kartu yang selesai di-commit dengan pesan `<id kartu>: ringkasan` bila git tersedia. Jangan pernah menambahkan `.env` ke git.
13. **QA** menguji lewat HTTP ke `http://127.0.0.1:8000` (server milik pemilik), tidak mengubah kode, dan menulis "Belum diuji" untuk hal yang tidak dijalankan atau butuh browser. Jangan menulis "lulus" untuk tes yang tidak dijalankan.
14. **Isi contoh** ditandai `[CONTOH]`. Jangan mengarang fakta toko (alamat, nomor, klaim bahan, testimoni).
15. **Jujur.** Tulis "belum dicek" bila tidak diperiksa. Jangan menyatakan selesai bila aplikasi tidak bisa dijalankan.

## 13. Urutan kerja yang disarankan (graf kartu)

Tech Lead boleh menyesuaikan, tetapi dependensi tidak boleh dibalik.

| Kode | Peran | Kartu | Parent |
|---|---|---|---|
| K1 | devops | Setup: pasang Laravel + Inertia + React + Tailwind, git, `.env.example`, `docs/langkah-pemilik.md`, lalu **titik berhenti untuk pemilik** (lihat 13.1) | - |
| K2 | uiux | Spesifikasi layar dari `design.md` ke `docs/design/*.md` (setiap halaman: tata letak, semua state, microcopy, props yang dibutuhkan) | - |
| K3 | backenddeveloper | Skema, migrasi, seeder, autentikasi (tanpa register), `docs/kontrak-props.md` bagian auth | K1 |
| K4 | backenddeveloper | Katalog publik: landing, `/product`, detail, `/kontak-kami` (props + simpan pesan) | K3 |
| K5 | backenddeveloper | Admin produk, varian, kategori, foto | K3 |
| K6 | backenddeveloper | Admin stok (service stok) dan pesanan | K5 |
| K7 | backenddeveloper | Admin dashboard, laporan, pesan masuk, pengaturan, akun | K6 |
| K8 | frontenddeveloper | Fondasi: token desain, font, tata letak publik dan admin, komponen dasar | K1, K2 |
| K9 | frontenddeveloper | Halaman publik (landing, produk, detail, kontak) | K8, K4 |
| K10 | frontenddeveloper | Login dan kerangka admin | K8, K3 |
| K11 | frontenddeveloper | Admin produk dan kategori | K10, K5 |
| K12 | frontenddeveloper | Admin stok dan pesanan | K10, K6 |
| K13 | frontenddeveloper | Admin dashboard, laporan, pesan masuk, pengaturan, akun | K10, K7 |
| K14 | qatesting | Test plan dan matriks risiko | K2, K3 |
| K15 | qatesting | Eksekusi pengujian dan laporan Go/No-Go | K9, K11, K12, K13 |
| K16 | techlead | Review akhir | K15 |

### 13.1 Titik berhenti pemilik di K1
Setelah scaffolding selesai, `devops` menulis `docs/langkah-pemilik.md` berisi: baris `.env` yang harus pemilik isi (`DB_CONNECTION=mysql`, `DB_HOST=127.0.0.1`, `DB_PORT=3306`, `DB_DATABASE=toko-daster`, `DB_USERNAME`, `DB_PASSWORD`, `APP_URL`), cara membuat database `toko-daster` (collation `utf8mb4_unicode_ci`), dan cara menyalakan server. Lalu `devops` memanggil `kanban_block` dengan satu kalimat: "Menunggu pemilik mengisi .env dan membuat database. Balas 'sudah' lalu Unblock." Setelah di-unblock, `devops` hanya memverifikasi bahwa `php artisan migrate:status` bisa terhubung ke database, lalu menyelesaikan kartu. Ini satu-satunya blokir terencana.

## 14. Asumsi dan pertanyaan untuk pemilik

| ID | Asumsi | Perlu konfirmasi |
|---|---|---|
| A1 | Tanpa keranjang/checkout; pesan lewat WhatsApp, pesanan dicatat manual | Ya |
| A2 | Satu peran `admin`; tanpa lupa password di tahap 1 | Ya |
| A3 | Ukuran: All Size, S, M, L, XL, Jumbo | Ya |
| A4 | Stok berkurang saat pesanan dibuat, kembali saat batal | Ya |
| A5 | Kanal pesanan: whatsapp, marketplace, langsung | Ya |
| A6 | Omzet dihitung dari status dibayar sampai selesai | Ya |
| A7 | Brand/logo belum ada: gunakan teks "Daster" sebagai logo sementara | Ya |
| A8 | Foto produk asli, nama toko, alamat, nomor WhatsApp, dan teks hero diisi pemilik lewat Pengaturan setelah sistem jadi | - |
