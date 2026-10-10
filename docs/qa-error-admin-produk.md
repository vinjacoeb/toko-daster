# Laporan Defect: MassAssignmentException saat Merubah Status / Menyimpan Produk di `/admin/produk`

## 1. Informasi Defect
- **ID Kartu:** `t_a84aa9be`
- **Komponen:** Backend / Model (`App\Models\Product`, `ProductService`)
- **Severity:** Critical / High (Menyebabkan error 500 saat aksi simpan/ubah status produk di panel admin)
- **Prioritas:** P0
- **Status:** Dikonfirmasi melalui analisis screenshot error (`error15.png`) dan inspeksi kode sumber.

## 2. Pesan Error & Stack Trace
Berdasarkan `error15.png`:
- **Exception Class:** `Illuminate\Database\Eloquent\MassAssignmentException`
- **Pesan:** `Add [category_id] to fillable property to allow mass assignment on [App\Models\Product].`
- **Lokasi File:** `vendor\laravel\framework\src\Illuminate\Database\Eloquent\Model.php:703`

## 3. Akar Masalah (Root Cause)
Pada file `app/Models/Product.php`, model menggunakan PHP attribute:
```php
use Illuminate\Database\Eloquent\Attributes\Fillable;
// ...
#[Fillable([
    'category_id',
    'name',
    'slug',
    'description',
    'material',
    'care',
    'price',
    'price_crossed',
    'status',
    'featured',
])]
```
Namun, Eloquent Laravel secara native menentukan atribut yang diizinkan untuk *mass assignment* melalui properti *protected* `$fillable` (misalnya `protected array $fillable = [...]`). Atribut berbasis PHP (`#[Fillable]`) tidak dibaca secara otomatis oleh Eloquent untuk proteksi mass assignment standar. Akibatnya, ketika `ProductService::createProduct` atau `ProductService::updateProduct` memanggil `Product::create([...])` atau `$product->update([...])`, Laravel menganggap tidak ada kolom yang fillable dan melemparkan `MassAssignmentException`.

## 4. Rekomendasi Perbaikan untuk Backend Developer
Ubah definisi atribut fillable pada `app/Models/Product.php` dari PHP attribute menjadi properti standar Eloquent:
```php
protected $fillable = [
    'category_id',
    'name',
    'slug',
    'description',
    'material',
    'care',
    'price',
    'price_crossed',
    'status',
    'featured',
];
```
Hapus import dan penggunaan attribute `#[Fillable(...)]` yang tidak kompatibel dengan mekanisme mass assignment Eloquent standar pada versi ini.
