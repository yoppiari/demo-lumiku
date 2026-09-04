# 🧠 Kesehatan Mental Remaja — Self Help Workbook WebApp

Aplikasi interaktif web-based untuk workbook **"Kesehatan Mental Remaja: Kenali diri • Kelola emosi • Bangun hidup yang lebih baik"**.

Tersedia dalam **4 Pilihan Gaya Desain (4 Alternatif Lengkap)**:
1. ⚡ **Neo-Brutalism Style** (Warna pop, outline hitam tebal, shadow tegas 8px, modern & bold).
2. 📓 **Scrapbook Journal Style** (Kesan buku harian hangat, washi tape, sticky notes pastel, pin 📌, paperclip 📎, font tulisan tangan).
3. 🎨 **Memphis Design Style** (Estetika retro 80s/90s Postmodern Ettore Sottsass, pola polka-dot / squiggle / confetti, warna energetik, tipografi Space Grotesk / Outfit).
4. 🖨️ **Risograph Indie Zine Style** (Estetika cetak stensil Riso, panel komik webtoon, duotone spot inks fluorescent pink & cobalt blue, registration marks ⌖, speech bubble narator).

Keempat alternatif ini **berbagi penyimpanan data yang sama (`localStorage`)**. Jadi apa pun jawaban yang kamu tulis di satu gaya desain akan otomatis tersinkronisasi saat kamu membuka gaya desain lainnya!

---

## 🚀 Cara Membuka (1 Halaman / Link Tunggal)

Aplikasi sekarang sudah disatukan menjadi **1 Link / 1 Halaman Utama** yang dilengkapi **Tombol Switcher Style 1, 2, 3, dan 4**:
- **⚡ Style 1**: Neo-Brutalism Style
- **📓 Style 2**: Scrapbook Journal Style
- **🎨 Style 3**: Memphis Design Style
- **🖨️ Style 4**: Risograph Indie Zine Style

### Opsi A: Lewat Server Lokal (Vite Web App)
Jalankan `npm run dev` lalu buka:
- 🔗 **Link Utama (1 Page All Styles)**: [http://localhost:5173/](http://localhost:5173/)
- Atau langsung lompat via URL query parameter:
  - Style 1: [http://localhost:5173/?style=1](http://localhost:5173/?style=1)
  - Style 2: [http://localhost:5173/?style=2](http://localhost:5173/?style=2)
  - Style 3: [http://localhost:5173/?style=3](http://localhost:5173/?style=3)
  - Style 4: [http://localhost:5173/?style=4](http://localhost:5173/?style=4)

*(Tersedia tombol switcher melayang di bagian atas halaman serta di dalam sidebar untuk berpindah style secara instan tanpa reload).*

### Opsi B: Buka Langsung Tanpa Terminal / Server (Standalone File)
Cukup klik dua kali (double click) file HTML mandiri ini:
- 🔗 **[`index-standalone.html`](./index-standalone.html)** *(Semua 4 style sudah tertanam dalam 1 file lengkap dengan tombol Style 1, 2, 3, dan 4)*

---

## ✨ Fitur Lengkap di Setiap Desain

1. **7 Modul Interaktif Sesuai Naskah**:
   - 📖 **Cover & Lembar Profil**: Nama, Usia/Kelas, Disclaimer medis, panduan cara pemakaian.
   - 📚 **Pojok Baca / Kliping Materi**:
     - 🧠 Mengenal Kesehatan Mental
     - 🔋 Pikiranmu Seperti Baterai HP
     - 🚨 Emosi Bukanlah Musuh
   - 🤝 **Jurnal Rasa / Emotion Diary**: Pilihan tag emosi, situasi pemicu, praduga pikiran, pengukur intensitas 1–10 slider, tindakan setelahnya, dan alternatif respon sehat.
   - 🧠 **Kelola Pikiran (Stop Overthinking)**: Metode S-T-O-P, menantang asumsi negatif, dan teknik Grounding 5-4-3-2-1.
   - ✨ **Kekuatan Diri & Self-Compassion**: 3 hal baik, masa sulit yang terlewati, berbicara lembut pada diri, dan checklist kebutuhan batin.
   - 📴 **Keseharian & Evaluasi**: Gratitude journal harian, Stress diary, dan Digital Wellbeing habit check.
   - 👥 **Support Circle & Rencana**: Pertemanan sehat vs waspada, daftar orang terpercaya tempat bercerita, dan rencana aksi kecil harian.

2. **Penyimpanan Lokal Otomatis & Privat**:
   - Semua isian tersimpan aman di browser tanpa database eksternal.

3. **Fitur Cetak & Simpan PDF**:
   - Cetak modul yang sedang aktif atau cetak seluruh buku menjadi dokumen PDF siap simpan.

---

## 🗂️ Struktur File
```
self help/
├── self help book versi baru.docx    # Naskah asli dokumen
├── index.html                        # Entrypoint Vite: Neo-Brutalism
├── scrapbook.html                    # Entrypoint Vite: Scrapbook
├── memphis.html                      # Entrypoint Vite: Memphis Design
├── index-standalone.html             # Single-file mandiri: Neo-Brutalism
├── index-scrapbook.html              # Single-file mandiri: Scrapbook
├── index-memphis.html                # Single-file mandiri: Memphis Design
├── package.json                      # Konfigurasi npm
├── vite.config.js                    # Multi-page build Vite (3 halaman)
├── tailwind.config.js                # Konfigurasi font & tema Tailwind
├── postcss.config.js                 # Konfigurasi PostCSS
├── src/
│   ├── main.jsx                      # React entrypoint Neo-Brutalism
│   ├── App.jsx                       # Komponen Neo-Brutalism
│   ├── scrapbook-main.jsx            # React entrypoint Scrapbook
│   ├── ScrapbookApp.jsx              # Komponen Scrapbook
│   ├── memphis-main.jsx              # React entrypoint Memphis
│   ├── MemphisApp.jsx                # Komponen Memphis Design
│   └── index.css                     # Styling Tailwind & Print logic
├── dist/                             # Output build produksi lengkap (3 apps)
└── README.md                         # Dokumentasi panduan
```
