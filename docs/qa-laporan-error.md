# Laporan Defect: Error pada `/admin/laporan`

## Informasi Defect
- **Judul:** Error SQL saat mengakses `/admin/laporan` (Unknown column 'stok' in 'where clause')
- **Komponen:** Backend (`App\Http\Controllers\Admin\ReportController`)
- **Severity:** High
- **Prioritas:** P0
- **Status:** Terbuka (Perlu Perbaikan oleh Backend Developer)

## Deskripsi Masalah
Saat mengakses halaman `/admin/laporan` di panel admin, terjadi error SQL:
`SQLSTATE[42S22]: Column not found: 1054 Unknown column 'stok' in 'where clause' (Connection: mysql, Host: 127.0.0.1, Port: 3306, Database: toko-daster, SQL: select count(*) as `aggregate` from `variants` where `stok` <= stok_minimum and `variants`.`deleted_at` is null)`

## Akar Masalah (Root Cause)
Pada `app/Http/Controllers/Admin/ReportController.php` baris 56 dan 98:
```php
$varianStokMenipis = Variant::where('stok', '<=', 'stok_minimum')->count();
...
$varianStokMenipisList = Variant::where('stok', '<=', 'stok_minimum')->with('product')->limit(5)->get();
```
Method `where('stok', '<=', 'stok_minimum')` menganggap `'stok_minimum'` sebagai string literal atau nilai parameter, bukan nama kolom database. Untuk membandingkan dua kolom dalam Eloquent/Query Builder, harus menggunakan `whereColumn('stok', '<=', 'stok_minimum')`.

## Langkah Perbaikan yang Diperlukan (Untuk Backend Developer)
Ubah pemanggilan di `app/Http/Controllers/Admin/ReportController.php`:
1. Baris 56:
   ```php
   $varianStokMenipis = Variant::whereColumn('stok', '<=', 'stok_minimum')->count();
   ```
2. Baris 98:
   ```php
   $varianStokMenipisList = Variant::whereColumn('stok', '<=', 'stok_minimum')
       ->with('product')
       ->limit(5)
       ->get()
       ...
   ```

## Bukti Pengujian & Verifikasi
- Log error database: `SQLSTATE[42S22]: Column not found: 1054 Unknown column 'stok' in 'where clause' ... where `stok` <= stok_minimum`
- Setelah diperbaiki dengan `whereColumn`, query akan membandingkan kolom `stok` dan `stok_minimum` secara benar pada tabel `variants`.
