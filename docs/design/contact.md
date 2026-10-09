# Spesifikasi Layar: Kontak Kami (/kontak-kami)

## Tujuan
Halaman kontak publik yang menyajikan informasi toko (alamat, jam buka, nomor WhatsApp, email, Instagram, tautan peta) serta formulir kontak bagi pengunjung untuk mengirimkan pesan yang akan disimpan ke database (`contact_messages`).

## Entry & Exit Point
- **Entry**: `/kontak-kami` (dari menu header atau footer).
- **Exit**: Beranda (`/`), katalog (`/product`), atau tautan eksternal (WhatsApp, Instagram, Peta).

## Struktur Layout (Wireframe Teks)
```
┌────────────────────────────────────────────────────────────┐
│ Beranda / Kontak kami                                      │
├────────────────────────────────────────────────────────────┤
│ Hubungi kami (Young Serif 40px)                            │
├─────────────────────────────┬──────────────────────────────┤
│ Kolom Kiri: Info Toko       │ Kolom Kanan: Formulir Pesan  │
│ • Alamat: [CONTOH]          │ • Nama lengkap *             │
│ • Jam buka: [CONTOH]        │   [________________________] │
│ • WhatsApp: [CONTOH]        │ • Kontak (No. HP / Email) *  │
│ • Email: [CONTOH]           │   [________________________] │
│ • Instagram: [CONTOH]       │ • Pesan (maks. 1000 kar.) *  │
│ • Tautan peta               │   [                        ] │
│                             │   [________________________] │
│                             │ [ Kirim pesan ]              │
└─────────────────────────────┴──────────────────────────────┘
```
- **Desktop**: Dua kolom seimbang (kiri: info toko berlabel, kanan: formulir kontak bergaris bawah).
- **Mobile**: Info toko di atas, formulir kontak di bawahnya.

## Hirarki Visual & Aksi Utama/Sekunder
- **Judul Halaman**: "Hubungi kami" (Young Serif 40px).
- **Tombol Kirim**: Tombol utama (`--pandan`), lebar penuh kolom formulir, tinggi 44px.
- **Isian Teks**: Bergaris bawah 1px `--arang`, tanpa kotak, label kecil di atas.

## Komponen & Perilaku
### Kolom Kiri: Informasi Toko
- Daftar berlabel dari tabel `settings` (alamat, jam buka, nomor WhatsApp, email, Instagram, tautan peta).
- Semua data yang belum diatur pemilik diberi label `[CONTOH]`.
- Tautan peta membuka URL eksternal di tab baru (`target="_blank"`). Nomor WhatsApp membuka chat WhatsApp langsung.

### Kolom Kanan: Formulir Kontak
- **Nama**: isian teks bergaris bawah, wajib.
- **Kontak**: isian teks bergaris bawah (nomor HP atau email), wajib.
- **Pesan**: area teks (textarea) bergaris bawah, wajib, maksimal 1.000 karakter, dengan penghitung karakter real-time.
- **Honeypot**: kolom jebakan spam tersembunyi (`_hp_field`) untuk menangkap bot.
- **Validasi Klien & Server**: validasi kolom kosong dan panjang maksimum.

## State & Microcopy
### Default
- Formulir kosong, informasi toko dimuat dari pengaturan.

### Loading
- Tombol kirim menampilkan status "Mengirim..." dan dinonaktifkan saat pengiriman berlangsung.

### Success (Pesan Berhasil Terkirim)
- Setelah berhasil dikirim, formulir digantikan oleh kotak pesan sukses:
  - Judul: "Pesan terkirim"
  - Deskripsi: "Terima kasih sudah menghubungi kami. Pesan Anda telah diterima dan kami balas secepatnya."
  - Tombol: "Kirim pesan lain" (mengembalikan formulir kosong).

### Error (Gagal Mengirim / Validasi Gagal / Terlalu Banyak Percobaan)
- Galat validasi: pesan error berwarna `--cabai` di bawah isian yang bermasalah.
- Galat server / rate limit (lebih dari 3 kiriman per 10 menit per IP):
  - Pesan peringatan: "Terlalu banyak percobaan pengiriman pesan. Coba lagi dalam beberapa menit."

### Disabled
- Tombol kirim dinonaktifkan selama proses pengiriman (`submitting`).

## Validasi, Urutan Fokus, Konsekuensi Aksi
- Nama: wajib, minimal 2 karakter.
- Kontak: wajib, format email yang valid atau nomor HP yang valid (minimal 10 digit).
- Pesan: wajib, 1 hingga 1,000 karakter.
- Honeypot: harus kosong; jika terisi oleh bot, permintaan diabaikan atau ditolak diam-diam.
- Rate limiting: maksimal 3 kiriman per 10 menit per alamat IP.
- Setelah sukses, data disimpan ke tabel `contact_messages` dengan kolom `dibaca_at = null`, dan muncul di dashboard admin (`/admin/pesan-masuk`).

## Responsif
- Mobile (< 768px): Kolom info toko di atas, formulir pesan di bawah.
- Desktop (>= 768px): Dua kolom berdampingan (kiri info, kanan formulir).

## Microcopy
### Formulir
- Label Nama: "Nama lengkap"
- Label Kontak: "Nomor HP atau email"
- Label Pesan: "Pesan"
- Placeholder Pesan: "Tuliskan pertanyaan atau pesan Anda di sini..."
- Tombol: "Kirim pesan"
- Tombol Loading: "Mengirim..."

### Pesan Sukses
- "Pesan terkirim. Kami balas secepatnya"

### Pesan Error Validasi
- "Nama wajib diisi"
- "Kontak wajib diisi dengan nomor HP atau email yang valid"
- "Pesan wajib diisi (maksimal 1.000 karakter)"
- "Terlalu banyak percobaan pengiriman. Coba lagi nanti."

## Aksesibilitas & Fokus Keyboard
- Urutan fokus: Info toko tautan → Input Nama → Input Kontak → Textarea Pesan → Tombol Kirim Pesan.
- Setiap isian memiliki label yang terhubung secara eksplisit (`htmlFor` / `id`).
- Pesan galat terhubung menggunakan `aria-describedby`.
- Kontras teks memenuhi WCAG AA.
- Fokus ring pandan terlihat.

## Kebutuhan Data/Props
### Data dari Backend (props Inertia)
1. `settings` (object):
   - alamat (`[CONTOH] ...`)
   - jam_buka (`[CONTOH] ...`)
   - whatsapp (`[CONTOH] ...`)
   - email (`[CONTOH] ...`)
   - instagram (`[CONTOH] ...`)
   - peta_url (`[CONTOH] ...`)

### Alur Pengiriman (POST request)
- Endpoint: `POST /kontak-kami`
- Payload: `nama`, `kontak`, `pesan`, `_hp_field` (honeypot).
- Respons sukses: status 200/302 dengan flash message / prop sukses, mereset formulir di frontend.

## Daftar Periksa (Self-Review)
- [ ] Sesuai PRD bagian 5.4 (info toko dari pengaturan, formulir kontak wajib nama/kontak/pesan max 1000 karakter, disimpan ke `contact_messages`, perlindungan honeypot dan rate limit 3 per 10 menit per IP, pesan sukses menggantikan formulir) dan design.md bagian 9.5 (dua kolom, isian bergaris bawah tanpa kotak, label di atas).
- [ ] Tanpa fitur terlarang (keranjang, checkout, wishlist, ulasan, voucher, notifikasi, lupa password, multi-gudang, ekspor Excel, aplikasi mobile).
- [ ] State default, loading, success, error, disabled terdokumentasi.
- [ ] Responsif untuk 360, 768, 1024, 1280px.
- [ ] Aksesibilitas WCAG AA terpenuhi.
- [ ] Props Inertia didefinisikan dengan jelas.

## Handoff
### Ke Frontend
- File spesifikasi: `docs/design/contact.md`.
- Komponen dasar: gunakan komponen dari `K8` (Header, Footer, IsianTeksGarisBawah, TombolUtama).
- State lokal: `form` (nama, kontak, pesan), `submitting`, `submitted` (sukses), `errors`.

### Ke Backend melalui Tech Lead
- Props Inertia: `settings` (info toko).
- Endpoint POST `/kontak-kami`: validasi server-side, cek honeypot, cek rate limiting (3 request / 10 menit / IP), simpan ke tabel `contact_messages`.

### Ke QA
- Verifikasi informasi toko dimuat dengan benar dari pengaturan.
- Verifikasi validasi klien dan server untuk nama, kontak, dan pesan (wajib, max 1000 karakter).
- Verifikasi pesan sukses menggantikan formulir setelah pengiriman berhasil.
- Verifikasi kiriman masuk ke tabel `contact_messages` dan tampil di `/admin/pesan-masuk`.
- Verifikasi perlindungan honeypot (isian tersembunyi terisi -> abaikan).
- Verifikasi rate limit (kirim 4 kali berturut-turut memicu pesan batas percobaan).

## Pertanyaan Terbuka / Asumsi
1. **Format Kontak**: Apakah kolom kontak membedakan antara nomor HP dan email secara ketat?
   - Asumsi: Validasi menerima string yang memuat format email valid atau angka telepon valid (minimal 10 digit).
   - NON-BLOCKING.

