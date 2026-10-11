# Laporan Defect: MassAssignmentException saat Menyimpan/Mengupdate Kategori di `/admin/kategori`

## 1. Informasi Defect
- **Komponen:** Backend / Model (`App\Models\Category`, `CategoryService`)
- **Severity:** High
- **Prioritas:** P0
- **Status:** Dikonfirmasi melalui inspeksi kode sumber.

## 2. Akar Masalah (Root Cause)
Model `App\Models\Category` menggunakan PHP attribute untuk mendefinisikan fillable:
```php
#[Fillable(['parent_id', 'name', 'slug'])]
```
Namun, Eloquent Laravel tidak mendukung proteksi *mass assignment* melalui atribut ini. Ketika `CategoryService` memanggil `Category::create()` atau `$category->update()`, aplikasi melempar `MassAssignmentException` karena tidak ada kolom yang dianggap fillable oleh Eloquent.

## 3. Rekomendasi Perbaikan
Ubah definisi atribut fillable pada `app/Models/Category.php` menjadi properti standar Eloquent:
```php
protected $fillable = [
    'parent_id', 
    'name', 
    'slug'
];
```
Hapus import dan penggunaan attribute `#[Fillable(...)]`.
