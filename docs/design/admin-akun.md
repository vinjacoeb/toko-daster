# Spesifikasi Layar: Akun (/admin/akun)

## 1. Tujuan
Halaman pengelolaan akun administrator: ubah profil sendiri (nama, email),
ganti password sendiri, serta kelola admin lain (tambah, nonaktifkan).
Sesuai PRD 6.9 + PRD-v1.1 bagian 2 dan design-v1.1 bagian 5.

## 2. Entry & Exit Point
- **Entry**: menu nama admin di bar atas → "Akun"; deep link `/admin/akun`.
- **Exit**: tidak ada alur lanjutan (halaman terminal).

## 3. Struktur Layout (Wireframe Teks)

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Akun                                                 │
│           │ Kelola profil dan administrator toko.                │
│           ├──────────────────────────────────────────────────────┤
│           │ ┌─ Profil ─────────────────────────────────────────┐ │
│           │ │ Nama*  [Nama admin              ]                 │ │
│           │ │ Email* [admin@contoh.com        ]                 │ │
│           │ │ Password saat ini* [              ] (bila ubah    │ │
│           │ │   email)                        [Simpan profil]   │ │
│           │ └──────────────────────────────────────────────────┘ │
│           │ ┌─ Ganti password ───────────────────────────────┐ │
│           │ │ Password saat ini* [              ]              │ │
│           │ │ Password baru*     [              ] (min 10)     │ │
│           │ │ Ulangi baru*       [              ]              │ │
│           │ │                             [Ganti password]     │ │
│           │ └──────────────────────────────────────────────────┘ │
│           │ ┌─ Admin lain ─────────────────── [Tambah admin +]┐ │
│           │ │ NAMA        EMAIL        STATUS      AKSI        │ │
│           │ │ [CONTOH]…   …@…          Aktif       [Nonaktif]  │ │
│           │ │ (baris diri sendiri: label "Anda", tanpa tombol) │ │
│           │ └──────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

- Tiga kartu bertumpuk vertikal (design-v1.1 bagian 5), masing-masing
  formulir sendiri dengan tombol simpan sendiri; menyimpan satu bagian
  tidak mengirim bagian lain.
- Kartu putih, garis 1px `--garis`, radius 4px, padding 20-24px,
  lebar maks 720px (formulir tidak full 1280px agar mudah dipindai).
  `[ASUMSI A-A1-10]`.

## 4. Komponen & Perilaku

### 4.1 Bagian Profil
- Isian: Nama* (wajib, min 2), Email* (wajib, format email, unik antar admin).
- Mengubah email meminta password saat ini (isian muncul/wajib hanya bila
  email berubah — tampil selalu, ditandai "wajib bila mengubah email").
  `[ASUMSI A-A1-11]`.
- Tombol "Simpan profil" (utama). Sukses: toast "Profil disimpan."
  Bila email berubah, sebagian sistem meminta login ulang? TIDAK — sesi
  tetap berlaku (asumsi; backend B6 mengonfirmasi). `[ASUMSI A-A1-12]`.

### 4.2 Bagian Ganti password
- Isian: Password saat ini*, Password baru* (min 10 karakter, PRD 6.9),
  Ulangi password baru* (harus sama).
- Opsional namun disarankan: indikator kekuatan sederhana (teks "Lemah /
  Cukup / Kuat" — bukan meter warna saja). `[ASUMSI A-A1-13]`.
- Tombol "Ganti password" (utama). Sukses: toast "Password diganti." +
  formulir dikosongkan. Sesi lain tidak diputus di MVP (tanpa manajemen
  sesi; di luar scope).
- Salah password saat ini → error umum di bawah isian itu:
  "Password saat ini tidak cocok." (tidak membocorkan info lain).

### 4.3 Bagian Admin lain
- Tabel: Nama, Email, Status (badge Aktif/Nonaktif + kata), Aksi.
- Baris diri sendiri: label "Anda" + tanpa tombol aksi (tidak boleh
  menonaktifkan diri sendiri — tombol disembunyikan, bukan nonaktif).
- Tombol "Tambah admin" (utama, kanan atas kartu) → dialog:
  Nama*, Email* (unik), Password sementara* (min 10, dengan tombol
  "Buat acak" yang mengisi 12 karakter). `[ASUMSI A-A1-14]`.
  Sukses: toast "Admin {nama} ditambahkan." Admin baru status Aktif.
- Aksi Nonaktifkan: dialog konfirmasi "Nonaktifkan {nama} ({email})?" +
  teks "Mereka tidak bisa masuk lagi. Pesanan dan riwayat yang mereka buat
  tetap tersimpan." + [Batal] [Nonaktifkan].
- Aksi Aktifkan kembali: tombol sekunder "Aktifkan" (tanpa dialog, dengan
  toast "Admin {nama} diaktifkan kembali.").
- Admin nonaktif tidak bisa login (PRD 5.5); sesi aktif mereka berakhir?
  Asumsi: sesi berikutnya ditolak; sesi berjalan dibiarkan habis sendiri
  (MVP). `[ASUMSI A-A1-15]` — backend B6 mengonfirmasi.
- Tidak ada hapus admin permanen (konsisten dengan kebijakan tanpa hapus
  untuk data berriwayat).

## 5. Validasi & Aturan Tampil
- Error validasi tampil di bawah isian terkait (`aria-describedby`).
- Daftar pesan: "Nama wajib diisi (min 2 karakter).",
  "Masukkan email yang valid.", "Email ini sudah dipakai admin lain.",
  "Password saat ini tidak cocok.", "Password baru minimal 10 karakter.",
  "Ulangi password tidak sama.", "Password saat ini wajib diisi untuk
  mengubah email."
- Double-submit: tombol nonaktif selama request ("Menyimpan…").
- Tamu diarahkan ke `/login`. Seluruh halaman khusus admin login.

## 6. State & Microcopy

| State | Tampilan |
|---|---|
| Default | Tiga kartu terisi data profil + tabel admin |
| Loading | Skeleton 3 kartu (blok `--pasir`) |
| Error (gagal memuat) | Di dalam layout: "Data akun belum bisa dimuat. Coba lagi" + "Coba lagi" |
| Success profil | Toast "Profil disimpan." |
| Success password | Toast "Password diganti." + isian dikosongkan |
| Success tambah | Toast "Admin {nama} ditambahkan." + baris baru di tabel |
| Success nonaktif | Toast "Admin {nama} dinonaktifkan." + badge jadi Nonaktif |
| Success aktif | Toast "Admin {nama} diaktifkan kembali." |
| Empty (admin lain kosong — hanya diri sendiri) | Baris diri sendiri tetap tampil; tanpa pesan kosong khusus |

## 7. Responsif
- ≥768px: kartu maks 720px rata kiri; tabel admin penuh.
- <768px: kartu full-width padding 16px; tabel jadi daftar kartu per admin
  (nama + email + badge + tombol aksi); dialog penuh layar.

## 8. Microcopy (ringkasan)
- Judul: "Akun". Subjudul: "Kelola profil dan administrator toko."
- Bagian: "Profil", "Ganti password", "Admin lain".
- Label: "Nama", "Email", "Password saat ini", "Password baru",
  "Ulangi password baru", "Password sementara".
- Tombol: "Simpan profil", "Ganti password", "Tambah admin",
  "Nonaktifkan", "Aktifkan", "Buat acak", "Batal", "Coba lagi".
- Dialog tambah: "Tambah admin". Dialog nonaktif: "Nonaktifkan {nama}?"
  / "Mereka tidak bisa masuk lagi. Pesanan dan riwayat yang mereka buat
  tetap tersimpan."

## 9. Edge Case
- Email diubah ke email sendiri yang sama: password saat ini tidak diminta
  (tidak ada perubahan).
- Email dipakai admin nonaktif: tetap ditolak sebagai duplikat (asumsi;
  backend mengonfirmasi). `[ASUMSI A-A1-16]`.
- Menonaktifkan admin terakhir yang aktif selain diri sendiri: diizinkan
  dengan dialog (tidak ada batas min admin di MVP).
- Jaringan putus saat simpan: input tidak hilang, pesan "Gagal menyimpan.
  Periksa koneksi, coba lagi."
- Sesi habis: redirect `/login`.

## 10. Aksesibilitas
- Semua isian berlabel terhubung (`htmlFor`/`id`); error via
  `aria-describedby`; input password `autocomplete` sesuai
  (`current-password` / `new-password`).
- Badge Aktif/Nonaktif kata + warna, kontras AA.
- Dialog: `role="dialog"`, Esc tutup, fokus kembali ke pemicu.
- Urutan fokus per kartu mengikuti urutan baca.

## 11. Kebutuhan Data / Props Inertia
- `profil`: `{ nama, email }` (admin login).
- `admin`: `[{ id, nama, email, aktif, adalah_diri }]` (termasuk diri sendiri
  dengan penanda agar UI menyembunyikan aksinya).
- Aksi: simpan profil (`PATCH`, `{ nama, email, password_saat_ini? }`),
  ganti password (`PATCH`, `{ password_saat_ini, password_baru,
  password_baru_konfirmasi }`), tambah admin (`POST`, `{ nama, email,
  password }`), nonaktif/aktif (`PATCH .../{id}`, `{ aktif: false/true }`).
- Key snake_case bahasa Indonesia; kontrak final oleh backend.

## 12. Self-Review Checklist
- [x] Sesuai PRD 6.9 + PRD-v1.1 bagian 2 (profil nama/email + password saat
      ini, ganti password, kelola admin, min 10 karakter).
- [x] Konsisten design.md bagian 8 & design-v1.1 bagian 5 (tiga bagian
      bertumpuk, dialog konfirmasi, error di bawah isian).
- [x] Tanpa fitur terlarang (tanpa lupa password via email, tanpa register).
- [x] Semua state terdokumentasi. [x] Responsif 4 breakpoint.
- [x] Aksesibilitas dasar.

## 13. Handoff

### Ke Frontend
- Komponen reusable: `KartuAkun`, `FormProfil`, `FormPassword`,
  `TabelAdmin`, `DialogTambahAdmin`, `DialogNonaktifAdmin`, `Toast`.
- Prioritas wajib: tiga bagian + dialog + semua state.
  Penyederhanaan aman: indikator kekuatan password boleh teks saja.

### Ke Backend melalui Tech Lead
- Profil (nama/email unik; password saat ini wajib bila email berubah),
  ganti password (verifikasi + min 10 + hash), tambah admin, nonaktif/aktif.
- **Konflik skema, perlu keputusan Tech Lead**: tabel `users` di `docs/db.md`
  tidak memiliki kolom `aktif`, padahal PRD bagian 8 menetapkan
  `users(…, aktif)` dan UI butuh status Aktif/Nonaktif. Opsi: tambah kolom
  `aktif` boolean (migrasi baru, B6) atau pakai soft delete sebagai
  nonaktif. Backend (kartu B6) memutuskan; UI memakai flag `aktif` apa pun
  sumbernya.
- Konfirmasi: sesi tetap berlaku setelah ganti email/password? (A-A1-12),
  sesi admin nonaktif yang sedang berjalan? (A-A1-15), email admin nonaktif
  boleh dipakai ulang? (A-A1-16).

### Ke QA
- Ubah nama saja → tersimpan tanpa password saat ini.
- Ubah email tanpa password saat ini → ditolak dengan pesan jelas.
- Ubah email ke email admin lain → ditolak duplikat.
- Ganti password: salah password lama → ditolak; baru < 10 → ditolak;
  konfirmasi beda → ditolak; sukses → login ulang dengan password baru.
- Nonaktifkan diri sendiri: tidak ada tombol (verifikasi tidak bisa).
- Admin nonaktif tidak bisa login (pesan umum seperti login gagal).
- 360/768/1024/1280; keyboard-only semua dialog.

## 14. Asumsi
- A-A1-10: kartu formulir maks 720px rata kiri.
- A-A1-11: isian password saat ini di Profil selalu tampil, wajib bila email berubah.
- A-A1-12: sesi tetap berlaku setelah ubah email/password.
- A-A1-13: indikator kekuatan password berupa teks sederhana.
- A-A1-14: dialog tambah admin berisi password sementara + tombol acak 12 karakter.
- A-A1-15: sesi berjalan admin nonaktif dibiarkan habis sendiri.
- A-A1-16: email admin nonaktif tetap dihitung duplikat.

## 15. Usulan di Luar Scope
- Tidak ada. Seluruh kebutuhan akun tercakup MVP.
