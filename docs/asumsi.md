# Asumsi Backend Toko Daster (Task t_a0a22439)

1. Slug produk dan kategori dibuat unik; jika kosong saat input form (meskipun divalidasi required), string slug digenerate otomatis dari nama di frontend atau divalidasi ketat format huruf kecil, angka, dan tanda hubung (`/^[a-z0-9_-]+$/`).
2. Penghapusan produk menggunakan soft delete atau hapus relasi variant/images agar tidak merusak integritas riwayat pesanan (mengikuti aturan onDelete restrict/cascade pada migrasi).
3. Status produk menggunakan enum ['draf', 'tayang', 'arsip'] sesuai PRD bagian 8.
