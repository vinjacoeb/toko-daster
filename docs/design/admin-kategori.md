# Spesifikasi Layar: Kategori (/admin/kategori)

## Tujuan
Halaman untuk mengelola kategori produk (tambah, ubah, hapus). Bertingkat satu level (induk/anak).

## Struktur Layout (Wireframe Teks)
```
┌────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Judul: Kategori      [Tambah Kategori +]       │
│           ├────────────────────────────────────────────────┤
│           │ [ Tabel Kategori ]                             │
│           │ (Kolom: Nama, Slug, Induk, Aksi)               │
└───────────┴────────────────────────────────────────────────┘
```

## Komponen & Perilaku
- **Tambah**: Dialog untuk nama kategori, pilih induk.
- **Validasi**: Nama unik, tidak boleh menghapus kategori yang punya produk.

## Handoff
### Ke Backend
- CRUD kategori, hirarki satu level.

### Ke QA
- Verifikasi CRUD dan validasi penghapusan.
