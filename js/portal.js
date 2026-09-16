// ==========================================================================
// PORTAL ROUTER & SHARED OVERLAY ENGINE
// Ruang Tumbuh Remaja - Unified Neo-Memphis Educational Platform
// Fluid, Weightless & Spatial Motion Orchestration (GSAP 3)
// ==========================================================================

let currentActiveView = 'portal'; // 'portal', 'kespro', 'selfhelp'
let currentReaderBook = null;     // 'kespro' or 'selfhelp'
let currentReaderChapId = 1;
let currentFontSizeIndex = 1;     // 0: sm, 1: md, 2: lg
const FONT_SIZE_CLASSES = ['reader-font-sm', 'reader-font-md', 'reader-font-lg'];

document.addEventListener('DOMContentLoaded', () => {
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }
  if (typeof initSecurityManager === 'function') {
    initSecurityManager();
  }
  handleHashRoute();
  window.addEventListener('hashchange', handleHashRoute);
  if (typeof updateSecuritySettingsUI === 'function') {
    updateSecuritySettingsUI();
  }
});

function handleHashRoute() {
  const hash = window.location.hash.toLowerCase();

  if (hash.startsWith('#kespro')) {
    navigateTo('kespro', false);
    if (hash.includes('/tab-interactive')) {
      switchKesproTab('tab-kespro-interactive', document.querySelectorAll('#view-kespro .nav-item')[1]);
    } else if (hash.includes('/tab-safety')) {
      switchKesproTab('tab-kespro-safety', document.querySelectorAll('#view-kespro .nav-item')[2]);
    } else if (hash.includes('/tab-notes')) {
      switchKesproTab('tab-kespro-notes', document.querySelectorAll('#view-kespro .nav-item')[3]);
    } else if (hash.includes('/chapter/')) {
      const id = parseInt(hash.split('/chapter/')[1], 10);
      if (id) openChapterOverlay('kespro', id);
    }
  } else if (hash.startsWith('#selfhelp')) {
    navigateTo('selfhelp', false);
    if (hash.includes('/tab-jurnal')) {
      switchSelfHelpTab('tab-selfhelp-jurnal', document.querySelectorAll('#view-selfhelp .nav-item')[1]);
    } else if (hash.includes('/tab-toolkit')) {
      switchSelfHelpTab('tab-selfhelp-toolkit', document.querySelectorAll('#view-selfhelp .nav-item')[2]);
    } else if (hash.includes('/tab-notes')) {
      switchSelfHelpTab('tab-selfhelp-notes', document.querySelectorAll('#view-selfhelp .nav-item')[3]);
    } else if (hash.includes('/chapter/')) {
      const id = parseInt(hash.split('/chapter/')[1], 10);
      if (id) openChapterOverlay('selfhelp', id);
    }
  } else {
    navigateTo('portal', false);
  }
}

function navigateTo(viewName, updateHash = true) {
  currentActiveView = viewName;

  // Hide all views
  document.querySelectorAll('.app-screen-view').forEach(v => {
    v.style.display = 'none';
  });

  // Close any open overlays
  closeReaderOverlay(true);
  closeToolModal(true);

  let targetEl = null;

  if (viewName === 'portal') {
    targetEl = document.getElementById('view-portal');
    if (targetEl) targetEl.style.display = 'flex';
    if (updateHash) window.location.hash = '#portal';
    if (typeof updateSecuritySettingsUI === 'function') updateSecuritySettingsUI();
  } 
  else if (viewName === 'kespro') {
    targetEl = document.getElementById('view-kespro');
    if (targetEl) targetEl.style.display = 'flex';
    if (updateHash) window.location.hash = '#kespro';
    initKesproApp();
    if (typeof updateSecuritySettingsUI === 'function') updateSecuritySettingsUI();
  } 
  else if (viewName === 'selfhelp') {
    targetEl = document.getElementById('view-selfhelp');
    if (targetEl) targetEl.style.display = 'flex';
    if (updateHash) window.location.hash = '#selfhelp';
    initSelfHelpApp();
    if (typeof updateSecuritySettingsUI === 'function') updateSecuritySettingsUI();
  }

  // Scroll container to top
  const container = document.querySelector('.phone-container');
  if (container) container.scrollTop = 0;

  // GSAP View Transition Animation
  if (window.gsap && targetEl) {
    gsap.killTweensOf(targetEl);
    gsap.fromTo(targetEl,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out', clearProps: 'transform,opacity' }
    );
    animateCardsEntrance(targetEl);
  }
}

// Staggered card entrance helper
function animateCardsEntrance(container) {
  if (!window.gsap || !container) return;
  requestAnimationFrame(() => {
    const cards = container.querySelectorAll('.portal-choice-card, .chapter-card, .tool-hub-card, .m-card');
    if (cards && cards.length > 0) {
      const subset = Array.from(cards).slice(0, 10);
      gsap.killTweensOf(subset);
      gsap.fromTo(subset,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.28, stagger: 0.045, ease: 'power2.out', clearProps: 'transform,opacity' }
      );
    }
  });
}

// --------------------------------------------------------------------------
// SHARED IN-APP CHAPTER READER OVERLAY
// --------------------------------------------------------------------------
function openChapterOverlay(book, chapterId) {
  currentReaderBook = book;
  currentReaderChapId = chapterId;

  const overlay = document.getElementById('reader-overlay');
  const catEl = document.getElementById('reader-category');
  const titleEl = document.getElementById('reader-title');
  const bodyEl = document.getElementById('reader-content');
  const bmBtn = document.getElementById('reader-bm-btn');
  const markReadBtn = document.getElementById('reader-mark-read-btn');
  const progBar = document.getElementById('reader-prog-bar');

  if (!overlay || !bodyEl) return;

  const chapters = book === 'kespro' ? EBOOK_CHAPTERS : SELFHELP_CHAPTERS;
  const chapter = chapters.find(c => c.id === chapterId);
  if (!chapter) return;

  // Populate reader header & body
  catEl.innerText = `${book === 'kespro' ? '🌸 KESPRO' : '🧠 SELF HELP'} • ${chapter.category}`;
  titleEl.innerText = `${chapter.icon || ''} ${chapter.title}`;
  bodyEl.innerHTML = chapter.html;
  bodyEl.scrollTop = 0;
  if (progBar) progBar.style.width = '0%';

  // Auto-init interactive roadmap if opening chapter 2
  if (book === 'kespro' && chapterId === 2) {
    setTimeout(() => {
      if (window.initKesproMapStatuses) window.initKesproMapStatuses();
      if (window.switchKesproMapPilar) window.switchKesproMapPilar(window.currentKesproMapPilar || 'pilar1');
    }, 20);
  }

  // Update Font Size
  bodyEl.className = `reader-body custom-scroll ${FONT_SIZE_CLASSES[currentFontSizeIndex]}`;

  // Update Bookmark button
  const storageKey = book === 'kespro' ? 'kespro_bookmarks' : 'selfhelp_bookmarks';
  const bookmarks = JSON.parse(localStorage.getItem(storageKey) || '[]');
  const isBookmarked = bookmarks.includes(chapterId);
  bmBtn.innerText = isBookmarked ? '⭐' : '☆';
  bmBtn.style.color = isBookmarked ? '#FFBE0B' : 'inherit';

  // Update Mark Read button with responsive text spans
  const readKey = book === 'kespro' ? 'kespro_read_chapters' : 'selfhelp_read_chapters';
  const readList = JSON.parse(localStorage.getItem(readKey) || '[]');
  const isRead = readList.includes(chapterId);
  markReadBtn.innerHTML = isRead 
    ? '<span class="btn-text-full">✔️ Tandai Selesai</span><span class="btn-text-short">✔️ Selesai</span>'
    : '<span class="btn-text-full">Tandai Selesai</span><span class="btn-text-short">Selesai</span>';
  markReadBtn.style.background = isRead ? '#E8F9ED' : '#FFF';

  // Update Prev / Next Buttons
  const prevBtn = document.getElementById('reader-prev-btn');
  const nextBtn = document.getElementById('reader-next-btn');

  const currentIndex = chapters.findIndex(c => c.id === chapterId);
  if (prevBtn) {
    prevBtn.disabled = currentIndex <= 0;
    prevBtn.style.opacity = currentIndex <= 0 ? '0.4' : '1';
  }
  if (nextBtn) {
    nextBtn.disabled = currentIndex >= chapters.length - 1;
    nextBtn.style.opacity = currentIndex >= chapters.length - 1 ? '0.4' : '1';
  }

  overlay.style.display = 'flex';

  // GSAP Entrance Timeline for Reader Overlay
  if (window.gsap) {
    gsap.killTweensOf(overlay);
    gsap.fromTo(overlay,
      { opacity: 0 },
      { opacity: 1, duration: 0.24, ease: 'power2.out' }
    );
    const header = overlay.querySelector('.reader-header');
    const body = overlay.querySelector('.reader-body');
    const footer = overlay.querySelector('.reader-footer');
    if (header) gsap.fromTo(header, { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.22, ease: 'power2.out', clearProps: 'transform,opacity' });
    if (body) gsap.fromTo(body, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.28, ease: 'power2.out', delay: 0.04, clearProps: 'transform,opacity' });
    if (footer) gsap.fromTo(footer, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.22, ease: 'power2.out', delay: 0.06, clearProps: 'transform,opacity' });
  }
}

function closeReaderOverlay(immediate = false) {
  const overlay = document.getElementById('reader-overlay');
  if (!overlay || overlay.style.display === 'none') return;

  const doClose = () => {
    overlay.style.display = 'none';
    overlay.style.opacity = '1';
    // Refresh lists & progress
    if (currentReaderBook === 'kespro') {
      renderKesproChapterList();
      updateKesproNotesTab();
    } else if (currentReaderBook === 'selfhelp') {
      renderSelfHelpChapterList();
      updateSelfHelpNotesTab();
    }
  };

  if (!immediate && window.gsap) {
    gsap.killTweensOf(overlay);
    gsap.to(overlay, {
      opacity: 0,
      y: 10,
      duration: 0.18,
      ease: 'power2.in',
      onComplete: () => {
        gsap.set(overlay, { y: 0 });
        doClose();
      }
    });
  } else {
    doClose();
  }
}

function navigateReaderChapter(delta) {
  const chapters = currentReaderBook === 'kespro' ? EBOOK_CHAPTERS : SELFHELP_CHAPTERS;
  const currentIndex = chapters.findIndex(c => c.id === currentReaderChapId);
  const nextIndex = currentIndex + delta;

  if (nextIndex >= 0 && nextIndex < chapters.length) {
    openChapterOverlay(currentReaderBook, chapters[nextIndex].id);
  }
}

function toggleReaderFontSize() {
  currentFontSizeIndex = (currentFontSizeIndex + 1) % FONT_SIZE_CLASSES.length;
  const bodyEl = document.getElementById('reader-content');
  if (bodyEl) {
    bodyEl.className = `reader-body custom-scroll ${FONT_SIZE_CLASSES[currentFontSizeIndex]}`;
  }
  const sizeNames = ['Kecil', 'Sedang', 'Besar'];
  showToast(`Ukuran teks: ${sizeNames[currentFontSizeIndex]}`);
}

function toggleReaderBookmark() {
  if (!currentReaderBook) return;
  const storageKey = currentReaderBook === 'kespro' ? 'kespro_bookmarks' : 'selfhelp_bookmarks';
  let bookmarks = JSON.parse(localStorage.getItem(storageKey) || '[]');

  const bmBtn = document.getElementById('reader-bm-btn');
  if (bookmarks.includes(currentReaderChapId)) {
    bookmarks = bookmarks.filter(id => id !== currentReaderChapId);
    if (bmBtn) {
      bmBtn.innerText = '☆';
      bmBtn.style.color = 'inherit';
    }
    showToast('Bab dihapus dari favorit');
  } else {
    bookmarks.push(currentReaderChapId);
    if (bmBtn) {
      bmBtn.innerText = '⭐';
      bmBtn.style.color = '#FFBE0B';
    }
    showToast('⭐ Bab disimpan ke favorit!');
  }
  localStorage.setItem(storageKey, JSON.stringify(bookmarks));
}

function toggleReaderMarkRead() {
  if (!currentReaderBook) return;
  const readKey = currentReaderBook === 'kespro' ? 'kespro_read_chapters' : 'selfhelp_read_chapters';
  let readList = JSON.parse(localStorage.getItem(readKey) || '[]');

  const markBtn = document.getElementById('reader-mark-read-btn');
  if (readList.includes(currentReaderChapId)) {
    readList = readList.filter(id => id !== currentReaderChapId);
    if (markBtn) {
      markBtn.innerHTML = '<span class="btn-text-full">Tandai Selesai</span><span class="btn-text-short">Selesai</span>';
      markBtn.style.background = '#FFF';
    }
    showToast('Tanda selesai dibatalkan');
  } else {
    readList.push(currentReaderChapId);
    if (markBtn) {
      markBtn.innerHTML = '<span class="btn-text-full">✔️ Tandai Selesai</span><span class="btn-text-short">✔️ Selesai</span>';
      markBtn.style.background = '#E8F9ED';
    }
    showToast('✔️ Selamat! Bab ditandai selesai.');
  }
  localStorage.setItem(readKey, JSON.stringify(readList));
}

function updateReaderReadingProgress() {
  const bodyEl = document.getElementById('reader-content');
  const progBar = document.getElementById('reader-prog-bar');
  if (!bodyEl || !progBar) return;

  const maxScroll = bodyEl.scrollHeight - bodyEl.clientHeight;
  if (maxScroll > 0) {
    const percent = Math.min(100, Math.round((bodyEl.scrollTop / maxScroll) * 100));
    progBar.style.width = `${percent}%`;
  }
}

// --------------------------------------------------------------------------
// SHARED TOOL MODAL OVERLAY (SPATIAL GLASSMORPHISM & SPRING MOTIONS)
// --------------------------------------------------------------------------
function openToolModalOverlay() {
  const overlay = document.getElementById('tool-modal-overlay');
  if (!overlay) return;

  overlay.style.display = 'flex';
  const bodyEl = document.getElementById('tool-modal-body');
  if (bodyEl) bodyEl.scrollTop = 0;

  if (window.gsap) {
    const dialog = overlay.querySelector('.tool-modal-dialog') || overlay;
    gsap.killTweensOf([overlay, dialog]);
    gsap.fromTo(overlay,
      { opacity: 0 },
      { opacity: 1, duration: 0.22, ease: 'power1.out' }
    );
    gsap.fromTo(dialog,
      { y: 32, scale: 0.96, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: 0.32, ease: 'back.out(1.2)', clearProps: 'transform,opacity' }
    );
  }
}

function closeToolModal(immediate = false) {
  const overlay = document.getElementById('tool-modal-overlay');
  if (!overlay || overlay.style.display === 'none') return;

  const doClose = () => {
    overlay.style.display = 'none';
    overlay.style.opacity = '1';
    const dialog = overlay.querySelector('.tool-modal-dialog');
    if (dialog) {
      dialog.style.opacity = '1';
      dialog.style.transform = 'none';
    }
    if (currentActiveView === 'kespro') {
      updateKesproSafetySummary();
    } else if (currentActiveView === 'selfhelp') {
      updateSelfHelpNotesTab();
    }
  };

  if (!immediate && window.gsap) {
    const dialog = overlay.querySelector('.tool-modal-dialog') || overlay;
    gsap.killTweensOf([overlay, dialog]);
    gsap.to(dialog, { y: 20, scale: 0.96, opacity: 0, duration: 0.16, ease: 'power2.in' });
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: doClose
    });
  } else {
    doClose();
  }
}

function toggleContainerExpand() {
  const container = document.querySelector('.phone-container');
  const btnText = document.getElementById('desktop-toggle-text');
  if (!container) return;

  container.classList.toggle('phone-sim');
  const isSim = container.classList.contains('phone-sim');

  if (btnText) {
    btnText.innerText = isSim ? '💻 Tampilan Luas' : '📱 Mode Ponsel';
  }
  showToast(isSim ? '📱 Beralih ke Simulasi Layar HP' : '💻 Beralih ke Tampilan Luas Responsif');
}

// --------------------------------------------------------------------------
// TOAST NOTIFICATIONS (SPRING BOUNCE)
// --------------------------------------------------------------------------
let toastTimeout = null;
function showToast(message) {
  let toast = document.getElementById('app-toast');
  if (!toast) return;

  toast.innerText = message;
  toast.classList.add('show');

  if (window.gsap) {
    gsap.killTweensOf(toast);
    gsap.fromTo(toast,
      { opacity: 0, y: 24, scale: 0.86 },
      { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: 'back.out(1.8)' }
    );
  }

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    if (window.gsap) {
      gsap.to(toast, {
        opacity: 0,
        y: 12,
        scale: 0.9,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          toast.classList.remove('show');
        }
      });
    } else {
      toast.classList.remove('show');
    }
  }, 2400);
}
