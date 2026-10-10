# OrderItems Missing Columns Migration

## Ringkasan
Tabel `order_items` di toko-daster kini memiliki semua kolom yang disyaratkan oleh PRD:

| Kolom | Tipe | Null | Default | FK | Catatan |
|------|------|------|---------|-----|--------|
| id | bigIncrements | No | auto | — | Primary key |
| created_at | timestamp | No | current_timestamp | — | |
| updated_at | timestamp | No | current_timestamp | — | |
| deleted_at | timestamp | Yes | null | — | Soft delete |
| order_id | foreignId | Yes | null | FK → `orders` (restrict) | Relasi ke pesanan |
| variant_id | foreignId | Yes | null | FK → `variants` (restrict) | Relasi ke varian produk |
| product_id | foreignId | Yes | null | FK → `products` (set null) | Relasi ke produk |
| nama | string | Yes | null | — | Snapshot nama produk |
| warna | string | Yes | null | — | Snapshot warna |
| ukuran | string | Yes | null | — | Snapshot ukuran |
| harga | integer | No | 0 | — | Snapshot harga satuan (rupiah) |
| qty | integer | No | 1 | — | Jumlah item |

## Perubahan yang Dilakukan
1. **Migrasi**:
   - File: `database/migrations/2026_10_10_000000_add_missing_columns_to_order_items_table.php`
   - Diluncurkan: `php artisan migrate`
   - Status: ✅ [7] Ran

2. **Model** (`app/Models/OrderItem.php`):
   - Menghapus kolom lama `price` dan `quantity`, menambahkan `harga` dan `qty` (integer).
   - Memperbarui fillable, casts, relasi.

3. **Controller** (`app/Http/Controllers/AdminDashboardController.php`):
   - Memperbarui query untuk menampilkan snapshot di frontend: kini mengembalikan koleksi yang dipetakan dengan key `product_name` dan `total_sold`.

4. **Kontrak Props** (`docs/kontrak-props.md`):
   - Menambahkan halaman OrderItems Missing Columns Fix.

## Verifikasi
- `php artisan migrate:status`: ✅ [7] Ran
- `php -l` pada semua berkas PHP yang diubah: ✅ tanpa error
- `route:list`: ✅ tidak ada rute baru yang ditambahkan
- Output query pada `/admin`: ✅ tidak ada lagi QueryException

## Frontend Impact
- Data yang diterima frontend kini sesuai kontrak:
  - `product_name` (string)
  - `total_sold` (integer)
- Tidak ada perubahan pada data yang dikirim dari frontend; backend masih menghasilkan snapshot yang sama melalui OrderController.create.

## Asumsi & Catatan
- Tabel order_items saat ini kosong (data contoh belum di-seed).
- Seed dihentikan; seeder yang ada perlu diperbarui untuk mengisi kolom baru.

## File yang Terkena
- `docs/catatan-backend.md`
- `docs/db.md`
- `docs/kontrak-props.md`
- `database/migrations/2026_10_10_000000_add_missing_columns_to_order_items_table.php`
- `app/Models/OrderItem.php`
- `app/Http/Controllers/AdminDashboardController.php`
