# Laporan Investigasi Defek & Error Web Toko Daster (QA Report)

Tanggal: 09 Oktober 2026
Pelapor: Senior QA Engineer (`qatesting`)
Status: Defek Teridentifikasi & Dilaporkan kepada Frontend Developer

## Ringkasan Eksekutif
Berdasarkan keluhan pengguna dan kegagalan proses build frontend (`npm run build`), ditemukan beberapa error sintaks, duplikasi deklarasi import, dan kesalahan jalur modul (*module resolution*) pada halaman-halaman Admin yang menyebabkan aplikasi web/frontend mengalami crash saat dikompilasi maupun diakses.

Sesuai protokol QA, QA tidak mengubah file kode secara langsung, melainkan mendokumentasikan temuan defek secara lengkap dan membuat kartu perbaikan (*kanban child tasks*) untuk ditangani oleh Frontend Developer.

---

## Daftar Defek (Bug Report)

### 1. Duplikasi Import `usePage` pada Halaman Admin
- **Komponen / File Affected**:
  - `resources/js/Pages/Admin/Dashboard.jsx`
  - `resources/js/Pages/Admin/Pesanan.jsx`
  - `resources/js/Pages/Admin/Kategori.jsx`
- **Severity**: High (P0)
- **Error Detail**:
  `[PARSE_ERROR] Identifier usePage has already been declared`
- **Deskripsi**: File-file tersebut mendeklarasikan `import { usePage } from '@inertiajs/react';` sebanyak dua kali pada baris awal, menyebabkan parser Rolldown/Vite gagal melakukan build.

### 2. Error Sintaks / Kurang Tag Penutup pada `PesanMasuk.jsx`
- **Komponen / File Affected**:
  - `resources/js/Pages/Admin/PesanMasuk.jsx`
- **Severity**: High (P0)
- **Error Detail**:
  `[builtin:vite-transform] Unexpected token` at line 40:1
- **Deskripsi**: Komponen `AdminPesanMasuk` kurang tag penutup `</div>` untuk kontainer utama dan tag penutup komponen `<AdminLayout>`, sehingga struktur JSX tidak valid.

### 3. Unresolved Import `AdminLayout` pada `Pengaturan.jsx`
- **Komponen / File Affected**:
  - `resources/js/Pages/Admin/Pengaturan.jsx`
- **Severity**: High (P0)
- **Error Detail**:
  `[UNRESOLVED_IMPORT] Could not resolve '../Layouts/AdminLayout' in resources/js/Pages/Admin/Pengaturan.jsx`
- **Deskripsi**: Jalur import `../Layouts/AdminLayout` tidak ditemukan dari direktori `resources/js/Pages/Admin/`. Seharusnya menggunakan `../../Layouts/AdminLayout`.

---

## Rekomendasi & Tindak Lanjut
1. **Frontend Developer** agar segera memperbaiki error di atas pada file-file terkait tanpa mengubah struktur fungsional yang sudah sesuai dengan PRD.
2. Setelah perbaikan diterapkan, jalankan `npm run build` untuk memastikan seluruh modul berhasil dikompilasi tanpa error.
3. Lakukan verifikasi ulang pembukaan halaman web dan panel admin.
