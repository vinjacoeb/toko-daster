# Spesifikasi Layar: Stok (/admin/stok)

## Tujuan
Halaman monitoring dan penyesuaian stok per varian.

## Komponen & Perilaku
- Tabel varian produk dengan stok. Filter: "menipis", "habis".
- Aksi penyesuaian stok (+/-) dengan alasan (restock, koreksi, rusak).
- Riwayat mutasi stok per varian (waktu, jumlah, alasan, pelaku).
- Satu service database untuk transaksi (row lock).

## Handoff
### Ke Backend
- Service stok, tabel `stock_movements`, transaksi database.

### Ke QA
- Verifikasi penyesuaian stok (+/-), riwayat, stok tidak negatif, stok menipis muncul.
