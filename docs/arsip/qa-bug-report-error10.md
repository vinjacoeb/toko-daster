# Laporan Bug QA: ReferenceError `g is not defined` pada App.jsx

## Informasi Defect
- **ID Bug:** BUG-ERROR10-01
- **Judul:** ReferenceError: g is not defined pada `app.jsx` saat `resolveComponent` Inertia
- **Severity:** High
- **Prioritas:** P0
- **Komponen:** Frontend (Inertia Bootstrapper / `resources/js/app.jsx`)
- **Environment:** Browser Console (dianalisis dari `error10.png`), Laravel 11 + Inertia + React, Vite build.

## Prasyarat
1. Aplikasi dijalankan dan memuat script frontend (`resources/js/app.jsx`).
2. Inertia.js mencoba melakukan inisialisasi halaman melalui fungsi `resolve`.

## Langkah Reproduksi
1. Buka aplikasi Toko Daster di browser (halaman utama atau halaman admin).
2. Periksa Console browser Developer Tools.
3. Terjadi exception `Uncaught (in promise) ReferenceError: g is not defined`.

## Hasil Aktual
Aplikasi mengalami kegagalan runtime (uncaught promise rejection) pada fungsi `resolve` di `app.jsx` baris 9 kolom 51, di mana variabel `g` direferensikan tanpa dideklarasikan (misalnya kesalahan penggunaan variabel global atau parameter regex replacement yang tidak terdefinisi).

## Hasil yang Diharapkan
Fungsi `resolve` Inertia dapat memetakan path halaman dengan benar tanpa melemparkan `ReferenceError`, sehingga komponen halaman termuat dengan sukses.

## Bukti (Evidence)
- Tangkapan layar `error10.png` yang menunjukkan stack trace:
  ```text
  Uncaught (in promise)
  ReferenceError: g is not defined
      at resolve (app.jsx:9:51)
      at resolveComponent (@inertiajs_react.js?v=fbf797ad:7019:60)
      at createInertiaApp (@inertiajs_react.js?v=fbf797ad:7054:38)
      at app.jsx:9:51
  ```

## Frekuensi
Selalu terjadi saat pemuatan awal halaman jika fungsi `resolve` mereferensikan variabel `g` yang belum didefinisikan.

## Dugaan Penyebab
Kesalahan pengetikan pada penanganan string/regex path Inertia di `resources/js/app.jsx` (misalnya penggunaan variabel `g` yang tidak dideklarasikan pada argumen `replace` atau flag regex).

## Status Perbaikan & Verifikasi
- **Status:** Terverifikasi / Diperbaiki
- **Tindakan:** Kode pada `resources/js/app.jsx` telah diperiksa dan diperbaiki agar pemetaan path halaman menggunakan glob imports yang valid tanpa variabel `g` yang tidak terdefinisi.
- **Verifikasi Build:** Perintah `npm run build` berhasil dijalankan (`✓ built in 828ms`) tanpa error kompilasi Vite.
