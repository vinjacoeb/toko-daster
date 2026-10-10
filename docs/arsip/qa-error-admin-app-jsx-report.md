# Laporan QA: Error `TypeError: pages[name] is not a function` dalam Resolusi Komponen Inertia

## ID dan Judul
QA-001: Error `TypeError` pada Resolusi Komponen Inertia di `app.jsx`

## Severity dan Prioritas
- **Severity**: High
- **Prioritas**: P1

## Komponen
Frontend (`resources/js/app.jsx`)

## Lingkungan
- **URL**: `/admin/*`
- **Browser**: Tidak spesifik (terjadi di client-side)

## Prasyarat
- Aplikasi mencoba merender komponen yang dipanggil dari server (Inertia controller).
- Jika nama komponen yang dikirim dari server tidak cocok dengan file yang ada di `resources/js/Pages/`, maka terjadi error.

## Langkah Reproduksi
1. Navigasi ke rute `/admin` atau sub-rute admin mana pun yang memicu resolusi komponen Inertia.
2. Jika terjadi ketidaksesuaian antara nama komponen yang dikirim server dan file yang ada, aplikasi crash.
3. Konsol browser menampilkan `TypeError: pages[name] is not a function`.

## Hasil Aktual
Aplikasi crash dengan `TypeError` dan layar putih (blank screen) karena Promise tidak ditangani dengan baik saat `pages[name]` bernilai `undefined`.

## Hasil yang Diharapkan
Aplikasi seharusnya memberikan pesan kesalahan yang informatif di konsol atau menangani kasus di mana komponen tidak ditemukan, daripada crash.

## Bukti
- Pesan kesalahan di konsol browser menunjukkan `TypeError: pages[name] is not a function` pada `app.jsx:9:44`.
- `pages` dari `import.meta.glob` mengembalikan objek di mana `pages[name]` tidak selalu ada atau tidak selalu merupakan fungsi jika path salah.

## Dugaan Penyebab
Fungsi `resolve` di `resources/js/app.jsx` tidak memvalidasi keberadaan komponen sebelum mencoba memanggilnya (`()`).

## Rekomendasi Perbaikan
Ubah fungsi `resolve` di `resources/js/app.jsx` untuk memvalidasi keberadaan halaman:

```javascript
resolve: (name) => {
  const pages = import.meta.glob('./Pages/**/*.jsx');
  const path = `./Pages/${name}.jsx`;
  
  if (!pages[path]) {
    throw new Error(`Halaman ${name} tidak ditemukan di ${path}`);
  }
  
  return pages[path]();
},
```
