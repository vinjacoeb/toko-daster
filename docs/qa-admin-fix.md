# Laporan QA: Fix error akses halaman admin

## Temuan
1.  **File Resolution Error (Inertia.js)**:
    -   Halaman `/admin/produk` gagal memuat karena controller (`Admin/ProductController`) merender `'Admin/Produk'` padahal file ada di `Pages/Admin/Produk/Index.jsx`.
    -   Halaman `/admin/kategori` likely memiliki masalah serupa.

2.  **Database/Model Errors (dari analisis sebelumnya)**:
    -   `MassAssignmentException` pada `Product` dan `Category` model.
    -   Missing column `variant_id` pada tabel `stock_movements`.

## Rekomendasi
-   Perbaiki *path* di controller untuk mengarah ke `/Index`.
-   Perbaiki `MassAssignmentException` dengan menyesuaikan `$fillable` atau menggunakan `guarded = []`.
-   Tambahkan migrasi untuk kolom yang kurang pada `stock_movements`.
-   Pastikan standarisasi nama kolom `stok` dan `stok_minimum` sesuai instruksi.
