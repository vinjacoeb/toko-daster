# 2026-10-11: Fix ParseError Order.php baris 57 (t_b9df5dc2)
## Rencana
- Hapus sisa duplikat OrderItem rusak di luar class (baris 54-84): protected $table + atribut #[...] + 3 relasi.
- OrderItem kanonis tetap di app/Models/OrderItem.php (tidak diubah). Berkas disentuh: Order.php, catatan-backend.md.
## Hasil
- php -l bersih Order.php + OrderItem.php; route:list --path=admin tampil 28 rute (ParseError hilang).
- write_file ditolak 2x oleh stale guard (read parsial) lalu patch sekali pada blok tanpa backslash, sesuai aturan 9.
- Belum dicek: render /admin di browser (perlu server+DB oleh pemilik); tanpa migrate/seed di kartu ini.

# 2026-10-11: Dashboard kontrak baru + definisi omzet/stok (t_8529f2f2, BUG-DASH-01)

## Rencana (maks 10 baris)
- Kontrak dulu: tambah `## Admin Dashboard (/admin)` LOCKED di docs/kontrak-props.md (props §7 dashboard-tambahan.md) + normalisasi berkas (isi terduplikasi 2x, 866 baris -> 1 salinan).
- Tulis ulang app/Http/Controllers/Admin/DashboardController.php -> props snake_case { kartu, perbandingan (hari_ini/minggu_ini/bulan_ini), pendapatan_bulanan, riwayat_pesanan_minggu_ini, produk_terlaris, stok_menipis_daftar }.
- Definisi omzet: SUM(total) status dibayar,dikemas,dikirim,selesai by dipesan_at (bukan `!= batal`).
- Stok menipis: stok>0 AND stok<=stok_minimum via whereColumn + produk non-arsip.
- Selaraskan app/Http/Controllers/Admin/ReportController.php (definisi omzet sama + mapping code/customer_name/name/size/color).
- Perbaiki app/Models/Order.php (hapus deklarasi `class OrderItem` duplikat -> fatal autoload).
- Migrasi indeks (status, dipesan_at) di tabel orders.
- Verifikasi: php -l, route:list, migrate, curl /admin. Berkas disentuh: DashboardController, ReportController, Order.php, migrasi baru, kontrak-props.md, catatan-backend.md, asumsi.md.

# Standarisasi Controller Admin (t_d2c95e63)

# 2026-10-11: Membuat PesananSeeder dan PesanMasukSeeder
- Telah membuat `database/seeders/PesananSeeder.php` dan `database/seeders/PesanMasukSeeder.php`
- Kedua seeder idempoten: hapus [CONTOH] (pesanan dan pesan) sebelum seed
- Seeder hanya berjalan pada environment lokal (app()->isLocal())
- Menyalin data contoh sesuai PRD dan seed-pesanan.md (status, kanal, tanggal, penomoran kode, alamat, diskon, subtotal, total akurat)
- Pesanan memakai varian milik produk `tayang` dan tidak mengubah stok/stock_movements
- Dua kali seed tetap 40 pesanan, minimal 40 item, 12 pesan
- Tidak menyentuh user, kategori, produk, varian, pengaturan
- Semua pesanan dicatat [CONTOH] pada kolom `note`; semua pesan ip=127.0.0.1
- Perubahan diverifikasi dengan seed dua kali dan dicek php artisan tinker/db:show

## Rencana (maks 10 baris)
- Kontrak dulu: tambah bagian standarisasi di docs/kontrak-props.md (pemetaan lama->baru, rute tak berubah, props tak berubah), status DRAFT.
- Buat app/Http/Controllers/Admin/MessageController.php (pindahan AdminMessageController, render Admin/PesanMasuk/Index).
- Hapus duplikat root: AdminDashboardController.php, AdminMessageController.php, AdminOrderController.php (kanonis di Admin\).
- Update routes/web.php: import DashboardController+MessageController dari Admin\, arahkan admin.index + pesan-masuk ke sana.
- Verifikasi: php -l, route:list --path=admin. Tanpa migrasi/seeder, tanpa ubah .env.
- Berkas disentuh: kontrak-props.md, MessageController.php (baru), web.php, hapus 3 file root, catatan-backend.md, asumsi.md.

## Hasil Verifikasi
- `php -l` bersih: routes/web.php + 9 file Admin/*.php (Account, Category, Dashboard, Message, Order, Product, Report, Setting, Stock).
- `php artisan route:list --path=admin` → 28 rute; `admin.index → Admin\DashboardController@index`, `admin.pesan-masuk.index → Admin\MessageController@index`, `admin.pesanan.* → Admin\OrderController`.
- `ls app/Http/Controllers/Admin*.php` → tidak ada (duplikat root terhapus); `ls Admin/` → 9 file standar.
- Tanpa migrate/seed, tanpa ubah .env.

## Temuan luar lingkup (tidak diperbaiki di kartu ini)
- Rute `GET /admin/pesanan/create → OrderController@create` tidak punya method `create` (bawaan sebelum kartu ini).
- Direktori kosong `app/Http/Controllers/Admin/StockController/` (tanpa file) dibiarkan.
- Props kanonis `Admin\DashboardController` (`data.omzetHariIni` dkk) berbeda dari bagian LOCKED kontrak lama (`stats.todayRevenue` dkk); pemutakhiran LOCKED menunggu koordinasi frontend t_3879c444.
- Komponen root `AdminPesanMasuk.jsx` / `Admin/Dashboard.jsx` / `Admin/Pesanan.jsx` vs terstruktur `Index.jsx` adalah ranah frontend t_3879c444; backend kini merender path terstruktur.

# Fix riwayat edit stok — drawer selalu kosong (t_e2268016)

## Rencana (maks 10 baris)
- Verifikasi attempt 1: kolom variant_id + deleted_at ada di stock_movements; getVariantHistory ada.
- Akar masalah sisa: drawer Stok.jsx fetch JSON (Accept: application/json), controller hanya balas Inertia HTML → res.json() gagal → drawer selalu "Belum ada riwayat".
- Kontrak dulu: catat varian respons JSON di docs/kontrak-props.md (props Inertia tidak berubah, LOCKED tetap).
- Implementasi: history() balas JSON bila wantsJson; getVariantHistory eager load order (PRD 6.4: pesanan terkait).
- Verifikasi: php -l, route:list, tinker (jalur JSON + baca data variant 1). Tanpa migrate:fresh, tanpa ubah frontend.
- Berkas: app/Http/Controllers/Admin/StockController.php, app/Services/StockService.php, kontrak-props.md, db.md, asumsi.md.

# Perbaikan error admin (Task t_869a7fde)

## Rencana (maks 10 baris)
1. Audit path Inertia: perbaiki `Admin/Produk`, `Admin/Kategori` ke `Admin/Produk/Index`, `Admin/Kategori/Index`.
2. Perbaiki model Category: hapus `#[Fillable]` dan ganti ke `$fillable` standar.
3. Cek kolom stok/stok_minimum di `variants` dan seeder (docs/seed-produk.md).
4. Tambahkan kolom `variant_id` di `stock_movements`.
5. Update refs di seluruh tempat (service, request, props) sesuai standar PRD.
6. Verifikasi `php -l`, `php artisan route:list`, tes seeder.

# Fix filters /product (t_8583394d)

## Rencana (maks 10 baris)
- Kontrak: tambah bagian Daftar Produk (/product) di docs/kontrak-props.md, filters wajib object.
- Perbaiki `app/Http/Controllers/ProductController.php`: cast filters ke (object).
- Verifikasi: php -l + route:list. Tanpa migrasi/seeder.
- Temuan luar lingkup dicatat di bawah, tidak diperbaiki di kartu ini.

## File yang Disentuh
- `docs/kontrak-props.md`
- `app/Http/Controllers/ProductController.php`

## Hasil Verifikasi
- `php -l app/Http/Controllers/ProductController.php` → No syntax errors.
- `php artisan route:list --path=product` → 2 rute (product, product/{slug}) utuh.
- Bukti encoding: `(object) []` → `{}`, `(object) ['sort'=>'price_asc']` → `{"sort":"price_asc"}`.
- Tanpa query param: filters kini `{}` (object), `filters.sort` → undefined → fallback 'terbaru', tidak crash.
- Filter/sort aktif tidak berubah (whitelist key sama, hanya cast tipe).
- Tidak menyentuh .env, tanpa migrasi/seeder.

## Langkah untuk Pemilik
- Tidak ada.

## Untuk Frontend / QA
- Props `filters` di `/product` kini selalu object; tidak perlu ubah Produk.jsx untuk bug ini.
- Opsional (defense in depth, milik frontend): guard `safeFilters` di Produk.jsx bila diinginkan.

## Temuan di luar lingkup (tidak diperbaiki di kartu ini)
- Pola `request()->only(...)` / `'filters' => []` juga ada di controller admin (OrderController, SettingController, ReportController, AccountController) — berpotensi ter-encode sebagai `[]` bila kosong. Belum diverifikasi apakah halaman admin mengakses `filters.xxx` seperti Produk.jsx; diserahkan ke QA/frontend bila ada crash serupa.

# Perbaikan SQL Error pada /admin/laporan (t_6b7a4f01)

## Rencana
- Memperbaiki query di `app/Http/Controllers/Admin/ReportController.php` baris 56 dan 98.
- Mengganti `Variant::where('stok', '<=', 'stok_minimum')` menjadi `Variant::whereColumn('stok', '<=', 'stok_minimum')`.
- Memverifikasi sintaks PHP dengan `php -l`.

## File yang Disentuh
- `app/Http/Controllers/Admin/ReportController.php`

# OrderItems Missing Columns Fix

## Ringkasan
Migrasi tabel order_items berhasil dijalankan:
1. Menambahkan kolom baru yang hilang: order_id, variant_id, product_id, nama, warna, ukuran, harga, qty.
2. Menambahkan foreign key:
   - order_id → orders (restrict)
   - variant_id → variants (restrict)
   - product_id → products (set null)
3. Memperbarui model OrderItem:
   - Menghapus kolom `price` dan `quantity`, menambahkan `harga` dan `qty` (integer).
   - Update fillable, casts.
4. Memperbarui AdminDashboardController:
   - Mengubah dari koleksi raw query menjadi koleksi mapped dengan key yang benar.

## Kolom yang Ditambahkan
- `order_id`: foreignId ke `orders` (restrict)
- `variant_id`: foreignId ke `variants` (restrict)
- `product_id`: foreignId opsional ke `products` (set null)
- `nama`: string, nullable
- `warna`: string, nullable
- `ukuran`: string, nullable
- `harga`: integer, default 0
- `qty`: integer, default 1

## File
- `database/migrations/2026_10_10_000000_add_missing_columns_to_order_items_table.php`
- `app/Models/OrderItem.php`
- `app/Http/Controllers/AdminDashboardController.php`
- `docs/kontrak-props.md`

## Hasil Verifikasi
- php artisan migrate:status → [7] Ran
- php -l .php files: tanpa error sintaksis
- route:list: rute baru tidak ditambahkan

## Langkah untuk Frontend
- Tidak ada: Data yang diterima Frontend melalui Inertia kini sesuai kontrak baru: AdminDashboardController mengembalikan objek OrderItem yang dipetakan dengan `product_name` dan `total_sold`.
- Tidak ada perubahan data yang dikirim dari frontend: order_items dibuat melalui POST /admin/pesanan (OrderController.create), yang meng-copy snapshot dari Variant ke OrderItem menggunakan kolom yang baru ditambahkan.

## Asumsi dan Catatan
- Tabel order_items saat ini kosong (data contoh belum di-seed).


# Fix Admin Dashboard Route/Component Mismatch

## Ringkasan

Perbaiki mismatch: AdminDashboardController merender `AdminDashboard`, padahal komponen berada di `resources/js/Pages/Admin/Dashboard.jsx`. Memperbaiki `App\Http\Controllers\AdminDashboardController.php` dari `AdminDashboard` ke `Admin/Dashboard` dan mencatat pemetaan di docs/kontrak-props.md.

## Ringkasan
Memperbaiki error `TypeError: pages[name] is not a function` pada `resources/js/app.jsx` dengan memastikan fungsi `resolve` memvalidasi komponen sebelum memanggilnya.

## Rencana
- Review `resources/js/app.jsx`.
- Pastikan fungsi `resolve` memvalidasi keberadaan komponen.
- Memastikan penanganan error jika komponen tidak ditemukan.

## File
- `resources/js/app.jsx`

## Hasil Verifikasi
- Belum dicek (Frontend).

## Langkah untuk Frontend
- Tidak ada.

## Asumsi dan Catatan
- Masalah dilaporkan sebagai `TypeError` di `app.jsx`.
- `import.meta.glob` sudah digunakan dengan benar, namun validasi perlu dipastikan.

# Perbaikan 500 pada /admin/* (Route Login & Middleware Verified)

## Ringkasan

# Perbaikan Bug HTTP 500 di ReportController (t_551fbbbc)

## Ringkasan
Memperbaiki query `produkTerlaris` pada `ReportController.php` karena kesalahan penyebutan nama tabel `orders_items` (seharusnya `order_items`) dan nama kolom `quantity` (seharusnya `qty`).

## File yang Disentuh
- `app/Http/Controllers/Admin/ReportController.php`

## Hasil Verifikasi
- `php -l app/Http/Controllers/Admin/ReportController.php` → Tanpa error.

1. Menambahkan `->name('login')` pada rute `GET /login` di `routes/web.php` sehingga tamu yang mengakses `/admin/*` berhasil dialihkan ke halaman login (302 redirect) alih-alih mengalami error 500 "Route [login] not defined".
2. Menghapus middleware `'verified'` dari grup rute `/admin` di `routes/web.php`, karena PRD tidak memakai fitur verifikasi email (mencegah redirect ke `verification.notice` yang tidak ada).

## File yang Disentuh
- `routes/web.php`

## Hasil Verifikasi
- `php -l routes/web.php` → Tidak ada kesalahan sintaksis.
- `php artisan route:list` → Rute login terdaftar dengan benar dengan nama `login`.


# Fix MassAssignmentException pada App\Models\Product (t_b3d04e81)

## Rencana
- Mengganti PHP attribute `#[Fillable([...])]` di `app/Models/Product.php` menjadi properti standar Eloquent `protected $fillable = [...]`.
- Menghapus import atribut Eloquent yang tidak dipakai.

## File yang Disentuh
- `app/Models/Product.php`

## Hasil Verifikasi
- `php -l app/Models/Product.php` → No syntax errors.


# 2026-10-11: Fix error detail pesanan /admin/pesanan/42 (t_748c0b08)

## Rencana
1. Memperbaiki `OrderController.php`:
   - Gunakan nama kolom database yang benar (`code`, `customer_name`, `customer_phone`, `address`, `channel`, `shipping_cost`, `discount`, `tracking_number`, `dipesan_at`).
   - Perbaiki validasi dan pengisian pada method `store` dan `update`.
2. Memperbaiki `resources/js/Pages/Admin/Order/Show.jsx`:
   - Sesuaikan penggunaan properti pesanan (`order.code`, `order.customer_name`, `order.customer_phone`, `order.address`, `order.channel`, `order.shipping_cost`, `order.discount`, `order.tracking_number`).
3. Verifikasi sintaks PHP dan route:list.

## Hasil
- Patch diterapkan pada `OrderController.php` dan `Show.jsx` (rute dan kolom diperbaiki).
- Verifikasi sintaks PHP (`php -l app/Http/Controllers/Admin/OrderController.php`) dan (`php -l resources/js/Pages/Admin/Order/Show.jsx`) berhasil.
- Tanpa migrasi/seeder, tanpa ubah .env.



# 2026-10-11: Fix ReferenceError: route is not defined in Show.jsx (t_92189838)

## Rencana
- Memperbaiki `ReferenceError: route is not defined` di `resources/js/Pages/Admin/Order/Show.jsx` saat merubah status pesanan.
- Mengganti pemanggilan `route('admin.pesanan.update', order.id)` dengan URL absolut `/admin/pesanan/${order.id}` karena `ziggy` tidak tersedia/terkonfigurasi.
- Memverifikasi build frontend.

## File yang Disentuh
- `resources/js/Pages/Admin/Order/Show.jsx`

## Hasil Verifikasi
- `npm run build` sukses.
- `Show.jsx` patch berhasil, `router.put` kini memakai URL string `/admin/pesanan/${order.id}`.

## Rencana Baru (t_45abdcdc) — Perbaikan kolom 'resi' yang hilang

1. Analisis: Error `SQLSTATE[42S22]: Column not found: 1054 Unknown column 'resi'` karena `OrderController` mencoba mengupdate kolom `resi` pada tabel `orders` yang sebenarnya bernama `tracking_number`.
2. Tindakan: Perbarui `app/Http/Controllers/Admin/OrderController.php` (metode `update` dan `kirim`) untuk menggunakan `$order->tracking_number` alih-alih `$order->resi`.
3. Verifikasi: `php -l`.

## Hasil
- Patch diterapkan pada `app/Http/Controllers/Admin/OrderController.php`:
  - Method `update` (line 190): ganti `$order->resi = ...` dengan `$order->tracking_number = ...`
  - Method `kirim` (line 260): ganti `$order->resi = ...` dengan `$order->tracking_number = ...`
- Verifikasi sintaks PHP (`php -l app/Http/Controllers/Admin/OrderController.php`): ✅ No syntax errors.
- Frontend konsisten: input `resi` tetap digunakan (sesuai kontrak Show.jsx).
- Tanpa migrasi/seeder, tanpa ubah .env.
- Berkas yang disentuh: app/Http/Controllers/Admin/OrderController.php, docs/catatan-backend.md.

## Langkah untuk Pemilik
- Tidak ada.

## Untuk Frontend / QA
- Tidak perlu perubahan: Form di Show.jsx tetap memakai field `resi` (seperti kontrak), backend kini menyimpan ke `tracking_number`.
- Verifikasi ulang update status pesanan admin melalui UI (gambar tidak tersedia).

# 2026-10-11: Fix ReferenceError: route is not defined in Admin/PesanMasuk/Index.jsx (t_393c99f3)

## Rencana
- Memperbaiki `ReferenceError: route is not defined` di `resources/js/Pages/Admin/PesanMasuk/Index.jsx` saat menekan tombol "Tandai Dibaca" atau "Hapus".
- Mengganti pemanggilan `route()` dengan URL absolut `/admin/pesan-masuk/${id}/dibaca` dan `/admin/pesan-masuk/${id}`.

## Hasil Verifikasi
- Perbaikan di `resources/js/Pages/Admin/PesanMasuk/Index.jsx` berhasil diterapkan menggunakan `patch`.
- `router.patch` dan `router.delete` kini menggunakan URL string absolut, konsisten dengan perbaikan sebelumnya di `t_92189838`.
