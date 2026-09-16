import subprocess
import os
import shutil

html_content = """<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Kesehatan Mental Remaja — Smartphone Neo-Brutalism Edition</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,500;0,600;0,700;0,800;0,900;1,700&family=Space+Grotesk:wght@700;800;900&display=swap" rel="stylesheet">
<style>
  @page {
    size: 390pt 844pt;
    margin: 0;
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  body {
    width: 390pt;
    background-color: #FEF6E4;
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #121212;
    -webkit-font-smoothing: antialiased;
  }
  .page {
    width: 390pt;
    height: 844pt;
    max-height: 844pt;
    padding: 11pt 12pt 9pt 12pt;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    page-break-after: always;
    break-after: page;
    background-color: #FEF6E4;
    overflow: hidden;
  }
  .page:last-child {
    page-break-after: avoid;
    break-after: avoid;
  }

  .page-body {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    flex: 1;
    margin: 4pt 0 2pt 0;
    gap: 4.5pt;
  }

  /* Typography */
  .font-heading {
    font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
    font-weight: 800;
    letter-spacing: -0.4px;
    line-height: 1.1;
  }
  .font-black {
    font-weight: 900;
  }

  /* Neo-Brutalism UI Components */
  .neo-card {
    border: 2.2px solid #000;
    box-shadow: 2.8px 2.8px 0px #000;
    border-radius: 9px;
    background: #fff;
    padding: 7.5pt 9.5pt;
    position: relative;
  }
  .neo-card-sm {
    border: 1.8px solid #000;
    box-shadow: 2px 2px 0px #000;
    border-radius: 7px;
    background: #fff;
    padding: 5pt 7pt;
    position: relative;
  }
  .neo-badge {
    display: inline-flex;
    align-items: center;
    gap: 3pt;
    border: 1.8px solid #000;
    box-shadow: 1.8px 1.8px 0px #000;
    border-radius: 999px;
    padding: 2.5pt 7.5pt;
    font-size: 7.5pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    line-height: 1;
  }
  .neo-tag {
    display: inline-block;
    border: 1.6px solid #000;
    box-shadow: 1.6px 1.6px 0px #000;
    border-radius: 5px;
    padding: 2pt 5.5pt;
    font-size: 7.2pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.2px;
    line-height: 1.1;
  }
  .neo-box-dashed {
    border: 1.5px dashed #000;
    border-radius: 6px;
    padding: 4.5pt 6.5pt;
    background: #fff;
  }
  .ruled-line {
    border-bottom: 1.3px dashed #777;
    min-height: 18.5pt;
    display: flex;
    align-items: flex-end;
    padding-bottom: 1.5pt;
    font-size: 7.3pt;
    color: #666;
    font-style: italic;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /* Header & Footer */
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
  }
  .page-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 2px solid #000;
    padding-top: 4pt;
    margin-top: auto;
    flex-shrink: 0;
    font-size: 7.5pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  /* Color utility shortcuts */
  .bg-yellow { background-color: #FFE500; }
  .bg-pink { background-color: #FF5E7E; }
  .bg-softpink { background-color: #FF90E8; }
  .bg-mint { background-color: #00E599; }
  .bg-cyan { background-color: #00F0FF; }
  .bg-purple { background-color: #D4BBFF; }
  .bg-cream { background-color: #FEF6E4; }
  .bg-orange { background-color: #FFA07A; }
  .bg-white { background-color: #FFFFFF; }
  .bg-black { background-color: #121212; color: #fff; }

  /* Barcode */
  .barcode-lines {
    display: flex;
    justify-content: flex-end;
    gap: 1.5px;
    height: 18pt;
    margin-top: 2pt;
  }
  .b-bar {
    background: #000;
    height: 100%;
  }
</style>
</head>
<body>

  <!-- =================================================================== -->
  <!-- PAGE 1: COVER DEPAN (FRONT COVER)                                   -->
  <!-- =================================================================== -->
  <div class="page" style="background-color: #FEF6E4 !important;">
    <!-- Top Header Bar -->
    <div class="page-header">
      <span class="neo-badge bg-pink" style="color: #fff;">★ EDISI MANDIRI REMAJA</span>
      <span class="neo-badge bg-mint">100% RUANG AMAN 🛡️</span>
      <span class="neo-badge bg-yellow">EDISI 2026 📱</span>
    </div>

    <!-- Main Title Card -->
    <div class="neo-card bg-white" style="text-align: center; padding: 7.5pt 10pt; margin-top: 3pt;">
      <div style="display: flex; justify-content: center; gap: 4pt; margin-bottom: 2.5pt;">
        <span class="neo-tag bg-cyan">PANDUAN PRAKTIS CBT</span>
        <span class="neo-tag bg-purple">WORKBOOK RESILIENSI</span>
      </div>
      <h1 class="font-heading" style="font-size: 21pt; line-height: 1.05; text-transform: uppercase; margin-bottom: 2pt; color: #000;">
        KESEHATAN <span style="background: #FFE500; border: 2.2px solid #000; box-shadow: 2.5px 2.5px 0 #000; border-radius: 6px; padding: 0 5pt; display: inline-block;">MENTAL</span> REMAJA
      </h1>
      <p style="font-size: 7.6pt; font-weight: 700; color: #222; line-height: 1.25;">
        Kenali Diri • Kelola Emosi • Atasi Overthinking • Rawat Jiwa
      </p>
    </div>

    <!-- Center Showcase Art Card -->
    <div class="neo-card" style="padding: 5pt; background: #FAF8F5; text-align: center; flex: 1; display: flex; align-items: center; justify-content: center; margin: 3.5pt 0;">
      <div style="border: 2px solid #000; border-radius: 7px; overflow: hidden; box-shadow: 2px 2px 0 #000; background: #FAF8F5; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
        <img src="assets/mental-cover-art.png" alt="Ilustrasi Meditasi Kesehatan Mental Remaja" style="width: 100%; height: 100%; max-height: 485pt; object-fit: contain; display: block; margin: 0 auto; background-color: #FAF8F5;">
      </div>
    </div>

    <!-- Feature Badges Strip (3 Columns) -->
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4.5pt; margin-bottom: 3pt;">
      <div class="neo-card-sm bg-purple" style="text-align: center; padding: 6.5pt 3pt;">
        <div style="font-size: 14pt; line-height: 1; margin-bottom: 2pt;">🧘‍♀️</div>
        <div style="font-size: 7.4pt; font-weight: 900; text-transform: uppercase;">Mindfulness</div>
      </div>
      <div class="neo-card-sm bg-pink" style="text-align: center; padding: 6.5pt 3pt; color: #fff;">
        <div style="font-size: 14pt; line-height: 1; margin-bottom: 2pt;">⚡</div>
        <div style="font-size: 7.4pt; font-weight: 900; text-transform: uppercase; color: #fff;">Stop Overthink</div>
      </div>
      <div class="neo-card-sm bg-mint" style="text-align: center; padding: 6.5pt 3pt;">
        <div style="font-size: 14pt; line-height: 1; margin-bottom: 2pt;">💖</div>
        <div style="font-size: 7.4pt; font-weight: 900; text-transform: uppercase;">Self-Compassion</div>
      </div>
    </div>

    <!-- Editorial Attribution Tag -->
    <div style="display: flex; justify-content: center; gap: 5pt; margin-bottom: 3pt;">
      <span class="neo-tag bg-white" style="font-size: 7.2pt; padding: 2.5pt 6pt;">🌱 TIM RUANG TUMBUH KESEHATAN REMAJA</span>
      <span class="neo-tag bg-yellow" style="font-size: 7.2pt; padding: 2.5pt 6pt;">PANDUAN LATIHAN KESEHATAN JIWA</span>
    </div>

    <!-- Empowering Quote Box -->
    <div class="neo-card bg-black" style="padding: 7.5pt 9.5pt; color: #fff; margin-bottom: 2pt;">
      <div style="font-size: 7.8pt; font-weight: 800; color: #FFE500; line-height: 1.35; text-align: center;">
        🌱 "Pikiranmu berharga, perasaanmu valid, dan kamu tidak harus memikul semuanya sendirian."
      </div>
    </div>

    <!-- Footer Publisher Strip -->
    <div class="page-footer">
      <div style="font-size: 7.5pt; font-weight: 800;">
        RUANG TUMBUH REMAJA PRESS
      </div>
      <span class="neo-badge bg-white" style="font-size: 7pt;">EDISI KHUSUS SMARTPHONE</span>
    </div>
  </div>

  <!-- =================================================================== -->
  <!-- PAGE 2: HALAMAN 01 / 10 — INTRODUKSI, ROADMAP & FORM KEPEMILIKAN    -->
  <!-- =================================================================== -->
  <div class="page">
    <!-- Header -->
    <div class="page-header">
      <span class="neo-badge bg-pink" style="color: #fff;">★ RUANG AMAN REMAJA</span>
      <span class="neo-badge bg-mint">EDISI SMARTPHONE 📱</span>
      <span class="neo-badge bg-black" style="color: #fff;">HALAMAN 01 / 10</span>
    </div>

    <div class="page-body" style="gap: 7.5pt;">
      <!-- Main Title Card (Yellow Accent) -->
      <div class="neo-card bg-yellow" style="padding: 11pt 13pt; text-align: center;">
        <div style="display: flex; justify-content: center; gap: 5pt; margin-bottom: 4pt;">
          <span class="neo-tag bg-white" style="font-size: 7.6pt; padding: 2.5pt 7pt;">PANDUAN MANDIRI 10 HARI</span>
          <span class="neo-tag bg-cyan" style="font-size: 7.6pt; padding: 2.5pt 7pt;">BERBASIS CBT &amp; MINDFULNESS</span>
        </div>
        <h1 class="font-heading" style="font-size: 21pt; line-height: 1.05; text-transform: uppercase; margin: 4pt 0 5pt 0; color: #000;">
          KESEHATAN <span style="background: #fff; border: 2.2px solid #000; box-shadow: 2.5px 2.5px 0 #000; border-radius: 6px; padding: 0 6pt; display: inline-block;">MENTAL</span> REMAJA
        </h1>
        <div style="background: #fff; border: 2px solid #000; border-radius: 6px; padding: 5pt 9pt; font-size: 8.4pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3px; margin: 3pt 0 5pt 0;">
          Kenali Diri • Kelola Emosi • Bangun Hidup Lebih Baik
        </div>
        <p style="font-size: 8.2pt; font-weight: 600; line-height: 1.42; color: #222;">
          Buku latihan mandiri (workbook) ini dirancang khusus untuk layar ponselmu—membantumu menavigasi masa remaja dengan tenang, kuat, dan penuh percaya diri tanpa rasa terhakimi.
        </p>
      </div>

      <!-- Roadmap 3 Modul Utama -->
      <div class="neo-card bg-white" style="padding: 10pt 11pt;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6pt; border-bottom: 1.8px solid #000; padding-bottom: 3.5pt;">
          <span style="font-size: 8.8pt; font-weight: 900; text-transform: uppercase;">🗺️ 3 PILAR LATIHAN UTAMAMU:</span>
          <span class="neo-tag bg-purple" style="font-size: 7.4pt;">ALUR BUKU</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5.5pt;">
          <div class="neo-card-sm bg-purple" style="text-align: center; padding: 9pt 4.5pt;">
            <div style="font-size: 19pt; line-height: 1;">⚡</div>
            <div style="font-size: 8pt; font-weight: 900; text-transform: uppercase; margin: 3.5pt 0 2pt 0;">1. Emotion Diary</div>
            <div style="font-size: 7pt; font-weight: 600; line-height: 1.32; color: #222;">Beri nama emosimu &amp; ubah reaksi spontan jadi respon bijak.</div>
          </div>
          <div class="neo-card-sm bg-mint" style="text-align: center; padding: 9pt 4.5pt;">
            <div style="font-size: 19pt; line-height: 1;">📊</div>
            <div style="font-size: 8pt; font-weight: 900; text-transform: uppercase; margin: 3.5pt 0 2pt 0;">2. Mood Tracker</div>
            <div style="font-size: 7pt; font-weight: 600; line-height: 1.32; color: #222;">Lacak grafik suasana hati &amp; energi selama 7 hari penuh.</div>
          </div>
          <div class="neo-card-sm bg-pink" style="text-align: center; padding: 9pt 4.5pt; color: #fff;">
            <div style="font-size: 19pt; line-height: 1;">🎯</div>
            <div style="font-size: 8pt; font-weight: 900; text-transform: uppercase; margin: 3.5pt 0 2pt 0; color: #fff;">3. Stress Diary</div>
            <div style="font-size: 7pt; font-weight: 600; line-height: 1.32; color: #fff;">Kuasai Lingkaran Kendali &amp; aksi kecil realistis pereda stres.</div>
          </div>
        </div>
      </div>

      <!-- Identity & Commitment Form (Rich Form with No Empty Holes) -->
      <div class="neo-card bg-white" style="padding: 10pt 12pt;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6pt; border-bottom: 1.8px solid #000; padding-bottom: 3.5pt;">
          <span style="font-size: 8.8pt; font-weight: 900; text-transform: uppercase;">📖 BUKU LATIHAN INI RESMI MILIK:</span>
          <span class="neo-tag bg-softpink" style="font-size: 7.4pt;">DATA PRIBADI</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 5pt;">
          <div style="display: flex; gap: 6pt;">
            <div class="neo-box-dashed" style="flex: 2; display: flex; justify-content: space-between; align-items: center; font-size: 8.4pt; padding: 5.5pt 8pt;">
              <span style="font-weight: 800;">Nama Lengkap:</span>
              <span style="color: #777; font-weight: 600;">................................................</span>
            </div>
            <div class="neo-box-dashed" style="flex: 1.2; display: flex; justify-content: space-between; align-items: center; font-size: 8.4pt; padding: 5.5pt 8pt;">
              <span style="font-weight: 800;">Panggilan:</span>
              <span style="color: #777; font-weight: 600;">..................</span>
            </div>
          </div>

          <div style="display: flex; gap: 6pt;">
            <div class="neo-box-dashed" style="flex: 1; display: flex; justify-content: space-between; align-items: center; font-size: 8.4pt; padding: 5.5pt 8pt;">
              <span style="font-weight: 800;">Kelas / Usia:</span>
              <span style="color: #777; font-weight: 600;">........................</span>
            </div>
            <div class="neo-box-dashed" style="flex: 1; display: flex; justify-content: space-between; align-items: center; font-size: 8.4pt; padding: 5.5pt 8pt;">
              <span style="font-weight: 800;">Tanggal Mulai:</span>
              <span style="color: #777; font-weight: 600;">....../....../202...</span>
            </div>
          </div>

          <!-- Goal / Target for this workbook (5 Ruled Lines with comfortable height) -->
          <div class="neo-box-dashed" style="background: #FAF8F5; padding: 7pt 9pt;">
            <div style="font-size: 8.4pt; font-weight: 800; margin-bottom: 3pt; color: #111;">
              🎯 Target &amp; Harapanku untuk 10 Hari ke Depan:
            </div>
            <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">Contoh: Ingin lebih tenang saat menghadapi ujian dan tidak gampang overthinking...</div>
            <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">Target 1: ...................................................................................................................</div>
            <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">Target 2: ...................................................................................................................</div>
            <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">Harapan terbesarku: .................................................................................................</div>
            <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">Hal yang ingin kurayakan di hari ke-10: .................................................................</div>
          </div>

          <!-- 3 Safe Space Principles (Rich Badges) -->
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4.5pt; font-size: 7.4pt; font-weight: 700;">
            <div style="background: #FFF9DB; border: 1.4px solid #000; border-radius: 6px; padding: 5pt 3.5pt; text-align: center;">
              🛡️ <strong>100% Valid</strong><br><span style="color: #555; font-size: 6.6pt;">Bebas penghakiman</span>
            </div>
            <div style="background: #E6FCF5; border: 1.4px solid #000; border-radius: 6px; padding: 5pt 3.5pt; text-align: center;">
              🌿 <strong>Ruang Privat</strong><br><span style="color: #555; font-size: 6.6pt;">Catatan pribadimu</span>
            </div>
            <div style="background: #F3E8FF; border: 1.4px solid #000; border-radius: 6px; padding: 5pt 3.5pt; text-align: center;">
              🎯 <strong>Progres Nyata</strong><br><span style="color: #555; font-size: 6.6pt;">Langkah kecil berarti</span>
            </div>
          </div>

          <!-- Safe Space Commitment -->
          <div style="background: #FEF6E4; border: 1.6px solid #000; border-radius: 6px; padding: 6.5pt 9pt; font-size: 8pt; font-weight: 700; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 6pt;">
              <span style="font-size: 13pt;">🛡️</span>
              <span><strong>Komitmen:</strong> Buku ini ruang amanku; aku jujur pada diri sendiri.</span>
            </div>
            <span style="font-size: 7.8pt; color: #444; font-weight: 800;">TTD: ____________</span>
          </div>
        </div>
      </div>

      <!-- Quick Start Guide (3 Tips) -->
      <div class="neo-card bg-white" style="padding: 9pt 11pt;">
        <div style="font-size: 8.6pt; font-weight: 900; text-transform: uppercase; margin-bottom: 5pt; display: flex; justify-content: space-between; align-items: center;">
          <span>💡 3 PANDUAN CEPAT MEMULAI:</span>
          <span class="neo-tag bg-yellow" style="font-size: 7.4pt;">TIPS BACA</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5.5pt; font-size: 7.5pt;">
          <div style="background: #F8F9FA; border: 1.4px solid #000; border-radius: 6px; padding: 7.5pt 5pt; text-align: center;">
            <div style="font-weight: 900; margin-bottom: 2pt; font-size: 8.2pt;">⏱️ 1 Lembar / Hari</div>
            <div style="color: #444; line-height: 1.32;">Luangkan 5–10 menit santai.</div>
          </div>
          <div style="background: #F8F9FA; border: 1.4px solid #000; border-radius: 6px; padding: 7.5pt 5pt; text-align: center;">
            <div style="font-weight: 900; margin-bottom: 2pt; font-size: 8.2pt;">✍️ Tanpa Sensor</div>
            <div style="color: #444; line-height: 1.32;">Tulis apa adanya tanpa dinilai.</div>
          </div>
          <div style="background: #F8F9FA; border: 1.4px solid #000; border-radius: 6px; padding: 7.5pt 5pt; text-align: center;">
            <div style="font-weight: 900; margin-bottom: 2pt; font-size: 8.2pt;">🔐 Ruang Privat</div>
            <div style="color: #444; line-height: 1.32;">Teman setia perjalanan batin.</div>
          </div>
        </div>
      </div>

      <!-- Welcome Message (Comfortably Anchored) -->
      <div class="neo-card bg-black" style="padding: 10pt 12pt; color: #fff;">
        <div style="font-size: 8.2pt; font-weight: 700; color: #FFE500; line-height: 1.42; margin-bottom: 3.5pt;">
          🌱 "Selamat datang di ruang amanmu. Di sini tidak ada angka rapor, tidak ada jawaban salah. Setiap kejujuranmu untuk mengenali diri adalah awal dari kekuatan mental yang tangguh."
        </div>
        <div style="font-size: 7.6pt; font-weight: 800; color: #fff; text-align: right; text-transform: uppercase; letter-spacing: 0.2px;">
          — Tim Psikologi &amp; Konselor Ruang Tumbuh Remaja
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="page-footer">
      <span>Ruang Tumbuh Remaja • Seri Edukasi Remaja</span>
      <span class="neo-badge bg-black" style="color: #fff;">HALAMAN 01 / 10</span>
    </div>
  </div>

  <!-- =================================================================== -->
  <!-- PAGE 3: HALAMAN 02 / 10 — CARA PAKAI BUKU INI & SAFETY DISCLAIMER   -->
  <!-- =================================================================== -->
  <div class="page">
    <!-- Header -->
    <div class="page-header">
      <span class="neo-badge bg-yellow">PANDUAN PRAKTIS</span>
      <span class="neo-badge bg-white">HALAMAN 02 / 10</span>
    </div>
    <div style="margin-top: 2pt;">
      <h2 class="font-heading" style="font-size: 18.5pt; text-transform: uppercase; margin-bottom: 1pt;">
        CARA PAKAI BUKU INI 📖
      </h2>
      <p style="font-size: 8pt; font-weight: 600; color: #444;">Jadikan workbook ini sahabat terbaik perjalanan mentalmu tanpa beban!</p>
    </div>

    <div class="page-body" style="gap: 8pt;">
      <!-- 4 Golden Rules of Workbook -->
      <div class="neo-card-sm bg-white" style="display: flex; gap: 8.5pt; align-items: center; border-left: 5.5pt solid #FFE500; padding: 9.5pt 10.5pt;">
        <div style="font-size: 20pt; line-height: 1;">📘</div>
        <div>
          <div style="font-size: 8.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2pt;">1. Buku Ini Adalah Teman, Bukan Ujian</div>
          <div style="font-size: 7.8pt; font-weight: 600; color: #222; line-height: 1.38;">
            Baca sesuai kebutuhan dan ritmemu. Kamu tidak harus menyelesaikannya sekaligus. Ambil jeda kapan pun kamu merasa perlu.
          </div>
        </div>
      </div>

      <div class="neo-card-sm bg-white" style="display: flex; gap: 8.5pt; align-items: center; border-left: 5.5pt solid #00E599; padding: 9.5pt 10.5pt;">
        <div style="font-size: 20pt; line-height: 1;">✏️</div>
        <div>
          <div style="font-size: 8.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2pt;">2. Tulis, Coret, dan Ekspresikan!</div>
          <div style="font-size: 7.8pt; font-weight: 600; color: #222; line-height: 1.38;">
            Gunakan setiap halaman latihan sebagai ruang bebas untuk menuangkan pikiran, emosi, coretan, dan perasaan yang sulit diungkapkan.
          </div>
        </div>
      </div>

      <div class="neo-card-sm bg-white" style="display: flex; gap: 8.5pt; align-items: center; border-left: 5.5pt solid #D4BBFF; padding: 9.5pt 10.5pt;">
        <div style="font-size: 20pt; line-height: 1;">🎯</div>
        <div>
          <div style="font-size: 8.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2pt;">3. Tidak Ada Jawaban Sempurna</div>
          <div style="font-size: 7.8pt; font-weight: 600; color: #222; line-height: 1.38;">
            Ini bukan ujian sekolah. Jawaban paling bernilai adalah kejujuranmu yang membantumu memahami apa yang sebenarnya sedang terjadi.
          </div>
        </div>
      </div>

      <div class="neo-card-sm bg-white" style="display: flex; gap: 8.5pt; align-items: center; border-left: 5.5pt solid #FF5E7E; padding: 9.5pt 10.5pt;">
        <div style="font-size: 20pt; line-height: 1;">🤝</div>
        <div>
          <div style="font-size: 8.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2pt;">4. Jangan Hadapi Sendirian</div>
          <div style="font-size: 7.8pt; font-weight: 600; color: #222; line-height: 1.38;">
            Jika beban masalah terasa terlalu berat, jangan dipendam sendiri. Ceritakan kepada orang dewasa yang kamu percaya atau konselor.
          </div>
        </div>
      </div>

      <!-- Interactive Pre-Flight Checklist -->
      <div class="neo-card bg-white" style="padding: 9.5pt 11pt;">
        <div style="font-size: 8.6pt; font-weight: 900; text-transform: uppercase; margin-bottom: 5pt; display: flex; align-items: center; justify-content: space-between;">
          <span>✅ CEKLIS KESIAPAN SEBELUM MEMULAI:</span>
          <span class="neo-tag bg-cyan" style="font-size: 7.4pt;">CHECKLIST</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 4pt; font-size: 7.7pt; font-weight: 700;">
          <div class="neo-box-dashed" style="padding: 5.5pt 7.5pt; display: flex; align-items: center; gap: 6pt;">
            <span style="font-size: 9pt;">☐</span> <span>Aku berada di tempat yang cukup tenang dan nyaman untuk menulis.</span>
          </div>
          <div class="neo-box-dashed" style="padding: 5.5pt 7.5pt; display: flex; align-items: center; gap: 6pt;">
            <span style="font-size: 9pt;">☐</span> <span>Aku mengizinkan diriku merasakan emosi apa pun tanpa menghakimi diri.</span>
          </div>
          <div class="neo-box-dashed" style="padding: 5.5pt 7.5pt; display: flex; align-items: center; gap: 6pt;">
            <span style="font-size: 9pt;">☐</span> <span>Ponselku berada dalam mode hening agar tidak terdistraksi notifikasi.</span>
          </div>
          <div class="neo-box-dashed" style="padding: 5.5pt 7.5pt; display: flex; align-items: center; gap: 6pt;">
            <span style="font-size: 9pt;">☐</span> <span>Aku berniat jujur pada diri sendiri demi kesehatan mentalku.</span>
          </div>
        </div>
      </div>

      <!-- Personal Safe Pledge Box -->
      <div class="neo-card bg-cream" style="padding: 10pt 11.5pt; border-style: dashed; border-width: 1.8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4pt;">
          <span style="font-size: 8.6pt; font-weight: 900; text-transform: uppercase;">✨ JANJI DENGAN DIRIKU SENDIRI:</span>
          <span class="neo-tag bg-yellow" style="font-size: 7.4pt;">KOMITMEN</span>
        </div>
        <div style="font-size: 8pt; font-weight: 600; line-height: 1.4; color: #222; margin-bottom: 5.5pt;">
          "Hari ini aku memilih untuk bersikap ramah pada diriku sendiri. Aku berhak merasa lelah, berhak istirahat, dan berhak meminta pertolongan saat menghadapi masa-masa sulit."
        </div>
        <div style="background: #fff; border: 1.3px solid #000; border-radius: 6px; padding: 5.5pt 7.5pt; font-size: 7.5pt; font-weight: 700; margin-bottom: 5.5pt;">
          <span>📌 3 Hal yang kuizinkan untuk diriku rasakan:</span>
          <div style="display: flex; justify-content: space-between; margin-top: 3pt; color: #444; font-size: 7.3pt;">
            <span>1. Lelah &amp; butuh jeda</span>
            <span>2. Kecewa &amp; menangis</span>
            <span>3. Meminta bantuan</span>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 7.8pt; font-weight: 800;">
          <span>Tanggal: ____/____/202...</span>
          <div style="display: flex; align-items: center; gap: 5pt;">
            <span>Tanda Tangan / Inisial:</span>
            <span style="border-bottom: 1.8px solid #000; width: 95pt; display: inline-block;"></span>
          </div>
        </div>
      </div>

      <!-- Privacy & Safe Ethic Box -->
      <div class="neo-card-sm bg-white" style="border: 1.5px dashed #000; padding: 7.5pt 9.5pt; font-size: 7.6pt; line-height: 1.38; color: #333;">
        🔐 <strong>Etika Privasi:</strong> Isi buku ini adalah catatan privatmu. Kamu tidak wajib memperlihatkannya kepada orang lain kecuali atas keinginanmu sendiri. Jadikan lembaran ini tempat paling aman bagimu bertumbuh.
      </div>

      <!-- Safety & Medical Disclaimer Card -->
      <div class="neo-card bg-white" style="border: 2px dashed #FF5E7E; padding: 9.5pt 11pt;">
        <div style="display: flex; align-items: center; gap: 5pt; margin-bottom: 3.5pt;">
          <span class="neo-tag bg-pink" style="color: #fff; font-size: 7.4pt;">⚠️ PERHATIAN MEDIS</span>
          <span style="font-size: 8.5pt; font-weight: 900; text-transform: uppercase;">DISCLAIMER RESMI</span>
        </div>
        <p style="font-size: 7.6pt; font-weight: 600; line-height: 1.35; margin-bottom: 5pt; color: #222;">
          Buku ini adalah bahan edukasi mandiri (<em>self-help</em>), <strong>bukan pengganti diagnosis psikiatri, psikoterapi klinis, atau penanganan gawat darurat</strong>.
        </p>
        <div class="neo-card-sm bg-cream" style="padding: 6.5pt 8.5pt; border-width: 1.4px;">
          <div style="font-size: 7.4pt; font-weight: 800; text-transform: uppercase; margin-bottom: 2pt; color: #C00;">
            🚨 KONTAK BANTUAN DARURAT 24 JAM (BEBAS PULSA):
          </div>
          <div style="font-size: 7.4pt; font-weight: 600; line-height: 1.35;">
            Jika kamu merasa sangat terpuruk, hubungi orang tua, guru BK, atau hotline kesehatan jiwa Kemenkes RI: <strong>119 (ext. 8)</strong> / Hotline SAPPA <strong>129</strong>.
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="page-footer">
      <span>Ruang Tumbuh Remaja • Edukasi Remaja</span>
      <span class="neo-badge bg-black" style="color: #fff;">HALAMAN 02 / 10</span>
    </div>
  </div>

  <!-- =================================================================== -->
  <!-- PAGE 4: HALAMAN 03 / 10 — PSIKOEDUKASI: PIKIRANMU SEPERTI HP        -->
  <!-- =================================================================== -->
  <div class="page">
    <!-- Header -->
    <div class="page-header">
      <span class="neo-badge bg-mint">PSIKOEDUKASI DASAR</span>
      <span class="neo-badge bg-white">HALAMAN 03 / 10</span>
    </div>
    <div style="margin-top: 2pt;">
      <h2 class="font-heading" style="font-size: 18.5pt; text-transform: uppercase; margin-bottom: 1pt;">
        PIKIRANMU SEPERTI HP 🔋
      </h2>
      <p style="font-size: 8pt; font-weight: 600; color: #444;">Kesehatan mental bukan berarti selalu harus tersenyum bahagia.</p>
    </div>

    <div class="page-body" style="gap: 7.5pt;">
      <!-- Mindset Box -->
      <div class="neo-card bg-yellow" style="padding: 11pt 13pt;">
        <div style="font-size: 8.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 3.5pt; display: flex; align-items: center; gap: 4pt;">
          <span>💡</span> HAKIKAT KESEHATAN MENTAL:
        </div>
        <p style="font-size: 8pt; font-weight: 700; line-height: 1.42; color: #000;">
          Mental yang sehat bukan berarti kamu harus selalu ceria setiap saat. Kamu tetap boleh merasa sedih, kecewa, marah, atau lelah. Yang terpenting adalah belajar mengenali emosi, menyalurkannya secara sehat, dan tahu kapan perlu mengisi ulang energimu. Jangan tunggu hingga 0% untuk beristirahat!
        </p>
      </div>

      <!-- Visual Battery Indicator Gauge -->
      <div class="neo-card bg-white" style="padding: 9.5pt 11pt;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5pt;">
          <span style="font-size: 8.8pt; font-weight: 900; text-transform: uppercase;">📊 TINGKAT ENERGI BATIN:</span>
          <span class="neo-tag bg-cyan" style="font-size: 7.4pt;">STATUS DAYA</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5.5pt; text-align: center;">
          <div class="neo-card-sm" style="background: #E6FCF5; padding: 8pt 5pt;">
            <div style="font-size: 9.5pt; font-weight: 900; color: #087F5B;">🟢 80–100%</div>
            <div style="font-size: 7.6pt; font-weight: 800; text-transform: uppercase; margin: 2pt 0 1.5pt 0;">Daya Penuh</div>
            <div style="font-size: 6.8pt; font-weight: 600; color: #444; line-height: 1.3;">Fokus prima, emosi stabil, siap aktif produktif.</div>
          </div>
          <div class="neo-card-sm" style="background: #FFF9DB; padding: 8pt 5pt;">
            <div style="font-size: 9.5pt; font-weight: 900; color: #F59F00;">🟡 30–60%</div>
            <div style="font-size: 7.6pt; font-weight: 800; text-transform: uppercase; margin: 2pt 0 1.5pt 0;">Hemat Daya</div>
            <div style="font-size: 6.8pt; font-weight: 600; color: #444; line-height: 1.3;">Sensitif, lelah, butuh jeda dan waktu tenang.</div>
          </div>
          <div class="neo-card-sm" style="background: #FFE3E3; padding: 8pt 5pt;">
            <div style="font-size: 9.5pt; font-weight: 900; color: #C92A2A;">🔴 &lt; 20%</div>
            <div style="font-size: 7.6pt; font-weight: 800; text-transform: uppercase; margin: 2pt 0 1.5pt 0;">Kritis / Lag</div>
            <div style="font-size: 6.8pt; font-weight: 600; color: #444; line-height: 1.3;">Burnout, lemas, wajib rehat total tanpa beban.</div>
          </div>
        </div>
      </div>

      <!-- HP Analogy Grid (2 Cards) -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6pt;">
        <div class="neo-card bg-white" style="border-top: 4.5pt solid #FF5E7E; padding: 9pt 10.5pt;">
          <div style="display: flex; align-items: center; gap: 4pt; margin-bottom: 3pt;">
            <span style="font-size: 15pt;">🪫</span>
            <span style="font-size: 8.5pt; font-weight: 900; text-transform: uppercase;">Baterai Menipis</span>
          </div>
          <div style="font-size: 7.6pt; font-weight: 600; color: #444; line-height: 1.38;">
            <strong>Pemicu:</strong> Kurang tidur, tugas bertumpuk, konflik teman sebaya, overthinking medsos berjam-jam.
          </div>
        </div>

        <div class="neo-card bg-white" style="border-top: 4.5pt solid #FFA07A; padding: 9pt 10.5pt;">
          <div style="display: flex; align-items: center; gap: 4pt; margin-bottom: 3pt;">
            <span style="font-size: 15pt;">⚠️</span>
            <span style="font-size: 8.5pt; font-weight: 900; text-transform: uppercase;">Sistem Lemot</span>
          </div>
          <div style="font-size: 7.6pt; font-weight: 600; color: #444; line-height: 1.38;">
            <strong>Dampak:</strong> Sulit konsentrasi, emosi gampang meledak, hilang minat pada hobi, fisik lesu tanpa sebab.
          </div>
        </div>
      </div>

      <!-- 3 Quick Recharge Habits -->
      <div class="neo-card-sm bg-cyan" style="padding: 8.5pt 10.5pt;">
        <div style="font-size: 8.4pt; font-weight: 900; text-transform: uppercase; margin-bottom: 4pt;">
          🔌 3 CARA CEPAT RECHARGE ENERGI PIKIRAN:
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5pt; font-size: 7.5pt; font-weight: 800; text-align: center;">
          <div style="background: #fff; border: 1.4px solid #000; border-radius: 6px; padding: 6.5pt 4pt;">
            <div>😴 TIDUR CUKUP</div>
            <div style="font-weight: 600; color: #555; font-size: 6.8pt; margin-top: 1.5pt;">7–8 jam lelap</div>
          </div>
          <div style="background: #fff; border: 1.4px solid #000; border-radius: 6px; padding: 6.5pt 4pt;">
            <div>📵 JEDA SCREEN</div>
            <div style="font-weight: 600; color: #555; font-size: 6.8pt; margin-top: 1.5pt;">30 mnt tanpa HP</div>
          </div>
          <div style="background: #fff; border: 1.4px solid #000; border-radius: 6px; padding: 6.5pt 4pt;">
            <div>💧 HIDRASI AIR</div>
            <div style="font-weight: 600; color: #555; font-size: 6.8pt; margin-top: 1.5pt;">Segelas air dingin</div>
          </div>
        </div>
      </div>

      <!-- Reflection Box (Expanded Ruled Journal) -->
      <div class="neo-card bg-white" style="padding: 10pt 12pt;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5pt; border-bottom: 1.8px solid #000; padding-bottom: 3.5pt;">
          <span style="font-size: 8.8pt; font-weight: 900; text-transform: uppercase;">📝 JURNAL REFLEKSI BATERAI BATIN:</span>
          <span class="neo-tag bg-mint" style="font-size: 7.4pt;">CEK ENERGI</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 5.5pt; font-size: 7.8pt;">
          <div>
            <div style="font-weight: 800; margin-bottom: 2pt; color: #111;">1. Apa hal terbesar yang menguras bateraiku akhir-akhir ini?</div>
            <div class="ruled-line" style="min-height: 22pt; font-size: 7.6pt;">Contoh: Begadang belajar ujian, overthinking komentar teman...</div>
            <div class="ruled-line" style="min-height: 24pt; font-size: 7.6pt;">Tuliskan penguras energimu: ................................................................................</div>
            <div class="ruled-line" style="min-height: 24pt; font-size: 7.6pt;">Dampak yang terasa pada tubuh: ........................................................................</div>
          </div>
          <div>
            <div style="font-weight: 800; margin-bottom: 2pt; color: #111;">2. Satu langkah recharge realistis yang ingin kulakukan hari ini:</div>
            <div class="ruled-line" style="min-height: 22pt; font-size: 7.6pt;">Contoh: Jalan sore 15 menit tanpa HP, mandi air hangat, dengar musik...</div>
            <div class="ruled-line" style="min-height: 24pt; font-size: 7.6pt;">Aksi recharge pilihanku: ......................................................................................</div>
            <div class="ruled-line" style="min-height: 24pt; font-size: 7.6pt;">Kapan akan kulakukan: Hari ini pukul ..................................................................</div>
          </div>
          <div>
            <div style="font-weight: 800; margin-bottom: 2pt; color: #111;">3. Orang yang keberadaannya paling menenangkan energiku:</div>
            <div class="ruled-line" style="min-height: 24pt; font-size: 7.6pt;">Nama sahabat / keluarga: .....................................................................................</div>
            <div class="ruled-line" style="min-height: 24pt; font-size: 7.6pt;">Alasan merasa aman bersamanya: ........................................................................</div>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; background: #FAF8F5; padding: 6pt 8pt; border-radius: 6px; font-size: 7.6pt; font-weight: 800; border: 1.4px solid #000; margin-top: 5pt;">
          <span>4. Status Batinku Saat Ini:</span>
          <div style="display: flex; gap: 4pt;">
            <span class="neo-card-sm bg-white" style="padding: 2.5pt 5pt; font-size: 7pt; font-weight: 800;">10% 🪫</span>
            <span class="neo-card-sm bg-white" style="padding: 2.5pt 5pt; font-size: 7pt; font-weight: 800;">25% 🟡</span>
            <span class="neo-card-sm bg-white" style="padding: 2.5pt 5pt; font-size: 7pt; font-weight: 800;">50% 🔋</span>
            <span class="neo-card-sm bg-white" style="padding: 2.5pt 5pt; font-size: 7pt; font-weight: 800;">75% ⚡</span>
            <span class="neo-card-sm bg-white" style="padding: 2.5pt 5pt; font-size: 7pt; font-weight: 800;">100% 🟢</span>
          </div>
        </div>
      </div>

      <!-- Encouraging Card -->
      <div class="neo-card-sm bg-black" style="color: #fff; padding: 9.5pt 12pt;">
        <div style="font-size: 8pt; font-weight: 700; color: #FFE500; line-height: 1.4; margin-bottom: 2pt;">
          🌱 "Baterai yang habis bukanlah kegagalan. Itu tanda alamiah bahwa kamu adalah manusia, bukan mesin. Beristirahatlah sejenak!"
        </div>
        <div style="font-size: 7.2pt; font-weight: 800; color: #fff; text-align: right; text-transform: uppercase;">
          — RUANG TUMBUH KESEHATAN REMAJA
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="page-footer">
      <span>Ruang Tumbuh Remaja • Edukasi Remaja</span>
      <span class="neo-badge bg-black" style="color: #fff;">HALAMAN 03 / 10</span>
    </div>
  </div>

  <!-- =================================================================== -->
  <!-- PAGE 5: HALAMAN 04 / 10 — LATIHAN MANDIRI 01: EMOTION DIARY (PART 1)-->
  <!-- =================================================================== -->
  <div class="page">
    <!-- Header -->
    <div class="page-header">
      <span class="neo-badge bg-pink" style="color: #fff;">LATIHAN MANDIRI 01</span>
      <span class="neo-badge bg-white">HALAMAN 04 / 10</span>
    </div>
    <div style="margin-top: 2pt;">
      <h2 class="font-heading" style="font-size: 18.5pt; text-transform: uppercase; margin-bottom: 1pt;">
        1. EMOTION DIARY 🎯
      </h2>
      <p style="font-size: 8pt; font-weight: 600; color: #444;">Langkah pertama mengendalikan emosi adalah memberinya nama yang jelas.</p>
    </div>

    <div class="page-body" style="gap: 7.5pt;">
      <!-- A. Emosi apa yang kurasakan? -->
      <div class="neo-card bg-white" style="padding: 10pt 11pt;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5pt;">
          <span style="font-size: 8.8pt; font-weight: 900; text-transform: uppercase;">A. EMOSI APA YANG SEDANG KURASAKAN?</span>
          <span class="neo-tag bg-yellow" style="font-size: 7.4pt;">PILIH 1–2 RASA</span>
        </div>
        <!-- 10 Emotion Pills -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 4.5pt;">
          <div class="neo-card-sm" style="padding: 6pt 8pt; display: flex; align-items: center; gap: 6pt; font-size: 8pt; font-weight: 800; background: #FFF9DB;">
            <span style="font-size: 9.5pt;">☐</span> <span>😊 Senang &amp; Bangga</span>
          </div>
          <div class="neo-card-sm" style="padding: 6pt 8pt; display: flex; align-items: center; gap: 6pt; font-size: 8pt; font-weight: 800; background: #E6FCF5;">
            <span style="font-size: 9.5pt;">☐</span> <span>🌿 Tenang &amp; Santai</span>
          </div>
          <div class="neo-card-sm" style="padding: 6pt 8pt; display: flex; align-items: center; gap: 6pt; font-size: 8pt; font-weight: 800; background: #F8F9FA;">
            <span style="font-size: 9.5pt;">☐</span> <span>😐 Biasa Saja / Datar</span>
          </div>
          <div class="neo-card-sm" style="padding: 6pt 8pt; display: flex; align-items: center; gap: 6pt; font-size: 8pt; font-weight: 800; background: #E7F5FF;">
            <span style="font-size: 9.5pt;">☐</span> <span>😢 Sedih &amp; Terluka</span>
          </div>
          <div class="neo-card-sm" style="padding: 6pt 8pt; display: flex; align-items: center; gap: 6pt; font-size: 8pt; font-weight: 800; background: #FFE3E3;">
            <span style="font-size: 9.5pt;">☐</span> <span>😡 Marah &amp; Kesal</span>
          </div>
          <div class="neo-card-sm" style="padding: 6pt 8pt; display: flex; align-items: center; gap: 6pt; font-size: 8pt; font-weight: 800; background: #FFF3BF;">
            <span style="font-size: 9.5pt;">☐</span> <span>😰 Cemas &amp; Khawatir</span>
          </div>
          <div class="neo-card-sm" style="padding: 6pt 8pt; display: flex; align-items: center; gap: 6pt; font-size: 8pt; font-weight: 800; background: #F3D9FA;">
            <span style="font-size: 9.5pt;">☐</span> <span>😵‍💫 Bingung &amp; Bimbang</span>
          </div>
          <div class="neo-card-sm" style="padding: 6pt 8pt; display: flex; align-items: center; gap: 6pt; font-size: 8pt; font-weight: 800; background: #FFE8CC;">
            <span style="font-size: 9.5pt;">☐</span> <span>😳 Malu &amp; Canggung</span>
          </div>
          <div class="neo-card-sm" style="padding: 6pt 8pt; display: flex; align-items: center; gap: 6pt; font-size: 8pt; font-weight: 800; background: #FFD8A8;">
            <span style="font-size: 9.5pt;">☐</span> <span>💔 Kecewa &amp; Menyesal</span>
          </div>
          <div class="neo-card-sm" style="padding: 6pt 8pt; display: flex; align-items: center; gap: 6pt; font-size: 8pt; font-weight: 800; background: #E9ECEF;">
            <span style="font-size: 9.5pt;">☐</span> <span>😫 Lelah &amp; Jenuh</span>
          </div>
        </div>
      </div>

      <!-- B. Apa yang terjadi? (Expanded Ruled Lines) -->
      <div class="neo-card bg-white" style="padding: 10pt 12pt;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3.5pt;">
          <span style="font-size: 8.8pt; font-weight: 900; text-transform: uppercase;">B. APA YANG TERJADI? (SITUASI PEMICU)</span>
          <span class="neo-tag bg-cyan" style="font-size: 7.4pt;">FAKTA NYATA</span>
        </div>
        <div style="font-size: 7.6pt; color: #555; margin-bottom: 3.5pt; font-weight: 600;">
          Tuliskan peristiwa konkret: siapa, kapan, di mana, dan apa yang sebenarnya terjadi.
        </div>
        <div class="neo-box-dashed" style="background: #FAF8F5; padding: 6pt 9pt;">
          <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">Tuliskan pemicu situasimu di sini: .....................................................................</div>
          <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">Siapa saja yang terlibat &amp; di mana lokasinya: .....................................................</div>
          <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">Fakta konkret yang terjadi: .................................................................................</div>
          <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">Hal yang paling memicu reaksiku: ....................................................................</div>
        </div>
        <!-- Physical Body Sensations -->
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 7.3pt; font-weight: 700; margin-top: 5pt; color: #333;">
          <span style="font-weight: 800;">Sensasi Fisik:</span>
          <span>☐ Jantung deg-degan</span>
          <span>☐ Dada sesak</span>
          <span>☐ Perut mual</span>
          <span>☐ Otot tegang</span>
        </div>
      </div>

      <!-- C. Apa yang kupikirkan? (Expanded Ruled Lines) -->
      <div class="neo-card bg-white" style="padding: 10pt 12pt;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3.5pt;">
          <span style="font-size: 8.8pt; font-weight: 900; text-transform: uppercase;">C. APA YANG KUPIKIRKAN? (PIKIRAN OTOMATIS)</span>
          <span class="neo-tag bg-purple" style="font-size: 7.4pt;">SUARA BATIN</span>
        </div>
        <div style="font-size: 7.6pt; color: #555; margin-bottom: 3.5pt; font-weight: 600;">
          Pikiran spontan yang melintas di kepala: <em>"Mereka tidak suka padaku", "Aku tidak pandai".</em>
        </div>
        <div class="neo-box-dashed" style="background: #FAF8F5; padding: 6pt 9pt;">
          <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">Tuliskan kalimat praduga atau asumsi di kepalamu: ....................................</div>
          <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">Apakah asumsi ini pasti benar? ........................................................................</div>
          <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">Pikiran alternatif yang lebih realistis &amp; adil: .....................................................</div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 7.3pt; font-weight: 700; margin-top: 5pt; color: #333;">
          <span style="font-weight: 800;">Jebakan Pikiran:</span>
          <span>☐ Melebih-lebihkan</span>
          <span>☐ Asumsi Negatif</span>
          <span>☐ Menyalahkan Diri</span>
        </div>
      </div>

      <!-- D. Seberapa Kuat Emosinya? -->
      <div class="neo-card bg-yellow" style="padding: 9pt 11pt;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4.5pt;">
          <span style="font-size: 8.8pt; font-weight: 900; text-transform: uppercase;">D. SEBERAPA KUAT INTENSITAS EMOSINYA?</span>
          <span class="neo-tag bg-white" style="font-size: 7.4pt;">LINGKARI 1–10</span>
        </div>
        <!-- Meter 1 to 10 -->
        <div style="display: flex; justify-content: space-between; gap: 3.5pt;">
          <div class="neo-card-sm" style="flex: 1; text-align: center; padding: 6.5pt 0; font-weight: 900; font-size: 8.5pt; background: #D3F9D8;">1</div>
          <div class="neo-card-sm" style="flex: 1; text-align: center; padding: 6.5pt 0; font-weight: 900; font-size: 8.5pt; background: #D3F9D8;">2</div>
          <div class="neo-card-sm" style="flex: 1; text-align: center; padding: 6.5pt 0; font-weight: 900; font-size: 8.5pt; background: #E6FCF5;">3</div>
          <div class="neo-card-sm" style="flex: 1; text-align: center; padding: 6.5pt 0; font-weight: 900; font-size: 8.5pt; background: #FFF3BF;">4</div>
          <div class="neo-card-sm" style="flex: 1; text-align: center; padding: 6.5pt 0; font-weight: 900; font-size: 8.5pt; background: #FFF3BF;">5</div>
          <div class="neo-card-sm" style="flex: 1; text-align: center; padding: 6.5pt 0; font-weight: 900; font-size: 8.5pt; background: #FFE8CC;">6</div>
          <div class="neo-card-sm" style="flex: 1; text-align: center; padding: 6.5pt 0; font-weight: 900; font-size: 8.5pt; background: #FFD8A8;">7</div>
          <div class="neo-card-sm" style="flex: 1; text-align: center; padding: 6.5pt 0; font-weight: 900; font-size: 8.5pt; background: #FFA8A8;">8</div>
          <div class="neo-card-sm" style="flex: 1; text-align: center; padding: 6.5pt 0; font-weight: 900; font-size: 8.5pt; background: #FF8787; color: #fff;">9</div>
          <div class="neo-card-sm" style="flex: 1; text-align: center; padding: 6.5pt 0; font-weight: 900; font-size: 8.5pt; background: #E03131; color: #fff;">10</div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 7.5pt; font-weight: 800; text-transform: uppercase; margin-top: 4.5pt; color: #222;">
          <span>Ringan (1–3)</span>
          <span>Sedang (4–6)</span>
          <span>Sangat Kuat (7–10)</span>
        </div>
      </div>

      <!-- CBT Pro-Tip & Checkpoint -->
      <div class="neo-card-sm bg-purple" style="padding: 9pt 11pt;">
        <div style="font-size: 7.8pt; font-weight: 800; line-height: 1.4;">
          💡 <strong>PRINSIP CBT:</strong> "Bukan peristiwanya yang membuatmu cemas atau sedih, melainkan cara pikiranmu menafsirkan peristiwa tersebut. Ubah sudut pandangmu, rasakan ringannya hatimu."
        </div>
      </div>

      <!-- Checkpoint Pill -->
      <div class="neo-card-sm bg-mint" style="padding: 7.5pt 10pt; text-align: center;">
        <div style="font-size: 7.8pt; font-weight: 800; text-transform: uppercase;">
          [✓] Aku telah mencatat emosi ini secara jujur apa adanya tanpa menyensor perasaanku.
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="page-footer">
      <span>Ruang Tumbuh Remaja • Edukasi Remaja</span>
      <span class="neo-badge bg-black" style="color: #fff;">HALAMAN 04 / 10</span>
    </div>
  </div>

  <!-- =================================================================== -->
  <!-- PAGE 6: HALAMAN 05 / 10 — LATIHAN MANDIRI 01: EMOTION DIARY (PART 2)-->
  <!-- =================================================================== -->
  <div class="page">
    <!-- Header -->
    <div class="page-header">
      <span class="neo-badge bg-cyan">LATIHAN MANDIRI 01 (LANJUTAN)</span>
      <span class="neo-badge bg-white">HALAMAN 05 / 10</span>
    </div>
    <div style="margin-top: 2pt;">
      <h2 class="font-heading" style="font-size: 18.5pt; text-transform: uppercase; margin-bottom: 1pt;">
        RESPON &amp; CONTOH KASUS 💡
      </h2>
      <p style="font-size: 8pt; font-weight: 600; color: #444;">Mengubah reaksi emosional spontan menjadi respon pemulihan yang sehat.</p>
    </div>

    <div class="page-body" style="gap: 7.5pt;">
      <!-- E. Apa yang biasanya kulakukan setelahnya? -->
      <div class="neo-card bg-white" style="padding: 10pt 12pt;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3.5pt;">
          <span style="font-size: 8.8pt; font-weight: 900; text-transform: uppercase;">E. APA YANG BIASANYA KULAKUKAN?</span>
          <span class="neo-tag bg-pink" style="color: #fff; font-size: 7.4pt;">REAKSI LAMA</span>
        </div>
        <div style="font-size: 7.6pt; color: #555; margin-bottom: 3.5pt; font-weight: 600;">
          Reaksi spontan: <em>menangis di kamar, membanting pintu, malas bicara, atau scroll medsos berjam-jam.</em>
        </div>
        <div class="neo-box-dashed" style="background: #FAF8F5; padding: 6pt 9pt;">
          <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">Tuliskan kebiasaan reaksimu saat emosi memuncak: ..................................</div>
          <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">Dampak reaksi spontan ini pada tubuh &amp; pikiran: .......................................</div>
          <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">Apakah reaksi lama ini benar-benar menyelesaikan masalah? ....................</div>
        </div>
      </div>

      <!-- F. Alternatif tindakan sehat -->
      <div class="neo-card bg-mint" style="padding: 10pt 12pt;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3.5pt;">
          <span style="font-size: 8.8pt; font-weight: 900; text-transform: uppercase;">F. ALTERNATIF RESPON YANG LEBIH SEHAT</span>
          <span class="neo-tag bg-white" style="font-size: 7.4pt;">RESPON BIJAK</span>
        </div>
        <div style="font-size: 7.6pt; color: #111; margin-bottom: 3.5pt; font-weight: 600;">
          Langkah baru: <em>tarik nafas perlahan, minum air dingin, jalan santai, atau bicara baik-baik.</em>
        </div>
        <div class="neo-box-dashed" style="background: #fff; padding: 6pt 9pt;">
          <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">Langkah sehat yang ingin kucoba nanti saat situasi ini terjadi lagi: .............</div>
          <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">Kebutuhan batin yang ingin kupenuhi (rasa aman, didengar): ...................</div>
          <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">Pengingat untuk diri sendiri sebelum bereaksi: .............................................</div>
        </div>
      </div>

      <!-- Case Study Card -->
      <div class="neo-card bg-purple" style="padding: 10pt 12pt;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5pt; border-bottom: 1.8px solid #000; padding-bottom: 3pt;">
          <span style="font-size: 8.8pt; font-weight: 900; text-transform: uppercase;">⭐ CONTOH NYATA DARI WORKBOOK:</span>
          <span class="neo-tag bg-white" style="font-size: 7.4pt;">STUDI KASUS</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 4pt; font-size: 7.6pt;">
          <div style="display: flex; justify-content: space-between; background: #fff; border: 1.5px solid #000; border-radius: 6px; padding: 4pt 7pt;">
            <span style="font-weight: 800;">📅 Kejadian:</span>
            <span style="font-weight: 600;">Senin / Mendapat nilai ulangan matematika jelek</span>
          </div>
          <div style="display: flex; justify-content: space-between; background: #fff; border: 1.5px solid #000; border-radius: 6px; padding: 4pt 7pt;">
            <span style="font-weight: 800;">🎭 Emosi &amp; Skor:</span>
            <span style="font-weight: 700; color: #C00;">Sedih, Kecewa • Intensitas 8 / 10</span>
          </div>
          <div style="display: flex; justify-content: space-between; background: #fff; border: 1.5px solid #000; border-radius: 6px; padding: 4pt 7pt;">
            <span style="font-weight: 800;">💭 Pikiran Otomatis:</span>
            <span style="font-weight: 600;">"Aku bodoh, masa depanku pasti berantakan"</span>
          </div>
          <div style="background: #FFE500; border: 1.5px solid #000; border-radius: 6px; padding: 4.5pt 7pt;">
            <div style="font-weight: 900; font-size: 7.6pt; text-transform: uppercase; margin-bottom: 2pt;">🎯 KEBUTUHAN &amp; RESPON SEHAT:</div>
            <div style="font-weight: 600; font-size: 7.4pt; line-height: 1.38;">
              Tarik nafas, akui rasa kecewa tanpa mencela diri. Istirahat sejenak, lalu minta bantuan teman/guru untuk membahas soal yang belum dipahami.
            </div>
          </div>
        </div>
      </div>

      <!-- 3 Golden Reflection Questions -->
      <div class="neo-card-sm bg-yellow" style="padding: 9pt 11pt;">
        <div style="font-size: 8.5pt; font-weight: 900; text-transform: uppercase; margin-bottom: 3pt;">
          ❓ 3 PERTANYAAN EMAS PENJAGA EMOSI:
        </div>
        <div style="font-size: 7.7pt; font-weight: 700; line-height: 1.42; color: #222;">
          1. Apakah pikiran ini 100% fakta nyata, atau hanya praduga cemas kepalaku?<br>
          2. Jika sahabat terbaikku yang mengalaminya, nasihat lembut apa yang kuberikan padanya?<br>
          3. Tindakan kecil apa yang bisa kulakukan dalam 10 menit ini agar merasa lebih aman?
        </div>
      </div>

      <!-- Daily Mini Practice Log (5 Rows) -->
      <div class="neo-card bg-white" style="padding: 9.5pt 11pt;">
        <div style="font-size: 8.6pt; font-weight: 900; text-transform: uppercase; margin-bottom: 4.5pt; display: flex; justify-content: space-between;">
          <span>📝 LOG MANDIRI CEPAT:</span>
          <span class="neo-tag bg-cyan" style="font-size: 7.4pt;">LATIHAN HARIAN</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 4pt; font-size: 7.5pt;">
          <div style="display: grid; grid-template-columns: 1.2fr 1fr 1.5fr; gap: 4pt; background: #FEF6E4; padding: 4pt; border: 1.3px solid #000; border-radius: 5px; font-weight: 800; text-align: center;">
            <span>PERISTIWA</span><span>EMOSI (1-10)</span><span>RESPON BARUKU</span>
          </div>
          <div style="display: grid; grid-template-columns: 1.2fr 1fr 1.5fr; gap: 4pt; padding: 5pt 3pt; border: 1.2px dashed #888; border-radius: 5px; font-size: 7.3pt; color: #666;">
            <span>Hari 1: .................</span><span>...........................</span><span>...........................</span>
          </div>
          <div style="display: grid; grid-template-columns: 1.2fr 1fr 1.5fr; gap: 4pt; padding: 5pt 3pt; border: 1.2px dashed #888; border-radius: 5px; font-size: 7.3pt; color: #666;">
            <span>Hari 2: .................</span><span>...........................</span><span>...........................</span>
          </div>
          <div style="display: grid; grid-template-columns: 1.2fr 1fr 1.5fr; gap: 4pt; padding: 5pt 3pt; border: 1.2px dashed #888; border-radius: 5px; font-size: 7.3pt; color: #666;">
            <span>Hari 3: .................</span><span>...........................</span><span>...........................</span>
          </div>
          <div style="display: grid; grid-template-columns: 1.2fr 1fr 1.5fr; gap: 4pt; padding: 5pt 3pt; border: 1.2px dashed #888; border-radius: 5px; font-size: 7.3pt; color: #666;">
            <span>Hari 4: .................</span><span>...........................</span><span>...........................</span>
          </div>
          <div style="display: grid; grid-template-columns: 1.2fr 1fr 1.5fr; gap: 4pt; padding: 5pt 3pt; border: 1.2px dashed #888; border-radius: 5px; font-size: 7.3pt; color: #666;">
            <span>Hari 5: .................</span><span>...........................</span><span>...........................</span>
          </div>
        </div>
      </div>

      <!-- Affirmation Pill -->
      <div class="neo-card-sm bg-mint" style="padding: 7.5pt 10pt; text-align: center;">
        <div style="font-size: 7.8pt; font-weight: 800; text-transform: uppercase;">
          🌱 SETIAP RESPON BARU ADALAH KEMENANGAN KECIL BAGI KESEHATAN MENTALMU!
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="page-footer">
      <span>Ruang Tumbuh Remaja • Edukasi Remaja</span>
      <span class="neo-badge bg-black" style="color: #fff;">HALAMAN 05 / 10</span>
    </div>
  </div>

  <!-- =================================================================== -->
  <!-- PAGE 7: HALAMAN 06 / 10 — MINDSET: EMOSI BUKAN MUSUHMU!             -->
  <!-- =================================================================== -->
  <div class="page">
    <!-- Header -->
    <div class="page-header">
      <span class="neo-badge bg-mint">MINDSET EMOSIONAL</span>
      <span class="neo-badge bg-white">HALAMAN 06 / 10</span>
    </div>
    <div style="margin-top: 2pt;">
      <h2 class="font-heading" style="font-size: 18.5pt; text-transform: uppercase; margin-bottom: 1pt;">
        EMOSI BUKAN MUSUHMU! 🛡️
      </h2>
      <p style="font-size: 8pt; font-weight: 600; color: #444;">Setiap rasa yang hadir membawa pesan penting tentang kebutuhan batinmu.</p>
    </div>

    <div class="page-body" style="gap: 7.5pt;">
      <!-- Quote Banner -->
      <div class="neo-card bg-yellow" style="padding: 11pt 13pt;">
        <div style="font-size: 10pt; font-weight: 900; line-height: 1.25; margin-bottom: 3.5pt;">
          🌱 "Aku tidak harus membuang semua emosi. Aku sedang belajar memahaminya."
        </div>
        <p style="font-size: 8pt; font-weight: 600; line-height: 1.42; color: #222;">
          Marah, sedih, kecewa, takut, atau cemas adalah <strong>sinyal alami sistem pertahanan tubuh</strong> bahwa ada hal berharga yang membutuhkan perhatianmu. Yang penting bukan menekan emosi, melainkan meresponsnya secara bijak dan penuh kasih sayang.
        </p>
      </div>

      <!-- Emotional Meaning Matrix (2x2 Grid) -->
      <div class="neo-card bg-white" style="padding: 9.5pt 11pt;">
        <div style="font-size: 8.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 5pt; display: flex; justify-content: space-between;">
          <span>🔍 PESAN DI BALIK SETIAP EMOSIMU:</span>
          <span class="neo-tag bg-cyan" style="font-size: 7.4pt;">KAMUS EMOSI</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5.5pt; font-size: 7.6pt;">
          <div class="neo-card-sm" style="background: #FFF5F5; border-left: 4.5pt solid #FF5E7E; padding: 7.5pt 8pt;">
            <strong style="color: #C00; font-size: 8.2pt;">😡 MARAH:</strong><br>
            Batasan dirimu dilanggar atau ada ketidakadilan. Butuh ketegasan asertif yang tenang.
          </div>
          <div class="neo-card-sm" style="background: #EBF8FF; border-left: 4.5pt solid #00F0FF; padding: 7.5pt 8pt;">
            <strong style="color: #007799; font-size: 8.2pt;">😢 SEDIH:</strong><br>
            Kamu kehilangan hal berharga bagimu. Butuh jeda sejenak, kehangatan, dan pemulihan.
          </div>
          <div class="neo-card-sm" style="background: #FFFDE7; border-left: 4.5pt solid #FFE500; padding: 7.5pt 8pt;">
            <strong style="color: #887000; font-size: 8.2pt;">😰 CEMAS:</strong><br>
            Otakmu bersiap melindungi dari bahaya. Butuh rasa aman, grounding, &amp; rencana kecil.
          </div>
          <div class="neo-card-sm" style="background: #F3E8FF; border-left: 4.5pt solid #D4BBFF; padding: 7.5pt 8pt;">
            <strong style="color: #552299; font-size: 8.2pt;">💔 KECEWA:</strong><br>
            Ada jarak harapan vs kenyataan hidup. Butuh penerimaan diri, adaptasi, dan harapan baru.
          </div>
        </div>
      </div>

      <!-- 6 Action Steps -->
      <div class="neo-card bg-white" style="padding: 10pt 11.5pt;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5pt;">
          <span style="font-size: 8.8pt; font-weight: 900; text-transform: uppercase;">🚨 6 PROTOKOL SAAT KEWALAHAN EMOSI:</span>
          <span class="neo-tag bg-mint" style="font-size: 7.4pt;">PANDUAN AKSI</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 4pt;">
          <div class="neo-card-sm bg-white" style="display: flex; align-items: center; gap: 7pt; padding: 5.5pt 8pt;">
            <span class="neo-badge bg-cyan" style="font-size: 8pt; padding: 2.5pt 6pt;">01</span>
            <div style="font-size: 7.6pt; line-height: 1.32;">
              <strong>Beri Nama Emosimu:</strong> Akui dengan jujur apa yang kamu rasakan (takut, sedih, kecewa). Jangan disangkal.
            </div>
          </div>
          <div class="neo-card-sm bg-white" style="display: flex; align-items: center; gap: 7pt; padding: 5.5pt 8pt;">
            <span class="neo-badge bg-yellow" style="font-size: 8pt; padding: 2.5pt 6pt;">02</span>
            <div style="font-size: 7.6pt; line-height: 1.32;">
              <strong>Ambil Jeda (Stop):</strong> Tarik nafas 4 detik, basuh muka atau minum air. Tunda reaksi spontan selama 5 menit.
            </div>
          </div>
          <div class="neo-card-sm bg-white" style="display: flex; align-items: center; gap: 7pt; padding: 5.5pt 8pt;">
            <span class="neo-badge bg-mint" style="font-size: 8pt; padding: 2.5pt 6pt;">03</span>
            <div style="font-size: 7.6pt; line-height: 1.32;">
              <strong>Rilis Fisik Sehat:</strong> Jalan santai, corat-coret di buku, meremas stress ball, atau dengarkan lagu favorit.
            </div>
          </div>
          <div class="neo-card-sm bg-white" style="display: flex; align-items: center; gap: 7pt; padding: 5.5pt 8pt;">
            <span class="neo-badge bg-pink" style="color: #fff; font-size: 8pt; padding: 2.5pt 6pt;">04</span>
            <div style="font-size: 7.6pt; line-height: 1.32;">
              <strong>Jaga Keamanan Diri:</strong> Hindari tindakan impulsif yang membahayakan tubuhmu (*no self-harm* sama sekali).
            </div>
          </div>
          <div class="neo-card-sm bg-white" style="display: flex; align-items: center; gap: 7pt; padding: 5.5pt 8pt;">
            <span class="neo-badge bg-purple" style="font-size: 8pt; padding: 2.5pt 6pt;">05</span>
            <div style="font-size: 7.6pt; line-height: 1.32;">
              <strong>Bicara Lembut pada Diri:</strong> Hentikan self-blame. Bicaralah pada dirimu seperti menghibur sahabat terbaik.
            </div>
          </div>
          <div class="neo-card-sm bg-white" style="display: flex; align-items: center; gap: 7pt; padding: 5.5pt 8pt;">
            <span class="neo-badge bg-orange" style="font-size: 8pt; padding: 2.5pt 6pt;">06</span>
            <div style="font-size: 7.6pt; line-height: 1.32;">
              <strong>Buka Suara:</strong> Ceritakan perasaanmu kepada orang dewasa tepercaya, guru BK, atau konselor sebaya.
            </div>
          </div>
        </div>
      </div>

      <!-- Insight Card -->
      <div class="neo-card-sm bg-purple" style="padding: 9pt 11pt; color: #fff;">
        <div style="font-size: 7.8pt; font-weight: 700; line-height: 1.4;">
          💡 <strong>PESAN UNTUK HATIMU:</strong> "Jangan takut pada amarahmu atau air matamu. Emosi adalah caramu memproses hidup. Yang terpenting adalah kamu tidak menyakiti dirimu sendiri atau orang lain."
        </div>
      </div>

      <!-- Calming Mantra Ruled Line (4 Rows for Trusted Contacts & Script) -->
      <div class="neo-card bg-cream" style="padding: 10pt 12pt; border-style: dashed; border-width: 1.8px;">
        <div style="font-size: 8.5pt; font-weight: 800; margin-bottom: 3.5pt;">
          ✨ Orang tepercaya yang bisa kuhubungi saat kewalahan:
        </div>
        <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">1. Nama Kontak 1: ........................................... | No. HP / WhatsApp: ....................</div>
        <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">2. Nama Kontak 2: ........................................... | Hubungan: ................................</div>
        <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">Waktu aman yang paling nyaman untuk menghubunginya: ....................................</div>
        <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">Kalimat pembukaku: "Hai, aku sedang butuh teman cerita sebentar..." ................</div>
      </div>
    </div>

    <!-- Footer -->
    <div class="page-footer">
      <span>Ruang Tumbuh Remaja • Edukasi Remaja</span>
      <span class="neo-badge bg-black" style="color: #fff;">HALAMAN 06 / 10</span>
    </div>
  </div>

  <!-- =================================================================== -->
  <!-- PAGE 8: HALAMAN 07 / 10 — LATIHAN MANDIRI 02: MOOD TRACKER 7 HARI   -->
  <!-- =================================================================== -->
  <div class="page">
    <!-- Header -->
    <div class="page-header">
      <span class="neo-badge bg-purple">LATIHAN MANDIRI 02</span>
      <span class="neo-badge bg-white">HALAMAN 07 / 10</span>
    </div>
    <div style="margin-top: 2pt;">
      <h2 class="font-heading" style="font-size: 18.5pt; text-transform: uppercase; margin-bottom: 1pt;">
        2. MOOD TRACKER 7 HARI 📊
      </h2>
      <p style="font-size: 8pt; font-weight: 600; color: #444;">Amati grafik naik-turun suasana hatimu dan kenali polanya.</p>
    </div>

    <div class="page-body" style="gap: 7.5pt;">
      <!-- Mood Symbols Legend -->
      <div style="display: flex; justify-content: space-between; align-items: center; background: #fff; border: 1.8px solid #000; border-radius: 7px; padding: 7pt 12pt; font-size: 8pt; font-weight: 800;">
        <span style="font-weight: 900;">SIMBOL MOOD:</span>
        <span>😊 Senang</span>
        <span>🌿 Tenang</span>
        <span>😐 Datar</span>
        <span>😢 Sedih</span>
        <span>😡 Kesal</span>
      </div>

      <!-- 7 Day Table (Generous Row Heights) -->
      <div class="neo-card bg-white" style="padding: 6pt 7pt;">
        <table style="width: 100%; border-collapse: collapse; font-size: 7.8pt;">
          <thead>
            <tr style="background: #FFE500; border-bottom: 2px solid #000;">
              <th style="padding: 7pt 2pt; border: 1.4px solid #000; font-weight: 900; width: 14%;">HARI</th>
              <th style="padding: 7pt 2pt; border: 1.4px solid #000; font-weight: 900; width: 24%;">MOOD</th>
              <th style="padding: 7pt 2pt; border: 1.4px solid #000; font-weight: 900; width: 31%;">PEMICU UTAMA</th>
              <th style="padding: 7pt 2pt; border: 1.4px solid #000; font-weight: 900; width: 31%;">SELF-CARE HARIAN</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 12pt 2pt; border: 1.4px solid #000; font-weight: 800; text-align: center; background: #FEF6E4;">HARI 1</td>
              <td style="padding: 12pt 2pt; border: 1.4px solid #000; text-align: center; font-size: 9pt;">😊 🌿 😐 😢 😡</td>
              <td style="padding: 12pt 4pt; border: 1.4px solid #000; color: #888; font-style: italic;">Tugas sekolah...</td>
              <td style="padding: 12pt 4pt; border: 1.4px solid #000; color: #888; font-style: italic;">Dengar lagu tenang...</td>
            </tr>
            <tr>
              <td style="padding: 12pt 2pt; border: 1.4px solid #000; font-weight: 800; text-align: center; background: #FEF6E4;">HARI 2</td>
              <td style="padding: 12pt 2pt; border: 1.4px solid #000; text-align: center; font-size: 9pt;">😊 🌿 😐 😢 😡</td>
              <td style="padding: 12pt 4pt; border: 1.4px solid #000;"></td>
              <td style="padding: 12pt 4pt; border: 1.4px solid #000;"></td>
            </tr>
            <tr>
              <td style="padding: 12pt 2pt; border: 1.4px solid #000; font-weight: 800; text-align: center; background: #FEF6E4;">HARI 3</td>
              <td style="padding: 12pt 2pt; border: 1.4px solid #000; text-align: center; font-size: 9pt;">😊 🌿 😐 😢 😡</td>
              <td style="padding: 12pt 4pt; border: 1.4px solid #000;"></td>
              <td style="padding: 12pt 4pt; border: 1.4px solid #000;"></td>
            </tr>
            <tr>
              <td style="padding: 12pt 2pt; border: 1.4px solid #000; font-weight: 800; text-align: center; background: #FEF6E4;">HARI 4</td>
              <td style="padding: 12pt 2pt; border: 1.4px solid #000; text-align: center; font-size: 9pt;">😊 🌿 😐 😢 😡</td>
              <td style="padding: 12pt 4pt; border: 1.4px solid #000;"></td>
              <td style="padding: 12pt 4pt; border: 1.4px solid #000;"></td>
            </tr>
            <tr>
              <td style="padding: 12pt 2pt; border: 1.4px solid #000; font-weight: 800; text-align: center; background: #FEF6E4;">HARI 5</td>
              <td style="padding: 12pt 2pt; border: 1.4px solid #000; text-align: center; font-size: 9pt;">😊 🌿 😐 😢 😡</td>
              <td style="padding: 12pt 4pt; border: 1.4px solid #000;"></td>
              <td style="padding: 12pt 4pt; border: 1.4px solid #000;"></td>
            </tr>
            <tr>
              <td style="padding: 12pt 2pt; border: 1.4px solid #000; font-weight: 800; text-align: center; background: #FEF6E4;">HARI 6</td>
              <td style="padding: 12pt 2pt; border: 1.4px solid #000; text-align: center; font-size: 9pt;">😊 🌿 😐 😢 😡</td>
              <td style="padding: 12pt 4pt; border: 1.4px solid #000;"></td>
              <td style="padding: 12pt 4pt; border: 1.4px solid #000;"></td>
            </tr>
            <tr>
              <td style="padding: 12pt 2pt; border: 1.4px solid #000; font-weight: 800; text-align: center; background: #FEF6E4;">HARI 7</td>
              <td style="padding: 12pt 2pt; border: 1.4px solid #000; text-align: center; font-size: 9pt;">😊 🌿 😐 😢 😡</td>
              <td style="padding: 12pt 4pt; border: 1.4px solid #000;"></td>
              <td style="padding: 12pt 4pt; border: 1.4px solid #000;"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Weekly Reflection Card (Filled & Structured) -->
      <div class="neo-card bg-cream" style="padding: 10pt 12pt;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5pt; border-bottom: 1.8px solid #000; padding-bottom: 3pt;">
          <span style="font-size: 8.8pt; font-weight: 900; text-transform: uppercase;">🔍 EVALUASI DIRI MINGGUAN:</span>
          <span class="neo-tag bg-cyan" style="font-size: 7.4pt;">POLA MOOD</span>
        </div>

        <div style="font-size: 7.8pt; margin-bottom: 5pt;">
          <div style="font-weight: 800; margin-bottom: 2pt;">Pola apa yang paling sering muncul setelah 7 hari ini?</div>
          <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">Tuliskan kesimpulan emosi dominanmu sepekan ini: .......................................</div>
          <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">Pemicu yang paling sering berulang dalam sepekan: ...........................................</div>
        </div>

        <div>
          <div style="font-size: 7.8pt; font-weight: 800; margin-bottom: 3.5pt;">Faktor terbesar yang memengaruhi suasana hatiku:</div>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 4pt; font-size: 7.5pt; font-weight: 700;">
            <div class="neo-card-sm" style="padding: 5.5pt 7pt; background: #fff;">☐ Sekolah / Tugas</div>
            <div class="neo-card-sm" style="padding: 5.5pt 7pt; background: #fff;">☐ Hubungan Pertemanan</div>
            <div class="neo-card-sm" style="padding: 5.5pt 7pt; background: #fff;">☐ Masalah Keluarga</div>
            <div class="neo-card-sm" style="padding: 5.5pt 7pt; background: #fff;">☐ Media Sosial / FOMO</div>
            <div class="neo-card-sm" style="padding: 5.5pt 7pt; background: #fff;">☐ Kurang Tidur / Lelah</div>
            <div class="neo-card-sm" style="padding: 5.5pt 7pt; background: #fff;">☐ Hal Lain: ............</div>
          </div>
        </div>
      </div>

      <!-- Gratitude Reflection Box -->
      <div class="neo-card bg-white" style="padding: 10pt 12pt;">
        <div style="font-size: 8.4pt; font-weight: 800; margin-bottom: 3.5pt;">
          🌿 <strong>Apresiasi Syukur Pekan Ini:</strong> Tuliskan hal-hal yang patut disyukuri:
        </div>
        <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">1. Hal baik yang terjadi pekan ini: .....................................................................</div>
        <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">2. Aksi self-care yang paling membantuku: ........................................................</div>
        <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">3. Kebaikan kecil orang lain padaku: .................................................................</div>
      </div>

      <!-- Self-Reward Box -->
      <div class="neo-card-sm bg-mint" style="padding: 8.5pt 11pt; text-align: center;">
        <div style="font-size: 8pt; font-weight: 900; text-transform: uppercase;">
          🎁 SELF-REWARD: "Aku bangga sudah setia mengamati diriku selama 7 hari penuh!"
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="page-footer">
      <span>Ruang Tumbuh Remaja • Edukasi Remaja</span>
      <span class="neo-badge bg-black" style="color: #fff;">HALAMAN 07 / 10</span>
    </div>
  </div>

  <!-- =================================================================== -->
  <!-- PAGE 9: HALAMAN 08 / 10 — TOOLKIT EMOSI (1): RESEP PERBAIKI MOOD    -->
  <!-- =================================================================== -->
  <div class="page">
    <!-- Header -->
    <div class="page-header">
      <span class="neo-badge bg-yellow">TOOLKIT EMOSI (1)</span>
      <span class="neo-badge bg-white">HALAMAN 08 / 10</span>
    </div>
    <div style="margin-top: 2pt;">
      <h2 class="font-heading" style="font-size: 18.5pt; text-transform: uppercase; margin-bottom: 1pt;">
        RESEP PERBAIKI MOOD (1) ⚡
      </h2>
      <p style="font-size: 8pt; font-weight: 600; color: #444;">Aksi praktis berbasis neurosains untuk merestart energimu dalam hitungan menit.</p>
    </div>

    <div class="page-body" style="gap: 7.5pt;">
      <!-- Item 1 -->
      <div class="neo-card bg-white" style="display: flex; gap: 8.5pt; align-items: center; padding: 11pt 12pt; border-left: 5.5pt solid #FFE500;">
        <div style="font-size: 22pt; line-height: 1;">🎧</div>
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5pt;">
            <span style="font-size: 8.8pt; font-weight: 900; text-transform: uppercase;">1. Dengarkan Musik Favorit</span>
            <span class="neo-tag bg-yellow" style="font-size: 7.4pt;">5–15 MENIT</span>
          </div>
          <div style="font-size: 7.6pt; font-weight: 600; color: #333; line-height: 1.38;">
            <em>Sains:</em> Melodi 60 bpm menstabilkan ritme jantung &amp; menurunkan hormon stres kortisol. Putar lagu bernada tenang atau ceria. Hindari lagu galau yang memicu overthinking!
          </div>
        </div>
      </div>

      <!-- Item 2 -->
      <div class="neo-card bg-white" style="display: flex; gap: 8.5pt; align-items: center; padding: 11pt 12pt; border-left: 5.5pt solid #00E599;">
        <div style="font-size: 22pt; line-height: 1;">🚶</div>
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5pt;">
            <span style="font-size: 8.8pt; font-weight: 900; text-transform: uppercase;">2. Gerak Tubuh &amp; Olahraga Ringan</span>
            <span class="neo-tag bg-mint" style="font-size: 7.4pt;">10–20 MENIT</span>
          </div>
          <div style="font-size: 7.6pt; font-weight: 600; color: #333; line-height: 1.38;">
            <em>Sains:</em> Aktivitas motorik memicu pelepasan endorfin dan dopamin alami. Jalan santai di sekitar rumah, stretching leher dan bahu, atau dance bebas di kamar.
          </div>
        </div>
      </div>

      <!-- Item 3 -->
      <div class="neo-card bg-white" style="display: flex; gap: 8.5pt; align-items: center; padding: 11pt 12pt; border-left: 5.5pt solid #00F0FF;">
        <div style="font-size: 22pt; line-height: 1;">🌿</div>
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5pt;">
            <span style="font-size: 8.8pt; font-weight: 900; text-transform: uppercase;">3. Keluar Menghirup Udara Segar</span>
            <span class="neo-tag bg-cyan" style="font-size: 7.4pt;">5–15 MENIT</span>
          </div>
          <div style="font-size: 7.6pt; font-weight: 600; color: #333; line-height: 1.38;">
            <em>Sains:</em> Sinar matahari pagi dan warna hijau tanaman merangsang saraf parasimpatis untuk menenangkan detak nadi. Duduk di teras, pandang langit, dan rasakan hembusan angin.
          </div>
        </div>
      </div>

      <!-- Item 4 -->
      <div class="neo-card bg-white" style="display: flex; gap: 8.5pt; align-items: center; padding: 11pt 12pt; border-left: 5.5pt solid #FF5E7E;">
        <div style="font-size: 22pt; line-height: 1;">💬</div>
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5pt;">
            <span style="font-size: 8.8pt; font-weight: 900; text-transform: uppercase;">4. Hubungi Teman Tepercaya</span>
            <span class="neo-tag bg-pink" style="color: #fff; font-size: 7.4pt;">5–20 MENIT</span>
          </div>
          <div style="font-size: 7.6pt; font-weight: 600; color: #333; line-height: 1.38;">
            <em>Sains:</em> Obrolan hangat memproduksi hormon oksitosin yang meredakan rasa terisolasi. Kirim pesan santai atau telepon singkat kepada orang yang mendengarkan tanpa menghakimi.
          </div>
        </div>
      </div>

      <!-- Item 5 -->
      <div class="neo-card bg-white" style="display: flex; gap: 8.5pt; align-items: center; padding: 11pt 12pt; border-left: 5.5pt solid #D4BBFF;">
        <div style="font-size: 22pt; line-height: 1;">✍️</div>
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5pt;">
            <span style="font-size: 8.8pt; font-weight: 900; text-transform: uppercase;">5. Brain Dump (Tulis Bebas)</span>
            <span class="neo-tag bg-purple" style="font-size: 7.4pt;">5–10 MENIT</span>
          </div>
          <div style="font-size: 7.6pt; font-weight: 600; color: #333; line-height: 1.38;">
            <em>Sains:</em> Memindahkan beban pikiran ke kertas secara instan meringankan beban kerja prefrontal cortex. Tumpahkan semua kekhawatiran tanpa memedulikan kerapian tulisan!
          </div>
        </div>
      </div>

      <!-- Quick Action Challenge Box -->
      <div class="neo-card bg-yellow" style="padding: 10.5pt 12.5pt;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3.5pt;">
          <span style="font-size: 8.8pt; font-weight: 900; text-transform: uppercase;">⚡ TANTANGAN MOOD KILAT:</span>
          <span class="neo-tag bg-white" style="font-size: 7.4pt;">10 MENIT SAJA</span>
        </div>
        <div style="font-size: 7.8pt; font-weight: 700; line-height: 1.4; color: #111;">
          Pilihlah salah satu resep di atas yang paling mudah kamu lakukan saat ini. Beri izin dirimu untuk berhenti sejenak dan nikmati prosesnya!
        </div>
      </div>

      <!-- Mini Action Journal Box (Expanded 5 Lines) -->
      <div class="neo-card bg-white" style="padding: 10.5pt 12.5pt;">
        <div style="font-size: 8.6pt; font-weight: 900; text-transform: uppercase; margin-bottom: 4pt; border-bottom: 1.8px solid #000; padding-bottom: 3pt;">
          ✍️ JURNAL KILAT 10 MENITKU:
        </div>
        <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">Resep pilihan yang kucoba hari ini: ............................ | Waktu: .................................</div>
        <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">Sensasi fisik yang kurasakan saat mempraktikkannya: ............................................</div>
        <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">Perubahan pada pikiran atau suasana hatiku: .....................................................</div>
        <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">Hal menyenangkan yang kupelajari dari latihan ini: ...........................................</div>
        <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">Tingkat energiku: [ Sebelum: ..... / 10 ] ➔ [ Sesudah mencobanya: ..... / 10 ]</div>
      </div>

      <!-- Action Checkmark Pill -->
      <div class="neo-card-sm bg-mint" style="padding: 7.5pt 10pt; text-align: center;">
        <div style="font-size: 7.8pt; font-weight: 800; text-transform: uppercase;">
          [✓] AKU TELAH MEMILIH 1 TINDAKAN PERAWATAN DIRI HARI INI
        </div>
      </div>

      <!-- Encouragement Chip -->
      <div class="neo-card-sm bg-black" style="color: #fff; padding: 8.5pt 11pt; text-align: center;">
        <div style="color: #FFE500; font-size: 7.6pt; font-weight: 800;">
          ⚡ Perubahan suasana hati dimulai dari satu tindakan kecil yang kamu izinkan terjadi hari ini.
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="page-footer">
      <span>Ruang Tumbuh Remaja • Edukasi Remaja</span>
      <span class="neo-badge bg-black" style="color: #fff;">HALAMAN 08 / 10</span>
    </div>
  </div>

  <!-- =================================================================== -->
  <!-- PAGE 10: HALAMAN 09 / 10 — TOOLKIT EMOSI (2): GROUNDING & SELF-CARE -->
  <!-- =================================================================== -->
  <div class="page">
    <!-- Header -->
    <div class="page-header">
      <span class="neo-badge bg-cyan">TOOLKIT EMOSI (2)</span>
      <span class="neo-badge bg-white">HALAMAN 09 / 10</span>
    </div>
    <div style="margin-top: 2pt;">
      <h2 class="font-heading" style="font-size: 18.5pt; text-transform: uppercase; margin-bottom: 1pt;">
        RESEP PERBAIKI MOOD (2) 🧘
      </h2>
      <p style="font-size: 8pt; font-weight: 600; color: #444;">Tenangkan sistem sarafmu dengan teknik mindfulness dan self-care teruji.</p>
    </div>

    <div class="page-body" style="gap: 7.5pt;">
      <!-- Item 6: Hobi -->
      <div class="neo-card bg-white" style="display: flex; gap: 8.5pt; align-items: center; padding: 11pt 12pt; border-left: 5.5pt solid #D4BBFF;">
        <div style="font-size: 22pt; line-height: 1;">🎨</div>
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5pt;">
            <span style="font-size: 8.8pt; font-weight: 900; text-transform: uppercase;">6. Lakukan Hobi Kreatif Ringan</span>
            <span class="neo-tag bg-purple" style="font-size: 7.4pt;">15–30 MNT</span>
          </div>
          <div style="font-size: 7.6pt; font-weight: 600; color: #333; line-height: 1.38;">
            Menggambar doodle, mewarnai, merakit lego, memasak camilan simpel, fotografi objek sekitar, atau memainkan alat musik santai.
          </div>
        </div>
      </div>

      <!-- Item 7: Box Breathing -->
      <div class="neo-card bg-white" style="display: flex; gap: 8.5pt; align-items: center; padding: 11pt 12pt; border-left: 5.5pt solid #00E599;">
        <div style="font-size: 22pt; line-height: 1;">🧘</div>
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5pt;">
            <span style="font-size: 8.8pt; font-weight: 900; text-transform: uppercase;">7. Latihan Pernapasan Dalam (4-4-6)</span>
            <span class="neo-tag bg-mint" style="font-size: 7.4pt;">3–5 MNT</span>
          </div>
          <div style="font-size: 7.6pt; font-weight: 600; color: #333; line-height: 1.38;">
            Tarik napas hidung 4 detik perlahan, tahan di dada 4 detik rasakan ketenangan, lalu hembuskan lewat mulut 6 detik seperti meniup lilin.
          </div>
        </div>
      </div>

      <!-- Item 8: Grounding 5-4-3-2-1 Interactive Exercise -->
      <div class="neo-card bg-yellow" style="padding: 10.5pt 12.5pt;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4.5pt;">
          <span style="font-size: 8.8pt; font-weight: 900; text-transform: uppercase;">🧊 8. TEKNIK GROUNDING 5-4-3-2-1:</span>
          <span class="neo-tag bg-white" style="font-size: 7.4pt;">FOKUS KINI</span>
        </div>
        <div style="font-size: 7.7pt; font-weight: 600; color: #222; margin-bottom: 5pt; line-height: 1.38;">
          Latihan pereda overthinking instan saat pikiran terasa penuh. Sadari sekelilingmu saat ini:
        </div>
        <div style="display: flex; flex-direction: column; gap: 4.5pt; font-size: 7.6pt; font-weight: 700;">
          <div style="background: #fff; border: 1.4px solid #000; border-radius: 6px; padding: 6pt 8.5pt; display: flex; justify-content: space-between;">
            <span>👀 <strong>5 Benda</strong> yang kamu lihat:</span>
            <span style="color: #555; font-weight: 600;">lampu, buku, meja, jendela, jam dinding...</span>
          </div>
          <div style="background: #fff; border: 1.4px solid #000; border-radius: 6px; padding: 6pt 8.5pt; display: flex; justify-content: space-between;">
            <span>🖐️ <strong>4 Hal</strong> yang bisa disentuh:</span>
            <span style="color: #555; font-weight: 600;">kain baju, permukaan meja, rambut, ujung jari...</span>
          </div>
          <div style="background: #fff; border: 1.4px solid #000; border-radius: 6px; padding: 6pt 8.5pt; display: flex; justify-content: space-between;">
            <span>👂 <strong>3 Suara</strong> yang terdengar:</span>
            <span style="color: #555; font-weight: 600;">detak jam, dengung AC/kipas, desau angin...</span>
          </div>
          <div style="background: #fff; border: 1.4px solid #000; border-radius: 6px; padding: 6pt 8.5pt; display: flex; justify-content: space-between;">
            <span>👃 <strong>2 Aroma</strong> yang bisa dicium:</span>
            <span style="color: #555; font-weight: 600;">aroma sabun, minyak telon, udara segar...</span>
          </div>
          <div style="background: #fff; border: 1.4px solid #000; border-radius: 6px; padding: 6pt 8.5pt; display: flex; justify-content: space-between;">
            <span>👅 <strong>1 Sensasi</strong> rasa di lidah:</span>
            <span style="color: #555; font-weight: 600;">tegukan air dingin, hembusan napas segar...</span>
          </div>
        </div>
        <div style="margin-top: 5pt; font-size: 7.5pt; font-weight: 800; color: #111; background: #FFF9DB; padding: 5pt 8pt; border-radius: 6px; border: 1.3px solid #000;">
          [✓] Aku telah merasakan kembali ketenangan tubuh dan kehadiran diriku seutuhnya di masa kini.
        </div>
      </div>

      <!-- Item 9: Medsos Detox -->
      <div class="neo-card bg-white" style="display: flex; gap: 8.5pt; align-items: center; padding: 11pt 12pt; border-left: 5.5pt solid #FF5E7E;">
        <div style="font-size: 22pt; line-height: 1;">📵</div>
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5pt;">
            <span style="font-size: 8.8pt; font-weight: 900; text-transform: uppercase;">9. Jeda Media Sosial (Digital Detox)</span>
            <span class="neo-tag bg-pink" style="color: #fff; font-size: 7.4pt;">15–30 MNT</span>
          </div>
          <div style="font-size: 7.6pt; font-weight: 600; color: #333; line-height: 1.38;">
            Jauhkan ponsel sementara waktu, nonaktifkan notifikasi grup berisik, dan istirahatkan matamu dari paparan layar kaca.
          </div>
        </div>
      </div>

      <!-- Item 10: Self Care -->
      <div class="neo-card bg-white" style="display: flex; gap: 8.5pt; align-items: center; padding: 11pt 12pt; border-left: 5.5pt solid #00F0FF;">
        <div style="font-size: 22pt; line-height: 1;">🛏️</div>
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5pt;">
            <span style="font-size: 8.8pt; font-weight: 900; text-transform: uppercase;">10. Self-Care &amp; Kebaikan Kecil</span>
            <span class="neo-tag bg-cyan" style="font-size: 7.4pt;">5–15 MNT</span>
          </div>
          <div style="font-size: 7.6pt; font-weight: 600; color: #333; line-height: 1.38;">
            Mandi air segar, minum air putih satu gelas penuh, rapikan tempat tidurmu, atau tawarkan bantuan kecil bagi orang di rumah.
          </div>
        </div>
      </div>

      <!-- Body Check Bar -->
      <div class="neo-card bg-cream" style="padding: 7.5pt 10pt; display: flex; justify-content: space-between; align-items: center; font-size: 7.4pt; font-weight: 800;">
        <span>🧘 Evaluasi Tubuh:</span>
        <span>☐ Otot Bahu Rileks</span>
        <span>☐ Napas Lebih Pelan</span>
        <span>☐ Pikiran Hening</span>
      </div>

      <!-- Commit Screen Detox -->
      <div class="neo-card-sm bg-white" style="border: 1.6px dashed #000; padding: 8.5pt 10.5pt; font-size: 7.8pt; font-weight: 800;">
        📱 <strong>Komitmen Malam Ini:</strong> [✓] Aku akan mematikan HP 30 menit sebelum tidur agar gelombang otak rileks optimal.
      </div>

      <!-- Affirmation Pill -->
      <div class="neo-card-sm bg-mint" style="padding: 8.5pt 11pt; text-align: center;">
        <div style="font-size: 8pt; font-weight: 900; text-transform: uppercase;">
          ✨ MERAWAT DIRI ADALAH KEBUTUHAN DASAR, BUKAN BENTUK KELEMAHAN!
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="page-footer">
      <span>Ruang Tumbuh Remaja • Edukasi Remaja</span>
      <span class="neo-badge bg-black" style="color: #fff;">HALAMAN 09 / 10</span>
    </div>
  </div>

  <!-- =================================================================== -->
  <!-- PAGE 11: HALAMAN 10 / 10 — LATIHAN MANDIRI 03: STRESS DIARY & SELESAI-->
  <!-- =================================================================== -->
  <div class="page">
    <!-- Header -->
    <div class="page-header">
      <span class="neo-badge bg-pink" style="color: #fff;">LATIHAN MANDIRI 03</span>
      <span class="neo-badge bg-white">HALAMAN 10 / 10</span>
    </div>
    <div style="margin-top: 2pt;">
      <h2 class="font-heading" style="font-size: 18.5pt; text-transform: uppercase; margin-bottom: 1pt;">
        3. STRESS DIARY 🎯
      </h2>
      <p style="font-size: 8pt; font-weight: 600; color: #444;">Fokus pada apa yang bisa kamu kendalikan, lepaskan apa yang di luar kendali.</p>
    </div>

    <div class="page-body" style="gap: 7.5pt;">
      <!-- Stress Diary Card Example -->
      <div class="neo-card bg-white" style="padding: 9.5pt 11.5pt;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4pt; border-bottom: 1.8px solid #000; padding-bottom: 3pt;">
          <span style="font-size: 8.8pt; font-weight: 900; text-transform: uppercase;">📌 CONTOH KASUS DARI WORKBOOK:</span>
          <span class="neo-tag bg-yellow" style="font-size: 7.4pt;">STUDI KASUS</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 3.5pt; font-size: 7.6pt;">
          <div style="display: flex; justify-content: space-between; background: #FEF6E4; border: 1.3px solid #000; border-radius: 6px; padding: 4pt 7pt;">
            <span style="font-weight: 800;">Situasi Nyata:</span>
            <span style="font-weight: 600;">Tugas sekolah menumpuk banyak di akhir pekan</span>
          </div>
          <div style="display: flex; justify-content: space-between; background: #FEF6E4; border: 1.3px solid #000; border-radius: 6px; padding: 4pt 7pt;">
            <span style="font-weight: 800;">Tingkat Stres:</span>
            <span style="font-weight: 900; color: #C00;">Skala 7 – 8 (Tinggi)</span>
          </div>
          <div style="background: #E6FCF5; border: 1.3px solid #000; border-radius: 6px; padding: 4pt 7pt;">
            <span style="font-weight: 900; text-transform: uppercase;">⭕ BISA KUKONTROL:</span>
            <span style="font-weight: 600;"> Tidak menunda, mulai cicil dari tugas yang paling mudah.</span>
          </div>
          <div style="background: #FFF9DB; border: 1.3px solid #000; border-radius: 6px; padding: 4pt 7pt;">
            <span style="font-weight: 900; text-transform: uppercase;">🚀 LANGKAH KECIL:</span>
            <span style="font-weight: 600;"> Luangkan 25 menit fokus belajar tanpa memegang HP sama sekali.</span>
          </div>
        </div>
      </div>

      <!-- Student's Own Practice Card (Ruled Notepad) -->
      <div class="neo-card bg-white" style="padding: 10pt 12pt; border-style: dashed;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4pt;">
          <span style="font-size: 8.8pt; font-weight: 900; text-transform: uppercase;">✍️ SEKARANG GILIRANMU (STRESMU HARI INI):</span>
          <span class="neo-tag bg-mint" style="font-size: 7.4pt;">LATIHAN AKTIF</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 4.5pt; font-size: 7.7pt;">
          <div>
            <div style="font-weight: 800; margin-bottom: 2pt;">1. Situasi yang membuatku merasa tertekan:</div>
            <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">Tuliskan situasi stres yang kamu hadapi: ............................................</div>
            <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">Dampak yang paling membebani pikiranmu: .......................................</div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; background: #FAF8F5; padding: 5pt 7pt; border-radius: 6px; border: 1.3px solid #000;">
            <span style="font-weight: 800;">Tingkat Stres (1–10):</span>
            <span style="color: #333; font-weight: 800; font-size: 7.8pt;">[1] [2] [3] [4] [5] [6] [7] [8] [9] [10]</span>
          </div>
          <div>
            <div style="font-weight: 800; margin-bottom: 2pt;">2. Hal yang berada dalam kendaliku sendiri:</div>
            <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">Tuliskan hal yang bisa kamu lakukan secara mandiri: .............................</div>
            <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">Sikap batin yang ingin kupilih saat menghadapinya: .............................</div>
          </div>
          <div>
            <div style="font-weight: 800; margin-bottom: 2pt;">3. Langkah kecil pertamaku 15 menit ke depan:</div>
            <div class="ruled-line" style="min-height: 24pt; font-size: 7.8pt;">Tindakan kecil yang bisa kulakukan sekarang: ...........................................</div>
          </div>
        </div>
      </div>

      <!-- Circle of Control Box (2 Columns) -->
      <div class="neo-card bg-cream" style="padding: 9.5pt 11.5pt;">
        <div style="font-size: 8.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 4.5pt;">
          🧭 LINGKARAN KENDALI (CIRCLE OF CONTROL):
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5.5pt; font-size: 7.4pt;">
          <div style="background: #D3F9D8; border: 1.4px solid #000; border-radius: 6px; padding: 6.5pt 7.5pt; line-height: 1.38;">
            <strong>🟢 BISA KUKONTROL:</strong><br>
            • Waktu tidur &amp; istirahatku<br>
            • Jam mulai mencicil tugas<br>
            • Caraku bicara pada diri sendiri<br>
            • Batas waktu bermain medsos
          </div>
          <div style="background: #FFE3E3; border: 1.4px solid #000; border-radius: 6px; padding: 6.5pt 7.5pt; line-height: 1.38;">
            <strong>🔴 DI LUAR KENDALIKU:</strong><br>
            • Ucapan / opini orang lain<br>
            • Tingkat kesulitan soal ujian<br>
            • Peristiwa yang sudah lewat<br>
            • Mood dan respon orang lain
          </div>
        </div>
      </div>

      <!-- Checklist Strategi -->
      <div class="neo-card bg-white" style="padding: 9pt 11pt;">
        <div style="font-size: 8.6pt; font-weight: 900; text-transform: uppercase; margin-bottom: 4.5pt;">
          ✅ STRATEGI YANG INGIN KUCOBA SAAT STRES:
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 4pt; font-size: 7.5pt; font-weight: 700;">
          <div class="neo-card-sm" style="padding: 4.5pt 6pt; background: #FEF6E4;">☐ Tidur lebih teratur</div>
          <div class="neo-card-sm" style="padding: 4.5pt 6pt; background: #FEF6E4;">☐ Pecah tugas jadi mini</div>
          <div class="neo-card-sm" style="padding: 4.5pt 6pt; background: #FEF6E4;">☐ Ambil jeda 5 menit</div>
          <div class="neo-card-sm" style="padding: 4.5pt 6pt; background: #FEF6E4;">☐ Olahraga / gerak tubuh</div>
          <div class="neo-card-sm" style="padding: 4.5pt 6pt; background: #FEF6E4;">☐ Cerita ke orang tepercaya</div>
          <div class="neo-card-sm" style="padding: 4.5pt 6pt; background: #FEF6E4;">☐ Kurangi distraksi HP</div>
        </div>
      </div>

      <!-- Milestone Certificate & Golden Reminder -->
      <div class="neo-card bg-yellow" style="padding: 9.5pt 11.5pt; text-align: center; border: 2.2px solid #000;">
        <div style="font-size: 7.6pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2.5pt; color: #444;">
          ⭐ KALIMAT PENGINGAT HARIAN:
        </div>
        <div class="font-heading" style="font-size: 10.5pt; line-height: 1.25; color: #000; margin-bottom: 3.5pt;">
          “Aku tidak harus menyelesaikan semuanya sekaligus hari ini. Satu langkah kecil tetap berarti besar.”
        </div>
        <div style="display: inline-block; background: #00E599; border: 1.5px solid #000; border-radius: 999px; padding: 3.5pt 10pt; font-size: 7.8pt; font-weight: 900; text-transform: uppercase;">
          🎉 SELESAI 10 HALAMAN LATIHAN MANDIRI!
        </div>
      </div>

      <!-- Final Commitment Stamp -->
      <div class="neo-card-sm bg-mint" style="padding: 8pt 10pt; text-align: center; font-size: 7.8pt; font-weight: 800;">
        🎓 <strong>Komitmen Tuntas:</strong> Aku telah menyelesaikan workbook ini dengan jujur. Tanggal: ____/____/202... | TTD: ____________
      </div>
    </div>

    <!-- Footer -->
    <div class="page-footer">
      <span>Ruang Tumbuh Remaja • Edukasi Remaja</span>
      <span class="neo-badge bg-black" style="color: #fff;">HALAMAN 10 / 10</span>
    </div>
  </div>

  <!-- =================================================================== -->
  <!-- PAGE 12: COVER BELAKANG (BACK COVER)                                -->
  <!-- =================================================================== -->
  <div class="page" style="background-color: #FEF6E4 !important;">
    <!-- Top Header Bar -->
    <div class="page-header">
      <span class="neo-badge bg-yellow">★ RESMI RUANG TUMBUH</span>
      <span class="neo-badge bg-mint">PSIKOEDUKASI REMAJA</span>
      <span class="neo-badge bg-white">SINOPSIS BUKU 📖</span>
    </div>

    <div class="page-body" style="gap: 7.5pt;">
      <!-- Big Attention Catchy Header Card -->
      <div class="neo-card bg-yellow" style="padding: 10pt 11.5pt;">
        <div style="font-size: 8pt; font-weight: 900; text-transform: uppercase; color: #111; letter-spacing: 0.5px; margin-bottom: 2pt;">
          💡 WORKBOOK MANDIRI KESEHATAN MENTAL REMAJA
        </div>
        <h2 class="font-heading" style="font-size: 15.5pt; line-height: 1.12; text-transform: uppercase; color: #000;">
          HAPUS STIGMA, RANGKUL DIRIMU SENDIRI.
        </h2>
        <div style="font-size: 8pt; font-weight: 700; color: #222; margin-top: 3pt; line-height: 1.35;">
          Teman bertumbuh ilmiah &amp; berempati saat dunia di sekitarmu terasa bising dan melelahkan.
        </div>
      </div>

      <!-- Synopsis Card (Neo-Card bg-white) -->
      <div class="neo-card bg-white" style="padding: 11.5pt 12.5pt;">
        <div style="font-size: 8pt; line-height: 1.45; color: #222; text-align: justify; margin-bottom: 6pt;">
          Masa pubertas dan remaja adalah fase perubahan yang luar biasa dinamis. Tuntutan akademik, kecemasan masa depan, pertemanan, dan banjir informasi media sosial kerap membuat pikiran penuh dan melelahkan. Buku latihan (<b>self-help workbook</b>) ini hadir dengan pendekatan psikologi modern (<b>CBT &amp; Mindfulness</b>) tanpa penghakiman: membimbingmu memahami emosi, me-recharge baterai mental, menghentikan overthinking, dan menyayangi dirimu seutuhnya.
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5pt; font-size: 7.6pt; font-weight: 800;">
          <div style="background: #FFFDE7; border: 1.5px solid #000; border-radius: 5px; padding: 5pt 6pt;">✨ 10 Workbook Mandiri</div>
          <div style="background: #E6FCF5; border: 1.5px solid #00E599; border-radius: 5px; padding: 5pt 6pt;">🔬 Berbasis Sains CBT</div>
          <div style="background: #F3E8FF; border: 1.5px solid #D4BBFF; border-radius: 5px; padding: 5pt 6pt;">📊 Mood Tracker 7 Hari</div>
          <div style="background: #FFF0F3; border: 1.5px solid #FF5E7E; border-radius: 5px; padding: 5pt 6pt;">🛡️ 100% Ruang Aman</div>
        </div>
      </div>

      <!-- 4 Pilar Utama (2x2 Colored Neo-Cards) -->
      <div>
        <div style="font-size: 8.5pt; font-weight: 900; text-transform: uppercase; margin-bottom: 4pt; display: flex; align-items: center; gap: 3.5pt;">
          <span>🎯</span> 4 PILAR UTAMA RESILIENSI BATIN:
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5pt;">
          <div class="neo-card-sm bg-purple" style="padding: 9.5pt 9pt;">
            <div style="font-size: 8.2pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2pt;">🧠 1. Psikoedukasi</div>
            <div style="font-size: 7.2pt; font-weight: 600; line-height: 1.32; color: #111;">Bongkar mitos, pahami otak remaja &amp; hapus stigma kesehatan jiwa.</div>
          </div>
          <div class="neo-card-sm bg-pink" style="padding: 9.5pt 9pt; color: #fff;">
            <div style="font-size: 8.2pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2pt; color: #fff;">⚡ 2. Stop Overthink</div>
            <div style="font-size: 7.2pt; font-weight: 600; line-height: 1.32; color: #fff;">Grounding 5-4-3-2-1, nafas relaksasi, &amp; circle of control.</div>
          </div>
          <div class="neo-card-sm bg-mint" style="padding: 9.5pt 9pt;">
            <div style="font-size: 8.2pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2pt;">🔋 3. Baterai Jiwa</div>
            <div style="font-size: 7.2pt; font-weight: 600; line-height: 1.32; color: #111;">Kenali sinyal burnout sejak dini &amp; teknik recharge energi batin.</div>
          </div>
          <div class="neo-card-sm bg-cyan" style="padding: 9.5pt 9pt;">
            <div style="font-size: 8.2pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2pt;">💖 4. Self-Compassion</div>
            <div style="font-size: 7.2pt; font-weight: 600; line-height: 1.32; color: #111;">Sayangi diri sendiri &amp; bangun batasan sehat bermedia sosial.</div>
          </div>
        </div>
      </div>

      <!-- Quote / Rekomendasi Edukasi -->
      <div class="neo-card bg-cream" style="padding: 9.5pt 11pt; border-left: 5pt solid #FFE500;">
        <div style="font-size: 7.8pt; font-style: italic; line-height: 1.4; color: #111; margin-bottom: 3pt;">
          “Workbook kesehatan mental paling solutif, hangat, dan ramah bagi remaja Indonesia. Membantu generasi muda bertumbuh tangguh tanpa takut menjadi rapuh.”
        </div>
        <div style="font-size: 7.4pt; font-weight: 800; color: #333; text-align: right;">
          — Tim Konselor &amp; Edukasi Remaja Indonesia
        </div>
      </div>

      <!-- Mission Banner (Fills space) -->
      <div class="neo-card-sm bg-yellow" style="padding: 8pt 9pt; text-align: center;">
        <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; color: #000;">
          🌟 MISI KAMI: MENGHAPUS STIGMA &amp; MEMBANGUN RESILIENSI REMAJA INDONESIA
        </div>
      </div>

      <!-- Hotline Bantuan Darurat 24 Jam -->
      <div class="neo-card bg-white" style="border: 1.8px dashed #FF5E7E; padding: 9pt 10.5pt;">
        <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; color: #C00; margin-bottom: 3.5pt; display: flex; align-items: center; gap: 3.5pt;">
          <span>🚨</span> LAYANAN KONSULTASI &amp; DARURAT 24 JAM BEBAS PULSA:
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4pt; font-size: 7.3pt; color: #222;">
          <div style="background: #FFF5F5; padding: 4.5pt 6pt; border-radius: 5px; border: 1px solid #FFC9C9;"><b>🏥 SEJIWA Kemenkes:</b> 119 ext. 8</div>
          <div style="background: #F0FFF4; padding: 4.5pt 6pt; border-radius: 5px; border: 1px solid #B2F2BB;"><b>🛡️ SAPPA KemenPPPA:</b> 129</div>
          <div style="background: #EBF8FF; padding: 4.5pt 6pt; border-radius: 5px; border: 1px solid #A5D8FF;"><b>👶 Halo Kemenkes:</b> 1500-567</div>
          <div style="background: #F8F9FA; padding: 4.5pt 6pt; border-radius: 5px; border: 1px solid #CED4DA;"><b>🩺 Puskesmas PKPR:</b> Ramah Remaja</div>
        </div>
      </div>

      <!-- Footer Publisher Strip (Edisi Digital Bebas Akses) -->
      <div class="neo-card bg-white" style="display: flex; justify-content: space-between; align-items: center; padding: 8.5pt 10.5pt;">
        <div>
          <div style="font-family: 'Space Grotesk', sans-serif; font-size: 8.8pt; font-weight: 900; text-transform: uppercase; color: #000;">RUANG TUMBUH REMAJA PRESS</div>
          <div style="font-size: 7pt; color: #555; font-weight: 600;">Edisi Akses Terbuka Mandiri • Cetakan 2026</div>
          <div style="font-size: 6.6pt; color: #777;">Hak Cipta Terbuka untuk Edukasi Remaja</div>
        </div>
        <div style="text-align: right; border-left: 1.5px dashed #000; padding-left: 8pt;">
          <span class="neo-badge bg-yellow" style="font-size: 7.2pt; font-weight: 900; padding: 2.5pt 6pt;">EDISI DIGITAL RESMI</span>
          <div style="font-size: 6.6pt; font-weight: 800; color: #111; margin-top: 3pt;">AKSES TERBUKA • GRATIS</div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="page-footer">
      <span>Ruang Tumbuh Remaja • Edukasi Remaja</span>
      <span class="neo-badge bg-black" style="color: #fff;">COVER BELAKANG</span>
    </div>
  </div>

</body>
</html>
"""

html_path = "neo-brutalism-smartphone.html"
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Written HTML to {html_path} ({len(html_content)} bytes)")

pdf_path = "Kesehatan_Mental_Remaja_Smartphone_NeoBrutalism.pdf"
cmd = [
    "google-chrome",
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--virtual-time-budget=12000",
    f"--print-to-pdf={pdf_path}",
    "--no-pdf-header-footer",
    html_path
]

print("Running chrome to generate PDF...")
subprocess.run(cmd, check=True)
print(f"Generated PDF: {pdf_path}, file size: {os.path.getsize(pdf_path)} bytes")

# Copy to root MENTAL_HEALTH_Smartphone_Edition.pdf
root_dest = "../MENTAL_HEALTH_Smartphone_Edition.pdf"
shutil.copyfile(pdf_path, root_dest)
print(f"Copied PDF to root destination: {root_dest}")

# Render updated PNGs
subprocess.run(["pdftoppm", "-png", "-r", "150", pdf_path, "/tmp/revised_relayout_page"], check=True)
print("Rendered revised_relayout page PNGs.")
