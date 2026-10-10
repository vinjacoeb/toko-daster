# Laporan Analisis QA: Error pada Halaman /product (error14.png)

## 1. Ringkasan Masalah
Saat mengakses halaman publik `/product` tanpa parameter filter/sort di URL, aplikasi mengalami crash (White Screen / React Error Boundary) dengan pesan:
`TypeError: Cannot convert undefined or null to object` pada `sort (<anonymous>)`, yang dipicu oleh inisialisasi `useState` pada komponen `Produk.jsx` baris 21.

## 2. Analisis Teknis & Akar Masalah (Root Cause)
1. **Backend (`ProductController.php`):**
   Pada method `index()`, controller mengembalikan props Inertia:
   ```php
   'filters' => request()->only(['search', 'category', 'size', 'min_price', 'max_price', 'in_stock', 'sort']),
   ```
   Ketika tidak ada parameter request (poblikasi awal / tanpa filter), `request()->only(...)` mengembalikan array kosong `[]`.
   Dalam PHP, array kosong `[]` saat di-serialize oleh `json_encode` menjadi JSON array `[]`, **bukan** JSON object `{}`.

2. **Frontend (`Produk.jsx`):**
   Di sisi React (`Produk.jsx` baris 12 & 21):
   ```javascript
   const { products, categories, filters } = usePage().props;
   const [sort, setSort] = useState(filters.sort || 'terbaru');
   ```
   - Karena `filters` diterima sebagai array `[]` (bukan object `{}`), akses `filters.sort` tidak mengembalikan `undefined`, melainkan mengembalikan method bawaan JavaScript yaitu **`Array.prototype.sort`** (sebuah fungsi).
   - React `useState` menerima fungsi tersebut dan menganggapnya sebagai *lazy initial state initializer function*, sehingga React **mengeksekusi** fungsi tersebut (`filters.sort()`) saat inisialisasi *state*.
   - Karena `Array.prototype.sort` dipanggil tanpa konteks array yang valid, JavaScript melempar `TypeError: Cannot convert undefined or null to object`.

## 3. Rekomendasi Perbaikan Backend
Backend developer (`ProductController.php`) perlu memastikan bahwa variabel `filters` yang dikirim ke Inertia selalu berbentuk objek/associative array yang di-encode sebagai objek JSON, meskipun kosong.

Contoh perbaikan di `App\Http\Controllers\ProductController.php`:
```php
'filters' => (object) request()->only(['search', 'category', 'size', 'min_price', 'max_price', 'in_stock', 'sort']),
```
atau menggunakan `collect()->all()` dengan memastikan tipe asosiatif, atau casting ke `(object)`.

## 4. Rekomendasi Pertahanan (Defense in Depth) Frontend (Opsional / Rekomendasi Tambahan)
Di `Produk.jsx`, pastikan `filters` divalidasi aman terhadap tipe array atau non-object:
```javascript
const safeFilters = (filters && !Array.isArray(filters)) ? filters : {};
const [sort, setSort] = useState(safeFilters.sort || 'terbaru');
```
