# Spesifikasi Layar: Admin Produk (/admin/produk)

## Tujuan
Halaman daftar produk untuk admin untuk mengelola (tambah, ubah, hapus, kelola varian, ubah status) katalog produk.

## Struktur Layout (Wireframe Teks)
```
┌────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Judul: Produk       [Tambah Produk +]          │
│           ├────────────────────────────────────────────────┤
│           │ [Cari..] [Filter Kategori ▾] [Filter Status ▾] │
│           ├────────────────────────────────────────────────┤
│           │ [ Tabel Produk (Tabel TanStack) ]              │
│           │ (Kolom: Foto, Nama, Kategori, Harga, Status,   │
│           │         Aksi: [Edit] [Arsip/Hapus])            │
│           ├────────────────────────────────────────────────┤
│           │             « 1  2  3  4  »                  │
└───────────┴────────────────────────────────────────────────┘
```
- **Tabel**: TanStack Table. Baris 48px, garis bawah 1px `--garis`, hover `--kapas`. Aksi di kolom terakhir (ikon + tooltip).

## Komponen & Perilaku
- **Tambah Produk**: Tombol utama di kanan atas. Mengarahkan ke form baru.
- **Form Produk**: Satu halaman, kiri isian utama, kanan panel foto (seret urutkan), bagian varian tabel edit di tempat. Tombol simpan lengket di bawah.
- **Filter**: Pencarian, filter status (`tayang`/`draf`/`arsip`), filter kategori.
- **Varian**: Tabel varian (ukuran, warna, SKU, harga, stok) yang bisa ditambah/dihapus/diubah.

## Handoff
### Ke Backend
- Data props: `products` (paginated), `categories`, `filters`.
- CRUD produk, varian, foto (validasi 8 foto/produk, maks 2MB, ekstensi valid).
- Soft delete.

### Ke Frontend
- Tabel dengan aksi (Edit, Hapus/Arsip), filter.
- Form produk (kiri: isian, kanan: foto + status).

### Ke QA
- Verifikasi CRUD produk dan varian.
- Verifikasi validasi foto dan stok.
- Verifikasi status produk memengaruhi publik.
- Verifikasi filter dan pencarian.
