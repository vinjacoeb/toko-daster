# Brief: Devops

## Pekerjaan
- Setup proyek (Laravel, Inertia, React, Tailwind).
- Konfigurasi git dan `.env.example`.
- Menulis `docs/langkah-pemilik.md` untuk persiapan environment.
- Titik berhenti di K1 untuk menunggu pemilik mengisi `.env`.
- Memverifikasi koneksi database setelah unblock.

## Bacaan
- PRD.md Bagian 11 (Data contoh), 12 (Aturan kerja, aturan .env, git), 13 (K1, 13.1 Titik berhenti).

## Output
- Proyek ter-scaffold di `C:/Users/LENOVO/Downloads/toko-daster`.
- Berkas `docs/langkah-pemilik.md`.
- Kartu K1 selesai.

## Definition of Done
- Proyek terinisiasi dengan benar.
- Langkah pemilik terdokumentasi dengan jelas di `docs/langkah-pemilik.md`.
- Koneksi database terverifikasi (`php artisan migrate:status`).
- Git terinisiasi.

## Catatan
- Jangan pernah mengubah atau membaca `.env` asli.
- Blokir pekerjaan dengan `kanban_block` saat menunggu input pemilik di K1.
