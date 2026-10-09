# Langkah Pemilik

## Prasyarat
- Selesaikan tugas K1 jika belum; database `toko-daster` (MySQL) harus sudah ada dan dapat terhubung.
- Install PHP 8.x (CLI), Composer, Node.js (LTS), Git, dan MySQL. Composer harus dapat dieksekusi (`composer --version`). Buat `toko-daster` di MySQL dengan karakter `utf8mb4_unicode_ci`.

## Langkah

### 1. Dapatkan URL dan kredensial .env
- Folder workspace: `C:/Users/LENOVO/Downloads/toko-daster`
- File environment: `.env.example` (cadangan); .env akan dibuat oleh installer Laravel secara otomatis.
- Isi .env (termasuk `APP_NAME`, `APP_URL`, `APP_LOCALE`, dan semua `DB_*`) dengan nilai .env.example, lalu tulis ulang kredensial DB sendiri. **Jangan pernah membuka, menyalin, atau mengedit .env secara manual**.

### 2. Buat database MySQL `toko-daster`
```sql
CREATE DATABASE toko_daster CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Eksekusi `storage:link`
Jika muncul pesan kesalahan hak akses di Windows, jalankan terminal sebagai Administrator dan jalankan `php artisan storage:link` dari workspace.

### 4. Jalankan frontend dan backend
- Buka **dua terminal** terpisah dari folder workspace ini:
  - Terminal A: `npm run dev`
  - Terminal B: `php artisan serve`
- Kedua terminal akan mulai berjalan; gunakan URL dari terminal B (`http://127.0.0.1:8000`).

### 5. Verifikasi halaman Beranda sementara
Buka `http://127.0.0.1:8000` di browser dan verifikasi:
- Loader awal menampilkan judul halaman "Selamat datang di Toko Daster"
- Halaman selesai dimuat dengan benar (tidak stuck).

### 6. Perbarui kartu
Setelah halaman Beranda terlihat, balas `sudah` di kartu K1 dan lakukan **Unblock**. Card sedang menunggu tindakan pemilik.

## Penting
- .env milik pemilik; DevOps tidak boleh menampilkan, memindahkan, atau memodifikasinya. Hanya `.env.example` yang boleh diedit.
- Jangan menjalankan `php artisan migrate` kecuali pemilik membuka akses ke backenddeveloper melalui poin berhenti.
- Catatan perubahan disimpan di `docs/catatan-devops.md`. Jangan tulis .env ke catatan.
- Jika instalasi Laravel/gambarannya rusak, buat ulang dari Laravel 11 stabil terbaru melalui composer.
