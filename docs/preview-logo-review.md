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

## Revisi transparansi v2

Menggunakan built-in imagegen, bukan CLI fallback. Input edit adalah kedua JPG asli.
PNG RGBA baru menyimpan alpha 0–255; sumber JPG tetap disimpan tanpa perubahan.

- assets/dies-natalis-transparent.png: 1254 × 1254, tampil 120–136 px.
- assets/unair-fk-transparent.png: 2172 × 724, kapsul putih dipertahankan.
- Viewport gambar UNAIR rasio 6:1 dengan object-fit cover (skala seragam), hanya
  memangkas padding transparan vertikal dari kanvas hasil imagegen. Artwork tidak diregangkan.
- Pada HP 390 px viewport UNAIR 312 × 52 px, kapsul terlihat sekitar 232 × 41 px;
  desktop viewport 340 × 56,67 px, kapsul sekitar 253 × 44 px. Layar 320 px mengecil otomatis.
- Gap layout 12 px dan margin bawah 18 px dipertahankan; padding transparan memberikan
  tambahan ruang optis kecil di sekitar kapsul.
- Screenshot baru: reports/guahebat-logos/mobile-v2.png dan desktop-v2.png.
- Pemeriksaan 320/390/768/1440 px lulus: gambar loaded, tanpa overflow atau pageerror.
  Aspect ratio medali 1:1 dan viewport kapsul 6:1 diperiksa; object-fit menjaga skala seragam.

Keterbatasan: imagegen dapat mengubah detail mikro/tekstur dan tepi alpha; hasil tidak
identik piksel dengan JPG asli. Teks utama serta warna diperiksa visual pada output dan
render. Pada pembesaran tinggi masih ada ketidakteraturan tepi kecil; perlu review manusia
sebelum dipertimbangkan untuk produksi. Tidak ada deploy atau push produksi.

### Prompt final yang dipakai

Dies Natalis (background-extraction): Remove ONLY the white/light gray external rectangular
background outside the outermost gold circular perimeter and external cast shadow; actual
alpha transparency. Preserve complete medallion, rim, navy/black interior, internal white
artwork/lettering, red details, ornament, all original text, colors, textures, proportions and
orientation. Do not redraw, simplify or erase internal light/dark details. Original square canvas.

UNAIR (background-extraction, output pertama dipilih): Remove ONLY solid BLACK rectangular
exterior outside white rounded capsule; actual alpha transparency. KEEP white capsule, detailed
blue/gold seal, black UNIVERSITAS AIRLANGGA, gray divider, green FAKULTAS KEDOKTERAN.
Preserve lettering, typography, layout, colors and aspect ratio without reinterpretation.
Transparent outer margins, no added shadows/background/text. Tool expanded transparent canvas;
CSS viewport compensates without stretching artwork. A second extraction was inspected but
not selected because its edge fringe was worse.
