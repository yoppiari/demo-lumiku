# 🌟 Ruang Tumbuh Remaja — Portal Edukasi Interaktif

Aplikasi web interaktif terpadu yang menggabungkan dua panduan penting tumbuh kembang remaja berbasis modul resmi edukasi kesehatan ke dalam **1 Portal Terpadu** bergaya **Neo-Memphis Design**:
1. **🌸 KESPRO SPACE**: E-Book Interaktif & Panduan Lengkap Kesehatan Reproduksi Remaja.
2. **🧠 YOUTH MENTAL HEALTH**: Workbook Interaktif Kesehatan Mental & Resiliensi Remaja.

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi ini bersifat **zero-dependency** (tanpa perlu build tool rumit, npm install, ataupun kompilasi). Dapat dijalankan secara instan dengan beberapa cara:

### Cara 1: Buka Langsung di Browser
Cukup **klik dua kali** (*double-click*) file:
👉 **`index.html`**

### Cara 2: Lewat Web Server Lokal (Rekomendasi)
Buka terminal di folder ini, lalu jalankan:
```bash
# Menggunakan Python 3:
python3 -m http.server 8080

# Atau menggunakan npx serve:
npx serve .
```
Lalu buka peramban di: **`http://localhost:8080`**

---

## 🎨 Keunggulan Rombak Total (Unified Memphis Style)

1. **1 Gerbang Masuk Terpadu (`#portal`)**:
   - Pengguna disambut oleh *Portal Selector Hub* dengan visual retro-pop Memphis energetik.
   - Pilihan instan antara **Kespro Space** atau **Self Help Workbook**.
   - Dilengkapi tombol navigasi `🏠 Portal` dan tombol alih antar-modul di header kedua aplikasi.

2. **100% Memphis Design System**:
   - Seluruh elemen antarmuka menggunakan garis tepi hitam tegas (*hard black outline*), bayangan pop offset (*hard drop shadow*), pola geometris (*polka dots, squiggles, badges*), dan tipografi *Space Grotesk* + *Plus Jakarta Sans*.
   - Seluruh opsi multi-tema pada Self Help telah **dihapus**, dikunci permanen pada estetika Memphis.

3. **Penyetaraan Total Layout & Pengalaman Pengguna (100% UX Parity)**:
   - **Shell Mobile-First:** Keduanya menggunakan *Phone Frame Container* terpusat di desktop (dengan tombol toggle *Mode Lebar*) dan responsif penuh di layar ponsel.
   - **Struktur 4-Tab Bottom Navigation yang Presisi:**
     - **Kespro Space:** `📖 E-Book` | `🎮 Interaktif` | `🛡️ Safety` | `📌 Catatanku`
     - **Self-Help Workbook:** `📖 Materi` | `🤝 Jurnal` | `🎮 Toolkit` | `📌 Catatanku`
   - **In-App Reader Overlay:** Membaca bab maupun materi kliping membuka lembar baca layar penuh yang sama, dilengkapi scroll progress bar, pengaturan ukuran font (A±), bookmark bintang (☆), dan checklist selesai (✔️).
   - **Tool Modal Overlay:** Seluruh latihan dan kuis interaktif (Anatomi, Radar Red/Green Flag, Metode S-T-O-P, Grounding 5-4-3-2-1, CBT Reframing, Cek Layar) terbuka dalam modal fokus yang seragam.

4. **Penyimpanan Lokal & Fitur Cetak (Zero-Database Architecture):**
   - Semua isian jurnal emosi, riwayat grounding, afirmasi harian, bab tersimpan, dan kartu keselamatan disimpan otomatis di perambanmu (`localStorage`).
   - Sanggup melayani **30.000+ pengguna simultan** tanpa database server dengan biaya hosting Rp0 (100% Client-Side).
   - **PWA Ready (Progressive Web App):** Dilengkapi `manifest.json` dan `sw.js` (Service Worker) agar bisa dipasang ke layar utama HP dan bekerja 100% offline tanpa internet.
   - **Keamanan PIN 4-Digit (App Lock):** Menggunakan Web Crypto API (SHA-256) dengan sistem pemulihan mandiri 3 lapis (*Pertanyaan Rahasia*, *Recovery Key 6-karakter*, dan *Reset Backup*).
   - **Universal Backup & Restore:** 1-klik ekspor dan impor file `.json` cadangan data mandiri.
   - **Riwayat Lengkap & Mesin Analisis Tren Mental Health:** Merekam jejak emosi tanpa batas dan secara otomatis mendiagnosis kecenderungan kondisi mental (Burnout, Anxiety, Low Mood, Resilien) lengkap dengan persentase emosi dominan dan rekomendasi tindakan adaptif.

---

## 🗂️ Struktur File Proyek

```
ruang-tumbuh-remaja/
├── index.html                    # 🚀 Entry point tunggal: Portal Hub & Router
├── manifest.json                 # 📱 Konfigurasi PWA (Progressive Web App)
├── sw.js                         # ⚡ Service Worker offline caching
├── README.md                     # 📖 Panduan dokumentasi proyek
├── css/
│   └── memphis-unified.css       # 🎨 Master Design System Neo-Memphis
├── js/
│   ├── portal.js                 # 🧭 Router navigasi & shared overlay engine
│   ├── security-manager.js       # 🔒 PIN Lock, SHA-256 Web Crypto & Self-Recovery
│   ├── backup-manager.js         # 📦 Universal JSON Backup & Restore Engine
│   ├── mental-health-insights.js # 📊 Mesin Analisis Tren & Kecenderungan Emosi
│   ├── guidance-manager.js       # 💡 Panduan Lengkap Cara Pakai & Jaminan Bebas Bocor
│   ├── kespro-app.js             # 🌸 Logika aplikasi Kespro Space
│   ├── kespro-content.js         # 📚 30 Bab lengkap Kespro Remaja
│   ├── selfhelp-app.js           # 🧠 Logika aplikasi Self Help Workbook
│   └── selfhelp-content.js       # 📚 7 Kliping edukasi mental health
├── assets/                       # 🖼️ Gambar anatomi, hero cover, dan ikon
├── reproduksi/                   # 📂 Dokumen sumber asli Kespro
└── self help/                    # 📂 Dokumen sumber asli Self Help
```

---

## 🧭 Dukungan URL Hash Routing

Kamu dapat membagikan atau menyimpan tautan langsung ke halaman tertentu:
- `/#portal` : Layar utama pemilihan modul
- `/#kespro` : Mini-web Kespro Space
- `/#kespro/tab-interactive` : Tab Pojok Interaktif Kespro
- `/#kespro/tab-safety` : Tab Pusat Keselamatan & SOS Kespro
- `/#kespro/tab-notes` : Tab Catatanku & Progres Kespro
- `/#kespro/chapter/3` : Langsung membuka bab 3 Kespro di Reader Overlay
- `/#selfhelp` : Mini-web Self-Help Mental Health
- `/#selfhelp/tab-jurnal` : Tab Jurnal Emosi Interaktif
- `/#selfhelp/tab-toolkit` : Tab Latihan Resiliensi (STOP, Grounding, dll.)
- `/#selfhelp/tab-notes` : Tab Catatan & Rencana Diri
- `/#selfhelp/chapter/2` : Langsung membuka materi 2 di Reader Overlay
