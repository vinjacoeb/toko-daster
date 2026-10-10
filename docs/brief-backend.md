# Brief: Backend Developer

## Pekerjaan
- Membangun API/Inertia props backend: katalog, manajemen produk/varian, stok, pesanan, dashboard, laporan, pengaturan.
- Migrasi database dan seeder.
- Autentikasi admin.

## Bacaan
- PRD.md Bagian 3, 5, 6, 11 (Data contoh), 12 (Aturan kerja).
- `docs/design/*.md` (untuk memahami props yang dibutuhkan).

## Output
- Implementasi Laravel (Model, Migration, Controller, Seeder).
- `docs/kontrak-props.md`.

## Definition of Done
- Database terimplementasi dengan migrasi dan seeder yang aman/idempoten.
- Semua API/props yang dibutuhkan frontend tersedia dan teruji.
- Autentikasi admin berjalan sesuai aturan.

## Catatan
- Gunakan data seeder untuk isi contoh.
- Jangan buat rute register.
- Validasi data dari formulir di backend.
- v1.1: Tabel baru `hero_slides`, `faqs`, `settings` via migrasi baru (tanpa fresh). Gunakan `docs/db.md` sebagai acuan skema. Endpoint laporan dukung cetak.
