#  Halaman: Admin Dashboard (AdminDashboardController)

### Rute
- nama_rute: `admin.index`
- path: `/admin`

### Akses
- peran: `admin`

### Props
```json
{
  "title": "Dashboard",
  "stats": {
    "todayRevenue": "integer",
    "thisMonthRevenue": "integer",
    "monthOverMonth": "float",
    "pendingOrders": "integer",
    "lowStock": "integer",
    "unreadMessages": "integer"
  },
  "grafik_omzet": "array", 
  "produk_terlaris": "array",
  "pesanan_terbaru": "array",
  "stok_menipis": "array",
  "settings": {
    "whatsappNumber": "string",
    "storeName": "string"
  }
}
```

### Status
LOCKED

## Admin Laporan (/admin/laporan)

### Rute
- nama_rute: `admin.laporan.index`
- path: `/admin/laporan`

### Akses
- peran: `admin`

### Query
- `tanggal_dari`, `tanggal_sampai`

### Props
```json
{
  "title": "Laporan",
  "user": { "id": "integer", "name": "string", "email": "string" },
  "data": {
    "omzetHariIni": "integer",
    "omzetBulanIni": "integer",
    "persentaseBulanLalu": "float",
    "pesananPerluDiproses": "integer",
    "varianStokMenipis": "integer",
    "pesanBelumDibaca": "integer",
    "produkTerlaris": "array",
    "pesananTerbaru": "array",
    "varianStokMenipisList": "array"
  },
  "filters": "object",
  "settings": "object"
}
```

### Aturan
- Cetak laporan: Frontend menggunakan `window.print()` dan CSS @media print.
- CSV: Tautan unduh CSV (ekspor data berdasarkan filter).

### Status
DRAFT

## Admin Pesan Masuk (/admin/pesan-masuk)

### Rute
- nama_rute: `admin.pesan-masuk.index`
- path: `/admin/pesan-masuk`

### Akses
- peran: `admin`

### Props
```json
{
  "title": "Pesan Masuk",
  "messages": "object" 
}
```

### Status
DRAFT


### Rute
- `GET /login`
- `POST /logout`

### Siapa yang boleh mengakses
- `/login`: tamu
- `/logout`: admin yang sudah login

### Query yang diterima
- `/login`: tidak ada
- `/logout`: tidak ada

### Props yang dikembalikan
```json
{
  "title": "string",
  "loginError": "string|null"
}
```

### Aturan validasi dan pesan galat
Formulir login:
- Email (wajib): format email valid, harus terdaftar
- Password (wajib): minimal 8 karakter

Masuk:
- `\u201cEmail atau password tidak cocok\u201d` (umum untuk kedua bidang)
- `\u201cPassword minimal 8 karakter\u201d` (jika panjang kurang dari 8)

### Status
LOCKED

## Pengguna (Admin)

### Rute
- `GET /admin`
- `GET /admin/produk`
- `GET /admin/kategori`
- `GET /admin/stok`
- `GET /admin/pesanan`
- `GET /admin/pesan-masuk`
- `GET /admin/laporan`
- `GET /admin/pengaturan`
- `GET /admin/akun`

### Siapa yang boleh mengakses
- Semua rute admin: `admin` (user dengan email `admin@example.com`)

### Query yang diterima
Setiap rute admin menerima query paginasi dan filter opsional (misalnya, `search`, `status`, `kategori_id`).

### Props yang dikembalikan
```json
{
  "title": "string",
  "user": {
    "id": "integer",
    "name": "string",
    "email": "string"
  },
  "data": "array", // array paginasi: { data, links, meta }
  "filters": "object", // filter yang aktif
  "settings": {
    "whatsappNumber": "string",
    "storeName": "string",
    "storeTagline": "string"
  }
}
```

### Aturan validasi dan pesan galat
|- Validasi di server: nama (wajib, minimal 2 karakter), kontak (wajib, format email valid atau nomor HP valid minimal 10 digit), pesan (wajib, 1-1000 karakter). Pesan honeypot dan rate limit (3 kiriman per 10 menit per IP) diterapkan di backend.
|- Pesan galat validasi mengikuti konvensi error Inertia dengan key nested untuk setiap field.
|- Pesan umum: "Terlalu banyak percobaan pengiriman pesan. Coba lagi nanti."

### Status
LOCKED

## Beranda (Landing Page)

### Rute
|- `GET /`

### Siapa yang boleh mengakses
|- Tampil untuk tamu

### Query yang diterima
|- Tidak ada

### Props yang dikembalikan
```json
{
  "title": "string",
  "settings": {
    "whatsappNumber": "string",
    "storeName": "string",
    "storeTagline": "string",
    "storeDescription": "string"
  },
  "featuredProducts": "array",
  "fallbackProducts": "array"
}
```

### Aturan validasi dan pesan galat
|- Gunakan data dari tabel `settings` untuk teks tetap (telepon WhatsApp, nama toko, tagline, deskripsi).
|- Produk unggulan: 4 produk berstatus `tayang` dengan `featured = true`; jika kurang dari 4, tambahkan produk tayang terbaru (berdasarkan created_at).
|- Tidak ada validasi klien.

### Status
DRAFT

## Admin Produk (/admin/produk)

### Rute
|- `GET /admin/produk`
|- `POST /admin/produk`
|- `GET /admin/produk/{id}`
|- `PUT /admin/produk/{id}`
|- `PATCH /admin/produk/{id}`
|- `DELETE /admin/produk/{id}`

### Siapa yang boleh mengakses
|- Semua rute admin: `admin`

### Query yang diterima
|- `GET /admin/produk`: `search`, `status`, `category_id`, `page`, `per_page`
|- `POST /admin/produk`: JSON body form
|- `GET /admin/produk/{id}`: tidak ada
|- `PUT /admin/produk/{id}`: JSON body form
|- `PATCH /admin/produk/{id}`: JSON body form (partial update)
|- `DELETE /admin/produk/{id}`: tidak ada

### Props yang dikembalikan
```json
{
  "title": "string",
  "user": {
    "id": "integer",
    "name": "string",
    "email": "string"
  },
  "data": "object", // paginasi: { data, links, meta }
  "filters": "object",
  "settings": {
    "whatsappNumber": "string",
    "storeName": "string",
    "storeTagline": "string"
  }
}
```

### Aturan validasi dan pesan galat
|- Validasi di server:
  - `name` (wajib, minimal 2 karakter, unik untuk produk aktif)
  - `slug` (wajib, format: huruf/kata ganti underline, unik, steril)
  - `category_id` (wajib, foreign key ke categories)
  - `description` (opsional, teks)
  - `material` (wajib)
  - `care` (wajib)
  - `price` (wajib, integer positif)
  - `price_crossed` (opsional, harus lebih besar dari `price`)
  - `status` (wajib, 'draf'/'tayang'/'arsip')
  - `featured` (boolean)
  - `product_images` (opsional, array objek { path, order }) – maks 8, jpeg/png/webp, ≤2MB per berkas
  - `variants` (wajib, array objek:
    - `size` (wajib, enum: All Size, S, M, L, XL, Jumbo)
    - `color` (wajib, string)
    - `sku` (wajib, unik di seluruh produk)
    - `price` (opsional, integer, jika kosong ikuti harga produk)
    - `stock` (wajib, integer ≥0)
    - `stock_minimum` (wajib, integer ≥0)
    - unik kombinasi (product_id, size, color)
    )
|- Pesan galat: Format JSON; duplikat slug dan sku ditampilkan; validasi array memperlakukan setiap item secara terpisah.
|- Mode partial update: PATCH hanya memperbarui field yang diberikan, menjaga field lain yang wajib tidak berubah kecuali diganti.

### Status
LOCKED

## Admin Kategori (/admin/kategori)

### Rute
|- `GET /admin/kategori`
|- `POST /admin/kategori`
|- `GET /admin/kategori/{id}`
|- `PUT /admin/kategori/{id}`
|- `PATCH /admin/kategori/{id}`
|- `DELETE /admin/kategori/{id}`

### Siapa yang boleh mengakses
|- Semua rute admin: `admin`

### Query yang diterima
|- `GET /admin/kategori`: `search`, `page`, `per_page`
|- `POST /admin/kategori`: JSON body form
|- `GET /admin/kategori/{id}`: tidak ada
|- `PUT /admin/kategori/{id}`: JSON body form
|- `PATCH /admin/kategori/{id}`: JSON body form (partial update)
|- `DELETE /admin/kategori/{id}`: tidak ada

### Props yang dikembalikan
```json
{
  "title": "string",
  "user": {
    "id": "integer",
    "name": "string",
    "email": "string"
  },
  "data": "object",
  "filters": "object",
  "settings": {
    "whatsappNumber": "string",
    "storeName": "string",
    "storeTagline": "string"
  }
}
```

### Aturan validasi dan pesan galat
|- Validasi di server:
  - `name` (wajib, minimal 2 karakter, unik untuk kategori aktif)
  - `slug` (wajib, format: huruf/kata ganti underline, unik, steril)
  - `parent_id` (opsional, nullable, FK ke categories)
|- Pesan galat: slug duplikat dan nama duplikat.
|- Hapus ditolak jika masih memiliki produk atau subkategori (validasi di service layer).

### Status
LOCKED

## Admin Varian (/admin/stok)

### Rute
|- `GET /admin/stok` (daftar varian)
|- `POST /admin/stok` (penyesuaian stok)
|- `GET /admin/stok/{id}/riwayat` (riwayat gerakan)

### Siapa yang boleh mengakses
|- Semua rute admin: `admin`

### Query yang diterima
|- `GET /admin/stok`: `search`, `status_stok` (habis|menipis|aman), `page`, `per_page`
|- `POST /admin/stok`: JSON { variant_id, quantity, reason, order_id?, note? } (quantity bisa positif atau negatif)
|- `GET /admin/stok/{id}/riwayat`: `page`, `per_page`

### Props yang dikembalikan
```json
{
  "title": "Manajemen Stok",
  "data": "object", // paginator: { data, links, meta }
  "filters": "object"
}
```
Untuk `GET /admin/stok/{id}/riwayat`:
```json
{
  "title": "Riwayat Mutasi Stok",
  "data": "object" // paginator riwayat
}
```

Adendum t_e2268016 (kompatibel mundur, props Inertia di atas tidak berubah):
- Drawer riwayat pada halaman `Admin/Stok/Stok.jsx` memanggil URL yang sama dengan header `Accept: application/json` dan menerima JSON `{ "variant": "object", "movements": "object" }`, dengan `movements` memakai bentuk paginator Laravel yang sama (`data`, `links`, `meta`).
- Navigasi biasa (Inertia, tanpa header JSON) tetap menerima props halaman `Admin/Stok/Riwayat` seperti kontrak di atas. Tidak ada rute `/api` baru.

### Aturan validasi dan pesan galat
|- Validasi di server:
  - `POST /admin/stok`: `variant_id` wajib, `quantity` wajib (integer, tidak nol), `reason` wajib (string: restock|koreksi|rusak-hilang), `note` opsional.
|- Stok tidak boleh < 0 (ditangani oleh service stok).

### Status
LOCKED


## Daftar Produk (/product)

### Rute
- `GET /product` (tanpa nama rute)

### Siapa yang boleh mengakses
- Publik (tamu)

### Query yang diterima
- `search`, `category`, `size`, `min_price`, `max_price`, `in_stock`, `sort`, `page`

### Props yang dikembalikan
```json
{
  "title": "Produk",
  "products": "object",
  "categories": [
    { "id": "integer", "name": "string" }
  ],
  "filters": "object",
  "settings": {
    "whatsappNumber": "string"
  }
}
```
- `products`: paginator Laravel (data, links, meta).
- `categories`: array objek { id, name }.
- `filters`: object; `{}` saat tanpa query param. Selalu ter-encode sebagai JSON object, bukan array. Key hanya dari whitelist: search, category, size, min_price, max_price, in_stock, sort. Nilai kosong null.
- Contoh filters aktif: `{ "search": "daster", "category": "1", "size": ["M"], "min_price": "50000", "max_price": "150000", "in_stock": "true", "sort": "price_asc" }`.

### Aturan validasi dan pesan galat
- Tidak ada formulir. Filter/sort diterapkan di server; nilai tidak valid diabaikan (fallback sort `latest`).
- Galat validasi memakai mekanisme errors Inertia; pesan sukses lewat flash.

### Status
DRAFT

## Detail Produk (/product/{slug})

### Rute
|- `GET /product/{slug}`

### Siapa yang boleh mengakses
|- Tampil untuk tamu

### Query yang diterima
|- Tidak ada

### Props yang dikembalikan
```json
{
  "title": "string",
  "product": "object",
  "settings": {
    "whatsappNumber": "string",
    "storeName": "string"
  }
}
```

### Aturan validasi dan pesan galat
- Jika produk tidak ada, draf, atau diarsipkan, tampilkan halaman 404 yang ramah (data dari PRD bagian 5.3).
- Ambil produk dari database menggunakan `slug` dengan eager load kategori, varian, dan gambar.
- Batasi gambar hingga maksimal 8.
- Validasi server sisi client tidak diizinkan.

### Status
DRAFT

## Standarisasi Controller Admin (t_d2c95e63)

### Rute dan nama rute (tidak berubah)
- `GET /admin` -> `admin.index` -> `App\Http\Controllers\Admin\DashboardController@index`
- `GET /admin/pesan-masuk` -> `admin.pesan-masuk.index` -> `App\Http\Controllers\Admin\MessageController@index`
- `GET /admin/pesanan`, `GET /admin/pesanan/create`, `POST /admin/pesanan`, `GET /admin/pesanan/{id}`, `PUT/PATCH /admin/pesanan/{id}`, `DELETE /admin/pesanan/{id}`, `POST /admin/pesanan/{id}/batal`, `POST /admin/pesanan/{id}/kirim`, `GET /admin/pesanan/{id}/cetak` -> `admin.pesanan.*` -> `App\Http\Controllers\Admin\OrderController` (sudah kanonis, tidak diubah)

### Pemetaan lama -> baru
- `App\Http\Controllers\AdminDashboardController` (hapus) -> `App\Http\Controllers\Admin\DashboardController` (kanonis, dipakai rute `admin.index`)
- `App\Http\Controllers\AdminMessageController` (hapus, pindah) -> `App\Http\Controllers\Admin\MessageController` (baru, dipakai rute `admin.pesan-masuk.index`)
- `App\Http\Controllers\AdminOrderController` (hapus, stub mati tak dipakai rute) -> `App\Http\Controllers\Admin\OrderController` (kanonis yang sudah dipakai rute, tidak ditimpa)

### Siapa yang boleh mengakses
- Semua rute di atas: `admin` (middleware `auth` pada grup `prefix admin` di `routes/web.php`)

### Query yang diterima
- Tidak berubah oleh kartu ini. `GET /admin/pesan-masuk`: paginasi standar (`page`, `per_page` bawaan 20).

### Props yang dikembalikan
- `GET /admin`: props dari `Admin\DashboardController@index` apa adanya (komponen `Admin/Dashboard/Index`): `{ "title": "string", "data": "object", "settings": "object" }`. Catatan: bagian LOCKED `Halaman: Admin Dashboard (AdminDashboardController)` di atas TIDAK diubah di kartu ini;props kanonis berbeda key (`data.omzetHariIni` dkk vs `stats.todayRevenue` dkk) dan perlu koordinasi frontend (t_3879c444) sebelum bagian LOCKED itu dimutakhirkan.
- `GET /admin/pesan-masuk`: `{ "title": "Pesan Masuk", "messages": "object" }`, `messages` paginator Laravel (`data`, `links`, `meta`). Sama seperti sebelumnya; hanya namespace controller dan path komponen yang berubah (`AdminPesanMasuk` -> `Admin/PesanMasuk/Index` sesuai standar `docs/refactor-admin-standard.md`, komponen `Index.jsx` sudah ada dan membaca `messages.data`).
- Rute pesanan: props tidak berubah di kartu ini (dirender `Admin/Order/Index`, `Admin/Order/Show` oleh `Admin\OrderController` yang sudah ada).

### Aturan validasi dan pesan galat
- Tidak ada formulir baru di kartu ini. Galat validasi memakai mekanisme errors Inertia; pesan sukses lewat flash.

### Status
DRAFT
