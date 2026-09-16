// ==========================================================================
// KESPRO SPACE - Application Logic (Dual-Track Persona, Reader & Tools)
// Ruang Tumbuh Remaja - Edukasi Interaktif (Unified Neo-Memphis Edition)
// ==========================================================================

let kesproTrack = localStorage.getItem('kespro_track') || 'girl'; // 'girl' or 'boy'
let kesproCurrentChapterId = 1;
let kesproActiveCategory = 'all';
let kesproSearchQuery = '';

// Initialize Kespro Module
function initKesproApp() {
  initKesproTrackUI();
  renderKesproChapterList();
  renderKesproInteractiveHub();
  updateKesproSafetySummary();
  updateKesproNotesTab();
}

function initKesproTrackUI() {
  const pill = document.getElementById('kespro-track-pill');
  if (!pill) return;

  if (kesproTrack === 'girl') {
    pill.className = 'track-pill girl';
    pill.innerHTML = '<span>🙋‍♀️</span> <span class="track-text-long">Cewek</span> <span>🔄</span>';
  } else {
    pill.className = 'track-pill boy';
    pill.innerHTML = '<span>🙋‍♂️</span> <span class="track-text-long">Cowok</span> <span>🔄</span>';
  }

  const trackStatusText = document.getElementById('kespro-track-status-text');
  if (trackStatusText) {
    trackStatusText.innerText = kesproTrack === 'girl' ? 'Jalur Cewek 🙋‍♀️' : 'Jalur Cowok 🙋‍♂️';
  }
}

function switchKesproTrack(track) {
  kesproTrack = track;
  localStorage.setItem('kespro_track', track);
  initKesproTrackUI();
  renderKesproChapterList();
  renderKesproInteractiveHub();
  updateKesproNotesTab();
  showToast(track === 'girl' ? '💖 Beralih ke Jalur Cewek!' : '⚡ Beralih ke Jalur Cowok!');
}

function toggleKesproTrack() {
  const nextTrack = kesproTrack === 'girl' ? 'boy' : 'girl';
  switchKesproTrack(nextTrack);
}

// 4-Tab Switcher inside Kespro
function switchKesproTab(tabId, el) {
  document.querySelectorAll('#view-kespro .tab-view').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('#view-kespro .nav-item').forEach(n => n.classList.remove('active'));

  const target = document.getElementById(tabId);
  if (target) target.classList.add('active');
  if (el) el.classList.add('active');

  // Scroll to top
  const main = document.querySelector('#view-kespro .app-main');
  if (main) main.scrollTop = 0;

  if (tabId === 'tab-kespro-notes') {
    updateKesproNotesTab();
  }

  // GSAP Tab Motion & Tactile Nav Bounce
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

// Render Chapters List
function renderKesproChapterList(cat = kesproActiveCategory, search = kesproSearchQuery) {
  kesproActiveCategory = cat;
  kesproSearchQuery = search;

  const container = document.getElementById('kespro-chapter-list');
  if (!container || typeof EBOOK_CHAPTERS === 'undefined') return;

  const readChapters = JSON.parse(localStorage.getItem('kespro_read_chapters') || '[]');
  const bookmarks = JSON.parse(localStorage.getItem('kespro_bookmarks') || '[]');

  const filtered = EBOOK_CHAPTERS.filter(chap => {
    // Filter track
    if (chap.track && chap.track !== 'all' && chap.track !== kesproTrack) return false;

    // Filter category
    if (cat === 'kenali' && !['PENGANTAR', 'NAVIGASI', 'DASAR KESPRO', 'KENALI DIRIMU'].includes(chap.category)) return false;
    if (cat === 'tubuh' && !['BATASAN DIRI', 'PUBERTAS', 'ANATOMI REPRODUKSI', 'MENSTRUASI', 'MIMPI BASAH'].includes(chap.category)) return false;
    if (cat === 'relasi' && !['RELASI SEHAT', 'GENDER & KESETARAAN', 'KOMUNIKASI'].includes(chap.category)) return false;
    if (cat === 'sehat' && !['KEBERSIHAN & GIZI', 'KEHAMILAN & REPRODUKSI', 'IMS & KESEHATAN', 'HIV & AIDS', 'STIGMA & DUKUNGAN'].includes(chap.category)) return false;
    if (cat === 'keamanan' && !['KEKERASAN & HAK', 'EMOSI & BULLYING', 'DUNIA DIGITAL', 'NAPZA', 'LAYANAN KESEHATAN', 'PENDAMPING'].includes(chap.category)) return false;

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
        <div style="font-size: 11.5px; color: #666; margin-top: 4px;">Coba gunakan kata kunci lain atau pilih Semua Bab.</div>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(chap => {
    const isRead = readChapters.includes(chap.id);
    const isBookmarked = bookmarks.includes(chap.id);
    const readBadge = isRead ? '<span class="status-check" title="Sudah Dibaca">✔️</span>' : '<span style="font-size: 12px; color: #BBB;">⚪</span>';
    const starBadge = isBookmarked ? '⭐ ' : '';
    const trackBadge = chap.track === 'girl' 
      ? '<span class="badge badge-pink" style="font-size: 8.5px; padding: 2px 6px; margin: 0;">🙋‍♀️ Cewek</span>'
      : chap.track === 'boy' 
        ? '<span class="badge badge-yellow" style="font-size: 8.5px; padding: 2px 6px; margin: 0;">🙋‍♂️ Cowok</span>'
        : '';

    return `
      <div class="chapter-card" onclick="openChapterOverlay('kespro', ${chap.id})">
        <div class="chapter-left">
          <div class="chap-num ${isRead ? 'read' : ''}">${String(chap.id).padStart(2, '0')}</div>
          <div style="flex: 1; min-width: 0;">
            <div class="chapter-title" style="display: flex; align-items: center; gap: 4px; flex-wrap: wrap;">
              <span>${starBadge}${chap.icon || ''}</span>
              <span>${chap.title}</span>
            </div>
            ${chap.hook ? `<div style="font-size: 11px; color: #52525B; margin: 2px 0 4px 0; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${chap.hook}</div>` : ''}
            <div class="chapter-meta" style="display: flex; align-items: center; gap: 5px; flex-wrap: wrap; margin-top: 3px;">
              <span class="badge ${getKesproCategoryBadge(chap.category)}" style="margin: 0; font-size: 8.5px;">${chap.category}</span>
              ${trackBadge}
              <span style="font-size: 10px; color: #71717A;">• ${chap.readTime || '3 mnt baca'}</span>
            </div>
          </div>
        </div>
        <div style="flex-shrink: 0; padding-left: 6px;">${readBadge}</div>
      </div>
    `;
  }).join('');
}

function filterKesproCategory(cat, btn) {
  document.querySelectorAll('#view-kespro .cat-pill').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderKesproChapterList(cat, kesproSearchQuery);

  if (window.gsap) {
    const cards = document.querySelectorAll('#kespro-chapter-list .chapter-card');
    if (cards.length > 0) {
      gsap.fromTo(Array.from(cards).slice(0, 10),
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.25, stagger: 0.035, ease: 'power2.out', clearProps: 'transform,opacity' }
      );
    }
  }
}

function onKesproSearch(query) {
  renderKesproChapterList(kesproActiveCategory, query);
}

function getKesproCategoryBadge(cat) {
  switch (cat) {
    case 'PENGANTAR':
    case 'NAVIGASI':
      return 'badge-yellow';
    case 'DASAR KESPRO':
    case 'KENALI DIRIMU':
      return 'badge-mint';
    case 'BATASAN DIRI':
    case 'PUBERTAS':
    case 'ANATOMI REPRODUKSI':
      return 'badge-blue';
    case 'RELASI SEHAT':
    case 'MENSTRUASI':
    case 'MIMPI BASAH':
      return 'badge-pink';
    default:
      return 'badge-lavender';
  }
}

// Interactive Toolkit Hub
function renderKesproInteractiveHub() {
  const container = document.getElementById('kespro-interactive-hub-container');
  if (!container) return;

  const isGirl = kesproTrack === 'girl';
  const trackToolTitle = isGirl ? 'Pelacak Siklus Menstruasi & Kram Care' : 'Fakta Mimpi Basah, Ereksi & Sirkumsisi';
  const trackToolDesc = isGirl 
    ? 'Catat siklus bulanan, prediksi masa subur, dan tips atasi nyeri kram perut saat haid.'
    : 'Penjelasan medis ilmiah tentang proses ejakulasi alami, ereksi pagi hari, dan perawatan kebersihan.';
  const trackToolBadge = isGirl ? 'badge-pink' : 'badge-blue';

  container.innerHTML = `
    <!-- Tool 1: Anatomi -->
    <div class="tool-hub-card" onclick="openKesproTool('anatomy')">
      <div class="tool-hub-header">
        <span class="badge badge-yellow">VISUAL EDUKATIF</span>
        <span style="font-size: 20px;">🔬</span>
      </div>
      <div class="tool-hub-title">Eksplorasi Organ Reproduksi (${isGirl ? 'Cewek' : 'Cowok'})</div>
      <div class="tool-hub-desc">
        Pahami letak, fungsi, dan fakta biologis organ intimmu tanpa tabu dan bebas rasa malu.
      </div>
      <button class="btn-m btn-m-yellow btn-m-block" style="font-size: 12px; padding: 8px;">
        Buka Visual Anatomi 👉
      </button>
    </div>

    <!-- Tool 2: Radar Red/Green Flag -->
    <div class="tool-hub-card" onclick="openKesproTool('radar')">
      <div class="tool-hub-header">
        <span class="badge badge-pink">KUIS INTERAKTIF</span>
        <span style="font-size: 20px;">🚩</span>
      </div>
      <div class="tool-hub-title">Radar Relasi: Red Flag vs Green Flag</div>
      <div class="tool-hub-desc">
        Uji kepekaanmu terhadap 5 skenario pacaran & pertemanan. Kenali sinyal bahaya sejak awal!
      </div>
      <button class="btn-m btn-m-pink btn-m-block" style="font-size: 12px; padding: 8px;">
        Mulai Kuis Radar 👉
      </button>
    </div>

    <!-- Tool 3: GGL Kalkulator -->
    <div class="tool-hub-card" onclick="openKesproTool('ggl')">
      <div class="tool-hub-header">
        <span class="badge badge-mint">GIZI & HORMON</span>
        <span style="font-size: 20px;">🧋</span>
      </div>
      <div class="tool-hub-title">Kalkulator Jajanan Gaul (Gula-Garam-Lemak)</div>
      <div class="tool-hub-desc">
        Hitung kadar gula dari boba, kopi susu, dan camilan harianmu sesuai anjuran resmi Kemenkes RI.
      </div>
      <button class="btn-m btn-m-mint btn-m-block" style="font-size: 12px; padding: 8px;">
        Hitung Asupan Jajanku 👉
      </button>
    </div>

    <!-- Tool 4: Asertif Generator -->
    <div class="tool-hub-card" onclick="openKesproTool('asertif')">
      <div class="tool-hub-header">
        <span class="badge badge-lavender">KETERAMPILAN HIDUP</span>
        <span style="font-size: 20px;">💬</span>
      </div>
      <div class="tool-hub-title">Generator Bicara Asertif: Berani Berkata "TIDAK"</div>
      <div class="tool-hub-desc">
        Rangkai kalimat penolakan sopan namun tegas saat dipaksa melakukan hal yang melanggar batasanmu.
      </div>
      <button class="btn-m btn-m-lavender btn-m-block" style="font-size: 12px; padding: 8px;">
        Latih Bicara Asertif 👉
      </button>
    </div>

    <!-- Tool 5: Track Persona Tool -->
    <div class="tool-hub-card" onclick="openKesproTool('track_tool')">
      <div class="tool-hub-header">
        <span class="badge ${trackToolBadge}">KHUSUS JALUR</span>
        <span style="font-size: 20px;">${isGirl ? '🩸' : '⚡'}</span>
      </div>
      <div class="tool-hub-title">${trackToolTitle}</div>
      <div class="tool-hub-desc">${trackToolDesc}</div>
      <button class="btn-m ${isGirl ? 'btn-m-pink' : 'btn-m-blue'} btn-m-block" style="font-size: 12px; padding: 8px;">
        Buka Panduan Khusus 👉
      </button>
    </div>
  `;
}

// ==========================================================================
// KESPRO INTERACTIVE TOOLS: DATA & STATE MANAGEMENT
// ==========================================================================

// 1. Radar Relasi (Red Flag vs Green Flag - Gamified Scenario Quiz)
const KESPRO_RADAR_SCENARIOS = [
  {
    id: 1,
    category: "PRIVASI & MEDSOS",
    scenario: "Pacarmu memaksa meminta password Instagram dan akun WhatsApp dengan alasan: 'Kalau beneran sayang dan jujur, nggak boleh ada rahasia sama sekali di antara kita!'",
    correctAnswer: "red",
    badgeLabel: "Pelanggaran Privasi",
    explanation: "Meminta sandi akun atau membajak chat pribadi adalah bentuk kontrol posesif dan pelanggaran batasan privasi, BUKAN bukti cinta yang sehat!",
    asertifQuote: "Sayang itu dibangun di atas rasa saling percaya, bukan saling memata-matai. Sandi akun adalah hak batasan privasiku."
  },
  {
    id: 2,
    category: "BATASAN & CONSENT",
    scenario: "Kamu menolak ajakan pacar untuk pergi berduaan ke tempat sepi sepulang sekolah, dan dia tersenyum ramah: 'Oke santai, aku hargai keputusanmu. Kita nongkrong bareng teman-teman di kantin aja yuk!'",
    correctAnswer: "green",
    badgeLabel: "Menghormati Batasan (Consent)",
    explanation: "Pasangan yang sehat selalu menghormati kata 'tidak' tanpa merajuk, tanpa menuntut penjelasan berulang, dan tanpa membuatmu merasa bersalah!",
    asertifQuote: "Terima kasih sudah menghargai rasa nyamanku. Aku senang kita bisa saling jujur dan terbuka."
  },
  {
    id: 3,
    category: "MANIPULASI EMOSI",
    scenario: "Saat kamu menolak kontak fisik yang membuatmu risih, dia mulai merajuk dan berkata: 'Kamu udah nggak sayang lagi ya sama aku? Teman-teman yang lain aja pacarannya santai dan fleksibel!'",
    correctAnswer: "red",
    badgeLabel: "Gaslighting & Guilt-Tripping",
    explanation: "Ini adalah manipulasi rasa bersalah (guilt-tripping) dan memanfaatkan tekanan teman sebaya (peer pressure) untuk melanggar batas persetujuan (consent).",
    asertifQuote: "Rasa sayangku tidak ditentukan oleh kontak fisik. Tolong jangan bandingkan batasanku dengan orang lain."
  },
  {
    id: 4,
    category: "DUKUNGAN PRESTASI",
    scenario: "Pacarmu sangat mendukung saat kamu ikut bimbingan belajar atau lomba sekolah, dan bangga atas prestasimu tanpa merasa tersaingi atau menuntut jatah waktu belajarmu.",
    correctAnswer: "green",
    badgeLabel: "Suportif & Tumbuh Bersama",
    explanation: "Hubungan yang sehat mendorong masing-masing pribadi untuk terus berkembang meraih cita-cita, bukan membelenggu masa depan pasangannya.",
    asertifQuote: "Dukunganmu sangat berharga buat masa depanku. Terima kasih selalu ada buatku!"
  },
  {
    id: 5,
    category: "KONTROL & ANCAMAN",
    scenario: "Setiap kali kamu kerja kelompok bareng teman sekelas, dia spam telepon puluhan kali, menuduhmu selingkuh, dan mengancam akan menyebarkan foto atau rahasia pribadimu jika tidak segera pulang.",
    correctAnswer: "red",
    badgeLabel: "Teror Emosional & Pemerasan",
    explanation: "Ini sinyal bahaya ekstrem (emotional blackmail dan kekerasan dalam pacaran). Segera buat jarak aman dan ceritakan hal ini kepada orang dewasa tepercaya!",
    asertifQuote: "Tuduhan dan ancaman ini sudah melanggar batasan keselamatan. Aku berhak merasa aman dan tidak akan menuruti ancamanmu."
  }
];

let kesproRadarState = {
  currentIndex: 0,
  score: 0,
  isAnswered: false,
  lastChoice: null,
  viewMode: 'quiz', // 'quiz' or 'cheatsheet'
  completed: false
};

// 2. GGL Calculator State & Nutrition Values
let kesproGglCounts = {
  boba: 0,
  kopisusu: 0,
  soda: 0,
  esteh: 0,
  gorengan: 0,
  mieinstan: 0
};

const KESPRO_GGL_ITEMS = [
  { id: 'boba', name: '🧋 Boba Brown Sugar (1 Cup)', sugar: 45, salt: 0.2, fat: 8 },
  { id: 'kopisusu', name: '☕ Es Kopi Susu Aren (1 Gelas)', sugar: 28, salt: 0.1, fat: 6 },
  { id: 'soda', name: '🥤 Soda Kaleng (330ml)', sugar: 35, salt: 0.1, fat: 0 },
  { id: 'esteh', name: '🧃 Es Teh Manis Jumbo (1 Cup)', sugar: 25, salt: 0, fat: 0 },
  { id: 'gorengan', name: '🥟 Gorengan / Cireng (2 pcs)', sugar: 0, salt: 1.2, fat: 18 },
  { id: 'mieinstan', name: '🍜 Mie Instan Kuah / Goreng (1 bks)', sugar: 3, salt: 3.8, fat: 14 }
];

// 3. Asertif Generator State & Templates
let kesproAsertifState = {
  scenario: 'privasi',
  tone: 'santai'
};

const KESPRO_ASERTIF_TEMPLATES = {
  privasi: {
    title: "📱 Menolak Berbagi Password HP / Medsos",
    santai: "Aku hargai kamu, tapi isi HP dan akun medsos adalah ranah privasiku. Hubungan kita bakal lebih sehat kalau saling percaya tanpa harus saling cek HP.",
    sopan: "Mohon maaf ya, aku merasa kurang nyaman jika password atau chat pribadiku dibuka. Demi kebaikan bersama, mari kita saling menghormati batas privasi masing-masing.",
    keras: "Tolong berhenti memaksa meminta password-ku. Memata-matai atau membajak akun adalah pelanggaran privasi, dan aku tidak akan memberikan aksesnya."
  },
  fisik: {
    title: "✋ Menolak Sentuhan Fisik / Ajakan Risih",
    santai: "Stop dulu ya, aku lagi nggak nyaman dengan sentuhan fisik kayak gini. Kita ngobrol santai aja yuk!",
    sopan: "Maaf ya, batasan kenyamananku belum sampai di situ. Aku harap kamu bisa menghargai keputusanku untuk menjaga batasan fisik.",
    keras: "Tolong lepas dan jangan sentuh aku! Tubuhku adalah milikku sepenuhnya, dan kata 'tidak' dariku harus kamu hormati sekarang juga."
  },
  pap: {
    title: "📸 Menolak Permintaan Kirim Foto Pribadi (PAP)",
    santai: "Nggak bisa ya. Aku punya prinsip tegas untuk nggak pernah mengirim foto pribadi atau sensitif ke siapa pun lewat internet.",
    sopan: "Maaf banget, aku tidak bersedia mengirimkan foto semacam itu. Keamanan digital adalah hal yang sangat penting buatku, jadi tolong jangan minta lagi.",
    keras: "Aku tolak dengan tegas! Meminta foto pribadi berisiko pelecehan dan UU ITE. Jangan pernah bahas ini lagi atau aku akan blokir kontakmu."
  },
  nongkrong: {
    title: "🚭 Menolak Ajakan Rokok, Vape, atau Tempat Berisiko",
    santai: "Kalian duluan aja ya, aku skip dulu untuk yang satu ini. Aku lagi fokus jaga kesehatan dan ada tugas di rumah.",
    sopan: "Terima kasih atas ajakannya, tapi aku memilih untuk tidak ikut merokok/vape. Aku tetap teman kalian meski punya pilihan berbeda.",
    keras: "Aku tegaskan aku TIDAK berminat. Jangan paksa aku melakukan hal yang merugikan kesehatanku sendiri."
  },
  bodyshaming: {
    title: "🛡️ Menghentikan Olokan Fisik (Body Shaming) di Circle",
    santai: "Bercandaannya udah kelewatan nih bro/sis. Nggak asik kalau becandaan harus pakai cela fisik orang lain.",
    sopan: "Tolong jangan jadikan fisikku sebagai bahan lelucon ya. Aku merasa tersinggung dan aku yakin kita bisa bercanda dengan topik yang lebih positif.",
    keras: "Cukup! Stop mengomentari bentuk tubuhku. Bercandaanmu tidak lucu dan aku tidak mengizinkan siapa pun merendahkanku seperti ini."
  }
};

// 4. Anatomy Interactive Data
let kesproAnatomyActiveOrgan = null;

const KESPRO_ANATOMY_DATA = {
  girl: [
    {
      id: 'ovarium',
      name: 'Ovarium (Indung Telur)',
      icon: '🥚',
      role: 'Pabrik Sel Telur & Hormon',
      desc: 'Setiap cewek punya 2 ovarium. Setiap bulan, salah satunya mematangkan dan melepaskan 1 sel telur (proses ovulasi) serta memproduksi hormon estrogen & progesteron.',
      myth: 'Mitos: Menstruasi itu darah kotor buangan racun. Fakta Medis: Darah haid adalah lapisan dinding dalam rahim (endometrium) yang kaya nutrisi meluruh secara bersih karena tidak terjadi pembuahan.'
    },
    {
      id: 'tubafalopi',
      name: 'Tuba Falopi (Saluran Telur)',
      icon: '〰️',
      role: 'Jalur Pertemuan & Pembuahan',
      desc: 'Saluran halus berambut silia penghubung ovarium ke rahim. Di sinilah tempat sperma membuahi sel telur sebelum bergerak ke rahim.',
      myth: 'Mitos: Minum air es saat haid bikin darah beku di tuba. Fakta Medis: Saluran cerna dan reproduksi terpisah total! Es masuk lambung, tidak ada hubungannya dengan saluran tuba.'
    },
    {
      id: 'uterus',
      name: 'Uterus (Rahim)',
      icon: '🏠',
      role: 'Tempat Janin Tumbuh Berkembang',
      desc: 'Organ berotot elastis seukuran buah pir. Mampu meregang ratusan kali lipat untuk melindungi dan menutrisi janin selama masa kehamilan.',
      myth: 'Mitos: Minum soda bikin rahim kering. Fakta Medis: Rahim tidak bisa "kering" karena soda. Namun gula berlebih pada soda dapat mengganggu kestabilan hormon tubuh.'
    },
    {
      id: 'serviks',
      name: 'Serviks (Leher Rahim)',
      icon: '🚪',
      role: 'Pintu Gerbang Pelindung Rahim',
      desc: 'Saluran bawah rahim yang terhubung ke vagina. Menghasilkan lendir bening pengatur kesuburan dan bertindak sebagai benteng pelindung dari kuman luar.',
      myth: 'Fakta Sehat: Kanker leher rahim disebabkan infeksi virus HPV dan bisa dicegah secara efektif lewat Vaksinasi HPV sejak usia sekolah (9-14 tahun)!'
    },
    {
      id: 'vagina',
      name: 'Vagina',
      icon: '🌸',
      role: 'Saluran Elastis & Jalan Lahir',
      desc: 'Saluran otot elastis tempat keluarnya darah haid dan jalan lahir. Memiliki ekosistem bakteri baik alami (Lactobacillus) yang menjaga keasaman pH.',
      myth: 'Mitos: Vagina harus disemprot sabun wangi antiseptik. Fakta Medis: Sabun antiseptik membunuh flora baik! Cukup basuh dengan air bersih mengalir dari depan ke belakang.'
    }
  ],
  boy: [
    {
      id: 'testis',
      name: 'Testis (Buah Zakar)',
      icon: '⚙️',
      role: 'Pabrik Sperma & Testosteron',
      desc: 'Sepasang organ berbentuk oval di dalam skrotum. Memproduksi jutaan sel sperma setiap hari dan hormon testosteron yang memicu suara berat, jakun, dan massa otot.',
      myth: 'Mitos: Testis kiri menggantung lebih rendah adalah penyakit. Fakta Medis: Ini normal anatomis agar kedua buah zakar tidak saling berbenturan saat beraktivitas.'
    },
    {
      id: 'skrotum',
      name: 'Skrotum',
      icon: '🌡️',
      role: 'Termostat Pengatur Suhu',
      desc: 'Kantung pembungkus testis yang elastis. Bertugas menjaga suhu testis 2-3°C lebih dingin dari suhu inti tubuh agar sperma berkembang optimal.',
      myth: 'Tips Sehat: Hindari memakai celana ketat sintetis non-katun atau memangku laptop panas berjam-jam karena panas berlebih bisa menurunkan kualitas sperma.'
    },
    {
      id: 'epididimis',
      name: 'Epididimis',
      icon: '🎓',
      role: 'Pusat Pematangan Sperma',
      desc: 'Saluran bergulung rapat di atas testis. Tempat sperma dimatangkan selama 2-3 minggu, diberi energi gerak, dan disimpan sebelum ejakulasi.',
      myth: 'Fakta Medis: Sperma yang tidak diejakulasikan akan diserap kembali oleh tubuh secara alami dan sehat tanpa menimbulkan efek negatif apa pun.'
    },
    {
      id: 'uretra',
      name: 'Saluran Uretra & Penis',
      icon: '⚡',
      role: 'Saluran Multifungsi Bergantian',
      desc: 'Saluran dalam penis tempat keluarnya urin dan sperma secara bergantian. Memiliki katup pintar otomatis sehingga urin dan sperma tidak akan pernah keluar bersamaan!',
      myth: 'Mitos: Onani bikin dengkul kopong. Fakta Medis: Sendi lutut berisi cairan sinovial dan tulang rawan, sama sekali tidak terhubung ke saluran sperma.'
    },
    {
      id: 'prostat',
      name: 'Kelenjar Prostat & Vesikula Seminalis',
      icon: '💧',
      role: 'Penghasil Cairan Nutrisi Mani',
      desc: 'Memproduksi cairan semen berwarna putih susu yang kaya fruktosa dan enzim pelindung untuk memberi makan sel sperma saat berenang.',
      myth: 'Fakta Ilmiah: Lebih dari 90% volume air mani yang keluar saat mimpi basah berasal dari cairan kelenjar ini, sel sperma hanya 1-5% dari volumenya.'
    }
  ]
};

// 5. Boy Puberty Myths Data
const KESPRO_BOY_MYTHS = [
  {
    title: "Mimpi Basah Bikin Badan Kurus & Loyo?",
    fact: "SALAH BESAR! Mimpi basah adalah mekanisme biologis alami tubuh cowok untuk mengeluarkan kelebihan cairan sperma yang menumpuk. Ini tanda organ reproduksimu aktif dan sehat, bukan pertanda tubuhmu kehilangan energi atau berbuat dosa."
  },
  {
    title: "Ereksi di Pagi Hari Itu Tanda Penyakit?",
    fact: "NORMAL 100%! Fenomena ini disebut NPT (Nocturnal Penile Tumescence). Ini membuktikan sistem saraf dan sirkulasi pembuluh darahmu berfungsi sangat sehat selama fase tidur pulas (REM sleep)."
  },
  {
    title: "Sunat (Sirkumsisi) Hanya Urusan Tradisi?",
    fact: "FAKTA MEDIS: Sunat mempermudah menjaga higienitas kepala penis dari tumpukan smegma (kotoran putih), serta menurunkan risiko infeksi saluran kemih dan penyakit menular menurut WHO."
  },
  {
    title: "Ukuran Tubuh Menentukan Kesuburan?",
    fact: "MITOS! Kesuburan cowok ditentukan oleh jumlah, bentuk, dan motilitas (kecepatan gerak) sel sperma yang sehat di bawah mikroskop, bukan dari tinggi badan, berat badan, atau penampilan luar."
  }
];

// Open Kespro Interactive Tools into the shared Tool Modal Overlay
function openKesproTool(toolKey) {
  const overlay = document.getElementById('tool-modal-overlay');
  const badgeEl = document.getElementById('tool-modal-badge');
  const titleEl = document.getElementById('tool-modal-title');
  const bodyEl = document.getElementById('tool-modal-body');

  if (!overlay || !bodyEl) return;

  const isGirl = kesproTrack === 'girl';

  if (toolKey === 'radar') {
    badgeEl.innerText = 'RELASI SEHAT • GAMIFIKASI';
    titleEl.innerText = '🚩 Radar Relasi: Red Flag vs Green Flag';
    kesproRadarState.currentIndex = 0;
    kesproRadarState.score = 0;
    kesproRadarState.isAnswered = false;
    kesproRadarState.lastChoice = null;
    kesproRadarState.completed = false;
    kesproRadarState.viewMode = 'quiz';
    renderKesproRadarView(bodyEl);
  }
  else if (toolKey === 'ggl') {
    badgeEl.innerText = 'GIZI & HORMON KEMENKES RI';
    titleEl.innerText = '🧋 Kalkulator Jajanan Gaul';
    renderKesproGglView(bodyEl);
  }
  else if (toolKey === 'asertif') {
    badgeEl.innerText = 'KOMUNIKASI EFEKTIF';
    titleEl.innerText = '💬 Generator Bicara Asertif: Katakan "TIDAK"';
    renderKesproAsertifView(bodyEl);
  }
  else if (toolKey === 'anatomy') {
    badgeEl.innerText = isGirl ? 'ANATOMI PEREMPUAN INTERAKTIF' : 'ANATOMI LAKI-LAKI INTERAKTIF';
    titleEl.innerText = isGirl ? 'Organ Reproduksi Cewek 🙋‍♀️' : 'Organ Reproduksi Cowok 🙋‍♂️';
    renderKesproAnatomyView(bodyEl);
  }
  else if (toolKey === 'track_tool') {
    badgeEl.innerText = isGirl ? 'KHUSUS CEWEK • INTERAKTIF' : 'KHUSUS COWOK • INTERAKTIF';
    titleEl.innerText = isGirl ? '🩸 Pelacak Siklus Haid & Kram Care' : '⚡ Fakta Pubertas & Mitos Tubuh Cowok';
    renderKesproTrackToolView(bodyEl);
  }
  else if (toolKey === 'safety_card') {
    badgeEl.innerText = 'EMERGENCY CARD';
    titleEl.innerText = '📋 Kartu Rencana Keselamatanku';
    const savedCard = JSON.parse(localStorage.getItem('kespro_safety_card') || '{}');
    bodyEl.innerHTML = `
      <div class="m-card">
        <h3 style="font-family: var(--font-heading); font-size: 15px; margin-bottom: 4px;">Kartu Siaga Pribadi</h3>
        <p style="font-size: 11.5px; color: #444; margin-bottom: 12px;">
          Catat kontak orang dewasa tepercaya yang siap membantumu saat situasi darurat.
        </p>
        <div style="margin-bottom: 10px;">
          <label style="font-size: 11px; font-weight: 800; display: block; margin-bottom: 4px;">Orang Tepercaya 1 (Nama & No. HP):</label>
          <input type="text" id="kespro-sc-contact1" class="m-input" placeholder="Misal: Ibu / Kakak (0812...)" value="${savedCard.contact1 || ''}">
        </div>
        <div style="margin-bottom: 10px;">
          <label style="font-size: 11px; font-weight: 800; display: block; margin-bottom: 4px;">Orang Tepercaya 2 (Nama & No. HP):</label>
          <input type="text" id="kespro-sc-contact2" class="m-input" placeholder="Misal: Guru BK / Sahabat (0857...)" value="${savedCard.contact2 || ''}">
        </div>
        <div style="margin-bottom: 12px;">
          <label style="font-size: 11px; font-weight: 800; display: block; margin-bottom: 4px;">Tempat Aman Terdekat:</label>
          <input type="text" id="kespro-sc-safeplace" class="m-input" placeholder="Misal: Rumah Nenek / Pos Satpam Kompleks" value="${savedCard.safeplace || ''}">
        </div>
        <button class="btn-m btn-m-mint btn-m-block" onclick="saveKesproSafetyCard()">
          Simpan Kartu Darurat 💾
        </button>
      </div>
    `;
  }
  else if (toolKey === 'safety_guide') {
    badgeEl.innerText = 'HAK & PERLINDUNGAN';
    titleEl.innerText = '🛡️ Panduan Tanggap Pelecehan';
    kesproSafetyGuideActiveTab = 'steps';
    renderKesproSafetyGuideView(bodyEl);
  }
  else if (toolKey === 'safety_hotline') {
    badgeEl.innerText = 'LAYANAN RAMAH REMAJA';
    titleEl.innerText = '🏥 Kontak Darurat & PKPR';
    bodyEl.innerHTML = `
      <div class="m-card">
        <h3 style="font-family: var(--font-heading); font-size: 15px; margin-bottom: 8px;">Layanan Siaga Resmi & Privat</h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="border: var(--border-sm); border-radius: 12px; padding: 10px; background: #F0F6FF;">
            <div style="font-weight: 800; font-size: 13px;">🛡️ SAPPA KemenPPPA</div>
            <div style="font-size: 11px; color: #555;">Hotline kekerasan terhadap anak & perempuan</div>
            <div style="font-size: 13px; font-weight: 900; margin-top: 4px; color: var(--electric-blue);">Telepon: 129 • WhatsApp: 08111-129-129</div>
          </div>
          <div style="border: var(--border-sm); border-radius: 12px; padding: 10px; background: #F0FAF1;">
            <div style="font-weight: 800; font-size: 13px;">🧠 SEJIWA (Kemenkes RI)</div>
            <div style="font-size: 11px; color: #555;">Layanan dukungan psikologis dan kesehatan jiwa</div>
            <div style="font-size: 13px; font-weight: 900; margin-top: 4px; color: #198754;">Telepon: 119 Ekstensi 8</div>
          </div>
          <div style="border: var(--border-sm); border-radius: 12px; padding: 10px; background: #FFFDF0;">
            <div style="font-weight: 800; font-size: 13px;">🏥 PKPR di Puskesmas</div>
            <div style="font-size: 11px; color: #555;">Pelayanan Kesehatan Peduli Remaja bebas stigma & gratis</div>
            <div style="font-size: 12px; margin-top: 4px;">Bisa langsung datang ke Puskesmas kecamatan terdekatmu!</div>
          </div>
        </div>
      </div>
    `;
  }

  bodyEl.scrollTop = 0;
  openToolModalOverlay();
}

// --------------------------------------------------------------------------
// 1. RADAR RELASI VIEW RENDERING & CONTROLLER
// --------------------------------------------------------------------------
function renderKesproRadarView(bodyEl) {
  if (!bodyEl) bodyEl = document.getElementById('tool-modal-body');
  if (!bodyEl) return;

  const total = KESPRO_RADAR_SCENARIOS.length;

  if (kesproRadarState.viewMode === 'cheatsheet') {
    bodyEl.innerHTML = `
      <div class="radar-interactive-container">
        <!-- Switcher -->
        <div class="radar-mode-switcher">
          <button class="radar-mode-btn" onclick="switchKesproRadarMode('quiz')">🎮 Kuis Skenario</button>
          <button class="radar-mode-btn active" onclick="switchKesproRadarMode('cheatsheet')">📋 Rangkuman Ciri</button>
        </div>

        <div class="m-card">
          <h3 style="font-family: var(--font-heading); font-size: 15px; margin-bottom: 8px;">Uji Batasan Hubunganmu</h3>
          <p style="font-size: 12px; color: #444; line-height: 1.5; margin-bottom: 12px;">
            Hubungan sehat selalu dibangun di atas rasa hormat, kejujuran, dan kesetaraan.
          </p>
          <div style="background: #FFF2F2; border: var(--border-sm); border-radius: 12px; padding: 12px; margin-bottom: 10px;">
            <h4 style="color: #B21B35; font-size: 13px; font-weight: 800; margin-bottom: 6px;">🚩 Ciri-Ciri Red Flag:</h4>
            <ul style="font-size: 11.5px; padding-left: 18px; line-height: 1.6;">
              <li>Memaksa meminta password HP / akun media sosial.</li>
              <li>Melarang berteman dengan orang lain atau mengekang hobi.</li>
              <li>Memanipulasi rasa bersalah (*gaslighting*) saat kamu menolak ajakan fisik.</li>
              <li>Mengancam menyebarkan foto atau rahasia pribadi.</li>
            </ul>
          </div>
          <div style="background: #F0FAF1; border: var(--border-sm); border-radius: 12px; padding: 12px; margin-bottom: 14px;">
            <h4 style="color: #198754; font-size: 13px; font-weight: 800; margin-bottom: 6px;">🟢 Ciri-Ciri Green Flag:</h4>
            <ul style="font-size: 11.5px; padding-left: 18px; line-height: 1.6;">
              <li>Mendengarkan sudut pandangmu tanpa memotong atau merendahkan.</li>
              <li>Menghormati batasan saat kamu berkata "sedang tidak mau".</li>
              <li>Mendukung impian dan prestasimu di sekolah.</li>
              <li>Bisa diajak berdiskusi secara dewasa saat ada salah paham.</li>
            </ul>
          </div>

          <button class="btn-m btn-m-pink btn-m-block" onclick="switchKesproRadarMode('quiz')">
            Uji Kepekaanmu di Kuis Skenario Sekarang 👉
          </button>
        </div>
      </div>
    `;
    return;
  }

  // Quiz Mode
  if (kesproRadarState.completed) {
    const score = kesproRadarState.score;
    let badgeText = "RADAR SUPER PEKA 🏆";
    let badgeDesc = "Luar biasa! Kamu punya batasan diri yang sangat kokoh dan radar sinyal bahaya yang tajam. Pertahankan!";
    let badgeClass = "badge-mint";

    if (score >= 3 && score < 5) {
      badgeText = "RADAR CUKUP PEKA 🛡️";
      badgeDesc = "Bagus! Kamu sudah memahami prinsip relasi sehat, tapi tetap waspadai rayuan manipulatif halus di lingkungan sekitar ya.";
      badgeClass = "badge-yellow";
    } else if (score < 3) {
      badgeText = "PERLU PERKUAT BATASAN ⚠️";
      badgeDesc = "Zona waspada! Jangan ragu menetapkan batasan tegas. Ingat: cinta sejati tidak pernah menuntut kamu mengorbankan martabat atau rasa amanmu.";
      badgeClass = "badge-pink";
    }

    bodyEl.innerHTML = `
      <div class="radar-interactive-container">
        <div class="m-card text-center" style="text-align: center; padding: 20px 14px;">
          <div style="font-size: 40px; margin-bottom: 8px;">${score === 5 ? '🎉' : '🎯'}</div>
          <span class="badge ${badgeClass}" style="font-size: 11px; margin-bottom: 8px;">${badgeText}</span>
          <h3 style="font-family: var(--font-heading); font-size: 18px; margin-bottom: 6px;">
            Skor Radarmu: ${score} dari ${total} Skenario Tepat
          </h3>
          <p style="font-size: 12px; color: #444; line-height: 1.5; margin-bottom: 16px;">
            ${badgeDesc}
          </p>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            <button class="btn-m btn-m-yellow btn-m-block" onclick="restartKesproRadarQuiz()">
              Ulangi Kuis Skenario 🔄
            </button>
            <button class="btn-m btn-m-mint btn-m-block" onclick="saveKesproRadarResult()">
              Simpan Hasil ke Catatanku 💾
            </button>
            <button class="btn-m btn-m-white btn-m-block" onclick="closeToolModal(); openChapterOverlay('kespro', 9);">
              Baca Bab 9: Relasi Sehat 📖
            </button>
          </div>
        </div>
      </div>
    `;
    return;
  }

  const curr = kesproRadarState.currentIndex;
  const item = KESPRO_RADAR_SCENARIOS[curr];
  const progressPercent = Math.round(((curr + 1) / total) * 100);

  bodyEl.innerHTML = `
    <div class="radar-interactive-container">
      <!-- Switcher -->
      <div class="radar-mode-switcher">
        <button class="radar-mode-btn active" onclick="switchKesproRadarMode('quiz')">🎮 Kuis Skenario</button>
        <button class="radar-mode-btn" onclick="switchKesproRadarMode('cheatsheet')">📋 Rangkuman Ciri</button>
      </div>

      <!-- Header & Progress -->
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span class="badge badge-pink" style="margin: 0; font-size: 10px;">${item.category}</span>
        <span style="font-size: 11px; font-weight: 800; color: #666;">
          Skenario ${curr + 1} dari ${total}
        </span>
      </div>

      <div class="radar-progress-bar-wrap">
        <div class="radar-progress-fill" style="width: ${progressPercent}%;"></div>
      </div>

      <!-- Dilemma Card -->
      <div class="radar-scenario-card">
        <div style="font-size: 9.5px; font-weight: 900; color: #888; text-transform: uppercase; margin-bottom: 3px;">
          Dilema Situasi:
        </div>
        <div style="font-family: var(--font-heading); font-size: 13px; font-weight: 700; line-height: 1.45; color: #111;">
          "${item.scenario}"
        </div>
      </div>

      <!-- Question & Action Buttons -->
      ${!kesproRadarState.isAnswered ? `
        <div style="font-size: 11.5px; font-weight: 800; text-align: center; margin: 2px 0 0 0; color: #333;">
          Menurutmu, apa jenis situasi hubungan di atas?
        </div>
        <div class="radar-actions-grid">
          <button type="button" class="radar-btn radar-btn-red" onclick="answerKesproRadar('red')">
            <span style="font-size: 20px;">🚩</span>
            <span>RED FLAG!</span>
            <span style="font-size: 9.5px; font-weight: 600; opacity: 0.85;">Sinyal Bahaya / Toxic</span>
          </button>
          <button type="button" class="radar-btn radar-btn-green" onclick="answerKesproRadar('green')">
            <span style="font-size: 20px;">🟢</span>
            <span>GREEN FLAG!</span>
            <span style="font-size: 9.5px; font-weight: 600; opacity: 0.85;">Hubungan Sehat & Positif</span>
          </button>
        </div>
      ` : `
        <!-- Feedback Reveal Box -->
        <div class="radar-feedback-box" style="background: ${kesproRadarState.lastChoice === item.correctAnswer ? '#EBF9EE' : '#FFF0F0'};">
          <div>
            ${kesproRadarState.lastChoice === item.correctAnswer ? `
              <span class="radar-stamp radar-stamp-correct">🎯 TEPAT BANGET!</span>
              <div style="font-size: 13.5px; font-weight: 800; color: #065F46; margin-bottom: 4px;">
                Ini memang sinyal ${item.correctAnswer === 'red' ? '🚩 RED FLAG' : '🟢 GREEN FLAG'}!
              </div>
            ` : `
              <span class="radar-stamp radar-stamp-wrong">⚠️ KURANG TEPAT, WASPADA!</span>
              <div style="font-size: 13.5px; font-weight: 800; color: #991B1B; margin-bottom: 4px;">
                Situasi ini sebenarnya adalah ${item.correctAnswer === 'red' ? '🚩 RED FLAG' : '🟢 GREEN FLAG'}!
              </div>
            `}
          </div>

          <p style="font-size: 12px; line-height: 1.5; color: #222; margin: 8px 0 10px 0;">
            ${item.explanation}
          </p>

          <div style="background: #FFF; border: var(--border-sm); border-radius: 10px; padding: 10px; margin-bottom: 12px;">
            <div style="font-size: 10.5px; font-weight: 900; color: #555; text-transform: uppercase; margin-bottom: 3px;">
              🗣️ Contoh Respon Asertif:
            </div>
            <div style="font-size: 11.5px; font-style: italic; color: #111; line-height: 1.45;">
              "${item.asertifQuote}"
            </div>
          </div>

          <button class="btn-m btn-m-yellow btn-m-block" onclick="nextKesproRadarScenario()">
            ${curr + 1 === total ? 'Lihat Skor & Hasil Radarmu 🏆' : 'Lanjut ke Skenario Berikutnya 👉'}
          </button>
        </div>
      `}
    </div>
  `;
}

window.switchKesproRadarMode = function(mode) {
  kesproRadarState.viewMode = mode;
  renderKesproRadarView();
};

window.answerKesproRadar = function(choice) {
  const curr = kesproRadarState.currentIndex;
  const item = KESPRO_RADAR_SCENARIOS[curr];
  const isCorrect = choice === item.correctAnswer;

  kesproRadarState.isAnswered = true;
  kesproRadarState.lastChoice = choice;
  if (isCorrect) {
    kesproRadarState.score += 1;
  }

  renderKesproRadarView();

  if (window.gsap) {
    const box = document.querySelector('.radar-feedback-box');
    if (box) {
      gsap.fromTo(box, { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.28, ease: 'back.out(2)' });
    }
  }
};

window.nextKesproRadarScenario = function() {
  const total = KESPRO_RADAR_SCENARIOS.length;
  if (kesproRadarState.currentIndex + 1 < total) {
    kesproRadarState.currentIndex += 1;
    kesproRadarState.isAnswered = false;
    kesproRadarState.lastChoice = null;
  } else {
    kesproRadarState.completed = true;
  }
  renderKesproRadarView();
};

window.restartKesproRadarQuiz = function() {
  kesproRadarState.currentIndex = 0;
  kesproRadarState.score = 0;
  kesproRadarState.isAnswered = false;
  kesproRadarState.lastChoice = null;
  kesproRadarState.completed = false;
  kesproRadarState.viewMode = 'quiz';
  renderKesproRadarView();
};

window.saveKesproRadarResult = function() {
  const result = {
    score: kesproRadarState.score,
    total: KESPRO_RADAR_SCENARIOS.length,
    date: new Date().toLocaleDateString('id-ID')
  };
  localStorage.setItem('kespro_radar_result', JSON.stringify(result));
  showToast('💾 Skor Radar Relasi Berhasil Disimpan ke Catatanku!');
  updateKesproNotesTab();
};

// --------------------------------------------------------------------------
// 2. GGL KALKULATOR VIEW RENDERING & CONTROLLER
// --------------------------------------------------------------------------
function renderKesproGglView(bodyEl) {
  if (!bodyEl) bodyEl = document.getElementById('tool-modal-body');
  if (!bodyEl) return;

  let totalSugar = 0;
  let totalSalt = 0;
  let totalFat = 0;

  KESPRO_GGL_ITEMS.forEach(item => {
    const count = kesproGglCounts[item.id] || 0;
    totalSugar += item.sugar * count;
    totalSalt += item.salt * count;
    totalFat += item.fat * count;
  });

  const maxSugar = 50; // gram (4 sendok makan)
  const maxSalt = 5;   // gram (1 sendok teh)
  const maxFat = 67;   // gram (5 sendok makan)

  const pctSugar = Math.round((totalSugar / maxSugar) * 100);
  const pctSalt = Math.round((totalSalt / maxSalt) * 100);
  const pctFat = Math.round((totalFat / maxFat) * 100);

  const getMeterColor = (pct) => {
    if (pct <= 70) return '#10B981';
    if (pct <= 100) return '#F59E0B';
    return '#EF4444';
  };

  bodyEl.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 10px;">
      <div class="m-card">
        <h3 style="font-family: var(--font-heading); font-size: 15px; margin-bottom: 4px;">Kalkulator Asupan Harianmu</h3>
        <p style="font-size: 11.5px; color: #444; margin-bottom: 12px;">
          Batas aman Kemenkes RI/orang/hari: <b>Gula 50g</b> (4 sdm) • <b>Garam 5g</b> (1 sdt) • <b>Lemak 67g</b> (5 sdm).
        </p>

        <!-- Live Meters -->
        <div style="background: #FFFDF7; border: var(--border-sm); border-radius: 12px; padding: 12px; margin-bottom: 12px;">
          <div class="ggl-meter-container">
            <div style="display: flex; justify-content: space-between; font-size: 11.5px; font-weight: 800; margin-bottom: 3px;">
              <span>🍬 Gula: ${totalSugar.toFixed(1)}g / ${maxSugar}g</span>
              <span style="color: ${getMeterColor(pctSugar)}; font-weight: 900;">${pctSugar}%</span>
            </div>
            <div class="ggl-meter-bg">
              <div class="ggl-meter-bar" style="width: ${Math.min(100, pctSugar)}%; background: ${getMeterColor(pctSugar)};"></div>
            </div>
          </div>

          <div class="ggl-meter-container">
            <div style="display: flex; justify-content: space-between; font-size: 11.5px; font-weight: 800; margin-bottom: 3px;">
              <span>🧂 Garam: ${totalSalt.toFixed(1)}g / ${maxSalt}g</span>
              <span style="color: ${getMeterColor(pctSalt)}; font-weight: 900;">${pctSalt}%</span>
            </div>
            <div class="ggl-meter-bg">
              <div class="ggl-meter-bar" style="width: ${Math.min(100, pctSalt)}%; background: ${getMeterColor(pctSalt)};"></div>
            </div>
          </div>

          <div class="ggl-meter-container" style="margin-bottom: 0;">
            <div style="display: flex; justify-content: space-between; font-size: 11.5px; font-weight: 800; margin-bottom: 3px;">
              <span>🧈 Lemak: ${totalFat.toFixed(1)}g / ${maxFat}g</span>
              <span style="color: ${getMeterColor(pctFat)}; font-weight: 900;">${pctFat}%</span>
            </div>
            <div class="ggl-meter-bg">
              <div class="ggl-meter-bar" style="width: ${Math.min(100, pctFat)}%; background: ${getMeterColor(pctFat)};"></div>
            </div>
          </div>
        </div>

        <!-- Food Stepper List -->
        <div style="font-size: 12px; font-weight: 900; margin-bottom: 6px;">Pilih Jajanan Hari Ini:</div>
        <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px;">
          ${KESPRO_GGL_ITEMS.map(item => `
            <div class="ggl-stepper-row">
              <div style="font-size: 11.5px; font-weight: 700;">
                <div>${item.name}</div>
                <div style="font-size: 10px; color: #666;">Gula: ${item.sugar}g • Lemak: ${item.fat}g • Garam: ${item.salt}g</div>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <button type="button" class="ggl-counter-btn" onclick="modifyKesproGgl('${item.id}', -1)">-</button>
                <span style="font-size: 12.5px; font-weight: 900; min-width: 16px; text-align: center;">${kesproGglCounts[item.id] || 0}</span>
                <button type="button" class="ggl-counter-btn" onclick="modifyKesproGgl('${item.id}', 1)">+</button>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Health Alert / Advice -->
        ${pctSugar > 100 ? `
          <div class="m-callout m-callout-pink" style="margin-bottom: 10px;">
            <b>⚠️ PERINGATAN GULA MELEBIHI BATAS:</b> Asupan gulamu sudah melebihi anjuran harian! Ganti minuman berikutnya dengan air putih minimal 2 liter dan hindari camilan manis ya.
          </div>
        ` : `
          <div class="m-callout m-callout-mint" style="margin-bottom: 10px;">
            <b>💡 Tips Pintar Jajan:</b> Selalu minta level <i>less sugar</i> (25%–50%) saat memesan boba atau kopi kekinian!
          </div>
        `}

        <button class="btn-m btn-m-white btn-m-block" onclick="resetKesproGgl()">
          Reset Hitungan Jajan 🔄
        </button>
      </div>
    </div>
  `;
}

window.modifyKesproGgl = function(itemId, delta) {
  const current = kesproGglCounts[itemId] || 0;
  const nextVal = Math.max(0, current + delta);
  kesproGglCounts[itemId] = nextVal;
  renderKesproGglView();
};

window.resetKesproGgl = function() {
  kesproGglCounts = { boba: 0, kopisusu: 0, soda: 0, esteh: 0, gorengan: 0, mieinstan: 0 };
  renderKesproGglView();
  showToast('🔄 Kalkulator GGL Direset');
};

// --------------------------------------------------------------------------
// 3. GENERATOR BICARA ASERTIF VIEW RENDERING & CONTROLLER
// --------------------------------------------------------------------------
function renderKesproAsertifView(bodyEl) {
  if (!bodyEl) bodyEl = document.getElementById('tool-modal-body');
  if (!bodyEl) return;

  const currentScen = kesproAsertifState.scenario;
  const currentTone = kesproAsertifState.tone;
  const tpl = KESPRO_ASERTIF_TEMPLATES[currentScen] || KESPRO_ASERTIF_TEMPLATES.privasi;
  const generatedText = tpl[currentTone] || tpl.santai;

  bodyEl.innerHTML = `
    <div class="m-card">
      <h3 style="font-family: var(--font-heading); font-size: 15px; margin-bottom: 4px;">Rangkai Penolakan Tegas & Sopan</h3>
      <p style="font-size: 11.5px; color: #444; line-height: 1.45; margin-bottom: 12px;">
        Gunakan rumus <b>I-Statement</b>: sampaikan perasaan dan batasanmu dengan jelas tanpa menyerang pribadi orang lain.
      </p>

      <!-- Step 1: Scenario -->
      <div style="font-size: 11px; font-weight: 900; color: #555; text-transform: uppercase; margin-bottom: 4px;">
        1. Pilih Situasi yang Sedang Kamu Hadapi:
      </div>
      <div class="asertif-pill-group">
        <button type="button" class="asertif-pill ${currentScen === 'privasi' ? 'active' : ''}" onclick="setKesproAsertifScenario('privasi')">📱 Password HP/Medsos</button>
        <button type="button" class="asertif-pill ${currentScen === 'fisik' ? 'active' : ''}" onclick="setKesproAsertifScenario('fisik')">✋ Sentuhan Fisik Risih</button>
        <button type="button" class="asertif-pill ${currentScen === 'pap' ? 'active' : ''}" onclick="setKesproAsertifScenario('pap')">📸 Minta Foto PAP</button>
        <button type="button" class="asertif-pill ${currentScen === 'nongkrong' ? 'active' : ''}" onclick="setKesproAsertifScenario('nongkrong')">🚭 Rokok / Tempat Sepi</button>
        <button type="button" class="asertif-pill ${currentScen === 'bodyshaming' ? 'active' : ''}" onclick="setKesproAsertifScenario('bodyshaming')">🛡️ Olokan Fisik</button>
      </div>

      <!-- Step 2: Tone -->
      <div style="font-size: 11px; font-weight: 900; color: #555; text-transform: uppercase; margin-bottom: 4px;">
        2. Pilih Gaya Bicara:
      </div>
      <div class="asertif-pill-group">
        <button type="button" class="asertif-pill ${currentTone === 'santai' ? 'active' : ''}" onclick="setKesproAsertifTone('santai')">😊 Santai (Teman Dekat)</button>
        <button type="button" class="asertif-pill ${currentTone === 'sopan' ? 'active' : ''}" onclick="setKesproAsertifTone('sopan')">🤝 Sopan & Elegan</button>
        <button type="button" class="asertif-pill ${currentTone === 'keras' ? 'active' : ''}" onclick="setKesproAsertifTone('keras')">🛑 Tegas & Tolak Keras</button>
      </div>

      <!-- Output Generated -->
      <div class="asertif-output-box">
        <div style="font-size: 10px; font-weight: 900; color: var(--purple); text-transform: uppercase; margin-bottom: 4px;">
          💬 Kalimat Siap Pakai:
        </div>
        <div id="kespro-asertif-quote-text" style="font-family: var(--font-heading); font-size: 13.5px; font-weight: 700; line-height: 1.5; color: #18181B; margin-bottom: 10px;">
          "${generatedText}"
        </div>
        <button type="button" class="btn-m btn-m-lavender btn-m-block" onclick="copyKesproAsertifText()">
          Salin Teks ke Clipboard 📋
        </button>
      </div>

      <div class="m-callout m-callout-yellow" style="margin-top: 12px;">
        <b>💡 Jika dia tetap memaksa:</b> Ulangi kalimatmu seperti rekaman rusak (*broken record technique*) tanpa perlu berdebat panjang. Jika ada ancaman, segera tinggalkan lokasi!
      </div>
    </div>
  `;
}

window.setKesproAsertifScenario = function(scen) {
  kesproAsertifState.scenario = scen;
  renderKesproAsertifView();
};

window.setKesproAsertifTone = function(tone) {
  kesproAsertifState.tone = tone;
  renderKesproAsertifView();
};

window.copyKesproAsertifText = function() {
  const currentScen = kesproAsertifState.scenario;
  const currentTone = kesproAsertifState.tone;
  const tpl = KESPRO_ASERTIF_TEMPLATES[currentScen] || KESPRO_ASERTIF_TEMPLATES.privasi;
  const text = tpl[currentTone] || tpl.santai;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('📋 Kalimat Asertif Berhasil Disalin!');
    }).catch(() => {
      showToast('📋 Teks siap digunakan!');
    });
  } else {
    showToast('📋 Teks siap digunakan!');
  }
};

// --------------------------------------------------------------------------
// 4. ANATOMI INTERAKTIF VIEW RENDERING & CONTROLLER
// --------------------------------------------------------------------------
function renderKesproAnatomyView(bodyEl) {
  if (!bodyEl) bodyEl = document.getElementById('tool-modal-body');
  if (!bodyEl) return;

  const isGirl = kesproTrack === 'girl';
  const organList = isGirl ? KESPRO_ANATOMY_DATA.girl : KESPRO_ANATOMY_DATA.boy;
  const activeOrgan = organList.find(o => o.id === kesproAnatomyActiveOrgan) || organList[0];

  bodyEl.innerHTML = `
    <div class="m-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <h3 style="font-family: var(--font-heading); font-size: 15px;">
          ${isGirl ? 'Organ Reproduksi Cewek' : 'Organ Reproduksi Cowok'}
        </h3>
        <button class="btn-m btn-m-white" style="font-size: 10px; padding: 4px 8px;" onclick="toggleKesproTrack(); openKesproTool('anatomy');">
          Ganti ke ${isGirl ? 'Cowok 🙋‍♂️' : 'Cewek 🙋‍♀️'}
        </button>
      </div>

      <img src="${isGirl ? 'assets/anatomy-female.jpg' : 'assets/anatomy-male.jpg'}" alt="Anatomi" style="width: 100%; border: var(--border-sm); border-radius: 12px; margin-bottom: 10px;">

      <div style="font-size: 11px; font-weight: 900; color: #555; text-transform: uppercase; margin-bottom: 4px;">
        👆 Sentuh Nama Organ untuk Penjelasan Rinci:
      </div>
      <div class="anatomy-chip-group">
        ${organList.map(org => `
          <button type="button" class="anatomy-chip ${org.id === activeOrgan.id ? 'active' : ''}" onclick="selectKesproAnatomyOrgan('${org.id}')">
            <span>${org.icon}</span>
            <span>${org.name.split(' ')[0]}</span>
          </button>
        `).join('')}
      </div>

      <!-- Detail Card for Active Organ -->
      <div style="background: #FFFDF8; border: var(--border); box-shadow: var(--shadow-sm); border-radius: 12px; padding: 12px; margin-top: 6px;">
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
          <span style="font-size: 20px;">${activeOrgan.icon}</span>
          <div style="font-family: var(--font-heading); font-size: 14px; font-weight: 800;">${activeOrgan.name}</div>
        </div>
        <div style="font-size: 10.5px; font-weight: 800; color: var(--electric-blue); text-transform: uppercase; margin-bottom: 6px;">
          Fungsi: ${activeOrgan.role}
        </div>
        <p style="font-size: 11.5px; line-height: 1.5; color: #333; margin-bottom: 8px;">
          ${activeOrgan.desc}
        </p>
        <div style="background: #F0FAF1; border: 1.5px solid var(--ink); border-radius: 8px; padding: 8px; font-size: 11px; color: #166534; line-height: 1.45;">
          💡 <b>Fakta Medis Ilmiah:</b> ${activeOrgan.myth}
        </div>
      </div>
    </div>
  `;
}

window.selectKesproAnatomyOrgan = function(organId) {
  kesproAnatomyActiveOrgan = organId;
  renderKesproAnatomyView();
};

// --------------------------------------------------------------------------
// 5. TRACK PERSONA TOOL (CEWEK: SIKLUS HAID & KRAM / COWOK: MITOS PUBERTAS)
// --------------------------------------------------------------------------
function renderKesproTrackToolView(bodyEl) {
  if (!bodyEl) bodyEl = document.getElementById('tool-modal-body');
  if (!bodyEl) return;

  const isGirl = kesproTrack === 'girl';

  if (isGirl) {
    const todayStr = new Date().toISOString().split('T')[0];
    const savedPeriod = JSON.parse(localStorage.getItem('kespro_period_tracker') || 'null') || { lastDate: todayStr, cycleLen: 28 };

    bodyEl.innerHTML = `
      <div class="m-card">
        <h3 style="font-family: var(--font-heading); font-size: 15px; margin-bottom: 4px;">Kalkulator Siklus & Kram Care</h3>
        <p style="font-size: 11.5px; color: #444; line-height: 1.45; margin-bottom: 12px;">
          Ketahui perkiraan tanggal haid berikutnya dan masa subur untuk persiapan yang lebih nyaman.
        </p>

        <div style="margin-bottom: 10px;">
          <label style="font-size: 11px; font-weight: 800; display: block; margin-bottom: 4px;">📅 Hari Pertama Haid Terakhir:</label>
          <input type="date" id="kespro-pt-date" class="m-input" value="${savedPeriod.lastDate}">
        </div>

        <div style="margin-bottom: 12px;">
          <label style="font-size: 11px; font-weight: 800; display: block; margin-bottom: 4px;">
            🔄 Rata-rata Panjang Siklus: <span id="kespro-pt-len-val" style="color: var(--hot-pink);">${savedPeriod.cycleLen}</span> Hari
          </label>
          <input type="range" id="kespro-pt-len" min="21" max="35" value="${savedPeriod.cycleLen}" style="width: 100%; accent-color: var(--coral-pink);" oninput="document.getElementById('kespro-pt-len-val').innerText = this.value">
        </div>

        <button class="btn-m btn-m-pink btn-m-block" style="margin-bottom: 14px;" onclick="calculateKesproPeriodCycle()">
          Hitung Estimasi Siklusku 🔮
        </button>

        <div id="kespro-pt-result" style="display: none; background: #FFF4F7; border: var(--border); box-shadow: var(--shadow-sm); border-radius: 12px; padding: 12px; margin-bottom: 14px;">
          <div style="font-family: var(--font-heading); font-size: 13.5px; font-weight: 800; margin-bottom: 6px;">
            📊 Hasil Perkiraan Siklus:
          </div>
          <div style="font-size: 11.5px; line-height: 1.6;">
            • <b>Perkiraan Haid Berikutnya:</b> <span id="kespro-pt-next-date" style="font-weight: 900; color: #B91C1C;"></span><br>
            • <b>Jendela Masa Subur (Ovulasi):</b> <span id="kespro-pt-ovulation" style="font-weight: 900; color: #15803D;"></span>
          </div>
        </div>

        <!-- Interactive Cramp Care Chips -->
        <div style="font-size: 11.5px; font-weight: 900; margin-bottom: 6px;">Atasi Gejala Haid (Klik untuk Tips):</div>
        <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;">
          <button type="button" class="anatomy-chip" onclick="toggleKesproPeriodCrampTip('kram')">🩸 Kram Perut Bawah</button>
          <button type="button" class="anatomy-chip" onclick="toggleKesproPeriodCrampTip('mood')">⚡ Mood Swing / Sensitif</button>
          <button type="button" class="anatomy-chip" onclick="toggleKesproPeriodCrampTip('lelah')">🥱 Cepat Lelah / Lemas</button>
        </div>
        <div id="kespro-cramp-tip-box" style="display: none; background: #F0FAF1; border: var(--border-sm); border-radius: 10px; padding: 10px; font-size: 11.5px; line-height: 1.5;"></div>
      </div>
    `;
  } else {
    // Boy Track: Interactive Myths vs Facts Flip Cards
    bodyEl.innerHTML = `
      <div class="m-card">
        <h3 style="font-family: var(--font-heading); font-size: 15px; margin-bottom: 4px;">Fakta Tubuh Cowok & Mitos Pubertas</h3>
        <p style="font-size: 11.5px; color: #444; line-height: 1.45; margin-bottom: 12px;">
          Bongkar mitos tongkrongan seputar mimpi basah, ereksi, dan kedewasaan biologis cowok!
        </p>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${KESPRO_BOY_MYTHS.map((item, idx) => `
            <div style="border: var(--border-sm); border-radius: 10px; padding: 10px; background: #F4F8FF;">
              <div style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="toggleKesproBoyMyth(${idx})">
                <div style="font-size: 12px; font-weight: 800; color: var(--ink);">❓ ${item.title}</div>
                <span id="kespro-myth-icon-${idx}" style="font-size: 12px; font-weight: 900; color: var(--electric-blue);">Buka ▾</span>
              </div>
              <div id="kespro-myth-desc-${idx}" style="display: none; margin-top: 8px; font-size: 11.5px; line-height: 1.5; color: #222; border-top: 1px dashed #CCC; padding-top: 6px;">
                💡 <b>Penjelasan Medis Ilmiah:</b> ${item.fact}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

window.calculateKesproPeriodCycle = function() {
  const dateInput = document.getElementById('kespro-pt-date');
  const lenInput = document.getElementById('kespro-pt-len');
  const resultBox = document.getElementById('kespro-pt-result');
  const nextDateEl = document.getElementById('kespro-pt-next-date');
  const ovuEl = document.getElementById('kespro-pt-ovulation');

  if (!dateInput || !dateInput.value) {
    showToast('⚠️ Masukkan tanggal haid terakhirmu!');
    return;
  }

  const cycleLen = parseInt(lenInput?.value || '28');
  const startDate = new Date(dateInput.value);

  // Next Period = Start + Cycle Length
  const nextPeriod = new Date(startDate);
  nextPeriod.setDate(nextPeriod.getDate() + cycleLen);

  // Ovulation = Next Period - 14 days
  const ovulationDate = new Date(nextPeriod);
  ovulationDate.setDate(ovulationDate.getDate() - 14);

  const ovuStart = new Date(ovulationDate);
  ovuStart.setDate(ovuStart.getDate() - 3);
  const ovuEnd = new Date(ovulationDate);
  ovuEnd.setDate(ovuEnd.getDate() + 2);

  const opt = { day: 'numeric', month: 'long', year: 'numeric' };
  nextDateEl.innerText = nextPeriod.toLocaleDateString('id-ID', opt);
  ovuEl.innerText = `${ovuStart.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} – ${ovuEnd.toLocaleDateString('id-ID', opt)}`;

  resultBox.style.display = 'block';

  // Save to localStorage
  localStorage.setItem('kespro_period_tracker', JSON.stringify({
    lastDate: dateInput.value,
    cycleLen: cycleLen
  }));

  showToast('✅ Siklus Berhasil Dihitung!');
};

window.toggleKesproPeriodCrampTip = function(type) {
  const box = document.getElementById('kespro-cramp-tip-box');
  if (!box) return;

  box.style.display = 'block';
  if (type === 'kram') {
    box.innerHTML = '💧 <b>Redakan Kram Perut:</b> Kompres perut bawah dengan botol air hangat, lakukan pose peregangan yoga (*child’s pose*), dan hindari kafein berlebihan.';
  } else if (type === 'mood') {
    box.innerHTML = '🍃 <b>Atasi Mood Swing:</b> Fluktuasi hormon estrogen normal terjadi jelang haid. Tarik napas perlahan, dengarkan musik tenang, dan cukupi tidur 8 jam.';
  } else if (type === 'lelah') {
    box.innerHTML = '🍎 <b>Cegah Lemas & Anemia:</b> Konsumsi makanan kaya zat besi (bayam, telur, hati ayam) dan minum Tablet Tambah Darah (TTD) seminggu sekali sesuai anjuran Kemenkes.';
  }
};

window.toggleKesproBoyMyth = function(idx) {
  const desc = document.getElementById(`kespro-myth-desc-${idx}`);
  const icon = document.getElementById(`kespro-myth-icon-${idx}`);
  if (!desc) return;

  if (desc.style.display === 'none' || !desc.style.display) {
    desc.style.display = 'block';
    if (icon) icon.innerText = 'Tutup ▴';
  } else {
    desc.style.display = 'none';
    if (icon) icon.innerText = 'Buka ▾';
  }
};


function saveKesproSafetyCard() {
  const c1 = document.getElementById('kespro-sc-contact1')?.value || '';
  const c2 = document.getElementById('kespro-sc-contact2')?.value || '';
  const sp = document.getElementById('kespro-sc-safeplace')?.value || '';

  const data = { contact1: c1, contact2: c2, safeplace: sp };
  localStorage.setItem('kespro_safety_card', JSON.stringify(data));
  showToast('✅ Kartu Darurat Berhasil Disimpan!');
  closeToolModal();
  updateKesproSafetySummary();
}

function updateKesproSafetySummary() {
  const descEl = document.getElementById('kespro-safety-card-desc');
  if (!descEl) return;
  const savedCard = JSON.parse(localStorage.getItem('kespro_safety_card') || '{}');
  if (savedCard.contact1 || savedCard.contact2) {
    descEl.innerHTML = `✅ <b>Tersimpan:</b> Kontak siaga (${savedCard.contact1 || savedCard.contact2}) sudah tercatat di HP-mu.`;
  } else {
    descEl.innerText = 'Catat kontak orang tepercaya, tempat aman terdekat, dan sandi darurat yang tersimpan di HP-mu.';
  }
}

// --------------------------------------------------------------------------
// SAFETY GUIDE CONTROLLER & RENDERING (ANTI-HARASSMENT & PROTOCOL 1-2-3)
// --------------------------------------------------------------------------
let kesproSafetyGuideActiveTab = 'steps';

function switchKesproSafetyGuideTab(tab) {
  kesproSafetyGuideActiveTab = tab;
  const bodyEl = document.getElementById('tool-modal-body');
  if (bodyEl) renderKesproSafetyGuideView(bodyEl, tab);
}

function toggleSafetyFaq(faqId) {
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

function copySafetyText(text, label) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`📋 ${label} berhasil disalin!`);
    }).catch(() => {
      showToast(`📋 ${text}`);
    });
  } else {
    showToast(`📋 ${text}`);
  }
}

function renderKesproSafetyGuideView(bodyEl, activeTab) {
  if (!bodyEl) bodyEl = document.getElementById('tool-modal-body');
  if (!bodyEl) return;
  if (!activeTab) activeTab = kesproSafetyGuideActiveTab || 'steps';
  kesproSafetyGuideActiveTab = activeTab;

  let tabContentHtml = '';

  if (activeTab === 'steps') {
    tabContentHtml = `
      <div style="margin-bottom: 8px;">
        <div style="font-size: 13px; font-weight: 800; color: var(--ink); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
          <span>⚡</span> <span>Protokol Cepat Tanggap 1-2-3:</span>
        </div>

        <!-- Langkah 1 -->
        <div class="safety-step-card" style="background: #FFFDF0;">
          <div class="safety-step-num" style="background: var(--primary-yellow); color: var(--ink);">1</div>
          <div class="safety-step-content">
            <div class="safety-step-title">🏃‍♂️ Amankan Diri Segera (Prioritas #1)</div>
            <div class="safety-step-desc">
              Segera lari atau melangkah cepat menjauh dari pelaku ke lokasi ramai dan aman: pos satpam, ruang guru, minimarket, halte, atau kerumunan orang banyak.
            </div>
            <div class="safety-step-tip">
              <b>💡 Taktik Bersuara:</b> Jika terdesak di tempat umum, jangan ragu berteriak tegas & lantang: <i>"JANGAN SENTUH SAYA!"</i> atau minta tolong warga sekitar untuk memecah fokus pelaku!
            </div>
          </div>
        </div>

        <!-- Langkah 2 -->
        <div class="safety-step-card" style="background: #F0F7FF;">
          <div class="safety-step-num" style="background: var(--soft-blue); color: white;">2</div>
          <div class="safety-step-content">
            <div class="safety-step-title">📸 Simpan & Amankan Barang Bukti</div>
            <div class="safety-step-desc">
              Ambil tangkapan layar (<i>screenshot</i>) pesan chat, DM medsos, foto profil pelaku, voice note, atau rekaman CCTV. Jika terjadi kontak fisik, <b>jangan langsung mandi atau mencuci pakaian</b> yang dikenakan agar jejak fisik tetap utuh untuk visum medis.
            </div>
            <div class="safety-step-tip">
              <b>⚖️ Kekuatan Hukum:</b> Bukti chat digital dan pakaian saat kejadian adalah alat bukti sah yang diakui penuh oleh UU TPKS No. 12 Tahun 2022.
            </div>
          </div>
        </div>

        <!-- Langkah 3 -->
        <div class="safety-step-card" style="background: #F0FAF3;">
          <div class="safety-step-num" style="background: var(--mint-green); color: var(--ink);">3</div>
          <div class="safety-step-content">
            <div class="safety-step-title">📢 Laporkan & Cari Perlindungan</div>
            <div class="safety-step-desc">
              Jangan simpan trauma ini sendirian. Segera ceritakan kejadian pada orang dewasa yang kamu percaya (orang tua, guru BK, konselor) atau hubungi hotline siaga resmi yang melindungi kerahasiaanmu 100%.
            </div>
            <div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">
              <a href="tel:129" class="btn-m btn-m-pink" style="font-size: 11px; padding: 6px 12px; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
                📞 Telepon SAPPA 129
              </a>
              <a href="https://wa.me/628111129129?text=Halo%20SAPPA%20129,%20saya%20membutuhkan%20informasi%20dan%20bantuan%20layanan%20pengaduan" target="_blank" rel="noopener" class="btn-m btn-m-mint" style="font-size: 11px; padding: 6px 12px; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
                💬 WhatsApp SAPPA
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Expandable FAQ / Tips KBGO (Online Harassment) -->
      <div class="m-card" style="margin-top: 10px; background: #FFF9FA; border: 1.5px solid var(--ink); border-radius: 12px; padding: 10px 12px;">
        <div onclick="toggleSafetyFaq('faq-kbgo')" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
          <span style="font-family: var(--font-heading); font-size: 12.5px; font-weight: 800; color: #18181B;">
            📱 Bagaimana jika terjadi secara Online (Medsos / Chat)?
          </span>
          <span id="faq-kbgo-icon" style="font-size: 11px; font-weight: 800;">▼</span>
        </div>
        <div id="faq-kbgo" style="display: none; margin-top: 8px; font-size: 11.5px; line-height: 1.55; color: #444; border-top: 1px dashed #CCC; padding-top: 8px;">
          <ul style="padding-left: 18px; display: flex; flex-direction: column; gap: 4px;">
            <li><b>Screenshot Sebelum Blokir:</b> Amankan bukti obrolan, nama akun, dan tautan profil sebelum melakukan blokir.</li>
            <li><b>Jangan Kirim Apapun Saat Diancam:</b> Jika diancam penyebaran foto intim (<i>sextortion</i>), jangan pernah mentransfer uang atau mengirim foto baru. Pelaku tidak akan berhenti hanya karena dituruti.</li>
            <li><b>Laporkan Akun:</b> Manfaatkan fitur <i>Report/Laporkan</i> pada Instagram/TikTok/WhatsApp.</li>
            <li><b>Aduan Konten Kominfo:</b> Laporkan konten ilegal/merugikan ke portal resmi <b>aduankonten.id</b> atau hubungi hotline SAPPA 129.</li>
          </ul>
        </div>
      </div>
    `;
  } else if (activeTab === '5d') {
    tabContentHtml = `
      <div style="margin-bottom: 8px;">
        <div style="font-size: 12px; color: #555; line-height: 1.5; margin-bottom: 10px; background: #FFFDF0; border: var(--border-sm); border-radius: 10px; padding: 8px 12px;">
          👀 <b>Jangan Diam!</b> Jika melihat teman atau orang lain dilecehkan di jalan, sekolah, atau angkutan umum, gunakan <b>Metode 5D</b> yang aman & terbukti efektif:
        </div>

        <!-- 5D Item 1 -->
        <div class="safety-step-card" style="background: #FFF9E6;">
          <div class="safety-step-num" style="background: var(--memphis-yellow); color: var(--ink);">D1</div>
          <div class="safety-step-content">
            <div class="safety-step-title">🔀 Dialihkan (Distract)</div>
            <div class="safety-step-desc">
              Pecah fokus pelaku tanpa konfrontasi langsung. Pura-pura tanya jam, tanya arah jalan, atau hampiri korban seolah teman lama: <i>"Eh, kamu yang di kelas sebelah kan? Barengan ke gerbang yuk!"</i>
            </div>
          </div>
        </div>

        <!-- 5D Item 2 -->
        <div class="safety-step-card" style="background: #FFF0F3;">
          <div class="safety-step-num" style="background: var(--coral-pink); color: white;">D2</div>
          <div class="safety-step-content">
            <div class="safety-step-title">🗣️ Ditegur (Direct)</div>
            <div class="safety-step-desc">
              Jika situasimu aman dan kamu berada di tempat ramai, tegur pelaku secara langsung, tenang, dan tegas: <i>"Permisi, tindakan itu tidak sopan dan mengganggu."</i> Hindari kata-kata makian agar tidak memicu eskalasi.
            </div>
          </div>
        </div>

        <!-- 5D Item 3 -->
        <div class="safety-step-card" style="background: #F0F6FF;">
          <div class="safety-step-num" style="background: var(--soft-blue); color: white;">D3</div>
          <div class="safety-step-content">
            <div class="safety-step-title">📷 Didokumentasikan (Document)</div>
            <div class="safety-step-desc">
              Rekam video atau foto dari jarak yang aman serta catat tanggal dan lokasi. <b>Penting:</b> Serahkan rekaman HANYA kepada korban, jangan disebarluaskan ke media sosial tanpa persetujuan korban!
            </div>
          </div>
        </div>

        <!-- 5D Item 4 -->
        <div class="safety-step-card" style="background: #F0FAF1;">
          <div class="safety-step-num" style="background: var(--mint-green); color: var(--ink);">D4</div>
          <div class="safety-step-content">
            <div class="safety-step-title">🤝 Ditenangkan (Delay)</div>
            <div class="safety-step-desc">
              Setelah situasi mereda, temani korban dan tanyakan keadaannya: <i>"Kamu nggak apa-apa? Aku lihat kejadian tadi. Mau aku temani lapor satpam atau duduk istirahat dulu?"</i>
            </div>
          </div>
        </div>

        <!-- 5D Item 5 -->
        <div class="safety-step-card" style="background: #F8F0FF;">
          <div class="safety-step-num" style="background: var(--lavender); color: var(--ink);">D5</div>
          <div class="safety-step-content">
            <div class="safety-step-title">👮 Dilaporkan / Delegasi (Delegate)</div>
            <div class="safety-step-desc">
              Minta bantuan orang yang memiliki wewenang terdekat: satpam stasiun/halte, sopir angkot, kondektur bus, guru BK, atau pihak kepolisian.
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (activeTab === 'hotline') {
    tabContentHtml = `
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <!-- Hotline SAPPA 129 -->
        <div class="safety-hotline-card" style="background: #FFF4F6; border: var(--border-sm);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <div style="font-weight: 800; font-size: 13.5px; color: #18181B;">🛡️ SAPPA KemenPPPA 129</div>
            <span class="badge badge-pink" style="font-size: 10px;">BEBAS PULSA • 24 JAM</span>
          </div>
          <p style="font-size: 11.5px; color: #444; line-height: 1.5; margin-bottom: 8px;">
            Layanan Sahabat Perempuan dan Anak resmi pemerintah RI untuk pengaduan kekerasan fisik, psikis, maupun seksual. Kerahasiaan dijamin undang-undang.
          </p>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <a href="tel:129" class="btn-m btn-m-pink" style="font-size: 11px; padding: 6px 12px; text-decoration: none;">
              📞 Telepon: 129
            </a>
            <a href="https://wa.me/628111129129?text=Halo%20SAPPA%20129,%20saya%20butuh%20bantuan%20dan%20informasi%20layanan%20pengaduan" target="_blank" rel="noopener" class="btn-m btn-m-mint" style="font-size: 11px; padding: 6px 12px; text-decoration: none;">
              💬 WA: 08111-129-129
            </a>
            <button class="btn-m btn-m-white" style="font-size: 11px; padding: 6px 10px;" onclick="copySafetyText('08111129129', 'WhatsApp SAPPA 129')">
              📋 Salin WA
            </button>
          </div>
        </div>

        <!-- Hotline SEJIWA -->
        <div class="safety-hotline-card" style="background: #F0FAF1; border: var(--border-sm);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <div style="font-weight: 800; font-size: 13.5px; color: #18181B;">🧠 Hotline SEJIWA (Kemenkes RI)</div>
            <span class="badge badge-mint" style="font-size: 10px;">KONSELING GRATIS</span>
          </div>
          <p style="font-size: 11.5px; color: #444; line-height: 1.5; margin-bottom: 8px;">
            Layanan konseling psikologis dan pertolongan pertama kesehatan mental untuk meredakan trauma, stres pasca kejadian, dan rasa cemas.
          </p>
          <a href="tel:119" class="btn-m btn-m-mint" style="font-size: 11px; padding: 6px 12px; text-decoration: none; display: inline-block;">
            📞 Telepon: 119 (Ekstensi 8)
          </a>
        </div>

        <!-- Tombol Link Pintas ke Kartu Darurat & PKPR -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 4px;">
          <button class="btn-m btn-m-yellow" style="font-size: 11px; padding: 8px 6px; text-align: center;" onclick="openKesproTool('safety_card')">
            📝 Buka Kartu Darurat
          </button>
          <button class="btn-m btn-m-blue" style="font-size: 11px; padding: 8px 6px; text-align: center;" onclick="openKesproTool('safety_hotline')">
            🏥 Info PKPR Puskesmas
          </button>
        </div>
      </div>
    `;
  }

  bodyEl.innerHTML = `
    <div class="safety-guide-interactive-container">
      <!-- Hero Image Card -->
      <div class="safety-hero-wrap">
        <img src="assets/safe-space.jpg" alt="Ruang Aman & Solidaritas Remaja" class="safety-hero-img">
        <div class="safety-hero-badge">
          <span class="badge badge-yellow" style="font-size: 11px; box-shadow: var(--shadow-xs);">🛡️ RUANG AMAN & SOLIDARITAS</span>
        </div>
        <div class="safety-hero-caption">
          <span>🤝 <b>Kamu Tidak Sendiri:</b> Mari bersama lawan kekerasan & pelecehan!</span>
          <span class="badge badge-mint" style="font-size: 10px; flex-shrink: 0;">UU TPKS 12/2022</span>
        </div>
      </div>

      <!-- Affirmation Card -->
      <div class="m-card" style="background: linear-gradient(135deg, #FFF0F3 0%, #FFF8F6 100%); border: var(--border); border-radius: var(--radius-lg); padding: 12px 14px; margin-bottom: 12px; box-shadow: var(--shadow-sm);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
          <span class="badge badge-pink" style="font-weight: 800; font-size: 10.5px;">INGAT BAIK-BAIK & MUTLAK</span>
          <span style="font-size: 10.5px; font-weight: 800; color: #C92A2A;">100% SALAH PELAKU</span>
        </div>
        <h3 style="font-family: var(--font-heading); font-size: 15px; font-weight: 800; color: #18181B; margin-bottom: 4px; line-height: 1.3;">
          Kekerasan BUKAN Salah Korban!
        </h3>
        <p style="font-size: 11.5px; color: #3F3F46; line-height: 1.55; margin-bottom: 0;">
          Apa pun pakaian yang kamu kenakan, jam berapa kejadian berlangsung, atau di mana pun lokasinya—<b>pelaku kekerasan adalah pihak yang 100% bersalah</b>. Tanggung jawab hukum & moral sepenuhnya berada di pundak pelaku. Jangan biarkan siapa pun menyalahkan dirimu!
        </p>
      </div>

      <!-- Tab Switcher -->
      <div class="radar-mode-switcher" style="margin-bottom: 12px;">
        <button class="radar-mode-btn ${activeTab === 'steps' ? 'active' : ''}" onclick="switchKesproSafetyGuideTab('steps')">
          🚨 3 Langkah Darurat
        </button>
        <button class="radar-mode-btn ${activeTab === '5d' ? 'active' : ''}" onclick="switchKesproSafetyGuideTab('5d')">
          👀 Aksi Saksi (5D)
        </button>
        <button class="radar-mode-btn ${activeTab === 'hotline' ? 'active' : ''}" onclick="switchKesproSafetyGuideTab('hotline')">
          📞 Hotline & Bantuan
        </button>
      </div>

      <!-- Dynamic Tab Content -->
      <div id="safety-guide-tab-content">
        ${tabContentHtml}
      </div>
    </div>
  `;
}


function updateKesproNotesTab() {
  const readChapters = JSON.parse(localStorage.getItem('kespro_read_chapters') || '[]');
  const bookmarks = JSON.parse(localStorage.getItem('kespro_bookmarks') || '[]');
  const totalChapters = typeof EBOOK_CHAPTERS !== 'undefined' ? EBOOK_CHAPTERS.length : 30;

  const percent = Math.round((readChapters.length / totalChapters) * 100);

  const percentEl = document.getElementById('kespro-read-percent');
  const progBarEl = document.getElementById('kespro-read-prog-bar');
  const progTextEl = document.getElementById('kespro-read-prog-text');

  if (percentEl) percentEl.innerText = `${percent}%`;
  if (progBarEl) progBarEl.style.width = `${percent}%`;
  if (progTextEl) progTextEl.innerText = `${readChapters.length} dari ${totalChapters} Bab Selesai`;

  // Bookmarks List
  const bmListEl = document.getElementById('kespro-bookmark-list');
  if (bmListEl) {
    if (bookmarks.length === 0) {
      bmListEl.innerHTML = '<div style="font-size: 11.5px; color: #888; font-style: italic;">Belum ada bab yang disimpan. Klik ikon bintang ☆ di lembar baca untuk menyimpan.</div>';
    } else {
      const bookmarkedChaps = EBOOK_CHAPTERS.filter(c => bookmarks.includes(c.id));
      bmListEl.innerHTML = bookmarkedChaps.map(c => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px dashed #DDD; cursor: pointer;" onclick="openChapterOverlay('kespro', ${c.id})">
          <div style="font-size: 12px; font-weight: 700;">⭐ ${c.icon} ${c.title}</div>
          <span style="font-size: 11px; color: var(--electric-blue);">Buka →</span>
        </div>
      `).join('');
    }
  }

  // Daily Affirmation
  const affInput = document.getElementById('kespro-aff-input');
  if (affInput) {
    affInput.value = localStorage.getItem('kespro_daily_affirmation') || '';
  }

  // Radar Relasi Score Card Display
  const radarCard = document.getElementById('kespro-radar-note-card');
  const radarTitle = document.getElementById('kespro-radar-note-title');
  const radarDesc = document.getElementById('kespro-radar-note-desc');
  const savedRadar = JSON.parse(localStorage.getItem('kespro_radar_result') || 'null');
  if (radarCard && radarTitle && radarDesc) {
    if (savedRadar) {
      radarCard.style.display = 'block';
      radarTitle.innerText = `🎯 Skor Radar: ${savedRadar.score}/${savedRadar.total} Skenario Tepat`;
      radarDesc.innerText = savedRadar.score >= 4 
        ? `Luar biasa! Pada tanggal ${savedRadar.date}, kamu membuktikan kepekaan radar relasi yang sangat kuat dalam mengenali red flags dan menjaga batasan diri.`
        : `Tercatat pada tanggal ${savedRadar.date}. Terus asah radar kepekaanmu seputar batasan diri (consent) dan komunikasi asertif ya!`;
    } else {
      radarCard.style.display = 'none';
    }
  }

  renderKesproNotesHistory();

  if (typeof updateSecuritySettingsUI === 'function') {
    updateSecuritySettingsUI();
  }
}

function saveKesproAffirmation() {
  const affInput = document.getElementById('kespro-aff-input');
  if (!affInput) return;
  localStorage.setItem('kespro_daily_affirmation', affInput.value);
  showToast('💖 Catatan Afirmasi Berhasil Disimpan!');
}

function saveKesproPersonalNote() {
  const catSelect = document.getElementById('kespro-note-category');
  const textInput = document.getElementById('kespro-note-text');

  const cat = catSelect?.value || 'Catatan Bebas';
  const txt = (textInput?.value || '').trim();

  if (!txt) {
    showToast('⚠️ Silakan ketik catatan refleksimu terlebih dahulu.');
    return;
  }

  let notes = JSON.parse(localStorage.getItem('kespro_notes_history') || '[]');
  notes.unshift({
    id: Date.now(),
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    category: cat,
    text: txt
  });

  localStorage.setItem('kespro_notes_history', JSON.stringify(notes));
  if (textInput) textInput.value = '';

  renderKesproNotesHistory();
  showToast('📝 Catatan refleksi berhasil disimpan ke riwayat!');
}

function deleteKesproPersonalNote(id) {
  if (confirm('Apakah kamu yakin ingin menghapus catatan ini?')) {
    let notes = JSON.parse(localStorage.getItem('kespro_notes_history') || '[]');
    notes = notes.filter(n => n.id !== id);
    localStorage.setItem('kespro_notes_history', JSON.stringify(notes));
    renderKesproNotesHistory();
    showToast('🗑️ Catatan berhasil dihapus.');
  }
}

function renderKesproNotesHistory() {
  const container = document.getElementById('kespro-notes-history-list');
  if (!container) return;

  const notes = JSON.parse(localStorage.getItem('kespro_notes_history') || '[]');
  if (notes.length === 0) {
    container.innerHTML = '<div style="font-size: 11.5px; color: #888; font-style: italic;">Belum ada catatan refleksi tersimpan. Tulis catatan pertamamu di atas!</div>';
    return;
  }

  container.innerHTML = notes.map(n => `
    <div style="border: var(--border-sm); border-radius: 12px; padding: 10px 12px; background: #FFF; margin-bottom: 8px; box-shadow: var(--shadow-sm);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <span class="badge badge-lavender" style="margin: 0; font-size: 9.5px;">${n.category}</span>
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="font-size: 10.5px; color: #666; font-weight: 700;">📅 ${n.date}</span>
          <button type="button" class="btn-m btn-m-white" style="font-size: 9.5px; padding: 2px 6px; color: #DC2626;" onclick="deleteKesproPersonalNote(${n.id})" title="Hapus catatan">
            🗑️
          </button>
        </div>
      </div>
      <p style="font-size: 11.5px; color: #222; line-height: 1.45; margin: 4px 0 0; white-space: pre-wrap;">${n.text}</p>
    </div>
  `).join('');
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

// ==========================================================================
// INTERACTIVE BOOKLET ROADMAP (PETA ISI BUKLET) CONTROLS
// ==========================================================================
window.currentKesproMapPilar = 'pilar1';

window.switchKesproMapPilar = function(pilar) {
  window.currentKesproMapPilar = pilar;

  const p1Btn = document.getElementById('btn-pilar-1');
  const p2Btn = document.getElementById('btn-pilar-2');
  const allBtn = document.getElementById('btn-pilar-all');
  const s1 = document.getElementById('map-section-pilar1');
  const s2 = document.getElementById('map-section-pilar2');
  const emptyState = document.getElementById('map-search-empty');

  if (!s1 || !s2) return;
  if (emptyState) emptyState.style.display = 'none';

  // Toggle active button classes & ARIA
  if (p1Btn) {
    p1Btn.classList.toggle('active', pilar === 'pilar1');
    p1Btn.setAttribute('aria-selected', pilar === 'pilar1');
  }
  if (p2Btn) {
    p2Btn.classList.toggle('active', pilar === 'pilar2');
    p2Btn.setAttribute('aria-selected', pilar === 'pilar2');
  }
  if (allBtn) {
    allBtn.classList.toggle('active', pilar === 'all');
    allBtn.setAttribute('aria-selected', pilar === 'all');
  }

  // Show/Hide sections
  if (pilar === 'pilar1') {
    s1.style.display = 'block';
    s2.style.display = 'none';
  } else if (pilar === 'pilar2') {
    s1.style.display = 'none';
    s2.style.display = 'block';
  } else {
    s1.style.display = 'block';
    s2.style.display = 'block';
  }

  // Ensure cards in the visible section(s) are visible
  const visibleCards = document.querySelectorAll('.map-topic-card');
  visibleCards.forEach(c => {
    c.style.display = 'flex';
  });

  // GSAP Staggered Entrance Animation
  if (window.gsap) {
    const targetCards = document.querySelectorAll(
      (pilar === 'pilar1' ? '#map-section-pilar1 ' : pilar === 'pilar2' ? '#map-section-pilar2 ' : '') + '.map-topic-card'
    );
    gsap.killTweensOf(targetCards);
    gsap.fromTo(targetCards,
      { opacity: 0, y: 12, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.02, duration: 0.22, ease: 'power2.out', clearProps: 'transform,opacity' }
    );
  }
};

window.filterKesproMap = function(query) {
  const q = (query || '').trim().toLowerCase();
  const clearBtn = document.getElementById('map-search-clear');
  const s1 = document.getElementById('map-section-pilar1');
  const s2 = document.getElementById('map-section-pilar2');
  const emptyState = document.getElementById('map-search-empty');
  const cards = document.querySelectorAll('.map-topic-card');

  if (clearBtn) {
    clearBtn.style.display = q ? 'flex' : 'none';
  }

  if (!q) {
    // Reset to current active tab
    window.switchKesproMapPilar(window.currentKesproMapPilar || 'pilar1');
    return;
  }

  // When searching, show both sections
  if (s1) s1.style.display = 'block';
  if (s2) s2.style.display = 'block';

  let matchCount = 0;
  cards.forEach(card => {
    const kw = (card.getAttribute('data-keywords') || '') + ' ' + (card.textContent || '').toLowerCase();
    if (kw.includes(q)) {
      card.style.display = 'flex';
      matchCount++;
    } else {
      card.style.display = 'none';
    }
  });

  if (emptyState) {
    emptyState.style.display = matchCount === 0 ? 'block' : 'none';
  }
};

window.clearKesproMapSearch = function() {
  const searchInput = document.getElementById('map-quick-search');
  if (searchInput) searchInput.value = '';
  window.filterKesproMap('');
};

window.initKesproMapStatuses = function() {
  const readList = JSON.parse(localStorage.getItem('kespro_read_chapters') || '[]');
  const bmList = JSON.parse(localStorage.getItem('kespro_bookmarks') || '[]');

  const slots = document.querySelectorAll('.map-status-slot');
  slots.forEach(slot => {
    const cid = parseInt(slot.id.replace('map-status-', ''), 10);
    if (!cid) return;

    let html = '';
    if (readList.includes(cid)) {
      html += '<span class="map-status-pill map-status-read">✓ Dibaca</span> ';
    }
    if (bmList.includes(cid)) {
      html += '<span class="map-status-pill map-status-bm">⭐ Favorit</span>';
    }
    slot.innerHTML = html;
  });
};


