# K14: Test plan dan matriks risiko

## 1. Pemahaman Fitur

**Tujuan**: Membuat test plan komprehensif dan matriks risiko untuk Toko Daster, menguji semua 14 rute publik dan admin.

**Rute yang Terdampak** (berdasarkan docs/design/*/*.md):
- **Publik**: `/` (landing), `/product` (daftar produk), `/product/{slug}` (detail produk), `/kontak-kami` (form kontak), `/login` (login admin)
- **Admin**: `/admin` (dashboard), `/admin/produk`, `/admin/kategori`, `/admin/stok`, `/admin/pesanan`, `/admin/pesan-masuk`, `/admin/laporan`, `/admin/pengaturan`, `/admin/akun`

**Scope MVP** (berdasarkan PRD Bagian 10, Ringkasan Tim):
- **Publik**: katalog, detail produk, kontak, login
- **Admin**: CRUD produk & stok, pesanan manual, laporan, pengaturan, manajemen akun
- **Di Luar Scope**: keranjang, checkout, akun pembeli, wishlist, ulasan, voucher, notifikasi, lupa password, multi-gudang, ekspor Excel, aplikasi mobile

**Sumber Kebenaran**:
1. **docs/design/*/*.md** - spesifikasi layar terperinci untuk 14 rute
2. **docs/db.md** - struktur database dan tabel yang relevan
3. **docs/kontrak-props.md** - kontrak API Inertia yang disetujui
4. **docs/ringkasan-tim.md** - aturan kerja dan batasan
5. **docs/pertanyaan-pemilik.md** - asumsi pemilik

**Kemampuan Environment**:
- Server Laravel: http://127.0.0.1:8000 (diasumsikan berjalan)
- Database: diasumsikan dimigrasi dan di-seed
- Workspace: C:/Users/LENOVO/Downloads/toko-daster

**Pengujian lewat HTTP**: Fokus pada rute yang sebenarnya ada, tidak ada asumsi endpoint `/api` publik.

## 2. Review Requirement dan Ketidaksinkronan

### 2.1 Persyaratan Utama per Rute

**Rute Publik**:
- `/`: Produk unggulan, CTA WhatsApp, bagian "Kenapa daster ini", "Cara pesan"
- `/product`: Pencarian, filter (kategori, ukuran, harga, stok), pengurutan, pagination (12/product), kartu produk dengan status Habis/Baru
- `/product/{slug}`: Galeri foto, swatch warna, chip ukuran, stok menipis, pesan WhatsApp ter-encode, etiket harga gantung
- `/kontak-kami`: Info toko dari settings, form kontak (nama, kontak, pesan, max 1000 char), honeypot & rate limit (3/10 menit per IP)
- `/login`: Autentikasi admin, tanpa register/lupa password, rate limit (5/menit per kombinasi email+IP)

**Rute Admin**:
- Semua rute admin: Otentikasi admin (`admin@example.com`), paginasi/filter opsional, props: title, user, data, filters, settings
- `/admin/produk`: CRUD, filter status, gambar produk (8/produk, 2MB, valid ekstensi), tabel varian
- `/admin/stok`: Stok per varian, penyesuaian (+/-), riwayat mutasi, stok menipis
- `/admin/pesanan`: Formulir pesanan manual, status alur, kode otomatis `TD-YYMMDD-001`, pengurangan stok
- `/admin/laporan`: Omzet dihitung dari status `dibayar`→`selesai`, rentang tanggal/kustom, ekspor CSV

### 2.2 Pertanyaan dan Asumsi Terbuka

**Dari docs/ringkasan-tim.md**:
- A1: Tanpa keranjang/checkout, pesan lewat WhatsApp, pesanan manual
- A2: Satu peran `admin`; tanpa lupa password di tahap 1
- A3: Ukuran: All Size, S, M, L, XL, Jumbo
- A4: Stok berkurang saat pesanan dibuat, kembali saat batal
- A5: Kanal pesanan: whatsapp, marketplace, langsung
- A6: Omzet dihitung dari status dibayar sampai selesai
- A7: Brand/logo: teks "Daster" sebagai logo sementara
- A8: Foto produk, nama toko, alamat, nomor WhatsApp diisi pemilik lewat `/admin/pengaturan`

**Dari docs/1-tinjauan-singkat.md**:
- Q1: Apakah komponen kartu produk menampilkan badge kuning "Baru" untuk produk unggulan? (BLOCKING)
- Q2: Konten bagian "Kenapa daster ini" via settings? (NON-BLOCKING)
- Q3: Tombol "Coba Lagi" menampilkan toast atau reload bagian? (NON-BLOCKING)

**Dari docs/kontrak-props.md**:
- Login: props `title`, `loginError`
- Admin: props `title`, `user`, `data`, `filters`, `settings.whatsappNumber`, `settings.storeName`, `settings.storeTagline`

### 2.3 Ketidaksinkronan Potensial

1. **Kontrak Props vs Desain**: Desain mengharapkan props `settings.whatsapp_number` tetapi kontrak hanya memiliki `settings.whatsappNumber` (camelCase)
2. **Field Varian**: Desain mengharapkan `stock_minimum` tetapi DB.md menunjukkan `stock_minimum` (nama sama)
3. **Status Produk**: Desain menggunakan `status` (enum: 'tayang'/'draf'/'arsip') sesuai DB.md

## 3. matriks Risiko dan Strategi Pengujian

| Area/Fitur | Kemungkinan Gagal | Dampak | Level Risiko | Strategi/Kedalaman Uji |
|---|---|---|---|---|
| **Autentikasi & Otorisasi** | Tinggi | Akses ilegal ke admin, bypass kredensial | **Critical** | Uji login valid/invalid, route admin terlindungi, rate limit, logout, redirect setelah login, endpoint register 404 |
| **Produk & Kategori** | Sedang | Data produk salah, kategori hilang, stok tidak sinkron | **High** | Validasi CRUD (publik & admin), filter/search/sort, pagination, semua state (default/loading/empty/error/success), responsif, upload foto, status tayang/draf/arsip |
| **Stok & Mutasi** | Tinggi | Stok tidak akurat, double-entry, tidak sinkron pesanan | **Critical** | Penyesuaian stok (+/-), riwayat mutasi, validasi stok tidak negatif, deteksi stok menipis, lock/order service untuk transaksi, integrasi pesanan |
| **Pesanan & Omzet** | Sedang | Data pesanan salah, kode duplikat, penghitungan omzet, pengiriman stok | **High** | Alur status pesanan, kode otomatis, penghitungan subtotal/total, pengurangan stok, pembatalan/restok, filter & pencarian, omzet laporan sesuai status |
| **Form Kontak** | Sedang | Pesan gagal terkirim, validasi string, penyimpanan DB | **Medium** | Validasi klien & server (wajib, max 1000 char), honeypot, rate limit (3/10 menit), penyimpanan di `contact_messages`, email/WhatsApp encoding |
| **Laporan & Ekspor** | Rendah | Data omzet salah, format CSV | **Medium** | Filter tanggal, omzet dihitung (`dibayar`→`selesai`), ekspor CSV, omzet per hari/produk/kategori |
| **Publik & Responsif** | Sedang | Layout rusak, WhatsApp CTA gagal, slider filter | **Medium** | Semua state UI, breakpoint 360-1280, fokus keyboard, WCAG AA, fallback WhatsApp, behavior filter/search |
| **Aksesibilitas & Keamanan** | Rendah | Fokus keyboard hilang, pesan error bocor | **Low** | Urutan fokus, label form, aria-labels, ring fokus, pesan error generik, kontrol rate limit |

## 4. Test Case

### 4.1 Template dan Konvensi

**Format**:
| ID | Requirement/AC | Fitur | Skenario | Prasyarat | Langkah | Hasil Diharapkan | Tipe | Prioritas | Status | Otomatis? |
|---|---|---|---|---|---|---|---|---|---|---|

**Tipe Pengujian**:
- **Requirement Review**: Memverifikasi spesifikasi tercakup dan sinkron
- **Fungsional**: HTTP request/response behavior
- **HTTP**: Respons route, status code, headers, body
- **Integrasi**: Alur antar modul yang terhubung (misal: pesanan → stok)
- **UI**: State halaman, interaktivitas, responsif
- **Regresi**: Memverifikasi fitur yang sudah ada setelah perubahan
- **Keamanan Dasar**: Autentikasi, rate limit, validasi input
- **Performa Indikatif**: Respons route kritis (jika memungkinkan)

**Prioritas**:
- **P0**: Blokir rilis (autentikasi, stok, pesanan, data kritikal)
- **P1**: Fitur utama gagal tanpa workaround (katalog publik, WhatsApp CTA, laporan)
- **P2**: Gangguan sedang (filter, paginasi, state error)
- **P3**: Minor/kosmetik (label microcopy, responsif non-kritikal)

### 4.2 Matrik Traceability

| Requirement/AC | Test Case ID | Cakupan | Status |
|---|---|---|---|

### 4.3 Test Case Pemula (Prioritas Tinggi)

**TC-P0-001**: Login Admin (Autentikasi)
- **Requirement/AC**: PRD Bagian 5.5, Kontrak Props Autentikasi
- **Fitur**: Login, otorisasi admin
- **Skenario**: Kredensial admin valid berhasil login
- **Prasyarat**: Tidak ada
- **Langkah**:
  1. GET `/login` → periksa state form login
  2. POST `/login` dengan `email=admin@example.com`, password salah
  3. POST `/login` dengan kredensial benar
  4. Verifikasi redirect ke `/admin`
- **Hasil Diharapkan**: Success, redirect, sesi admin, route admin aksesibel
- **Tipe**: Fungsional, HTTP, Keamanan Dasar
- **Prioritas**: P0, Critical
- **Status**: Belum Diuji

**TC-P0-002**: Akses Route Admin Tanpa Login
- **Requirement/AC**: PRD Bagian 5.5, Kontrak Props Admin
- **Fitur**: Otorisasi, route terlindungi
- **Skenario**: Akses rute admin tanpa login
- **Prasyarat**: Tidak ada
- **Langkah**:
  1. Langsung GET `/admin`, `/admin/produk`, dll.
  2. Verifikasi redirect ke `/login` atau 403
- **Hasil Diharapkan**: Redirection, akses ditolak
- **Tipe**: Fungsional, HTTP, Keamanan Dasar
- **Prioritas**: P0, Critical
- **Status**: Belum Diuji

**TC-P0-003**: Filter Kontak & Rate Limit
- **Requirement/AC**: PRD Bagian 5.4, Desain Kontak
- **Fitur**: Form kontak, validasi, penyimpanan
- **Skenario**: Kirim 3 pesan valid, lalu pesan ke-4 melebihi rate limit
- **Prasyarat**: Tidak ada
- **Langkah**:
  1. POST `/kontak-kami` dengan data valid (3 kali)
  2. POST `/kontak-kami` ke-4 dengan data valid
  3. Verifikasi pesan ke-4 diblokir dengan pesan error rate limit
- **Hasil Diharapkan**: Sukses untuk 3, error "Terlalu banyak percobaan" untuk ke-4
- **Tipe**: Fungsional, HTTP, Keamanan Dasar
- **Prioritas**: P0, High
- **Status**: Belum Diuji

**TC-P1-001**: Produk Publik & Katalog
- **Requirement/AC**: PRD Bagian 5.2, Desain Product
- **Fitur**: Produk tayang, pencarian, filter, sort, pagination
- **Skenario**: Jelajahi katalog publik dengan filter, pencarian, pagination
- **Prasyarat**: Data produk (produk tayang, kategori, varian)
- **Langkah**:
  1. GET `/product` (default)
  2. GET `/product?search=katun`
  3. GET `/product?kategori=1&size=S`
  4. GET `/product?sort=harga_asc`
  5. GET `/product?page=2`
- **Hasil Diharapkan**: Respons HTML dengan produk, filter/sort/filter berfungsi, pagination URL, halaman 2 berisi produk
- **Tipe**: Fungsional, HTTP, UI
- **Prioritas**: P1, High
- **Status**: Belum Diuji

**TC-P1-002**: Produk Tayang & Status Draf
- **Requirement/AC**: PRD Bagian 5.2, DB.md
- **Fitur**: Status produk, penguncian publik
- **Skenario**: Verifikasi produk tayang muncul di publik, draf/arsip tidak
- **Prasyarat**: Produk contoh (`tayang`, `draf`, `arsip`)
- **Langkah**:
  1. Buat produk dengan status `tayang` (admin)
  2. Buat produk dengan status `draf` (admin)
  3. GET `/product` → hanya produk `tayang` muncul
  4. Detail route `/product/{slug}` untuk produk `draf` → 404
- **Hasil Diharapkan**: Produk `tayang` terlihat, produk `draf`/`arsip` disembunyikan atau 404
- **Tipe**: Fungsional, HTTP, Integrasi
- **Prioritas**: P1, High
- **Status**: Belum Diuji

**TC-P1-003**: WhatsApp CTA & Pesan Ter-encode
- **Requirement/AC**: PRD Bagian 5.3 & 5.4, Desain Produk-Detail & Kontak
- **Fitur**: URL WhatsApp, encoding pesan
- **Skenario**: Verifikasi CTA WhatsApp dimunculkan, URL ter-encode dengan benar
- **Prasyarat**: Produk (`{id, slug, nama, warna, ukuran}`), settings (`whatsappNumber`)
- **Langkah**:
  1. GET `/product/{slug}` → Verifikasi tombol WhatsApp muncul (jika settings terisi)
  2. Klik CTA WhatsApp → Verifikasi URL `https://wa.me/<nomor>?text=<pesan_encoded>`
  3. Verifikasi pesan mencakup nama produk, warna, ukuran, URL halaman
- **Hasil Diharapkan**: URL WhatsApp valid, ter-encode, mencakup data yang diperlukan
- **Tipe**: Fungsional, HTTP, UI
- **Prioritas**: P1, Medium
- **Status**: Belum Diuji

**TC-P1-004**: Pesanan & Alur Status
- **Requirement/AC**: PRD Bagian 5.6, DB.md, Desain Pesanan
- **Fitur**: Pembuatan pesanan manual, alur status
- **Skenario**: Buat pesanan, alihkan status melalui alur
- **Prasyarat**: Produk (`varian`), admin login
- **Langkah**:
  1. GET `/admin/pesanan` → daftar pesanan
  2. POST `/admin/pesanan` dengan data pesanan valid (snapshot varian)
  3. GET `/admin/pesanan` → pesanan baru muncul
  4. PUT `/admin/pesanan/{id}` status `dibayar`
  5. Verifikasi status pesanan berubah dan stok berkurang
  6. PUT `/admin/pesanan/{id}` status `batal`
  7. Verifikasi status pesanan `batal` dan stok kembali
- **Hasil Diharapkan**: Pembuatan pesanan, penghitungan total, perubahan stok, alur status berfungsi
- **Tipe**: Fungsional, HTTP, Integrasi
- **Prioritas**: P1, High
- **Status**: Belum Diuji

**TC-P2-001**: Halaman Error & State Kosong
- **Requirement/AC**: Desain Spesifikasi setiap rute
- **Fitur**: State UI error, kosong, loading
- **Skenario**: Trigger state error/kosong dan verifikasi UI
- **Prasyarat**: Data minimal (route dengan opsi error/kosong)
- **Langkah**:
  1. Buat skenario error (misal: slug produk tidak valid)
  2. Trigger error (misal: produk `draf` diakses publik)
  3. Verifikasi UI error menampilkan pesan konkret dan tombol aksi
  4. Buat skenario kosong (misal: tidak ada produk tayang)
  5. Verifikasi UI kosong menampilkan pesan konkret dan tombol aksi
- **Hasil Diharapkan**: Error state: judul, deskripsi, tombol; Empty state: judul, deskripsi, tombol; loading skeleton ditampilkan
- **Tipe**: UI, Fungsional
- **Prioritas**: P2, Medium
- **Status**: Belum Diuji

**TC-P2-002**: Responsif (Breakpoint)
- **Requirement/AC**: Desain Responsif untuk setiap rute
- **Fitur**: Layout per perangkat
- **Skenario**: Simulasikan breakpoint desktop/ponsel
- **Prasyarat**: Browser simulation tool
- **Langkah**:
  1. Desktop (>=1024px): verifikasi layout (misal: sidebar kiri admin, 2 kolom produk publik)
  2. Tablet (768-1024px): verifikasi layout (misal: sidebar collapsible, 3 kolom produk)
  3. Mobile (<768px): verifikasi layout (misal: drawer filter, 2 kolom produk, bottom bar WhatsApp)
- **Hasil Diharapkan**: Breakpoint berfungsi, komponen dalam viewport, interaktivitas berfungsi
- **Tipe**: UI, Responsif
- **Prioritas**: P2, Medium
- **Status**: Belum Diuji, butuh browser

**TC-P3-001**: Validasi Input & Keamanan Dasar
- **Requirement/AC**: Validasi setiap form, Kontrak Props
- **Fitur**: Validasi server, keamanan input
- **Skenario**: Kirim input berbahaya/tidak valid
- **Prasyarat**: Admin login
- **Langkah**:
  1. Kirim data pesanan dengan stok tidak cukup
  2. Kirim data kontak dengan data berlebihan (panjang > max)
  3. Kirim login dengan format email salah
  4. Verifikasi error validasi server mengembalikan pesan dan form tetap
- **Hasil Diharapkan**: Error validasi muncul, data tidak diproses, tidak crash
- **Tipe**: Keamanan Dasar, Fungsional
- **Prioritas**: P3, Low
- **Status**: Belum Diuji

## 5. Script Otomatisasi

[Jika alat memungkinkan, dibuat di docs/ dengan nama yang tepat]

**Catatan**: Perlu dijalankan di environment yang tepat, dependensi mungkin diperlukan. Skrip hanya dibuat jika sesuai batasan. QA tidak akan menginstal atau menjalankan Node/PHP/composer.

## 6. Hasil Eksekusi

**Status**: Belum dimulai (sesuai tugas)

**Tantangan**:
1. **Tidak ada Server/Database**: Memerlukan pemilik menjalankan server
2. **Tidak ada Data Uji**: Memerlukan data seeder
3. **Tidak ada Alat Browser**: Responsif/Pengujian visual harus "Belum Diuji, butuh browser"
4. **Tooling Tidak Diketahui**: Tidak tahu Playwright, Cypress, dll.

**Revisi Rencana**:
1. Fokus pada pengujian yang dapat dilakukan lewat HTTP
2. Verifikasi setiap route ada dan merespons sebelum mengklaim selesai
3. Dokumentasikan hambatan dalam "Hasil Non-Fungsional dan Batasan"
4. Jika server dimulai, lanjut dengan eksekusi tes yang sebenarnya

## 7. Bug Report

**Status**: Tidak ada bug ditemukan (belum diuji)

**Perbaikan yang Direkomendasikan**:
- Perbaiki ketidaksinkronan: `settings.whatsapp_number` vs `settings.whatsappNumber` (kontrak vs desain)
- Tentukan kebutuhan badge produk unggulan (BLOCKING)
- Periksa nama field varian (`stock_minimum`)

## 8. Hasil Non-Fungsional dan Batasan

**Keamanan Dasar**:
- Rate limit diterapkan (login, kontak)
- Autentikasi admin melalui password
- Rate limiting untuk 3 rute utama

**Performa Indikatif**:
- Tidak dapat mengukur (server tidak berjalan)

**Aksesibilitas**:
- Hanya dalam dokumen (desain mengklaim WCAG AA)

**Kompatibilitas**:
- Tidak dapat menguji multi-browser

**Ketahanan**:
- Tidak dapat menguji respons saat server tidak tersedia

**Kualitas Publik**:
- Tidak dapat mengukur LCP, Lighthouse (server tidak berjalan)

**Kesimpulan**:
- Ketakutan terbesar: Server tidak berjalan, database tidak dimigrasi
- Jika server dimulai, dapat melanjutkan pengujian HTTP

## 9. Self-Review Checklist

- [ ] Semua acceptance criteria dipetakan ke test case atau gap dicatat
- [ ] Area risiko tinggi diprioritaskan (autentikasi, stok, pesanan)
- [ ] Test negatif, boundary, edge case, otorisasi, dan state UI dipertimbangkan
- [ ] Pengujian sesuai arsitektur Inertia dan route yang benar-benar tersedia
- [ ] Tidak ada klaim pengujian yang belum dieksekusi
- [ ] Setiap bug memiliki langkah reproduksi, expected result bersumber, dan bukti aman
- [ ] Perbaikan defect diverifikasi dan regresi terkait diperiksa bila memungkinkan
- [ ] Known issues, keterbatasan environment, dan risiko tersisa dicatat
- [ ] Tidak ada file di luar `docs/` yang diubah
- [ ] Tidak ada file `.env` yang dibaca atau dimodifikasi
- [ ] Keputusan Go/No-Go memiliki alasan yang jelas

## 10. Rekomendasi Go/No-Go

**Status**: Belum diuji

**Tantangan Saat Ini**:
1. Server tidak berjalan → tidak ada HTTP testing
2. Database tidak tersedia → tidak ada data
3. Ketidakpastian alat browser → responsif belum diuji

**Rekomendasi**:
- **NO-GO** sampai server/database tersedia untuk pengujian
- Persyaratan untuk Go:
  1. Server berjalan di http://127.0.0.1:8000
  2. Database dimigrasi dan di-seed
  3. Semua rute dasar merespons
  4. Autentikasi admin berfungsi
  5. Minimal 3 rute utama (publik & admin) diuji berhasil
  6. Area kritis (autentikasi, stok, pesanan) tercakup

**Alasan**: Tanpa server yang berjalan, tidak ada testing yang berarti, aspek kritis kegagalan seperti autentikasi, stok, dan integrasi database tidak dapat diverifikasi. Fitur bisnis inti bergantung pada data yang tersimpan dan alur HTTP yang berfungsi.

**Selanjutnya**: Tunggu pemilik menjalankan server dan database, lalu lanjutkan dengan eksekusi tes yang sebenarnya.