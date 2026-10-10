# Spesifikasi Layar: Stok (/admin/stok)

## Tujuan
Halaman monitoring dan penyesuaian stok per varian. Admin melihat stok semua
varian, memfilter yang menipis/habis, menyesuaikan stok (+/-) dengan alasan,
dan melihat riwayat mutasi per varian.

Tambah dan hapus varian TIDAK dilakukan di sini, melainkan di halaman produk
(`/admin/produk`) sesuai PRD-v1.1 bagian 2.

## 2. Entry & Exit Point
- **Entry**: sidebar admin → Stok; deep link `/admin/stok`.
- **Exit**: `/admin/produk` (kelola varian), `/admin` (dashboard).

## 3. Struktur Layout (Wireframe Teks)

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Stok                                                 │
│           │ Stok per varian. Penyesuaian selalu dicatat.         │
│           ├──────────────────────────────────────────────────────┤
│           │ [Cari produk/SKU........] [Status stok: Semua ▾]     │
│           │ chip filter aktif (jika ada)   N varian · M menipis  │
│           ├──────────────────────────────────────────────────────┤
│           │ FOTO PRODUK/SKU  UKURAN WARNA HARGA STOK ST.MIN AKSI │
│           │ [40x50] Nama     S      Merah  Rp..  12   3    [+][-][≡]│
│           │         SKU-001  (badge Menipis bila 0<stok<=min)    │
│           │ ...                                                  │
│           ├──────────────────────────────────────────────────────┤
│           │ « 1 2 3 »                                            │
└──────────────────────────────────────────────────────────────────┘
```

- Kerangka admin standar (design.md bagian 10): sidebar 240px `--pandan-gelap`,
  bar atas 56px putih, konten `--kapas`, kontainer maks 1280px.
- Tabel admin standar: header 13px/600 `--abu` di atas `--pasir`, baris 48px,
  garis bawah 1px `--garis`, hover `--kapas`, angka rata kanan.

## 4. Hirarki Visual, Aksi Utama & Sekunder
- Aksi utama per baris: **[+]** dan **[-]** (membuka dialog penyesuaian).
- Aksi sekunder per baris: **[Riwayat]** (ikon daftar, membuka panel riwayat).
- Tidak ada tombol utama di kanan atas (tidak ada pembuatan data di halaman ini).

## 5. Komponen & Perilaku

### 5.1 Filter dan pencarian
- Pencarian teks: nama produk, SKU, warna. Query string `cari`.
- Filter status stok: `Semua` / `Menipis` / `Habis`. Query string `stok`.
  - Menipis: `0 < stok <= stok_minimum`. Habis: `stok = 0`.
- Filter aktif tampil sebagai chip yang bisa dihapus satu per satu.
- Filter dikerjakan di server; pindah halaman mempertahankan filter.
- Baris ringkasan: "N varian · M menipis · H habis" (14px `--abu`).

### 5.2 Tabel varian
Kolom:

| Kolom | Isi |
|---|---|
| Produk | Thumbnail 40x50 (rasio 4:5) + nama produk (2 baris maks) + SKU 13px `--abu` |
| Ukuran | Teks (All Size/S/M/L/XL/Jumbo) |
| Warna | Teks warna/motif |
| Harga | Harga efektif (harga varian bila ada, bila kosong ikut harga produk), tabular-nums, rata kanan |
| Stok | Angka 600 + badge kata: `Habis` (cabai) / `Sisa N` (kunyit + `--arang`, hanya bila menipis) |
| Stok min. | Angka `--abu` |
| Aksi | Tombol ikon [+] [-] [Riwayat], masing-masing 44x44px + tooltip |

- Status selalu kata + warna, tidak pernah warna saja.
- Foto gagal dimuat → placeholder blok `--pasir` (design.md bagian 13).
- Pagination 20 per halaman (query string `halaman`). `[ASUMSI A-A1-01]`.

### 5.3 Dialog "Sesuaikan stok"
Dibuka dari [+] (arah tambah) atau [-] (arah kurang).

```
┌─────────────────────────────────────────┐
│ Sesuaikan stok                          │
│ [CONTOH] Daster Batik Parang · M · Merah│
│ Stok saat ini: 12                       │
│                                         │
│ Arah: (•) Tambah  ( ) Kurang            │
│ Jumlah: [ 5 ]                           │
│ Alasan: [Restock ▾]                     │
│   (restock / koreksi / rusak-hilang)    │
│ Catatan (opsional): [..............]    │
│                                         │
│ Stok akhir: 17                          │
│              [ Batal ] [ Simpan ]       │
└─────────────────────────────────────────┘
```

- Jumlah: integer ≥ 1. Stok akhir = stok saat ini ± jumlah, dihitung live.
- Validasi: pengurangan yang membuat stok akhir < 0 ditolak di klien
  (tombol Simpan nonaktif + pesan "Pengurangan melebihi stok (maks 12)")
  DAN di server (service stok, tidak pernah negatif).
- Alasan wajib: `restock`, `koreksi`, `rusak-hilang`.
- Double-submit: tombol Simpan nonaktif selama request berjalan.
- Sukses: dialog tertutup, toast sukses, baris tabel ter-refresh, mutasi baru
  muncul di riwayat.

### 5.4 Panel riwayat mutasi (per varian)
- Dibuka dari tombol [Riwayat]: panel samping (drawer) kanan, lebar 400px
  desktop; dialog penuh di ponsel.
- Judul: "Riwayat — [CONTOH] SKU-001 (Daster Batik Parang · M)".
- Tabel riwayat (terbaru dulu):

| Kolom | Isi |
|---|---|
| Waktu | Tanggal + jam WIB (Asia/Jakarta) |
| Perubahan | `+5` (`--pandan`) / `-2` (`--cabai`), tabular-nums |
| Stok akhir | Angka setelah mutasi |
| Alasan | Kata: restock / koreksi / rusak-hilang / pesanan TD-… |
| Pelaku | Nama admin |
| Pesanan | Kode pesanan (tautan) bila dari pesanan, strip bila manual |
| Catatan | Teks catatan, strip bila kosong |

- Riwayat read-only; tidak ada ubah/hapus.
- "Muat lagi" bila > 20 entri (query di sisi server).

## 6. Validasi & Aturan Tampil
- Tombol [-] nonaktif + tooltip "Stok sudah 0" bila stok 0. `[ASUMSI A-A1-02]`.
- Kolom tambah/hapus varian tidak ada di halaman ini.
- Tamu (`/admin/*` tanpa sesi) diarahkan ke `/login`.

## 7. State & Microcopy

| State | Tampilan |
|---|---|
| Default | Tabel terisi, ringkasan "N varian · M menipis · H habis" |
| Loading | Skeleton 8 baris tabel (blok `--pasir`, denyut pelan) |
| Empty (belum ada varian) | "Belum ada varian. Tambah varian dari halaman produk." + tombol "Ke halaman produk" |
| Empty (filter kosong) | "Tidak ada varian yang cocok." + tombol "Hapus filter" |
| Error (gagal memuat) | Di dalam layout: "Stok belum bisa dimuat. Coba lagi" + tombol "Coba lagi" |
| Success (penyesuaian) | Toast: "Stok SKU-001 disesuaikan: 12 → 17 (restock)" |
| Error (stok tidak cukup) | Pesan di dialog: "Stok [CONTOH] Daster Batik Parang ukuran M tinggal 12" |
| Error (konflik bersamaan) | Toast: "Stok berubah oleh admin lain. Data dimuat ulang." lalu refetch |

## 8. Responsif
- ≥1024px: tabel penuh semua kolom.
- 768–1023px: kolom Harga dan Stok min. disembunyikan (info di detail baris).
- <768px: tabel menjadi daftar kartu per varian (foto + nama + stok + tombol
  [+][-][Riwayat]); filter jadi baris geser; drawer riwayat jadi dialog penuh.
- Nyaman mulai 768px; 360px tetap bisa dipakai (daftar kartu).

## 9. Microcopy (ringkasan)
- Judul: "Stok". Subjudul: "Stok per varian. Penyesuaian selalu dicatat."
- Placeholder cari: "Cari produk, SKU, atau warna…"
- Filter: "Semua", "Menipis", "Habis".
- Dialog: "Sesuaikan stok", "Stok saat ini", "Tambah", "Kurang", "Jumlah",
  "Alasan", "Catatan (opsional)", "Stok akhir", "Batal", "Simpan".
- Alasan: "Restock", "Koreksi", "Rusak/hilang".
- Toast: "Stok {sku} disesuaikan: {lama} → {baru} ({alasan})".

## 10. Edge Case
- Teks produk/SKU panjang: potong 2 baris + ellipsis, tooltip penuh.
- Stok minimum 0: tidak pernah berstatus menipis (hanya habis bila 0).
- Jaringan putus saat simpan: pesan "Gagal menyimpan. Periksa koneksi, coba lagi."
  + tombol Simpan aktif kembali, input tidak hilang.
- Dua admin menyesuaikan bersamaan: server (row lock) yang menang; UI refetch
  dan menampilkan toast konflik (bagian 7).
- Sesi habis saat dialog terbuka: redirect `/login` setelah request 401/419.

## 11. Aksesibilitas
- Tombol ikon [+] [-] [Riwayat] memakai `aria-label` ("Tambah stok SKU-001").
- Dialog: `role="dialog"`, fokus ke isian Jumlah saat dibuka, Esc menutup,
  fokus kembali ke tombol pemicu.
- Badge status selalu disertai kata; kontras AA.
- Urutan fokus: cari → filter → tabel (baris per baris) → pagination.

## 12. Kebutuhan Data / Props Inertia
- `varian`: paginasi `{ data[], links, meta }`; tiap item:
  `{ id, produk_nama, foto_thumb, sku, ukuran, warna, harga_efektif,
     stok, stok_minimum, status_stok }`.
- `filter`: `{ cari, stok }` (nilai aktif untuk mengisi kontrol).
- `ringkasan`: `{ total, menipis, habis }`.
- Riwayat: dimuat saat panel dibuka (`GET /admin/stok/{id}`):
  `riwayat[]: { waktu, perubahan, stok_akhir, alasan, pelaku_nama,
   pesanan_kode|null, catatan|null }`.
- Penyesuaian: `POST /admin/stok` `{ variant_id, jumlah(+/-), alasan, catatan? }`;
  respons: stok baru + mutasi baru, atau error validasi per kolom.
- Key props snake_case bahasa Indonesia (PRD bagian 9). Kontrak final di
  `docs/kontrak-props.md` oleh backend.

## 13. Self-Review Checklist
- [x] Sesuai PRD 6.4 + PRD-v1.1 bagian 2 (daftar varian, +/-, alasan, riwayat;
      tambah/hapus varian di halaman produk).
- [x] Konsisten design.md bagian 8 & 10 (tabel admin, badge, dialog, toast).
- [x] Tanpa fitur terlarang.
- [x] State default/loading/empty/error/success/disabled terdokumentasi.
- [x] Responsif 360/768/1024/1280.
- [x] Aksesibilitas dasar.

## 14. Handoff

### Ke Frontend
- Komponen reusable: `TabelAdmin`, `BadgeStok`, `DialogSesuaikanStok`,
  `PanelRiwayatMutasi`, `ChipFilter`, `Toast`.
- Token & layout: bagian 3; tabel standar design.md bagian 8.
- Prioritas wajib: tabel + filter + dialog + riwayat + semua state.
  Penyederhanaan aman: thumbnail boleh diganti placeholder bila belum ada.

### Ke Backend melalui Tech Lead
- `GET /admin/stok` (filter `cari`, `stok`, pagination 20), `POST /admin/stok`,
  `GET /admin/stok/{id}` (riwayat).
- Validasi + pesan error per kolom untuk UI (bagian 5.3, 7).
- **Konflik skema, perlu keputusan Tech Lead**: tabel `stock_movements` di
  `docs/db.md` saat ini hanya berisi `id`/timestamps, padahal UI butuh
  `variant_id, jumlah, alasan, order_id, user_id, catatan, stok_akhir`
  (PRD bagian 8). Backend (kartu B3) memutuskan kolom final.
- Semua perubahan stok lewat satu service + transaksi + row lock (PRD 6.4).

### Ke QA
- Penyesuaian + dan - tercatat di riwayat dengan alasan/pelaku benar.
- Stok tidak pernah negatif (coba kurangi melebihi stok).
- Filter Menipis/Habis cocok dengan definisi (bagian 5.1).
- Riwayat pesanan terkait menampilkan kode pesanan yang benar.
- Pagination 20; filter bertahan saat pindah halaman.
- Breakpoint 360/768/1024/1280; keyboard-only untuk dialog.

## 15. Asumsi
- A-A1-01: pagination 20 (PRD hanya menetapkan produk 20; disamakan).
- A-A1-02: tombol [-] nonaktif + tooltip bila stok 0.
