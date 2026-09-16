// ==========================================================================
// KESPRO SPACE - Application Logic (Dual-Track Persona, Closed Hub & PWA)
// ==========================================================================

let currentTrack = (new URLSearchParams(window.location.search).get('track')) || localStorage.getItem('kespro_track') || 'girl'; // 'girl' or 'boy'
let currentChapterId = 1;
let currentFontSize = 'reader-font-md';
let currentActiveTool = null;

// Initialize Application on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initTrackUI();
  renderChapterList('all', '');
  renderInteractiveHub();
  updateSafetySummary();
  updateNotesTab();
  registerServiceWorker();

  // Hash route handler for quick tab & chapter navigation
  handleHashRoute();
  window.addEventListener('hashchange', handleHashRoute);
});

function handleHashRoute() {
  const hash = window.location.hash;
  if (hash === '#interactive') {
    switchTab('tab-interactive', document.querySelectorAll('.nav-item')[1]);
  } else if (hash === '#safety') {
    switchTab('tab-safety', document.querySelectorAll('.nav-item')[2]);
  } else if (hash === '#notes') {
    switchTab('tab-notes', document.querySelectorAll('.nav-item')[3]);
  } else if (hash.startsWith('#chapter-')) {
    const cid = parseInt(hash.replace('#chapter-', ''));
    if (cid && typeof EBOOK_CHAPTERS !== 'undefined') openChapter(cid);
  } else if (hash.startsWith('#tool-')) {
    const toolKey = hash.replace('#tool-', '');
    if (['safety_card', 'safety_guide', 'safety_hotline'].includes(toolKey)) {
      switchTab('tab-safety', document.querySelectorAll('.nav-item')[2]);
    } else {
      switchTab('tab-interactive', document.querySelectorAll('.nav-item')[1]);
    }
    openInteractiveTool(toolKey);
  } else {
    switchTab('tab-ebook', document.querySelectorAll('.nav-item')[0]);
  }
}

// ==========================================================================
// TRACK PERSONA (SINGLE SOURCE OF TRUTH: CEWEK VS COWOK)
// ==========================================================================
function initTrackUI() {
  const pill = document.getElementById('header-track-pill');
  if (!pill) return;

  if (currentTrack === 'girl') {
    pill.className = 'track-pill girl';
    pill.innerHTML = '<span>🙋‍♀️ Jalur Cewek</span> <span>🔄</span>';
  } else {
    pill.className = 'track-pill boy';
    pill.innerHTML = '<span>🙋‍♂️ Jalur Cowok</span> <span>🔄</span>';
  }

  const trackStatusText = document.getElementById('track-status-text');
  if (trackStatusText) {
    trackStatusText.innerText = currentTrack === 'girl' ? 'Jalur Cewek 🙋‍♀️' : 'Jalur Cowok 🙋‍♂️';
  }
}

function switchTrack(track) {
  currentTrack = track;
  localStorage.setItem('kespro_track', track);
  initTrackUI();
  renderChapterList();
  renderInteractiveHub();
  updateNotesTab();

  // If a tool modal is currently open and it's track-sensitive (anatomy or track_tool), refresh it
  if (currentActiveTool === 'anatomy' || currentActiveTool === 'track_tool') {
    openInteractiveTool(currentActiveTool);
  }

  showToast(track === 'girl' ? '💖 Beralih ke Jalur Cewek!' : '⚡ Beralih ke Jalur Cowok!');
}

function toggleTrackPrompt() {
  const nextTrack = currentTrack === 'girl' ? 'boy' : 'girl';
  switchTrack(nextTrack);
}

// ==========================================================================
// TAB NAVIGATION (4 MAIN TABS)
// ==========================================================================
function switchTab(tabId, el) {
  document.querySelectorAll('.tab-view').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const target = document.getElementById(tabId);
  if (target) target.classList.add('active');
  if (el) el.classList.add('active');

  // Close overlays when switching main tabs
  closeReader();
  closeInteractiveTool();

  if (tabId === 'tab-notes') {
    updateNotesTab();
  } else if (tabId === 'tab-safety') {
    updateSafetySummary();
  }
}

// ==========================================================================
// TAB 1: E-BOOK CATALOG & SEARCH
// ==========================================================================
let currentCatFilter = 'all';

function filterCategory(cat, pillEl) {
  currentCatFilter = cat;
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
  if (pillEl) pillEl.classList.add('active');
  
  const query = document.getElementById('search-input')?.value || '';
  renderChapterList(cat, query);
}

function onSearchInput(val) {
  renderChapterList(currentCatFilter, val.trim());
}

function renderChapterList(cat = currentCatFilter, query = '') {
  const listContainer = document.getElementById('chapter-list-container');
  if (!listContainer || typeof EBOOK_CHAPTERS === 'undefined') return;

  const q = query.toLowerCase();

  const filtered = EBOOK_CHAPTERS.filter(c => {
    let matchCat = true;
    if (cat === 'kenali') {
      matchCat = ['KENALI DIRIMU', 'DASAR KESPRO', 'KETERAMPILAN HIDUP'].includes(c.category);
    } else if (cat === 'tubuh') {
      matchCat = ['PUBERTAS', 'ANATOMI', 'REPRODUKSI CEWEK', 'REPRODUKSI COWOK'].includes(c.category);
    } else if (cat === 'relasi') {
      matchCat = ['BATASAN DIRI', 'RELASI & CONSENT', 'RELASI SEHAT', 'KOMUNIKASI', 'GENDER & SOSIAL'].includes(c.category);
    } else if (cat === 'sehat') {
      matchCat = ['GIZI & HYGIENE', 'KEHAMILAN', 'PENCEGAHAN', 'KESEHATAN REPRODUKSI', 'HIV & AIDS'].includes(c.category);
    } else if (cat === 'keamanan') {
      matchCat = ['EMPATI & HAK ASASI', 'ANTI KEKERASAN', 'SAFETY PLAN', 'MENTAL HEALTH', 'DIGITAL SAFETY', 'ANTI NAPZA', 'LAYANAN BANTUAN', 'PENDAMPING'].includes(c.category);
    }

    let matchQuery = true;
    if (q) {
      matchQuery = c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.html.toLowerCase().includes(q);
    }

    return matchCat && matchQuery;
  });

  if (filtered.length === 0) {
    listContainer.innerHTML = `
      <div class="m-card" style="padding: 24px; text-align: center;">
        <div style="font-size: 32px;">🔍</div>
        <div style="font-weight: 800; margin-top: 6px;">Tidak Ada Bab yang Cocok</div>
        <p style="font-size: 12px; color: #666; margin-top: 4px;">Coba kata kunci lain atau pilih kategori 'Semua Bab'.</p>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = filtered.map(c => {
    const isRead = localStorage.getItem('kespro_read_' + c.id) === 'true';
    const isBookmarked = localStorage.getItem('kespro_bm_' + c.id) === 'true';

    let trackBadge = '';
    if (c.track === 'girl') {
      trackBadge = currentTrack === 'girl' 
        ? '<span class="badge badge-pink">💖 Spesial Cewek</span>'
        : '<span class="badge badge-lavender">👀 Kacamata Cewek</span>';
    } else if (c.track === 'boy') {
      trackBadge = currentTrack === 'boy'
        ? '<span class="badge badge-blue">⚡ Spesial Cowok</span>'
        : '<span class="badge badge-lavender">👀 Kacamata Cowok</span>';
    }

    return `
      <div class="chapter-card" onclick="openChapter(${c.id})">
        <div class="chapter-left">
          <div class="chap-num">${c.id < 10 ? '0' + c.id : c.id}</div>
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; gap: 4px; align-items: center; flex-wrap: wrap; margin-bottom: 2px;">
              <span class="badge badge-yellow" style="font-size: 9px; padding: 1px 6px; margin: 0;">${c.category}</span>
              ${trackBadge}
            </div>
            <div class="chapter-title">${c.icon} ${c.title}</div>
            ${c.hook ? `<div style="font-size: 11px; color: #52525B; margin: 2px 0 4px 0; line-height: 1.35;">${c.hook}</div>` : ''}
            <div class="chapter-meta">
              <span>⏱️ ${c.readTime || '±3 mnt baca'}</span>
              ${isBookmarked ? '<span>• ⭐ Tersimpan</span>' : ''}
            </div>
          </div>
        </div>
        <div class="status-check">
          ${isRead ? '✅' : '👉'}
        </div>
      </div>
    `;
  }).join('');
}

// ==========================================================================
// IN-APP FULLSCREEN READER VIEW
// ==========================================================================
function openChapter(id) {
  const chapter = EBOOK_CHAPTERS.find(c => c.id === id);
  if (!chapter) return;

  currentChapterId = id;
  const overlay = document.getElementById('reader-overlay');
  const titleEl = document.getElementById('reader-title');
  const categoryEl = document.getElementById('reader-category');
  const bodyEl = document.getElementById('reader-content');
  const bmBtn = document.getElementById('reader-bm-btn');
  const prevBtn = document.getElementById('reader-prev-btn');
  const nextBtn = document.getElementById('reader-next-btn');
  const markReadBtn = document.getElementById('reader-mark-read-btn');

  titleEl.innerText = `${chapter.icon} ${chapter.title}`;
  categoryEl.innerText = `${chapter.category} • BAB ${chapter.id}`;
  
  bodyEl.className = `reader-body custom-scroll ${currentFontSize}`;
  
  // Custom injection for Chapter 13 (Anatomi)
  if (id === 13) {
    bodyEl.innerHTML = renderChapter13Custom();
  } else {
    bodyEl.innerHTML = chapter.html;
  }

  const isBm = localStorage.getItem('kespro_bm_' + id) === 'true';
  bmBtn.innerText = isBm ? '⭐' : '☆';

  const isRead = localStorage.getItem('kespro_read_' + id) === 'true';
  markReadBtn.innerHTML = isRead ? '✅ Sudah Selesai Dibaca' : '✔️ Tandai Sudah Dibaca';
  markReadBtn.className = isRead ? 'btn-m btn-m-mint' : 'btn-m btn-m-white';

  prevBtn.style.display = id > 1 ? 'inline-flex' : 'none';
  nextBtn.style.display = id < EBOOK_CHAPTERS.length ? 'inline-flex' : 'none';

  bodyEl.scrollTop = 0;
  updateReadingProgress();

  overlay.style.display = 'flex';
}

function closeReader() {
  const overlay = document.getElementById('reader-overlay');
  if (overlay) overlay.style.display = 'none';
  renderChapterList();
  updateNotesTab();
}

function navigateChapter(delta) {
  const newId = currentChapterId + delta;
  if (newId >= 1 && newId <= EBOOK_CHAPTERS.length) {
    openChapter(newId);
  }
}

function toggleBookmarkCurrent() {
  const key = 'kespro_bm_' + currentChapterId;
  const isBm = localStorage.getItem(key) === 'true';
  localStorage.setItem(key, (!isBm).toString());

  const bmBtn = document.getElementById('reader-bm-btn');
  bmBtn.innerText = !isBm ? '⭐' : '☆';
  showToast(!isBm ? '⭐ Bab disimpan ke Catatanku!' : 'Dihapus dari simpanan');
  updateNotesTab();
}

function toggleReadCurrent() {
  const key = 'kespro_read_' + currentChapterId;
  const isRead = localStorage.getItem(key) === 'true';
  localStorage.setItem(key, (!isRead).toString());

  const markReadBtn = document.getElementById('reader-mark-read-btn');
  markReadBtn.innerHTML = !isRead ? '✅ Sudah Selesai Dibaca' : '✔️ Tandai Sudah Dibaca';
  markReadBtn.className = !isRead ? 'btn-m btn-m-mint' : 'btn-m btn-m-white';

  showToast(!isRead ? '🎉 Hebat! 1 Bab selesai dibaca.' : 'Status baca dibatalkan');
  updateNotesTab();
}

function changeFontSize() {
  const bodyEl = document.getElementById('reader-content');
  if (currentFontSize === 'reader-font-sm') {
    currentFontSize = 'reader-font-md';
  } else if (currentFontSize === 'reader-font-md') {
    currentFontSize = 'reader-font-lg';
  } else {
    currentFontSize = 'reader-font-sm';
  }
  bodyEl.className = `reader-body custom-scroll ${currentFontSize}`;
}

function updateReadingProgress() {
  const body = document.getElementById('reader-content');
  const bar = document.getElementById('reader-prog-bar');
  if (!body || !bar) return;

  const scrolled = body.scrollTop;
  const total = body.scrollHeight - body.clientHeight;
  const percent = total > 0 ? (scrolled / total) * 100 : 0;
  bar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
}

// Chapter 13 in Reader: Strictly adheres to active track (Zero ambiguous switchers)
function renderChapter13Custom() {
  if (currentTrack === 'girl') {
    return `
      <p class="m-read-p">
        Tiap organ reproduksi punya tugas biologis yang sangat penting dan saling terhubung. Paham nama medis dan fungsinya bakal ngebantu kamu merawat tubuh dengan benar dan nggak canggung kalau perlu konsultasi ke dokter.
      </p>

      <div class="m-sub-badge">KHUSUS JALUR CEWEK 🙋‍♀️</div>
      <div class="m-img-wrap">
        <img src="assets/anatomy-female.jpg" alt="Anatomi Reproduksi Perempuan" class="m-content-img">
        <div class="m-img-caption">Diagram visual sistem reproduksi perempuan (Memphis Pop Art).</div>
      </div>
      
      <h3 class="m-read-h3">Organ Utama pada Perempuan:</h3>
      <ul class="m-read-list">
        <li><b>Ovarium (Indung Telur):</b> Memproduksi sel telur (ovum) dan hormon estrogen/progesteron; terhubung ke rahim lewat saluran tuba falopi.</li>
        <li><b>Uterus (Rahim):</b> Tempat yang aman bagi janin untuk tumbuh jika terjadi kehamilan; bagian leher bawahnya disebut serviks.</li>
        <li><b>Vagina:</b> Saluran berotot yang elastis menghubungkan serviks ke bagian luar tubuh; jalur keluarnya darah haid dan jalan lahir bayi.</li>
      </ul>

      <div class="m-callout m-callout-pink">
        <b>🩸 Higienitas Emas Cewek:</b> Selalu basuh dari arah <b>depan ke belakang</b> dengan air bersih agar bakteri usus tidak masuk ke saluran reproduksi.
      </div>

      <div class="m-source-box">
        <b>📚 Sumber Bagian:</b> Modul Kesehatan Reproduksi Remaja Luar Sekolah (2021), Bagian 3 Sesi 2.
      </div>
    `;
  } else {
    return `
      <p class="m-read-p">
        Tiap organ reproduksi punya tugas biologis yang sangat penting dan saling terhubung. Paham nama medis dan fungsinya bakal ngebantu kamu merawat tubuh dengan benar dan nggak canggung kalau perlu konsultasi ke dokter.
      </p>

      <div class="m-sub-badge">KHUSUS JALUR COWOK 🙋‍♂️</div>
      <div class="m-img-wrap">
        <img src="assets/anatomy-male.jpg" alt="Anatomi Reproduksi Laki-Laki" class="m-content-img">
        <div class="m-img-caption">Diagram visual sistem reproduksi laki-laki (Memphis Pop Art).</div>
      </div>

      <h3 class="m-read-h3">Organ Utama pada Laki-Laki:</h3>
      <ul class="m-read-list">
        <li><b>Skrotum & Testis:</b> Skrotum adalah kantung pelindung testis yang mengatur suhunya; testis bertugas memproduksi sperma dan hormon testosteron.</li>
        <li><b>Epididimis & Vas Deferens:</b> Epididimis adalah tempat pematangan sperma; lalu disalurkan melalui saluran vas deferens saat proses ejakulasi.</li>
        <li><b>Uretra & Penis:</b> Uretra adalah saluran dalam penis yang mengalirkan urine dan cairan semen (pada waktu yang berbeda); penis adalah organ genital luar.</li>
      </ul>

      <div class="m-callout m-callout-blue">
        <b>🌊 Higienitas Emas Cowok:</b> Bersihkan area genital secara rutin saat mandi, cuci tangan sebelum dan sesudah buang air kecil, dan ganti celana dalam yang lembap.
      </div>

      <div class="m-source-box">
        <b>📚 Sumber Bagian:</b> Modul Kesehatan Reproduksi Remaja Luar Sekolah (2021), Bagian 3 Sesi 2.
      </div>
    `;
  }
}

// ==========================================================================
// TAB 2: INTERACTIVE TOOLS (CLOSED CARDS HUB PATTERN)
// ==========================================================================
function renderInteractiveHub() {
  const container = document.getElementById('interactive-hub-container');
  if (!container) return;

  const isGirl = currentTrack === 'girl';

  // Card 1: Anatomy Explorer (Strictly based on active track)
  const anatomyBadge = isGirl ? 'badge-pink' : 'badge-blue';
  const anatomyTrackTitle = isGirl ? 'Organ Reproduksi Perempuan 🙋‍♀️' : 'Organ Reproduksi Laki-Laki 🙋‍♂️';
  const anatomyTrackDesc = isGirl 
    ? 'Kenali fungsi ovarium, rahim, saluran tuba falopi, dan serviks secara ilmiah, aman, dan ramah.'
    : 'Pahami fungsi biologis testis, skrotum, epididimis, dan uretra tanpa rasa tabu atau canggung.';
  const anatomyBtnText = isGirl ? 'Eksplorasi Organ Cewek 👉' : 'Eksplorasi Organ Cowok 👉';

  // Card 5: Persona Track Specific Tool
  const trackToolBadge = isGirl ? 'badge-pink' : 'badge-blue';
  const trackToolTitle = isGirl ? 'Prediksi Siklus Haid & Kram Care 🩸' : 'Perisai Tongkrongan & Mitos Cowok ⚡';
  const trackToolDesc = isGirl
    ? 'Hitung perkiraan tanggal menstruasi berikutnya & tips praktis meredakan nyeri kram perut (dismenore).'
    : 'Jurus keren menolak ajakan berisiko (vape, miras, bokep) & fakta ilmiah seputar mimpi basah.';
  const trackToolBtnText = isGirl ? 'Buka Prediksi Haid 👉' : 'Buka Perisai Cowok 👉';

  container.innerHTML = `
    <!-- Card 1: Anatomy Explorer -->
    <div class="tool-hub-card" onclick="openInteractiveTool('anatomy')">
      <div class="tool-hub-header">
        <span class="badge ${anatomyBadge}">ANATOMI BIOLOGIS</span>
        <span style="font-size: 20px;">🫀</span>
      </div>
      <div class="tool-hub-title">${anatomyTrackTitle}</div>
      <div class="tool-hub-desc">${anatomyTrackDesc}</div>
      <button class="btn-m ${isGirl ? 'btn-m-pink' : 'btn-m-blue'} btn-m-block" style="font-size: 12px; padding: 8px;">
        ${anatomyBtnText}
      </button>
    </div>

    <!-- Card 2: Radar Cinta -->
    <div class="tool-hub-card" onclick="openInteractiveTool('radar')">
      <div class="tool-hub-header">
        <span class="badge badge-mint">RELASI & BATASAN</span>
        <span style="font-size: 20px;">🚩</span>
      </div>
      <div class="tool-hub-title">Radar Cinta: Red Flag vs Green Flag 🟢</div>
      <div class="tool-hub-desc">
        Uji kepekaanmu mendeteksi tanda pacaran sehat vs toxic relationship lewat 5 skenario nyata dari buklet.
      </div>
      <button class="btn-m btn-m-mint btn-m-block" style="font-size: 12px; padding: 8px;">
        Mulai Uji Radar Cinta 👉
      </button>
    </div>

    <!-- Card 3: Boba & GGL Calculator -->
    <div class="tool-hub-card" onclick="openInteractiveTool('ggl')">
      <div class="tool-hub-header">
        <span class="badge badge-yellow">STANDAR KEMENKES RI</span>
        <span style="font-size: 20px;">🧋</span>
      </div>
      <div class="tool-hub-title">Kalkulator Boba, Kopi & GGL</div>
      <div class="tool-hub-desc">
        Hitung batas aman gula (maks 50g) dan kafein harian sesuai berat badan tubuhmu dengan meteran warna real-time.
      </div>
      <button class="btn-m btn-m-yellow btn-m-block" style="font-size: 12px; padding: 8px;">
        Hitung Batas Jajananmu 👉
      </button>
    </div>

    <!-- Card 4: Asertif Generator -->
    <div class="tool-hub-card" onclick="openInteractiveTool('asertif')">
      <div class="tool-hub-header">
        <span class="badge badge-lavender">KOMUNIKASI ASERTIF</span>
        <span style="font-size: 20px;">💬</span>
      </div>
      <div class="tool-hub-title">Generator Bicara Asertif ("I-Statement")</div>
      <div class="tool-hub-desc">
        Susun kalimat tegas dan sopan untuk menolak hal yang bikin risih tanpa merusak pertemanan.
      </div>
      <button class="btn-m btn-m-lavender btn-m-block" style="font-size: 12px; padding: 8px;">
        Susun Kalimat Asertif 👉
      </button>
    </div>

    <!-- Card 5: Persona Specific Tool -->
    <div class="tool-hub-card" onclick="openInteractiveTool('track_tool')">
      <div class="tool-hub-header">
        <span class="badge ${trackToolBadge}">KHUSUS JALUR</span>
        <span style="font-size: 20px;">${isGirl ? '🩸' : '⚡'}</span>
      </div>
      <div class="tool-hub-title">${trackToolTitle}</div>
      <div class="tool-hub-desc">${trackToolDesc}</div>
      <button class="btn-m ${isGirl ? 'btn-m-pink' : 'btn-m-blue'} btn-m-block" style="font-size: 12px; padding: 8px;">
        ${trackToolBtnText}
      </button>
    </div>
  `;
}

// ==========================================================================
// FOCUSED TOOL MODAL (OPENS CLOSED CARDS)
// ==========================================================================
function openInteractiveTool(toolKey) {
  currentActiveTool = toolKey;
  const overlay = document.getElementById('tool-modal-overlay');
  const badgeEl = document.getElementById('tool-modal-badge');
  const titleEl = document.getElementById('tool-modal-title');
  const bodyEl = document.getElementById('tool-modal-body');

  if (!overlay || !bodyEl) return;

  const isGirl = currentTrack === 'girl';

  if (toolKey === 'anatomy') {
    badgeEl.innerText = isGirl ? 'ANATOMI PEREMPUAN' : 'ANATOMI LAKI-LAKI';
    titleEl.innerText = isGirl ? 'Organ Reproduksi Cewek 🙋‍♀️' : 'Organ Reproduksi Cowok 🙋‍♂️';
    bodyEl.innerHTML = renderAnatomyToolContent();
    setupAnatomyHotspots();
  } 
  else if (toolKey === 'radar') {
    badgeEl.innerText = 'RELASI & BATASAN';
    titleEl.innerText = '🚩 Red Flag vs 🟢 Green Flag';
    bodyEl.innerHTML = renderRadarToolContent();
    loadRadarCase(0);
  }
  else if (toolKey === 'ggl') {
    badgeEl.innerText = 'STANDAR KEMENKES RI';
    titleEl.innerText = '🧋 Kalkulator Jajanan Gaul';
    bodyEl.innerHTML = renderGGLToolContent();
    updateGGL();
  }
  else if (toolKey === 'asertif') {
    badgeEl.innerText = 'KOMUNIKASI EFEKTIF';
    titleEl.innerText = '💬 Generator Bicara Asertif';
    bodyEl.innerHTML = renderAsertifToolContent();
    updateIStatement();
  }
  else if (toolKey === 'track_tool') {
    if (isGirl) {
      badgeEl.innerText = 'KHUSUS CEWEK';
      titleEl.innerText = '🩸 Prediksi Haid & Kram Care';
      bodyEl.innerHTML = renderGirlToolContent();
    } else {
      badgeEl.innerText = 'KHUSUS COWOK';
      titleEl.innerText = '⚡ Perisai Tongkrongan & Mitos Cowok';
      bodyEl.innerHTML = renderBoyToolContent();
    }
  }
  else if (toolKey === 'safety_card') {
    badgeEl.innerText = 'EMERGENCY CARD';
    titleEl.innerText = '📋 Kartu Rencana Keselamatanku';
    bodyEl.innerHTML = renderSafetyCardToolContent();
    initSafetyPlan();
  }
  else if (toolKey === 'safety_guide') {
    badgeEl.innerText = 'HAK & PERLINDUNGAN';
    titleEl.innerText = '🛡️ Panduan Tanggap Darurat';
    bodyEl.innerHTML = renderSafetyGuideContent();
  }
  else if (toolKey === 'safety_hotline') {
    badgeEl.innerText = 'LAYANAN RAMAH REMAJA';
    titleEl.innerText = '🏥 Kontak PKPR & Hotline Darurat';
    bodyEl.innerHTML = renderSafetyHotlineContent();
  }

  bodyEl.scrollTop = 0;
  overlay.style.display = 'flex';
}

function closeInteractiveTool() {
  const overlay = document.getElementById('tool-modal-overlay');
  if (overlay) overlay.style.display = 'none';
  currentActiveTool = null;
  updateSafetySummary();
}

// --------------------------------------------------------------------------
// TOOL 1: ANATOMY EXPLORER CONTENT (STRICT TO CURRENT TRACK)
// --------------------------------------------------------------------------
const ANATOMY_STORE = {
  girl: {
    title: 'Sistem Reproduksi Perempuan',
    img: 'assets/anatomy-female.jpg',
    hotspots: [
      { key: 'ovarium', name: '1. Ovarium (Indung Telur)', desc: 'Pabrik penghasil sel telur dan hormon estrogen/progesteron. Tiap bulan ada 1 sel telur matang siap berovulasi.' },
      { key: 'rahim', name: '2. Uterus (Rahim)', desc: 'Rumah aman janin bertumbuh. Jika tidak ada sperma yang membuahi sel telur, lapisan dinding rahim akan meluruh menjadi menstruasi.' },
      { key: 'tuba', name: '3. Tuba Falopi', desc: 'Saluran seperti jembatan yang menghubungkan ovarium ke rahim. Di sinilah tempat sel telur bertemu dan dibuahi sperma.' },
      { key: 'serviks', name: '4. Serviks & Vagina', desc: 'Leher rahim dan saluran elastis jalan keluarnya darah menstruasi serta jalan lahir bayi saat persalinan.' }
    ],
    hygieneTip: '🩸 <b>Higienitas Emas Cewek:</b> Selalu basuh dari arah depan ke belakang dengan air bersih agar bakteri usus tidak masuk ke saluran reproduksi.'
  },
  boy: {
    title: 'Sistem Reproduksi Laki-Laki',
    img: 'assets/anatomy-male.jpg',
    hotspots: [
      { key: 'testis', name: '1. Testis', desc: 'Pabrik alami penghasil jutaan sel sperma setiap hari dan memproduksi hormon testosteron penentu tanda pubertas cowok.' },
      { key: 'skrotum', name: '2. Skrotum', desc: 'Kantung luar pembungkus testis. Berfungsi sebagai pendingin alami pengatur suhu testis agar sperma tetap sehat (suhunya 1-2°C lebih dingin dari suhu tubuh).' },
      { key: 'epididimis', name: '3. Epididimis', desc: 'Saluran gulung di atas testis tempat sperma yang baru diproduksi dimatangkan dan belajar bergerak aktif.' },
      { key: 'vas', name: '4. Vas Deferens & Uretra', desc: 'Saluran pengalir sperma menuju uretra saat ejakulasi. Saluran uretra di dalam penis dipakai bergantian untuk pipis dan cairan sperma (nggak pernah barengan!).' }
    ],
    hygieneTip: '🌊 <b>Higienitas Emas Cowok:</b> Bersihkan area genital secara rutin saat mandi, cuci tangan sebelum dan sesudah buang air kecil, dan ganti celana dalam yang lembap.'
  }
};

function renderAnatomyToolContent() {
  const isGirl = currentTrack === 'girl';
  const data = ANATOMY_STORE[currentTrack];

  return `
    <div class="m-card ${isGirl ? 'm-card-pink' : 'm-card-blue'}" style="margin-bottom: 12px;">
      <span class="badge ${isGirl ? 'badge-pink' : 'badge-blue'}">JALUR ${isGirl ? 'CEWEK' : 'COWOK'} AKTIF</span>
      <h3 style="font-family: var(--font-heading); font-size: 16px; margin-bottom: 4px;">${data.title}</h3>
      <p style="font-size: 12px; color: #444; line-height: 1.4;">
        Sentuh salah satu tombol organ di bawah gambar untuk melihat fungsi biologis dan penjelasannya secara mendalam.
      </p>
    </div>

    <div class="anatomy-box">
      <img src="${data.img}" alt="${data.title}" class="anatomy-img">
      <div class="hotspot-row" id="anatomy-hotspots-container"></div>
    </div>

    <div id="anatomy-info-box" class="m-callout ${isGirl ? 'm-callout-pink' : 'm-callout-yellow'}" style="margin: 10px 0;"></div>

    <div class="m-callout ${isGirl ? 'm-callout-mint' : 'm-callout-mint'}" style="margin-top: 10px; font-size: 12px;">
      ${data.hygieneTip}
    </div>

    <div style="background: #F4EFEA; border: 1.5px dashed var(--ink); border-radius: 10px; padding: 10px; margin-top: 14px; font-size: 11px; color: #555;">
      💡 <i>Ingin mempelajari anatomi lawan jenis? Kamu bisa beralih jalur kapan saja melalui tombol ganti jalur di header atas!</i>
    </div>
  `;
}

function setupAnatomyHotspots() {
  const data = ANATOMY_STORE[currentTrack];
  const container = document.getElementById('anatomy-hotspots-container');
  if (!container) return;

  container.innerHTML = data.hotspots.map((h, i) => `
    <button class="hotspot-chip ${i === 0 ? 'active' : ''}" onclick="selectHotspotItem('${h.key}', this)">
      ${h.name}
    </button>
  `).join('');

  showHotspotDetail(data.hotspots[0].name, data.hotspots[0].desc);
}

function selectHotspotItem(key, chipEl) {
  document.querySelectorAll('.hotspot-chip').forEach(c => c.classList.remove('active'));
  if (chipEl) chipEl.classList.add('active');

  const data = ANATOMY_STORE[currentTrack];
  const item = data.hotspots.find(h => h.key === key);
  if (item) {
    showHotspotDetail(item.name, item.desc);
  }
}

function showHotspotDetail(title, desc) {
  const box = document.getElementById('anatomy-info-box');
  if (box) {
    box.innerHTML = `<b>💡 ${title}:</b><br><span style="color: #333; font-size: 12.5px; line-height: 1.45;">${desc}</span>`;
  }
}

// --------------------------------------------------------------------------
// TOOL 2: RADAR CINTA (RED FLAG VS GREEN FLAG)
// --------------------------------------------------------------------------
const RADAR_CASES = [
  {
    caseText: 'Doi maksa minta password Instagram & minta share-loc 24 jam dengan alasan "Kalau sayang, kamu nggak boleh ada rahasia sama aku".',
    isRed: true,
    reason: '🚩 <b>RED FLAG BESAR!</b> Ini bentuk kontrol berlebihan dan pelanggaran privasi pribadi. Hubungan yang sehat didasari rasa saling percaya, bukan mata-matai!'
  },
  {
    caseText: 'Waktu kamu bilang lagi nggak nyaman buat pegangan tangan di tempat umum, doi berhenti dan menghargai keputusanmu tanpa ngambek atau memusuhi.',
    isRed: false,
    reason: '🟢 <b>GREEN FLAG KEREN!</b> Pasangan yang menghormati batasan kenyamanan (consent) menunjukkan kedewasaan emosi dan respek sejati.'
  },
  {
    caseText: 'Teman tongkrongan mengejekmu "banci" atau "cemen" karena kamu menolak mencoba merokok atau vape.',
    isRed: true,
    reason: '🚩 <b>RED FLAG (TOXIC PEER PRESSURE)!</b> Teman sejati akan menghargai prinsip hidupmu dan tidak memaksakan kebiasaan berisiko.'
  },
  {
    caseText: 'Doi minta kamu membatalkan janjian kumpul keluarga hanya demi nemenin dia nongkrong, lalu mengancam mutusin kalau kamu nggak mau.',
    isRed: true,
    reason: '🚩 <b>RED FLAG (MANIPULASI EMOSI)!</b> Mengisolasi kamu dari keluarga dan mengancam hubungan adalah tanda toxic relationship yang harus diwaspadai.'
  },
  {
    caseText: 'Kalian bisa berbeda pendapat tentang hobi atau musik favorit, tapi tetap saling mendukung tanpa saling merendahkan.',
    isRed: false,
    reason: '🟢 <b>GREEN FLAG POSITIF!</b> Menghargai perbedaan adalah pondasi relasi yang setara dan aman.'
  }
];

let currentRadarIndex = 0;

function renderRadarToolContent() {
  return `
    <div class="m-card m-card-mint">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span class="badge badge-mint">RADAR RELASI SEHAT</span>
        <span id="radar-case-count" style="font-size: 11px; font-weight: 800; color: #444;">Kasus 1 dari 5</span>
      </div>

      <h3 style="font-family: var(--font-heading); font-size: 15px; margin-top: 4px; margin-bottom: 8px;">
        🚩 Red Flag vs 🟢 Green Flag
      </h3>

      <div style="background: #FFF; border: var(--border-sm); border-radius: 12px; padding: 14px; box-shadow: var(--shadow-sm); margin-bottom: 12px;">
        <p id="radar-case-text" style="font-size: 13.5px; font-weight: 700; line-height: 1.5; color: #18181B;">
          Memuat kasus...
        </p>
      </div>

      <div class="flag-btn-group">
        <button class="flag-btn btn-red" onclick="answerRadar('red')">🚩 RED FLAG</button>
        <button class="flag-btn btn-green" onclick="answerRadar('green')">🟢 GREEN FLAG</button>
      </div>

      <div id="radar-feedback" style="display: none; margin-top: 12px;"></div>

      <button id="radar-next-btn" class="btn-m btn-m-yellow btn-m-block" style="display: none; margin-top: 12px;" onclick="nextRadarCase()">
        Kasus Berikutnya 👉
      </button>
    </div>

    <div class="m-card m-card-yellow">
      <b>🤝 Rumus Emas Persetujuan (Consent):</b>
      <p style="font-size: 12px; line-height: 1.5; margin-top: 4px;">
        • Diam <b>bukan</b> tanda setuju.<br>
        • Terpaksa/takut diputusin <b>bukan</b> persetujuan murni.<br>
        • Kamu <b>selalu berhak bilang TIDAK</b> kapan pun kamu merasa nggak nyaman!
      </p>
    </div>
  `;
}

function loadRadarCase(index) {
  currentRadarIndex = index;
  const c = RADAR_CASES[index];
  const textEl = document.getElementById('radar-case-text');
  const countEl = document.getElementById('radar-case-count');
  const fbEl = document.getElementById('radar-feedback');
  const nextBtn = document.getElementById('radar-next-btn');

  if (textEl) textEl.innerText = `"${c.caseText}"`;
  if (countEl) countEl.innerText = `Kasus ${index + 1} dari ${RADAR_CASES.length}`;
  if (fbEl) fbEl.style.display = 'none';
  if (nextBtn) nextBtn.style.display = 'none';
}

function answerRadar(userChoice) {
  const c = RADAR_CASES[currentRadarIndex];
  const fbEl = document.getElementById('radar-feedback');
  const nextBtn = document.getElementById('radar-next-btn');

  const isCorrect = (userChoice === 'red' && c.isRed) || (userChoice === 'green' && !c.isRed);

  fbEl.style.display = 'block';
  if (isCorrect) {
    fbEl.className = 'm-callout m-callout-mint';
    fbEl.innerHTML = `🎯 <b>JAWABANMU TEPAT SEKALI!</b><br><span style="font-size: 12px; line-height: 1.45;">${c.reason}</span>`;
  } else {
    fbEl.className = 'm-callout m-callout-pink';
    fbEl.innerHTML = `⚠️ <b>EITS, KURANG TEPAT!</b><br><span style="font-size: 12px; line-height: 1.45;">${c.reason}</span>`;
  }

  if (nextBtn) {
    nextBtn.style.display = 'inline-flex';
    nextBtn.innerText = currentRadarIndex < RADAR_CASES.length - 1 ? 'Kasus Berikutnya 👉' : 'Ulangi dari Awal 🔄';
  }
}

function nextRadarCase() {
  const nextIdx = (currentRadarIndex + 1) % RADAR_CASES.length;
  loadRadarCase(nextIdx);
}

// --------------------------------------------------------------------------
// TOOL 3: BOBA & GGL CALCULATOR
// --------------------------------------------------------------------------
function renderGGLToolContent() {
  return `
    <div class="m-card m-card-pink">
      <span class="badge badge-yellow">STANDAR KEMENKES RI</span>
      <h3 style="font-family: var(--font-heading); font-size: 15px; margin-bottom: 4px;">🧋 Kalkulator Jajanan Gaul (GGL & Kafein)</h3>
      <p style="font-size: 11.5px; color: #444; margin-bottom: 10px;">
        Panduan harian: Gula maks 50g (4 sdm/hari), Kafein maks 2.5mg per kg Berat Badan.
      </p>

      <!-- Slider Berat Badan -->
      <div style="background: #fff; border: var(--border-sm); border-radius: 10px; padding: 10px; margin-bottom: 10px;">
        <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 800; margin-bottom: 4px;">
          <span>1. Masukkan Berat Badanmu:</span>
          <span id="weight-val-display" style="color: var(--coral-pink); font-size: 15px;">48 kg</span>
        </div>
        <input type="range" id="weight-slider" min="30" max="95" value="48" style="width: 100%; accent-color: var(--coral-pink);" oninput="updateGGL()">
        <div style="font-size: 10.5px; color: #666; margin-top: 4px;">
          ⚡ Batas aman kafein harianmu: <b id="caffeine-limit-text">120 mg</b>
        </div>
      </div>

      <!-- Checkbox Jajanan -->
      <div style="background: #fff; border: var(--border-sm); border-radius: 10px; padding: 10px; margin-bottom: 10px;">
        <div style="font-weight: 800; font-size: 12px; margin-bottom: 8px;">2. Pilih Jajananmu Hari Ini:</div>
        <div style="display: flex; flex-direction: column; gap: 6px; font-size: 12px;">
          <label style="display: flex; justify-content: space-between; align-items: center; background: #F8F9FA; padding: 8px 10px; border: 1.5px solid var(--ink); border-radius: 8px;">
            <span>🧋 1 Cup Boba Brown Sugar (45g Gula)</span>
            <input type="checkbox" id="check-boba" onchange="updateGGL()">
          </label>
          <label style="display: flex; justify-content: space-between; align-items: center; background: #F8F9FA; padding: 8px 10px; border: 1.5px solid var(--ink); border-radius: 8px;">
            <span>☕ 1 Es Kopi Susu Aren (110mg Kafein)</span>
            <input type="checkbox" id="check-kopi" onchange="updateGGL()">
          </label>
          <label style="display: flex; justify-content: space-between; align-items: center; background: #F8F9FA; padding: 8px 10px; border: 1.5px solid var(--ink); border-radius: 8px;">
            <span>🍜 1 Porsi Mie Instan Gurih (Natrium tinggi)</span>
            <input type="checkbox" id="check-mie" onchange="updateGGL()">
          </label>
          <label style="display: flex; justify-content: space-between; align-items: center; background: #F8F9FA; padding: 8px 10px; border: 1.5px solid var(--ink); border-radius: 8px;">
            <span>🥤 1 Botol Minuman Bersoda (35g Gula)</span>
            <input type="checkbox" id="check-soda" onchange="updateGGL()">
          </label>
          <label style="display: flex; justify-content: space-between; align-items: center; background: #F8F9FA; padding: 8px 10px; border: 1.5px solid var(--ink); border-radius: 8px;">
            <span>🍟 1 Porsi Gorengan / Camilan Minyak (Tinggi Lemak)</span>
            <input type="checkbox" id="check-snack" onchange="updateGGL()">
          </label>
        </div>

        <!-- Meter Gula -->
        <div style="margin-top: 14px;">
          <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 800;">
            <span>Kadar Gula Harian:</span>
            <span id="sugar-meter-text">0g / 50g</span>
          </div>
          <div class="meter-bar">
            <div id="sugar-meter-fill" class="meter-fill" style="width: 0%; background-color: var(--mint-green);"></div>
          </div>
        </div>

        <!-- Meter Kafein -->
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 800;">
            <span>Kadar Kafein:</span>
            <span id="caff-meter-text">0mg / 120mg</span>
          </div>
          <div class="meter-bar">
            <div id="caff-meter-fill" class="meter-fill" style="width: 0%; background-color: var(--soft-blue);"></div>
          </div>
        </div>

        <div id="ggl-advice-box" class="m-callout m-callout-yellow" style="margin-top: 10px; margin-bottom: 0; font-size: 12px;">
          💡 <i>Centang jajanan di atas untuk cek indikator kesehatanmu!</i>
        </div>
      </div>
    </div>
  `;
}

function updateGGL() {
  const weightInput = document.getElementById('weight-slider');
  const weightDisplay = document.getElementById('weight-val-display');
  const caffLimitText = document.getElementById('caffeine-limit-text');

  if (!weightInput) return;

  const weight = parseInt(weightInput.value);
  if (weightDisplay) weightDisplay.innerText = `${weight} kg`;

  const maxCaff = Math.round(weight * 2.5);
  if (caffLimitText) caffLimitText.innerText = `${maxCaff} mg`;

  let sugar = 0;
  let caff = 0;
  let sodium = 0;

  if (document.getElementById('check-boba')?.checked) { sugar += 45; caff += 60; }
  if (document.getElementById('check-kopi')?.checked) { sugar += 25; caff += 110; }
  if (document.getElementById('check-mie')?.checked) { sodium += 1500; sugar += 3; }
  if (document.getElementById('check-soda')?.checked) { sugar += 35; caff += 35; }
  if (document.getElementById('check-snack')?.checked) { sodium += 600; }

  const sugarPercent = Math.min(100, Math.round((sugar / 50) * 100));
  const sugarBar = document.getElementById('sugar-meter-fill');
  const sugarText = document.getElementById('sugar-meter-text');
  if (sugarBar && sugarText) {
    sugarBar.style.width = `${sugarPercent}%`;
    sugarText.innerText = `${sugar}g / 50g`;
    sugarBar.style.backgroundColor = sugarPercent >= 100 ? 'var(--coral-pink)' : (sugarPercent > 60 ? 'var(--primary-yellow)' : 'var(--mint-green)');
  }

  const caffPercent = Math.min(100, Math.round((caff / maxCaff) * 100));
  const caffBar = document.getElementById('caff-meter-fill');
  const caffText = document.getElementById('caff-meter-text');
  if (caffBar && caffText) {
    caffBar.style.width = `${caffPercent}%`;
    caffText.innerText = `${caff}mg / ${maxCaff}mg`;
    caffBar.style.backgroundColor = caffPercent >= 100 ? 'var(--coral-pink)' : 'var(--soft-blue)';
  }

  const adviceBox = document.getElementById('ggl-advice-box');
  if (adviceBox) {
    if (sugarPercent >= 100 || caffPercent >= 100) {
      adviceBox.style.background = '#FFEAEA';
      adviceBox.innerHTML = '🚨 <b>PERINGATAN OVER LIMIT:</b> Asupan gula atau kafeinmu sudah melewati batas aman harian Kemenkes! Yuk ganti minuman berikutnya dengan air putih ya.';
    } else if (sugar > 0 || caff > 0 || sodium > 0) {
      adviceBox.style.background = '#EBF5FF';
      adviceBox.innerHTML = '👍 <b>PILIHAN CERDAS:</b> Masih dalam batas aman harian tubuhmu. Imbangi dengan banyak makan sayur dan buah segar!';
    } else {
      adviceBox.style.background = '#FFFDF0';
      adviceBox.innerHTML = '💡 <i>Centang jajanan yang kamu konsumsi hari ini untuk melihat indikator kesehatanmu.</i>';
    }
  }
}

// --------------------------------------------------------------------------
// TOOL 4: GENERATOR BICARA ASERTIF
// --------------------------------------------------------------------------
function renderAsertifToolContent() {
  return `
    <div class="m-card m-card-lavender">
      <span class="badge badge-lavender">KOMUNIKASI EFEKTIF</span>
      <h3 style="font-family: var(--font-heading); font-size: 15px; margin-bottom: 4px;">💬 Generator Bicara Asertif ("I-Statement")</h3>
      <p style="font-size: 11.5px; color: #444; margin-bottom: 10px;">
        Gunakan formula resmi ini untuk latihan menolak ajakan pacar atau teman tanpa rasa canggung:
      </p>

      <div style="background: #fff; border: var(--border-sm); border-radius: 10px; padding: 12px; margin-bottom: 12px; font-size: 12px; display: flex; flex-direction: column; gap: 8px;">
        <div>
          <label style="font-weight: 800; display: block; margin-bottom: 2px;">1. Aku merasa:</label>
          <select id="asertif-emotion" style="width: 100%; padding: 8px; border: var(--border-sm); border-radius: 8px;" onchange="updateIStatement()">
            <option value="risih">Risih / Kurang nyaman</option>
            <option value="tertekan">Tertekan / Terpaksa</option>
            <option value="kecewa">Kecewa / Sedih</option>
            <option value="cemas">Cemas / Khawatir</option>
          </select>
        </div>

        <div>
          <label style="font-weight: 800; display: block; margin-bottom: 2px;">2. Pas kamu:</label>
          <input type="text" id="asertif-trigger" value="pesanku dibaca tanpa izin" style="width: 100%; padding: 8px; border: var(--border-sm); border-radius: 8px;" oninput="updateIStatement()">
        </div>

        <div>
          <label style="font-weight: 800; display: block; margin-bottom: 2px;">3. Karena menurutku:</label>
          <input type="text" id="asertif-reason" value="privasi itu hak setiap orang" style="width: 100%; padding: 8px; border: var(--border-sm); border-radius: 8px;" oninput="updateIStatement()">
        </div>

        <div>
          <label style="font-weight: 800; display: block; margin-bottom: 2px;">4. Jadi aku minta tolong:</label>
          <input type="text" id="asertif-solution" value="tolong izin dulu ke aku ya" style="width: 100%; padding: 8px; border: var(--border-sm); border-radius: 8px;" oninput="updateIStatement()">
        </div>
      </div>

      <!-- Speech Bubble Result -->
      <div class="speech-bubble" id="asertif-bubble-text">
        "Aku ngerasa risih pas pesanku dibaca tanpa izin, karena menurutku privasi itu hak setiap orang. Jadi aku minta tolong tolong izin dulu ke aku ya."
      </div>

      <button class="btn-m btn-m-mint btn-m-block" style="margin-top: 18px;" onclick="copyIStatement()">
        📋 Salin Kalimat Asertif Ini
      </button>
    </div>
  `;
}

function updateIStatement() {
  const emotion = document.getElementById('asertif-emotion')?.value || 'risih';
  const trigger = document.getElementById('asertif-trigger')?.value.trim() || 'pesanku dibaca tanpa izin';
  const reason = document.getElementById('asertif-reason')?.value.trim() || 'privasi itu hak setiap orang';
  const solution = document.getElementById('asertif-solution')?.value.trim() || 'tolong izin dulu ke aku ya';

  const fullSentence = `"Aku ngerasa ${emotion} pas ${trigger}, karena menurutku ${reason}. Jadi aku minta tolong ${solution}."`;
  
  const bubble = document.getElementById('asertif-bubble-text');
  if (bubble) bubble.innerText = fullSentence;
}

function copyIStatement() {
  const bubble = document.getElementById('asertif-bubble-text');
  if (bubble) {
    navigator.clipboard.writeText(bubble.innerText).then(() => {
      showToast('📋 Kalimat asertif berhasil disalin!');
    }).catch(() => {
      showToast('Gagal menyalin teks');
    });
  }
}

// --------------------------------------------------------------------------
// TOOL 5: PERSONA SPECIFIC CONTENT (CEWEK VS COWOK)
// --------------------------------------------------------------------------
function renderGirlToolContent() {
  return `
    <div class="m-card" style="background: #FFF5F5;">
      <span class="badge badge-pink">KHUSUS CEWEK</span>
      <h3 style="font-family: var(--font-heading); font-size: 16px; margin-bottom: 4px;">🩸 Prediksi Siklus Haid & Kram Care</h3>
      <p style="font-size: 12px; color: #444; line-height: 1.4;">
        Catat tanggal haid pertamamu untuk mengetahui estimasi siklus berikutnya dan tips pertolongan pertama kram perut.
      </p>
      
      <div style="background: #fff; border: var(--border-sm); border-radius: 10px; padding: 12px; margin-top: 10px;">
        <div style="margin-bottom: 8px;">
          <label style="font-size: 11.5px; font-weight: 800; display: block; margin-bottom: 2px;">Hari Pertama Haid Terakhir:</label>
          <input type="date" id="period-date-input" style="width: 100%; padding: 8px; border: var(--border-sm); border-radius: 6px; font-size: 12px;">
        </div>
        <div style="margin-bottom: 8px;">
          <label style="font-size: 11.5px; font-weight: 800; display: block; margin-bottom: 2px;">Rata-rata Durasi Siklus (Hari):</label>
          <input type="number" id="period-cycle-length" value="28" min="21" max="40" style="width: 100%; padding: 8px; border: var(--border-sm); border-radius: 6px; font-size: 12px;">
        </div>
        <button class="btn-m btn-m-pink btn-m-block" onclick="calculatePeriod()">
          Hitung Estimasi Siklus 📅
        </button>

        <div id="period-result-box" class="m-callout m-callout-pink" style="display: none; margin-top: 10px; margin-bottom: 0;"></div>
      </div>

      <div style="background: #fff; border: var(--border-sm); border-radius: 10px; padding: 12px; margin-top: 12px; font-size: 12px;">
        <b>🍵 4 Langkah Pertolongan Kram Perut (Dismenore):</b>
        <ul style="padding-left: 18px; margin-top: 6px; line-height: 1.6;">
          <li><b>Kompres Hangat:</b> Tempelkan botol/bantalan air hangat di perut bagian bawah.</li>
          <li><b>Banyak Minum Air Hangat:</b> Mengurangi rasa kembung dan melancarkan sirkulasi.</li>
          <li><b>Peregangan Ringan:</b> Gerakan yoga lembut atau jalan santai membantu meredakan tegang otot.</li>
          <li><b>Kapan Harus ke PKPR?</b> Jika nyeri sangat menyiksa sampai pingsan atau muntah terus-menerus.</li>
        </ul>
      </div>
    </div>
  `;
}

function calculatePeriod() {
  const dateInput = document.getElementById('period-date-input')?.value;
  const cycleInput = parseInt(document.getElementById('period-cycle-length')?.value || '28');
  const resultBox = document.getElementById('period-result-box');

  if (!dateInput) {
    alert('Silakan pilih tanggal hari pertama haid terakhirmu ya!');
    return;
  }

  const lastDate = new Date(dateInput);
  const nextDate = new Date(lastDate.getTime() + (cycleInput * 24 * 60 * 60 * 1000));
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  resultBox.style.display = 'block';
  resultBox.innerHTML = `
    <b>🩸 Perkiraan Haid Berikutnya:</b><br>
    <span style="font-size: 15px; color: var(--coral-pink); font-weight: 800;">${nextDate.toLocaleDateString('id-ID', options)}</span><br>
    <span style="font-size: 11px; color: #555; display: inline-block; margin-top: 4px;">Perkiraan masa subur (ovulasi): sekitar 14 hari sebelum tanggal di atas.</span>
  `;
}

function renderBoyToolContent() {
  return `
    <div class="m-card m-card-blue">
      <span class="badge badge-blue">KHUSUS COWOK</span>
      <h3 style="font-family: var(--font-heading); font-size: 16px; margin-bottom: 4px;">⚡ Perisai Tongkrongan & Mitos Cowok</h3>
      <p style="font-size: 12px; color: #444; line-height: 1.4;">
        Lawan toxic masculinity dan pelajari trik menolak ajakan bahaya dari teman sebaya tanpa bikin ribut!
      </p>

      <div style="background: #fff; border: var(--border-sm); border-radius: 10px; padding: 12px; margin-top: 10px; font-size: 12px;">
        <b>🛡️ 4 Jurus Menolak Ajakan Bahaya (Vape, Miras, Bokep):</b>
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
          <div style="background: #F0F6FF; padding: 8px; border: 1.5px solid var(--ink); border-radius: 8px;">
            <b>1. Tolak Singkat & Tegas:</b> <i>"Nggak deh Bro, makasih, aku nggak minat."</i>
          </div>
          <div style="background: #F0F6FF; padding: 8px; border: 1.5px solid var(--ink); border-radius: 8px;">
            <b>2. Alasan Waktu / Urusan Lain:</b> <i>"Gue cabut duluan ya, udah janji sama ortu di rumah."</i>
          </div>
          <div style="background: #F0F6FF; padding: 8px; border: 1.5px solid var(--ink); border-radius: 8px;">
            <b>3. Alihkan Topik:</b> <i>"Mending kita mabar game aja yuk, daripada kena masalah."</i>
          </div>
          <div style="background: #F0F6FF; padding: 8px; border: 1.5px solid var(--ink); border-radius: 8px;">
            <b>4. Pegang Prinsip Diri:</b> <i>"Sorry banget, gue nggak mau ambil risiko buat hal gituan."</i>
          </div>
        </div>
      </div>

      <div class="m-callout m-callout-yellow" style="margin-top: 12px; font-size: 12px;">
        <b>🌊 Mitos vs Fakta Mimpi Basah:</b><br>
        Mimpi basah adalah mekanisme otomatis pembuangan kelebihan sperma saat tidur. Itu <b>BUKAN</b> tanda cowok berotak mesum, melainkan tanda biologis bahwa hormon testosteron dan pabrik spermamu aktif secara sehat!
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// TAB 3: SAFETY CARD TOOL & GUIDES
// --------------------------------------------------------------------------
function updateSafetySummary() {
  const contact = localStorage.getItem('kespro_sp_contact') || '';
  const descEl = document.getElementById('safety-card-hub-desc');
  if (descEl) {
    if (contact) {
      descEl.innerHTML = `✅ <b>Kartu Aktif:</b> Kontak tepercaya: <b>${contact}</b>. Klik untuk melihat kartu lengkap.`;
    } else {
      descEl.innerHTML = `Catat kontak orang tepercaya, tempat aman terdekat, dan sandi darurat yang tersimpan di HP-mu.`;
    }
  }
}

function renderSafetyCardToolContent() {
  return `
    <div class="m-card">
      <span class="badge badge-mint">SAFETY PLAN POCKET CARD</span>
      <h3 style="font-family: var(--font-heading); font-size: 16px; margin-bottom: 8px;">Kartu Rencana Keselamatanku</h3>
      <p style="font-size: 12px; color: #444; line-height: 1.45; margin-bottom: 12px;">
        Saat darurat atau panik, pikiran kita sering blank. Isi form ini dan simpan di HP-mu agar selalu siap!
      </p>

      <div style="margin-bottom: 8px;">
        <label style="font-size: 11px; font-weight: 800; display: block; margin-bottom: 2px;">1. ORANG TEPERCAYA (IBU / KAKAK / GURU BK):</label>
        <input type="text" id="sp-input-contact" placeholder="Contoh: Ibu / Kak Salsa" oninput="onSafetyPlanChange()" style="width: 100%; padding: 8px; border: var(--border-sm); border-radius: 8px; font-size: 12px;">
      </div>

      <div style="margin-bottom: 8px;">
        <label style="font-size: 11px; font-weight: 800; display: block; margin-bottom: 2px;">2. LOKASI TEMPAT AMAN TERDEKAT:</label>
        <input type="text" id="sp-input-loc" placeholder="Contoh: Minimarket 24 jam / Pos Satpam" oninput="onSafetyPlanChange()" style="width: 100%; padding: 8px; border: var(--border-sm); border-radius: 8px; font-size: 12px;">
      </div>

      <div style="margin-bottom: 12px;">
        <label style="font-size: 11px; font-weight: 800; display: block; margin-bottom: 2px;">3. KATA SANDI / KODE RAHASIA DARURAT:</label>
        <input type="text" id="sp-input-code" placeholder="Contoh: 'Buku catatan ketinggalan'" oninput="onSafetyPlanChange()" style="width: 100%; padding: 8px; border: var(--border-sm); border-radius: 8px; font-size: 12px;">
      </div>

      <!-- Generated Live Card -->
      <div style="background: var(--primary-yellow); border: var(--border); border-radius: 14px; padding: 14px; box-shadow: var(--shadow-sm); margin-top: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: var(--border-sm); padding-bottom: 4px; margin-bottom: 8px;">
          <b style="font-family: var(--font-heading); font-size: 13px;">MY EMERGENCY POCKET CARD 🚨</b>
          <span style="font-size: 9.5px; background: #fff; padding: 2px 6px; border: 1.5px solid #18181B; border-radius: 4px; font-weight: 800;">PERSONAL</span>
        </div>
        <div style="font-size: 12px; line-height: 1.6;">
          <div>👤 <b>Kontak Aman:</b> <span id="card-prev-contact">[Belum diisi]</span></div>
          <div>📍 <b>Lokasi Aman:</b> <span id="card-prev-loc">[Belum diisi]</span></div>
          <div>🔐 <b>Sandi SOS:</b> <span id="card-prev-code">[Belum diisi]</span></div>
        </div>
      </div>

      <button class="btn-m btn-m-mint btn-m-block" style="margin-top: 12px;" onclick="saveSafetyCardNotice()">
        💾 Simpan Kartu Ini
      </button>
    </div>
  `;
}

function initSafetyPlan() {
  const contact = localStorage.getItem('kespro_sp_contact') || '';
  const location = localStorage.getItem('kespro_sp_loc') || '';
  const code = localStorage.getItem('kespro_sp_code') || '';

  const inContact = document.getElementById('sp-input-contact');
  const inLoc = document.getElementById('sp-input-loc');
  const inCode = document.getElementById('sp-input-code');

  if (inContact) inContact.value = contact;
  if (inLoc) inLoc.value = location;
  if (inCode) inCode.value = code;

  renderSafetyCardPreview();
}

function onSafetyPlanChange() {
  const contact = document.getElementById('sp-input-contact')?.value || '';
  const loc = document.getElementById('sp-input-loc')?.value || '';
  const code = document.getElementById('sp-input-code')?.value || '';

  localStorage.setItem('kespro_sp_contact', contact);
  localStorage.setItem('kespro_sp_loc', loc);
  localStorage.setItem('kespro_sp_code', code);

  renderSafetyCardPreview();
}

function renderSafetyCardPreview() {
  const contact = localStorage.getItem('kespro_sp_contact') || '[Belum diisi]';
  const loc = localStorage.getItem('kespro_sp_loc') || '[Belum diisi]';
  const code = localStorage.getItem('kespro_sp_code') || '[Belum diisi]';

  const c1 = document.getElementById('card-prev-contact');
  const c2 = document.getElementById('card-prev-loc');
  const c3 = document.getElementById('card-prev-code');

  if (c1) c1.innerText = contact;
  if (c2) c2.innerText = loc;
  if (c3) c3.innerText = code;
}

function saveSafetyCardNotice() {
  alert('🎉 Kartu Keselamatan Pribadimu sudah tersimpan aman di HP-mu! Kamu bisa screenshot tampilan kartu ini dan simpan di galeri foto.');
}

let miniWebSafetyTab = 'steps';

function switchMiniWebSafetyTab(tab) {
  miniWebSafetyTab = tab;
  const bodyEl = document.getElementById('tool-modal-body');
  if (bodyEl) bodyEl.innerHTML = renderSafetyGuideContent(tab);
}

function toggleMiniWebSafetyFaq(faqId) {
  const el = document.getElementById(faqId);
  const icon = document.getElementById(faqId + '-icon');
  if (!el) return;
  if (el.style.display === 'none' || !el.style.display) {
    el.style.display = 'block';
    if (icon) icon.innerText = '▲';
  } else {
    el.style.display = 'none';
    if (icon) icon.innerText = '▼';
  }
}

function renderSafetyGuideContent(activeTab) {
  if (!activeTab) activeTab = miniWebSafetyTab || 'steps';
  miniWebSafetyTab = activeTab;
  let tabContentHtml = '';

  if (activeTab === 'steps') {
    tabContentHtml = `
      <div style="margin-bottom: 8px;">
        <div style="font-size: 12.5px; font-weight: 800; color: var(--ink); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
          <span>⚡</span> <span>Protokol Cepat Tanggap 1-2-3:</span>
        </div>

        <div class="safety-step-card" style="background: #FFFDF0;">
          <div class="safety-step-num" style="background: var(--primary-yellow); color: var(--ink);">1</div>
          <div class="safety-step-content">
            <div class="safety-step-title">🏃‍♂️ Amankan Diri Segera (Prioritas #1)</div>
            <div class="safety-step-desc">
              Segera menjauh ke tempat ramai: pos satpam, ruang guru, minimarket, halte, atau kerumunan warga.
            </div>
            <div class="safety-step-tip">
              <b>💡 Taktik:</b> Bila terdesak, berteriaklah tegas: <i>"JANGAN SENTUH SAYA!"</i> untuk memecah fokus pelaku!
            </div>
          </div>
        </div>

        <div class="safety-step-card" style="background: #F0F7FF;">
          <div class="safety-step-num" style="background: var(--soft-blue); color: white;">2</div>
          <div class="safety-step-content">
            <div class="safety-step-title">📸 Simpan & Amankan Barang Bukti</div>
            <div class="safety-step-desc">
              Ambil tangkapan layar (screenshot) chat, foto profil pelaku, atau voice note. Bila terjadi kontak fisik, jangan langsung mandi atau mencuci pakaian agar jejak visum medis tetap utuh.
            </div>
            <div class="safety-step-tip">
              <b>⚖️ UU TPKS No. 12/2022:</b> Bukti digital & keterangan korban dilindungi penuh secara hukum.
            </div>
          </div>
        </div>

        <div class="safety-step-card" style="background: #F0FAF3;">
          <div class="safety-step-num" style="background: var(--mint-green); color: var(--ink);">3</div>
          <div class="safety-step-content">
            <div class="safety-step-title">📢 Laporkan & Cari Perlindungan</div>
            <div class="safety-step-desc">
              Ceritakan kejadian pada orang dewasa tepercaya (orang tua, guru BK) atau hubungi hotline siaga resmi yang melindungi kerahasiaanmu 100%.
            </div>
            <div style="display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap;">
              <a href="tel:129" class="btn-m btn-m-pink" style="font-size: 11px; padding: 6px 10px; text-decoration: none;">
                📞 Telepon 129
              </a>
              <a href="https://wa.me/628111129129?text=Halo%20SAPPA%20129,%20saya%20butuh%20bantuan" target="_blank" rel="noopener" class="btn-m btn-m-mint" style="font-size: 11px; padding: 6px 10px; text-decoration: none;">
                💬 WA SAPPA
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="m-card" style="margin-top: 8px; background: #FFF9FA; border: 1.5px solid var(--ink); border-radius: 12px; padding: 10px 12px;">
        <div onclick="toggleMiniWebSafetyFaq('mini-faq-kbgo')" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
          <span style="font-family: var(--font-heading); font-size: 12px; font-weight: 800;">
            📱 Bagaimana Jika Terjadi di Medsos / Chat?
          </span>
          <span id="mini-faq-kbgo-icon" style="font-size: 10px; font-weight: 800;">▼</span>
        </div>
        <div id="mini-faq-kbgo" style="display: none; margin-top: 6px; font-size: 11px; line-height: 1.5; color: #444; border-top: 1px dashed #CCC; padding-top: 6px;">
          • <b>Screenshot Bukti:</b> Simpan bukti chat sebelum memblokir.<br>
          • <b>Jangan Kirim Uang/Foto:</b> Bila diancam (sextortion), jangan pernah menuruti pelaku.<br>
          • <b>Laporkan Akun:</b> Gunakan fitur Report platform dan aduankonten.id.
        </div>
      </div>
    `;
  } else if (activeTab === '5d') {
    tabContentHtml = `
      <div style="margin-bottom: 8px;">
        <div style="font-size: 11.5px; color: #555; margin-bottom: 8px; background: #FFFDF0; border: var(--border-sm); border-radius: 8px; padding: 8px 10px;">
          👀 Melihat orang lain dilecehkan? Gunakan <b>Metode 5D</b> yang aman:
        </div>

        <div class="safety-step-card" style="background: #FFF9E6;">
          <div class="safety-step-num" style="background: var(--primary-yellow); color: var(--ink);">D1</div>
          <div class="safety-step-content">
            <div class="safety-step-title">🔀 Dialihkan (Distract)</div>
            <div class="safety-step-desc">Alihkan perhatian pelaku: pura-pura tanya arah, tanya jam, atau sapa korban seolah kenal lama.</div>
          </div>
        </div>

        <div class="safety-step-card" style="background: #FFF0F3;">
          <div class="safety-step-num" style="background: var(--coral-pink); color: white;">D2</div>
          <div class="safety-step-content">
            <div class="safety-step-title">🗣️ Ditegur (Direct)</div>
            <div class="safety-step-desc">Bila aman, tegur pelaku dengan tenang dan tegas: <i>"Tindakan itu tidak sopan!"</i></div>
          </div>
        </div>

        <div class="safety-step-card" style="background: #F0F6FF;">
          <div class="safety-step-num" style="background: var(--soft-blue); color: white;">D3</div>
          <div class="safety-step-content">
            <div class="safety-step-title">📷 Didokumentasikan (Document)</div>
            <div class="safety-step-desc">Rekam dari jarak aman. Serahkan HANYA ke korban, jangan sebar ke publik tanpa izin korban.</div>
          </div>
        </div>

        <div class="safety-step-card" style="background: #F0FAF1;">
          <div class="safety-step-num" style="background: var(--mint-green); color: var(--ink);">D4</div>
          <div class="safety-step-content">
            <div class="safety-step-title">🤝 Ditenangkan (Delay)</div>
            <div class="safety-step-desc">Dampingi korban setelah kejadian: <i>"Kamu tidak apa-apa? Mau aku temani lapor atau istirahat?"</i></div>
          </div>
        </div>

        <div class="safety-step-card" style="background: #F8F0FF;">
          <div class="safety-step-num" style="background: var(--lavender); color: var(--ink);">D5</div>
          <div class="safety-step-content">
            <div class="safety-step-title">👮 Dilaporkan (Delegate)</div>
            <div class="safety-step-desc">Panggil bantuan pihak berwenang di lokasi (satpam stasiun, kondektur, guru, polisi).</div>
          </div>
        </div>
      </div>
    `;
  } else if (activeTab === 'hotline') {
    tabContentHtml = `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div class="safety-hotline-card" style="background: #FFF4F6; border: var(--border-sm);">
          <div style="font-weight: 800; font-size: 13px; margin-bottom: 2px;">🛡️ SAPPA 129 (KemenPPPA RI)</div>
          <div style="font-size: 11px; color: #555; margin-bottom: 6px;">Hotline bebas pulsa & privat 24 jam untuk perlindungan anak & perempuan.</div>
          <div style="display: flex; gap: 6px;">
            <a href="tel:129" class="btn-m btn-m-pink" style="font-size: 11px; padding: 5px 10px; text-decoration: none;">📞 Telepon 129</a>
            <a href="https://wa.me/628111129129" target="_blank" rel="noopener" class="btn-m btn-m-mint" style="font-size: 11px; padding: 5px 10px; text-decoration: none;">💬 WA SAPPA</a>
          </div>
        </div>

        <div class="safety-hotline-card" style="background: #F0FAF1; border: var(--border-sm);">
          <div style="font-weight: 800; font-size: 13px; margin-bottom: 2px;">🧠 SEJIWA 119 Ext 8 (Kemenkes)</div>
          <div style="font-size: 11px; color: #555; margin-bottom: 6px;">Pertolongan pertama psikologis gratis dari konselor profesional.</div>
          <a href="tel:119" class="btn-m btn-m-mint" style="font-size: 11px; padding: 5px 10px; text-decoration: none; display: inline-block;">📞 Telepon 119 Ext 8</a>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 4px;">
          <button class="btn-m btn-m-yellow" style="font-size: 11px; padding: 6px 4px;" onclick="openInteractiveTool('safety_card')">📝 Kartu Darurat</button>
          <button class="btn-m btn-m-blue" style="font-size: 11px; padding: 6px 4px;" onclick="openInteractiveTool('safety_hotline')">🏥 Info PKPR</button>
        </div>
      </div>
    `;
  }

  return `
    <div class="safety-guide-interactive-container">
      <div class="safety-hero-wrap">
        <img src="assets/safe-space.jpg" alt="Ruang Aman & Solidaritas Remaja" class="safety-hero-img">
        <div class="safety-hero-badge">
          <span class="badge badge-yellow" style="font-size: 10px;">🛡️ RUANG AMAN & SOLIDARITAS</span>
        </div>
        <div class="safety-hero-caption">
          <span>🤝 <b>Kamu Tidak Sendiri:</b> Bersama lawan pelecehan!</span>
          <span class="badge badge-mint" style="font-size: 9px;">UU TPKS</span>
        </div>
      </div>

      <div class="m-card" style="background: linear-gradient(135deg, #FFF0F3 0%, #FFF8F6 100%); border: var(--border); border-radius: var(--radius-lg); padding: 12px; margin-bottom: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <span class="badge badge-pink" style="font-size: 10px;">PRINSIP MUTLAK</span>
          <span style="font-size: 10px; font-weight: 800; color: #C92A2A;">100% SALAH PELAKU</span>
        </div>
        <h3 style="font-family: var(--font-heading); font-size: 14px; margin-bottom: 4px;">Kekerasan BUKAN Salah Korban!</h3>
        <p style="font-size: 11.5px; color: #333; line-height: 1.5; margin: 0;">
          Apa pun pakaian yang kamu kenakan atau jam berapa pun peristiwanya, pelaku adalah pihak yang 100% bersalah. Jangan pernah menyalahkan dirimu sendiri!
        </p>
      </div>

      <div class="radar-mode-switcher">
        <button class="radar-mode-btn ${activeTab === 'steps' ? 'active' : ''}" onclick="switchMiniWebSafetyTab('steps')">
          🚨 3 Langkah Darurat
        </button>
        <button class="radar-mode-btn ${activeTab === '5d' ? 'active' : ''}" onclick="switchMiniWebSafetyTab('5d')">
          👀 Aksi Saksi (5D)
        </button>
        <button class="radar-mode-btn ${activeTab === 'hotline' ? 'active' : ''}" onclick="switchMiniWebSafetyTab('hotline')">
          📞 Hotline
        </button>
      </div>

      <div id="mini-safety-tab-content">
        ${tabContentHtml}
      </div>
    </div>
  `;
}

function renderSafetyHotlineContent() {
  return `
    <div class="m-card m-card-blue">
      <span class="badge badge-blue">LAYANAN PKPR PUSKESMAS</span>
      <h3 style="font-family: var(--font-heading); font-size: 16px; margin-bottom: 6px;">Pelayanan Kesehatan Peduli Remaja (PKPR)</h3>
      <p style="font-size: 12.5px; line-height: 1.5; color: #222; margin-bottom: 10px;">
        Di seluruh Puskesmas di Indonesia, terdapat ruangan khusus PKPR untuk remaja (usia 10–19 tahun). Di sini kamu bisa konsultasi <b>gratis</b>, privasimu dijamin 100%, dan dokternya ramah tanpa menghakimi!
      </p>
      
      <button class="btn-m btn-m-blue btn-m-block" style="margin-bottom: 12px;" onclick="simulatePKPRChat()">
        💬 Uji Coba Simulasi Chat PKPR
      </button>

      <h4 style="font-size: 14px; margin-bottom: 6px;">📞 Nomor Hotline Darurat Nasional:</h4>
      <div style="display: flex; flex-direction: column; gap: 6px; font-size: 12px;">
        <div style="background: #fff; border: var(--border-sm); border-radius: 8px; padding: 8px;">
          • <b>SAPPA KemenPPPA (Anti-Kekerasan):</b> Telp <b>129</b> / WhatsApp <b>08111-129-129</b>
        </div>
        <div style="background: #fff; border: var(--border-sm); border-radius: 8px; padding: 8px;">
          • <b>SEJIWA (Kesehatan Mental):</b> Telp <b>119 Ekstensi 8</b>
        </div>
        <div style="background: #fff; border: var(--border-sm); border-radius: 8px; padding: 8px;">
          • <b>Darurat Medis:</b> Telp <b>119</b>
        </div>
      </div>
    </div>
  `;
}

function simulatePKPRChat() {
  alert('💬 Membuka Simulasi Chat PKPR Puskesmas:\n\n"Halo Kak Konselor PKPR, saya ingin konsultasi seputar kesehatan reproduksi secara rahasia dan aman..."\n\n(Di Puskesmas terdekat, kamu berhak dilayani secara gratis dan dijamin 100% privasinya!).');
}

// ==========================================================================
// TAB 4: CATATANKU & AFFIRMATIONS
// ==========================================================================
function updateNotesTab() {
  if (typeof EBOOK_CHAPTERS === 'undefined') return;

  let readCount = 0;
  let bookmarkedChapters = [];

  EBOOK_CHAPTERS.forEach(c => {
    if (localStorage.getItem('kespro_read_' + c.id) === 'true') {
      readCount++;
    }
    if (localStorage.getItem('kespro_bm_' + c.id) === 'true') {
      bookmarkedChapters.push(c);
    }
  });

  const totalChaps = EBOOK_CHAPTERS.length;
  const percent = Math.round((readCount / totalChaps) * 100);

  const progBar = document.getElementById('notes-read-prog-bar');
  const progText = document.getElementById('notes-read-prog-text');
  const progPercent = document.getElementById('notes-read-percent');

  if (progBar) progBar.style.width = `${percent}%`;
  if (progText) progText.innerText = `${readCount} dari ${totalChaps} Bab Selesai`;
  if (progPercent) progPercent.innerText = `${percent}%`;

  const bmContainer = document.getElementById('notes-bookmark-list');
  if (bmContainer) {
    if (bookmarkedChapters.length === 0) {
      bmContainer.innerHTML = '<div style="font-size: 11.5px; color: #777; font-style: italic;">Belum ada bab yang kamu tandai bintang. Klik tanda bintang (☆) saat membaca bab untuk menyimpannya di sini.</div>';
    } else {
      bmContainer.innerHTML = bookmarkedChapters.map(c => `
        <div class="chapter-card" style="padding: 8px 12px; margin-bottom: 6px;" onclick="openChapter(${c.id})">
          <div style="display: flex; gap: 8px; align-items: center;">
            <span>⭐</span>
            <span style="font-size: 12.5px; font-weight: 700;">${c.icon} ${c.title}</span>
          </div>
          <span style="font-size: 11px; color: var(--coral-pink); font-weight: 800;">Baca →</span>
        </div>
      `).join('');
    }
  }

  const affText = localStorage.getItem('kespro_daily_aff') || '';
  const affInput = document.getElementById('daily-aff-input');
  if (affInput && !affInput.value) affInput.value = affText;
}

function saveAffirmation() {
  const val = document.getElementById('daily-aff-input')?.value.trim() || '';
  localStorage.setItem('kespro_daily_aff', val);
  showToast('💖 Catatan afirmasi dirimu tersimpan!');
}

// ==========================================================================
// TOAST HELPER
// ==========================================================================
function showToast(msg) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.style.cssText = `
      position: absolute;
      top: 60px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--ink);
      color: #fff;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 800;
      z-index: 120;
      box-shadow: 2px 2px 0px rgba(0,0,0,0.3);
      animation: fadeIn 0.2s ease-out;
      pointer-events: none;
    `;
    document.querySelector('.phone-container').appendChild(toast);
  }

  toast.innerText = msg;
  toast.style.display = 'block';

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.display = 'none';
  }, 2200);
}

// ==========================================================================
// SERVICE WORKER REGISTRATION (PWA OFFLINE FIRST & AUTO-UPDATE)
// ==========================================================================
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    // Purge stale caches immediately on the client side
    if (window.caches) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          if (name !== 'kespro-space-v3') {
            console.log('[App] Purging stale cache:', name);
            caches.delete(name);
          }
        });
      });
    }

    navigator.serviceWorker.register('./sw.js?v=3')
      .then(reg => {
        console.log('[PWA] Service Worker registered with scope:', reg.scope);
        // Force update check
        reg.update();
      })
      .catch(err => console.warn('[PWA] Service Worker registration failed:', err));

    // When updated service worker takes over, reload to apply immediately
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[PWA] New service worker controller activated, reloading...');
      window.location.reload();
    });
  }
}

// Interactive Anatomy Switcher inside Chapter 13
window.switchAnatomyInline = function(gender) {
  const cewekImg = document.getElementById('anatomi-view-cewek');
  const cowokImg = document.getElementById('anatomi-view-cowok');
  const cewekBtn = document.getElementById('btn-anatomi-cewek');
  const cowokBtn = document.getElementById('btn-anatomi-cowok');
  const cewekDetail = document.getElementById('anatomi-detail-cewek');
  const cowokDetail = document.getElementById('anatomi-detail-cowok');

  if (!cewekImg || !cowokImg) return;

  if (gender === 'cewek') {
    cewekImg.style.display = 'block';
    cowokImg.style.display = 'none';
    if (cewekDetail) cewekDetail.style.display = 'block';
    if (cowokDetail) cowokDetail.style.display = 'none';
    if (cewekBtn) cewekBtn.classList.add('active');
    if (cowokBtn) cowokBtn.classList.remove('active');
  } else {
    cewekImg.style.display = 'none';
    cowokImg.style.display = 'block';
    if (cewekDetail) cewekDetail.style.display = 'none';
    if (cowokDetail) cowokDetail.style.display = 'block';
    if (cowokBtn) cowokBtn.classList.add('active');
    if (cewekBtn) cewekBtn.classList.remove('active');
  }
};
