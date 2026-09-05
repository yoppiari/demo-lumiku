# AI & Deployment Guidelines (Lumiku Standard)

Dokumen ini adalah aturan wajib yang harus ditaati oleh semua AI Assistant (Antigravity, Claude, Cursor, ChatGPT, dll.) saat bekerja di repositori ini.

---

## 1. Golden Rules (Larangan Keras)
1. **JANGAN PERNAH** melakukan commit/push langsung ke branch `main` (Production) untuk kode eksperimental, coba-coba, atau yang belum melalui pengujian.
2. **JANGAN PERNAH** menyalin, menimpa (overwrite), atau menghapus database/volume data Production dari lingkungan Staging atau Lokal.
3. **JANGAN MENGUBAH** konfigurasi domain live production (`design.lumiku.com` / `demo.lumiku.com`) tanpa instruksi eksplisit dari User.

---

## 2. Struktur Branch & Lingkungan

- **`main` -> Production Environment**
  - Live URL: `https://demo.lumiku.com` / `https://design.lumiku.com`
  - Hanya menerima kode yang **SUDAH LOLOS UJI** di Staging.
  - Deployment ke `main` harus minim risiko, terverifikasi, dan selektif.

- **`staging` -> Staging Environment**
  - Live URL: `https://staging-design.lumiku.com`
  - Tempat pengujian terisolasi untuk fitur baru, perbaikan bug, penyesuaian layout, dan optimasi.
  - Bebas digunakan untuk testing tanpa takut mengganggu pengguna live.

- **`feat/*` atau `fix/*` -> Feature Branches**
  - Setiap pekerjaan baru sebaiknya dibuat di branch terpisah (contoh: `feat/new-layout`, `fix/mobile-view`).
  - Setelah selesai secara lokal, merge ke branch `staging` untuk verifikasi live.

---

## 3. Protokol Update Selektif (Hanya yang Diperlukan)
1. **Atomic Commits**: Buat commit secara terfokus pada satu tujuan perbaikan atau satu fitur saja.
2. **Selective Merge**: Jika ada beberapa perubahan di staging dan hanya SATU yang siap naik ke production:
   - Gunakan `git cherry-pick <commit-hash>` ke branch `main`, atau
   - Merge langsung branch fitur yang bersangkutan ke `main`.
   - Hindari me-merge seluruh branch staging jika masih ada pekerjaan lain yang belum selesai.

---

## 4. Perlindungan Database & Skema Data (Jika Ada Backend)
1. **Terpisah Total**: Database staging dan database production tidak boleh berbagi instance/volume yang sama.
2. **Backward Compatibility**: Perubahan skema harus kompatibel dengan versi sebelumnya (tambahkan kolom dengan default value / nullable).
3. **Migration Scripts**: Jangan mengeksekusi script DROP TABLE atau manipulasi data destruktif langsung ke production.

---

## 5. Prosedur Verifikasi Pasca-Deploy
Setiap kali melakukan deployment ke staging maupun production, AI wajib:
1. Memeriksa status build container hingga `finished / healthy`.
2. Mengetes HTTP status (harus mengembalikan HTTP 200).
3. Memastikan bundle aset utama (CSS, JS) termuat dengan sempurna.
