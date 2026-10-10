# Catatan Frontend: Standarisasi Struktur Admin

Tanggal: 10 Oktober 2026
Assignee: frontenddeveloper

Tugas: Memindahkan komponen Inertia admin yang masih flat (`resources/js/Pages/Admin/*.jsx`) ke struktur standar (`resources/js/Pages/Admin/*/Index.jsx`).

Perubahan:
- Memindahkan `Akun.jsx` -> `Akun/Index.jsx`
- Memindahkan `Kategori.jsx` -> `Kategori/Index.jsx`
- Memindahkan `Pengaturan.jsx` -> `Pengaturan/Index.jsx`
- Memindahkan `Produk.jsx` -> `Produk/Index.jsx`
- Menghapus `Dashboard.jsx`, `Laporan.jsx`, `Pesanan.jsx`, `PesanMasuk.jsx` karena duplikat dengan `Index.jsx` di folder masing-masing yang sudah terstandarisasi.
- Mengupdate path import `AdminLayout` di komponen yang dipindahkan (`../../Layouts/AdminLayout` -> `../../../Layouts/AdminLayout`).

Catatan:
- Struktur komponen sekarang konsisten sesuai `docs/refactor-admin-standard.md`.
- `Admin/Stok/Stok.jsx` dibiarkan karena spesifik (bukan Index), perlu konfirmasi apakah harus dipindah ke `Index.jsx`. (Untuk saat ini, mengikuti pola Admin lain, seharusnya jadi Index.jsx).
- Perlu verifikasi rute dari Backend (t_d2c95e63) untuk memastikan tidak ada rute yang rusak akibat perubahan lokasi file komponen.
