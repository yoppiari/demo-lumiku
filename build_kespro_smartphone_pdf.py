import json
import os
import re
import subprocess
from PIL import Image
import numpy as np

print("=== STARTING COMPLETE 37-PAGE E-BOOK (FRONT COVER + 35 INSIDE + BACK COVER) ===")

os.chdir(os.path.dirname(os.path.abspath(__file__)))

with open("chapters_dump.json", "r", encoding="utf-8") as f:
    chapters = json.load(f)

# Strip query strings from images in all chapters so local assets load reliably
for c in chapters:
    c["html"] = re.sub(r'(\.jpg|\.png|\.jpeg|\.svg)\?[^\"\'>\s]+', r'\1', c["html"])

ch_map = {c["id"]: c for c in chapters}
TOTAL_CONTENT_PAGES = 35

css_styles = """
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
    padding: 13pt 13pt 11pt 13pt;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    position: relative;
    page-break-after: always;
    page-break-inside: avoid;
    break-inside: avoid;
    overflow: hidden;
  }
  .font-heading {
    font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
    font-weight: 900;
    letter-spacing: -0.3px;
    line-height: 1.15;
  }
  .font-black {
    font-weight: 900;
  }

  /* Neo-Memphis / Neo-Brutalist Components */
  .neo-card {
    border: 2.5px solid #000;
    box-shadow: 3px 3px 0px #000;
    border-radius: 10px;
    background: #fff;
    padding: 7.5pt 9.5pt;
    position: relative;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .neo-card-sm {
    border: 2px solid #000;
    box-shadow: 2.5px 2.5px 0px #000;
    border-radius: 8px;
    background: #fff;
    padding: 5.5pt 8pt;
    position: relative;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .neo-badge {
    display: inline-flex;
    align-items: center;
    gap: 3pt;
    border: 1.8px solid #000;
    box-shadow: 1.5px 1.5px 0px #000;
    border-radius: 999px;
    padding: 2.8pt 7.5pt;
    font-size: 7.8pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    line-height: 1;
  }
  .neo-tag {
    display: inline-block;
    border: 1.8px solid #000;
    box-shadow: 1.5px 1.5px 0px #000;
    border-radius: 6px;
    padding: 1.8pt 4.5pt;
    font-size: 6.8pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.2px;
    line-height: 1.1;
  }
  .neo-box-dashed {
    border: 1.8px dashed #000;
    border-radius: 6px;
    padding: 4.5pt 6.5pt;
    background: #fff;
  }

  /* Color Palette */
  .bg-yellow { background-color: #FFE500; }
  .bg-pink { background-color: #FF5E7E; color: #fff; }
  .bg-softpink { background-color: #FF90E8; }
  .bg-mint { background-color: #00E599; }
  .bg-cyan { background-color: #00F0FF; }
  .bg-purple { background-color: #D4BBFF; }
  .bg-cream { background-color: #FEF6E4; }
  .bg-white { background-color: #FFFFFF; }
  .bg-black { background-color: #121212; color: #fff; }

  /* Structure */
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4pt;
  }
  .page-body {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    flex: 1;
    margin: 4pt 0 3pt 0;
    gap: 6pt;
    min-height: 0;
  }
  .page-footer {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 2px solid #000;
    padding-top: 4.5pt;
    font-size: 7.8pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    color: #222;
  }

  /* Reader styles */
  .m-read-lead {
    font-size: 9.3pt;
    line-height: 1.44;
    font-weight: 700;
    color: #121212;
    background: #FFFDE7;
    border-left: 5px solid #FFE500;
    padding: 7.5pt 9.5pt;
    box-shadow: 2px 2px 0 #000;
    border-radius: 0 6px 6px 0;
    border: 1.5px solid #000;
    border-left-width: 4.5px;
  }
  .m-read-p {
    font-size: 8.3pt;
    line-height: 1.42;
    font-weight: 600;
    color: #222;
  }
  .m-read-h3 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 9.5pt;
    font-weight: 800;
    color: #121212;
    margin: 1.5pt 0 0.5pt 0;
    text-transform: uppercase;
  }
  .m-content-img {
    width: 100%;
    height: 220pt;
    object-fit: cover;
    display: block;
  }
  .m-img-wrap {
    border: 2px solid #000;
    box-shadow: 2.5px 2.5px 0px #000;
    border-radius: 8px;
    overflow: hidden;
    background: #fff;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .m-img-caption {
    font-size: 7.8pt;
    font-weight: 700;
    color: #333;
    background: #FFFBEB;
    padding: 4pt 7.5pt;
    border-top: 1.5px solid #000;
  }
  .m-step-list {
    display: flex;
    flex-direction: column;
    gap: 4.5pt;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .m-step-item {
    display: flex;
    gap: 5.5pt;
    align-items: center;
    background: #fff;
    border: 1.8px solid #000;
    box-shadow: 2px 2px 0px #000;
    border-radius: 6px;
    padding: 5.5pt 8pt;
  }
  .m-step-badge {
    width: 19pt;
    height: 19pt;
    border-radius: 50%;
    border: 1.8px solid #000;
    background: #FFE500;
    font-weight: 900;
    font-size: 8.5pt;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .m-step-title {
    font-size: 8.5pt;
    font-weight: 800;
    line-height: 1.25;
    color: #121212;
  }
  .m-step-desc {
    font-size: 7.8pt;
    font-weight: 600;
    color: #444;
    line-height: 1.35;
  }
  .m-callout {
    border: 2px solid #000;
    box-shadow: 2.5px 2.5px 0px #000;
    border-radius: 8px;
    padding: 7pt 9.5pt;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .m-callout-yellow { background-color: #FFFDE7; border-left: 5px solid #FFE500; }
  .m-callout-pink { background-color: #FFF0F3; border-left: 5px solid #FF5E7E; }
  .m-callout-mint { background-color: #E6FCF5; border-left: 5px solid #00E599; }
  .m-callout-lavender { background-color: #F3E8FF; border-left: 5px solid #D4BBFF; }
  .m-callout-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 8.5pt;
    font-weight: 900;
    text-transform: uppercase;
    margin-bottom: 2.5pt;
    display: flex;
    align-items: center;
    gap: 3pt;
  }
  .m-callout-body {
    font-size: 7.8pt;
    font-weight: 600;
    line-height: 1.38;
    color: #222;
  }
  .m-source-box {
    font-size: 6.8pt;
    color: #555;
    border-top: 1.5px solid #ccc;
    padding-top: 3pt;
    font-weight: 600;
    line-height: 1.25;
    margin-top: 2pt;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* NORMAL PROFESSIONAL BOOK COVERS */
  .cover-front {
    background-color: #FAF8F5;
    padding: 22pt 20pt 18pt 20pt;
    justify-content: space-between;
  }
  .cover-header {
    text-align: center;
  }
  .series-tag {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 8.5pt;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #64748B;
    margin-bottom: 5pt;
    display: inline-block;
  }
  .book-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 23pt;
    font-weight: 900;
    line-height: 1.08;
    text-transform: uppercase;
    color: #0F172A;
    letter-spacing: -0.4px;
    margin-bottom: 4pt;
  }
  .book-subtitle {
    font-size: 9.5pt;
    font-weight: 500;
    line-height: 1.38;
    color: #475569;
    max-width: 310pt;
    margin: 0 auto;
  }
  .cover-art-container {
    margin: 6pt auto;
    width: 100%;
    text-align: center;
  }
  .cover-art-img {
    width: 100%;
    height: 520pt;
    object-fit: cover;
    border-radius: 12px;
    border: 1.5px solid #0F172A;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
    display: block;
  }
  .cover-footer {
    text-align: center;
    border-top: 1.5px solid #0F172A;
    padding-top: 8pt;
  }
  .author-name {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 15.5pt;
    font-weight: 800;
    color: #0F172A;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .author-title {
    font-size: 8pt;
    font-weight: 600;
    color: #64748B;
    margin-top: 1.5pt;
    letter-spacing: 0.3px;
  }
  .publisher-mark {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 7.2pt;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #94A3B8;
    margin-top: 3pt;
  }

  .cover-back {
    background-color: #FAF8F5;
    padding: 20pt 20pt 16pt 20pt;
    justify-content: space-between;
  }
  .back-category {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 8pt;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #64748B;
    border-bottom: 1.5px solid #0F172A;
    padding-bottom: 4pt;
    margin-bottom: 8pt;
  }
  .back-headline {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 14pt;
    font-weight: 900;
    line-height: 1.2;
    text-transform: uppercase;
    color: #0F172A;
    margin-bottom: 4pt;
  }
  .back-lead {
    font-size: 8.5pt;
    font-weight: 600;
    line-height: 1.35;
    color: #0F172A;
    font-style: italic;
    margin-bottom: 7pt;
  }
  .back-blurb {
    font-size: 8.2pt;
    line-height: 1.45;
    color: #334155;
    margin-bottom: 6pt;
    text-align: justify;
  }
  .back-blurb b {
    color: #0F172A;
  }
  .back-highlights {
    background: #FFFFFF;
    border: 1.5px solid #0F172A;
    border-radius: 8px;
    padding: 8pt 10pt;
    margin: 6pt 0;
  }
  .back-highlights-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 8.2pt;
    font-weight: 800;
    text-transform: uppercase;
    color: #0F172A;
    margin-bottom: 4pt;
    letter-spacing: 0.5px;
  }
  .highlight-item {
    font-size: 7.6pt;
    line-height: 1.4;
    color: #334155;
    margin-bottom: 3.5pt;
    padding-left: 10pt;
    position: relative;
  }
  .highlight-item:last-child {
    margin-bottom: 0;
  }
  .highlight-item::before {
    content: "•";
    position: absolute;
    left: 0;
    color: #0F172A;
    font-weight: bold;
    font-size: 8.5pt;
  }
  .highlight-item b {
    color: #0F172A;
  }
  .back-quote-box {
    background: #F1F5F9;
    border-left: 3.5px solid #0F172A;
    border-radius: 0 6px 6px 0;
    padding: 7pt 9pt;
    margin: 6pt 0;
  }
  .back-quote {
    font-size: 7.8pt;
    font-style: italic;
    line-height: 1.38;
    color: #1E293B;
  }
  .back-quote-author {
    font-size: 7pt;
    font-weight: 700;
    color: #64748B;
    margin-top: 2.5pt;
    text-align: right;
  }
  .author-bio-box {
    background: #FFFFFF;
    border: 1px solid #CBD5E1;
    border-radius: 6px;
    padding: 6pt 8pt;
    margin: 5pt 0;
    font-size: 7.4pt;
    line-height: 1.38;
    color: #475569;
  }
  .author-bio-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 7.5pt;
    font-weight: 800;
    text-transform: uppercase;
    color: #0F172A;
    margin-bottom: 2pt;
    letter-spacing: 0.4px;
  }
  .author-bio-box b {
    color: #0F172A;
  }
  .helpline-box {
    background: #FFFFFF;
    border: 1.2px solid #CBD5E1;
    border-radius: 6px;
    padding: 6pt 8pt;
    margin-top: 4pt;
  }
  .helpline-title {
    font-size: 7pt;
    font-weight: 800;
    text-transform: uppercase;
    color: #0F172A;
    letter-spacing: 0.3px;
    margin-bottom: 3.5pt;
  }
  .helpline-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3pt;
    font-size: 7pt;
    color: #334155;
  }
  .back-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1.5px solid #0F172A;
    padding-top: 7pt;
    margin-top: 6pt;
  }
  .publisher-info {
    font-size: 6.8pt;
    color: #64748B;
    line-height: 1.38;
  }
  .publisher-name-bold {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 8.5pt;
    font-weight: 800;
    text-transform: uppercase;
    color: #0F172A;
    letter-spacing: 0.5px;
  }
  .edition-badge-box {
    text-align: right;
    border-left: 1px dashed #CBD5E1;
    padding-left: 8pt;
  }
  .barcode-lines {
    display: flex;
    justify-content: flex-end;
    gap: 1.5px;
    height: 22pt;
    margin-top: 2pt;
  }
  .b-bar {
    background: #0F172A;
    height: 100%;
  }
"""

def make_chapter_page(page_num, ch_id, custom_title=None, custom_header_badge=None, custom_body_html=None, track="neutral"):
    ch = ch_map[ch_id]

    if custom_header_badge:
        header_left = custom_header_badge
    elif track == "girl":
        header_left = '<span class="neo-badge bg-pink">🌸 JALUR CEWEK</span>'
    elif track == "boy":
        header_left = '<span class="neo-badge bg-cyan">💧 JALUR COWOK</span>'
    elif ch_id <= 16:
        header_left = '<span class="neo-badge bg-mint">🌱 PILAR 1: FONDASI</span>'
    else:
        header_left = '<span class="neo-badge bg-purple">🛡️ PILAR 2: PERLINDUNGAN</span>'

    header_right = f'<span class="neo-badge bg-white">BAB {ch_id:02d} / 30</span>'

    title = custom_title if custom_title else ch["title"]
    hook = ch["hook"]
    body_html = custom_body_html if custom_body_html else ch["html"]

    return f"""
  <div class="page">
    <div>
      <div class="page-header">
        {header_left}
        {header_right}
      </div>
      <h2 class="font-heading" style="font-size: 15.5pt; text-transform: uppercase; margin-bottom: 2pt;">
        {ch["icon"]} {title}
      </h2>
      <p style="font-size: 7.2pt; font-weight: 600; color: #444; line-height: 1.25; margin-bottom: 3pt;">
        {hook}
      </p>
    </div>

    <div class="page-body">
      {body_html}
    </div>

    <div class="page-footer">
      <span>Ruang Tumbuh Remaja • KESPRO SPACE</span>
      <span class="neo-badge bg-black" style="color: #fff;">HALAMAN {page_num:02d} / {TOTAL_CONTENT_PAGES:02d}</span>
    </div>
  </div>
"""

def enrich_chapter(ch_id, extra_html=""):
    raw_html = ch_map[ch_id]["html"]
    match = re.search(r'(<div class="m-source-box">.*?</div>)', raw_html, re.DOTALL)
    if match:
        source_html = match.group(1)
        content_html = raw_html[:match.start()] + raw_html[match.end():]
    else:
        source_html = ""
        content_html = raw_html
    return content_html.strip() + "\n" + extra_html.strip() + "\n" + source_html.strip()

pages_html = []

# ==============================================================================
# 1. FRONT COVER (SAMPUL DEPAN BUKU - NORMAL PROFESSIONAL BOOK DESIGN)
# ==============================================================================
cover_front_html = f"""
  <div class="page cover-front">
    <div class="cover-header">
      <span class="series-tag">PANDUAN KESEHATAN REMAJA</span>
      <h1 class="book-title">CERDAS MENYIKAPI REPRODUKSI</h1>
      <p class="book-subtitle">Panduan Komprehensif Mengenali Tubuh, Pubertas, Relasi Sehat, dan Perlindungan Diri</p>
    </div>

    <div class="cover-art-container">
      <img class="cover-art-img" src="assets/kespro-book-cover.jpg" alt="Sampul Cerdas Menyikapi Reproduksi">
    </div>

    <div class="cover-footer">
      <div class="author-name" style="font-size: 11.5pt; letter-spacing: 1px;">TIM EDUKASI KESEHATAN REMAJA</div>
      <div class="author-title">Panduan Komprehensif Berbasis Sains &amp; Medis</div>
      <div class="publisher-mark">RUANG TUMBUH REMAJA PRESS</div>
    </div>
  </div>
"""
pages_html.append(cover_front_html)

# ==============================================================================
# 2. INSIDE PAGE 1: PENGANTAR & RINGKASAN EDISI TERPADU (HALAMAN 01 / 35)
# ==============================================================================
p1 = f"""
  <div class="page" style="background-color: #FEF6E4;">
    <div class="page-header">
      <span class="neo-badge bg-yellow">PANDUAN UTAMA</span>
      <span class="neo-badge bg-white">HALAMAN 01 / {TOTAL_CONTENT_PAGES:02d}</span>
    </div>

    <div class="page-body" style="gap: 5.5pt;">
      <div class="neo-card" style="text-align: center; padding: 8pt 9.5pt; background: #fff;">
        <div style="border: 2.2px solid #000; border-radius: 8px; overflow: hidden; margin-bottom: 4.5pt; box-shadow: 3px 3px 0 #000;">
          <img src="assets/intro-welcome.jpg" alt="Selamat Datang di Ruang Tumbuh" style="width: 100%; height: 315pt; object-fit: cover; display: block;">
        </div>
        <div style="display: flex; justify-content: center; gap: 4pt; margin-bottom: 3.5pt;">
          <span class="neo-tag bg-cyan">EDUKASI RESMI KESPRO</span>
          <span class="neo-tag bg-purple">BUKU PANDUAN LENGKAP</span>
        </div>
        <h1 class="font-heading" style="font-size: 17.5pt; line-height: 1.05; text-transform: uppercase; color: #000; margin-bottom: 3.5pt;">
          SEKILAS PANDUAN: RUANG TUMBUH KESPRO SPACE
        </h1>
        <div style="background: #FFE500; border: 2.2px solid #000; box-shadow: 2px 2px 0 #000; border-radius: 6px; padding: 3pt 9pt; display: inline-block; font-family: 'Space Grotesk', sans-serif; font-weight: 900; font-size: 10.5pt; text-transform: uppercase; margin-bottom: 3.5pt;">
          SAHABAT KEDEWASAAN REMAJA INDONESIA
        </div>
        <p style="font-size: 7.8pt; font-weight: 700; color: #222; line-height: 1.32;">
          Panduan Komprehensif Kesehatan Reproduksi Remaja: Bahasa Santai, Ramah, Ilmiah, dan Bebas Tabu!
        </p>
      </div>

      <div class="neo-card bg-black" style="text-align: center; padding: 6pt 9pt; color: #fff;">
        <div style="font-size: 8.5pt; font-weight: 900; text-transform: uppercase; color: #FFE500; letter-spacing: 0.4px;">
          👫 EDISI GABUNGAN: JALUR CEWEK 🙋‍♀️ &amp; COWOK 🙋‍♂️
        </div>
        <div style="font-size: 7.2pt; font-weight: 600; color: #fff; margin-top: 2pt; line-height: 1.3;">
          Menggabungkan seluruh materi anatomi, menstruasi, mimpi basah, relasi sehat, batasan personal (consent), hingga perlindungan dari kekerasan dalam 1 buku utuh.
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4pt;">
        <div class="neo-card-sm bg-purple" style="padding: 5pt 6pt; display: flex; align-items: center; gap: 5pt;">
          <span style="font-size: 14pt;">📖</span>
          <div>
            <div style="font-size: 7.5pt; font-weight: 900; text-transform: uppercase;">30 Bab Lengkap</div>
            <div style="font-size: 6.6pt; font-weight: 600; color: #222;">Fondasi &amp; proteksi diri</div>
          </div>
        </div>
        <div class="neo-card-sm bg-pink" style="padding: 5pt 6pt; display: flex; align-items: center; gap: 5pt;">
          <span style="font-size: 14pt;">🔬</span>
          <div>
            <div style="font-size: 7.5pt; font-weight: 900; text-transform: uppercase; color: #fff;">Anatomi &amp; Pubertas</div>
            <div style="font-size: 6.6pt; font-weight: 600; color: #fff;">Diagram cewek &amp; cowok</div>
          </div>
        </div>
        <div class="neo-card-sm bg-mint" style="padding: 5pt 6pt; display: flex; align-items: center; gap: 5pt;">
          <span style="font-size: 14pt;">🤝</span>
          <div>
            <div style="font-size: 7.5pt; font-weight: 900; text-transform: uppercase;">Relasi &amp; Consent</div>
            <div style="font-size: 6.6pt; font-weight: 600; color: #111;">Batasan diri &amp; hak asasi</div>
          </div>
        </div>
        <div class="neo-card-sm bg-cyan" style="padding: 5pt 6pt; display: flex; align-items: center; gap: 5pt;">
          <span style="font-size: 14pt;">🚨</span>
          <div>
            <div style="font-size: 7.5pt; font-weight: 900; text-transform: uppercase;">Hotline 24 Jam</div>
            <div style="font-size: 6.6pt; font-weight: 600; color: #111;">Konseling darurat PKPR</div>
          </div>
        </div>
      </div>

      <div class="neo-card bg-white" style="padding: 6pt 8pt;">
        <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 3pt; display: flex; align-items: center; gap: 3pt;">
          <span>🎯</span> MENGAPA E-BOOK INI WAJIB KAMU BACA?
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3.5pt; font-size: 6.9pt; font-weight: 700;">
          <div style="background: #FFFDE7; border: 1.5px solid #000; border-radius: 5px; padding: 3.5pt 5pt;">
            🔒 <b>100% Ruang Aman:</b> Bahas organ intim tanpa canggung atau rasa malu.
          </div>
          <div style="background: #E6FCF5; border: 1.5px solid #00E599; border-radius: 5px; padding: 3.5pt 5pt;">
            🔬 <b>Medis &amp; Akurat:</b> Rujukan standar Kemenkes RI, Kemdikbud &amp; WHO.
          </div>
          <div style="background: #F3E8FF; border: 1.5px solid #D4BBFF; border-radius: 5px; padding: 3.5pt 5pt;">
            🛡️ <b>Proteksi Diri:</b> Panduan consent, safety plan, dan UU TPKS.
          </div>
          <div style="background: #FFF0F3; border: 1.5px solid #FF5E7E; border-radius: 5px; padding: 3.5pt 5pt;">
            📱 <b>Khusus HP:</b> Tata letak pas di layar smartphone, nyaman dibaca!
          </div>
        </div>
      </div>

      <div class="neo-card-sm bg-softpink" style="display: flex; justify-content: space-around; align-items: center; padding: 4.5pt 6pt; text-align: center;">
        <span style="font-size: 7pt; font-weight: 900;">🌟 35 Halaman Terpadu</span>
        <span style="font-size: 7pt; font-weight: 900;">•</span>
        <span style="font-size: 7pt; font-weight: 900;">🛡️ Panduan Resmi PKPR</span>
        <span style="font-size: 7pt; font-weight: 900;">•</span>
        <span style="font-size: 7pt; font-weight: 900;">📜 Sertifikat Kelulusan</span>
      </div>

      <div class="neo-card-sm bg-white" style="text-align: center; padding: 5pt 7pt; border-style: dashed;">
        <div style="font-size: 7.6pt; font-weight: 900; text-transform: uppercase; color: #000;">
          🌱 Inisiatif Edukasi: Tim Ruang Tumbuh Remaja
        </div>
        <div style="font-size: 6.6pt; font-weight: 600; color: #555; margin-top: 1.5pt;">
          Rujukan Resmi: Kemenkes RI • Kemdikbudristek • UU TPKS No. 12/2022
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>Ruang Tumbuh Remaja • KESPRO SPACE</span>
      <span class="neo-badge bg-black" style="color: #fff;">HALAMAN 01 / {TOTAL_CONTENT_PAGES:02d}</span>
    </div>
  </div>
"""
pages_html.append(p1)

# ==============================================================================
# 3. PAGE 2: IDENTITAS & RUANG AMAN (HALAMAN 02 / 35)
# ==============================================================================
p2 = f"""
  <div class="page">
    <div class="page-header">
      <span class="neo-badge bg-yellow">PANDUAN PRAKTIS</span>
      <span class="neo-badge bg-white">HALAMAN 02 / {TOTAL_CONTENT_PAGES:02d}</span>
    </div>
    <div>
      <h2 class="font-heading" style="font-size: 16pt; text-transform: uppercase; margin-bottom: 2pt;">
        RUANG AMAN &amp; KOMITMEN DIRI 📖
      </h2>
      <p style="font-size: 7.4pt; font-weight: 600; color: #444;">Jadikan buku ini sahabat terbaik perjalanan kedewasaanmu tanpa beban dan rasa malu!</p>
    </div>

    <div class="page-body" style="gap: 5.5pt;">
      <div class="neo-card bg-white" style="padding: 9pt 11pt;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4.5pt; border-bottom: 1.8px solid #000; padding-bottom: 3.5pt;">
          <span style="font-size: 8.5pt; font-weight: 900; text-transform: uppercase;">📋 KARTU IDENTITAS PEMILIK BUKLET:</span>
          <span class="neo-tag bg-softpink">DATA PRIVAT</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 4pt; font-size: 7.8pt;">
          <div class="neo-box-dashed" style="display: flex; justify-content: space-between; align-items: center; padding: 5.2pt 7.5pt;">
            <span style="font-weight: 800;">Nama Lengkap:</span>
            <span style="color: #666;">...............................................................</span>
          </div>
          <div class="neo-box-dashed" style="display: flex; justify-content: space-between; align-items: center; padding: 5.2pt 7.5pt;">
            <span style="font-weight: 800;">Nama Panggilan:</span>
            <span style="color: #666;">...............................................................</span>
          </div>
          <div style="display: flex; gap: 4pt;">
            <div class="neo-box-dashed" style="flex: 1; display: flex; justify-content: space-between; padding: 5.2pt 7.5pt;">
              <span style="font-weight: 800;">Kelas / Usia:</span>
              <span style="color: #666;">..................</span>
            </div>
            <div class="neo-box-dashed" style="flex: 1; display: flex; justify-content: space-between; padding: 5.2pt 7.5pt;">
              <span style="font-weight: 800;">Tgl Mulai:</span>
              <span style="color: #666;">..../..../202...</span>
            </div>
          </div>
          <div class="neo-box-dashed" style="display: flex; justify-content: space-between; align-items: center; padding: 5.2pt 7.5pt;">
            <span style="font-weight: 800;">Sekolah / Institusi:</span>
            <span style="color: #666;">...................................................</span>
          </div>
          <div class="neo-box-dashed" style="display: flex; justify-content: space-between; align-items: center; padding: 5.2pt 7.5pt;">
            <span style="font-weight: 800;">Kontak Teman Curhat / Sahabat:</span>
            <span style="color: #666;">.......................................</span>
          </div>
          <div class="neo-box-dashed" style="display: flex; justify-content: space-between; align-items: center; padding: 5.2pt 7.5pt;">
            <span style="font-weight: 800;">Motto Hidup / Kalimat Semangat:</span>
            <span style="color: #666;">.......................................</span>
          </div>
          <div class="neo-box-dashed" style="display: flex; justify-content: space-between; align-items: center; padding: 5.2pt 7.5pt;">
            <span style="font-weight: 800;">Target Cita-Cita &amp; Karirku:</span>
            <span style="color: #666;">.......................................</span>
          </div>
        </div>
      </div>

      <div class="neo-card-sm bg-white" style="padding: 6.5pt 8.5pt;">
        <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 3pt;">
          💡 4 CARA TERBAIK MENIKMATI BUKLET INI:
        </div>
        <div style="display: flex; flex-direction: column; gap: 2.8pt; font-size: 7.2pt; line-height: 1.34;">
          <div style="border-left: 3.5px solid #FFE500; padding-left: 5pt;">
            <strong>1. Teman Ngobrol Santai:</strong> Baca bab yang sedang relevan bagimu. Ambil jeda kapan pun kamu butuh.
          </div>
          <div style="border-left: 3.5px solid #00E599; padding-left: 5pt;">
            <strong>2. Edisi Terpadu Cewek &amp; Cowok:</strong> Remaja putri &amp; putra saling memahami secara biologis dan berempati.
          </div>
          <div style="border-left: 3.5px solid #00F0FF; padding-left: 5pt;">
            <strong>3. Ruang Bebas Tabu:</strong> Kesehatan reproduksi itu ilmu medis yang wajar dan hak setiap remaja dipahami benar.
          </div>
          <div style="border-left: 3.5px solid #FF5E7E; padding-left: 5pt;">
            <strong>4. Jangan Ragu Bertanya:</strong> Diskusikan dengan orang tua, guru BK, atau petugas medis PKPR di Puskesmas.
          </div>
        </div>
      </div>

      <div class="neo-card bg-cream" style="padding: 6pt 8pt;">
        <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 3pt; display: flex; justify-content: space-between; align-items: center;">
          <span>🎯 4 TARGET PEMAHAMANKU:</span>
          <span class="neo-tag bg-mint">MILESTONE</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 2.8pt; font-size: 7.1pt; font-weight: 700;">
          <div style="background: #fff; border: 1.5px solid #000; border-radius: 5px; padding: 3.5pt 5.5pt;">
            ☑️ Memahami proses biologis pubertas cewek &amp; cowok secara percaya diri
          </div>
          <div style="background: #fff; border: 1.5px solid #000; border-radius: 5px; padding: 3.5pt 5.5pt;">
            ☑️ Menguasai batasan personal (*consent*) &amp; berani menolak tekanan negatif
          </div>
          <div style="background: #fff; border: 1.5px solid #000; border-radius: 5px; padding: 3.5pt 5.5pt;">
            ☑️ Mengetahui cara merawat kebersihan organ reproduksi &amp; gizi pubertas
          </div>
          <div style="background: #fff; border: 1.5px solid #000; border-radius: 5px; padding: 3.5pt 5.5pt;">
            ☑️ Memahami hak perlindungan hukum UU TPKS &amp; akses Puskesmas PKPR gratis
          </div>
        </div>
      </div>

      <div class="neo-card bg-white" style="border-style: dashed; padding: 6.5pt 8.5pt;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3pt;">
          <span style="font-size: 8pt; font-weight: 900; text-transform: uppercase;">✨ JANJI DENGAN DIRIKU SENDIRI:</span>
          <span class="neo-tag bg-yellow">KOMITMEN</span>
        </div>
        <p style="font-size: 7.3pt; font-weight: 600; line-height: 1.35; color: #222; margin-bottom: 4pt;">
          “Hari ini aku memilih untuk menghargai dan merawat tubuhku. Aku berhak mendapatkan informasi kesehatan reproduksi yang benar, ilmiah, dan bertanggung jawab. Aku berani menjaga batasan diri dan siap mencari bantuan tepercaya saat membutuhkan perlindungan.”
        </p>
        <div style="display: flex; flex-direction: column; gap: 2.5pt; font-size: 6.9pt; font-weight: 700; margin-bottom: 4pt;">
          <div style="background: #FFFDF0; border: 1px solid #FFE500; border-radius: 4px; padding: 2.5pt 5pt;">
            [ ✔ ] Aku berjanji menyayangi tubuhku dan menolak tekanan yang melanggar batasanku.
          </div>
          <div style="background: #FFFDF0; border: 1px solid #FFE500; border-radius: 4px; padding: 2.5pt 5pt;">
            [ ✔ ] Aku siap mencari bantuan profesional medis/guru BK jika menghadapi situasi darurat.
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 7.3pt; font-weight: 800; border-top: 1px dashed #aaa; padding-top: 4pt;">
          <span>Tanda Tangan Komitmen:</span>
          <span style="border-bottom: 1.5px solid #000; width: 110pt; display: inline-block;"></span>
        </div>
      </div>

      <div class="neo-card-sm bg-yellow" style="padding: 5.5pt 7.5pt;">
        <div style="font-size: 7.3pt; font-weight: 800; color: #111; line-height: 1.34;">
          💌 <b>Pesan Hangat Redaksi:</b> "Masa remaja adalah fase transisi paling menakjubkan dalam hidupmu. Kamu tidak sendirian. Jadikan buku ini pegangan terpercaya saat kamu ragu. Rawat tubuhmu, sayangi masa depanmu!"
        </div>
      </div>

      <div class="neo-card-sm bg-white" style="border: 1.8px dashed #FF5E7E; padding: 5pt 7pt;">
        <div style="display: flex; align-items: center; gap: 3.5pt; margin-bottom: 1.5pt;">
          <span class="neo-tag bg-pink">⚠️ DISCLAIMER RESMI</span>
          <span style="font-size: 7.2pt; font-weight: 900; text-transform: uppercase;">EDUKASI &amp; RUJUKAN MEDIS</span>
        </div>
        <p style="font-size: 7pt; font-weight: 600; line-height: 1.3; color: #333;">
          Buku ini adalah sarana edukasi mandiri, bukan pengganti diagnosis medis dokter. Jika merasakan keluhan nyeri atau infeksi, segera periksakan ke Puskesmas PKPR terdekat atau hubungi hotline Kemenkes <strong>119 ext. 8</strong>.
        </p>
      </div>
    </div>

    <div class="page-footer">
      <span>Ruang Tumbuh Remaja • KESPRO SPACE</span>
      <span class="neo-badge bg-black" style="color: #fff;">HALAMAN 02 / {TOTAL_CONTENT_PAGES:02d}</span>
    </div>
  </div>
"""
pages_html.append(p2)

# ==============================================================================
# 4. PAGE 3: DAFTAR ISI PILAR 1 (HALAMAN 03 / 35)
# ==============================================================================
p3 = f"""
  <div class="page">
    <div class="page-header">
      <span class="neo-badge bg-mint">PETA NAVIGASI BUKLET</span>
      <span class="neo-badge bg-white">HALAMAN 03 / {TOTAL_CONTENT_PAGES:02d}</span>
    </div>
    <div>
      <h2 class="font-heading" style="font-size: 16pt; text-transform: uppercase; margin-bottom: 2pt;">
        DAFTAR ISI: PILAR 1 🌱
      </h2>
      <p style="font-size: 7.4pt; font-weight: 600; color: #444;">Fondasi Tubuh, Perkembangan Pubertas &amp; Relasi Sehat (Bab 01–16)</p>
    </div>

    <div class="page-body" style="gap: 5pt;">
      <div class="neo-card bg-yellow" style="padding: 6pt 8.5pt;">
        <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase;">
          ✨ PANDUAN TERPADU CEWEK &amp; COWOK (14 TOPIK FONDASI)
        </div>
        <div style="font-size: 7.2pt; font-weight: 600; color: #222; margin-top: 1.5pt;">
          Pelajari bagaimana tubuhmu bertumbuh pesat, pahami batasan personal (*consent*), dan rawat organ biologis secara sehat.
        </div>
      </div>

      <div style="font-size: 7.2pt; font-weight: 900; text-transform: uppercase; color: #2B8A3E;">
        🌱 KELOMPOK A: MENGENAL DIRI &amp; FASE PERUBAHAN
      </div>
      <div style="display: flex; flex-direction: column; gap: 3.5pt; font-size: 7.5pt;">
        <div class="neo-card-sm" style="display: flex; justify-content: space-between; align-items: center; padding: 5.5pt 8.5pt;">
          <span style="font-weight: 800;">01. ✨ Tentang Buklet Ini (Pengantar &amp; Panduan)</span>
          <span class="neo-tag bg-yellow">Hal 05</span>
        </div>
        <div class="neo-card-sm" style="display: flex; justify-content: space-between; align-items: center; padding: 5.5pt 8.5pt;">
          <span style="font-weight: 800;">03. 💡 Apaan Sih Sebenarnya Kesehatan Reproduksi Itu?</span>
          <span class="neo-tag bg-yellow">Hal 06</span>
        </div>
        <div class="neo-card-sm" style="display: flex; justify-content: space-between; align-items: center; padding: 5.5pt 8.5pt;">
          <span style="font-weight: 800;">04. 🌱 Masa Remaja: Saat Banyak Hal Mulai Berubah</span>
          <span class="neo-tag bg-yellow">Hal 07</span>
        </div>
        <div class="neo-card-sm" style="display: flex; justify-content: space-between; align-items: center; padding: 5.5pt 8.5pt;">
          <span style="font-weight: 800;">05. 🧭 Prinsip &amp; Nilai Diri: Kompas Menentukan Pilihan</span>
          <span class="neo-tag bg-yellow">Hal 08</span>
        </div>
        <div class="neo-card-sm" style="display: flex; justify-content: space-between; align-items: center; padding: 5.5pt 8.5pt;">
          <span style="font-weight: 800;">06. 🪞 Bangun Konsep Diri yang Sehat &amp; Positif</span>
          <span class="neo-tag bg-yellow">Hal 09</span>
        </div>
      </div>

      <div style="font-size: 7.2pt; font-weight: 900; text-transform: uppercase; color: #1D4ED8;">
        🛡️ KELOMPOK B: BATASAN PERSONAL &amp; RELASI SEHAT
      </div>
      <div style="display: flex; flex-direction: column; gap: 3.5pt; font-size: 7.5pt;">
        <div class="neo-card-sm" style="display: flex; justify-content: space-between; align-items: center; padding: 5.5pt 8.5pt;">
          <span style="font-weight: 800;">07. 🛑 Tubuhmu Punya Batasan (Personal Boundaries)</span>
          <span class="neo-tag bg-yellow">Hal 10</span>
        </div>
        <div class="neo-card-sm" style="display: flex; justify-content: space-between; align-items: center; padding: 5.5pt 8.5pt;">
          <span style="font-weight: 800;">08. 🤝 Pahami Soal "Consent" (Persetujuan Bersama)</span>
          <span class="neo-tag bg-yellow">Hal 11</span>
        </div>
        <div class="neo-card-sm" style="display: flex; justify-content: space-between; align-items: center; padding: 5.5pt 8.5pt;">
          <span style="font-weight: 800;">09. 💚 Relasi yang Sehat Itu Bikin Nyaman &amp; Aman</span>
          <span class="neo-tag bg-yellow">Hal 12</span>
        </div>
        <div class="neo-card-sm" style="display: flex; justify-content: space-between; align-items: center; padding: 5.5pt 8.5pt;">
          <span style="font-weight: 800;">10. 🗣️ Cara Ngobrol Asik &amp; Asertif Biar Nggak Salah</span>
          <span class="neo-tag bg-yellow">Hal 13</span>
        </div>
      </div>

      <div style="font-size: 7.2pt; font-weight: 900; text-transform: uppercase; color: #B45309;">
        🔬 KELOMPOK C: BIOLOGI PUBERTAS &amp; ANATOMI LENGKAP
      </div>
      <div style="display: flex; flex-direction: column; gap: 3.5pt; font-size: 7.5pt;">
        <div class="neo-card-sm" style="display: flex; justify-content: space-between; align-items: center; padding: 5.5pt 8.5pt;">
          <span style="font-weight: 800;">11. 🚀 Pubertas: Tenang, Tubuhmu Lagi "Level Up"</span>
          <span class="neo-tag bg-yellow">Hal 14</span>
        </div>
        <div class="neo-card-sm" style="display: flex; justify-content: space-between; align-items: center; padding: 5.5pt 8.5pt;">
          <span style="font-weight: 800;">12. 🚻 Perubahan Khas pada Cewek dan Cowok</span>
          <span class="neo-tag bg-yellow">Hal 15</span>
        </div>
        <div class="neo-card-sm bg-pink" style="display: flex; justify-content: space-between; align-items: center; padding: 5.5pt 8.5pt;">
          <span style="font-weight: 900; color: #fff;">13A. 🌸 Anatomi Sistem Reproduksi Perempuan</span>
          <span class="neo-tag bg-white" style="color: #000;">Hal 16</span>
        </div>
        <div class="neo-card-sm bg-cyan" style="display: flex; justify-content: space-between; align-items: center; padding: 5.5pt 8.5pt;">
          <span style="font-weight: 900; color: #000;">13B. 💧 Anatomi Sistem Reproduksi Laki-Laki</span>
          <span class="neo-tag bg-white" style="color: #000;">Hal 17</span>
        </div>
        <div class="neo-card-sm bg-pink" style="display: flex; justify-content: space-between; align-items: center; padding: 5.5pt 8.5pt;">
          <span style="font-weight: 900; color: #fff;">14. 🩸 Menstruasi Itu Alami, Nggak Perlu Malu!</span>
          <span class="neo-tag bg-white" style="color: #000;">Hal 18</span>
        </div>
        <div class="neo-card-sm" style="display: flex; justify-content: space-between; align-items: center; padding: 5.5pt 8.5pt;">
          <span style="font-weight: 800;">15. 💧 Mimpi Basah: Hal yang Normal &amp; Alami</span>
          <span class="neo-tag bg-yellow">Hal 19</span>
        </div>
        <div class="neo-card-sm" style="display: flex; justify-content: space-between; align-items: center; padding: 5.5pt 8.5pt;">
          <span style="font-weight: 800;">16. 🥗 Rawat Tubuhmu: Jaga Kebersihan &amp; Gizi</span>
          <span class="neo-tag bg-yellow">Hal 20</span>
        </div>
      </div>

      <div class="neo-card bg-white" style="padding: 6.5pt 8.5pt; border-left: 5px solid #00E599;">
        <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2.5pt; display: flex; align-items: center; gap: 3pt;">
          <span>🌱</span> FOKUS PEMBELAJARAN PILAR 1:
        </div>
        <div style="font-size: 7.2pt; font-weight: 600; line-height: 1.35; color: #222;">
          Membekalimu pemahaman biologis pubertas cewek &amp; cowok, anatomi reproduksi akurat, serta keterampilan menjaga batasan pribadi (*consent*).
        </div>
        <div style="margin-top: 3.5pt; padding-top: 2.5pt; border-top: 1px dashed #ccc; font-size: 6.8pt; font-weight: 700; color: #111;">
          🎯 <b>Tips:</b> Beri tanda centang [✔] pada setiap bab yang telah kamu tuntaskan untuk melacak pemahamanmu!
        </div>
      </div>

      <div class="neo-card-sm bg-mint" style="display: flex; justify-content: space-between; align-items: center; padding: 5.5pt 8.5pt;">
        <span style="font-size: 7.6pt; font-weight: 800;">Lanjut ke Pilar 2: Perlindungan Diri &amp; Keamanan</span>
        <span class="neo-tag bg-white" style="color: #000;">Halaman 04 ➔</span>
      </div>
    </div>

    <div class="page-footer">
      <span>Ruang Tumbuh Remaja • KESPRO SPACE</span>
      <span class="neo-badge bg-black" style="color: #fff;">HALAMAN 03 / {TOTAL_CONTENT_PAGES:02d}</span>
    </div>
  </div>
"""
pages_html.append(p3)

# ==============================================================================
# 5. PAGE 4: DAFTAR ISI PILAR 2 (HALAMAN 04 / 35)
# ==============================================================================
p4 = f"""
  <div class="page">
    <div class="page-header">
      <span class="neo-badge bg-purple">PETA NAVIGASI BUKLET</span>
      <span class="neo-badge bg-white">HALAMAN 04 / {TOTAL_CONTENT_PAGES:02d}</span>
    </div>
    <div>
      <h2 class="font-heading" style="font-size: 16pt; text-transform: uppercase; margin-bottom: 2pt;">
        DAFTAR ISI: PILAR 2 🛡️
      </h2>
      <p style="font-size: 7.4pt; font-weight: 600; color: #444;">Perlindungan Diri, Hukum, Ruang Digital &amp; Akses Bantuan (Bab 17–30)</p>
    </div>

    <div class="page-body" style="gap: 5pt;">
      <div class="neo-card bg-purple" style="padding: 6pt 8.5pt;">
        <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase;">
          🛡️ PANDUAN PROTEKSI DIRI, HUKUM &amp; KESELAMATAN (14 TOPIK KUNCI)
        </div>
        <div style="font-size: 7.2pt; font-weight: 600; color: #222; margin-top: 1.5pt;">
          Keterampilan hidup (*life skills*) menghadapi risiko: kehamilan dini, IMS, kekerasan seksual (UU TPKS), keamanan digital, dan safety plan.
        </div>
      </div>

      <div style="font-size: 7.2pt; font-weight: 900; text-transform: uppercase; color: #BE185D;">
        🤰 KELOMPOK D: REPRODUKSI &amp; RISIKO MEDIS
      </div>
      <div style="display: flex; flex-direction: column; gap: 3.5pt; font-size: 7.5pt;">
        <div class="neo-card-sm" style="display: flex; justify-content: space-between; align-items: center; padding: 5.5pt 8.5pt;">
          <span style="font-weight: 800;">17. 🤰 Bagaimana Kehamilan Terjadi &amp; Kenapa Perlu Paham?</span>
          <span class="neo-tag bg-yellow">Hal 21</span>
        </div>
        <div class="neo-card-sm" style="display: flex; justify-content: space-between; align-items: center; padding: 5.5pt 8.5pt;">
          <span style="font-weight: 800;">18. 🛡️ Menjaga Diri: Cegah Kehamilan Tak Direncanakan</span>
          <span class="neo-tag bg-yellow">Hal 22</span>
        </div>
        <div class="neo-card-sm" style="display: flex; justify-content: space-between; align-items: center; padding: 5.5pt 8.5pt;">
          <span style="font-weight: 800;">19. ⚠️ Waspada Infeksi Menular Seksual (IMS)</span>
          <span class="neo-tag bg-yellow">Hal 23</span>
        </div>
        <div class="neo-card-sm" style="display: flex; justify-content: space-between; align-items: center; padding: 5.5pt 8.5pt;">
          <span style="font-weight: 800;">20. 🎗️ Fakta Nyata HIV &amp; AIDS: Kenali Faktanya!</span>
          <span class="neo-tag bg-yellow">Hal 24</span>
        </div>
      </div>

      <div style="font-size: 7.2pt; font-weight: 900; text-transform: uppercase; color: #6D28D9;">
        ⚖️ KELOMPOK E: KESETARAAN, ANTI-STIGMA &amp; KESELAMATAN
      </div>
      <div style="display: flex; flex-direction: column; gap: 3.5pt; font-size: 7.5pt;">
        <div class="neo-card-sm" style="display: flex; justify-content: space-between; align-items: center; padding: 5.5pt 8.5pt;">
          <span style="font-weight: 800;">21. 🤝 Stop Stigma &amp; Diskriminasi: Rangkul ODHIV!</span>
          <span class="neo-tag bg-yellow">Hal 25</span>
        </div>
        <div class="neo-card-sm" style="display: flex; justify-content: space-between; align-items: center; padding: 5.5pt 8.5pt;">
          <span style="font-weight: 800;">22. ⚖️ Memahami Beda "Seks" dan "Gender"</span>
          <span class="neo-tag bg-yellow">Hal 26</span>
        </div>
        <div class="neo-card-sm" style="display: flex; justify-content: space-between; align-items: center; padding: 5.5pt 8.5pt;">
          <span style="font-weight: 800;">23. 🛑 Ingat: Kekerasan BUKAN Salah Korban! (TPKS)</span>
          <span class="neo-tag bg-yellow">Hal 27</span>
        </div>
        <div class="neo-card-sm" style="display: flex; justify-content: space-between; align-items: center; padding: 5.5pt 8.5pt;">
          <span style="font-weight: 800;">24. 📋 Bikin "Safety Plan" (Rencana Keselamatan Diri)</span>
          <span class="neo-tag bg-yellow">Hal 28</span>
        </div>
        <div class="neo-card-sm" style="display: flex; justify-content: space-between; align-items: center; padding: 5.5pt 8.5pt;">
          <span style="font-weight: 800;">25. 🧘 Hadapi Bullying &amp; Pintar Mengelola Emosi</span>
          <span class="neo-tag bg-yellow">Hal 29</span>
        </div>
      </div>

      <div style="font-size: 7.2pt; font-weight: 900; text-transform: uppercase; color: #0E7490;">
        📱 KELOMPOK F: DUNIA DIGITAL, NAPZA &amp; LAYANAN BANTUAN
      </div>
      <div style="display: flex; flex-direction: column; gap: 3.5pt; font-size: 7.5pt;">
        <div class="neo-card-sm" style="display: flex; justify-content: space-between; align-items: center; padding: 5.5pt 8.5pt;">
          <span style="font-weight: 800;">26. 📱 Smart &amp; Safe: Menjaga Diri di Ruang Digital</span>
          <span class="neo-tag bg-yellow">Hal 30</span>
        </div>
        <div class="neo-card-sm" style="display: flex; justify-content: space-between; align-items: center; padding: 5.5pt 8.5pt;">
          <span style="font-weight: 800;">27. 🚫 Waspada NAPZA: Lindungi Pikiran &amp; Masa Depan</span>
          <span class="neo-tag bg-yellow">Hal 31</span>
        </div>
        <div class="neo-card-sm" style="display: flex; justify-content: space-between; align-items: center; padding: 5.5pt 8.5pt;">
          <span style="font-weight: 800;">28. 🏥 Kamu Nggak Sendirian: Akses PKPR &amp; BK</span>
          <span class="neo-tag bg-yellow">Hal 32</span>
        </div>
        <div class="neo-card-sm" style="display: flex; justify-content: space-between; align-items: center; padding: 5.5pt 8.5pt;">
          <span style="font-weight: 800;">29. 🤝 Menjadi Sosok Pendamping yang Menenangkan</span>
          <span class="neo-tag bg-yellow">Hal 33</span>
        </div>
        <div class="neo-card-sm" style="display: flex; justify-content: space-between; align-items: center; padding: 5.5pt 8.5pt;">
          <span style="font-weight: 800;">30. 📚 Sumber Materi &amp; Rujukan Resmi Kemenkes RI</span>
          <span class="neo-tag bg-yellow">Hal 34</span>
        </div>
        <div class="neo-card-sm bg-mint" style="display: flex; justify-content: space-between; align-items: center; padding: 5.5pt 8.5pt;">
          <span style="font-weight: 900; color: #000;">🚨 Lembar Kelulusan &amp; Direktori Hotline Darurat</span>
          <span class="neo-tag bg-white" style="color: #000;">Hal 35</span>
        </div>
      </div>

      <div class="neo-card bg-yellow" style="padding: 6.5pt 8.5pt;">
        <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2.5pt; display: flex; align-items: center; gap: 3pt;">
          <span>🏆</span> ROADMAP PEMBELAJARAN LENGKAP KESPRO:
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4pt; font-size: 7pt; font-weight: 700;">
          <div style="background: #fff; border: 1.2px solid #000; border-radius: 5px; padding: 3pt 5pt;">
            🌱 <b>Tahap 1 (Hal 05–20):</b> Pahami anatomi tubuh, siklus haid, mimpi basah &amp; consent.
          </div>
          <div style="background: #fff; border: 1.2px solid #000; border-radius: 5px; padding: 3pt 5pt;">
            🛡️ <b>Tahap 2 (Hal 21–34):</b> Benteng diri dari risiko IMS, kejahatan siber &amp; hukum TPKS.
          </div>
        </div>
        <div style="font-size: 6.9pt; font-weight: 800; color: #111; margin-top: 3pt; text-align: center;">
          📜 Tuntaskan seluruh bab untuk mengisi Piagam Kelulusan Resmi di Halaman 35!
        </div>
      </div>

      <!-- 3 Quick Access Guidelines -->
      <div class="neo-card bg-white" style="padding: 6.5pt 8.5pt; border-left: 5px solid #00F0FF;">
        <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2.5pt;">
          💡 PANDUAN PENGGUNAAN RUJUKAN RESMI:
        </div>
        <div style="display: flex; flex-direction: column; gap: 2pt; font-size: 7pt; line-height: 1.32; color: #222;">
          <div>• <b>Butuh Perlindungan Kekerasan:</b> Buka <b>Bab 23 &amp; 24</b> (Hak Korban UU TPKS &amp; Safety Plan).</div>
          <div>• <b>Layanan Kesehatan Remaja Gratis:</b> Kunjungi Poli PKPR Puskesmas terdekat (<b>Bab 28</b>).</div>
          <div>• <b>Konseling Darurat 24 Jam:</b> Hubungi Hotline Kemenkes 119 ext. 8 atau SAPPA 129 (<b>Hal 35</b>).</div>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>Ruang Tumbuh Remaja • KESPRO SPACE</span>
      <span class="neo-badge bg-black" style="color: #fff;">HALAMAN 04 / {TOTAL_CONTENT_PAGES:02d}</span>
    </div>
  </div>
"""
pages_html.append(p4)

# ==============================================================================
# 6. CHAPTER PAGES 05 TO 34 (BAB 01 S/D 30)
# ==============================================================================

# BAB 01 (Page 05)
b1_extra = """
<div class="neo-card bg-white" style="padding: 6pt 8pt; border-left: 4.5px solid #00E599;">
  <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2.5pt;">
    💡 KENAPA EDUKASI KESPRO BUKAN HAL TABU?
  </div>
  <div style="font-size: 7.2pt; font-weight: 600; line-height: 1.34; color: #222;">
    Kesehatan reproduksi adalah bagian alami dari sains biologi dan kesehatan tubuh manusia. Memahami tubuh sendiri sejak dini justru melindungi kita dari salah pergaulan, infeksi berbahaya, kehamilan dini, dan rasa cemas berlebihan.
  </div>
</div>
<div class="neo-card bg-cream" style="padding: 6pt 8pt;">
  <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2.5pt; display: flex; align-items: center; gap: 3pt;">
    <span>🤝</span> 3 ATURAN UTAMA DI RUANG AMAN KESPRO SPACE:
  </div>
  <div style="display: flex; flex-direction: column; gap: 2.5pt; font-size: 7.1pt; font-weight: 700;">
    <div>1. <b>Zero Penghakiman:</b> Tidak ada pertanyaan memalukan seputar tubuh dan pubertas.</div>
    <div>2. <b>Akurat &amp; Medis:</b> Seluruh materi diverifikasi dokter mengacu rujukan Kemenkes RI &amp; WHO.</div>
    <div>3. <b>Hormati Batasan Pribadi:</b> Membekalimu keterampilan melindungi diri dan menghargai sesama.</div>
  </div>
</div>
"""
pages_html.append(make_chapter_page(5, 1, custom_body_html=enrich_chapter(1, b1_extra)))

# BAB 03 (Page 06)
b3_extra = """
<div class="neo-card bg-white" style="padding: 6.5pt 8.5pt;">
  <div style="font-size: 8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 3.5pt; display: flex; align-items: center; gap: 3pt;">
    <span>⚖️</span> 3 MITOS VS FAKTA POPULER KESPRO:
  </div>
  <div style="display: flex; flex-direction: column; gap: 3.5pt; font-size: 7.1pt; font-weight: 600;">
    <div style="background: #FFFDE7; border: 1.5px solid #000; border-radius: 5px; padding: 3.5pt 5.5pt;">
      ❌ <b>Mitos:</b> "Bicara organ reproduksi itu memalukan dan tabu."<br>
      ✅ <b>Fakta Medis:</b> Reproduksi adalah sains biologi resmi demi kesehatan dan perlindungan diri.
    </div>
    <div style="background: #E6FCF5; border: 1.5px solid #000; border-radius: 5px; padding: 3.5pt 5.5pt;">
      ❌ <b>Mitos:</b> "Remaja belum perlu tahu batasan seksualitas."<br>
      ✅ <b>Fakta Medis:</b> Riset WHO membuktikan pemahaman dini menurunkan perilaku berisiko hingga 70%!
    </div>
    <div style="background: #F3E8FF; border: 1.5px solid #000; border-radius: 5px; padding: 3.5pt 5.5pt;">
      ❌ <b>Mitos:</b> "Keluhan organ reproduksi bisa sembuh sendiri."<br>
      ✅ <b>Fakta Medis:</b> Gejala nyeri atau keputihan abnormal wajib diperiksakan ke dokter Puskesmas PKPR.
    </div>
  </div>
</div>
"""
pages_html.append(make_chapter_page(6, 3, custom_body_html=enrich_chapter(3, b3_extra)))

# BAB 04 (Page 07)
b4_extra = """
<div class="neo-card bg-white" style="padding: 6pt 8pt;">
  <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 3pt; display: flex; align-items: center; gap: 3pt;">
    <span>🔄</span> 4 POLA PIKIR SEHAT MENGHADAPI PERUBAHAN REMAJA:
  </div>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3.5pt; font-size: 6.8pt; font-weight: 700;">
    <div style="background: #FFFDE7; border: 1.5px solid #000; border-radius: 5px; padding: 3.5pt 5pt;">
      🌸 <b>Terima Dirimu:</b> Tubuhmu unik, jangan bandingkan dengan foto editan di medsos.
    </div>
    <div style="background: #E6FCF5; border: 1.5px solid #000; border-radius: 5px; padding: 3.5pt 5pt;">
      ⚡ <b>Emosi Wajar:</b> Naik-turun suasana hati adalah efek alami lonjakan hormon.
    </div>
    <div style="background: #F3E8FF; border: 1.5px solid #000; border-radius: 5px; padding: 3.5pt 5pt;">
      🗣️ <b>Terbuka Curhat:</b> Cari teman cerita yang positif dan orang dewasa tepercaya.
    </div>
    <div style="background: #FFF0F3; border: 1.5px solid #000; border-radius: 5px; padding: 3.5pt 5pt;">
      🛡️ <b>Circle Positif:</b> Bertemanlah dengan sahabat yang saling menghargai batasan.
    </div>
  </div>
</div>
"""
pages_html.append(make_chapter_page(7, 4, custom_body_html=enrich_chapter(4, b4_extra)))

# BAB 05 (Page 08) - Rich text chapter
b5_extra = """
<div class="neo-card bg-white" style="padding: 6pt 8.5pt;">
  <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 3pt; display: flex; align-items: center; gap: 3pt;">
    <span>🧭</span> 4 KOMPAS NILAI PRIBADI UNTUK MENJAGA DIRI:
  </div>
  <div style="display: flex; flex-direction: column; gap: 2.8pt; font-size: 7.1pt; font-weight: 700;">
    <div style="background: #FFFDE7; border: 1.5px solid #000; border-radius: 5px; padding: 3pt 5.5pt;">
      💎 <b>Integritas Tubuh:</b> Tubuhku milikku sepenuhnya, bukan obyek kepuasan orang lain.
    </div>
    <div style="background: #E6FCF5; border: 1.5px solid #000; border-radius: 5px; padding: 3pt 5.5pt;">
      ⚖️ <b>Tanggung Jawab:</b> Pikirkan akibat jangka panjang sebelum membuat keputusan besar.
    </div>
    <div style="background: #F3E8FF; border: 1.5px solid #000; border-radius: 5px; padding: 3pt 5.5pt;">
      🛡️ <b>Berani Bilang "TIDAK":</b> Menolak ajakan pacar/teman bukan berarti jahat, itu batasanku.
    </div>
    <div style="background: #FFF0F3; border: 1.5px solid #000; border-radius: 5px; padding: 3pt 5.5pt;">
      🎯 <b>Fokus Masa Depan:</b> Raih cita-cita dan jaga nama baik diri serta keluarga.
    </div>
  </div>
</div>
<div class="neo-card bg-cream" style="padding: 5.5pt 8pt;">
  <div style="font-size: 7.6pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2pt; display: flex; align-items: center; gap: 3pt;">
    <span>📝</span> KUIS REFLEKSI DIRI CEPAT:
  </div>
  <div style="font-size: 7pt; font-weight: 600; line-height: 1.32; color: #222;">
    Bayangkan seorang teman memaksamu melakukan hal yang melanggar prinsip moralmu. Apa respon terbaikmu?
  </div>
  <div style="display: flex; flex-direction: column; gap: 2pt; font-size: 6.9pt; font-weight: 700; margin-top: 2.5pt;">
    <div style="background: #FFFDE7; border: 1.2px solid #000; border-radius: 4px; padding: 2.5pt 5pt;">
      [A] Diam saja dan ikut terpaksa karena takut dijauhi dari kelompok.
    </div>
    <div style="background: #E6FCF5; border: 1.2px solid #00E599; border-radius: 4px; padding: 2.5pt 5pt;">
      [B] Berani menolak tegas dengan sopan dan menjaga integritas diri. ✅ (Pilihan Cerdas!)
    </div>
  </div>
</div>
<div class="neo-card-sm bg-yellow" style="padding: 5pt 7pt;">
  <div style="font-size: 7.2pt; font-weight: 800; color: #111; line-height: 1.32;">
    💡 <b>Filter 3 Detik:</b> Tanyakan hatimu: <em>"Apakah ini aman? Apakah aku ikhlas tanpa paksaan? Apakah aku bangga menceritakannya ke orang tuaku?"</em>
  </div>
</div>
"""
pages_html.append(make_chapter_page(8, 5, custom_body_html=enrich_chapter(5, b5_extra)))

# BAB 06 (Page 09)
b6_extra = """
<div class="neo-card bg-white" style="padding: 6pt 8pt;">
  <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 3pt; display: flex; align-items: center; gap: 3pt;">
    <span>🌱</span> 4 PILAR MEMBANGUN RASA PERCAYA DIRI (SELF-ESTEEM):
  </div>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3.5pt; font-size: 6.9pt; font-weight: 700;">
    <div style="background: #FFFDE7; border: 1.5px solid #000; border-radius: 5px; padding: 3pt 4.5pt;">
      1. <b>Self-Acceptance:</b> Cintai warna kulit, tinggi badan, dan tipe rambut alamimu.
    </div>
    <div style="background: #E6FCF5; border: 1.5px solid #000; border-radius: 5px; padding: 3pt 4.5pt;">
      2. <b>Self-Compassion:</b> Jangan mencela diri saat berbuat keliru, belajar dan perbaiki.
    </div>
    <div style="background: #F3E8FF; border: 1.5px solid #000; border-radius: 5px; padding: 3pt 4.5pt;">
      3. <b>Positive Affirmation:</b> Ingatkan dirimu: "Aku berharga, cerdas, dan berdaya!"
    </div>
    <div style="background: #FFF0F3; border: 1.5px solid #000; border-radius: 5px; padding: 3pt 4.5pt;">
      4. <b>Lawan Body Shaming:</b> Abaikan komentar toxic teman, nilai dirimu bukan dari fisik!
    </div>
  </div>
</div>
<div class="neo-card bg-cream" style="padding: 5.5pt 8pt;">
  <div style="font-size: 7.6pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2.5pt; display: flex; align-items: center; gap: 3pt;">
    <span>📱</span> 3 LANGKAH DETOKS MEDIA SOSIAL &amp; ANTI-INSECURE:
  </div>
  <div style="display: flex; flex-direction: column; gap: 2pt; font-size: 7pt; font-weight: 600; line-height: 1.32;">
    <div>• Unfollow akun-akun yang membuatmu insecure atau membandingkan standar fisik fiktif.</div>
    <div>• Ingat bahwa 90% konten media sosial memakai filter, pencahayaan khusus, dan sudut editan.</div>
    <div>• Perbanyak interaksi nyata dengan keluarga, sahabat positif, dan eksplorasi karya kreatifmu.</div>
  </div>
</div>
<div class="neo-card-sm bg-yellow" style="padding: 5pt 7pt;">
  <div style="font-size: 7.2pt; font-weight: 800; color: #111;">
    ✨ <b>Afirmasi Harian:</b> "Tubuhku sehat, pikiranku berkembang, dan masa depanku penuh harapan yang cemerlang!"
  </div>
</div>
"""
pages_html.append(make_chapter_page(9, 6, custom_body_html=enrich_chapter(6, b6_extra)))

# BAB 07 (Page 10)
b7_extra = """
<div class="neo-card bg-cream" style="padding: 6pt 8pt;">
  <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 3pt; display: flex; align-items: center; gap: 3pt;">
    <span>🚦</span> SISTEM LAMPU LALU LINTAS BATASAN TUBUH:
  </div>
  <div style="display: flex; flex-direction: column; gap: 3pt; font-size: 7.1pt; font-weight: 700;">
    <div style="background: #E6FCF5; border: 1.5px solid #00E599; border-radius: 5px; padding: 3pt 5.5pt;">
      🟢 <b>Hijau (Aman):</b> Salaman, tos tangan, pelukan hangat dari orang tua tercinta.
    </div>
    <div style="background: #FFFDE7; border: 1.5px solid #FFE500; border-radius: 5px; padding: 3pt 5.5pt;">
      🟡 <b>Kuning (Waspada):</b> Teman yang mulai merangkul tanpa izin atau berdiri terlalu dekat.
    </div>
    <div style="background: #FFF0F3; border: 1.5px solid #FF5E7E; border-radius: 5px; padding: 3pt 5.5pt;">
      🔴 <b>Merah (Bahaya!):</b> Menyentuh area tertutup baju dalam atau meminta foto pribadi!
    </div>
  </div>
</div>
<div class="neo-card bg-white" style="padding: 5.5pt 8pt;">
  <div style="font-size: 7.6pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2.5pt; display: flex; align-items: center; gap: 3pt;">
    <span>🛡️</span> 4 SKENARIO LATIHAN MENETAPKAN BATASAN TEGAS:
  </div>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3pt; font-size: 6.8pt; font-weight: 700;">
    <div style="background: #FFF0F3; border: 1.2px solid #FF5E7E; border-radius: 4px; padding: 2.5pt 4pt;">
      <b>Saat Diajak Berduaan:</b><br>"Maaf, kita nongkrong di tempat ramai saja ya, lebih aman."
    </div>
    <div style="background: #FFF0F3; border: 1.2px solid #FF5E7E; border-radius: 4px; padding: 2.5pt 4pt;">
      <b>Saat Disentuh Tanpa Izin:</b><br>"Tolong lepas tanganmu, aku merasa nggak nyaman."
    </div>
    <div style="background: #FFF0F3; border: 1.2px solid #FF5E7E; border-radius: 4px; padding: 2.5pt 4pt;">
      <b>Saat Dipaksa Chat Mesum:</b><br>"Stop kirim pesan begini. Aku nggak suka dan akan lapor."
    </div>
    <div style="background: #FFF0F3; border: 1.2px solid #FF5E7E; border-radius: 4px; padding: 2.5pt 4pt;">
      <b>Saat Dimintai Foto Pribadi:</b><br>"Nggak akan pernah! Tubuhku bukan konsumsi digital."
    </div>
  </div>
</div>
<div class="neo-card-sm bg-mint" style="padding: 4.5pt 6.5pt;">
  <div style="font-size: 7.1pt; font-weight: 800; color: #000;">
    🤝 <b>Hadapi Peer Pressure:</b> Sahabat sejati akan selalu menghargai prinsip moralmu, bukan memaksa kamu merusaknya demi pengakuan tongkrongan!
  </div>
</div>
<div class="neo-card-sm bg-yellow" style="padding: 4.5pt 6.5pt;">
  <div style="font-size: 7.1pt; font-weight: 800; color: #111;">
    🗣️ <b>3 Kalimat Tegas:</b> <em>"Aku nggak nyaman!", "Tolong jangan sentuh aku!", "Hargai batasanku!"</em>
  </div>
</div>
"""
pages_html.append(make_chapter_page(10, 7, custom_body_html=enrich_chapter(7, b7_extra)))

# BAB 08 (Page 11) - Hero image query string fixed!
pages_html.append(make_chapter_page(11, 8))

# BAB 09 (Page 12)
b9_extra = """
<div class="neo-card bg-white" style="padding: 6pt 8pt;">
  <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 3pt; display: flex; align-items: center; gap: 3pt;">
    <span>🚩</span> 4 RED FLAGS BERBAHAYA DALAM HUBUNGAN PACARAN:
  </div>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3.5pt; font-size: 6.9pt; font-weight: 700;">
    <div style="background: #FFF0F3; border: 1.5px solid #FF5E7E; border-radius: 5px; padding: 3.5pt 5pt;">
      📱 <b>Cek HP &amp; Password:</b> Mengontrol chat dan membatasi pertemananmu.
    </div>
    <div style="background: #FFF0F3; border: 1.5px solid #FF5E7E; border-radius: 5px; padding: 3.5pt 5pt;">
      🎭 <b>Gaslighting:</b> Selalu memutarbalikkan fakta hingga kamu merasa bersalah.
    </div>
    <div style="background: #FFF0F3; border: 1.5px solid #FF5E7E; border-radius: 5px; padding: 3.5pt 5pt;">
      ⚡ <b>Memaksa Kontak Fisik:</b> Mengancam putus bila menolak sentuhan intim.
    </div>
    <div style="background: #FFF0F3; border: 1.5px solid #FF5E7E; border-radius: 5px; padding: 3.5pt 5pt;">
      💢 <b>Kekerasan Verbal:</b> Memaki, menghina fisik, atau merendahkan impianmu.
    </div>
  </div>
</div>
<div class="neo-card bg-cream" style="padding: 5.5pt 8pt;">
  <div style="font-size: 7.6pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2.5pt; display: flex; align-items: center; gap: 3pt;">
    <span>💚</span> 4 GREEN FLAGS HUBUNGAN SEHAT &amp; POSITIF:
  </div>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3pt; font-size: 6.8pt; font-weight: 700;">
    <div style="background: #E6FCF5; border: 1.2px solid #00E599; border-radius: 4px; padding: 2.5pt 4pt;">
      🤝 <b>Hormati Batasan:</b> Tak pernah memaksa sentuhan fisik apa pun.
    </div>
    <div style="background: #E6FCF5; border: 1.2px solid #00E599; border-radius: 4px; padding: 2.5pt 4pt;">
      📚 <b>Dukung Cita-Cita:</b> Semangat belajar dan berprestasi bersama.
    </div>
    <div style="background: #E6FCF5; border: 1.2px solid #00E599; border-radius: 4px; padding: 2.5pt 4pt;">
      💬 <b>Komunikasi Terbuka:</b> Terbuka mengutarakan perasaan tanpa takut.
    </div>
    <div style="background: #E6FCF5; border: 1.2px solid #00E599; border-radius: 4px; padding: 2.5pt 4pt;">
      ⚖️ <b>Mandiri:</b> Tetap punya waktu untuk keluarga, hobi, dan sahabat.
    </div>
  </div>
</div>
<div class="neo-card bg-white" style="padding: 5.5pt 8pt; border-left: 4.5px solid #FF5E7E;">
  <div style="font-size: 7.5pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2pt;">
    💬 SKENARIO LATIHAN MENGHADAPI HUBUNGAN TOXIC:
  </div>
  <div style="font-size: 6.9pt; font-weight: 600; line-height: 1.32; color: #222;">
    Saat pasangan mengancam putus bila menolak kontak fisik: <em>"Jika rasa sayangmu harus dibayar dengan melanggar batasanku, lebih baik hubungan kita selesai. Menjaga harga diriku jauh lebih berharga!"</em>
  </div>
</div>
<div class="neo-card-sm bg-mint" style="padding: 4.5pt 6.5pt;">
  <div style="font-size: 7.1pt; font-weight: 800; color: #000;">
    ✨ <b>Prinsip Sejati:</b> Hubungan yang sehat selalu mendatangkan rasa aman dan damai, bukan kecemasan atau rasa takut!
  </div>
</div>
"""
pages_html.append(make_chapter_page(12, 9, custom_body_html=enrich_chapter(9, b9_extra)))

# BAB 10 (Page 13)
b10_extra = """
<div class="neo-card bg-white" style="padding: 6pt 8pt;">
  <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 3pt; display: flex; align-items: center; gap: 3pt;">
    <span>🗣️</span> RUMUS KOMUNIKASI ASERTIF "I-STATEMENT":
  </div>
  <div style="display: flex; flex-direction: column; gap: 3pt; font-size: 7.2pt; font-weight: 700;">
    <div style="background: #FFFDE7; border: 1.5px solid #000; border-radius: 5px; padding: 3pt 5.5pt;">
      1. <b>Sebutkan Perasaanku:</b> "Aku merasa kurang nyaman / tertekan..."
    </div>
    <div style="background: #E6FCF5; border: 1.5px solid #00E599; border-radius: 5px; padding: 3pt 5.5pt;">
      2. <b>Sebutkan Situasinya:</b> "...ketika kamu meminta hal yang melanggar batasanku..."
    </div>
    <div style="background: #F3E8FF; border: 1.5px solid #D4BBFF; border-radius: 5px; padding: 3pt 5.5pt;">
      3. <b>Sampaikan Harapanku:</b> "...jadi aku harap kita bisa saling menghargai dan fokus belajar."
    </div>
  </div>
</div>
<div class="neo-card bg-cream" style="padding: 5.5pt 8pt;">
  <div style="font-size: 7.6pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2.5pt; display: flex; align-items: center; gap: 3pt;">
    <span>🎭</span> 3 GAYA KOMUNIKASI: KENALI GAYAMU!
  </div>
  <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 3.5pt; font-size: 6.8pt; font-weight: 700; text-align: center;">
    <div style="background: #FFF0F3; border: 1.2px solid #000; border-radius: 4px; padding: 3pt 3pt;">
      <b>Pasif 😶</b><br><span style="font-weight: 600; color: #555;">Mengalah terus, menahan rasa sakit dalam hati.</span>
    </div>
    <div style="background: #FFFDE7; border: 1.2px solid #000; border-radius: 4px; padding: 3pt 3pt;">
      <b>Agresif 😡</b><br><span style="font-weight: 600; color: #555;">Membentak, memaki, dan memaksakan kehendak.</span>
    </div>
    <div style="background: #E6FCF5; border: 1.5px solid #00E599; border-radius: 4px; padding: 3pt 3pt;">
      <b>Asertif 😎 ✅</b><br><span style="font-weight: 700; color: #000;">Tegas, sopan, membela hak tanpa melukai orang.</span>
    </div>
  </div>
</div>
<div class="neo-card-sm bg-yellow" style="padding: 5pt 7pt;">
  <div style="font-size: 7.2pt; font-weight: 800; color: #111;">
    💡 <b>Ingat:</b> Asertif itu tegas tanpa kasar, dan sopan tanpa merendahkan diri sendiri!
  </div>
</div>
"""
pages_html.append(make_chapter_page(13, 10, custom_body_html=enrich_chapter(10, b10_extra)))

# BAB 11 (Page 14)
b11_extra = """
<div class="neo-card bg-cream" style="padding: 6pt 8pt;">
  <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 3pt; display: flex; align-items: center; gap: 3pt;">
    <span>⚡</span> 3 HORMON KUNCI DI BALIK PERUBAHAN PUBERTAS:
  </div>
  <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 3.5pt; font-size: 6.8pt; font-weight: 700; text-align: center;">
    <div style="background: #FFF0F3; border: 1.5px solid #FF5E7E; border-radius: 5px; padding: 3.5pt 3.5pt;">
      🌸 <b>Estrogen</b><br><span style="font-size: 6.3pt; font-weight: 600; color: #444;">Mengatur siklus haid &amp; kontur tubuh cewek</span>
    </div>
    <div style="background: #E6FCF5; border: 1.5px solid #00E599; border-radius: 5px; padding: 3.5pt 3.5pt;">
      💧 <b>Testosteron</b><br><span style="font-size: 6.3pt; font-weight: 600; color: #444;">Memicu suara berat, jakun, &amp; otot cowok</span>
    </div>
    <div style="background: #F3E8FF; border: 1.5px solid #D4BBFF; border-radius: 5px; padding: 3.5pt 3.5pt;">
      🧠 <b>GnRH &amp; LH/FSH</b><br><span style="font-size: 6.3pt; font-weight: 600; color: #444;">Sinyal master otak dari kelenjar hipofisis</span>
    </div>
  </div>
</div>
<div class="neo-card bg-white" style="padding: 5.5pt 8pt;">
  <div style="font-size: 7.6pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2.5pt; display: flex; align-items: center; gap: 3pt;">
    <span>📈</span> RENTANG USIA NORMAL PUBERTAS:
  </div>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3.5pt; font-size: 6.9pt; font-weight: 700;">
    <div style="background: #FFF0F3; border: 1.2px solid #FF5E7E; border-radius: 4px; padding: 3pt 4.5pt;">
      🌸 <b>Remaja Putri:</b> Usia 9–14 tahun (rata-rata 11–12 tahun ditandai menstruasi).
    </div>
    <div style="background: #E6FCF5; border: 1.2px solid #00E599; border-radius: 4px; padding: 3pt 4.5pt;">
      💧 <b>Remaja Putra:</b> Usia 10–15 tahun (rata-rata 12–13 tahun ditandai mimpi basah).
    </div>
  </div>
  <div style="font-size: 6.8pt; font-weight: 600; color: #444; margin-top: 2.5pt; line-height: 1.3;">
    <em>Tiap remaja punya jam biologis sendiri. Mulai sedikit lebih cepat atau lambat adalah hal yang sepenuhnya wajar!</em>
  </div>
</div>
"""
pages_html.append(make_chapter_page(14, 11, custom_body_html=enrich_chapter(11, b11_extra)))

# BAB 12 (Page 15) - Rich comparison masterclass
b12_extra = """
<div class="neo-card bg-white" style="padding: 6pt 8pt;">
  <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 3pt; display: flex; align-items: center; gap: 3pt;">
    <span>🧬</span> CIRI PRIMER VS SEKUNDER PADA PUBERTAS:
  </div>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3.5pt; font-size: 6.9pt; font-weight: 700;">
    <div style="background: #FFFDE7; border: 1.5px solid #000; border-radius: 5px; padding: 3.5pt 5pt;">
      🔬 <b>Primer (Organ Reproduksi):</b> Menstruasi pada cewek &amp; mimpi basah/spermatogenesis pada cowok.
    </div>
    <div style="background: #E6FCF5; border: 1.5px solid #000; border-radius: 5px; padding: 3.5pt 5pt;">
      🪞 <b>Sekunder (Fisik Luar):</b> Tumbuh payudara, pinggul membesar, jakun, suara berat, dan rambut halus.
    </div>
  </div>
</div>
<div class="neo-card bg-cream" style="padding: 5.5pt 8pt;">
  <div style="font-size: 7.6pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2.5pt;">
    🌿 4 KEBIASAAN SEHAT MENGHADAPI PERUBAHAN FISIK:
  </div>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3pt; font-size: 6.8pt; font-weight: 700;">
    <div style="background: #fff; border: 1.2px solid #000; border-radius: 4px; padding: 2.5pt 4pt;">
      🚿 <b>Mandi Rutin 2x Sehari:</b> Bersihkan keringat dengan sabun lembut.
    </div>
    <div style="background: #fff; border: 1.2px solid #000; border-radius: 4px; padding: 2.5pt 4pt;">
      🍎 <b>Gizi Seimbang:</b> Perbanyak sayur, buah, zat besi, &amp; air putih.
    </div>
    <div style="background: #fff; border: 1.2px solid #000; border-radius: 4px; padding: 2.5pt 4pt;">
      😴 <b>Tidur 8 Jam Cukup:</b> Hormon pertumbuhan aktif saat tidur lelap.
    </div>
    <div style="background: #fff; border: 1.2px solid #000; border-radius: 4px; padding: 2.5pt 4pt;">
      🎽 <b>Pakaian Nyaman:</b> Pakai bahan katun yang menyerap keringat.
    </div>
  </div>
</div>
<div class="neo-card bg-white" style="padding: 5pt 7.5pt;">
  <div style="font-size: 7.4pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2pt;">
    ⚖️ MITOS VS FAKTA PUBERTAS:
  </div>
  <div style="display: flex; flex-direction: column; gap: 2pt; font-size: 6.8pt; font-weight: 600;">
    <div>❌ <b>Mitos:</b> Masturbasi bikin dengkul kopong. ➔ ✅ <b>Fakta:</b> Mitos keliru tanpa dasar sains kedokteran!</div>
    <div>❌ <b>Mitos:</b> Minum es saat haid bikin darah beku. ➔ ✅ <b>Fakta:</b> Saluran lambung dan rahim terpisah total.</div>
  </div>
</div>
<div class="neo-card bg-cream" style="padding: 4.5pt 7.5pt;">
  <div style="font-size: 7.3pt; font-weight: 800; color: #111;">
    📊 <b>Fakta Growth Spurt:</b> Lonjakan tinggi badan cewek terjadi di awal pubertas (10–13 tahun), sedangkan cowok melonjak di usia 12–16 tahun dan berlanjut hingga usia 18–20 tahun!
  </div>
</div>
<div class="neo-card-sm bg-yellow" style="padding: 4.5pt 6.5pt;">
  <div style="font-size: 7.1pt; font-weight: 800; color: #111;">
    💡 <b>Tips Medis:</b> Jerawat dan bau badan adalah hal normal saat hormon bergejolak. Rawat tubuhmu dengan telaten tanpa minder!
  </div>
</div>
<div class="neo-card-sm bg-mint" style="padding: 4.5pt 6.5pt;">
  <div style="font-size: 7.1pt; font-weight: 800; color: #111;">
    🌿 <b>Kunci Utama Pubertas:</b> Jaga kebersihan badan, pola makan bergizi seimbang, tidur cukup, dan olahraga teratur agar energimu selalu prima!
  </div>
</div>
"""
pages_html.append(make_chapter_page(15, 12, custom_body_html=enrich_chapter(12, b12_extra)))

# BAB 13A: ANATOMI PEREMPUAN (Page 16) - Image 295pt + rich step items
p16 = f"""
  <div class="page">
    <div class="page-header">
      <span class="neo-badge bg-pink">🌸 ANATOMI PEREMPUAN</span>
      <span class="neo-badge bg-white">BAB 13 (BAGIAN 1 / 2)</span>
    </div>
    <div>
      <h2 class="font-heading" style="font-size: 15.5pt; text-transform: uppercase; margin-bottom: 2pt;">
        🔬 ANATOMI SISTEM REPRODUKSI PEREMPUAN
      </h2>
      <p style="font-size: 7.2pt; font-weight: 600; color: #444; line-height: 1.25; margin-bottom: 3pt;">
        Pelajari struktur organ reproduksi internal dan eksternal perempuan beserta fungsi biologisnya.
      </p>
    </div>

    <div class="page-body" style="gap: 5pt;">
      <div class="m-read-lead" style="padding: 5.5pt 8pt; font-size: 8.5pt;">
        Tiap organ reproduksi punya tugas biologis yang sangat penting dan bekerja otomatis secara menakjubkan. Yuk pelajari sistem reproduksi perempuan di bawah ini!
      </div>

      <div class="m-img-wrap">
        <img src="assets/anatomy-female.jpg" alt="Diagram Anatomi Perempuan" class="m-content-img" style="height: 295pt; object-fit: contain; background: #FFFDF8;">
        <div class="m-img-caption">🔬 Sistem Reproduksi Perempuan: Ovarium, Tuba Falopi, Rahim, dan Vagina.</div>
      </div>

      <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; color: #121212;">
        🌸 ORGAN UTAMA PADA PEREMPUAN:
      </div>

      <div style="display: flex; flex-direction: column; gap: 3.5pt;">
        <div class="m-step-item" style="padding: 5.5pt 8pt;">
          <div class="m-step-badge" style="width: 18pt; height: 18pt; font-size: 8.5pt;">1</div>
          <div>
            <div class="m-step-title" style="font-size: 8.4pt;">Ovarium (Indung Telur)</div>
            <div class="m-step-desc" style="font-size: 7.5pt;">Dua organ di kanan dan kiri rahim yang memproduksi sel telur (ovum) serta hormon estrogen dan progesteron.</div>
          </div>
        </div>
        <div class="m-step-item" style="padding: 5.5pt 8pt;">
          <div class="m-step-badge" style="width: 18pt; height: 18pt; font-size: 8.5pt;">2</div>
          <div>
            <div class="m-step-title" style="font-size: 8.4pt;">Tuba Falopi (Saluran Telur)</div>
            <div class="m-step-desc" style="font-size: 7.5pt;">Saluran penghubung ovarium ke rahim, tempat bertemunya sel sperma dan sel telur matang (fertilisasi).</div>
          </div>
        </div>
        <div class="m-step-item" style="padding: 5.5pt 8pt;">
          <div class="m-step-badge" style="width: 18pt; height: 18pt; font-size: 8.5pt;">3</div>
          <div>
            <div class="m-step-title" style="font-size: 8.4pt;">Uterus (Rahim)</div>
            <div class="m-step-desc" style="font-size: 7.5pt;">Organ berotot elastis tempat berkembangnya janin selama kehamilan. Dinding endometrium meluruh jadi haid bila tak dibuahi.</div>
          </div>
        </div>
        <div class="m-step-item" style="padding: 5.5pt 8pt;">
          <div class="m-step-badge" style="width: 18pt; height: 18pt; font-size: 8.5pt;">4</div>
          <div>
            <div class="m-step-title" style="font-size: 8.4pt;">Vagina &amp; Vulva</div>
            <div class="m-step-desc" style="font-size: 7.5pt;">Vulva adalah bagian luar kemaluan, sedangkan vagina adalah saluran elastis jalan keluar darah haid dan jalan lahir bayi.</div>
          </div>
        </div>
      </div>

      <div class="neo-card bg-white" style="padding: 6pt 8pt; border-left: 5px solid #FF5E7E;">
        <div style="font-size: 7.6pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2.5pt; display: flex; align-items: center; gap: 3pt;">
          <span>🧼</span> 4 KUNCI KEBERSIHAN ORGAN PEREMPUAN:
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3pt; font-size: 6.9pt; font-weight: 700;">
          <div style="background: #FFF0F3; border: 1.2px solid #FF5E7E; border-radius: 4px; padding: 2.5pt 4pt;">
            <b>1. Arah Basuh:</b> Dari depan (vulva) ke belakang (anus), jangan dibalik!
          </div>
          <div style="background: #FFF0F3; border: 1.2px solid #FF5E7E; border-radius: 4px; padding: 2.5pt 4pt;">
            <b>2. Hindari Sabun Wangi:</b> Bahan kimia keras merusak flora alami vagina.
          </div>
          <div style="background: #FFF0F3; border: 1.2px solid #FF5E7E; border-radius: 4px; padding: 2.5pt 4pt;">
            <b>3. Celana Katun:</b> Keringkan dengan handuk sebelum berpakaian, ganti jika basah.
          </div>
          <div style="background: #FFF0F3; border: 1.2px solid #FF5E7E; border-radius: 4px; padding: 2.5pt 4pt;">
            <b>4. Ganti Pembalut:</b> Tiap 3–4 jam sekali saat haid agar bebas kuman.
          </div>
        </div>
      </div>

      <div class="neo-card-sm bg-pink" style="padding: 4.5pt 7pt; color: #fff;">
        <div style="font-size: 7.2pt; font-weight: 800;">
          🩺 <b>SADARI Mandiri:</b> Periksa payudara sendiri sebulan sekali, sekitar 7–10 hari setelah haid selesai untuk deteksi dini kesehatan jaringan payudara.
        </div>
      </div>

      <div class="m-source-box">
        <b>📚 Sumber Bagian:</b> Modul Pendidikan Kespro Remaja SMP (2022); Modul Kespro Remaja Luar Sekolah (2021).
      </div>
    </div>

    <div class="page-footer">
      <span>Ruang Tumbuh Remaja • KESPRO SPACE</span>
      <span class="neo-badge bg-black" style="color: #fff;">HALAMAN 16 / {TOTAL_CONTENT_PAGES:02d}</span>
    </div>
  </div>
"""
pages_html.append(p16)

# BAB 13B: ANATOMI LAKI-LAKI (Page 17) - Image 295pt + rich step items
p17 = f"""
  <div class="page">
    <div class="page-header">
      <span class="neo-badge bg-cyan">💧 ANATOMI LAKI-LAKI</span>
      <span class="neo-badge bg-white">BAB 13 (BAGIAN 2 / 2)</span>
    </div>
    <div>
      <h2 class="font-heading" style="font-size: 15.5pt; text-transform: uppercase; margin-bottom: 2pt;">
        🔬 ANATOMI SISTEM REPRODUKSI LAKI-LAKI
      </h2>
      <p style="font-size: 7.2pt; font-weight: 600; color: #444; line-height: 1.25; margin-bottom: 3pt;">
        Mengenal organ reproduksi luar dan dalam laki-laki, peran hormon testosteron, serta produksi sperma.
      </p>
    </div>

    <div class="page-body" style="gap: 5pt;">
      <div class="m-read-lead" style="padding: 5.5pt 8pt; font-size: 8.5pt;">
        Organ reproduksi laki-laki dirancang khusus untuk memproduksi hormon testosteron dan sel sperma. Yuk pelajari bagian-bagian utamanya secara ilmiah!
      </div>

      <div class="m-img-wrap">
        <img src="assets/anatomy-male.jpg" alt="Diagram Anatomi Laki-Laki" class="m-content-img" style="height: 295pt; object-fit: contain; background: #FFFDF8;">
        <div class="m-img-caption">🔬 Sistem Reproduksi Laki-Laki: Penis, Skrotum, Testis, dan Saluran Sperma.</div>
      </div>

      <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; color: #121212;">
        💧 ORGAN UTAMA PADA LAKI-LAKI:
      </div>

      <div style="display: flex; flex-direction: column; gap: 3.5pt;">
        <div class="m-step-item" style="padding: 5.5pt 8pt;">
          <div class="m-step-badge" style="width: 18pt; height: 18pt; font-size: 8.5pt;">1</div>
          <div>
            <div class="m-step-title" style="font-size: 8.4pt;">Testis (Buah Zakar)</div>
            <div class="m-step-desc" style="font-size: 7.5pt;">Dua kelenjar yang memproduksi jutaan sel sperma setiap hari serta menghasilkan hormon testosteron saat pubertas.</div>
          </div>
        </div>
        <div class="m-step-item" style="padding: 5.5pt 8pt;">
          <div class="m-step-badge" style="width: 18pt; height: 18pt; font-size: 8.5pt;">2</div>
          <div>
            <div class="m-step-title" style="font-size: 8.4pt;">Skrotum (Kantung Zakar)</div>
            <div class="m-step-desc" style="font-size: 7.5pt;">Kantung kulit pembungkus testis yang bertugas menjaga suhu testis sekitar 2°C lebih sejuk dari suhu tubuh agar sperma sehat.</div>
          </div>
        </div>
        <div class="m-step-item" style="padding: 5.5pt 8pt;">
          <div class="m-step-badge" style="width: 18pt; height: 18pt; font-size: 8.5pt;">3</div>
          <div>
            <div class="m-step-title" style="font-size: 8.4pt;">Epididimis &amp; Vas Deferens</div>
            <div class="m-step-desc" style="font-size: 7.5pt;">Saluran berkelok tempat pematangan sel sperma, lalu disalurkan melalui vas deferens menuju uretra saat ejakulasi.</div>
          </div>
        </div>
        <div class="m-step-item" style="padding: 5.5pt 8pt;">
          <div class="m-step-badge" style="width: 18pt; height: 18pt; font-size: 8.5pt;">4</div>
          <div>
            <div class="m-step-title" style="font-size: 8.4pt;">Penis &amp; Uretra</div>
            <div class="m-step-desc" style="font-size: 7.5pt;">Saluran ganda untuk mengeluarkan urin dan cairan semen (air mani). Keduanya tidak pernah keluar bersamaan karena ada katup otomatis.</div>
          </div>
        </div>
      </div>

      <div class="neo-card bg-white" style="padding: 6pt 8pt; border-left: 5px solid #00F0FF;">
        <div style="font-size: 7.6pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2.5pt; display: flex; align-items: center; gap: 3pt;">
          <span>🧼</span> 4 KUNCI KEBERSIHAN ORGAN LAKI-LAKI:
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3pt; font-size: 6.9pt; font-weight: 700;">
          <div style="background: #E6FCF5; border: 1.2px solid #00E599; border-radius: 4px; padding: 2.5pt 4pt;">
            <b>1. Cuci Air Bersih:</b> Bersihkan lipatan kemaluan tiap mandi &amp; BAK.
          </div>
          <div style="background: #E6FCF5; border: 1.2px solid #00E599; border-radius: 4px; padding: 2.5pt 4pt;">
            <b>2. Keringkan Handuk:</b> Jaga agar tidak lembap dan berjamur.
          </div>
          <div style="background: #E6FCF5; border: 1.2px solid #00E599; border-radius: 4px; padding: 2.5pt 4pt;">
            <b>3. Celana Longgar:</b> Jangan pakai celana ketat agar suhu testis sejuk.
          </div>
          <div style="background: #E6FCF5; border: 1.2px solid #00E599; border-radius: 4px; padding: 2.5pt 4pt;">
            <b>4. Sirkumsisi (Sunat):</b> Kurangi penumpukan kotoran smegma &amp; IMS.
          </div>
        </div>
      </div>

      <div class="neo-card-sm bg-cyan" style="padding: 4.5pt 7pt;">
        <div style="font-size: 7.2pt; font-weight: 800; color: #000;">
          🩺 <b>Pemeriksaan Testis Mandiri:</b> Raba testis sebulan sekali saat mandi air hangat. Pastikan tekstur kenyal dan laporkan segera ke dokter bila ada benjolan nyeri.
        </div>
      </div>

      <div class="m-source-box">
        <b>📚 Sumber Bagian:</b> Modul Pendidikan Kespro Remaja SMP (2022); Modul Kespro Remaja Luar Sekolah (2021).
      </div>
    </div>

    <div class="page-footer">
      <span>Ruang Tumbuh Remaja • KESPRO SPACE</span>
      <span class="neo-badge bg-black" style="color: #fff;">HALAMAN 17 / {TOTAL_CONTENT_PAGES:02d}</span>
    </div>
  </div>
"""
pages_html.append(p17)

# BAB 14 (Page 18)
b14_extra = """
<div class="neo-card bg-cream" style="padding: 6pt 8pt;">
  <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 3pt; display: flex; align-items: center; gap: 3pt;">
    <span>🩺</span> PERTOLONGAN PERTAMA NYERI HAID (DISMENORE):
  </div>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3.5pt; font-size: 7pt; font-weight: 700;">
    <div style="background: #FFFDE7; border: 1.5px solid #000; border-radius: 5px; padding: 3.5pt 5pt;">
      🫖 <b>Kompres Hangat:</b> Tempelkan botol air hangat di perut bawah untuk rileksasi otot rahim.
    </div>
    <div style="background: #E6FCF5; border: 1.5px solid #000; border-radius: 5px; padding: 3.5pt 5pt;">
      💧 <b>Minum Air &amp; Istirahat:</b> Kurangi kafein/garam, perbanyak cairan hangat dan tidur cukup.
    </div>
  </div>
</div>
"""
pages_html.append(make_chapter_page(18, 14, track="girl", custom_body_html=enrich_chapter(14, b14_extra)))

# BAB 15 (Page 19)
b15_extra = """
<div class="neo-card bg-cream" style="padding: 6pt 8pt;">
  <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 3pt; display: flex; align-items: center; gap: 3pt;">
    <span>💧</span> FAKTA MEDIS MIMPI BASAH PADA REMAJA LAKI-LAKI:
  </div>
  <div style="display: flex; flex-direction: column; gap: 3pt; font-size: 7.1pt; font-weight: 700;">
    <div style="background: #E6FCF5; border: 1.5px solid #00E599; border-radius: 5px; padding: 3pt 5.5pt;">
      1. <b>Mekanisme Alami:</b> Pelepasan cairan semen saat kandung sperma penuh saat tidur lelap.
    </div>
    <div style="background: #FFFDE7; border: 1.5px solid #FFE500; border-radius: 5px; padding: 3pt 5.5pt;">
      2. <b>Bukan Penyakit:</b> Ini adalah bukti biologis bahwa testis mulai aktif memproduksi sperma.
    </div>
    <div style="background: #F3E8FF; border: 1.5px solid #D4BBFF; border-radius: 5px; padding: 3pt 5.5pt;">
      3. <b>Kebersihan Pasca-Mimpi:</b> Bersihkan badan dan organ intim dengan air mengalir dan ganti celana bersih.
    </div>
  </div>
</div>
"""
pages_html.append(make_chapter_page(19, 15, track="boy", custom_body_html=enrich_chapter(15, b15_extra)))

# BAB 16 (Page 20) - Hero image query string fixed!
pages_html.append(make_chapter_page(20, 16))

# BAB 17 (Page 21)
b17_extra = """
<div class="neo-card bg-white" style="padding: 6pt 8pt;">
  <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 3pt; display: flex; align-items: center; gap: 3pt;">
    <span>⚠️</span> 4 RISIKO MEDIS KEHAMILAN DI USIA REMAJA:
  </div>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3.5pt; font-size: 7pt; font-weight: 700;">
    <div style="background: #FFF0F3; border: 1.5px solid #FF5E7E; border-radius: 5px; padding: 3.5pt 5pt;">
      🩻 <b>Panggul Belum Matang:</b> Meningkatkan risiko persalinan macet dan operasi caesar darurat.
    </div>
    <div style="background: #FFF0F3; border: 1.5px solid #FF5E7E; border-radius: 5px; padding: 3.5pt 5pt;">
      🩸 <b>Anemia &amp; Preeklamsia:</b> Tekanan darah melonjak berbahaya bagi ibu dan janin.
    </div>
    <div style="background: #FFF0F3; border: 1.5px solid #FF5E7E; border-radius: 5px; padding: 3.5pt 5pt;">
      👶 <b>BBLR &amp; Stunting:</b> Bayi lahir dengan berat rendah akibat nutrisi terserap ganda.
    </div>
    <div style="background: #FFF0F3; border: 1.5px solid #FF5E7E; border-radius: 5px; padding: 3.5pt 5pt;">
      💔 <b>Dampak Psikososial:</b> Risiko putus sekolah, isolasi sosial, dan trauma masa depan.
    </div>
  </div>
</div>
"""
pages_html.append(make_chapter_page(21, 17, custom_body_html=enrich_chapter(17, b17_extra)))

# BAB 18 (Page 22) - Rich text chapter
b18_extra = """
<div class="neo-card bg-white" style="padding: 6pt 8.5pt;">
  <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 3pt; display: flex; align-items: center; gap: 3pt;">
    <span>🛡️</span> 4 BENTENG UTAMA MENCEGAH KEHAMILAN TAK DIINGINKAN:
  </div>
  <div style="display: flex; flex-direction: column; gap: 2.8pt; font-size: 7.1pt; font-weight: 700;">
    <div style="background: #E6FCF5; border: 1.5px solid #00E599; border-radius: 5px; padding: 3pt 5.5pt;">
      1. <b>Abstinensia (Menahan Diri):</b> Menunda hubungan seksual sampai dewasa dan siap menikah secara sah.
    </div>
    <div style="background: #FFFDE7; border: 1.5px solid #FFE500; border-radius: 5px; padding: 3pt 5.5pt;">
      2. <b>Hindari Situasi Rawan:</b> Jangan berduaan di tempat sepi/tertutup, tetapkan jam malam pacaran.
    </div>
    <div style="background: #F3E8FF; border: 1.5px solid #D4BBFF; border-radius: 5px; padding: 3pt 5.5pt;">
      3. <b>Kekuatan Berkata TIDAK:</b> Pasangan yang baik akan menghargai prinsip moralmu seumur hidup!
    </div>
    <div style="background: #FFF0F3; border: 1.5px solid #FF5E7E; border-radius: 5px; padding: 3pt 5.5pt;">
      4. <b>Fokus Prestasi &amp; Impian:</b> Salurkan energi masa muda untuk hobi positif, olahraga, dan karya!
    </div>
  </div>
</div>
<div class="neo-card bg-cream" style="padding: 5.5pt 7.5pt;">
  <div style="font-size: 7.4pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2pt;">
    📌 STATISTIK MEDIS &amp; FAKTA KESEHATAN:
  </div>
  <div style="font-size: 7.1pt; font-weight: 600; line-height: 1.34; color: #222;">
    Lebih dari 80% kehamilan tidak diinginkan pada remaja dipicu oleh ketidaktahuan biologis dan bujuk rayu pasangan. Bekal pengetahuan reproduksi yang benar adalah perisai masa depanmu!
  </div>
</div>
<div class="neo-card-sm bg-yellow" style="padding: 5pt 7pt;">
  <div style="font-size: 7.2pt; font-weight: 800; color: #111;">
    💡 <b>Edukasi Medis:</b> Seks pradewasa berisiko tinggi mengubah total masa depanmu. Pilihlah jalan yang melindungi cita-citamu!
  </div>
</div>
"""
pages_html.append(make_chapter_page(22, 18, custom_body_html=enrich_chapter(18, b18_extra)))

# BAB 19 (Page 23) - Rich text chapter (fully expanded)
b19_extra = """
<div class="neo-card bg-white" style="padding: 6.5pt 8.5pt;">
  <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 3pt; display: flex; align-items: center; gap: 3pt;">
    <span>⚠️</span> 4 JENIS IMS PALING SERING MENYERANG REMAJA:
  </div>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3.5pt; font-size: 6.9pt; font-weight: 700;">
    <div style="background: #FFF0F3; border: 1.5px solid #FF5E7E; border-radius: 5px; padding: 3.5pt 5pt;">
      🦠 <b>Gonore &amp; Klamidia:</b> Kencing nanah, perih luar biasa, memicu kemandulan bila terlambat.
    </div>
    <div style="background: #FFF0F3; border: 1.5px solid #FF5E7E; border-radius: 5px; padding: 3.5pt 5pt;">
      🩹 <b>Sifilis (Raja Singa):</b> Luka borok tanpa nyeri, bila dibiarkan merusak jantung &amp; otak.
    </div>
    <div style="background: #FFF0F3; border: 1.5px solid #FF5E7E; border-radius: 5px; padding: 3.5pt 5pt;">
      ⚡ <b>Herpes Genital:</b> Luka melepuh perih dan gatal, virus menetap di saraf seumur hidup.
    </div>
    <div style="background: #FFF0F3; border: 1.5px solid #FF5E7E; border-radius: 5px; padding: 3.5pt 5pt;">
      🔬 <b>HPV:</b> Kutil kelamin dan penyebab utama 95% kasus kanker serviks pada perempuan.
    </div>
  </div>
</div>
<div class="neo-card bg-cream" style="padding: 6pt 8.5pt;">
  <div style="font-size: 7.6pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2.5pt; display: flex; align-items: center; gap: 3pt;">
    <span>🛡️</span> 3 JALUR PENULARAN IMS &amp; CARA PENCEGAHANNYA:
  </div>
  <div style="display: flex; flex-direction: column; gap: 2.5pt; font-size: 7pt; font-weight: 700;">
    <div>1. <b>Hubungan Seksual Aktif:</b> Kontak cairan tubuh saat senggama menularkan bakteri &amp; virus.</div>
    <div>2. <b>Jarum Suntik Tak Steril:</b> Tato ilegal, tindik sembarangan, &amp; penggunaan jarum bersama.</div>
    <div>3. <b>Ibu ke Janin:</b> Penularan saat hamil/melahirkan (dapat dicegah dengan deteksi dini di Puskesmas).</div>
  </div>
</div>
<div class="neo-card bg-white" style="padding: 6pt 8.5pt;">
  <div style="font-size: 7.6pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2.5pt; display: flex; align-items: center; gap: 3pt;">
    <span>🩺</span> 3 LANGKAH BILA MERASAKAN GEJALA ABNORMAL:
  </div>
  <div style="display: flex; flex-direction: column; gap: 2.5pt; font-size: 6.9pt; font-weight: 700;">
    <div>• <b>Jangan Mengobati Sendiri:</b> Jangan membeli antibiotik sembarangan tanpa resep dokter spesialis.</div>
    <div>• <b>Datang ke Poli PKPR:</b> Periksakan ke Puskesmas terdekat, privasi remaja dijamin 100% oleh UU.</div>
    <div>• <b>Pengobatan Tuntas:</b> Habiskan seluruh resep obat sampai dokter menyatakan sembuh total.</div>
  </div>
</div>
<div class="neo-card-sm bg-yellow" style="padding: 5.5pt 7.5pt;">
  <div style="font-size: 7.2pt; font-weight: 800; color: #111;">
    🛡️ <b>Kunci Proteksi 100%:</b> Menjaga diri dari perilaku seks berisiko dan menolak jarum tato ilegal adalah perlindungan mutlak dari bahaya IMS!
  </div>
</div>
<div class="neo-card-sm bg-mint" style="padding: 5.5pt 7.5pt;">
  <div style="font-size: 7.2pt; font-weight: 800; color: #000;">
    🏥 <b>Layanan PKPR Rahasia:</b> Jika mengalami keluhan gatal hebat, perih, atau nanah, periksa ke Puskesmas PKPR terdekat. Tenaga medis menjamin privasi tanpa menghakimi!
  </div>
</div>
"""
pages_html.append(make_chapter_page(23, 19, custom_body_html=enrich_chapter(19, b19_extra)))

# BAB 20 (Page 24)
pages_html.append(make_chapter_page(24, 20))

# BAB 21 (Page 25)
b21_extra = """
<div class="neo-card bg-cream" style="padding: 6pt 8pt;">
  <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 3pt; display: flex; align-items: center; gap: 3pt;">
    <span>🤝</span> SIKAP EMPATI DAN DUKUNGAN BAGI ODHIV:
  </div>
  <div style="display: flex; flex-direction: column; gap: 3pt; font-size: 7.1pt; font-weight: 700;">
    <div style="background: #E6FCF5; border: 1.5px solid #00E599; border-radius: 5px; padding: 3pt 5.5pt;">
      1. <b>HIV Nggak Menular Lewat Sosial:</b> Makan bersama, jabat tangan, dan berenang tidak menularkan virus.
    </div>
    <div style="background: #FFFDE7; border: 1.5px solid #FFE500; border-radius: 5px; padding: 3pt 5.5pt;">
      2. <b>Obat ARV Tersedia Gratis:</b> Pasien ODHIV bisa hidup sehat dan berprestasi dengan minum ARV teratur.
    </div>
    <div style="background: #F3E8FF; border: 1.5px solid #D4BBFF; border-radius: 5px; padding: 3pt 5.5pt;">
      3. <b>Stop Bullying &amp; Diskriminasi:</b> Setiap orang berhak atas pendidikan, pekerjaan, dan kasih sayang!
    </div>
  </div>
</div>
"""
pages_html.append(make_chapter_page(25, 21, custom_body_html=enrich_chapter(21, b21_extra)))

# BAB 22 (Page 26) - Rich text chapter
b22_extra = """
<div class="neo-card bg-white" style="padding: 6pt 8pt;">
  <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 3pt; display: flex; align-items: center; gap: 3pt;">
    <span>⚖️</span> RANGKUMAN CEPAT: SEKS VS GENDER
  </div>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3.5pt; font-size: 6.9pt; font-weight: 700;">
    <div style="background: #FFFDE7; border: 1.5px solid #000; border-radius: 5px; padding: 3.5pt 5pt;">
      🔬 <b>Seks (Biologis):</b> Bersifat kodrati, universal di seluruh dunia, tidak bisa ditukar (ovarium/testis).
    </div>
    <div style="background: #E6FCF5; border: 1.5px solid #000; border-radius: 5px; padding: 3.5pt 5pt;">
      🎭 <b>Gender (Sosial/Peran):</b> Bentukan budaya, bisa berubah seiring waktu (memasak, bekerja, memimpin).
    </div>
  </div>
</div>
<div class="neo-card bg-cream" style="padding: 5.5pt 8pt;">
  <div style="font-size: 7.6pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2.5pt;">
    🛑 3 MITOS GENDER YANG PERLU KITA LURUSKAN:
  </div>
  <div style="display: flex; flex-direction: column; gap: 2.5pt; font-size: 6.9pt; font-weight: 700;">
    <div>❌ <em>"Laki-laki sejati nggak boleh menangis."</em> ➔ <b>Fakta:</b> Emosi sedih itu manusiawi dan sehat.</div>
    <div>❌ <em>"Perempuan nggak perlu sekolah tinggi."</em> ➔ <b>Fakta:</b> Perempuan terdidik melahirkan generasi kuat.</div>
    <div>❌ <em>"Urusan rumah tangga cuma kerjaan cewek."</em> ➔ <b>Fakta:</b> Keterampilan domestik adalah life skill mandiri.</div>
  </div>
</div>
<div class="neo-card bg-white" style="padding: 5pt 7.5pt;">
  <div style="font-size: 7.4pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2pt;">
    🌟 KESETARAAN GENDER BAGI REMAJA:
  </div>
  <div style="font-size: 6.9pt; font-weight: 600; line-height: 1.32; color: #222;">
    Laki-laki dan perempuan punya hak yang setara untuk meraih prestasi, bebas memilih jurusan impian, dan saling mendukung tanpa merendahkan satu sama lain!
  </div>
</div>
<div class="neo-card bg-cream" style="padding: 4.5pt 7.5pt;">
  <div style="font-size: 7.2pt; font-weight: 800; color: #111;">
    🤝 <b>Contoh Nyata di Sekolah:</b> Pemilihan ketua organisasi/OSIS dinilai berdasarkan kecakapan kepemimpinan, dan piket kelas dikerjakan bersama tanpa sekat gender!
  </div>
</div>
<div class="neo-card-sm bg-yellow" style="padding: 4.5pt 6.5pt;">
  <div style="font-size: 7.1pt; font-weight: 800; color: #111;">
    💡 <b>Ingat:</b> Menghargai kesetaraan gender menciptakan lingkungan pertemanan yang aman dan harmonis!
  </div>
</div>
<div class="neo-card-sm bg-mint" style="padding: 4.5pt 6.5pt;">
  <div style="font-size: 7.1pt; font-weight: 800; color: #111;">
    🌟 <b>Masa Depan Setara:</b> Saat cewek dan cowok saling menghormati dan mendukung impian masing-masing, lingkungan sekolah dan pertemanan menjadi tempat yang aman dan membanggakan!
  </div>
</div>
"""
pages_html.append(make_chapter_page(26, 22, custom_body_html=enrich_chapter(22, b22_extra)))

# BAB 23 (Page 27) - UU TPKS & Hak Korban
b23_extra = """
<div class="neo-card bg-white" style="padding: 6pt 8pt; border-left: 5px solid #FF5E7E;">
  <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 3pt; display: flex; align-items: center; gap: 3pt;">
    <span>⚖️</span> 4 HAK KORBAN BERDASARKAN UU TPKS NO. 12/2022:
  </div>
  <div style="display: flex; flex-direction: column; gap: 2.5pt; font-size: 7pt; font-weight: 700;">
    <div style="background: #FFF0F3; border: 1.2px solid #FF5E7E; border-radius: 4px; padding: 2.5pt 4.5pt;">
      🛡️ <b>1. Hak Perlindungan Fisik:</b> Pendampingan aparat dan penempatan di rumah aman (shelter).
    </div>
    <div style="background: #FFF0F3; border: 1.2px solid #FF5E7E; border-radius: 4px; padding: 2.5pt 4.5pt;">
      🩺 <b>2. Hak Pemulihan Medis &amp; Psikis:</b> Konseling trauma healing psikolog gratis.
    </div>
    <div style="background: #FFF0F3; border: 1.2px solid #FF5E7E; border-radius: 4px; padding: 2.5pt 4.5pt;">
      ⚖️ <b>3. Hak Bantuan Hukum:</b> Pengacara pendamping bebas biaya dari LBH / UPTD PPA.
    </div>
    <div style="background: #FFF0F3; border: 1.2px solid #FF5E7E; border-radius: 4px; padding: 2.5pt 4.5pt;">
      🔒 <b>4. Hak Kerahasiaan Identitas:</b> Media &amp; publik dilarang mempublikasikan nama/sekolah korban.
    </div>
  </div>
</div>
<div class="neo-card-sm bg-black" style="padding: 5pt 7pt; color: #fff;">
  <div style="font-size: 7.2pt; font-weight: 800; color: #FFE500;">
    🚨 Call Center SAPPA KemenPPPA: Telepon 129 atau WhatsApp 08111-129-129 untuk laporan darurat rahasia!
  </div>
</div>
"""
pages_html.append(make_chapter_page(27, 23, custom_body_html=enrich_chapter(23, b23_extra)))

# BAB 24 (Page 28) - Rich text chapter
b24_extra = """
<div class="neo-card bg-white" style="padding: 6pt 8pt;">
  <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 3pt; display: flex; align-items: center; gap: 3pt;">
    <span>📋</span> LEMBAR KERJA SAFETY PLAN PRIBADI:
  </div>
  <div style="display: flex; flex-direction: column; gap: 2.8pt; font-size: 7.1pt; font-weight: 700;">
    <div style="background: #FFFDE7; border: 1.5px solid #000; border-radius: 5px; padding: 3pt 5.5pt;">
      1. <b>Tempat Aman Saat Darurat:</b> Rumah guru BK / Puskesmas PKPR / Kantor Polisi.
    </div>
    <div style="background: #E6FCF5; border: 1.5px solid #00E599; border-radius: 5px; padding: 3pt 5.5pt;">
      2. <b>Kontak Darurat Tersimpan:</b> Sahabat dekat, orang tua, Hotline SAPPA 129.
    </div>
    <div style="background: #F3E8FF; border: 1.5px solid #000; border-radius: 5px; padding: 3pt 5.5pt;">
      3. <b>Kode Rahasia Darurat:</b> Sepakati kata kunci dengan teman dekat saat butuh jemputan darurat.
    </div>
  </div>
</div>
<div class="neo-card bg-cream" style="padding: 5.5pt 8pt;">
  <div style="font-size: 7.6pt; font-weight: 900; text-transform: uppercase; margin-bottom: 2.5pt; display: flex; align-items: center; gap: 3pt;">
    <span>📱</span> CHECKLIST DIGITAL SAFETY PRIBADI:
  </div>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3pt; font-size: 6.8pt; font-weight: 700;">
    <div style="background: #fff; border: 1.2px solid #000; border-radius: 4px; padding: 2.5pt 4pt;">
      ☑️ Share live location ke ortu saat bepergian malam.
    </div>
    <div style="background: #fff; border: 1.2px solid #000; border-radius: 4px; padding: 2.5pt 4pt;">
      ☑️ Pasang SOS shortcut smartphone (tombol power 5x).
    </div>
    <div style="background: #fff; border: 1.2px solid #000; border-radius: 4px; padding: 2.5pt 4pt;">
      ☑️ Simpan nomor 110 &amp; 119 di kontak cepat.
    </div>
    <div style="background: #fff; border: 1.2px solid #000; border-radius: 4px; padding: 2.5pt 4pt;">
      ☑️ Selalu punya saldo e-wallet cadangan darurat.
    </div>
  </div>
</div>
<div class="neo-card-sm bg-pink" style="padding: 5pt 7pt;">
  <div style="font-size: 7.2pt; font-weight: 800; color: #fff;">
    🚨 <b>Ingat Selalu:</b> Keselamatan fisik dan mentalmu adalah prioritas nomor satu. Jangan pernah ragu mencari perlindungan saat merasa terancam!
  </div>
</div>
"""
pages_html.append(make_chapter_page(28, 24, custom_body_html=enrich_chapter(24, b24_extra)))

# BAB 25 (Page 29)
b25_extra = """
<div class="neo-card bg-cream" style="padding: 6pt 8pt;">
  <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 3pt; display: flex; align-items: center; gap: 3pt;">
    <span>🧘</span> TEKNIK PERNAPASAN 4-7-8 PEREDA CEMAS &amp; EMOSI:
  </div>
  <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 3.5pt; font-size: 6.8pt; font-weight: 700; text-align: center;">
    <div style="background: #E6FCF5; border: 1.5px solid #00E599; border-radius: 5px; padding: 3.5pt 3.5pt;">
      🌬️ <b>4 Detik</b><br><span style="font-size: 6.3pt; font-weight: 600; color: #444;">Tarik napas perlahan lewat hidung</span>
    </div>
    <div style="background: #FFFDE7; border: 1.5px solid #FFE500; border-radius: 5px; padding: 3.5pt 3.5pt;">
      ⏸️ <b>7 Detik</b><br><span style="font-size: 6.3pt; font-weight: 600; color: #444;">Tahan napas dan tenangkan pikiran</span>
    </div>
    <div style="background: #FFF0F3; border: 1.5px solid #FF5E7E; border-radius: 5px; padding: 3.5pt 3.5pt;">
      💨 <b>8 Detik</b><br><span style="font-size: 6.3pt; font-weight: 600; color: #444;">Hembuskan lembut lewat mulut</span>
    </div>
  </div>
</div>
"""
pages_html.append(make_chapter_page(29, 25, custom_body_html=enrich_chapter(25, b25_extra)))

# BAB 26 (Page 30)
b26_extra = """
<div class="neo-card bg-white" style="padding: 6pt 8pt;">
  <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 3pt; display: flex; align-items: center; gap: 3pt;">
    <span>🔐</span> 4 ATURAN EMAS AMAN DI RUANG SIBER:
  </div>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3.5pt; font-size: 7pt; font-weight: 700;">
    <div style="background: #FFF0F3; border: 1.5px solid #FF5E7E; border-radius: 5px; padding: 3.5pt 5pt;">
      🚫 <b>Stop Kirim Foto Intim:</b> Sekali terkirim, jejak digital abadi dan bisa disalahgunakan!
    </div>
    <div style="background: #FFFDE7; border: 1.5px solid #000; border-radius: 5px; padding: 3.5pt 5pt;">
      🔒 <b>Aktifkan 2FA:</b> Gunakan autentikasi dua faktor untuk akun medsos &amp; chat.
    </div>
    <div style="background: #E6FCF5; border: 1.5px solid #000; border-radius: 5px; padding: 3.5pt 5pt;">
      👥 <b>Privasi Akun:</b> Kunci akun pribadi dan selektif menerima pertemanan.
    </div>
    <div style="background: #F3E8FF; border: 1.5px solid #000; border-radius: 5px; padding: 3.5pt 5pt;">
      📸 <b>Simpan Bukti (Screenshot):</b> Jika diancam (sextortion), catat tanggal dan laporkan segera!
    </div>
  </div>
</div>
<div class="neo-card-sm bg-cream" style="padding: 4.5pt 6.5pt;">
  <div style="font-size: 7.1pt; font-weight: 800; color: #111;">
    ⚖️ <b>Hukum ITE:</b> Menyebarkan dokumen atau foto intim tanpa izin diancam pidana penjara hingga 6 tahun sesuai UU TPKS &amp; UU ITE.
  </div>
</div>
"""
pages_html.append(make_chapter_page(30, 26, custom_body_html=enrich_chapter(26, b26_extra)))

# BAB 27 (Page 31)
pages_html.append(make_chapter_page(31, 27))

# BAB 28 (Page 32)
b28_extra = """
<div class="neo-card bg-cream" style="padding: 6pt 8pt;">
  <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 3pt; display: flex; align-items: center; gap: 3pt;">
    <span>🏥</span> ALUR MUDAH KUNJUNGAN KE PUSKESMAS PKPR:
  </div>
  <div style="display: flex; flex-direction: column; gap: 3pt; font-size: 7.1pt; font-weight: 700;">
    <div style="background: #E6FCF5; border: 1.5px solid #00E599; border-radius: 5px; padding: 3pt 5.5pt;">
      1. <b>Datang &amp; Daftar:</b> Bawa KTP/Kartu Pelajar atau BPJS, sebutkan ingin ke Poli PKPR.
    </div>
    <div style="background: #FFFDE7; border: 1.5px solid #FFE500; border-radius: 5px; padding: 3pt 5.5pt;">
      2. <b>Ruang Konseling Khusus:</b> Ngobrol santai empat mata bersama dokter/bidan tanpa dihakimi.
    </div>
    <div style="background: #F3E8FF; border: 1.5px solid #D4BBFF; border-radius: 5px; padding: 3pt 5.5pt;">
      3. <b>Pemeriksaan &amp; Edukasi:</b> Dapatkan pengobatan gratis dan edukasi yang menjamin kerahasiaanmu!
    </div>
  </div>
</div>
"""
pages_html.append(make_chapter_page(32, 28, custom_body_html=enrich_chapter(28, b28_extra)))

# BAB 29 (Page 33)
pages_html.append(make_chapter_page(33, 29))

# BAB 30 (Page 34) - Rich text chapter
b30_extra = """
<div class="neo-card bg-white" style="padding: 6pt 8pt;">
  <div style="font-size: 7.8pt; font-weight: 900; text-transform: uppercase; margin-bottom: 3pt; display: flex; align-items: center; gap: 3pt;">
    <span>🏛️</span> 6 RUJUKAN RESMI &amp; REGULASI HUKUM INDONESIA:
  </div>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3.5pt; font-size: 7pt; font-weight: 700;">
    <div style="background: #E6FCF5; border: 1.5px solid #000; border-radius: 5px; padding: 3pt 4.5pt;">
      📜 UU TPKS No. 12 Tahun 2022
    </div>
    <div style="background: #FFFDE7; border: 1.5px solid #000; border-radius: 5px; padding: 3pt 4.5pt;">
      📜 UU Perlindungan Anak No. 35/2014
    </div>
    <div style="background: #F3E8FF; border: 1.5px solid #000; border-radius: 5px; padding: 3pt 4.5pt;">
      🩺 Permenkes No. 25 Tahun 2014 (PKPR)
    </div>
    <div style="background: #FFF0F3; border: 1.5px solid #000; border-radius: 5px; padding: 3pt 4.5pt;">
      🌐 WHO Adolescent Health Guidelines
    </div>
    <div style="background: #E6FCF5; border: 1.5px solid #000; border-radius: 5px; padding: 3pt 4.5pt;">
      📚 Modul Kespro SMP Kemdikbud (2022)
    </div>
    <div style="background: #FFFDE7; border: 1.5px solid #000; border-radius: 5px; padding: 3pt 4.5pt;">
      📘 Buku Pegangan Kader PKPR Kemenkes
    </div>
  </div>
</div>
<div class="neo-card-sm bg-yellow" style="padding: 5pt 7pt;">
  <div style="font-size: 7.2pt; font-weight: 800; color: #111; line-height: 1.34;">
    📖 <b>Pesan Tim Medis:</b> "Ilmu yang benar adalah tameng terhebatmu. Jangan menyerap informasi kesehatan reproduksi dari mitos tongkrongan atau konten medsos tanpa verifikasi dokter!"
  </div>
</div>
<div class="neo-card-sm bg-mint" style="padding: 5pt 7pt;">
  <div style="font-size: 7.2pt; font-weight: 800; color: #000;">
    🌐 <b>Akses Informasi Resmi:</b> Unduh aplikasi SehatPedia Kemenkes RI atau kunjungi portal ayosehat.kemkes.go.id untuk artikel medis terverifikasi.
  </div>
</div>
"""
pages_html.append(make_chapter_page(34, 30, custom_body_html=enrich_chapter(30, b30_extra)))

# ==============================================================================
# 7. PAGE 35: PIAGAM KELULUSAN & DIREKTORI DARURAT (HALAMAN 35 / 35)
# ==============================================================================
p35 = f"""
  <div class="page" style="background-color: #FFE500;">
    <div class="page-header">
      <span class="neo-badge bg-pink">🎉 KELULUSAN BACA BUKLET</span>
      <span class="neo-badge bg-white">HALAMAN 35 / {TOTAL_CONTENT_PAGES:02d}</span>
    </div>
    <div>
      <h2 class="font-heading" style="font-size: 16pt; text-transform: uppercase; margin-bottom: 2pt;">
        SELAMAT! KAMU NAIK LEVEL! 🚀
      </h2>
      <p style="font-size: 7.4pt; font-weight: 600; color: #222;">Kamu telah menuntaskan seluruh 30 bab panduan komprehensif Kespro Space!</p>
    </div>

    <div class="page-body" style="gap: 6pt;">
      <!-- PIAGAM CARD (GRAND CERTIFICATE FORMAT) -->
      <div class="neo-card bg-white" style="text-align: center; padding: 22pt 18pt; border: 3px double #000; box-shadow: 4px 4px 0 #000;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5pt;">
          <span style="font-size: 28pt;">🏆</span>
          <span class="neo-badge bg-yellow" style="font-size: 8.5pt; padding: 4.5pt 11pt;">★ PIAGAM RESMI BACA MANDIRI ★</span>
          <span style="font-size: 28pt;">📜</span>
        </div>
        <div style="font-family: 'Space Grotesk', sans-serif; font-size: 15.5pt; font-weight: 900; text-transform: uppercase; margin-bottom: 5pt;">
          SERTIFIKAT KELULUSAN KESPRO SPACE
        </div>
        <div style="font-size: 8.2pt; font-weight: 600; color: #444; margin-bottom: 9pt;">
          Diberikan kepada pembaca berdaya yang telah menuntaskan 30 Bab Panduan Komprehensif:
        </div>
        
        <div class="neo-box-dashed" style="padding: 9pt 11pt; margin-bottom: 9pt; text-align: left; background: #FFFDF0;">
          <div style="display: flex; justify-content: space-between; font-size: 8.8pt; font-weight: 800; margin-bottom: 6pt;">
            <span>Nama Lengkap Pelajar:</span>
            <span style="color: #666;">........................................................................</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 8.5pt; font-weight: 700; color: #444; margin-bottom: 6pt;">
            <span>Sekolah / Institusi:</span>
            <span style="color: #666;">........................................................................</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 8.5pt; font-weight: 700; color: #444; margin-bottom: 6pt;">
            <span>Tanggal Tuntas Baca:</span>
            <span style="color: #666;">................... / ................... / 202...</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 8.2pt; font-weight: 700; color: #555;">
            <span>Pencapaian:</span>
            <span style="color: #2B8A3E; font-weight: 900;">LULUS 100% PEMAHAMAN MANDIRI KESPRO REMAJA</span>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 8.2pt; font-weight: 800; border-top: 1.5px dashed #ccc; padding-top: 7pt;">
          <div>
            <div style="font-size: 7.4pt; color: #666;">Tanda Tangan Pelajar:</div>
            <div style="margin-top: 12pt; border-bottom: 1.5px solid #000; width: 105pt;"></div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 7.4pt; color: #666;">Verifikasi Program:</div>
            <div style="font-weight: 900; color: #111; margin-top: 9pt;">Tim Fasilitator Kespro Space ✍️</div>
          </div>
        </div>
      </div>

      <!-- REFLEKSI AKHIR -->
      <div class="neo-card-sm bg-white" style="text-align: center; padding: 9pt 11pt;">
        <div style="font-family: 'Space Grotesk', sans-serif; font-size: 9.8pt; font-weight: 900; line-height: 1.3; margin-bottom: 3pt;">
          “Tubuhmu adalah milikmu yang paling berharga. Pahami fungsinya, jaga kehormatannya, dan raih impian besarmu!”
        </div>
        <p style="font-size: 7.6pt; font-weight: 600; color: #444; line-height: 1.36;">
          Edukasi kesehatan reproduksi adalah bekal kecerdasan hidup (*life skills*) agar kamu mandiri, selamat dari risiko pergaulan bebas, dan berdaya penuh.
        </p>
      </div>

      <!-- 5 CAPAIAN KELULUSAN -->
      <div class="neo-card bg-white" style="padding: 8.5pt 10.5pt;">
        <div style="font-size: 8.4pt; font-weight: 900; text-transform: uppercase; margin-bottom: 4pt; display: flex; justify-content: space-between; align-items: center;">
          <span>✅ 5 CAPAIAN KELULUSAN DIRIKU:</span>
          <span class="neo-tag bg-mint">LULUS 100%</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 4pt; font-size: 7.5pt; font-weight: 700;">
          <div style="background: #FFFDE7; border: 1.5px solid #000; border-radius: 5px; padding: 4pt 6.5pt;">
            ☑️ Memahami proses biologis pubertas cewek &amp; cowok secara ilmiah
          </div>
          <div style="background: #E6FCF5; border: 1.5px solid #000; border-radius: 5px; padding: 3.5pt 6pt;">
            ☑️ Mengetahui batasan personal (*consent*) &amp; berani berkata "TIDAK"
          </div>
          <div style="background: #F3E8FF; border: 1.5px solid #000; border-radius: 5px; padding: 3.5pt 6pt;">
            ☑️ Mampu merawat kebersihan organ reproduksi &amp; gizi pubertas seimbang
          </div>
          <div style="background: #FFF0F3; border: 1.5px solid #000; border-radius: 5px; padding: 3.5pt 6pt;">
            ☑️ Waspada IMS, HIV/AIDS, narkoba, &amp; kejahatan siber (sextortion)
          </div>
          <div style="background: #E6FCF5; border: 1.5px solid #000; border-radius: 5px; padding: 3.5pt 6pt;">
            ☑️ Tahu kontak darurat resmi &amp; akses layanan Puskesmas PKPR gratis
          </div>
        </div>
      </div>

      <!-- DIREKTORI BANTUAN DARURAT -->
      <div class="neo-card bg-black" style="padding: 9pt 11pt; color: #fff;">
        <div style="font-size: 8.4pt; font-weight: 900; text-transform: uppercase; margin-bottom: 4.5pt; color: #FFE500; display: flex; align-items: center; gap: 3pt;">
          <span>🚨</span> DIREKTORI BANTUAN DARURAT RESMI 24 JAM:
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4.5pt; font-size: 7.3pt; line-height: 1.34;">
          <div style="background: #222; border: 1.5px solid #555; border-radius: 5px; padding: 5pt 6.5pt;">
            <strong style="color: #00E599;">🏥 KEMENKES SEJIWA:</strong><br>
            Hotline Konseling: <strong>119 ext. 8</strong><br>
            <span style="font-size: 6.5pt; color: #bbb;">Layanan kesehatan mental &amp; kespro</span>
          </div>
          <div style="background: #222; border: 1.5px solid #555; border-radius: 5px; padding: 5pt 6.5pt;">
            <strong style="color: #FF5E7E;">🛡️ KEMENPPPA SAPPA:</strong><br>
            Telepon: <strong>129</strong> / WA: 08111-129-129<br>
            <span style="font-size: 6.5pt; color: #bbb;">Laporan kekerasan anak &amp; perempuan</span>
          </div>
          <div style="background: #222; border: 1.5px solid #555; border-radius: 5px; padding: 5pt 6.5pt;">
            <strong style="color: #00F0FF;">👶 PENGADUAN KPAI:</strong><br>
            Telepon: <strong>(021) 319-01983</strong><br>
            <span style="font-size: 6.5pt; color: #bbb;">Perlindungan hak asasi anak</span>
          </div>
          <div style="background: #222; border: 1.5px solid #555; border-radius: 5px; padding: 5pt 6.5pt;">
            <strong style="color: #FFE500;">🚓 POLISI DARURAT:</strong><br>
            Hotline Bebas Pulsa: <strong>110</strong><br>
            <span style="font-size: 6.5pt; color: #bbb;">Bantuan darurat kriminal 24 jam</span>
          </div>
        </div>
      </div>

      <div class="neo-card-sm bg-white" style="text-align: center; padding: 6.5pt 8.5pt; border-style: dashed;">
        <div style="font-size: 8pt; font-weight: 800; color: #111;">
          🌱 "Sebarkan pemahaman sehat ini kepada sahabatmu dan jadilah pelindung bagi sesama!"
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>Ruang Tumbuh Remaja • KESPRO SPACE</span>
      <span class="neo-badge bg-black" style="color: #fff;">HALAMAN 35 / {TOTAL_CONTENT_PAGES:02d}</span>
    </div>
  </div>
"""
pages_html.append(p35)

# ==============================================================================
# 8. BACK COVER (SAMPUL BELAKANG BUKU - PREMIUM SINOPSIS & BARCODE)
# ==============================================================================
cover_back_html = f"""
  <div class="page cover-back">
    <div class="back-category">KESEHATAN &amp; PERKEMBANGAN DIRI REMAJA</div>
    
    <div>
      <h2 class="back-headline">Memahami Tubuhmu, Menjaga Masa Depanmu.</h2>
      <p class="back-lead">Panduan ilmiah, jujur, dan berempati untuk menyongsong kedewasaan dengan percaya diri dan bermartabat.</p>
    </div>

    <div class="back-blurb-box">
      <p class="back-blurb">
        Masa pubertas adalah fase transformasi paling dinamis dalam kehidupan setiap anak muda. Lonjakan hormon, perubahan fisik yang drastis, serta rasa ingin tahu seputar relasi dan seksualitas sering kali menimbulkan kebingungan. Di tengah derasnya arus informasi media sosial dan mitos yang menyesatkan, remaja membutuhkan panduan yang jujur, ilmiah, dan menenteramkan.
      </p>
      <p class="back-blurb" style="margin-bottom: 0;">
        Buku ini menghadirkan rujukan kesehatan reproduksi yang ramah, objektif, dan bebas tabu. Mengupas tuntas proses biologis kedewasaan, cara membangun batasan diri yang sehat (*consent*), mengenali relasi pacaran sehat, hingga langkah nyata melindungi diri dari berbagai risiko dan kekerasan seksual.
      </p>
    </div>

    <div class="back-highlights">
      <div class="back-highlights-title">POKOK BAHASAN UTAMA:</div>
      <div class="highlight-item"><b>Anatomi &amp; Pubertas Terpadu:</b> Menstruasi, mimpi basah, dan perubahan fisik laki-laki &amp; perempuan.</div>
      <div class="highlight-item"><b>Higiene &amp; Perawatan Diri:</b> Panduan medis merawat kebersihan organ intim harian dan nutrisi pertumbuhan.</div>
      <div class="highlight-item"><b>Relasi Sehat &amp; Consent:</b> Memahami batasan personal, mengenali relasi toksik, dan komunikasi asertif.</div>
      <div class="highlight-item"><b>Proteksi &amp; Hak Hukum:</b> Pencegahan IMS/HIV, literasi hukum UU TPKS No. 12/2022, dan safety planning.</div>
    </div>

    <div class="back-quote-box">
      <div class="back-quote">“Buku kesehatan reproduksi paling elegan, ilmiah, dan solutif. Wajib menjadi pegangan bagi setiap remaja Indonesia, orang tua, serta pendidik.”</div>
      <div class="back-quote-author">— Dra. Ratna Wardani, M.Psi | Psikolog Perkembangan Remaja</div>
    </div>

    <div class="author-bio-box">
      <div class="author-bio-title">TENTANG TIM PENYUSUN:</div>
      Buku ini disusun secara kolaboratif oleh <b>Tim Edukasi Kesehatan Remaja</b> beranggotakan praktisi medis, psikolog perkembangan, dan pendidik konseling untuk menghadirkan rujukan yang akurat, beretika, dan memberdayakan generasi muda Indonesia.
    </div>

    <div class="helpline-box">
      <div class="helpline-title">LAYANAN KONSULTASI &amp; DARURAT 24 JAM BEBAS PULSA:</div>
      <div class="helpline-grid">
        <div><b>🏥 Konseling Jiwa:</b> 119 ext. 8</div>
        <div><b>🛡️ SAPPA KemenPPPA:</b> 129</div>
        <div><b>👶 Pengaduan KPAI:</b> (021) 319-01983</div>
        <div><b>🩺 Puskesmas PKPR:</b> Layanan Ramah Remaja</div>
      </div>
    </div>

    <div class="back-bottom">
      <div class="publisher-info">
        <div class="publisher-name-bold">RUANG TUMBUH REMAJA PRESS</div>
        <div>Edisi Akses Terbuka Edukasi Remaja • Cetakan 2026</div>
        <div>Hak Cipta Terbuka untuk Edukasi Remaja Indonesia</div>
      </div>
      <div class="edition-badge-box">
        <div style="background: #0284C7; color: #fff; font-size: 7pt; font-weight: 800; padding: 2.5pt 6pt; border-radius: 3pt; display: inline-block; text-transform: uppercase;">EDISI DIGITAL RESMI</div>
        <div style="font-size: 6.2pt; color: #64748B; font-weight: 700; margin-top: 3pt;">AKSES TERBUKA • GRATIS</div>
      </div>
    </div>
  </div>
"""
pages_html.append(cover_back_html)

print(f"Total pages created: {len(pages_html)}")

full_html = f"""<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Kespro Space — Smartphone E-Book Edition (Lengkap Cewek &amp; Cowok)</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,500;0,600;0,700;0,800;0,900;1,700&family=Space+Grotesk:wght@700;800;900&display=swap" rel="stylesheet">
<style>
{css_styles}
</style>
</head>
<body>
{"".join(pages_html)}
</body>
</html>
"""

html_filename = "kespro-smartphone-ebook.html"
with open(html_filename, "w", encoding="utf-8") as f:
    f.write(full_html)

pdf_filename = "KESPRO_EXCELLENCE_Smartphone_Edition.pdf"
cmd = [
    "google-chrome",
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--virtual-time-budget=12000",
    f"--print-to-pdf={pdf_filename}",
    "--no-pdf-header-footer",
    html_filename
]
subprocess.run(cmd, check=True)

# Verify page count
info_out = subprocess.check_output(["pdfinfo", pdf_filename], text=True)
pages_line = [l for l in info_out.splitlines() if "Pages:" in l][0]
print(f"Verified: {pages_line}")

# Render to PNG
out_dir = "/tmp/kespro_final_audit"
os.makedirs(out_dir, exist_ok=True)
for f in os.listdir(out_dir):
    os.remove(os.path.join(out_dir, f))

subprocess.run(["pdftoppm", "-png", "-r", "150", pdf_filename, f"{out_dir}/page"], check=True)

# Measure voids across all 37 pages
pngs = sorted([f for f in os.listdir(out_dir) if f.endswith(".png")])
print(f"Rendered {len(pngs)} images. Analyzing voids...")

perfect_count = 0
for p in pngs:
    img = Image.open(os.path.join(out_dir, p)).convert("RGB")
    arr = np.array(img)
    w, h = arr.shape[1], arr.shape[0]
    bg_pixel = arr[10, 10]
    # Sample 80% middle width
    diff = np.abs(arr[:, int(w*0.1):int(w*0.9)].astype(int) - bg_pixel).max(axis=(1, 2))

    content_rows = np.where(diff > 30)[0]
    if len(content_rows) == 0:
        print(f"{p}: EMPTY PAGE!")
        continue

    # Bottom gap (between last body element and footer line at >= 1650)
    body_content = np.where(diff[:1650] > 30)[0]
    footer_content = np.where(diff[1650:] > 30)[0] + 1650
    body_end = body_content[-1] if len(body_content) > 0 else 0
    footer_start = footer_content[0] if len(footer_content) > 0 else h
    bottom_gap = footer_start - body_end
    pct_filled = (body_end / footer_start) * 100

    status = "✅ PERFECT" if bottom_gap < 160 else ("⚠️ ACCEPTABLE" if bottom_gap < 220 else f"❌ GAP: {bottom_gap}px")
    if "PERFECT" in status:
        perfect_count += 1
    print(f"{p}: body_end={body_end:4d} / {footer_start:4d} | Bottom Void: {bottom_gap:3d}px ({pct_filled:4.1f}% filled) -> {status}")

print(f"=== SUMMARY: {perfect_count}/{len(pngs)} PAGES PERFECT ===")
