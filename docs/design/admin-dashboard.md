# Spesifikasi Layar: Dashboard Admin (/admin)

## Tujuan
Halaman utama admin setelah login yang menyajikan ringkasan statistik toko (omzet, pesanan, pesan), grafik penjualan, produk terlaris, pesanan terbaru, dan stok menipis sebagai pusat monitoring operasional.

## Entry & Exit Point
- **Entry**: `/admin` (setelah login sukses).
- **Exit**: `/admin/produk`, `/admin/kategori`, `/admin/stok`, `/admin/pesanan`, `/admin/pesan-masuk`, `/admin/laporan`, `/admin/pengaturan`, `/admin/akun` (navigasi sidebar).

## Struktur Layout (Wireframe Teks)
```
┌────────────────────────────────────────────────────────────┐
│ [Sidebar 240px: Logo, Menu: Dash, Prod, Kat, Stk, Pesan,   │
│  PesanMasuk, Lap, Pengaturan, Akun]                       │
├────────────────────────────────────────────────────────────┤
│ Bar atas: Judul halaman | Pencarian | Admin Profil         │
├────────────────────────────────────────────────────────────┤
│ ┌─ Kartu Statistik ─────┐ ┌─ Kartu Statistik ─────┐ ...    │
│ │ Omzet Hari Ini        │ │ Pesanan Perlu Proses  │        │
│ │ Rp 5.000.000          │ │ 12 Pesanan            │        │
│ │ ▲ 5%                  │ │                       │        │
│ └───────────────────────┘ └───────────────────────┘        │
├────────────────────────────────────────────────────────────┤
│ ┌─ Grafik Omzet 30 Hari ───────────────┐ ┌─ Produk Terlaris ┐│
│ │                                      │ │ 1. Daster A ...  ││
│ │                                      │ │ 2. Daster B ...  ││
│ └──────────────────────────────────────┘ └──────────────────┘│
├────────────────────────────────────────────────────────────┤
│ ┌─ Pesanan Terbaru ─────────────────────┐ ┌─ Stok Menipis ──┐│
│ │ ... tabel ...                         │ │ ... daftar ...  ││
└────────────────────────────────────────────────────────────┘
```
- **Sidebar**: Kiri (240px), latar `--pandan-gelap`, teks `--kapas`, item aktif latar `--pandan` + garis kiri 3px `--kunyit`.
- **Bar atas**: Putih 56px (judul halaman, pencarian cepat, nama admin + menu).
- **Konten**: Latar `--kapas`, kontainer 1280px.

## Hirarki Visual & Aksi Utama/Sekunder
- **Kartu Statistik**: Utama (data ringkas).
- **Grafik Omzet**: Visualisasi (Recharts).
- **Tabel Pesanan/Stok**: Aksi utama (klik menuju halaman detail/tabel penuh).

## Komponen & Perilaku
### Sidebar
- Ikon garis 20px. Menu: Dashboard, Produk, Kategori, Stok, Pesanan, Pesan masuk (dengan penghitung), Laporan, Pengaturan.
- Responsif: ponsel/tablet menjadi panel geser.

### Kartu Statistik
- Latar putih, garis 1px `--garis`, radius 4px, padding 20px.
- Label 14px `--abu`; angka 28px/600 `--arang`.
- Perbandingan persen dengan panah (naik: `--pandan`, turun: `--cabai`).

### Grafik Omzet (Recharts)
- Garis 2px `--pandan`.
- Tanpa isian area gradien (isian datar `--pandan-muda` boleh).
- Garis bantu garis jahitan. Tooltip kotak putih garis 1px.

## State & Microcopy
### Default
- Menampilkan data untuk hari ini dan 30 hari terakhir.

### Loading
- Skeleton untuk kartu statistik dan grafik.

### Empty
- Jika data kosong (misal toko baru), kartu menampilkan "0", grafik menampilkan area kosong.

## Handoff
### Ke Frontend
- File spesifikasi: `docs/design/admin-dashboard.md`.
- Komponen: SidebarAdmin, TopBarAdmin, KartuStatistik, GrafikOmzet (Recharts), TabelAdmin (TanStack Table).

### Ke Backend
- Data props: `stats` (omzet, pesanan_proses, pesan_belum_baca), `grafik_omzet`, `produk_terlaris`, `pesanan_terbaru`, `stok_menipis`.

### Ke QA
- Verifikasi angka cocok dengan laporan.
- Verifikasi grafik dan data kosong.
- Verifikasi responsif sidebar.
