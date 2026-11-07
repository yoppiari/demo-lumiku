## Preview logo untuk review

- Sumber: yoppiari/demo-lumiku, branch preview/dua-logo-safe-space, basis 8c573d6.
- Urutan dalam panel kuning: Dies Natalis, UNAIR–FK, SAFE SPACE.
- JPG asli dipertahankan byte-for-byte, termasuk latar putih/hitam; tanpa pemotongan artwork.
- Dies Natalis: 112 × 112 px pada HP, maksimum 128 × 128 px pada desktop.
- UNAIR–FK: 240 × 40 px pada HP, maksimum 280 × 46,67 px pada desktop.
- Jarak antargambar 12 px; margin sebelum badge 18 px (jarak render ke badge 20 px).
- CSS menggunakan container units sehingga mode simulasi ponsel juga menyesuaikan.
- Versi CSS dan cache PWA diperbarui; kedua gambar masuk daftar cache offline.

## Validasi

Situs statis tanpa proses kompilasi. `node --check sw.js` dan `git diff --check` lulus.
Render Chromium di URL publik pada lebar 320, 390, 768, 1440 px: gambar termuat,
rasio intrinsik tetap, urutan/ruang antarelemen benar, tidak ada overflow horizontal
pada dokumen/panel, tidak ada JavaScript pageerror. Mode Ponsel desktop juga dibuka.

Preview: https://guahebat-logo-preview-pocco.fural.space/
Screenshot dan hasil numerik disimpan di home member: reports/guahebat-logos/.

Paket sandbox terpisah dibatasi 32 MB: direktori standalone reproduksi dan self help
yang duplikat tidak disalin; tautan PDF Kespro dalam paket preview menunjuk PDF asli
di https://guahebat.com/. Repository tetap menyimpan seluruh materi dan tautan relatif.
Tidak ada deploy produksi atau push ke branch produksi.
