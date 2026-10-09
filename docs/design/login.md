# Spesifikasi Layar: Login Admin (/login)

## Tujuan
Halaman autentikasi bagi pengelola (admin) untuk masuk ke panel admin (`/admin/*`). Tidak ada pendaftaran publik dan tidak ada fitur lupa password di tahap 1.

## Entry & Exit Point
- **Entry**: `/login` (ketika mengakses rute admin tanpa sesi, atau navigasi langsung).
- **Exit**: `/admin` (jika berhasil login), atau kembali ke halaman publik.

## Struktur Layout (Wireframe Teks)
```
┌───────────────────────────────────────┬────────────────────────────────────┐
│ Kiri: Latar --pandan                  │ Kanan: Formulir Masuk              │
│                                       │                                    │
│   Daster                              │   Masuk                            │
│   (wordmark besar, --kapas)           │                                    │
│                                       │   Email                            │
│   ─── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──  │   [______________________________] │
│   Dashboard pengelola                 │                                    │
│                                       │   Password                         │
│                                       │   [______________________________] │
│                                       │                                    │
│                                       │   [ Masuk ]                        │
│                                       │                                    │
└───────────────────────────────────────┴────────────────────────────────────┘
```
- **Desktop**: Layout dua kolom simetris. Kolom kiri berlatar belakang `--pandan` dengan wordmark `--kapas` besar dan satu garis jahitan; tanpa ilustrasi. Kolom kanan berisi formulir masuk dengan judul besar "Masuk" (Young Serif 40px), isian bergaris bawah, dan tombol utama selebar kolom (radius 4px).
- **Mobile**: Kolom kiri disembunyikan sepenuhnya; wordmark kecil muncul di atas formulir masuk.

## Hirarki Visual & Aksi Utama/Sekunder
- **Judul Formulir**: "Masuk" (Young Serif 40px).
- **Tombol Utama**: "Masuk" (latar `--pandan`, teks putih, lebar penuh, radius 4px, tinggi 44px).
- **Isian Teks**: Bergaris bawah 1px `--arang`, tanpa kotak, label kecil di atas.

## Komponen & Perilaku
### Panel Kiri (Desktop Saja)
- Latar belakang: `--pandan`.
- Teks: Wordmark "Daster" (Young Serif, 56px, `--kapas`).
- Garis jahitan tunggal (putus 2px, warna `--garis` atau `--putih` transparan tipis).
- Subteks: "Dashboard pengelola".

### Formulir Masuk (Panel Kanan)
- **Email**: Isian bergaris bawah, tipe email, wajib, autocomplete `email`.
- **Password**: Isian bergaris bawah, tipe password, wajib, autocomplete `current-password`.
- **Tombol Masuk**: Tombol utama (`--pandan`). Saat proses submit, menampilkan teks "Memproses..." dan dinonaktifkan.
- **Catatan Penting PRD**: Tidak ada tautan pendaftaran (`/register` dilarang, menghasilkan 404), dan tidak ada tautan "Lupa password".

## State & Microcopy
### Default
- Form email dan password kosong.

### Loading
- Tombol masuk menampilkan "Memproses..." dan dinonaktifkan saat verifikasi kredensial berjalan.

### Error (Login Gagal / Kredensial Salah / Terlalu Banyak Percobaan)
- Sesuai PRD, pesan kegagalan login bersifat **umum** dan tidak membocorkan apakah email terdaftar atau salah password:
  - Pesan: "Email atau password tidak cocok" (warna `--cabai`, latar `--cabai-muda`).
- Terlalu banyak percobaan (lebih dari 5 percobaan per menit per kombinasi email+IP):
  - Pesan tunggu: "Terlalu banyak percobaan. Coba lagi dalam 1 menit."

### Success
- Pengguna berhasil diautentikasi dan dialihkan secara otomatis ke `/admin`.

### Disabled
- Tombol masuk dinonaktifkan selama proses pengiriman (`submitting`).

## Validasi, Urutan Fokus, Konsekuensi Aksi
- Email: wajib, format email valid.
- Password: wajib, minimal 1 karakter (atau panjang sesuai kebijakan akun).
- Keamanan: Perlindungan rate limiting (5 percobaan per menit per email+IP).
- Sesi: Login berhasil membuat sesi admin baru dan meregenerasi token CSRF. Admin yang sudah login membuka `/login` akan otomatis diarahkan kembali ke `/admin`.

## Responsif
- Mobile (< 768px): Kolom kiri `--pandan` disembunyikan; wordmark kecil muncul di atas formulir; formulir mengisi lebar penuh layar dengan padding 20px.
- Desktop (>= 768px): Layout dua kolom berdampingan (kiri pandan, kanan formulir).

## Microcopy
### Judul
- "Masuk" (Young Serif 40px)

### Form Label & Placeholder
- Label Email: "Email"
- Placeholder Email: "nama@contoh.com"
- Label Password: "Password"
- Placeholder Password: "••••••••"
- Tombol: "Masuk"
- Tombol Loading: "Memproses..."

### Pesan Error
- Kredensial salah: "Email atau password tidak cocok"
- Rate limit: "Terlalu banyak percobaan. Coba lagi dalam 1 menit"
- Validasi kosong: "Email wajib diisi", "Password wajib diisi"

## Aksesibilitas & Fokus Keyboard
- Urutan fokus: Input Email → Input Password → Tombol Masuk.
- Label terhubung dengan input (`htmlFor` / `id`).
- Pesan galat terhubung dengan `aria-describedby`.
- Kontras warna memenuhi WCAG AA.
- Fokus ring pandan terlihat.

## Kebutuhan Data/Props
### Data dari Backend (props Inertia)
- Tidak ada props khusus yang wajib dari backend untuk halaman login kosong, kecuali state flash atau error validasi form standar dari Laravel Breeze/Jetstream yang disesuaikan.

### Alur Pengiriman (POST request)
- Endpoint: `POST /login`
- Payload: `email`, `password`.
- Respons sukses: Redirect ke `/admin`.
- Respons gagal: Redirect kembali dengan error bag (`email` / `general error`).

## Daftar Periksa (Self-Review)
- [ ] Sesuai PRD bagian 5.5 (email + password, tanpa link register, tanpa lupa password, pesan umum "Email atau password tidak cocok", rate limit 5 per menit, redirect ke `/admin` saat sukses dan sebaliknya jika sudah login, POST logout) dan design.md bagian 9.6 (layout dua kolom dengan panel kiri `--pandan` dan garis jahitan, formulir kanan dengan isian bergaris bawah).
- [ ] Tanpa fitur terlarang (keranjang, checkout, wishlist, ulasan, voucher, notifikasi, lupa password, multi-gudang, ekspor Excel, aplikasi mobile).
- [ ] State default, loading, error, success, disabled terdokumentasi.
- [ ] Responsif untuk 360, 768, 1024, 1280px.
- [ ] Aksesibilitas WCAG AA terpenuhi.

## Handoff
### Ke Frontend
- File spesifikasi: `docs/design/login.md`.
- Komponen dasar: gunakan komponen dari `K8` (IsianTeksGarisBawah, TombolUtama).
- State lokal: `form` (email, password), `processing`, `errors`.

### Ke Backend melalui Tech Lead
- Endpoint POST `/login` dan POST `/logout`.
- Pastikan rute `/register` mengembalikan 404.
- Pastikan rate limiting login diterapkan (5 per menit per kombinasi email+IP).
- Pesan error generik: "Email atau password tidak cocok".

### Ke QA
- Verifikasi halaman login tampil dua kolom di desktop dan satu kolom di ponsel.
- Verifikasi rute `/register` mengembalikan 404 (tidak ada pendaftaran publik).
- Verifikasi kredensial salah menampilkan pesan umum "Email atau password tidak cocok".
- Verifikasi login sukses mengarahkan ke `/admin`.
- Verifikasi admin yang sudah login saat membuka `/login` diarahkan kembali ke `/admin`.
- Verifikasi tombol kembali browser setelah logout tidak membuka halaman admin (sesi hancur).

## Pertanyaan Terbuka / Asumsi
1. **Penyimpanan Sesi**: Apakah sesi admin menggunakan session driver Laravel standar?
   - Asumsi: Ya, session cookie standar Laravel.
   - NON-BLOCKING.

