# Laporan QA: Masalah Perhitungan Statistik Stok pada /admin/stok

## Deskripsi Defect
Statistik "menipis" dan "habis" pada halaman `/admin/stok` tidak menampilkan data aktual total seluruh varian, melainkan hanya menampilkan perhitungan berdasarkan data varian yang tampil pada halaman saat ini (paginated data).

## Lokasi
`resources/js/Pages/Admin/Stok/Stok.jsx`

```javascript
133|    const countMenipis = variants.filter(v => v.stock > 0 && v.stock <= (v.stock_minimum ?? 3)).length;
134|    const countHabis = variants.filter(v => v.stock <= 0).length;
```

## Dampak
Admin mendapatkan informasi yang salah mengenai jumlah produk yang menipis atau habis, karena hanya mencakup sebagian kecil data (per halaman) dan bukan keseluruhan inventaris.

## Rekomendasi
Perhitungan statistik "menipis" dan "habis" harus dilakukan di sisi backend (sebaiknya melalui query database) dan dikirimkan sebagai bagian dari props ke komponen `Stok.jsx`, sehingga data yang ditampilkan adalah data aktual seluruh sistem.
