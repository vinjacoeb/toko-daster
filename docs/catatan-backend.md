# Standarisasi Controller Admin (t_d2c95e63)

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

# Rencana Kerja B2: Admin Produk & Kategori (t_a0a22439)

## Rencana (maks 10 baris)
- Audit controller stub `ProductController` & `CategoryController` di `app/Http/Controllers/Admin/`.
- Lengkapi implementasi index, store, update, destroy sesuai `docs/kontrak-props.md`.
- Verifikasi dengan `php -l` dan `php artisan route:list`.

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



