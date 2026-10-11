# QA Analysis: ReferenceError Link is not defined pada Admin Order / Produk

## 1. Ringkasan Kasus
- **Task ID:** `t_1f6b0895`
- **Judul Kartu:** error /admin/produk
- **Temuan Utama:** Terdapat ketidaksesuaian antara judul task (`/admin/produk`) dengan error sebenarnya yang dilaporkan pada komentar kartu. Error sebenarnya terjadi pada komponen `Pesanan` di `resources/js/Pages/Admin/Order/Index.jsx` (route `/admin/pesanan`), di mana tag `<Link>` digunakan tetapi belum di-import dari `@inertiajs/react`.

## 2. Bukti Error (Log / Stack Trace)
```
Uncaught ReferenceError: Link is not defined
    at Index.jsx:42:46
    at Array.map (<anonymous>)
    at Pesanan (Index.jsx:28:40)
    at Object.react_stack_bottom_frame (client-BMaikfqJ.js?v=fbf797ad:14142:12)
    at renderWithHooks (client-BMaikfqJ.js?v=fbf797ad:4400:19)
    at updateFunctionComponent (client-BMaikfqJ.js?v=fbf797ad:5775:16)
    at beginWork (client-BMaikfqJ.js?v=fbf797ad:6391:20)
    at runWithFiberInDEV (client-BMaikfqJ.js?v=fbf797ad:944:66)
    at performUnitOfWork (client-BMaikfqJ.js?v=fbf797ad:9148:92)
    at workLoopSync (client-BMaikfqJ.js?v=fbf797ad:9044:37)
```

## 3. Analisis Akar Masalah (Root Cause)
1. Pada `resources/js/Pages/Admin/Order/Index.jsx`:
   - Baris 2: `import { Head, usePage } from '@inertiajs/react';`
   - Baris 5: `export default function Pesanan()`
   - Baris 28: `orders.map((order) => (`
   - Baris 42: `<Link href={route('admin.pesanan.show', order.id)} className="text-pandan hover:underline">Detail</Link>`
2. Komponen menggunakan `<Link>`, namun identifier `Link` belum di-import dari `@inertiajs/react`.
3. Akibatnya, browser melemparkan `ReferenceError: Link is not defined` saat me-render tabel daftar pesanan.
4. Sementara itu, pada file `resources/js/Pages/Admin/Produk/Index.jsx`, pagination dan navigasi menggunakan tag HTML native `<a>`, dan seluruh JSX tag (`Head`, `Toast`, `AdminLayout`, `Button`) telah di-import dengan benar.

## 4. Tindakan & Delegasi Perbaikan
- Telah dibuat child task untuk frontend developer:
  - **Child Task ID:** `t_90a2178f`
  - **Assignee:** `frontend-developer`
  - **Deskripsi:** Menambahkan import `{ Link }` dari `@inertiajs/react` pada `resources/js/Pages/Admin/Order/Index.jsx`.

## 5. Status Verifikasi & Rekomendasi
- **Status:** Analisis selesai.
- **Rekomendasi:** Frontend developer menambahkan import `Link` pada `resources/js/Pages/Admin/Order/Index.jsx` dan menjalankan build verification `npm run build`.
