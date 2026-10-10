# Spesifikasi Layar: Pesan Masuk (/admin/pesan-masuk)

## 1. Tujuan
Halaman membaca dan menindaklanjuti pesan dari formulir kontak publik
(`/kontak-kami`). Admin melihat daftar pesan, menandai sudah dibaca,
menghapus spam, dan membalas via WhatsApp bila kontak berupa nomor HP.

## 2. Entry & Exit Point
- **Entry**: sidebar admin → Pesan masuk (badge angka belum dibaca);
  deep link `/admin/pesan-masuk`.
- **Exit**: WhatsApp eksternal (balas), `/admin` (dashboard).

## 3. Struktur Layout (Wireframe Teks)

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Pesan masuk                                          │
│           │ N belum dibaca dari M pesan.                         │
│           ├──────────────────────────────────────────────────────┤
│           │ [Cari nama/pesan...] [Status: Belum dibaca ▾]        │
│           ├──────────────────────────────────────────────────────┤
│           │ ● [CONTOH] Siti · 0812… · "Assalamualaikum, daster…   │
│           │   10 Okt 14:20              [Baca] [WA] [Hapus]       │
│           │ ─────────────────────────────────────────────────    │
│           │ ○ [CONTOH] Budi · budi@… · "Apakah bisa kirim ke…     │
│           │   09 Okt 09:05              [WA] [Hapus]              │
│           ├──────────────────────────────────────────────────────┤
│           │ « 1 2 3 »                                            │
└──────────────────────────────────────────────────────────────────┘
```

- Kerangka admin standar (design.md bagian 10); konten `--kapas`.
- Daftar berupa baris kartu datar (bukan tabel kaku) karena isi pesan
  panjang dan tidak tabular: tiap baris = status titik + nama + kontak +
  cuplikan pesan + waktu + aksi. `[ASUMSI A-A1-07]`.
- Baris belum dibaca: titik 8px `--kunyit` + nama 600; sudah dibaca: titik
  kosong + nama 400.

## 4. Hirarki Visual, Aksi Utama & Sekunder
- Aksi utama per baris belum dibaca: **"Tandai dibaca"** (sekunder).
- Aksi sekunder: **"Balas via WhatsApp"** (tautan/ikon, hanya bila kontak
  berupa nomor HP) dan **"Hapus"** (tombol hapus + dialog konfirmasi).
- Tidak ada tombol utama di kanan atas (tidak ada pembuatan data).
- Klik baris → panel detail (drawer) dengan pesan penuh + tombol aksi sama.

## 5. Komponen & Perilaku

### 5.1 Filter dan pencarian
- Pencarian: nama pengirim atau isi pesan. Query string `cari`.
- Filter status: `Belum dibaca` / `Semua` (default Belum dibaca bila ada
  yang belum dibaca, bila tidak default Semua). `[ASUMSI A-A1-08]`.
  Query string `status`.
- Filter server-side; pagination 20; pindah halaman mempertahankan filter.
- Baris ringkasan: "N belum dibaca dari M pesan" (14px `--abu`).

### 5.2 Daftar pesan
Kolom per baris:

| Elemen | Isi |
|---|---|
| Status | Titik 8px (kunyit = belum dibaca, kosong = sudah dibaca) + kata "Baru" untuk belum dibaca (tidak hanya warna) |
| Pengirim | Nama (600 bila belum dibaca), kontak 13px `--abu` (nomor/ email) |
| Cuplikan | 2 baris maks + ellipsis; baris baru diringkas jadi spasi |
| Waktu | Tanggal + jam WIB (Asia/Jakarta), 13px `--abu` |
| Aksi | Tombol 44px: Tandai dibaca (bila belum), Balas WA (bila nomor), Hapus |

### 5.3 Panel detail pesan
- Drawer kanan 480px desktop; dialog penuh di ponsel.
- Isi: nama, kontak (tautan `wa.me` bila nomor / `mailto:` bila email),
  waktu lengkap WIB, IP pengirim (13px `--abu`, untuk admin saja),
  pesan penuh (teks biasa, baris baru dipertahankan, di-escape — tanpa HTML),
  status dibaca + waktu dibaca bila sudah.
- Tombol: "Tandai dibaca" (bila belum), "Balas via WhatsApp" (bila nomor),
  "Hapus", "Tutup".
- Membuka detail pesan yang belum dibaca OTOMATIS menandainya dibaca?
  TIDAK — tetap butuh tombol eksplisit agar badge tidak hilang tanpa sadar.
  `[ASUMSI A-A1-09]`.

### 5.4 Balas via WhatsApp
- Tampil hanya bila kolom `kontak` berupa nomor HP (digit, awalan 08/628,
  min 10 digit). Bila email: tombol disembunyikan, tampil tautan email.
- Membuka `https://wa.me/<nomor-normalisasi>?text=<sapaan>` di tab baru.
  Sapaan `[CONTOH]`: "Halo {nama}, terima kasih sudah menghubungi Daster.
  Menanggapi pesan Anda: …" — di-encode URL dengan benar.
- Tidak ada pengiriman otomatis dari sistem (sesuai larangan notifikasi
  otomatis PRD bagian 4).

### 5.5 Hapus pesan
- Dialog konfirmasi: "Hapus pesan dari {nama}?" + teks "Pesan terhapus
  permanen dan tidak bisa dikembalikan." + tombol [Batal] [Hapus].
- Hapus = hard delete (tabel `contact_messages` bukan riwayat penjualan).
- Sukses: toast "Pesan dari {nama} dihapus." Baris hilang, badge berkurang.

## 6. Validasi & Aturan Tampil
- Tamu diarahkan ke `/login`.
- Nomor normalisasi WA: `08…` → `628…`, hapus spasi/strip/`+`.
- Pesan ditampilkan sebagai teks biasa (escape), baris baru dipertahankan.
- IP tidak tampil di daftar, hanya di detail.

## 7. State & Microcopy

| State | Tampilan |
|---|---|
| Default | Daftar + "N belum dibaca dari M pesan" |
| Loading | Skeleton 6 baris (blok `--pasir`) |
| Empty (belum ada pesan sama sekali) | "Belum ada pesan masuk. Pesan dari formulir kontak akan tampil di sini." (tanpa tombol) |
| Empty (filter belum-dibaca kosong) | "Semua pesan sudah dibaca." (tanpa tombol hapus filter bila filter=semua; bila pencarian aktif: "Tidak ada pesan yang cocok." + "Hapus filter") |
| Error | Di dalam layout: "Pesan belum bisa dimuat. Coba lagi" + "Coba lagi" |
| Success (tandai dibaca) | Toast "Pesan dari {nama} ditandai dibaca." Titik hilang, badge sidebar berkurang |
| Success (hapus) | Toast "Pesan dari {nama} dihapus." |
| Disabled | Tombol Balas WA disembunyikan (bukan nonaktif) bila kontak email |

## 8. Responsif
- ≥768px: baris daftar penuh (status + pengirim + cuplikan + waktu + aksi).
- <768px: kartu per pesan (nama + waktu di baris 1, cuplikan, deret tombol
  aksi 44px); drawer detail jadi dialog penuh; filter baris geser.

## 9. Microcopy (ringkasan)
- Judul: "Pesan masuk". Subjudul: "N belum dibaca dari M pesan."
- Placeholder: "Cari nama atau isi pesan…". Filter: "Belum dibaca", "Semua".
- Tombol: "Tandai dibaca", "Balas via WhatsApp", "Hapus", "Tutup", "Coba lagi".
- Dialog hapus: "Hapus pesan dari {nama}?" / "Pesan terhapus permanen dan
  tidak bisa dikembalikan." / [Batal] [Hapus].
- Toast: "Pesan dari {nama} ditandai dibaca." / "Pesan dari {nama} dihapus."

## 10. Edge Case
- Pesan sangat panjang (maks 1000 karakter dari publik): cuplikan 2 baris,
  penuh di drawer dengan scroll.
- Kontak ambigu (bukan nomor maupun email valid — lolos karena data lama):
  tidak ada tombol Balas maupun tautan email; tampil teks kontak saja.
- Spam berulang: hapus satu per satu (tidak ada hapus massal di MVP).
- Jaringan putus saat tandai/hapus: tombol aktif kembali + pesan
  "Gagal menyimpan. Periksa koneksi, coba lagi."
- Sesi habis: redirect `/login`.

## 11. Aksesibilitas
- Titik status selalu disertai kata "Baru" (tidak hanya warna).
- Tombol ikon ber-`aria-label` ("Balas Siti via WhatsApp", "Hapus pesan Siti").
- Drawer: `role="dialog"`, Esc tutup, fokus kembali ke pemicu.
- Urutan fokus: cari → filter → daftar (baris per baris) → pagination.

## 12. Kebutuhan Data / Props Inertia
- `pesan`: paginasi 20 `{ id, nama, kontak, kontak_jenis (nomor/email/lain),
  cuplikan, pesan_penuh, dibaca_at|null, ip, dibuat_at }`.
- `filter`: `{ cari, status }`. `ringkasan`: `{ belum_dibaca, total }`.
- Aksi: tandai dibaca (`PATCH /admin/pesan-masuk/{id}` baca),
  hapus (`DELETE`), balas = tautan klien (tanpa request server).
- Key snake_case bahasa Indonesia; kontrak final oleh backend.

## 13. Self-Review Checklist
- [x] Sesuai PRD 6.6 + PRD-v1.1 bagian 4 (daftar, tandai dibaca, hapus,
      balas WA bila nomor).
- [x] Konsisten design.md bagian 8 & 10 (baris daftar, tombol hapus +
      dialog, toast).
- [x] Tanpa fitur terlarang (tanpa email/WA otomatis).
- [x] Semua state terdokumentasi. [x] Responsif 4 breakpoint.
- [x] Aksesibilitas dasar.

## 14. Handoff

### Ke Frontend
- Komponen reusable: `DaftarPesan`, `BarisPesan`, `PanelDetailPesan`,
  `DialogHapusPesan`, `ChipFilter`, `Toast`.
- Prioritas wajib: daftar + filter + detail + tandai dibaca + hapus +
  balas WA. Penyederhanaan aman: detail boleh halaman (bukan drawer)
  bila waktu sempit.

### Ke Backend melalui Tech Lead
- `GET /admin/pesan-masuk` (filter `cari`, `status`, pagination 20),
  `PATCH .../{id}` (set `dibaca_at`), `DELETE .../{id}`.
- Normalisasi nomor untuk `wa.me` dilakukan di klien dari string kontak;
  backend cukup kirim string mentah + klasifikasi `kontak_jenis`.

### Ke QA
- Pesan baru dari `/kontak-kami` muncul + badge sidebar bertambah.
- Tandai dibaca → badge berkurang, baris jadi gaya sudah-dibaca.
- Hapus → dialog konfirmasi → baris hilang permanen.
- Kontak email → tidak ada tombol WA; kontak nomor → tautan wa.me benar
  dan ter-encode.
- Pesan tampil sebagai teks (coba kirim `<script>` → tampil mentah).
- 360/768/1024/1280; keyboard-only drawer dan dialog.

## 15. Asumsi
- A-A1-07: daftar berupa baris kartu (bukan tabel kaku) karena pesan panjang.
- A-A1-08: default filter Belum dibaca bila ada yang belum dibaca.
- A-A1-09: buka detail tidak otomatis menandai dibaca.
