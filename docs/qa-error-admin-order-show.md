# QA Report: Error pada Halaman Detail Pesanan (/admin/pesanan/{id})

## Ringkasan
Ditemukan error `TypeError: Cannot read properties of undefined (reading 'toLocaleString')` saat mengakses halaman detail pesanan di `/admin/pesanan/{id}`. Hal ini disebabkan oleh ketidaksesuaian nama properti yang digunakan di frontend (`Show.jsx`) dibandingkan dengan data yang dikirim oleh backend (`OrderItem` model).

## Detail Defect
- **ID:** DEFECT-001
- **Judul:** Error `toLocaleString` karena properti `item.price` dan `item.quantity` undefined di `Admin/Order/Show.jsx`.
- **Severity:** High (Halaman detail pesanan tidak dapat dibuka)
- **Prioritas:** P0
- **Komponen:** Frontend
- **Lokasi:** `resources/js/Pages/Admin/Order/Show.jsx`

## Analisis
- Backend (`OrderItem.php` & `OrderController.php`) menggunakan properti `harga` dan `qty` untuk item pesanan.
- Frontend (`Show.jsx`) mencoba mengakses `item.price` dan `item.quantity`, yang menghasilkan `undefined`.
- Saat memanggil `toLocaleString()` pada `undefined`, aplikasi mengalami crash.

## Rekomendasi
- Perbaiki `resources/js/Pages/Admin/Order/Show.jsx` untuk menggunakan `item.harga` dan `item.qty` sesuai dengan struktur data dari backend.

## Strategi Perbaikan
- Membuat child task untuk `frontend-developer` untuk memperbaiki pemetaan properti di `Show.jsx` — [[PROGRESS]]
