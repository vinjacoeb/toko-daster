# Laporan QA: Error pada Landing Page (Beranda.jsx)

## 1. Ringkasan Temuan
Pengujian pada halaman Beranda (`/`) menghasilkan uncaught JavaScript exception `ReferenceError: slug is not defined`, yang menyebabkan halaman putih (rendering crash) saat React mencoba merender komponen `Beranda`.

## 2. Detail Defect Report

- **ID Defect:** BUG-LANDING-001
- **Judul:** `ReferenceError: slug is not defined` pada Render How To Order (`Beranda.jsx`)
- **Severity:** High
- **Prioritas:** P0 (Bloker Akses Landing Page)
- **Komponen:** Frontend / React (`resources/js/Pages/Beranda.jsx`)
- **Environment:**
  - URL: `/` (Landing Page)
  - Browser: Google Chrome / Chromium / Inertia React Client
  - Build / Commit: Terkini
- **Prasyarat:**
  - Akses halaman utama `/` (Beranda)
- **Langkah Reproduksi:**
  1. Jalankan aplikasi web Toko Daster.
  2. Buka browser dan navigasi ke URL root `/` (Beranda).
  3. Amati console browser.
- **Hasil Aktual:**
  - Halaman mengalami crash (blank screen) dan konsol menampilkan error:
    `Uncaught ReferenceError: slug is not defined at renderHowToOrder (Beranda.jsx:199:90)`
- **Hasil yang Diharapkan:**
  - Halaman Beranda (`/`) dirender dengan sukses tanpa error JavaScript, menampilkan bagian "Cara pesan" dengan teks deskripsi yang benar.
- **Bukti / Evidensi:**
  - Lampiran screenshot `error8.png` menunjukkan stack trace pada `renderHowToOrder (Beranda.jsx:199:90)`.
- **Frekuensi:** Selalu terjadi saat membuka Beranda (`/`).
- **Status:** Terbuka (Open)

## 3. Analisis Akar Masalah (Root Cause Analysis)
Pada file `resources/js/Pages/Beranda.jsx` baris 199:
```jsx
<p className="text-abu text-sm mt-1">dari `/product` atau `/product/{slug}`</p>
```
Dalam JSX, tanda kurung kurawal `{ ... }` digunakan untuk menyisipkan ekspresi JavaScript. Penulisan `{slug}` tanpa tanda kutip atau string literal menginstruksikan React untuk mengevaluasi variabel `slug`. Karena variabel `slug` tidak didefinisikan di dalam scope komponen `Beranda`, JavaScript melemparkan `ReferenceError: slug is not defined`.

## 4. Rekomendasi Perbaikan untuk Developer
Ubah teks pada baris 199 di `resources/js/Pages/Beranda.jsx` agar `{slug}` diperlakukan sebagai string literal, misalnya:
```jsx
<p className="text-abu text-sm mt-1">dari `/product` atau `/product/&#123;slug&#125;`</p>
```
atau menggunakan string literal escape / teks biasa:
```jsx
<p className="text-abu text-sm mt-1">dari `/product` atau `/product/{{slug}}`</p>
```
atau string teks biasa di dalam JSX:
```jsx
<p className="text-abu text-sm mt-1">{"dari `/product` atau `/product/{slug}`"}</p>
```
atau string literal sederhana jika tidak menggunakan backticks evaluasi.

## 5. Rekomendasi Go/No-Go
- **Status Rekomendasi:** **NO-GO** untuk rilis landing page sampai bug render (`ReferenceError`) ini diperbaiki oleh tim developer.
