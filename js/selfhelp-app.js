// ==========================================================================
// SELF-HELP WORKBOOK - Application Logic (Interactive Tools & Storage)
// Ruang Tumbuh Remaja - Edukasi Interaktif (Unified Neo-Memphis Edition)
// ==========================================================================

const SH_STORAGE_KEY = 'mental_health_workbook_data_v1';

let selfHelpData = {
  profile: { nama: '', usia: '' },
  jurnalEmosi: { selectedEmosi: [], situasi: '', pikiran: '', intensitas: 5, tindakan: '', alternatif: '' },
  kelolaPikiran: { pikiranMuncul: '', pikiranRealistis: '', lihat: '', sentuh: '', dengar: '', cium: '', rasakan: '' },
  kekuatanDiri: { halBaik1: '', halBaik2: '', halBaik3: '', halBerat: '', selfTalkDown: '', selfTalkRamah: '', selectedNeeds: [] },
  keseharian: { syukur1: '', syukur2: '', syukur3: '', stressSituasi: '', stressKontrol: '', stressLangkah: '', digitalHabits: [], batasDigital: '' },
  support: { cerita1Nama: '', cerita1Waktu: '', cerita2Nama: '', cerita2Waktu: '', rencanaTingkatkan: '', rencanaKurangi: '', rencanaAktivitas: '' },
  savedJournalEntries: []
};

let selfHelpActiveCategory = 'all';
let selfHelpSearchQuery = '';

// Initialize Self-Help Module
function initSelfHelpApp() {
  loadSelfHelpData();
  renderSelfHelpChapterList();
  renderSelfHelpToolkitHub();
  initEmotionJournalUI();
  updateSelfHelpNotesTab();
  updateSelfHelpMoodStatus();
}

function loadSelfHelpData() {
  try {
    const saved = localStorage.getItem(SH_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      selfHelpData = { ...selfHelpData, ...parsed };
    }
  } catch (e) {
    console.error('Error loading self help data:', e);
  }
}

function saveSelfHelpData() {
  try {
    localStorage.setItem(SH_STORAGE_KEY, JSON.stringify(selfHelpData));
  } catch (e) {
    console.error('Error saving self help data:', e);
  }
}

// 4-Tab Switcher inside Self-Help
function switchSelfHelpTab(tabId, el) {
  document.querySelectorAll('#view-selfhelp .tab-view').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('#view-selfhelp .nav-item').forEach(n => n.classList.remove('active'));

  const target = document.getElementById(tabId);
  if (target) target.classList.add('active');
  if (el) el.classList.add('active');

  // Scroll to top
  const main = document.querySelector('#view-selfhelp .app-main');
  if (main) main.scrollTop = 0;

  if (tabId === 'tab-selfhelp-notes') {
    updateSelfHelpNotesTab();
  }

  // GSAP Tab Motion & Nav Bounce
  if (window.gsap && target) {
    gsap.killTweensOf(target);
    gsap.fromTo(target,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out', clearProps: 'transform,opacity' }
    );
    if (el) {
      gsap.fromTo(el, { scale: 0.92 }, { scale: 1, duration: 0.25, ease: 'back.out(2)', clearProps: 'transform' });
    }
  }
}

// --------------------------------------------------------------------------
// TAB 1: MATERI & KLIPING EDUKASI
// --------------------------------------------------------------------------
function renderSelfHelpChapterList(cat = selfHelpActiveCategory, search = selfHelpSearchQuery) {
  selfHelpActiveCategory = cat;
  selfHelpSearchQuery = search;

  const container = document.getElementById('selfhelp-chapter-list');
  if (!container || typeof SELFHELP_CHAPTERS === 'undefined') return;

  const readChapters = JSON.parse(localStorage.getItem('selfhelp_read_chapters') || '[]');
  const bookmarks = JSON.parse(localStorage.getItem('selfhelp_bookmarks') || '[]');

  const filtered = SELFHELP_CHAPTERS.filter(chap => {
    // Filter category
    if (cat === 'pengenalan' && !['PENGENALAN', 'DASAR MENTAL'].includes(chap.category)) return false;
    if (cat === 'pikiran' && !['ENERGI & PIKIRAN', 'OVERTHINKING'].includes(chap.category)) return false;
    if (cat === 'emosi' && !['EMOSI', 'SELF-LOVE'].includes(chap.category)) return false;
    if (cat === 'relasi' && !['RELASI & SUPPORT', 'RESILIENSI & IKRAR'].includes(chap.category)) return false;

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = chap.title.toLowerCase().includes(q);
      const matchCat = chap.category.toLowerCase().includes(q);
      const matchBody = chap.html.toLowerCase().includes(q);
      return matchTitle || matchCat || matchBody;
    }

    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="m-card text-center" style="padding: 24px 14px; text-align: center;">
        <div style="font-size: 32px; margin-bottom: 8px;">🔍</div>
        <div style="font-weight: 800; font-size: 14px;">Tidak ada topik yang cocok</div>
        <div style="font-size: 11.5px; color: #666; margin-top: 4px;">Coba gunakan kata kunci lain atau pilih Semua Materi.</div>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(chap => {
    const isRead = readChapters.includes(chap.id);
    const isBookmarked = bookmarks.includes(chap.id);
    const readBadge = isRead ? '<span class="status-check" title="Sudah Dibaca">✔️</span>' : '<span style="font-size: 12px; color: #BBB;">⚪</span>';
    const starBadge = isBookmarked ? '⭐ ' : '';

    return `
      <div class="chapter-card" onclick="openChapterOverlay('selfhelp', ${chap.id})">
        <div class="chapter-left">
          <div class="chap-num ${isRead ? 'read' : ''}">${String(chap.id).padStart(2, '0')}</div>
          <div style="flex: 1; min-width: 0;">
            <div class="chapter-title" style="display: flex; align-items: center; gap: 4px; flex-wrap: wrap;">
              <span>${starBadge}${chap.icon || ''}</span>
              <span>${chap.title}</span>
            </div>
            ${chap.hook ? `<div style="font-size: 11px; color: #52525B; margin: 2px 0 4px 0; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${chap.hook}</div>` : ''}
            <div class="chapter-meta" style="display: flex; align-items: center; gap: 5px; flex-wrap: wrap; margin-top: 3px;">
              <span class="badge ${getSelfHelpCategoryBadge(chap.category)}" style="margin: 0; font-size: 8.5px;">${chap.category}</span>
              <span style="font-size: 10px; color: #71717A;">• ${chap.est || '3 mnt baca'}</span>
            </div>
          </div>
        </div>
        <div style="flex-shrink: 0; padding-left: 6px;">${readBadge}</div>
      </div>
    `;
  }).join('');
}

function filterSelfHelpCategory(cat, btn) {
  document.querySelectorAll('#view-selfhelp .cat-pill').forEach(p => {
    p.classList.remove('active');
    p.classList.remove('active-pink');
  });
  if (btn) btn.classList.add('active');
  renderSelfHelpChapterList(cat, selfHelpSearchQuery);

  if (window.gsap) {
    const cards = document.querySelectorAll('#selfhelp-chapter-list .chapter-card');
    if (cards.length > 0) {
      gsap.fromTo(Array.from(cards).slice(0, 10),
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.25, stagger: 0.035, ease: 'power2.out', clearProps: 'transform,opacity' }
      );
    }
  }
}

function onSelfHelpSearch(query) {
  renderSelfHelpChapterList(selfHelpActiveCategory, query);
}

function getSelfHelpCategoryBadge(cat) {
  switch (cat) {
    case 'PENGENALAN':
      return 'badge-yellow';
    case 'DASAR MENTAL':
      return 'badge-mint';
    case 'ENERGI & PIKIRAN':
      return 'badge-blue';
    case 'EMOSI':
      return 'badge-pink';
    case 'OVERTHINKING':
      return 'badge-magenta';
    case 'SELF-LOVE':
      return 'badge-lavender';
    case 'RELASI & SUPPORT':
      return 'badge-blue';
    case 'RESILIENSI & IKRAR':
      return 'badge-yellow';
    default:
      return 'badge-mint';
  }
}

// --------------------------------------------------------------------------
// TAB 2: JURNAL EMOSI INTERAKTIF
// --------------------------------------------------------------------------
const EMOSI_PRESETS = [
  { label: 'Senang', emoji: '☀️' },
  { label: 'Tenang', emoji: '🍃' },
  { label: 'Biasa saja', emoji: '☁️' },
  { label: 'Cemas', emoji: '🌀' },
  { label: 'Marah', emoji: '⚡' },
  { label: 'Sedih', emoji: '🌧️' },
  { label: 'Bingung', emoji: '❓' },
  { label: 'Malu', emoji: '🙈' },
  { label: 'Kecewa', emoji: '💔' },
  { label: 'Lelah', emoji: '🪫' }
];

function initEmotionJournalUI() {
  const pillsContainer = document.getElementById('sh-mood-pills');
  if (pillsContainer) {
    pillsContainer.innerHTML = EMOSI_PRESETS.map(item => {
      const isSelected = (selfHelpData.jurnalEmosi.selectedEmosi || []).includes(item.label);
      return `
        <button type="button" class="mood-pill ${isSelected ? 'selected' : ''}" onclick="toggleEmotionTag('${item.label}', this)">
          <span>${item.emoji}</span>
          <span>${item.label}</span>
        </button>
      `;
    }).join('');
  }

  // Populate fields
  const situEl = document.getElementById('sh-jurnal-situasi');
  const pikiEl = document.getElementById('sh-jurnal-pikiran');
  const inteEl = document.getElementById('sh-jurnal-intensitas');
  const inteValEl = document.getElementById('sh-intensitas-value');
  const tindEl = document.getElementById('sh-jurnal-tindakan');
  const alteEl = document.getElementById('sh-jurnal-alternatif');

  if (situEl) situEl.value = selfHelpData.jurnalEmosi.situasi || '';
  if (pikiEl) pikiEl.value = selfHelpData.jurnalEmosi.pikiran || '';
  if (inteEl) {
    inteEl.value = selfHelpData.jurnalEmosi.intensitas || 5;
    if (inteValEl) inteValEl.innerText = selfHelpData.jurnalEmosi.intensitas || 5;
  }
  if (tindEl) tindEl.value = selfHelpData.jurnalEmosi.tindakan || '';
  if (alteEl) alteEl.value = selfHelpData.jurnalEmosi.alternatif || '';

  renderJournalHistory();
  if (typeof renderMentalHealthInsights === 'function') {
    renderMentalHealthInsights();
  }
}

function updateSelfHelpMoodStatus() {
  const el = document.getElementById('selfhelp-mood-status-text');
  if (!el) return;
  const moodList = selfHelpData?.jurnalEmosi?.selectedEmosi || [];
  const entries = selfHelpData?.savedJournalEntries || [];
  if (entries.length > 0) {
    const latest = entries[0];
    const ems = (latest.emotions || []).join(', ');
    el.innerHTML = `Terakhir dicatat: <b>${ems || 'Emosi Terpantau'}</b> • Skor: <b>${latest.intensity || 5}/10</b>`;
  } else if (moodList.length > 0) {
    el.innerHTML = `Emosi terpilih: <b>${moodList.join(', ')}</b> • Siap dicatat!`;
  } else {
    el.innerHTML = `Yuk kenali perasaanmu hari ini! ✨`;
  }
}

function toggleEmotionTag(label, btn) {
  let list = selfHelpData.jurnalEmosi.selectedEmosi || [];
  if (list.includes(label)) {
    list = list.filter(l => l !== label);
    btn.classList.remove('selected');
  } else {
    list.push(label);
    btn.classList.add('selected');
  }
  selfHelpData.jurnalEmosi.selectedEmosi = list;
  saveSelfHelpData();
  updateSelfHelpMoodStatus();
}

function onEmotionSliderChange(val) {
  const valEl = document.getElementById('sh-intensitas-value');
  if (valEl) valEl.innerText = val;
  selfHelpData.jurnalEmosi.intensitas = parseInt(val, 10);
  saveSelfHelpData();
}

let journalHistoryLimit = 5;

function saveJournalEntry() {
  const situ = document.getElementById('sh-jurnal-situasi')?.value || '';
  const piki = document.getElementById('sh-jurnal-pikiran')?.value || '';
  const inte = parseInt(document.getElementById('sh-jurnal-intensitas')?.value || '5', 10);
  const tind = document.getElementById('sh-jurnal-tindakan')?.value || '';
  const alte = document.getElementById('sh-jurnal-alternatif')?.value || '';

  selfHelpData.jurnalEmosi.situasi = situ;
  selfHelpData.jurnalEmosi.pikiran = piki;
  selfHelpData.jurnalEmosi.intensitas = inte;
  selfHelpData.jurnalEmosi.tindakan = tind;
  selfHelpData.jurnalEmosi.alternatif = alte;

  // Add to history if there is content
  if (selfHelpData.jurnalEmosi.selectedEmosi?.length > 0 || situ || piki) {
    const entry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      emotions: [...(selfHelpData.jurnalEmosi.selectedEmosi || [])],
      intensity: inte,
      situasi: situ,
      pikiran: piki,
      alternatif: alte
    };

    if (!selfHelpData.savedJournalEntries) selfHelpData.savedJournalEntries = [];
    selfHelpData.savedJournalEntries.unshift(entry);
    // Unlimited local storage history
  }

  saveSelfHelpData();
  renderJournalHistory();
  if (typeof renderMentalHealthInsights === 'function') {
    renderMentalHealthInsights();
  }
  updateSelfHelpMoodStatus();
  showToast('💖 Jurnal Emosi Berhasil Disimpan!');
}

function showMoreJournalHistory() {
  journalHistoryLimit += 10;
  renderJournalHistory();
}

function renderJournalHistory() {
  const container = document.getElementById('sh-journal-history');
  if (!container) return;

  const entries = selfHelpData.savedJournalEntries || [];
  if (entries.length === 0) {
    container.innerHTML = `
      <div style="font-size: 11.5px; color: #888; font-style: italic; padding: 6px 0;">
        Belum ada riwayat jurnal. Isi dan simpan jurnal di atas untuk melihat riwayat perjalanan emosimu di sini.
      </div>
    `;
    return;
  }

  const displayedEntries = entries.slice(0, journalHistoryLimit);

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
      <span style="font-size: 11px; font-weight: 700; color: #555;">Total ${entries.length} Catatan Riwayat</span>
      <span class="badge badge-mint" style="font-size: 9px; margin: 0;">TERSIMPAN LOKAL</span>
    </div>
    ${displayedEntries.map(e => `
      <div style="border: var(--border-sm); border-radius: 12px; padding: 12px; background: #FFF; margin-bottom: 10px; box-shadow: var(--shadow-sm); position: relative;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span style="font-size: 11px; font-weight: 800; color: #555;">📅 ${e.date}</span>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span class="badge ${e.intensity >= 7 ? 'badge-coral' : e.intensity >= 4 ? 'badge-yellow' : 'badge-mint'}" style="margin: 0; font-size: 9.5px;">
              Skor: ${e.intensity}/10
            </span>
            <button type="button" class="btn-m btn-m-white" style="font-size: 10px; padding: 2px 6px; color: #DC2626;" onclick="deleteJournalEntry(${e.id})" title="Hapus entri ini">
              🗑️
            </button>
          </div>
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px;">
          ${(e.emotions || []).map(em => `<span class="badge badge-mint" style="margin:0; font-size: 9.5px;">${em}</span>`).join('')}
        </div>
        ${e.situasi ? `<div style="font-size: 11.5px; color: #333; margin-bottom: 4px;"><b>Situasi:</b> ${e.situasi}</div>` : ''}
        ${e.pikiran ? `<div style="font-size: 11.5px; color: #555; margin-bottom: 4px; font-style: italic;"><b>Pikiran:</b> "${e.pikiran}"</div>` : ''}
        ${e.alternatif ? `<div style="font-size: 11.5px; color: #15803D; margin-top: 4px; background: #F0FDF4; padding: 4px 8px; border-radius: 6px;"><b>🌱 Respon Sehat:</b> ${e.alternatif}</div>` : ''}
      </div>
    `).join('')}
    ${entries.length > journalHistoryLimit ? `
      <button type="button" class="btn-m btn-m-white btn-m-block" style="font-size: 11.5px; padding: 6px;" onclick="showMoreJournalHistory()">
        Lihat Riwayat Lainnya (${entries.length - journalHistoryLimit} lagi) ↓
      </button>
    ` : ''}
  `;
}

// --------------------------------------------------------------------------
// TAB 3: TOOLKIT & LATIHAN INTERAKTIF (CLOSED CARD HUB)
// --------------------------------------------------------------------------
function renderSelfHelpToolkitHub() {
  const container = document.getElementById('selfhelp-toolkit-hub-container');
  if (!container) return;

  container.innerHTML = `
    <!-- Tool 1: S-T-O-P -->
    <div class="tool-hub-card" onclick="openSelfHelpTool('stop_method')">
      <div class="tool-hub-header">
        <span class="badge badge-yellow">REDALKAN PANIK</span>
        <span style="font-size: 20px;">🛑</span>
      </div>
      <div class="tool-hub-title">Metode S-T-O-P: Tarik Rem Overthinking</div>
      <div class="tool-hub-desc">
        Latihan 4 langkah cepat saat pikiranmu berputar liar: Stop, Take a breath, Observe, dan Proceed.
      </div>
      <button class="btn-m btn-m-yellow btn-m-block" style="font-size: 12px; padding: 8px;">
        Buka Latihan STOP 👉
      </button>
    </div>

    <!-- Tool 2: Grounding 5-4-3-2-1 -->
    <div class="tool-hub-card" onclick="openSelfHelpTool('grounding')">
      <div class="tool-hub-header">
        <span class="badge badge-mint">SENSO-MOTORIK</span>
        <span style="font-size: 20px;">🧊</span>
      </div>
      <div class="tool-hub-title">Teknik Grounding 5-4-3-2-1: Jangkar Indra</div>
      <div class="tool-hub-desc">
        Kembalikan fokus ke saat ini dengan menyebutkan hal yang kamu lihat, sentuh, dengar, cium, dan rasakan.
      </div>
      <button class="btn-m btn-m-mint btn-m-block" style="font-size: 12px; padding: 8px;">
        Mulai Grounding 👉
      </button>
    </div>

    <!-- Tool 3: CBT Reframing -->
    <div class="tool-hub-card" onclick="openSelfHelpTool('reframing')">
      <div class="tool-hub-header">
        <span class="badge badge-pink">UJI REALITAS</span>
        <span style="font-size: 20px;">🔍</span>
      </div>
      <div class="tool-hub-title">Tantang Pikiran Negatif Otomatis (CBT)</div>
      <div class="tool-hub-desc">
        Pilah mana praduga fiktif di kepalamu dan ubah menjadi kalimat yang lebih ramah serta realistis.
      </div>
      <button class="btn-m btn-m-pink btn-m-block" style="font-size: 12px; padding: 8px;">
        Tantang Asumsi Negatif 👉
      </button>
    </div>

    <!-- Tool 4: Digital Habit Check -->
    <div class="tool-hub-card" onclick="openSelfHelpTool('digital_habit')">
      <div class="tool-hub-header">
        <span class="badge badge-blue">KESEHATAN DIGITAL</span>
        <span style="font-size: 20px;">📴</span>
      </div>
      <div class="tool-hub-title">Cek Kebiasaan Digital & Batas Layar</div>
      <div class="tool-hub-desc">
        Evaluasi kebiasaan doomscrolling, FOMO, dan tetapkan satu batasan tegas untuk kesehatan matamu.
      </div>
      <button class="btn-m btn-m-blue btn-m-block" style="font-size: 12px; padding: 8px;">
        Cek Kebiasaan Layar 👉
      </button>
    </div>

    <!-- Tool 5: Support Circle -->
    <div class="tool-hub-card" onclick="openSelfHelpTool('support_circle')">
      <div class="tool-hub-header">
        <span class="badge badge-lavender">LINGKARAN AMAN</span>
        <span style="font-size: 20px;">👥</span>
      </div>
      <div class="tool-hub-title">Support Circle: Daftar Orang Tepercaya</div>
      <div class="tool-hub-desc">
        Catat 2 sosok aman tempat curhat tanpa dihakimi serta hotline darurat kesehatan jiwa (SEJIWA 119).
      </div>
      <button class="btn-m btn-m-lavender btn-m-block" style="font-size: 12px; padding: 8px;">
        Petakan Kontak Suportif 👉
      </button>
    </div>

    <!-- Tool 6: Needs Checklist -->
    <div class="tool-hub-card" onclick="openSelfHelpTool('needs_check')">
      <div class="tool-hub-header">
        <span class="badge badge-yellow">KEBUTUHAN BATIN</span>
        <span style="font-size: 20px;">💖</span>
      </div>
      <div class="tool-hub-title">Checklist Kebutuhan Diri Hari Ini</div>
      <div class="tool-hub-desc">
        Apakah kamu butuh istirahat, didengarkan, waktu sendiri, atau ruang mencoba lagi? Kenali kebutuhanmu.
      </div>
      <button class="btn-m btn-m-yellow btn-m-block" style="font-size: 12px; padding: 8px;">
        Cek Kebutuhanku 👉
      </button>
    </div>
  `;
}

// Open Self-Help Tool into the shared Tool Modal Overlay
function openSelfHelpTool(toolKey) {
  const overlay = document.getElementById('tool-modal-overlay');
  const badgeEl = document.getElementById('tool-modal-badge');
  const titleEl = document.getElementById('tool-modal-title');
  const bodyEl = document.getElementById('tool-modal-body');

  if (!overlay || !bodyEl) return;

  if (toolKey === 'stop_method') {
    badgeEl.innerText = 'REDALKAN OVERTHINKING';
    titleEl.innerText = '🛑 Metode S-T-O-P';
    bodyEl.innerHTML = `
      <div class="m-card">
        <h3 style="font-family: var(--font-heading); font-size: 15px; margin-bottom: 4px;">4 Langkah Menenangkan Diri</h3>
        <p style="font-size: 12px; color: #444; line-height: 1.4; margin-bottom: 12px;">
          Gunakan rumus ini kapan pun kamu merasa gelisah, terburu-buru, atau mau marah.
        </p>

        <div class="stop-grid">
          <div class="stop-card" style="background: #FFF9D2;">
            <div class="stop-badge-letter">S</div>
            <div style="font-weight: 800; font-size: 12.5px;">STOP</div>
            <div style="font-size: 11px; color: #444; margin-top: 2px;">Berhenti sejenak dari aktivitasmu. Taruh HP atau tugas.</div>
          </div>
          <div class="stop-card" style="background: #E8F9ED;">
            <div class="stop-badge-letter">T</div>
            <div style="font-weight: 800; font-size: 12.5px;">TAKE A BREATH</div>
            <div style="font-size: 11px; color: #444; margin-top: 2px;">Tarik napas 4 detik lewat hidung, hembuskan 6 detik.</div>
          </div>
          <div class="stop-card" style="background: #FFE8EE;">
            <div class="stop-badge-letter">O</div>
            <div style="font-weight: 800; font-size: 12.5px;">OBSERVE</div>
            <div style="font-size: 11px; color: #444; margin-top: 2px;">Amati perasaan & fakta nyata tanpa menghakimi.</div>
          </div>
          <div class="stop-card" style="background: #F3EBFF;">
            <div class="stop-badge-letter">P</div>
            <div style="font-weight: 800; font-size: 12.5px;">PROCEED</div>
            <div style="font-size: 11px; color: #444; margin-top: 2px;">Lanjutkan dengan 1 langkah kecil yang realistis.</div>
          </div>
        </div>

        <div class="m-callout m-callout-mint" style="margin-top: 14px;">
          <b>🌸 Latihan Napas Mandiri:</b> Pejamkan mata sejenak, tarik napas dalam-dalam, dan rasakan udara sejuk mengisi dadamu. Ulangi 3 kali.
        </div>
      </div>
    `;
  }
  else if (toolKey === 'grounding') {
    badgeEl.innerText = 'SENSO-MOTORIK';
    titleEl.innerText = '🧊 Grounding 5-4-3-2-1';
    bodyEl.innerHTML = `
      <div class="m-card">
        <h3 style="font-family: var(--font-heading); font-size: 15px; margin-bottom: 4px;">Kembalikan Pikiran ke Saat Ini</h3>
        <p style="font-size: 11.5px; color: #444; margin-bottom: 12px;">
          Saat cemas, otak kita terjebak di masa lalu atau masa depan. Sebutkan hal nyata di sekitarmu:
        </p>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div>
            <label style="font-size: 11px; font-weight: 800; display: block; margin-bottom: 3px;">👀 5 Hal yang bisa kamu LIHAT:</label>
            <input type="text" id="sh-gr-lihat" class="m-input" placeholder="Misal: Meja kayu, daun hijau, jendela..." value="${selfHelpData.kelolaPikiran.lihat || ''}">
          </div>
          <div>
            <label style="font-size: 11px; font-weight: 800; display: block; margin-bottom: 3px;">✋ 4 Hal yang bisa kamu SENTUH:</label>
            <input type="text" id="sh-gr-sentuh" class="m-input" placeholder="Misal: Tekstur kain baju, casing HP dingin..." value="${selfHelpData.kelolaPikiran.sentuh || ''}">
          </div>
          <div>
            <label style="font-size: 11px; font-weight: 800; display: block; margin-bottom: 3px;">👂 3 Suara yang bisa kamu DENGAR:</label>
            <input type="text" id="sh-gr-dengar" class="m-input" placeholder="Misal: Kipas angin, kicau burung, suara motor..." value="${selfHelpData.kelolaPikiran.dengar || ''}">
          </div>
          <div>
            <label style="font-size: 11px; font-weight: 800; display: block; margin-bottom: 3px;">👃 2 Aroma yang bisa kamu CIUM:</label>
            <input type="text" id="sh-gr-cium" class="m-input" placeholder="Misal: Sabun wangi, bau tanah hujan..." value="${selfHelpData.kelolaPikiran.cium || ''}">
          </div>
          <div>
            <label style="font-size: 11px; font-weight: 800; display: block; margin-bottom: 3px;">👅 1 Rasa yang ada di lidahmu:</label>
            <input type="text" id="sh-gr-rasakan" class="m-input" placeholder="Misal: Rasa sisa air putih, pasta gigi..." value="${selfHelpData.kelolaPikiran.rasakan || ''}">
          </div>
        </div>

        <button class="btn-m btn-m-mint btn-m-block" style="margin-top: 14px;" onclick="saveGroundingInputs()">
          Simpan Latihan Grounding 💾
        </button>
      </div>
    `;
  }
  else if (toolKey === 'reframing') {
    badgeEl.innerText = 'UJI REALITAS';
    titleEl.innerText = '🔍 Tantang Pikiran Otomatis';
    bodyEl.innerHTML = `
      <div class="m-card">
        <h3 style="font-family: var(--font-heading); font-size: 15px; margin-bottom: 4px;">Uji Pikiran Negatif (CBT)</h3>
        <p style="font-size: 11.5px; color: #444; margin-bottom: 12px;">
          Otak sering melebih-lebihkan masalah. Ayo uji apakah pikiranmu fakta nyata atau cuma asumsi!
        </p>

        <div style="margin-bottom: 10px;">
          <label style="font-size: 11px; font-weight: 800; display: block; margin-bottom: 4px;">🌪️ Pikiran otomatis yang mengganggu:</label>
          <textarea id="sh-rf-muncul" rows="3" class="m-textarea" placeholder="Contoh: Temanku tidak membalas chat, pasti dia benci padaku...">${selfHelpData.kelolaPikiran.pikiranMuncul || ''}</textarea>
        </div>

        <div style="margin-bottom: 12px;">
          <label style="font-size: 11px; font-weight: 800; display: block; margin-bottom: 4px; color: #15803D;">🌱 Pikiran yang lebih realistis & membantu:</label>
          <textarea id="sh-rf-realistis" rows="3" class="m-textarea" placeholder="Contoh: Dia mungkin sedang sibuk atau baterai HP-nya habis. Ini bukan berarti dia membenciku...">${selfHelpData.kelolaPikiran.pikiranRealistis || ''}</textarea>
        </div>

        <button class="btn-m btn-m-pink btn-m-block" onclick="saveReframingInputs()">
          Simpan Uji Pikiran 💾
        </button>
      </div>
    `;
  }
  else if (toolKey === 'digital_habit') {
    badgeEl.innerText = 'DETOKS DIGITAL';
    titleEl.innerText = '📴 Cek Kebiasaan Layar';
    const habits = [
      'Buka sosmed tanpa tujuan saat merasa bosan',
      'Membandingkan fisik atau gaya hidup dengan orang lain',
      'Sulit berhenti scrolling meski mata sudah perih',
      'Main HP di kasur sampai mengganggu jam tidur'
    ];
    const savedHabits = selfHelpData.keseharian.digitalHabits || [];

    bodyEl.innerHTML = `
      <div class="m-card">
        <h3 style="font-family: var(--font-heading); font-size: 15px; margin-bottom: 6px;">Checklist Kebiasaan Medsos:</h3>
        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px;">
          ${habits.map((h, i) => `
            <label style="display: flex; align-items: flex-start; gap: 8px; font-size: 12px; font-weight: 700; cursor: pointer;">
              <input type="checkbox" id="sh-dh-${i}" value="${h}" ${savedHabits.includes(h) ? 'checked' : ''} style="width: 16px; height: 16px; accent-color: var(--hot-pink); margin-top: 2px;">
              <span>${h}</span>
            </label>
          `).join('')}
        </div>

        <div style="margin-bottom: 12px;">
          <label style="font-size: 11px; font-weight: 800; display: block; margin-bottom: 4px;">🎯 Satu batas digital yang ingin kuterapkan:</label>
          <input type="text" id="sh-dh-batas" class="m-input" placeholder="Misal: HP dicas di luar kamar setelah jam 10 malam" value="${selfHelpData.keseharian.batasDigital || ''}">
        </div>

        <button class="btn-m btn-m-blue btn-m-block" onclick="saveDigitalHabitsInputs()">
          Simpan Batas Digital 💾
        </button>
      </div>
    `;
  }
  else if (toolKey === 'support_circle') {
    badgeEl.innerText = 'SUPPORT CIRCLE';
    titleEl.innerText = '👥 Kontak Orang Tepercaya';
    bodyEl.innerHTML = `
      <div class="m-card">
        <h3 style="font-family: var(--font-heading); font-size: 15px; margin-bottom: 4px;">Daftar Teman Cerita</h3>
        <p style="font-size: 11.5px; color: #444; margin-bottom: 12px;">
          Saat beban terasa berat, bercerita pada orang yang tepat dapat meringankan 50% bebanmu.
        </p>

        <div style="margin-bottom: 10px;">
          <label style="font-size: 11px; font-weight: 800; display: block; margin-bottom: 4px;">Sosok Tepercaya 1 (Nama & Hubungan):</label>
          <input type="text" id="sh-sup-n1" class="m-input" placeholder="Misal: Kak Rian (Kakak Kandung)" value="${selfHelpData.support.cerita1Nama || ''}">
          <input type="text" id="sh-sup-w1" class="m-input" style="margin-top: 4px;" placeholder="Kapan bisa dihubungi? (Misal: Malam hari)" value="${selfHelpData.support.cerita1Waktu || ''}">
        </div>

        <div style="margin-bottom: 12px;">
          <label style="font-size: 11px; font-weight: 800; display: block; margin-bottom: 4px;">Sosok Tepercaya 2 (Nama & Hubungan):</label>
          <input type="text" id="sh-sup-n2" class="m-input" placeholder="Misal: Bu Nina (Guru BK / Konselor)" value="${selfHelpData.support.cerita2Nama || ''}">
          <input type="text" id="sh-sup-w2" class="m-input" style="margin-top: 4px;" placeholder="Kapan bisa dihubungi? (Misal: Jam istirahat sekolah)" value="${selfHelpData.support.cerita2Waktu || ''}">
        </div>

        <button class="btn-m btn-m-lavender btn-m-block" onclick="saveSupportCircleInputs()">
          Simpan Kontak Suportif 💾
        </button>

        <div style="background: #F0FAF1; border: var(--border-sm); border-radius: 12px; padding: 10px; margin-top: 14px;">
          <div style="font-weight: 800; font-size: 12px; color: #198754;">🧠 SEJIWA (Kemenkes RI)</div>
          <div style="font-size: 11px; color: #444;">Hotline Bantuan Kesehatan Jiwa: <b>Telepon 119 tekan 8</b></div>
        </div>
      </div>
    `;
  }
  else if (toolKey === 'needs_check') {
    badgeEl.innerText = 'KEBUTUHAN BATIN';
    titleEl.innerText = '💖 Checklist Kebutuhanku';
    const needs = ["Didengarkan", "Istirahat cukup", "Dukungan teman", "Waktu sendiri", "Bantuan masalah tugas", "Ruang mencoba lagi tanpa dicela"];
    const savedNeeds = selfHelpData.kekuatanDiri.selectedNeeds || [];

    bodyEl.innerHTML = `
      <div class="m-card">
        <h3 style="font-family: var(--font-heading); font-size: 15px; margin-bottom: 4px;">Apa yang Sebenarnya Kubutuhkan?</h3>
        <p style="font-size: 11.5px; color: #444; margin-bottom: 12px;">
          Centang kebutuhan emosi dan fisik yang saat ini paling kamu dambakan:
        </p>

        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px;">
          ${needs.map((n, i) => `
            <label style="display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; cursor: pointer; padding: 6px 10px; border: var(--border-sm); border-radius: 10px; background: ${savedNeeds.includes(n) ? '#FFF9D2' : '#FFF'};">
              <input type="checkbox" id="sh-need-${i}" value="${n}" ${savedNeeds.includes(n) ? 'checked' : ''} style="width: 16px; height: 16px; accent-color: var(--hot-pink);">
              <span>${n}</span>
            </label>
          `).join('')}
        </div>

        <button class="btn-m btn-m-yellow btn-m-block" onclick="saveNeedsCheckInputs()">
          Simpan Kebutuhanku 💾
        </button>
      </div>
    `;
  }

  bodyEl.scrollTop = 0;
  openToolModalOverlay();
}

function saveGroundingInputs() {
  selfHelpData.kelolaPikiran.lihat = document.getElementById('sh-gr-lihat')?.value || '';
  selfHelpData.kelolaPikiran.sentuh = document.getElementById('sh-gr-sentuh')?.value || '';
  selfHelpData.kelolaPikiran.dengar = document.getElementById('sh-gr-dengar')?.value || '';
  selfHelpData.kelolaPikiran.cium = document.getElementById('sh-gr-cium')?.value || '';
  selfHelpData.kelolaPikiran.rasakan = document.getElementById('sh-gr-rasakan')?.value || '';
  saveSelfHelpData();
  showToast('✅ Latihan Grounding Disimpan!');
  closeToolModal();
}

function saveReframingInputs() {
  selfHelpData.kelolaPikiran.pikiranMuncul = document.getElementById('sh-rf-muncul')?.value || '';
  selfHelpData.kelolaPikiran.pikiranRealistis = document.getElementById('sh-rf-realistis')?.value || '';
  saveSelfHelpData();
  showToast('✅ Uji Pikiran Disimpan!');
  closeToolModal();
}

function saveDigitalHabitsInputs() {
  const selected = [];
  for (let i = 0; i < 4; i++) {
    const cb = document.getElementById(`sh-dh-${i}`);
    if (cb && cb.checked) selected.push(cb.value);
  }
  selfHelpData.keseharian.digitalHabits = selected;
  selfHelpData.keseharian.batasDigital = document.getElementById('sh-dh-batas')?.value || '';
  saveSelfHelpData();
  showToast('✅ Batas Digital Disimpan!');
  closeToolModal();
}

function saveSupportCircleInputs() {
  selfHelpData.support.cerita1Nama = document.getElementById('sh-sup-n1')?.value || '';
  selfHelpData.support.cerita1Waktu = document.getElementById('sh-sup-w1')?.value || '';
  selfHelpData.support.cerita2Nama = document.getElementById('sh-sup-n2')?.value || '';
  selfHelpData.support.cerita2Waktu = document.getElementById('sh-sup-w2')?.value || '';
  saveSelfHelpData();
  showToast('✅ Kontak Suportif Disimpan!');
  closeToolModal();
}

function saveNeedsCheckInputs() {
  const needs = ["Didengarkan", "Istirahat cukup", "Dukungan teman", "Waktu sendiri", "Bantuan masalah tugas", "Ruang mencoba lagi tanpa dicela"];
  const selected = [];
  needs.forEach((n, i) => {
    const cb = document.getElementById(`sh-need-${i}`);
    if (cb && cb.checked) selected.push(cb.value);
  });
  selfHelpData.kekuatanDiri.selectedNeeds = selected;
  saveSelfHelpData();
  showToast('✅ Kebutuhan Batin Disimpan!');
  closeToolModal();
}

// --------------------------------------------------------------------------
// TAB 4: CATATANKU & RENCANA
// --------------------------------------------------------------------------
function updateSelfHelpNotesTab() {
  const readChapters = JSON.parse(localStorage.getItem('selfhelp_read_chapters') || '[]');
  const bookmarks = JSON.parse(localStorage.getItem('selfhelp_bookmarks') || '[]');
  const totalChapters = typeof SELFHELP_CHAPTERS !== 'undefined' ? SELFHELP_CHAPTERS.length : 7;

  const percent = Math.round((readChapters.length / totalChapters) * 100);

  const percentEl = document.getElementById('selfhelp-read-percent');
  const progBarEl = document.getElementById('selfhelp-read-prog-bar');
  const progTextEl = document.getElementById('selfhelp-read-prog-text');

  if (percentEl) percentEl.innerText = `${percent}%`;
  if (progBarEl) progBarEl.style.width = `${percent}%`;
  if (progTextEl) progTextEl.innerText = `${readChapters.length} dari ${totalChapters} Materi Selesai`;

  // Bookmarks List
  const bmListEl = document.getElementById('selfhelp-bookmark-list');
  if (bmListEl) {
    if (bookmarks.length === 0) {
      bmListEl.innerHTML = '<div style="font-size: 11.5px; color: #888; font-style: italic;">Belum ada materi yang disimpan. Klik ikon bintang ☆ di lembar baca untuk menyimpan.</div>';
    } else {
      const bookmarkedChaps = SELFHELP_CHAPTERS.filter(c => bookmarks.includes(c.id));
      bmListEl.innerHTML = bookmarkedChaps.map(c => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px dashed #DDD; cursor: pointer;" onclick="openChapterOverlay('selfhelp', ${c.id})">
          <div style="font-size: 12px; font-weight: 700;">⭐ ${c.icon} ${c.title}</div>
          <span style="font-size: 11px; color: var(--hot-pink);">Buka →</span>
        </div>
      `).join('');
    }
  }

  // Profile Fields
  const namaInput = document.getElementById('sh-prof-nama');
  const usiaInput = document.getElementById('sh-prof-usia');
  if (namaInput) namaInput.value = selfHelpData.profile.nama || '';
  if (usiaInput) usiaInput.value = selfHelpData.profile.usia || '';

  // Gratitude Fields
  const g1 = document.getElementById('sh-grat-1');
  const g2 = document.getElementById('sh-grat-2');
  const g3 = document.getElementById('sh-grat-3');
  if (g1) g1.value = selfHelpData.keseharian.syukur1 || '';
  if (g2) g2.value = selfHelpData.keseharian.syukur2 || '';
  if (g3) g3.value = selfHelpData.keseharian.syukur3 || '';

  renderGratitudeHistory();

  if (typeof updateSecuritySettingsUI === 'function') {
    updateSecuritySettingsUI();
  }
}

function saveSelfHelpProfile() {
  const nama = document.getElementById('sh-prof-nama')?.value || '';
  const usia = document.getElementById('sh-prof-usia')?.value || '';
  selfHelpData.profile.nama = nama;
  selfHelpData.profile.usia = usia;
  saveSelfHelpData();
  showToast('👤 Profil Berhasil Disimpan!');
}

function saveSelfHelpGratitude() {
  const g1 = document.getElementById('sh-grat-1')?.value || '';
  const g2 = document.getElementById('sh-grat-2')?.value || '';
  const g3 = document.getElementById('sh-grat-3')?.value || '';

  selfHelpData.keseharian.syukur1 = g1;
  selfHelpData.keseharian.syukur2 = g2;
  selfHelpData.keseharian.syukur3 = g3;
  saveSelfHelpData();

  if (g1 || g2 || g3) {
    let history = JSON.parse(localStorage.getItem('selfhelp_gratitude_history') || '[]');
    history.unshift({
      id: Date.now(),
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      items: [g1, g2, g3].filter(Boolean)
    });
    localStorage.setItem('selfhelp_gratitude_history', JSON.stringify(history));
  }

  renderGratitudeHistory();
  showToast('🌻 3 Hal Baik Hari Ini Disimpan!');
}

function renderGratitudeHistory() {
  const container = document.getElementById('sh-gratitude-history-list');
  if (!container) return;

  const history = JSON.parse(localStorage.getItem('selfhelp_gratitude_history') || '[]');
  if (history.length === 0) {
    container.innerHTML = '<div style="font-size: 11px; color: #888; font-style: italic;">Belum ada arsip riwayat rasa syukur tersimpan.</div>';
    return;
  }

  container.innerHTML = history.slice(0, 5).map(h => `
    <div style="border: var(--border-sm); border-radius: 8px; padding: 8px 10px; background: #FFF; margin-top: 6px; box-shadow: 1.5px 1.5px 0px var(--ink);">
      <div style="font-size: 10.5px; font-weight: 800; color: #444; margin-bottom: 3px;">📅 ${h.date}</div>
      <ul style="margin: 0; padding-left: 16px; font-size: 11px; color: #333;">
        ${h.items.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

function printSelfHelpWorkbook() {
  window.print();
}

function resetSelfHelpWorkbook() {
  if (confirm('Apakah kamu yakin ingin mereset seluruh data isian workbook ini? Data yang terhapus tidak dapat dikembalikan.')) {
    localStorage.removeItem(SH_STORAGE_KEY);
    localStorage.removeItem('selfhelp_read_chapters');
    localStorage.removeItem('selfhelp_bookmarks');
    selfHelpData = {
      profile: { nama: '', usia: '' },
      jurnalEmosi: { selectedEmosi: [], situasi: '', pikiran: '', intensitas: 5, tindakan: '', alternatif: '' },
      kelolaPikiran: { pikiranMuncul: '', pikiranRealistis: '', lihat: '', sentuh: '', dengar: '', cium: '', rasakan: '' },
      kekuatanDiri: { halBaik1: '', halBaik2: '', halBaik3: '', halBerat: '', selfTalkDown: '', selfTalkRamah: '', selectedNeeds: [] },
      keseharian: { syukur1: '', syukur2: '', syukur3: '', stressSituasi: '', stressKontrol: '', stressLangkah: '', digitalHabits: [], batasDigital: '' },
      support: { cerita1Nama: '', cerita1Waktu: '', cerita2Nama: '', cerita2Waktu: '', rencanaTingkatkan: '', rencanaKurangi: '', rencanaAktivitas: '' },
      savedJournalEntries: []
    };
    initSelfHelpApp();
    showToast('🔄 Seluruh Data Berhasil Direset!');
  }
}
