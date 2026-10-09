# Spesifikasi Layar: Laporan (/admin/laporan)

## Tujuan
Halaman visualisasi dan rincian omzet penjualan.

## Komponen & Perilaku
- Periode: hari ini, 7 hari, 30 hari, bulan ini, rentang kustom.
- Ringkasan: omzet, total pesanan, rata-rata nilai pesanan.
- Rincian: per hari (tabel + grafik Recharts), per produk, per kategori, per kanal.
- Omzet dihitung dari pesanan `dibayar`, `dikemas`, `dikirim`, `selesai`.
- Ekspor CSV.
