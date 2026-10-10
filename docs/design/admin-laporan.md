# Spesifikasi Layar: Laporan (/admin/laporan)

## 1. Tujuan
Halaman visualisasi dan rincian omzet penjualan. Admin memantau kinerja toko
berdasarkan periode waktu, melihat rincian per hari, per produk, per kategori,
dan per kanal, serta mencetak laporan (A4 potret).

## 2. Entry & Exit Point
- **Entry**: sidebar admin → Laporan; deep link `/admin/laporan`.
- **Exit**: `/admin/pesanan` (detail pesanan), `/admin/produk` (detail produk).

## 3. Struktur Layout (Wireframe Teks)

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Laporan penjualan               [Cetak] [Unduh CSV]  │
│           ├──────────────────────────────────────────────────────┤
│           │ Periode: [ Hari ini ▾ ] [Custom: 10/10/26 - 10/10/26]│
│           ├──────────────────────────────────────────────────────┤
│           │ [ Kartu Omzet ] [ Kartu Jml Pesanan ] [ Kartu Rata2 ]│
│           ├──────────────────────────────────────────────────────┤
│           │ ┌─ Grafik Penjualan Harian ──────────────┐           │
│           │ │ (Recharts line/bar)                    │           │
│           │ └────────────────────────────────────────┘           │
│           ├──────────────────────────────┬───────────────────────┤
│           │ ┌─ Produk Terlaris ────────┐ │ ┌─ Per Kanal ───────┐ │
│           │ │ 1. Daster A ... (Rp..)   │ │ (Pie/Bar)         │ │
│           └──────────────────────────────┴───────────────────────┘
└──────────────────────────────────────────────────────────────────┘
```

- Kerangka admin standar (design.md bagian 10).
- Tombol aksi: Cetak (ikon printer, `design-v1.1` bagian 4) dan Unduh CSV (ikon file, P1).

## 4. Komponen & Perilaku

### 4.1 Periode dan ringkasan
- Pilihan periode: Hari ini, 7 hari terakhir, 30 hari terakhir, bulan ini,
  rentang kustom (dua input tanggal). Query string `dari`, `sampai`.
- Kartu Ringkasan (3 kartu, sejajar):
  - Omzet (Total pendapatan pesanan).
  - Jumlah Pesanan (Count pesanan).
  - Rata-rata Nilai Pesanan (Omzet / Jumlah).
- Definisi Omzet: Jumlah `total` pesanan berstatus `dibayar`, `dikemas`,
  `dikirim`, `selesai`. Status `baru` dan `batal` diabaikan (PRD 6.7).

### 4.2 Grafik dan rincian
- Grafik Harian: Recharts line/bar. Garis `--pandan`, garis bantu jahitan.
  Menampilkan omzet per hari dalam rentang periode.
- Produk Terlaris: 10 produk dengan total qty terjual terbanyak.
- Kanal: Pie/bar chart rincian pesanan berdasarkan kanal (`whatsapp`,
  `marketplace`, `langsung`).

### 4.3 Cetak laporan (design-v1.1 bagian 4)
- Tombol "Cetak" → `window.print()`.
- Stylesheet cetak (`@media print`): A4 potret, margin 16mm, font Hanken Grotesk.
- Sembunyikan: sidebar, topbar, tombol aksi, periode, toast, latar berwarna.
- Isi: Nama toko (Young Serif 22pt), judul "Laporan penjualan", periode,
  tanggal cetak (WIB), tiga angka ringkasan (bingkai 0,5pt hitam), tabel per hari,
  10 produk terlaris, rincian per kanal, footer "Dicetak dari dashboard Toko Daster".
- Grafik diganti tabel pada cetakan. Baris tabel tidak terpotong antar halaman.

## 5. State & Microcopy
- Loading: skeleton (kartu statistik + area grafik).
- Empty: "Tidak ada data penjualan dalam periode ini."
- Error: "Laporan belum bisa dimuat. Coba lagi." + "Coba lagi".

## 6. Aksesibilitas
- Grafik: berikan label pada sumbu; pastikan kontras AA.
- Cetak: font hitam 11pt, bersih, terbaca.

## 7. Kebutuhan Data / Props Inertia
- `ringkasan`: `{ omzet, total_pesanan, rata_rata }`.
- `grafik_harian`: `[{ tanggal, omzet }]`.
- `produk_terlaris`: `[{ nama, total_qty, total_omzet }]`.
- `per_kanal`: `[{ nama_kanal, total_pesanan }]`.
- Key props snake_case Indonesia (PRD bagian 9).

## 8. Handoff
### Ke Frontend
- Komponen: `KartuStatistik`, `GrafikOmzet` (Recharts), `TabelTerlaris`, `CetakLaporan` (@media print).
- Prioritas wajib: ringkasan + grafik + cetak. CSV (P1) penyederhanaan aman.

### Ke Backend melalui Tech Lead
- Query omzet (total pesanan berstatus bayar/kemas/kirim/selesai, berdasar `ordered_at`).
- Cetak laporan (stylesheet cetak).

### Ke QA
- Verifikasi angka: hitung manual pesanan di DB vs total di laporan.
- Verifikasi cetak: layout A4 potret, sembunyikan sidebar/tombol, header/footer.
- Verifikasi omzet tidak menghitung status `baru` atau `batal`.

## 9. Asumsi
- A-A1-05: CSV laporan (P1) ditunda (sesuai aturan P1/P0).
- A-A1-06: Grafik diganti tabel saat cetak (bagian 4.3).

## 10. Usulan Perbaikan PRD
- Tambahkan definisi "omzet" secara eksplisit di cetakan laporan (apakah
  termasuk ongkir/diskon). Saat ini dihitung dari kolom `total` (netto).

