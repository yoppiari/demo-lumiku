import subprocess
import os

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
    padding: 16pt 16pt 14pt 16pt;
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
    justify-content: space-between;
    flex: 1;
    margin: 8pt 0 6pt 0;
    gap: 6pt;
  }

  /* Typography */
  .font-heading {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 800;
    letter-spacing: -0.5px;
    line-height: 1.12;
  }
  .font-black {
    font-weight: 900;
  }

  /* Neo-Brutalism UI Components */
  .neo-card {
    border: 3px solid #000;
    box-shadow: 4px 4px 0px #000;
    border-radius: 12px;
    background: #fff;
    padding: 10pt 12pt;
    position: relative;
  }
  .neo-card-sm {
    border: 2.5px solid #000;
    box-shadow: 3px 3px 0px #000;
    border-radius: 10px;
    background: #fff;
    padding: 8pt 10pt;
    position: relative;
  }
  .neo-badge {
    display: inline-flex;
    align-items: center;
    gap: 4pt;
    border: 2px solid #000;
    box-shadow: 2px 2px 0px #000;
    border-radius: 999px;
    padding: 3pt 9pt;
    font-size: 8pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    line-height: 1;
  }
  .neo-tag {
    display: inline-block;
    border: 2px solid #000;
    box-shadow: 2px 2px 0px #000;
    border-radius: 6px;
    padding: 2.5pt 6pt;
    font-size: 7.5pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    line-height: 1.1;
  }
  .neo-box-dashed {
    border: 2px dashed #000;
    border-radius: 8px;
    padding: 6pt 8pt;
    background: #fff;
  }

  /* Header & Footer */
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .page-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 2.5px solid #000;
    padding-top: 6pt;
    font-size: 8pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
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

  /* Grid layouts */
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8pt;
  }
</style>
</head>
<body>

  <!-- =================================================================== -->
  <!-- PAGE 1: COVER UTAMA & IDENTITAS PEMILIK                              -->
  <!-- =================================================================== -->
  <div class="page" style="background-color: #FFE500;">
    <!-- Top Bar -->
    <div class="page-header">
      <span class="neo-badge bg-pink" style="color: #fff;">★ EDISI REMAJA</span>
      <span class="neo-badge bg-mint">100% RUANG AMAN 🛡️</span>
      <span class="neo-badge bg-white">SMARTPHONE ED. 📱</span>
    </div>

    <div class="page-body">
      <!-- Main Title Card -->
      <div class="neo-card" style="text-align: center; padding: 22pt 12pt; background: #fff;">
        <div style="display: flex; justify-content: center; gap: 5pt; margin-bottom: 10pt;">
          <span class="neo-tag bg-cyan">PANDUAN MANDIRI</span>
          <span class="neo-tag bg-purple">WORKBOOK 10 HALAMAN</span>
        </div>
        <h1 class="font-heading" style="font-size: 32pt; line-height: 0.98; margin-bottom: 10pt; text-transform: uppercase; color: #000;">
          KESEHATAN<br>
          <span style="background: #FFE500; padding: 0 6pt; border: 3px solid #000; box-shadow: 4px 4px 0px #000; border-radius: 8px; display: inline-block; margin: 4pt 0;">MENTAL</span><br>
          REMAJA
        </h1>
        <div style="border-top: 3px solid #000; border-bottom: 3px solid #000; padding: 6pt 4pt; font-weight: 800; font-size: 9pt; text-transform: uppercase; letter-spacing: 0.5px; background: #FEF6E4; margin-top: 6pt;">
          Kenali Diri • Kelola Emosi • Bangun Hidup Lebih Baik
        </div>
      </div>

      <!-- Feature Badges Strip -->
      <div style="display: flex; justify-content: space-between; gap: 6pt;">
        <div class="neo-card-sm bg-purple" style="flex: 1; text-align: center; padding: 9pt 4pt;">
          <div style="font-size: 17pt; margin-bottom: 3pt;">⚡</div>
          <div style="font-size: 7.5pt; font-weight: 900; text-transform: uppercase;">Stop Overthinking</div>
        </div>
        <div class="neo-card-sm bg-pink" style="flex: 1; text-align: center; padding: 9pt 4pt; color: #fff;">
          <div style="font-size: 17pt; margin-bottom: 3pt;">🎯</div>
          <div style="font-size: 7.5pt; font-weight: 900; text-transform: uppercase;">Emotion Diary</div>
        </div>
        <div class="neo-card-sm bg-mint" style="flex: 1; text-align: center; padding: 9pt 4pt;">
          <div style="font-size: 17pt; margin-bottom: 3pt;">📊</div>
          <div style="font-size: 7.5pt; font-weight: 900; text-transform: uppercase;">Mood Tracker 7H</div>
        </div>
      </div>

      <!-- Identity Box -->
      <div class="neo-card" style="background: #fff; padding: 13pt 14pt;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8pt; border-bottom: 2px solid #000; padding-bottom: 4pt;">
          <span style="font-size: 9pt; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px;">📖 BUKU LATIHAN INI MILIK:</span>
          <span class="neo-tag bg-softpink">DATA PRIVAT</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 6pt;">
          <div class="neo-box-dashed" style="display: flex; justify-content: space-between; align-items: center; font-size: 8.5pt;">
            <span style="font-weight: 800;">Nama Lengkap:</span>
            <span style="color: #666; font-weight: 600;">................................................</span>
          </div>
          <div class="neo-box-dashed" style="display: flex; justify-content: space-between; align-items: center; font-size: 8.5pt;">
            <span style="font-weight: 800;">Nama Panggilan:</span>
            <span style="color: #666; font-weight: 600;">................................................</span>
          </div>
          <div style="display: flex; gap: 6pt;">
            <div class="neo-box-dashed" style="flex: 1; display: flex; justify-content: space-between; align-items: center; font-size: 8.5pt;">
              <span style="font-weight: 800;">Kelas / Usia:</span>
              <span style="color: #666; font-weight: 600;">....................</span>
            </div>
            <div class="neo-box-dashed" style="flex: 1; display: flex; justify-content: space-between; align-items: center; font-size: 8.5pt;">
              <span style="font-weight: 800;">Tgl Mulai:</span>
              <span style="color: #666; font-weight: 600;">....../....../202...</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Motivational Callout & ISBN -->
      <div style="display: flex; gap: 8pt; align-items: center;">
        <div class="neo-card-sm bg-black" style="flex: 2; color: #fff; text-align: left; padding: 9pt 11pt;">
          <div style="font-size: 8pt; font-weight: 800; letter-spacing: 0.2px; line-height: 1.35;">
            🌱 "Buku ini adalah teman perjalananmu. Tidak ada jawaban salah, hanya ada ruang aman untuk bertumbuh dan mengenali diri."
          </div>
        </div>
        <div class="neo-card-sm bg-white" style="flex: 1; text-align: center; padding: 9pt 4pt; font-family: monospace;">
          <div style="font-size: 14pt; letter-spacing: 2px; font-weight: 900; line-height: 1;">||||||||||||</div>
          <div style="font-size: 7.5pt; font-weight: 800; margin-top: 3pt;">EDISI 2026</div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="page-footer">
      <span>dr. Henky Kurniawan • Seri Edukasi Remaja</span>
      <span class="neo-badge bg-black" style="color: #fff;">HALAMAN 01 / 10</span>
    </div>
  </div>

  <!-- =================================================================== -->
  <!-- PAGE 2: CARA PAKAI & DISCLAIMER MEDIS                              -->
  <!-- =================================================================== -->
  <div class="page">
    <!-- Header -->
    <div>
      <div class="page-header">
        <span class="neo-badge bg-yellow">PANDUAN PRAKTIS</span>
        <span class="neo-badge bg-white">HALAMAN 02 / 10</span>
      </div>
      <h2 class="font-heading" style="font-size: 21pt; text-transform: uppercase; margin-bottom: 2pt;">
        CARA PAKAI BUKU INI 📖
      </h2>
      <p style="font-size: 8.5pt; font-weight: 600; color: #444;">Jadikan workbook ini sahabat terbaik perjalanan mentalmu tanpa beban!</p>
    </div>

    <div class="page-body">
      <!-- Card 1 -->
      <div class="neo-card-sm bg-white" style="display: flex; gap: 9pt; align-items: flex-start; border-left: 6pt solid #FFE500; padding: 9pt 11pt;">
        <div style="font-size: 19pt; line-height: 1;">📘</div>
        <div>
          <div style="font-size: 9pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2pt;">1. Buku Ini Adalah Temanmu</div>
          <div style="font-size: 8pt; font-weight: 600; color: #222; line-height: 1.35;">
            Baca sesuai kebutuhanmu. Kamu tidak harus menyelesaikannya dalam sekali duduk. Ambil jeda kapan pun kamu merasa perlu.
          </div>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="neo-card-sm bg-white" style="display: flex; gap: 9pt; align-items: flex-start; border-left: 6pt solid #00E599; padding: 9pt 11pt;">
        <div style="font-size: 19pt; line-height: 1;">✏️</div>
        <div>
          <div style="font-size: 9pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2pt;">2. Tulis, Coret, dan Warnai!</div>
          <div style="font-size: 8pt; font-weight: 600; color: #222; line-height: 1.35;">
            Gunakan setiap halaman latihan sebagai ruang aman untuk menuangkan pikiran, emosi, coretan, dan perasaan yang sulit diungkapkan.
          </div>
        </div>
      </div>

      <!-- Card 3 -->
      <div class="neo-card-sm bg-white" style="display: flex; gap: 9pt; align-items: flex-start; border-left: 6pt solid #D4BBFF; padding: 9pt 11pt;">
        <div style="font-size: 19pt; line-height: 1;">🎯</div>
        <div>
          <div style="font-size: 9pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2pt;">3. Tidak Ada Jawaban Sempurna</div>
          <div style="font-size: 8pt; font-weight: 600; color: #222; line-height: 1.35;">
            Ini bukan lembar ujian sekolah! Yang paling bernilai adalah jawaban jujur yang membantumu memahami apa yang sebenarnya sedang terjadi.
          </div>
        </div>
      </div>

      <!-- Card 4 -->
      <div class="neo-card-sm bg-white" style="display: flex; gap: 9pt; align-items: flex-start; border-left: 6pt solid #FF5E7E; padding: 9pt 11pt;">
        <div style="font-size: 19pt; line-height: 1;">🤝</div>
        <div>
          <div style="font-size: 9pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2pt;">4. Jangan Hadapi Sendirian</div>
          <div style="font-size: 8pt; font-weight: 600; color: #222; line-height: 1.35;">
            Jika beban masalah terasa terlalu berat, jangan dipendam sendiri. Ceritakan kepada orang dewasa yang kamu percaya atau profesional.
          </div>
        </div>
      </div>

      <!-- Personal Safe Pledge Box -->
      <div class="neo-card bg-cream" style="padding: 10pt 12pt; border-style: dashed; border-width: 2.5px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4pt;">
          <span style="font-size: 8.5pt; font-weight: 900; text-transform: uppercase;">✨ JANJI DENGAN DIRIKU SENDIRI:</span>
          <span class="neo-tag bg-yellow">KOMITMEN</span>
        </div>
        <div style="font-size: 8pt; font-weight: 600; line-height: 1.4; color: #222; margin-bottom: 6pt;">
          "Hari ini aku memilih untuk bersikap ramah pada diriku sendiri. Aku berhak merasa lelah, berhak istirahat, dan berhak meminta pertolongan saat menghadapi masa-masa sulit."
        </div>
        <div style="display: flex; justify-content: flex-end; align-items: center; gap: 6pt; font-size: 8pt; font-weight: 800;">
          <span>Tanda Tangan / Coretanmu:</span>
          <span style="border-bottom: 2px solid #000; width: 100pt; display: inline-block;"></span>
        </div>
      </div>

      <!-- Safety & Medical Disclaimer Card -->
      <div class="neo-card bg-white" style="border: 3px dashed #FF5E7E; padding: 11pt 12pt;">
        <div style="display: flex; align-items: center; gap: 6pt; margin-bottom: 5pt;">
          <span class="neo-tag bg-pink" style="color: #fff;">⚠️ PERHATIAN MEDIS</span>
          <span style="font-size: 8.5pt; font-weight: 900; text-transform: uppercase;">DISCLAIMER RESMI</span>
        </div>
        <p style="font-size: 8pt; font-weight: 600; line-height: 1.4; margin-bottom: 6pt; color: #222;">
          Buku ini adalah bahan edukasi mandiri (<em>self-help</em>), <strong>bukan pengganti diagnosis medis psikiatri, psikoterapi klinis, atau perawatan profesional</strong>.
        </p>
        <div class="neo-card-sm bg-cream" style="padding: 6pt 8pt; border-width: 2px;">
          <div style="font-size: 7.5pt; font-weight: 800; text-transform: uppercase; margin-bottom: 2pt; color: #C00;">
            🚨 KONTAK BANTUAN DARURAT 24 JAM:
          </div>
          <div style="font-size: 7.5pt; font-weight: 600; line-height: 1.3;">
            Jika kamu merasa sangat terpuruk, hubungi orang tua, guru BK terdekat, atau hotline kesehatan jiwa Kemenkes RI: <strong>119 (ext. 8)</strong> / Layanan Sejiwa.
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="page-footer">
      <span>dr. Henky Kurniawan • Edukasi Remaja</span>
      <span class="neo-badge bg-black" style="color: #fff;">HALAMAN 02 / 10</span>
    </div>
  </div>

  <!-- =================================================================== -->
  <!-- PAGE 3: MENGENAL KESEHATAN MENTAL & ANALOGI HP                     -->
  <!-- =================================================================== -->
  <div class="page">
    <!-- Header -->
    <div>
      <div class="page-header">
        <span class="neo-badge bg-mint">PSIKOEDUKASI DASAR</span>
        <span class="neo-badge bg-white">HALAMAN 03 / 10</span>
      </div>
      <h2 class="font-heading" style="font-size: 20pt; text-transform: uppercase; margin-bottom: 2pt;">
        PIKIRANMU SEPERTI HP 🔋
      </h2>
      <p style="font-size: 8.5pt; font-weight: 600; color: #444;">Kesehatan mental bukan berarti selalu harus tersenyum bahagia.</p>
    </div>

    <div class="page-body">
      <!-- Mindset Box -->
      <div class="neo-card bg-yellow" style="padding: 11pt 12pt;">
        <div style="font-size: 8.5pt; font-weight: 900; text-transform: uppercase; margin-bottom: 4pt; display: flex; align-items: center; gap: 4pt;">
          <span>💡</span> HAKIKAT KESEHATAN MENTAL:
        </div>
        <p style="font-size: 8.2pt; font-weight: 700; line-height: 1.4; color: #000;">
          Mental yang sehat bukan berarti kamu harus selalu bahagia setiap hari. Kamu tetap boleh merasa sedih, kecewa, marah, takut, atau cemas. Yang penting adalah belajar mengenali emosi, mengelolanya secara sehat, dan tahu kapan perlu mengisi ulang energimu.
        </p>
      </div>

      <!-- HP Analogy Grid -->
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5pt;">
          <span style="font-size: 8.5pt; font-weight: 900; text-transform: uppercase;">📱 ANALOGI SMARTPHONE & MANUSIA:</span>
          <span class="neo-tag bg-white">DUA FASE</span>
        </div>
        <div class="grid-2">
          <!-- Low Batt -->
          <div class="neo-card bg-white" style="border-top: 6pt solid #FF5E7E; padding: 10pt 10pt;">
            <div style="display: flex; align-items: center; gap: 5pt; margin-bottom: 4pt;">
              <span style="font-size: 16pt;">🪫</span>
              <span style="font-size: 8.5pt; font-weight: 900; text-transform: uppercase;">Baterai Menipis</span>
            </div>
            <div style="font-size: 7.5pt; font-weight: 600; color: #444; line-height: 1.35;">
              <strong>Penyebab:</strong> Kurang tidur, tugas sekolah menumpuk, konflik teman/keluarga, ekspektasi sosial, dan layar HP tiada henti.
            </div>
          </div>

          <!-- Overheat / Lag -->
          <div class="neo-card bg-white" style="border-top: 6pt solid #FFA07A; padding: 10pt 10pt;">
            <div style="display: flex; align-items: center; gap: 5pt; margin-bottom: 4pt;">
              <span style="font-size: 16pt;">⚠️</span>
              <span style="font-size: 8.5pt; font-weight: 900; text-transform: uppercase;">Sistem Melambat</span>
            </div>
            <div style="font-size: 7.5pt; font-weight: 600; color: #444; line-height: 1.35;">
              <strong>Dampak:</strong> Sulit konsentrasi, gampang tersulut emosi, hilang minat hobi, lemas, dan merasa kewalahan (*burnout*).
            </div>
          </div>
        </div>
      </div>

      <!-- 3 Quick Recharge Habits -->
      <div class="neo-card-sm bg-cyan" style="padding: 9pt 11pt;">
        <div style="font-size: 8.5pt; font-weight: 900; text-transform: uppercase; margin-bottom: 5pt;">
          🔌 3 CARA MENGISI ULANG BATERAI PIKIRAN (RECHARGE):
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6pt; font-size: 7.2pt; font-weight: 800; text-align: center;">
          <div style="background: #fff; border: 1.5px solid #000; border-radius: 6px; padding: 6pt 3pt;">
            <div>😴 TIDUR CUKUP</div>
            <div style="font-weight: 600; color: #555; margin-top: 2pt;">7–8 jam malam</div>
          </div>
          <div style="background: #fff; border: 1.5px solid #000; border-radius: 6px; padding: 6pt 3pt;">
            <div>📵 JEDA SCREEN</div>
            <div style="font-weight: 600; color: #555; margin-top: 2pt;">30 mnt tanpa HP</div>
          </div>
          <div style="background: #fff; border: 1.5px solid #000; border-radius: 6px; padding: 6pt 3pt;">
            <div>💧 HIDRASI AIR</div>
            <div style="font-weight: 600; color: #555; margin-top: 2pt;">Segelas air dingin</div>
          </div>
        </div>
      </div>

      <!-- Reflection Box -->
      <div class="neo-card bg-white" style="padding: 11pt 12pt;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6pt; border-bottom: 2px solid #000; padding-bottom: 3pt;">
          <span style="font-size: 8.5pt; font-weight: 900; text-transform: uppercase;">📝 COBA REFLEKSI DIRI:</span>
          <span class="neo-tag bg-mint">CEK ENERGI</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 6pt; font-size: 8pt;">
          <div>
            <div style="font-weight: 800; margin-bottom: 2pt;">☐ Apa yang akhir-akhir ini paling menguras energiku?</div>
            <div class="neo-box-dashed" style="font-size: 7.5pt; color: #777; min-height: 20pt;">
              Contoh: Begadang belajar, memikirkan perkataan teman...
            </div>
          </div>
          <div>
            <div style="font-weight: 800; margin-bottom: 2pt;">☐ Apa yang biasanya membuatku merasa lebih tenang?</div>
            <div class="neo-box-dashed" style="font-size: 7.5pt; color: #777; min-height: 20pt;">
              Contoh: Mandi air hangat, mendengarkan lagu instrumental...
            </div>
          </div>
          <div>
            <div style="font-weight: 800; margin-bottom: 2pt;">☐ 1 hal kecil apa yang bisa kulakukan hari ini agar lebih baik?</div>
            <div class="neo-box-dashed" style="font-size: 7.5pt; color: #777; min-height: 20pt;">
              Contoh: Tidur 30 menit lebih awal malam ini...
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="page-footer">
      <span>dr. Henky Kurniawan • Edukasi Remaja</span>
      <span class="neo-badge bg-black" style="color: #fff;">HALAMAN 03 / 10</span>
    </div>
  </div>

  <!-- =================================================================== -->
  <!-- PAGE 4: 1. EMOTION DIARY (BAGIAN 1 — IDENTIFIKASI)                  -->
  <!-- =================================================================== -->
  <div class="page">
    <!-- Header -->
    <div>
      <div class="page-header">
        <span class="neo-badge bg-pink" style="color: #fff;">LATIHAN MANDIRI 01</span>
        <span class="neo-badge bg-white">HALAMAN 04 / 10</span>
      </div>
      <h2 class="font-heading" style="font-size: 20pt; text-transform: uppercase; margin-bottom: 2pt;">
        1. EMOTION DIARY 🎯
      </h2>
      <p style="font-size: 8.5pt; font-weight: 600; color: #444;">Langkah pertama mengendalikan emosi adalah memberinya nama yang jelas.</p>
    </div>

    <div class="page-body">
      <!-- A. Emosi apa yang kurasakan? -->
      <div class="neo-card bg-white" style="padding: 10pt 11pt;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6pt;">
          <span style="font-size: 8.5pt; font-weight: 900; text-transform: uppercase;">A. EMOSI APA YANG SEDANG KURASAKAN?</span>
          <span class="neo-tag bg-yellow">PILIH 1-2 RASA</span>
        </div>
        <!-- 10 Emotion Pills -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 4pt;">
          <div class="neo-card-sm" style="padding: 4.5pt 6pt; display: flex; align-items: center; gap: 4pt; font-size: 8pt; font-weight: 800; background: #FFF9DB;">
            <span>☐</span> <span>😊 Senang & Bangga</span>
          </div>
          <div class="neo-card-sm" style="padding: 4.5pt 6pt; display: flex; align-items: center; gap: 4pt; font-size: 8pt; font-weight: 800; background: #E6FCF5;">
            <span>☐</span> <span>🌿 Tenang & Santai</span>
          </div>
          <div class="neo-card-sm" style="padding: 4.5pt 6pt; display: flex; align-items: center; gap: 4pt; font-size: 8pt; font-weight: 800; background: #F8F9FA;">
            <span>☐</span> <span>😐 Biasa Saja / Datar</span>
          </div>
          <div class="neo-card-sm" style="padding: 4.5pt 6pt; display: flex; align-items: center; gap: 4pt; font-size: 8pt; font-weight: 800; background: #E7F5FF;">
            <span>☐</span> <span>😢 Sedih & Terluka</span>
          </div>
          <div class="neo-card-sm" style="padding: 4.5pt 6pt; display: flex; align-items: center; gap: 4pt; font-size: 8pt; font-weight: 800; background: #FFE3E3;">
            <span>☐</span> <span>😡 Marah & Kesal</span>
          </div>
          <div class="neo-card-sm" style="padding: 4.5pt 6pt; display: flex; align-items: center; gap: 4pt; font-size: 8pt; font-weight: 800; background: #FFF3BF;">
            <span>☐</span> <span>😰 Cemas & Khawatir</span>
          </div>
          <div class="neo-card-sm" style="padding: 4.5pt 6pt; display: flex; align-items: center; gap: 4pt; font-size: 8pt; font-weight: 800; background: #F3D9FA;">
            <span>☐</span> <span>😵‍💫 Bingung & Bimbang</span>
          </div>
          <div class="neo-card-sm" style="padding: 4.5pt 6pt; display: flex; align-items: center; gap: 4pt; font-size: 8pt; font-weight: 800; background: #FFE8CC;">
            <span>☐</span> <span>😳 Malu & Canggung</span>
          </div>
          <div class="neo-card-sm" style="padding: 4.5pt 6pt; display: flex; align-items: center; gap: 4pt; font-size: 8pt; font-weight: 800; background: #FFD8A8;">
            <span>☐</span> <span>💔 Kecewa & Menyesal</span>
          </div>
          <div class="neo-card-sm" style="padding: 4.5pt 6pt; display: flex; align-items: center; gap: 4pt; font-size: 8pt; font-weight: 800; background: #E9ECEF;">
            <span>☐</span> <span>😫 Lelah & Jenuh</span>
          </div>
        </div>
      </div>

      <!-- B. Apa yang terjadi? -->
      <div class="neo-card bg-white" style="padding: 9pt 11pt;">
        <div style="font-size: 8.5pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2pt;">
          B. APA YANG TERJADI? (SITUASI PEMICU)
        </div>
        <div style="font-size: 7.5pt; color: #555; margin-bottom: 4pt; font-weight: 600;">
          Tuliskan peristiwa nyata yang terjadi. <em>(Misal: dimarahi orang tua karena terlambat pulang, diejek teman).</em>
        </div>
        <div class="neo-box-dashed" style="min-height: 28pt; font-size: 8pt; color: #888;">
          Tuliskan pemicu situasimu di sini...
        </div>
      </div>

      <!-- C. Apa yang kupikirkan? -->
      <div class="neo-card bg-white" style="padding: 9pt 11pt;">
        <div style="font-size: 8.5pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2pt;">
          C. APA YANG KUPIKIRKAN? (PIKIRAN OTOMATIS)
        </div>
        <div style="font-size: 7.5pt; color: #555; margin-bottom: 4pt; font-weight: 600;">
          Pikiran spontan yang muncul mengikuti perasaan. <em>(Misal: "Orang tua tidak menyayangiku", "Aku tidak pandai").</em>
        </div>
        <div class="neo-box-dashed" style="min-height: 28pt; font-size: 8pt; color: #888;">
          Tuliskan kalimat praduga di kepalamu...
        </div>
      </div>

      <!-- D. Seberapa Kuat Emosinya? -->
      <div class="neo-card bg-yellow" style="padding: 9pt 11pt;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5pt;">
          <span style="font-size: 8.5pt; font-weight: 900; text-transform: uppercase;">D. SEBERAPA KUAT INTENSITAS EMOSINYA?</span>
          <span class="neo-tag bg-white">LINGKARI 1-10</span>
        </div>
        <!-- Meter 1 to 10 -->
        <div style="display: flex; justify-content: space-between; gap: 3pt;">
          <div class="neo-card-sm" style="flex: 1; text-align: center; padding: 4.5pt 0; font-weight: 900; font-size: 8pt; background: #D3F9D8;">1</div>
          <div class="neo-card-sm" style="flex: 1; text-align: center; padding: 4.5pt 0; font-weight: 900; font-size: 8pt; background: #D3F9D8;">2</div>
          <div class="neo-card-sm" style="flex: 1; text-align: center; padding: 4.5pt 0; font-weight: 900; font-size: 8pt; background: #E6FCF5;">3</div>
          <div class="neo-card-sm" style="flex: 1; text-align: center; padding: 4.5pt 0; font-weight: 900; font-size: 8pt; background: #FFF3BF;">4</div>
          <div class="neo-card-sm" style="flex: 1; text-align: center; padding: 4.5pt 0; font-weight: 900; font-size: 8pt; background: #FFF3BF;">5</div>
          <div class="neo-card-sm" style="flex: 1; text-align: center; padding: 4.5pt 0; font-weight: 900; font-size: 8pt; background: #FFE8CC;">6</div>
          <div class="neo-card-sm" style="flex: 1; text-align: center; padding: 4.5pt 0; font-weight: 900; font-size: 8pt; background: #FFD8A8;">7</div>
          <div class="neo-card-sm" style="flex: 1; text-align: center; padding: 4.5pt 0; font-weight: 900; font-size: 8pt; background: #FFA8A8;">8</div>
          <div class="neo-card-sm" style="flex: 1; text-align: center; padding: 4.5pt 0; font-weight: 900; font-size: 8pt; background: #FF8787; color: #fff;">9</div>
          <div class="neo-card-sm" style="flex: 1; text-align: center; padding: 4.5pt 0; font-weight: 900; font-size: 8pt; background: #E03131; color: #fff;">10</div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 7pt; font-weight: 800; text-transform: uppercase; margin-top: 4pt; color: #333;">
          <span>Ringan (1-3)</span>
          <span>Sedang (4-6)</span>
          <span>Sangat Kuat (7-10)</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="page-footer">
      <span>dr. Henky Kurniawan • Edukasi Remaja</span>
      <span class="neo-badge bg-black" style="color: #fff;">HALAMAN 04 / 10</span>
    </div>
  </div>

  <!-- =================================================================== -->
  <!-- PAGE 5: 1. EMOTION DIARY (BAGIAN 2 — RESPON & CONTOH KASUS)        -->
  <!-- =================================================================== -->
  <div class="page">
    <!-- Header -->
    <div>
      <div class="page-header">
        <span class="neo-badge bg-cyan">LATIHAN MANDIRI 01 (LANJUTAN)</span>
        <span class="neo-badge bg-white">HALAMAN 05 / 10</span>
      </div>
      <h2 class="font-heading" style="font-size: 20pt; text-transform: uppercase; margin-bottom: 2pt;">
        RESPON & CONTOH KASUS 💡
      </h2>
      <p style="font-size: 8.5pt; font-weight: 600; color: #444;">Mengubah reaksi emosional spontan menjadi respon pemulihan yang sehat.</p>
    </div>

    <div class="page-body">
      <!-- E. Apa yang biasanya kulakukan setelahnya? -->
      <div class="neo-card bg-white" style="padding: 9pt 11pt;">
        <div style="font-size: 8.5pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2pt;">
          E. APA YANG BIASANYA KULAKUKAN SETELAHNYA?
        </div>
        <div style="font-size: 7.5pt; color: #555; margin-bottom: 4pt; font-weight: 600;">
          Reaksi spontan: <em>(Misal: menangis di kamar, malas berbicara, membanting pintu, mengurung diri).</em>
        </div>
        <div class="neo-box-dashed" style="min-height: 24pt; font-size: 8pt; color: #888;">
          Tuliskan kebiasaan reaksimu...
        </div>
      </div>

      <!-- F. Alternatif tindakan sehat -->
      <div class="neo-card bg-mint" style="padding: 9pt 11pt;">
        <div style="font-size: 8.5pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2pt;">
          F. ALTERNATIF RESPON YANG LEBIH SEHAT
        </div>
        <div style="font-size: 7.5pt; color: #111; margin-bottom: 4pt; font-weight: 600;">
          Tindakan bijak: <em>Berusaha tenang dengan relaksasi napas, mengakui kesalahan tanpa merendahkan diri, dan menjelaskan keadaan baik-baik.</em>
        </div>
        <div class="neo-box-dashed" style="background: #fff; min-height: 24pt; font-size: 8pt; color: #888;">
          Langkah sehat yang ingin kucoba nanti...
        </div>
      </div>

      <!-- Case Study Card -->
      <div class="neo-card bg-purple" style="padding: 10pt 12pt;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6pt; border-bottom: 2px solid #000; padding-bottom: 3pt;">
          <span style="font-size: 8.5pt; font-weight: 900; text-transform: uppercase;">⭐ CONTOH NYATA DARI WORKBOOK:</span>
          <span class="neo-tag bg-white">STUDI KASUS</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 4pt; font-size: 8pt;">
          <div style="display: flex; justify-content: space-between; background: #fff; border: 2px solid #000; border-radius: 6px; padding: 4pt 6pt;">
            <span style="font-weight: 800;">📅 Kejadian:</span>
            <span style="font-weight: 600;">Senin / Mendapat nilai ulangan jelek</span>
          </div>
          <div style="display: flex; justify-content: space-between; background: #fff; border: 2px solid #000; border-radius: 6px; padding: 4pt 6pt;">
            <span style="font-weight: 800;">🎭 Emosi & Skor:</span>
            <span style="font-weight: 700; color: #C00;">Sedih, Kecewa • Intensitas 8 / 10</span>
          </div>
          <div style="display: flex; justify-content: space-between; background: #fff; border: 2px solid #000; border-radius: 6px; padding: 4pt 6pt;">
            <span style="font-weight: 800;">💭 Pikiran Muncul:</span>
            <span style="font-weight: 600;">"Aku tidak pandai, aku gagal total"</span>
          </div>
          <div style="background: #FFE500; border: 2px solid #000; border-radius: 6px; padding: 5pt 7pt;">
            <div style="font-weight: 900; font-size: 7.5pt; text-transform: uppercase; margin-bottom: 1pt;">🎯 KEBUTUHAN NYATAKU:</div>
            <div style="font-weight: 600; font-size: 7.5pt; line-height: 1.35;">
              Tenang, istirahat sejenak dari stres, mempelajari kembali materi yang keliru, dan bertanya kepada guru jika kesulitan.
            </div>
          </div>
        </div>
      </div>

      <!-- 3 Golden Reflection Questions -->
      <div class="neo-card-sm bg-yellow" style="padding: 8pt 10pt;">
        <div style="font-size: 8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 3pt;">
          ❓ 3 PERTANYAAN PENJAGA EMOSI:
        </div>
        <div style="font-size: 7.2pt; font-weight: 700; line-height: 1.35; color: #222;">
          1. Apakah pikiran ini 100% fakta nyata, atau hanya asumsi kepalaku?<br>
          2. Jika temanku yang mengalaminya, apa nasihat lembutku padanya?<br>
          3. Tindakan kecil apa yang paling menolongku merasa tenang saat ini?
        </div>
      </div>

      <!-- Template Log Singkat -->
      <div class="neo-card-sm bg-white" style="padding: 8pt 10pt;">
        <div style="font-size: 8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 4pt;">
          📝 TEMPLATE MANDIRI HARIAN:
        </div>
        <div style="display: grid; grid-template-columns: 2fr 1.2fr 1fr 2fr; gap: 3pt; font-size: 7pt; font-weight: 800; text-align: center;">
          <div style="background: #FEF6E4; border: 1.5px solid #000; padding: 3pt 1pt;">KEJADIAN</div>
          <div style="background: #FEF6E4; border: 1.5px solid #000; padding: 3pt 1pt;">EMOSI</div>
          <div style="background: #FEF6E4; border: 1.5px solid #000; padding: 3pt 1pt;">SKALA (1-10)</div>
          <div style="background: #FEF6E4; border: 1.5px solid #000; padding: 3pt 1pt;">KEBUTUHAN</div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="page-footer">
      <span>dr. Henky Kurniawan • Edukasi Remaja</span>
      <span class="neo-badge bg-black" style="color: #fff;">HALAMAN 05 / 10</span>
    </div>
  </div>

  <!-- =================================================================== -->
  <!-- PAGE 6: EMOSI BUKAN MUSUH & 6 PROTOKOL SAAT TERTEKAN               -->
  <!-- =================================================================== -->
  <div class="page">
    <!-- Header -->
    <div>
      <div class="page-header">
        <span class="neo-badge bg-mint">MINDSET EMOSIONAL</span>
        <span class="neo-badge bg-white">HALAMAN 06 / 10</span>
      </div>
      <h2 class="font-heading" style="font-size: 20pt; text-transform: uppercase; margin-bottom: 2pt;">
        EMOSI BUKAN MUSUHMU! 🛡️
      </h2>
      <p style="font-size: 8.5pt; font-weight: 600; color: #444;">Setiap rasa yang hadir membawa pesan penting tentang dirimu.</p>
    </div>

    <div class="page-body">
      <!-- Quote Banner -->
      <div class="neo-card bg-yellow" style="padding: 10pt 12pt;">
        <div style="font-size: 10pt; font-weight: 900; line-height: 1.25; margin-bottom: 3pt;">
          🌱 "Aku tidak harus menghilangkan semua emosi. Aku sedang belajar memahaminya."
        </div>
        <p style="font-size: 7.8pt; font-weight: 600; line-height: 1.4; color: #222;">
          Marah, sedih, kecewa, takut, atau malu adalah <strong>sinyal alami sistem tubuh</strong> bahwa ada sesuatu yang sedang terjadi dalam diri. Yang penting bukan menghilangkan emosi, tetapi meresponsnya secara bijak dan sehat.
        </p>
      </div>

      <!-- Emotional Meaning Matrix -->
      <div class="neo-card-sm bg-purple" style="padding: 8pt 10pt;">
        <div style="font-size: 8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 4pt;">
          🔍 APA ARTI DI BALIK SETIAP EMOSIMU?
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4pt; font-size: 7.2pt;">
          <div style="background: #fff; border: 1.5px solid #000; border-radius: 6px; padding: 4pt 5pt;">
            <strong>😡 MARAH:</strong> Batasan dirimu dilanggar / ada ketidakadilan.
          </div>
          <div style="background: #fff; border: 1.5px solid #000; border-radius: 6px; padding: 4pt 5pt;">
            <strong>😢 SEDIH:</strong> Kamu kehilangan sesuatu yang berharga bagimu.
          </div>
          <div style="background: #fff; border: 1.5px solid #000; border-radius: 6px; padding: 4pt 5pt;">
            <strong>😰 CEMAS:</strong> Otakmu sedang bersiap melindungimu dari bahaya.
          </div>
          <div style="background: #fff; border: 1.5px solid #000; border-radius: 6px; padding: 4pt 5pt;">
            <strong>💔 KECEWA:</strong> Ada jarak antara harapan dan kenyataan hidup.
          </div>
        </div>
      </div>

      <!-- 6 Action Steps -->
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4pt;">
          <span style="font-size: 8.5pt; font-weight: 900; text-transform: uppercase;">🚨 6 LANGKAH SAAT KEWALAHAN DENGAN EMOSI:</span>
          <span class="neo-tag bg-white">PANDUAN AKSI</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 4.5pt;">
          <!-- Step 1 -->
          <div class="neo-card-sm bg-white" style="display: flex; align-items: center; gap: 7pt; padding: 5.5pt 8pt;">
            <span class="neo-badge bg-cyan" style="font-size: 8pt; padding: 2.5pt 6pt;">01</span>
            <div style="font-size: 7.5pt; line-height: 1.3;">
              <strong>Kenali Emosimu:</strong> Beri nama apa yang dirasakan (takut, sedih, marah, kecewa). Jangan disangkal.
            </div>
          </div>

          <!-- Step 2 -->
          <div class="neo-card-sm bg-white" style="display: flex; align-items: center; gap: 7pt; padding: 5.5pt 8pt;">
            <span class="neo-badge bg-yellow" style="font-size: 8pt; padding: 2.5pt 6pt;">02</span>
            <div style="font-size: 7.5pt; line-height: 1.3;">
              <strong>Ambil Jeda (Stop):</strong> Tarik napas perlahan, minum segelas air putih. Tunda reaksi spontan beberapa menit.
            </div>
          </div>

          <!-- Step 3 -->
          <div class="neo-card-sm bg-white" style="display: flex; align-items: center; gap: 7pt; padding: 5.5pt 8pt;">
            <span class="neo-badge bg-mint" style="font-size: 8pt; padding: 2.5pt 6pt;">03</span>
            <div style="font-size: 7.5pt; line-height: 1.3;">
              <strong>Alirkan Emosi Sehat:</strong> Jalan santai, menulis jurnal, menggambar, mendengarkan musik, berolahraga, atau berdoa.
            </div>
          </div>

          <!-- Step 4 -->
          <div class="neo-card-sm bg-white" style="display: flex; align-items: center; gap: 7pt; padding: 5.5pt 8pt;">
            <span class="neo-badge bg-pink" style="color: #fff; font-size: 8pt; padding: 2.5pt 6pt;">04</span>
            <div style="font-size: 7.5pt; line-height: 1.3;">
              <strong>Jaga Keamanan Diri:</strong> Hindari tindakan impulsif yang membahayakan atau menyakiti diri (*no self-harm*).
            </div>
          </div>

          <!-- Step 5 -->
          <div class="neo-card-sm bg-white" style="display: flex; align-items: center; gap: 7pt; padding: 5.5pt 8pt;">
            <span class="neo-badge bg-purple" style="font-size: 8pt; padding: 2.5pt 6pt;">05</span>
            <div style="font-size: 7.5pt; line-height: 1.3;">
              <strong>Kuatkan Diri Sendiri:</strong> Hentikan self-blame. Bicaralah lembut pada diri seperti menghibur sahabat terbaik.
            </div>
          </div>

          <!-- Step 6 -->
          <div class="neo-card-sm bg-white" style="display: flex; align-items: center; gap: 7pt; padding: 5.5pt 8pt;">
            <span class="neo-badge bg-orange" style="font-size: 8pt; padding: 2.5pt 6pt;">06</span>
            <div style="font-size: 7.5pt; line-height: 1.3;">
              <strong>Cari Bantuan Tepercaya:</strong> Ceritakan perasaanmu kepada orang dewasa yang dipercaya atau konselor.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="page-footer">
      <span>dr. Henky Kurniawan • Edukasi Remaja</span>
      <span class="neo-badge bg-black" style="color: #fff;">HALAMAN 06 / 10</span>
    </div>
  </div>

  <!-- =================================================================== -->
  <!-- PAGE 7: 2. MOOD TRACKER 7 HARI & REFLEKSI PEKANAN                  -->
  <!-- =================================================================== -->
  <div class="page">
    <!-- Header -->
    <div>
      <div class="page-header">
        <span class="neo-badge bg-purple">LATIHAN MANDIRI 02</span>
        <span class="neo-badge bg-white">HALAMAN 07 / 10</span>
      </div>
      <h2 class="font-heading" style="font-size: 20pt; text-transform: uppercase; margin-bottom: 2pt;">
        2. MOOD TRACKER 7 HARI 📊
      </h2>
      <p style="font-size: 8.5pt; font-weight: 600; color: #444;">Amati grafik naik-turun suasana hatimu dan kenali polanya.</p>
    </div>

    <div class="page-body">
      <!-- Mood Symbols Legend -->
      <div style="display: flex; justify-content: space-between; align-items: center; background: #fff; border: 2px solid #000; border-radius: 8px; padding: 5pt 8pt; font-size: 7.5pt; font-weight: 800;">
        <span>SIMBOL:</span>
        <span>😊 Senang</span>
        <span>🌿 Tenang</span>
        <span>😐 Datar</span>
        <span>😢 Sedih</span>
        <span>😡 Kesal</span>
      </div>

      <!-- 7 Day Table -->
      <div class="neo-card bg-white" style="padding: 7pt 8pt;">
        <table style="width: 100%; border-collapse: collapse; font-size: 7.5pt;">
          <thead>
            <tr style="background: #FFE500; border-bottom: 2.5px solid #000;">
              <th style="padding: 4pt 2pt; border: 1.5px solid #000; font-weight: 900; width: 15%;">HARI</th>
              <th style="padding: 4pt 2pt; border: 1.5px solid #000; font-weight: 900; width: 22%;">MOOD</th>
              <th style="padding: 4pt 2pt; border: 1.5px solid #000; font-weight: 900; width: 32%;">PEMICU UTAMA</th>
              <th style="padding: 4pt 2pt; border: 1.5px solid #000; font-weight: 900; width: 31%;">TINDAKANKU</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 4pt 2pt; border: 1.5px solid #000; font-weight: 800; text-align: center; background: #FEF6E4;">HARI 1</td>
              <td style="padding: 4pt 2pt; border: 1.5px solid #000; text-align: center;">😊 🌿 😐 😢 😡</td>
              <td style="padding: 4pt 2pt; border: 1.5px solid #000; color: #888;">Tugas sekolah...</td>
              <td style="padding: 4pt 2pt; border: 1.5px solid #000; color: #888;">Dengar musik...</td>
            </tr>
            <tr>
              <td style="padding: 4pt 2pt; border: 1.5px solid #000; font-weight: 800; text-align: center; background: #FEF6E4;">HARI 2</td>
              <td style="padding: 4pt 2pt; border: 1.5px solid #000; text-align: center;">😊 🌿 😐 😢 😡</td>
              <td style="padding: 4pt 2pt; border: 1.5px solid #000;"></td>
              <td style="padding: 4pt 2pt; border: 1.5px solid #000;"></td>
            </tr>
            <tr>
              <td style="padding: 4pt 2pt; border: 1.5px solid #000; font-weight: 800; text-align: center; background: #FEF6E4;">HARI 3</td>
              <td style="padding: 4pt 2pt; border: 1.5px solid #000; text-align: center;">😊 🌿 😐 😢 😡</td>
              <td style="padding: 4pt 2pt; border: 1.5px solid #000;"></td>
              <td style="padding: 4pt 2pt; border: 1.5px solid #000;"></td>
            </tr>
            <tr>
              <td style="padding: 4pt 2pt; border: 1.5px solid #000; font-weight: 800; text-align: center; background: #FEF6E4;">HARI 4</td>
              <td style="padding: 4pt 2pt; border: 1.5px solid #000; text-align: center;">😊 🌿 😐 😢 😡</td>
              <td style="padding: 4pt 2pt; border: 1.5px solid #000;"></td>
              <td style="padding: 4pt 2pt; border: 1.5px solid #000;"></td>
            </tr>
            <tr>
              <td style="padding: 4pt 2pt; border: 1.5px solid #000; font-weight: 800; text-align: center; background: #FEF6E4;">HARI 5</td>
              <td style="padding: 4pt 2pt; border: 1.5px solid #000; text-align: center;">😊 🌿 😐 😢 😡</td>
              <td style="padding: 4pt 2pt; border: 1.5px solid #000;"></td>
              <td style="padding: 4pt 2pt; border: 1.5px solid #000;"></td>
            </tr>
            <tr>
              <td style="padding: 4pt 2pt; border: 1.5px solid #000; font-weight: 800; text-align: center; background: #FEF6E4;">HARI 6</td>
              <td style="padding: 4pt 2pt; border: 1.5px solid #000; text-align: center;">😊 🌿 😐 😢 😡</td>
              <td style="padding: 4pt 2pt; border: 1.5px solid #000;"></td>
              <td style="padding: 4pt 2pt; border: 1.5px solid #000;"></td>
            </tr>
            <tr>
              <td style="padding: 4pt 2pt; border: 1.5px solid #000; font-weight: 800; text-align: center; background: #FEF6E4;">HARI 7</td>
              <td style="padding: 4pt 2pt; border: 1.5px solid #000; text-align: center;">😊 🌿 😐 😢 😡</td>
              <td style="padding: 4pt 2pt; border: 1.5px solid #000;"></td>
              <td style="padding: 4pt 2pt; border: 1.5px solid #000;"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Weekly Reflection Card -->
      <div class="neo-card bg-cream" style="padding: 9pt 11pt;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5pt; border-bottom: 2px solid #000; padding-bottom: 3pt;">
          <span style="font-size: 8.5pt; font-weight: 900; text-transform: uppercase;">🔍 REFLEKSI MINGGU INI:</span>
          <span class="neo-tag bg-cyan">EVALUASI DIRI</span>
        </div>

        <div style="font-size: 8pt; margin-bottom: 6pt;">
          <div style="font-weight: 800; margin-bottom: 2pt;">Mood apa yang paling sering muncul minggu ini?</div>
          <div class="neo-box-dashed" style="min-height: 18pt; font-size: 7.5pt; color: #777;">
            Tuliskan emosi dominanmu sepekan ini...
          </div>
        </div>

        <div>
          <div style="font-size: 8pt; font-weight: 800; margin-bottom: 3pt;">Hal yang paling sering memengaruhi suasana hatiku:</div>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 3pt; font-size: 7.5pt; font-weight: 700;">
            <div class="neo-card-sm" style="padding: 3.5pt 5pt; background: #fff;">☐ Sekolah / Tugas</div>
            <div class="neo-card-sm" style="padding: 3.5pt 5pt; background: #fff;">☐ Hubungan Pertemanan</div>
            <div class="neo-card-sm" style="padding: 3.5pt 5pt; background: #fff;">☐ Masalah Keluarga</div>
            <div class="neo-card-sm" style="padding: 3.5pt 5pt; background: #fff;">☐ Media Sosial / FOMO</div>
            <div class="neo-card-sm" style="padding: 3.5pt 5pt; background: #fff;">☐ Kurang Tidur / Capek</div>
            <div class="neo-card-sm" style="padding: 3.5pt 5pt; background: #fff;">☐ Hal Lain: ............</div>
          </div>
        </div>
      </div>

      <!-- Weekly Self-Reward Note -->
      <div class="neo-card-sm bg-mint" style="padding: 7pt 10pt; text-align: center;">
        <div style="font-size: 7.5pt; font-weight: 900; text-transform: uppercase;">
          🎁 APRESIASI DIRIMU: "Aku hebat sudah bertahan dan berproses selama 7 hari ini!"
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="page-footer">
      <span>dr. Henky Kurniawan • Edukasi Remaja</span>
      <span class="neo-badge bg-black" style="color: #fff;">HALAMAN 07 / 10</span>
    </div>
  </div>

  <!-- =================================================================== -->
  <!-- PAGE 8: KATALOG PERBAIKI MOOD (PART 1 — QUICK BOOST & GERAK)       -->
  <!-- =================================================================== -->
  <div class="page">
    <!-- Header -->
    <div>
      <div class="page-header">
        <span class="neo-badge bg-yellow">TOOLKIT EMOSI (1)</span>
        <span class="neo-badge bg-white">HALAMAN 08 / 10</span>
      </div>
      <h2 class="font-heading" style="font-size: 20pt; text-transform: uppercase; margin-bottom: 2pt;">
        RESEP PERBAIKI MOOD (1) ⚡
      </h2>
      <p style="font-size: 8.5pt; font-weight: 600; color: #444;">Pilihan kegiatan praktis untuk merestart pikiran saat baterai energimu drop.</p>
    </div>

    <div class="page-body">
      <!-- Item 1 -->
      <div class="neo-card bg-white" style="display: flex; gap: 10pt; align-items: center; padding: 11pt 12pt; border-left: 6pt solid #FFE500;">
        <div style="font-size: 24pt; line-height: 1;">🎧</div>
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2pt;">
            <span style="font-size: 9pt; font-weight: 900; text-transform: uppercase;">1. Dengarkan Musik Favorit</span>
            <span class="neo-tag bg-yellow">5–15 MENIT</span>
          </div>
          <div style="font-size: 7.8pt; font-weight: 600; color: #333; line-height: 1.35;">
            Putar lagu yang membuatmu tenang atau lagu bertempo ceria yang membakar semangat. Hindari lagu galau yang memperburuk suasana hati!
          </div>
        </div>
      </div>

      <!-- Item 2 -->
      <div class="neo-card bg-white" style="display: flex; gap: 10pt; align-items: center; padding: 11pt 12pt; border-left: 6pt solid #00E599;">
        <div style="font-size: 24pt; line-height: 1;">🚶</div>
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2pt;">
            <span style="font-size: 9pt; font-weight: 900; text-transform: uppercase;">2. Bergerak & Olahraga Ringan</span>
            <span class="neo-tag bg-mint">10–20 MENIT</span>
          </div>
          <div style="font-size: 7.8pt; font-weight: 600; color: #333; line-height: 1.35;">
            Jalan kaki santai di sekitar rumah, stretching peregangan leher/bahu, dance bebas di kamar, atau bersepeda untuk melepas hormon endorfin.
          </div>
        </div>
      </div>

      <!-- Item 3 -->
      <div class="neo-card bg-white" style="display: flex; gap: 10pt; align-items: center; padding: 11pt 12pt; border-left: 6pt solid #00F0FF;">
        <div style="font-size: 24pt; line-height: 1;">🌿</div>
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2pt;">
            <span style="font-size: 9pt; font-weight: 900; text-transform: uppercase;">3. Keluar Menghirup Udara Segar</span>
            <span class="neo-tag bg-cyan">5–15 MENIT</span>
          </div>
          <div style="font-size: 7.8pt; font-weight: 600; color: #333; line-height: 1.35;">
            Duduk di teras rumah, pandangi birunya langit dan tanaman hijau, nikmati sinar matahari alami dan rasakan hembusan angin sepoi-sepoi.
          </div>
        </div>
      </div>

      <!-- Item 4 -->
      <div class="neo-card bg-white" style="display: flex; gap: 10pt; align-items: center; padding: 11pt 12pt; border-left: 6pt solid #FF5E7E;">
        <div style="font-size: 24pt; line-height: 1;">💬</div>
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2pt;">
            <span style="font-size: 9pt; font-weight: 900; text-transform: uppercase;">4. Hubungi Teman Tepercaya</span>
            <span class="neo-tag bg-pink" style="color: #fff;">5–20 MENIT</span>
          </div>
          <div style="font-size: 7.8pt; font-weight: 600; color: #333; line-height: 1.35;">
            Kirim chat atau telepon sahabat maupun orang dewasa yang selalu siap mendengarkan unek-unekmu secara utuh tanpa pernah menghakimi.
          </div>
        </div>
      </div>

      <!-- Item 5 -->
      <div class="neo-card bg-white" style="display: flex; gap: 10pt; align-items: center; padding: 11pt 12pt; border-left: 6pt solid #D4BBFF;">
        <div style="font-size: 24pt; line-height: 1;">✍️</div>
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2pt;">
            <span style="font-size: 9pt; font-weight: 900; text-transform: uppercase;">5. Tulis Perasaan (Brain Dump)</span>
            <span class="neo-tag bg-purple">5–10 MENIT</span>
          </div>
          <div style="font-size: 7.8pt; font-weight: 600; color: #333; line-height: 1.35;">
            Keluarkan seluruh unek-unek ke kertas tanpa perlu takut dinilai, tanpa memikirkan kerapian kata, ejaan, ataupun tata bahasa.
          </div>
        </div>
      </div>

      <!-- Quick Action Challenge Box -->
      <div class="neo-card bg-yellow" style="padding: 12pt 14pt;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4pt;">
          <span style="font-size: 8.5pt; font-weight: 900; text-transform: uppercase;">⚡ TANTANGAN MOOD KILAT HARI INI:</span>
          <span class="neo-tag bg-white">10 MENIT SAJA</span>
        </div>
        <div style="font-size: 8pt; font-weight: 600; line-height: 1.4;">
          Pilihlah salah satu nomor di atas yang paling mudah kamu lakukan saat ini. Beri tanda centang dan rasakan perbedaan suasana hatimu setelahnya!
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="page-footer">
      <span>dr. Henky Kurniawan • Edukasi Remaja</span>
      <span class="neo-badge bg-black" style="color: #fff;">HALAMAN 08 / 10</span>
    </div>
  </div>

  <!-- =================================================================== -->
  <!-- PAGE 9: KATALOG PERBAIKI MOOD (PART 2 — MINDFUL & SELF-CARE)        -->
  <!-- =================================================================== -->
  <div class="page">
    <!-- Header -->
    <div>
      <div class="page-header">
        <span class="neo-badge bg-cyan">TOOLKIT EMOSI (2)</span>
        <span class="neo-badge bg-white">HALAMAN 09 / 10</span>
      </div>
      <h2 class="font-heading" style="font-size: 20pt; text-transform: uppercase; margin-bottom: 2pt;">
        RESEP PERBAIKI MOOD (2) 🧘
      </h2>
      <p style="font-size: 8.5pt; font-weight: 600; color: #444;">Tenangkan sistem sarafmu dengan teknik mindfulness dan self-care teruji.</p>
    </div>

    <div class="page-body">
      <!-- Item 1: Hobi -->
      <div class="neo-card bg-white" style="display: flex; gap: 10pt; align-items: center; padding: 8pt 11pt; border-left: 6pt solid #D4BBFF;">
        <div style="font-size: 22pt; line-height: 1;">🎨</div>
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2pt;">
            <span style="font-size: 8.5pt; font-weight: 900; text-transform: uppercase;">6. Lakukan Hobi Kreatif</span>
            <span class="neo-tag bg-purple">15–30 MNT</span>
          </div>
          <div style="font-size: 7.5pt; font-weight: 600; color: #333; line-height: 1.3;">
            Menggambar doodle, mewarnai buku, memasak camilan simpel, berkebun, fotografi, atau bermain alat musik.
          </div>
        </div>
      </div>

      <!-- Item 2: Box Breathing -->
      <div class="neo-card bg-white" style="display: flex; gap: 10pt; align-items: center; padding: 8pt 11pt; border-left: 6pt solid #00E599;">
        <div style="font-size: 22pt; line-height: 1;">🧘</div>
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2pt;">
            <span style="font-size: 8.5pt; font-weight: 900; text-transform: uppercase;">7. Latihan Pernapasan Dalam</span>
            <span class="neo-tag bg-mint">2–5 MNT</span>
          </div>
          <div style="font-size: 7.5pt; font-weight: 600; color: #333; line-height: 1.3;">
            Tarik napas perlahan lewat hidung 4 detik, tahan 4 detik, dan hembuskan panjang lewat mulut 6 detik.
          </div>
        </div>
      </div>

      <!-- Item 3: Grounding 5-4-3-2-1 Interactive Exercise -->
      <div class="neo-card bg-yellow" style="padding: 10pt 12pt;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4pt;">
          <span style="font-size: 8.5pt; font-weight: 900; text-transform: uppercase;">🧊 8. TEKNIK GROUNDING 5-4-3-2-1:</span>
          <span class="neo-tag bg-white">FOKUS KINI</span>
        </div>
        <div style="font-size: 7.5pt; font-weight: 600; color: #222; margin-bottom: 5pt; line-height: 1.3;">
          Latihan pereda overthinking instan saat pikiran terasa penuh. Sadari sekelilingmu:
        </div>
        <div style="display: flex; flex-direction: column; gap: 3.5pt; font-size: 7.5pt; font-weight: 700;">
          <div style="background: #fff; border: 1.5px solid #000; border-radius: 6px; padding: 3.5pt 7pt; display: flex; justify-content: space-between;">
            <span>👀 <strong>5 Benda</strong> yang bisa kamu lihat:</span>
            <span style="color: #777;">lampu, buku, meja, jendela...</span>
          </div>
          <div style="background: #fff; border: 1.5px solid #000; border-radius: 6px; padding: 3.5pt 7pt; display: flex; justify-content: space-between;">
            <span>🖐️ <strong>4 Hal</strong> yang bisa disentuh:</span>
            <span style="color: #777;">kain baju, permukaan meja...</span>
          </div>
          <div style="background: #fff; border: 1.5px solid #000; border-radius: 6px; padding: 3.5pt 7pt; display: flex; justify-content: space-between;">
            <span>👂 <strong>3 Suara</strong> yang terdengar:</span>
            <span style="color: #777;">detak jam, desau AC, burung...</span>
          </div>
          <div style="background: #fff; border: 1.5px solid #000; border-radius: 6px; padding: 3.5pt 7pt; display: flex; justify-content: space-between;">
            <span>👃 <strong>2 Aroma</strong> yang bisa dicium:</span>
            <span style="color: #777;">aroma sabun, minyak angin...</span>
          </div>
          <div style="background: #fff; border: 1.5px solid #000; border-radius: 6px; padding: 3.5pt 7pt; display: flex; justify-content: space-between;">
            <span>👅 <strong>1 Rasa</strong> di lidah / fisik:</span>
            <span style="color: #777;">kesegaran tegukan air...</span>
          </div>
        </div>
      </div>

      <!-- Item 4: Medsos Detox -->
      <div class="neo-card bg-white" style="display: flex; gap: 10pt; align-items: center; padding: 8pt 11pt; border-left: 6pt solid #FF5E7E;">
        <div style="font-size: 22pt; line-height: 1;">📵</div>
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2pt;">
            <span style="font-size: 8.5pt; font-weight: 900; text-transform: uppercase;">9. Jeda Media Sosial (Detox)</span>
            <span class="neo-tag bg-pink" style="color: #fff;">15–30 MNT</span>
          </div>
          <div style="font-size: 7.5pt; font-weight: 600; color: #333; line-height: 1.3;">
            Jauhkan HP sementara waktu, matikan notifikasi berisik, dan istirahatkan matamu dari paparan layar kaca.
          </div>
        </div>
      </div>

      <!-- Item 5: Self Care & Kebaikan -->
      <div class="neo-card bg-white" style="display: flex; gap: 10pt; align-items: center; padding: 8pt 11pt; border-left: 6pt solid #00F0FF;">
        <div style="font-size: 22pt; line-height: 1;">🛏️</div>
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2pt;">
            <span style="font-size: 8.5pt; font-weight: 900; text-transform: uppercase;">10. Self-Care & Kebaikan Kecil</span>
            <span class="neo-tag bg-cyan">5–15 MNT</span>
          </div>
          <div style="font-size: 7.5pt; font-weight: 600; color: #333; line-height: 1.3;">
            Mandi air segar, minum air putih, rapikan tempat tidur, atau lakukan 1 bantuan kecil tulus bagi orang di sekitarmu.
          </div>
        </div>
      </div>

      <!-- Affirmation Pill -->
      <div class="neo-card-sm bg-mint" style="padding: 9pt 12pt; text-align: center;">
        <div style="font-size: 8pt; font-weight: 900; text-transform: uppercase;">
          ✨ MERAWAT DIRI ADALAH KEBUTUHAN DASAR, BUKAN BENTUK KEBERATAN!
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="page-footer">
      <span>dr. Henky Kurniawan • Edukasi Remaja</span>
      <span class="neo-badge bg-black" style="color: #fff;">HALAMAN 09 / 10</span>
    </div>
  </div>

  <!-- =================================================================== -->
  <!-- PAGE 10: 3. STRESS DIARY & LINGKARAN KENDALI                       -->
  <!-- =================================================================== -->
  <div class="page">
    <!-- Header -->
    <div>
      <div class="page-header">
        <span class="neo-badge bg-pink" style="color: #fff;">LATIHAN MANDIRI 03</span>
        <span class="neo-badge bg-white">HALAMAN 10 / 10</span>
      </div>
      <h2 class="font-heading" style="font-size: 20pt; text-transform: uppercase; margin-bottom: 2pt;">
        3. STRESS DIARY 🎯
      </h2>
      <p style="font-size: 8.5pt; font-weight: 600; color: #444;">Fokus pada apa yang bisa kamu kendalikan, lepaskan apa yang di luar kendali.</p>
    </div>

    <div class="page-body">
      <!-- Stress Diary Card Example -->
      <div class="neo-card bg-white" style="padding: 8pt 10pt;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3pt; border-bottom: 2px solid #000; padding-bottom: 2pt;">
          <span style="font-size: 8pt; font-weight: 900; text-transform: uppercase;">📌 CONTOH KASUS STRES DARI BUKU:</span>
          <span class="neo-tag bg-yellow">STUDI KASUS</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 3pt; font-size: 7.2pt;">
          <div style="display: flex; justify-content: space-between; background: #FEF6E4; border: 1.5px solid #000; border-radius: 6px; padding: 3pt 5pt;">
            <span style="font-weight: 800;">Situasi Nyata:</span>
            <span style="font-weight: 600;">Tugas sekolah menumpuk banyak</span>
          </div>
          <div style="display: flex; justify-content: space-between; background: #FEF6E4; border: 1.5px solid #000; border-radius: 6px; padding: 3pt 5pt;">
            <span style="font-weight: 800;">Tingkat Stres (1–10):</span>
            <span style="font-weight: 900; color: #C00;">Skala 7 – 8</span>
          </div>
          <div style="background: #E6FCF5; border: 1.5px solid #000; border-radius: 6px; padding: 3pt 5pt;">
            <div style="font-weight: 900; text-transform: uppercase;">⭕ APA YANG BISA KUKONTROL?</div>
            <div style="font-weight: 600;">Tidak menunda waktu pengerjaan dan mulai mencicil dari tugas termudah.</div>
          </div>
          <div style="background: #FFF9DB; border: 1.5px solid #000; border-radius: 6px; padding: 3pt 5pt;">
            <div style="font-weight: 900; text-transform: uppercase;">🚀 LANGKAH KECIL REALISTIS:</div>
            <div style="font-weight: 600;">Meluangkan 2x 30 menit fokus mengerjakan tugas sebelum memegang gadget.</div>
          </div>
        </div>
      </div>

      <!-- Student's Own Practice Card -->
      <div class="neo-card bg-white" style="padding: 8pt 10pt; border-style: dashed;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3pt;">
          <span style="font-size: 8pt; font-weight: 900; text-transform: uppercase;">✍️ SEKARANG GILIRANMU (STRESMU HARI INI):</span>
          <span class="neo-tag bg-mint">LATIHAN</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 3pt; font-size: 7.2pt;">
          <div class="neo-box-dashed" style="padding: 3pt 5pt; display: flex; justify-content: space-between;">
            <span style="font-weight: 800;">Situasi Stresku:</span>
            <span style="color: #888;">............................................................</span>
          </div>
          <div class="neo-box-dashed" style="padding: 3pt 5pt; display: flex; justify-content: space-between;">
            <span style="font-weight: 800;">Tingkat Stres (1–10):</span>
            <span style="color: #888;">[ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ] [ 6 ] [ 7 ] [ 8 ] [ 9 ] [ 10 ]</span>
          </div>
          <div class="neo-box-dashed" style="padding: 3pt 5pt;">
            <div style="font-weight: 800;">Hal yang Bisa Kukontrol:</div>
            <div style="color: #888; margin-top: 1pt;">............................................................</div>
          </div>
          <div class="neo-box-dashed" style="padding: 3pt 5pt;">
            <div style="font-weight: 800;">Langkah Kecil Pertamaku:</div>
            <div style="color: #888; margin-top: 1pt;">............................................................</div>
          </div>
        </div>
      </div>

      <!-- Circle of Control Box -->
      <div class="neo-card bg-cream" style="padding: 7pt 10pt;">
        <div style="font-size: 8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 3pt;">
          🧭 LINGKARAN KENDALI (CIRCLE OF CONTROL):
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5pt; font-size: 7pt;">
          <div style="background: #D3F9D8; border: 1.5px solid #000; border-radius: 6px; padding: 4pt 5pt; line-height: 1.35;">
            <strong>🟢 BISA KUKONTROL:</strong><br>
            • Waktu tidur & istirahatku<br>
            • Jam mulai mencicil tugas<br>
            • Caraku bicara pada diri sendiri
          </div>
          <div style="background: #FFE3E3; border: 1.5px solid #000; border-radius: 6px; padding: 4pt 5pt; line-height: 1.35;">
            <strong>🔴 DI LUAR KENDALIKU:</strong><br>
            • Ucapan/opini orang lain<br>
            • Tingkat kesulitan ujian<br>
            • Hal yang sudah berlalu
          </div>
        </div>
      </div>

      <!-- Checklist Strategi -->
      <div class="neo-card bg-white" style="padding: 7pt 10pt;">
        <div style="font-size: 8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 3pt;">
          ✅ STRATEGI YANG INGIN KUCOBA SAAT STRES:
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 2.5pt; font-size: 7.2pt; font-weight: 700;">
          <div class="neo-card-sm" style="padding: 2.5pt 4pt; background: #FEF6E4;">☐ Tidur lebih teratur</div>
          <div class="neo-card-sm" style="padding: 2.5pt 4pt; background: #FEF6E4;">☐ Pecah tugas jadi mini</div>
          <div class="neo-card-sm" style="padding: 2.5pt 4pt; background: #FEF6E4;">☐ Ambil jeda 5 menit</div>
          <div class="neo-card-sm" style="padding: 2.5pt 4pt; background: #FEF6E4;">☐ Olahraga / gerak tubuh</div>
          <div class="neo-card-sm" style="padding: 2.5pt 4pt; background: #FEF6E4;">☐ Cerita ke orang dipercaya</div>
          <div class="neo-card-sm" style="padding: 2.5pt 4pt; background: #FEF6E4;">☐ Kurangi distraksi gadget</div>
        </div>
      </div>

      <!-- Golden Reminder Box -->
      <div class="neo-card bg-yellow" style="padding: 8pt 10pt; text-align: center; border: 3px solid #000; box-shadow: 4px 4px 0px #000;">
        <div style="font-size: 7.2pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2pt; color: #555;">
          ⭐ KALIMAT PENGINGAT HARIAN:
        </div>
        <div class="font-heading" style="font-size: 10.5pt; line-height: 1.25; color: #000;">
          “Aku tidak harus menyelesaikan semuanya sekaligus hari ini. Satu langkah kecil tetap berarti besar.”
        </div>
      </div>

      <!-- Milestone Stamp -->
      <div style="display: flex; justify-content: center;">
        <span class="neo-badge bg-mint" style="font-size: 8pt; padding: 3.5pt 10pt;">
          🎉 SELESAI 10 HALAMAN PERTAMA • TERUSLAH BERTUMBUH!
        </span>
      </div>
    </div>

    <!-- Footer -->
    <div class="page-footer">
      <span>dr. Henky Kurniawan • Edukasi Remaja</span>
      <span class="neo-badge bg-black" style="color: #fff;">HALAMAN 10 / 10</span>
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
    "--virtual-time-budget=8000",
    f"--print-to-pdf={pdf_path}",
    "--no-pdf-header-footer",
    html_path
]

print("Running chrome to generate PDF...")
subprocess.run(cmd, check=True)
print(f"Generated PDF: {pdf_path}, file size: {os.path.getsize(pdf_path)} bytes")

# Render updated PNGs
subprocess.run(["pdftoppm", "-png", "-r", "150", pdf_path, "/tmp/revised4_page"], check=True)
print("Rendered revised4 page PNGs.")
