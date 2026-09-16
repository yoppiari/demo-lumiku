// ==========================================================================
// SECURITY & PIN MANAGER (ZERO-DATABASE / LOCAL-FIRST PRIVACY)
// Ruang Tumbuh Remaja - 1 Master PIN Global (Kespro + Mental Health)
// Universal SHA-256 Engine (Web Crypto + Pure JS Fallback) & 3-Tier Recovery
// ==========================================================================

const SECURITY_STORAGE_KEYS = {
  PIN_ENABLED: 'rt_sec_pin_enabled',
  PIN_HASH: 'rt_sec_pin_hash',
  SALT: 'rt_sec_salt',
  QUESTION_INDEX: 'rt_sec_q_idx',
  ANSWER_HASH: 'rt_sec_a_hash',
  RECOVERY_KEY: 'rt_sec_recovery_key',
  LAST_UNLOCKED: 'rt_sec_last_unlocked'
};

const SECURITY_QUESTIONS = [
  'Siapa nama panggilan masa kecilmu?',
  'Apa nama hewan peliharaan pertamamu?',
  'Apa makanan atau jajanan favoritmu waktu kecil?',
  'Apa nama sekolah dasar (SD) pertamamu?',
  'Siapa nama sahabat rahasiamu?'
];

let enteredPinBuffer = '';
let pinSetupStep = 1;
let tempSetupPin = '';
let tempSetupQuestionIdx = 0;
let tempSetupAnswer = '';
let tempSetupRecoveryKey = '';

// --------------------------------------------------------------------------
// PURE JAVASCRIPT SHA-256 HASH ENGINE (Works in ALL contexts: HTTP / HTTPS / Mobile)
// --------------------------------------------------------------------------
function sha256_pure_js(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  let result = '';
  const words = [];
  const asciiBitLength = ascii.length * 8;
  
  const hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];
  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  for (let i = 0; i < ascii.length; i++) {
    const code = ascii.charCodeAt(i);
    words[i >> 2] |= (code & 0xff) << ((3 - (i % 4)) * 8);
  }
  words[asciiBitLength >> 5] |= 0x80 << ((3 - ((asciiBitLength >> 3) % 4)) * 8);
  words[(((asciiBitLength + 64) >> 9) << 4) + 15] = asciiBitLength;

  for (let j = 0; j < words.length; j += 16) {
    const w = new Array(64);
    for (let i = 0; i < 16; i++) {
      w[i] = words[j + i] || 0;
    }
    for (let i = 16; i < 64; i++) {
      const w15 = w[i - 15];
      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      const w2 = w[i - 2];
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
    }

    let a = hash[0], b = hash[1], c = hash[2], d = hash[3];
    let e = hash[4], f = hash[5], g = hash[6], h = hash[7];

    for (let i = 0; i < 64; i++) {
      const s1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & f) ^ ((~e) & g);
      const temp1 = (h + s1 + ch + k[i] + w[i]) | 0;
      const s0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (s0 + maj) | 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }

    hash[0] = (hash[0] + a) | 0;
    hash[1] = (hash[1] + b) | 0;
    hash[2] = (hash[2] + c) | 0;
    hash[3] = (hash[3] + d) | 0;
    hash[4] = (hash[4] + e) | 0;
    hash[5] = (hash[5] + f) | 0;
    hash[6] = (hash[6] + g) | 0;
    hash[7] = (hash[7] + h) | 0;
  }

  for (let i = 0; i < 8; i++) {
    for (let j = 3; j >= 0; j--) {
      const byte = (hash[i] >> (j * 8)) & 255;
      result += (byte < 16 ? '0' : '') + byte.toString(16);
    }
  }
  return result;
}

// Universal SHA-256 with auto fallback
async function sha256(text, salt = '') {
  const combined = (text || '') + (salt || '');
  if (window.crypto && window.crypto.subtle && window.isSecureContext) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(combined);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      console.warn('SubtleCrypto error, falling back to pure JS:', e);
    }
  }
  return sha256_pure_js(combined);
}

// Helper: Generate random 6-character recovery key (e.g. RT-7842)
function generateRecoveryKey() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `RT-${num}`;
}

// Helper: Generate random salt
function generateSalt() {
  return Math.random().toString(36).substring(2, 12);
}

// Check if PIN lock is active
function isPinLockEnabled() {
  return localStorage.getItem(SECURITY_STORAGE_KEYS.PIN_ENABLED) === 'true' &&
         !!localStorage.getItem(SECURITY_STORAGE_KEYS.PIN_HASH);
}

// Initialize security on app load
function initSecurityManager() {
  createLockScreenDOM();
  createRecoveryModalDOM();
  createPinSetupModalDOM();

  if (isPinLockEnabled()) {
    showLockScreen();
  }

  // Auto re-lock if tab becomes hidden for more than 5 minutes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      localStorage.setItem(SECURITY_STORAGE_KEYS.LAST_UNLOCKED, Date.now().toString());
    } else {
      const lastUnlocked = parseInt(localStorage.getItem(SECURITY_STORAGE_KEYS.LAST_UNLOCKED) || '0', 10);
      if (isPinLockEnabled() && Date.now() - lastUnlocked > 5 * 60 * 1000) {
        showLockScreen();
      }
    }
  });
}

// --------------------------------------------------------------------------
// LOCK SCREEN UI & KEYPAD
// --------------------------------------------------------------------------
function createLockScreenDOM() {
  if (document.getElementById('rt-app-lock-screen')) return;

  const lockEl = document.createElement('div');
  lockEl.id = 'rt-app-lock-screen';
  lockEl.className = 'rt-lock-overlay';
  lockEl.style.display = 'none';

  lockEl.innerHTML = `
    <div class="rt-lock-box memphis-card">
      <div style="font-size: 36px; margin-bottom: 4px; animation: bounceSoft 2s infinite;">🔐</div>
      <div class="badge badge-magenta" style="margin-bottom: 6px;">1 MASTER PIN PORTAL TERPADU</div>
      <h2 style="font-family: var(--font-heading); font-size: 18px; margin: 0 0 4px; font-weight: 800;">Masukkan 4-Digit PIN</h2>
      <p style="font-size: 11.5px; color: #555; margin: 0 0 18px; line-height: 1.4;">
        Seluruh catatan reproduksi Kespro dan jurnal emosi Mental Health terlindungi di perangkat ini.
      </p>

      <!-- PIN Indicator Dots -->
      <div class="rt-pin-dots" id="rt-pin-dots-display">
        <div class="rt-pin-dot"></div>
        <div class="rt-pin-dot"></div>
        <div class="rt-pin-dot"></div>
        <div class="rt-pin-dot"></div>
      </div>

      <!-- Numeric Keypad -->
      <div class="rt-pin-keypad">
        <button type="button" class="rt-key" onclick="pressKeypad('1')">1</button>
        <button type="button" class="rt-key" onclick="pressKeypad('2')">2</button>
        <button type="button" class="rt-key" onclick="pressKeypad('3')">3</button>
        <button type="button" class="rt-key" onclick="pressKeypad('4')">4</button>
        <button type="button" class="rt-key" onclick="pressKeypad('5')">5</button>
        <button type="button" class="rt-key" onclick="pressKeypad('6')">6</button>
        <button type="button" class="rt-key" onclick="pressKeypad('7')">7</button>
        <button type="button" class="rt-key" onclick="pressKeypad('8')">8</button>
        <button type="button" class="rt-key" onclick="pressKeypad('9')">9</button>
        <button type="button" class="rt-key rt-key-func" onclick="clearKeypad()">C</button>
        <button type="button" class="rt-key" onclick="pressKeypad('0')">0</button>
        <button type="button" class="rt-key rt-key-func" onclick="backspaceKeypad()">⌫</button>
      </div>

      <div style="margin-top: 18px; display: flex; flex-direction: column; gap: 4px; align-items: center;">
        <button type="button" class="btn-text-link" onclick="openForgotPinModal()">
          ❓ Lupa PIN? Pulihkan Akun
        </button>
        <button type="button" class="btn-text-link" style="font-size: 10.5px; opacity: 0.85;" onclick="openAppGuidanceModal('recover')">
          💡 Panduan: Cara Reset &amp; Pemulihan PIN
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(lockEl);
}

function showLockScreen() {
  const lockEl = document.getElementById('rt-app-lock-screen');
  if (lockEl) {
    enteredPinBuffer = '';
    updatePinDots();
    lockEl.style.display = 'flex';
  }
}

function hideLockScreen() {
  const lockEl = document.getElementById('rt-app-lock-screen');
  if (lockEl) {
    lockEl.style.display = 'none';
    localStorage.setItem(SECURITY_STORAGE_KEYS.LAST_UNLOCKED, Date.now().toString());
  }
}

function pressKeypad(digit) {
  if (enteredPinBuffer.length < 4) {
    enteredPinBuffer += digit;
    updatePinDots();
    if (enteredPinBuffer.length === 4) {
      setTimeout(verifyEnteredPin, 60);
    }
  }
}

function clearKeypad() {
  enteredPinBuffer = '';
  updatePinDots();
}

function backspaceKeypad() {
  if (enteredPinBuffer.length > 0) {
    enteredPinBuffer = enteredPinBuffer.slice(0, -1);
    updatePinDots();
  }
}

function updatePinDots() {
  const dotsContainer = document.getElementById('rt-pin-dots-display');
  if (!dotsContainer) return;
  const dots = dotsContainer.querySelectorAll('.rt-pin-dot');
  dots.forEach((dot, idx) => {
    if (idx < enteredPinBuffer.length) {
      dot.classList.add('filled');
    } else {
      dot.classList.remove('filled');
    }
  });
}

async function verifyEnteredPin() {
  const storedHash = localStorage.getItem(SECURITY_STORAGE_KEYS.PIN_HASH);
  const salt = localStorage.getItem(SECURITY_STORAGE_KEYS.SALT) || '';
  const currentHash = await sha256(enteredPinBuffer, salt);

  if (currentHash === storedHash) {
    hideLockScreen();
    showToast('✨ Ruang Aman Terbuka! Selamat Datang.');
  } else {
    const box = document.querySelector('.rt-lock-box');
    if (box) {
      box.classList.add('shake-error');
      setTimeout(() => box.classList.remove('shake-error'), 450);
    }
    showToast('❌ PIN salah! Silakan coba lagi.');
    clearKeypad();
  }
}

// --------------------------------------------------------------------------
// 3-TIER RECOVERY MODAL
// --------------------------------------------------------------------------
function createRecoveryModalDOM() {
  if (document.getElementById('rt-recovery-modal')) return;

  const modalEl = document.createElement('div');
  modalEl.id = 'rt-recovery-modal';
  modalEl.className = 'rt-modal-overlay';
  modalEl.style.display = 'none';

  modalEl.innerHTML = `
    <div class="tool-modal-backdrop" onclick="closeRecoveryModal()"></div>
    <div class="tool-modal-dialog" style="max-width: 420px; z-index: 10;">
      <div class="tool-modal-header">
        <button class="btn-m btn-m-white" style="font-size: 11px; padding: 4px 8px;" onclick="closeRecoveryModal()">
          ← Kembali
        </button>
        <div style="flex: 1; text-align: center;">
          <div style="font-size: 9px; font-weight: 800; color: #666; text-transform: uppercase;">BANTUAN MANDIRI</div>
          <div style="font-family: var(--font-heading); font-size: 13px; font-weight: 800;">Pemulihan Master PIN</div>
        </div>
        <button class="btn-m btn-m-white" style="font-size: 11px; padding: 4px 8px;" onclick="closeRecoveryModal()">
          ✕
        </button>
      </div>

      <div class="tool-modal-body custom-scroll" style="padding: 16px;">
        
        <!-- Jalur 1: Pertanyaan Keamanan -->
        <div class="m-card" style="margin-bottom: 12px; background: #FFF9E6;">
          <div style="font-weight: 800; font-size: 12.5px; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
            <span>🗝️ Opsi 1: Pertanyaan Keamanan</span>
            <span class="badge badge-yellow" style="font-size: 8px; margin: 0;">UTAMA</span>
          </div>
          <p style="font-size: 11px; color: #555; margin-bottom: 8px;" id="rt-recovery-q-text">
            Memuat pertanyaan...
          </p>
          <input type="text" id="rt-recovery-answer-input" class="m-input" placeholder="Ketik jawaban rahasiamu..." style="margin-bottom: 8px; font-size: 12px;">
          <button class="btn-m btn-m-primary btn-m-block" style="font-size: 11.5px;" onclick="submitRecoveryAnswer()">
            Verifikasi &amp; Buka Kunci
          </button>
        </div>

        <!-- Jalur 2: Kunci Pemulihan Cadangan -->
        <div class="m-card" style="margin-bottom: 12px;">
          <div style="font-weight: 800; font-size: 12.5px; margin-bottom: 4px;">
            <span>🏷️ Opsi 2: Kunci Pemulihan (Recovery Key)</span>
          </div>
          <p style="font-size: 11px; color: #555; margin-bottom: 8px;">
            Masukkan 6-karakter kode darurat yang kamu simpan saat membuat PIN (contoh: <code>RT-8924</code>).
          </p>
          <input type="text" id="rt-recovery-key-input" class="m-input" placeholder="Contoh: RT-1234" style="text-transform: uppercase; font-weight: 800; letter-spacing: 2px; margin-bottom: 8px; font-size: 13px;">
          <button class="btn-m btn-m-mint btn-m-block" style="font-size: 11.5px;" onclick="submitRecoveryKey()">
            Pulihkan Lewat Kunci
          </button>
        </div>

        <!-- Jalur 3: Reset Total & Unggah Backup -->
        <div class="m-card" style="border-color: var(--coral-pink); background: #FFF5F5;">
          <div style="font-weight: 800; font-size: 12px; color: #B91C1C; margin-bottom: 4px;">
            🚨 Opsi 3: Reset PIN Darurat
          </div>
          <p style="font-size: 10.5px; color: #666; margin-bottom: 8px; line-height: 1.4;">
            Jika benar-benar lupa segalanya, kamu bisa menghapus PIN. Jika kamu pernah mengunduh file cadangan data (.json), kamu dapat memulihkannya kembali kapan saja.
          </p>
          <button class="btn-m btn-m-coral btn-m-block" style="font-size: 11px;" onclick="emergencyResetPin()">
            Reset PIN Aplikasi
          </button>
        </div>

      </div>
    </div>
  `;

  document.body.appendChild(modalEl);
}

function openForgotPinModal() {
  const modalEl = document.getElementById('rt-recovery-modal');
  const qIdx = parseInt(localStorage.getItem(SECURITY_STORAGE_KEYS.QUESTION_INDEX) || '0', 10);
  const qText = SECURITY_QUESTIONS[qIdx] || SECURITY_QUESTIONS[0];
  
  const qTextEl = document.getElementById('rt-recovery-q-text');
  if (qTextEl) {
    qTextEl.innerHTML = `Pertanyaan Rahasiamu:<br><b style="color: var(--ink); font-size: 12px;">"${qText}"</b>`;
  }

  if (modalEl) modalEl.style.display = 'flex';
}

function closeRecoveryModal() {
  const modalEl = document.getElementById('rt-recovery-modal');
  if (modalEl) modalEl.style.display = 'none';
}

async function submitRecoveryAnswer() {
  const answerInput = document.getElementById('rt-recovery-answer-input');
  const rawAnswer = (answerInput?.value || '').trim().toLowerCase();

  if (!rawAnswer) {
    showToast('⚠️ Silakan ketik jawaban pertanyaan keamanan.');
    return;
  }

  const salt = localStorage.getItem(SECURITY_STORAGE_KEYS.SALT) || '';
  const storedAHash = localStorage.getItem(SECURITY_STORAGE_KEYS.ANSWER_HASH);
  const inputHash = await sha256(rawAnswer, salt);

  if (inputHash === storedAHash) {
    showToast('🎉 Jawaban Benar! PIN berhasil dibuka.');
    closeRecoveryModal();
    hideLockScreen();
    promptNewPinAfterRecovery();
  } else {
    showToast('❌ Jawaban salah! Periksa ejaan jawabanmu.');
  }
}

function submitRecoveryKey() {
  const keyInput = document.getElementById('rt-recovery-key-input');
  const rawKey = (keyInput?.value || '').trim().toUpperCase();
  const storedKey = localStorage.getItem(SECURITY_STORAGE_KEYS.RECOVERY_KEY);

  if (!rawKey) {
    showToast('⚠️ Masukkan kode recovery key.');
    return;
  }

  if (storedKey && rawKey === storedKey.toUpperCase()) {
    showToast('🎉 Kunci Pemulihan Cocok! PIN berhasil dibuka.');
    closeRecoveryModal();
    hideLockScreen();
    promptNewPinAfterRecovery();
  } else {
    showToast('❌ Kode pemulihan salah!');
  }
}

function emergencyResetPin() {
  if (confirm('Apakah kamu yakin ingin mereset PIN? PIN akan dihapus sehingga kamu bisa masuk kembali.')) {
    localStorage.removeItem(SECURITY_STORAGE_KEYS.PIN_ENABLED);
    localStorage.removeItem(SECURITY_STORAGE_KEYS.PIN_HASH);
    localStorage.removeItem(SECURITY_STORAGE_KEYS.RECOVERY_KEY);
    localStorage.removeItem(SECURITY_STORAGE_KEYS.ANSWER_HASH);
    closeRecoveryModal();
    hideLockScreen();
    showToast('🔓 PIN berhasil direset. Aplikasi terbuka.');
    updateSecuritySettingsUI();
  }
}

function promptNewPinAfterRecovery() {
  setTimeout(() => {
    if (confirm('Kunci terbuka! Apakah kamu ingin mengatur 4-digit Master PIN baru sekarang?')) {
      openPinSetupModal();
    } else {
      localStorage.removeItem(SECURITY_STORAGE_KEYS.PIN_ENABLED);
      localStorage.removeItem(SECURITY_STORAGE_KEYS.PIN_HASH);
      updateSecuritySettingsUI();
    }
  }, 300);
}

// --------------------------------------------------------------------------
// PIN SETUP & MANAGEMENT MODAL
// --------------------------------------------------------------------------
function createPinSetupModalDOM() {
  if (document.getElementById('rt-pin-setup-modal')) return;

  const modalEl = document.createElement('div');
  modalEl.id = 'rt-pin-setup-modal';
  modalEl.className = 'rt-modal-overlay';
  modalEl.style.display = 'none';

  modalEl.innerHTML = `
    <div class="tool-modal-backdrop" onclick="closePinSetupModal()"></div>
    <div class="tool-modal-dialog" style="max-width: 440px; z-index: 10;">
      <div class="tool-modal-header">
        <div style="flex: 1; text-align: center;">
          <div style="font-size: 9px; font-weight: 800; color: #666; text-transform: uppercase;">1 MASTER PIN PORTAL</div>
          <div style="font-family: var(--font-heading); font-size: 13px; font-weight: 800;">Atur Kunci Seluruh Portal</div>
        </div>
        <button class="btn-m btn-m-white" style="font-size: 11px; padding: 4px 8px;" onclick="closePinSetupModal()">
          ✕
        </button>
      </div>

      <div class="tool-modal-body custom-scroll" style="padding: 16px;" id="rt-pin-setup-content">
        <!-- Rendered by renderPinSetupStep() -->
      </div>
    </div>
  `;

  document.body.appendChild(modalEl);
}

function openPinSetupModal() {
  pinSetupStep = 1;
  tempSetupPin = '';
  tempSetupQuestionIdx = 0;
  tempSetupAnswer = '';
  tempSetupRecoveryKey = generateRecoveryKey();

  const modalEl = document.getElementById('rt-pin-setup-modal');
  if (modalEl) modalEl.style.display = 'flex';
  renderPinSetupStep();
}

function closePinSetupModal() {
  const modalEl = document.getElementById('rt-pin-setup-modal');
  if (modalEl) modalEl.style.display = 'none';
  updateSecuritySettingsUI();
}

function togglePinVisibility() {
  const p1 = document.getElementById('rt-setup-pin-1');
  const p2 = document.getElementById('rt-setup-pin-2');
  if (!p1 || !p2) return;
  const isPass = p1.type === 'password';
  p1.type = isPass ? 'text' : 'password';
  p2.type = isPass ? 'text' : 'password';
  const label = document.getElementById('rt-show-pin-label');
  if (label) label.innerText = isPass ? 'Sembunyikan Angka 🙈' : 'Lihat Angka 👁️';
}

function renderPinSetupStep() {
  const contentEl = document.getElementById('rt-pin-setup-content');
  if (!contentEl) return;

  if (pinSetupStep === 1) {
    contentEl.innerHTML = `
      <!-- Banner Penjelasan Cakupan PIN -->
      <div style="background: #FFFBEA; border: var(--border-sm); border-radius: 12px; padding: 10px 12px; margin-bottom: 14px;">
        <div style="font-size: 11px; font-weight: 800; color: #854D0E; display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
          <span>🌐 1 Master PIN untuk SEMUA Modul</span>
          <span class="badge badge-yellow" style="margin: 0; font-size: 8px;">GLOBAL</span>
        </div>
        <p style="font-size: 11px; color: #555; margin: 0; line-height: 1.4;">
          PIN 4-angka ini otomatis melindungi <b>Kespro Space</b> (siklus haid, safety card) dan <b>Youth Mental Health</b> (curhat jurnal emosi) sekaligus.
        </p>
      </div>

      <div style="text-align: center; margin-bottom: 14px;">
        <span class="badge badge-yellow">LANGKAH 1 DARI 3</span>
        <h3 style="font-family: var(--font-heading); font-size: 16px; margin: 6px 0 2px; font-weight: 800;">Tentukan 4-Digit PIN</h3>
        <p style="font-size: 11px; color: #666; margin: 0;">Gunakan 4 angka yang mudah kamu ingat.</p>
      </div>

      <div style="margin-bottom: 14px; text-align: center;">
        <label style="font-size: 11px; font-weight: 700; color: #444; display: block; margin-bottom: 4px;">Ketik 4 Angka PIN:</label>
        <input 
          type="password" 
          id="rt-setup-pin-1" 
          inputmode="numeric" 
          pattern="[0-9]*" 
          maxlength="4" 
          class="m-input" 
          placeholder="••••" 
          style="width: 150px; text-align: center; font-size: 26px; letter-spacing: 10px; font-weight: 800; margin: 0 auto 8px;"
          autocomplete="off"
          autofocus
        >

        <label style="font-size: 11px; font-weight: 700; color: #444; display: block; margin-bottom: 4px;">Ketik Ulang PIN (Konfirmasi):</label>
        <input 
          type="password" 
          id="rt-setup-pin-2" 
          inputmode="numeric" 
          pattern="[0-9]*" 
          maxlength="4" 
          class="m-input" 
          placeholder="••••" 
          style="width: 150px; text-align: center; font-size: 26px; letter-spacing: 10px; font-weight: 800; margin: 0 auto 6px;"
          autocomplete="off"
        >

        <div style="margin-top: 4px;">
          <button type="button" class="btn-text-link" id="rt-show-pin-label" style="font-size: 10.5px; color: #555;" onclick="togglePinVisibility()">
            Lihat Angka 👁️
          </button>
        </div>

        <!-- Inline Error Box -->
        <div id="rt-setup-error-msg" style="color: #DC2626; font-size: 11.5px; font-weight: 700; min-height: 18px; margin-top: 4px;"></div>
      </div>

      <button type="button" class="btn-m btn-m-primary btn-m-block" style="font-size: 12.5px; padding: 10px;" onclick="validateStep1Pin()">
        Lanjut ke Pertanyaan Keamanan →
      </button>
    `;
  } else if (pinSetupStep === 2) {
    contentEl.innerHTML = `
      <div style="text-align: center; margin-bottom: 14px;">
        <span class="badge badge-mint">LANGKAH 2 DARI 3</span>
        <h3 style="font-family: var(--font-heading); font-size: 16px; margin: 6px 0 2px; font-weight: 800;">Pertanyaan Pemulihan Rahasia</h3>
        <p style="font-size: 11px; color: #666; margin: 0;">Digunakan jika suatu saat kamu lupa 4 angka PIN.</p>
      </div>

      <div style="margin-bottom: 12px;">
        <label style="font-size: 11.5px; font-weight: 800; display: block; margin-bottom: 4px;">Pilih Pertanyaan:</label>
        <select id="rt-setup-q-select" class="m-input" style="font-size: 12px;">
          ${SECURITY_QUESTIONS.map((q, idx) => `<option value="${idx}">${q}</option>`).join('')}
        </select>
      </div>

      <div style="margin-bottom: 14px;">
        <label style="font-size: 11.5px; font-weight: 800; display: block; margin-bottom: 4px;">Jawaban Rahasiamu:</label>
        <input type="text" id="rt-setup-a-input" class="m-input" placeholder="Ketik jawabanmu..." style="font-size: 12.5px;" autocomplete="off">
        <span style="font-size: 10.5px; color: #888; font-style: italic;">*Tidak sensitif huruf besar/kecil.</span>
        <div id="rt-setup-error-msg" style="color: #DC2626; font-size: 11.5px; font-weight: 700; min-height: 18px; margin-top: 4px;"></div>
      </div>

      <div style="display: flex; gap: 8px;">
        <button type="button" class="btn-m btn-m-white" style="flex: 1;" onclick="pinSetupStep=1; renderPinSetupStep();">← Kembali</button>
        <button type="button" class="btn-m btn-m-primary" style="flex: 2;" onclick="validateStep2Question()">Lanjut ke Kunci Darurat →</button>
      </div>
    `;
  } else if (pinSetupStep === 3) {
    const waText = encodeURIComponent(`Kunci Pemulihan Master PIN Ruang Tumbuh saya adalah: ${tempSetupRecoveryKey}. Simpan catatan ini jika sewaktu-waktu lupa PIN.`);
    const waUrl = `https://wa.me/?text=${waText}`;

    contentEl.innerHTML = `
      <div style="text-align: center; margin-bottom: 12px;">
        <span class="badge badge-magenta">LANGKAH 3 DARI 3</span>
        <h3 style="font-family: var(--font-heading); font-size: 16px; margin: 6px 0 2px; font-weight: 800;">Simpan Kunci Cadangan</h3>
        <p style="font-size: 11px; color: #666; margin: 0;">Ini adalah kode darurat unikmu jika lupa PIN & pertanyaan:</p>
      </div>

      <div style="background: #FFE600; border: var(--border); border-radius: 14px; padding: 14px; text-align: center; margin-bottom: 12px; box-shadow: var(--shadow-sm);">
        <div style="font-size: 9.5px; font-weight: 800; color: #333; text-transform: uppercase;">KUNCI PEMULIHAN PRIBADI</div>
        <div style="font-family: var(--font-heading); font-size: 26px; font-weight: 900; letter-spacing: 4px; margin: 4px 0;">
          ${tempSetupRecoveryKey}
        </div>
        <div style="display: flex; gap: 6px; justify-content: center; margin-top: 6px;">
          <button type="button" class="btn-m btn-m-white" style="font-size: 11px; padding: 4px 10px;" onclick="navigator.clipboard.writeText('${tempSetupRecoveryKey}'); showToast('📋 Kode disalin ke clipboard!');">
            📋 Salin Kode
          </button>
          <a href="${waUrl}" target="_blank" class="btn-m btn-m-mint" style="font-size: 11px; padding: 4px 10px; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
            💬 Simpan ke WA
          </a>
        </div>
      </div>

      <p style="font-size: 11px; color: #666; line-height: 1.4; margin-bottom: 14px;">
        💡 <b>Tips:</b> Screenshot layar ini atau kirimkan ke chat WhatsApp pribadimu agar tidak hilang.
      </p>

      <button type="button" class="btn-m btn-m-primary btn-m-block" style="font-size: 13px; padding: 10px;" onclick="finalizePinSetup()">
        🔒 Aktifkan Kunci Master PIN Sekarang
      </button>
    `;
  }
}

function validateStep1Pin() {
  const p1 = (document.getElementById('rt-setup-pin-1')?.value || '').trim();
  const p2 = (document.getElementById('rt-setup-pin-2')?.value || '').trim();
  const errEl = document.getElementById('rt-setup-error-msg');

  if (p1.length !== 4 || !/^\d{4}$/.test(p1)) {
    const msg = '⚠️ PIN harus terdiri dari 4 digit angka (0-9).';
    if (errEl) errEl.innerText = msg;
    showToast(msg);
    return;
  }
  if (p1 !== p2) {
    const msg = '❌ PIN dan konfirmasi PIN tidak cocok!';
    if (errEl) errEl.innerText = msg;
    showToast(msg);
    return;
  }

  if (errEl) errEl.innerText = '';
  tempSetupPin = p1;
  pinSetupStep = 2;
  renderPinSetupStep();
}

function validateStep2Question() {
  const qSelect = document.getElementById('rt-setup-q-select');
  const aInput = document.getElementById('rt-setup-a-input');
  const errEl = document.getElementById('rt-setup-error-msg');

  const qIdx = parseInt(qSelect?.value || '0', 10);
  const ans = (aInput?.value || '').trim();

  if (!ans || ans.length < 2) {
    const msg = '⚠️ Silakan ketik jawaban pertanyaan rahasiamu.';
    if (errEl) errEl.innerText = msg;
    showToast(msg);
    return;
  }

  if (errEl) errEl.innerText = '';
  tempSetupQuestionIdx = qIdx;
  tempSetupAnswer = ans.toLowerCase();
  pinSetupStep = 3;
  renderPinSetupStep();
}

async function finalizePinSetup() {
  try {
    const salt = generateSalt();
    const pinHash = await sha256(tempSetupPin, salt);
    const aHash = await sha256(tempSetupAnswer, salt);

    localStorage.setItem(SECURITY_STORAGE_KEYS.PIN_ENABLED, 'true');
    localStorage.setItem(SECURITY_STORAGE_KEYS.SALT, salt);
    localStorage.setItem(SECURITY_STORAGE_KEYS.PIN_HASH, pinHash);
    localStorage.setItem(SECURITY_STORAGE_KEYS.QUESTION_INDEX, tempSetupQuestionIdx.toString());
    localStorage.setItem(SECURITY_STORAGE_KEYS.ANSWER_HASH, aHash);
    localStorage.setItem(SECURITY_STORAGE_KEYS.RECOVERY_KEY, tempSetupRecoveryKey);
    localStorage.setItem(SECURITY_STORAGE_KEYS.LAST_UNLOCKED, Date.now().toString());

    closePinSetupModal();
    showToast('🔐 Master PIN Berhasil Diaktifkan! Seluruh Portal Terlindungi.');
    updateSecuritySettingsUI();
  } catch (err) {
    console.error('Finalize PIN error:', err);
    alert('Terjadi kendala saat menyimpan PIN: ' + err.message);
  }
}

function disablePinLock() {
  if (confirm('Apakah kamu ingin menonaktifkan Master PIN? Kunci perlindungan untuk Kespro dan Mental Health akan dilepas.')) {
    localStorage.removeItem(SECURITY_STORAGE_KEYS.PIN_ENABLED);
    localStorage.removeItem(SECURITY_STORAGE_KEYS.PIN_HASH);
    localStorage.removeItem(SECURITY_STORAGE_KEYS.RECOVERY_KEY);
    localStorage.removeItem(SECURITY_STORAGE_KEYS.ANSWER_HASH);
    showToast('🔓 Master PIN dinonaktifkan.');
    updateSecuritySettingsUI();
  }
}

// Update UI badges/buttons in settings
function updateSecuritySettingsUI() {
  const isEnabled = isPinLockEnabled();
  const containers = document.querySelectorAll('.rt-security-status-widget');
  containers.forEach(c => {
    c.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
        <div style="flex: 1;">
          <div style="font-size: 12.5px; font-weight: 800; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
            <span>${isEnabled ? '🔒 Master PIN Aktif' : '🔓 Master PIN Belum Aktif'}</span>
            <span class="badge ${isEnabled ? 'badge-mint' : 'badge-yellow'}" style="margin:0; font-size: 8px;">
              ${isEnabled ? 'KESPRO + MENTAL HUB TERKUNCI' : 'BELUM TERLINDUNGI'}
            </span>
          </div>
          <div style="font-size: 11px; color: #555; margin-top: 3px; line-height: 1.4;">
            ${isEnabled 
              ? '<b>1 Master PIN Global aktif:</b> Melindungi catatan siklus haid Kespro dan jurnal emosi Mental Health sekaligus.' 
              : '<b>1 PIN untuk Semua Modul:</b> Pasang 4-digit sandi untuk mengamankan seluruh portal (Kespro Space &amp; Mental Health Hub) dari intipan orang lain.'}
          </div>
        </div>
        <div style="flex-shrink: 0; margin-top: 2px;">
          ${isEnabled 
            ? `<button type="button" class="btn-m btn-m-white" style="font-size: 10.5px; padding: 5px 10px;" onclick="disablePinLock()">Nonaktifkan</button>`
            : `<button type="button" class="btn-m btn-m-primary" style="font-size: 10.5px; padding: 6px 12px; font-weight: 800;" onclick="openPinSetupModal()">+ Pasang PIN</button>`
          }
        </div>
      </div>
    `;
  });
}

// Attach to window
window.initSecurityManager = initSecurityManager;
window.pressKeypad = pressKeypad;
window.clearKeypad = clearKeypad;
window.backspaceKeypad = backspaceKeypad;
window.openForgotPinModal = openForgotPinModal;
window.closeRecoveryModal = closeRecoveryModal;
window.submitRecoveryAnswer = submitRecoveryAnswer;
window.submitRecoveryKey = submitRecoveryKey;
window.emergencyResetPin = emergencyResetPin;
window.openPinSetupModal = openPinSetupModal;
window.closePinSetupModal = closePinSetupModal;
window.validateStep1Pin = validateStep1Pin;
window.validateStep2Question = validateStep2Question;
window.finalizePinSetup = finalizePinSetup;
window.disablePinLock = disablePinLock;
window.updateSecuritySettingsUI = updateSecuritySettingsUI;
window.showLockScreen = showLockScreen;
window.togglePinVisibility = togglePinVisibility;
