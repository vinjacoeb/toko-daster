# Laporan Bug: Error Saat Membuka Web (Vite Import Resolution)

## Informasi Bug
- **ID Bug:** BUG-FE-001
- **Komponen:** Frontend (`resources/js/Layouts/GuestLayout.jsx`)
- **Severity:** Critical / Blocker
- **Prioritas:** P0
- **Status:** Terbuka (Menunggu Perbaikan oleh Frontend Developer)
- **Pelapor:** QA Engineer (`qatesting`)

## Deskripsi Masalah
Saat pengguna membuka halaman web publik (`/`, `/product`, dll.), browser gagal memuat aplikasi React karena Vite mendeteksi *fatal import error*. Halaman tertutup oleh *overlay* error Vite dan seluruh console/network dipenuhi error 500.

## Pesan Error
```
[plugin:vite:import-analysis] Failed to resolve import "./components/Header" from "resources/js/Layouts/GuestLayout.jsx". Does the file exist?
```

## Analisis Akar Masalah (Root Cause)
Di dalam file `resources/js/Layouts/GuestLayout.jsx` baris 3 dan 4, terdapat instruksi *import*:
```javascript
import Header from './components/Header';
import Footer from './components/Footer';
```
Karena file `GuestLayout.jsx` berada di dalam folder `resources/js/Layouts/`, jalur `./components/Header` merujuk ke `resources/js/Layouts/components/Header.jsx` (yang tidak ada). 
Padahal komponen tersebut berada di `resources/js/components/Header.jsx`.

## Solusi / Perbaikan yang Direkomendasikan
Ubah jalur *import* pada `resources/js/Layouts/GuestLayout.jsx` menjadi:
```javascript
import Header from '../components/Header';
import Footer from '../components/Footer';
```

## Bukti
- Tangkapan layar: `error2.png` (tersimpan di lampiran task Kanban).
- Log Vite: `[plugin:vite:import-analysis] Failed to resolve import "./components/Header" from "resources/js/Layouts/GuestLayout.jsx"`.
