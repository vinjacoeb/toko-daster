# Tugas K2: Spesifikasi layar Toko Daster (UI/UX)

## Tugas
Setiap rute tahap 1 harus memiliki berkas spesifikasi terpisah di `docs/design/` (misal: `docs/design/landing.md`, ..., `docs/design/admin-akun.md`). Setiap berkas harus mencakup:
- Layout/wireframe (hierarki visual, komponen utama, kelompok)
- State (default, loading, kosong, error, sukses, gagal, dialog, disabled)
- Microcopy (judul, label, placeholder, pesan error, tooltip, hint, status)
- Props/payload yang diperlukan dari backend (field, tipe, kasus penggunaan)

## Sumber Kebenaran
- `design.md`: tampilan (warna, tipografi, komponen, aturan layout)
- `PRD.md`: fitur, status MVP, aturan alur utama, kontrak data
- Design system dan spesifikasi eksplisit Tech Lead (jika ada)
- `docs/kontrak-props.md`: props Inertia yang disetujui backend; frontend menunggu dokumentasi ini sebelum menyelesaikan spesifikasi.

## Cara Pemeriksaan Lanjutan
Setiap spesifikasi harus cukup detail untuk:
1. Menerjemahkan ke UI halaman tunggal (sesuai route) dengan komponen minimal yang diperlukan.
2. Berfungsi dengan data seeder (input minimal) – tidak boleh gagal karena prop missing.
3. Memenuhi aturan desain: layout, gride, spacing, tipografi, kontras aksesibilitas WCAG AA, target sentuh 44px, fokus keyboard logis, label form terhubung, fotonya valid, state kosong/error berat.
4. Mengikuti aturan: PRD bagian 5/6, larangan keras bagian 10 design.md, bagian 9 (pesan WhatsApp), detail bahasa bagian 11.

## Pemeriksaan Validasi
- Semua 14 rute terdaftar.
- Header/footer profil jika muncul.
- Fi, spec, microcopy lengkap.
- Semua state tercakup; tidak ada UI yang diam.
- Responsif mencakup breakpoint 360, 768, 1024, 1280.

## Output
- Berkas spesifikasi HTML di `docs/design/` untuk tiap rute.
- Keputusan dan blok yang dicatat ke komenter kartu jika konflik.
- Ringkasan handoff ke Frontend, Backend melalui Tech Lead, dan QA (output terpisah).

## Aturan
- Jangan membuat komponen UI kit baru.
- Fokus pada kerapian dan kesederhanaan sesuai design system.
- Setiap layar harus ditulis dalam satu berkas, bukan dalam catatan.
