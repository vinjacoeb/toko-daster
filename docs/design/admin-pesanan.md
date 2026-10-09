# Spesifikasi Layar: Pesanan (/admin/pesanan)

## Tujuan
Halaman pengelolaan pesanan yang dicatat secara manual oleh admin.

## Komponen & Perilaku
- Formulir pesanan: nama pelanggan, no HP, alamat, kanal (whatsapp, marketplace, langsung), item pesanan (varian, jumlah, harga satuan snapshot), ongkir, diskon, catatan, tanggal pesanan.
- Status: `baru` -> `dibayar` -> `dikemas` -> `dikirim` -> `selesai` (atau `batal`).
- Kode otomatis: `TD-YYMMDD-001`. Total dihitung server.
- Stok berkurang saat pesanan dibuat, dikembalikan jika dibatalkan.
- Filter: status, kanal, rentang tanggal, pencarian.
- Cetak faktur sederhana.

## Handoff
### Ke Backend
- Snapshot data produk ke `order_items`.
- Pengurangan/pengembalian stok terintegrasi ke service stok.
- Validasi stok tidak cukup.

### Ke QA
- Verifikasi alur pesanan (pembuatan, perubahan status, pembatalan).
- Verifikasi dampak terhadap stok dan omzet laporan.
