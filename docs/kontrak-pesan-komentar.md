## Admin Komentar Pesan (/admin/pesan-masuk/{pesan}/komentar)

### Rute
- nama_rute: `admin.pesan-masuk.komentar.store`
- path: `/admin/pesan-masuk/{pesan}/komentar`
- method: `POST`

### Akses
- peran: `admin`

### Props
- N/A (Mengembalikan redirect back)

### Status
DRAFT

### Aturan validasi
- `isi`: wajib, string, maksimal 1.000 karakter.
