# Spesifikasi Layar: Pesanan (/admin/pesanan)

## 1. Tujuan
Halaman pencatatan dan pengelolaan pesanan manual oleh admin. Admin membuat
pesanan dari chat WhatsApp/marketplace/transaksi langsung, melihat daftar,
mengubah status sampai selesai, atau membatalkan. "Hapus" diwujudkan sebagai
**Batal** — riwayat penjualan tidak dihapus permanen (PRD-v1.1 bagian 2).

## 2. Entry & Exit Point
- **Entry**: sidebar admin → Pesanan; deep link `/admin/pesanan`.
- **Exit**: `/admin/stok` (cek dampak stok), `/admin/laporan` (cek omzet),
  `/admin` (dashboard).

## 3. Struktur Layout: Daftar (Wireframe Teks)

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Pesanan                          [Buat pesanan +]    │
│           ├──────────────────────────────────────────────────────┤
│           │ [Cari kode/nama...] [Status ▾] [Kanal ▾] [Tgl ▾]      │
│           │ chip filter aktif              N pesanan              │
│           ├──────────────────────────────────────────────────────┤
│           │ KODE     PELANGGAN  ITEM  TOTAL  STATUS  TGL   AKSI   │
│           │ TD-…-001 [CONTOH]…  2     Rp..  [baru]   10/10 [≡]    │
│           │ ...                                                  │
│           ├──────────────────────────────────────────────────────┤
│           │ « 1 2 3 »                                            │
└──────────────────────────────────────────────────────────────────┘
```

- Kerangka admin standar (design.md bagian 10); tabel standar (baris 48px,
  header `--pasir`, hover `--kapas`, angka rata kanan).
- Tombol utama "Buat pesanan" di kanan atas → halaman/formulir buat.

## 4. Struktur Layout: Formulir Buat/Ubah

```
┌──────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ Buat pesanan                        [Kembali]        │
│           ├──────────────────────────────┬───────────────────────┤
│           │ KIRI (8 kolom)                │ KANAN (4 kolom)       │
│           │ Nama pelanggan* [          ]  │ RINGKASAN             │
│           │ No. HP* [          ]          │ Item (n)              │
│           │ Alamat (opsional) [        ]  │ Subtotal      Rp…     │
│           │ Kanal: (•)WA ( )MP ( )Langsung│ Ongkir  [   0   ]     │
│           │ Tanggal pesan [10/10/26 📅]   │ Diskon  [   0   ]     │
│           │ Catatan (opsional) [       ]  │ Total         Rp…     │
│           │ ─────────────────            │ (dihitung otomatis)   │
│           │ ITEM                          │                     │
│           │ [Cari varian + Tambah........]│                     │
│           │ Varian        Qty  Harga  Sub │                     │
│           │ [CONTOH] D…×2 Rp.. Rp.. [x]   │                     │
│           ├──────────────────────────────┴───────────────────────┤
│           │ [Batal]                    [Simpan pesanan] (lengket)│
└──────────────────────────────────────────────────────────────────┘
```

- Formulir buat dan ubah memakai layout yang sama; judul "Ubah pesanan TD-…".
- Item hanya bisa diubah saat status `baru` (PRD-v1.1 bagian 2); bila status
  > baru, bagian ITEM read-only + catatan "Item dikunci setelah status dibayar".
- Data pelanggan, ongkir, resi, catatan boleh diubah sampai status `dikirim`.

## 5. Komponen & Perilaku

### 5.1 Daftar + filter
- Pencarian: kode pesanan atau nama pelanggan. Query string `cari`.
- Filter status: semua/baru/dibayar/dikemas/dikirim/selesai/batal.
- Filter kanal: semua/whatsapp/marketplace/langsung.
- Filter tanggal: preset cepat (Hari ini / 7 hari / 30 hari / Bulan ini) +
  rentang kustom (dua input tanggal). Query string `dari`, `sampai`.
- Filter server-side; chip filter aktif bisa dihapus; pindah halaman
  mempertahankan filter; pagination 20 (PRD 6.5).
- Kolom tabel: Kode (tautan ke detail), Pelanggan (nama + no HP 13px `--abu`),
  Item (jumlah jenis, mis. "2 jenis · 3 pcs"), Total (tabular-nums),
  Status (badge kata + warna, design.md bagian 8), Tanggal pesan (WIB),
  Aksi (Lihat/Ubah/Batal sesuai status).

### 5.2 Detail pesanan
- Dibuka dari kode/aksi Lihat: halaman (bukan dialog) `/admin/pesanan/{kode}`.
- Isi: badge status besar, data pelanggan, tabel item (nama snapshot, warna,
  ukuran, harga, qty, subtotal), ongkir/diskon/total, resi, catatan,
  tanggal pesan, riwayat status (waktu + pelaku per perubahan).
- Aksi sesuai status (bagian 5.4): Ubah, Ubah status (tombol per status
  berikutnya + Batal), Kembali ke daftar.
- Cetak faktur: P1 — cukup tombol nonaktif berlabel "Cetak faktur (segera)"?
  TIDAK. Keputusan: tombol cetak faktur **tidak ditampilkan** di MVP karena
  P1 (PRD 6.5 + asumsi A12 v1.1). Dicatat sebagai usulan di luar scope.
  `[ASUMSI A-A1-03]`.

### 5.3 Formulir buat
- Nama pelanggan*: wajib, min 2 karakter.
- No. HP*: wajib, digit (awalan 08/628, min 10 digit). Pesan error menjelaskan
  format yang benar.
- Alamat: opsional (wajib diisi bila kanal marketplace? TIDAK — tetap opsional;
  placeholder menyarankan mengisi untuk pengiriman).
- Kanal*: radio 3 pilihan (whatsapp/marketplace/langsung), default whatsapp.
- Tanggal pesanan: default sekarang (WIB), bisa diubah ke masa lalu untuk
  mencatat pesanan lampau; tidak boleh masa depan (error "Tanggal tidak boleh
  lebih dari hari ini").
- Item: pencarian varian (nama/SKU, menampilkan stok live) → Tambah →
  baris item (nama snapshot, stok tersedia, qty stepper +/-, harga satuan
  default harga efektif dan bisa diubah, subtotal baris, hapus baris).
  Qty maks = stok tersedia; melebihi stok → error per baris
  "Stok [CONTOH] Daster Batik Parang ukuran M tinggal 2".
- Ongkir, diskon: integer ≥ 0, default 0.
- Total tampilan = subtotal + ongkir − diskon, dihitung ulang tiap perubahan
  (tampilan saja; total resmi dihitung server — design.md bagian 10).
- Kode otomatis `TD-YYMMDD-001` (nomor urut harian) dibuat server; sebelum
  simpan tampil teks "Kode dibuat otomatis saat disimpan".
- Stok berkurang saat pesanan dibuat (transaksi + row lock via service stok).
- React Hook Form + Zod bila tersedia (PRD bagian 9).

### 5.4 Status dan transisi
- Alur: `baru` → `dibayar` → `dikemas` → `dikirim` → `selesai`;
  `batal` dari status mana pun sebelum `selesai`.
- Ubah status: tombol "Tandai dibayar / Kemas / Kirim / Selesaikan" (satu
  tombol aksi utama untuk langkah berikutnya) + tombol sekunder "Batalkan".
- Dialog konfirmasi "Batalkan pesanan TD-…?" — teks: "Stok item dikembalikan.
  Riwayat pesanan tetap tersimpan." + isian alasan batal (opsional).
- Saat `dikirim`: isian resi (opsional, teks) tampil di formulir ubah.
- Riwayat status: daftar waktu + dari → ke + pelaku; read-only.

### 5.5 Validasi ringkas
- Item minimal 1 baris, qty ≥ 1 dan ≤ stok.
- Harga satuan ≥ 0 (boleh 0 untuk bonus? YA, dengan catatan; `[ASUMSI A-A1-04]`).
- Ongkir/diskon ≥ 0; diskon boleh melebihi subtotal? TIDAK — total min 0,
  error "Diskon melebihi total belanja".

## 6. State & Microcopy

| State | Tampilan |
|---|---|
| Default daftar | Tabel terisi + "N pesanan" |
| Loading daftar | Skeleton 8 baris |
| Empty (belum ada pesanan) | "Belum ada pesanan. Buat pesanan pertama dari chat pelanggan." + tombol "Buat pesanan" |
| Empty (filter kosong) | "Tidak ada pesanan yang cocok." + tombol "Hapus filter" |
| Error daftar | Di dalam layout: "Pesanan belum bisa dimuat. Coba lagi" + "Coba lagi" |
| Loading simpan | Tombol "Menyimpan…" nonaktif; cegah double-submit |
| Success buat | Toast "Pesanan TD-261010-001 disimpan. Stok dikurangi." + redirect ke detail |
| Success status | Toast "Pesanan TD-… ditandai dibayar." |
| Success batal | Toast "Pesanan TD-… dibatalkan. Stok dikembalikan." |
| Error stok | Pesan per baris item (bagian 5.3) + toast ringkas |
| Error validasi | Pesan di bawah tiap isian (`aria-describedby`) |

## 7. Responsif
- ≥1024px: daftar tabel penuh; formulir 2 kolom (8+4).
- 768–1023px: tabel sembunyikan kolom Item dan Kanal; formulir 1 kolom,
  ringkasan jadi blok lengket di bawah.
- <768px: daftar jadi kartu per pesanan (kode + status + total + aksi);
  filter baris geser; tombol "Buat pesanan" full-width di bawah judul;
  tombol Simpan lengket di bawah layar.

## 8. Microcopy (ringkasan)
- Judul: "Pesanan" / "Buat pesanan" / "Pesanan TD-…".
- Placeholder cari daftar: "Cari kode atau nama pelanggan…".
- Placeholder cari varian: "Ketik nama atau SKU varian…".
- Status: Baru, Dibayar, Dikemas, Dikirim, Selesai, Batal.
- Kanal: WhatsApp, Marketplace, Langsung.
- Tombol: "Buat pesanan", "Simpan pesanan", "Tandai dibayar", "Kemas",
  "Kirim", "Selesaikan", "Batalkan", "Batal" (tutup dialog), "Kembali".
- Dialog batal: "Batalkan pesanan TD-…?" / "Stok item dikembalikan. Riwayat
  pesanan tetap tersimpan." / "Alasan batal (opsional)".

## 9. Edge Case
- Stok berubah antara tambah item dan simpan: server menolak dengan varian
  yang disebut; UI menandai baris terkait, qty dikoreksi ke stok terbaru.
- Kode urut harian bentrok (dua admin simpan bersamaan): server yang
  menentukan; UI menampilkan kode final dari respons.
- Tanggal masa depan: ditolak (bagian 5.3).
- No HP duplikat antar pelanggan: diizinkan (bukan key unik).
- Jaringan putus saat simpan: input tidak hilang, tombol aktif kembali,
  pesan "Gagal menyimpan. Periksa koneksi, coba lagi."
- Sesi habis: redirect `/login`.
- Pesanan `selesai`/`batal`: seluruh formulir read-only + banner status.

## 10. Aksesibilitas
- Badge status kata + warna; kontras AA.
- Stepper qty: tombol 44px + `aria-label` ("Tambah 1 …", "Kurangi 1 …") +
  input qty berlabel.
- Dialog batal: `role="dialog"`, Esc tutup, fokus kembali ke pemicu.
- Error terhubung ke isian (`aria-describedby`).
- Urutan fokus formulir mengikuti urutan baca (pelanggan → kanal → tanggal →
  item → ongkir/diskon → simpan).

## 11. Kebutuhan Data / Props Inertia
- Daftar: `pesanan` paginasi 20 `{ kode, pelanggan_nama, no_hp, jml_jenis,
  jml_pcs, total, status, kanal, dipesan_at }`; `filter { cari, status,
  kanal, dari, sampai }`; `ringkasan { total }`.
- Buat: `varian_cari` (hasil pencarian varian + stok live); payload simpan
  `{ nama, no_hp, alamat?, kanal, dipesan_at, item[{variant_id, qty, harga}],
  ongkir, diskon, catatan? }`.
- Detail: `pesanan { kode, status, pelanggan…, kanal, item_snapshot[],
  subtotal, ongkir, diskon, total, resi?, catatan?, dipesan_at,
  riwayat_status[] }`.
- Ubah status: `POST` aksi `{ kode, aksi: dibayar/dikemas/dikirim/selesai/
  batal, resi?, alasan_batal? }`.
- Key snake_case bahasa Indonesia; kontrak final oleh backend.

## 12. Self-Review Checklist
- [x] Sesuai PRD 6.5 + PRD-v1.1 bagian 2 (buat/lihat/ubah status/batal;
      item dikunci setelah `baru`; hapus = batal).
- [x] Konsisten design.md bagian 8 & 10 (badge status, tabel, dialog, toast).
- [x] Tanpa fitur terlarang (tanpa checkout/payment gateway; tanpa cetak
      faktur sebagai keputusan karena P1).
- [x] Semua state terdokumentasi. [x] Responsif 4 breakpoint.
- [x] Aksesibilitas dasar.

## 13. Handoff

### Ke Frontend
- Komponen reusable: `TabelAdmin`, `BadgeStatusPesanan`, `FormPesanan`
  (kiri/kanan), `PencariVarian`, `StepperQty`, `DialogBatalPesanan`, `Toast`.
- Prioritas wajib: daftar + filter + buat + detail + ubah status + batal.
  Penyederhanaan aman: detail boleh satu kolom penuh bila waktu sempit.

### Ke Backend melalui Tech Lead
- Daftar (filter + pagination 20), buat (kode otomatis, total server-side,
  kurang stok transaksional), detail, ubah status/batal (kembalikan stok).
- Snapshot item ke `order_items` (nama/warna/ukuran/harga).
- Validasi + pesan error per kolom (bagian 5.3–5.5, 6).
- Stok via service stok (row lock), bukan update langsung.

### Ke QA
- Buat → stok berkurang; batal → stok kembali; riwayat mutasi benar.
- Item terkunci setelah status `dibayar` (coba ubah → ditolak).
- Pelanggan/ongkir/resi/catatan masih bisa diubah sampai `dikirim`.
- Total server-side: ubah harga di browser → total tetap benar.
- Stok tidak cukup → pesan menyebut varian.
- Omzet dashboard/laporan ikut berubah sesuai definisi (tanpa `baru`/`batal`).
- 360/768/1024/1280; keyboard-only dialog dan stepper.

## 14. Asumsi
- A-A1-03: tombol cetak faktur disembunyikan (P1, asumsi A12 v1.1).
- A-A1-04: harga satuan boleh 0 (bonus) dengan catatan.

## 15. Usulan di Luar Scope
- Cetak faktur pesanan (P1): desain saat masuk scope — stylesheet cetak A4
  seperti laporan (design-v1.1 bagian 4).
