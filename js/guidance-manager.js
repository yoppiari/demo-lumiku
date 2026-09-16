// ==========================================================================
// GUIDANCE & PRIVACY GUARANTEE MANAGER
// Ruang Tumbuh Remaja - Menu Edukasi Cara Pakai, PIN & Zero-Database
// ==========================================================================

function openAppGuidanceModal(initialTab = 'privasi') {
  const overlay = document.getElementById('tool-modal-overlay');
  const badgeEl = document.getElementById('tool-modal-badge');
  const titleEl = document.getElementById('tool-modal-title');
  const bodyEl = document.getElementById('tool-modal-body');

  if (!overlay || !bodyEl) return;

  if (badgeEl) badgeEl.innerText = 'PANDUAN & JAMINAN PRIVASI';
  if (titleEl) titleEl.innerText = '💡 Cara Pakai & Keamanan Data';

  bodyEl.innerHTML = `
    <div style="padding: 4px 0 16px;">
      
      <!-- Top Banner Promise -->
      <div class="m-card m-card-mint" style="margin-bottom: 14px; text-align: center; padding: 14px;">
        <div style="font-size: 26px; margin-bottom: 4px;">🛡️</div>
        <div style="font-family: var(--font-heading); font-size: 14px; font-weight: 800; color: #166534; margin-bottom: 4px;">
          100% Zero-Database & Bebas Bocor
        </div>
        <p style="font-size: 11.5px; color: #333; line-height: 1.45; margin: 0;">
          Ruang Tumbuh Remaja tidak memiliki server database di internet. Seluruh catatan, siklus tubuh, dan jurnal emosimu tersimpan <b>eksklusif di HP-mu sendiri</b>.
        </p>
      </div>

      <!-- Navigation Pills for Guide Topics -->
      <div style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 14px; scrollbar-width: none;" id="guide-nav-pills">
        <button type="button" class="btn-m ${initialTab === 'privasi' ? 'btn-m-primary' : 'btn-m-white'}" style="font-size: 10.5px; padding: 4px 10px; white-space: nowrap;" onclick="switchGuideTab('privasi')">
          🛡️ Privasi & Keamanan
        </button>
        <button type="button" class="btn-m ${initialTab === 'pin' ? 'btn-m-primary' : 'btn-m-white'}" style="font-size: 10.5px; padding: 4px 10px; white-space: nowrap;" onclick="switchGuideTab('pin')">
          🔒 Pasang & Reset PIN
        </button>
        <button type="button" class="btn-m ${initialTab === 'recover' ? 'btn-m-primary' : 'btn-m-white'}" style="font-size: 10.5px; padding: 4px 10px; white-space: nowrap;" onclick="switchGuideTab('recover')">
          ❓ Lupa PIN & Recover
        </button>
        <button type="button" class="btn-m ${initialTab === 'backup' ? 'btn-m-primary' : 'btn-m-white'}" style="font-size: 10.5px; padding: 4px 10px; white-space: nowrap;" onclick="switchGuideTab('backup')">
          📦 Backup & Ganti HP
        </button>
        <button type="button" class="btn-m ${initialTab === 'pwa' ? 'btn-m-primary' : 'btn-m-white'}" style="font-size: 10.5px; padding: 4px 10px; white-space: nowrap;" onclick="switchGuideTab('pwa')">
          📱 Install HP (Offline)
        </button>
      </div>

      <!-- Container for Tab Content -->
      <div id="guide-tab-content-area">
        ${getGuideTabHTML(initialTab)}
      </div>

    </div>
  `;

  bodyEl.scrollTop = 0;
  if (typeof openToolModalOverlay === 'function') {
    openToolModalOverlay();
  }
}

function switchGuideTab(tabName) {
  const contentArea = document.getElementById('guide-tab-content-area');
  const navContainer = document.getElementById('guide-nav-pills');
  if (!contentArea) return;

  // Update pills UI
  if (navContainer) {
    const btns = navContainer.querySelectorAll('button');
    btns.forEach(b => {
      b.className = 'btn-m btn-m-white';
      b.style.fontSize = '10.5px';
      b.style.padding = '4px 10px';
      b.style.whiteSpace = 'nowrap';
    });
    const activeIdx = ['privasi', 'pin', 'recover', 'backup', 'pwa'].indexOf(tabName);
    if (activeIdx !== -1 && btns[activeIdx]) {
      btns[activeIdx].className = 'btn-m btn-m-primary';
    }
  }

  contentArea.innerHTML = getGuideTabHTML(tabName);
}

function getGuideTabHTML(tabName) {
  if (tabName === 'privasi') {
    return `
      <div class="m-card" style="background: #FFF; padding: 14px; border: var(--border-sm); box-shadow: var(--shadow-sm);">
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
          <span class="badge badge-mint" style="margin: 0; font-size: 9px;">ZERO DATA LEAK</span>
          <h3 style="font-family: var(--font-heading); font-size: 14px; font-weight: 800; margin: 0;">Mengapa 100% Bebas Bocor?</h3>
        </div>

        <p style="font-size: 11.5px; color: #444; line-height: 1.5; margin-bottom: 12px;">
          Banyak orang khawatir saat menuliskan curhat luka batin atau mencatat siklus reproduksi di aplikasi online karena takut dibaca orang lain atau disadap. Berikut bukti mengapa aplikasi ini <b>mustahil membocorkan datamu</b>:
        </p>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="border-left: 3px solid #10B981; padding-left: 10px;">
            <b style="font-size: 12px; color: var(--ink);">1. Tanpa Server Database (Zero-Database)</b>
            <p style="font-size: 11px; color: #666; margin: 2px 0 0; line-height: 1.4;">
              Kami tidak memiliki komputer server penyimpanan data. Tidak ada database MySQL, MongoDB, ataupun Firebase di balik aplikasi ini.
            </p>
          </div>

          <div style="border-left: 3px solid #3A86FF; padding-left: 10px;">
            <b style="font-size: 12px; color: var(--ink);">2. Brankas Lokal Browser (LocalStorage Sandbox)</b>
            <p style="font-size: 11px; color: #666; margin: 2px 0 0; line-height: 1.4;">
              Setiap kata yang kamu tulis disimpan di memori privat peramban HP-mu sendiri. Aplikasi lain atau website lain di internet tidak memiliki izin untuk mengintip brankas ini.
            </p>
          </div>

          <div style="border-left: 3px solid #FFBE0B; padding-left: 10px;">
            <b style="font-size: 12px; color: var(--ink);">3. Tanpa Akun, Email, & Pelacak</b>
            <p style="font-size: 11px; color: #666; margin: 2px 0 0; line-height: 1.4;">
              Kamu tidak perlu mendaftar menggunakan nama asli, nomor WhatsApp, email, ataupun password akun. Kamu sepenuhnya anonim!
            </p>
          </div>

          <div style="border-left: 3px solid #8338EC; padding-left: 10px;">
            <b style="font-size: 12px; color: var(--ink);">4. Bekerja Tanpa Internet (Offline Total)</b>
            <p style="font-size: 11px; color: #666; margin: 2px 0 0; line-height: 1.4;">
              Setelah halaman terbuka atau di-install di HP, kamu bahkan bisa mematikan Wi-Fi atau mengaktifkan Mode Pesawat. Seluruh fitur tetap berfungsi normal.
            </p>
          </div>
        </div>

        <div style="margin-top: 14px; background: #F8FAFC; border: 1.5px dashed #CBD5E1; border-radius: 10px; padding: 10px; text-align: center;">
          <span style="font-size: 11px; color: #475569; font-weight: 700;">
            ✨ "Bahkan pengembang web ini tidak memiliki akses untuk membaca jurnalmu."
          </span>
        </div>
      </div>
    `;
  }

  if (tabName === 'pin') {
    return `
      <div class="m-card" style="background: #FFF; padding: 14px; border: var(--border-sm); box-shadow: var(--shadow-sm);">
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
          <span class="badge badge-yellow" style="margin: 0; font-size: 9px;">KUNCI APLIKASI</span>
          <h3 style="font-family: var(--font-heading); font-size: 14px; font-weight: 800; margin: 0;">Cara Pasang, Ganti, & Reset PIN</h3>
        </div>

        <!-- FAQ Cakupan PIN -->
        <div style="background: #EFF6FF; border: var(--border-sm); border-radius: 10px; padding: 10px; margin-bottom: 12px;">
          <div style="font-weight: 800; font-size: 11.5px; color: #1D4ED8; margin-bottom: 3px;">
            ❓ Apakah PIN berlaku untuk Kespro saja, Mental Health saja, atau semuanya?
          </div>
          <p style="font-size: 11px; color: #333; margin: 0; line-height: 1.45;">
            <b>Berlaku untuk SEMUANYA (1 Master PIN Global).</b> Kamu tidak perlu repot menghafal PIN terpisah. Cukup pasang 1 kali, maka seluruh portal Ruang Tumbuh Remaja terkunci: catatan siklus tubuh di Kespro dan curhat di Jurnal Emosi Mental Health terlindungi di bawah 1 kunci yang sama.
          </p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="background: #FFFBEA; border: var(--border-sm); border-radius: 10px; padding: 10px;">
            <b style="font-size: 12px; color: #854D0E;">1. Cara Mengaktifkan PIN:</b>
            <ol style="font-size: 11px; color: #444; margin: 4px 0 0; padding-left: 18px; line-height: 1.5;">
              <li>Masuk ke tab <b>📌 Catatanku</b> atau menu Keamanan di Portal.</li>
              <li>Klik tombol <b>"+ Pasang PIN"</b>.</li>
              <li>Ketik 4 angka pilihanmu (dan ketik ulang untuk konfirmasi).</li>
              <li>Pilih 1 pertanyaan rahasia (contoh: nama hewan peliharaan) dan ketik jawabannya.</li>
              <li>Simpan <b>Kunci Pemulihan Darurat (Recovery Key)</b> ke WhatsApp-mu atau screenshot.</li>
              <li>Klik <b>"Aktifkan Kunci PIN"</b>. Selesai!</li>
            </ol>
          </div>

          <div style="background: #F0FDF4; border: var(--border-sm); border-radius: 10px; padding: 10px;">
            <b style="font-size: 12px; color: #166534;">2. Cara Kerja Layar Kunci:</b>
            <p style="font-size: 11px; color: #444; margin: 4px 0 0; line-height: 1.45;">
              Setiap kali aplikasi baru dibuka atau setelah HP ditinggal lebih dari 5 menit, keypad angka ramah sentuh akan muncul. Masukkan 4 digit untuk membuka.
            </p>
          </div>

          <div style="background: #FFF1F2; border: var(--border-sm); border-radius: 10px; padding: 10px;">
            <b style="font-size: 12px; color: #9F1239;">3. Cara Menonaktifkan atau Mengganti PIN:</b>
            <p style="font-size: 11px; color: #444; margin: 4px 0 0; line-height: 1.45;">
              Buka tab <b>Catatanku</b> saat aplikasi dalam keadaan terbuka -> klik <b>"Nonaktifkan"</b>. Jika ingin mengganti dengan PIN baru, cukup klik lagi <b>"+ Pasang PIN"</b>.
            </p>
          </div>
        </div>

        <button class="btn-m btn-m-primary btn-m-block" style="margin-top: 14px; font-size: 11.5px;" onclick="closeToolModal(); openPinSetupModal();">
          🔒 Buka Menu Pengaturan PIN Sekarang
        </button>
      </div>
    `;
  }

  if (tabName === 'recover') {
    return `
      <div class="m-card" style="background: #FFF; padding: 14px; border: var(--border-sm); box-shadow: var(--shadow-sm);">
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
          <span class="badge badge-coral" style="margin: 0; font-size: 9px;">BANTUAN DARURAT</span>
          <h3 style="font-family: var(--font-heading); font-size: 14px; font-weight: 800; margin: 0;">Lupa PIN? Ini 3 Cara Pulihkannya</h3>
        </div>

        <p style="font-size: 11.5px; color: #444; line-height: 1.5; margin-bottom: 12px;">
          Karena kita tidak memiliki server untuk mengirim email "Forgot Password", kami menyediakan <b>3 sistem pemulihan mandiri</b> yang aman:
        </p>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          
          <!-- Opsi 1 -->
          <div style="border: var(--border-sm); border-radius: 10px; padding: 10px; background: #FFF9E6;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <b style="font-size: 12px;">🗝️ Opsi 1: Pertanyaan Keamanan Rahasia</b>
              <span class="badge badge-yellow" style="font-size: 8px; margin: 0;">TERCEPAT</span>
            </div>
            <p style="font-size: 11px; color: #555; margin: 0; line-height: 1.45;">
              Di layar keypad kunci, tekan tombol <b>"❓ Lupa PIN? Pulihkan Akun"</b>. Sistem akan memunculkan pertanyaan yang kamu pilih waktu membuat PIN. Ketik jawabannya (tidak sensitif huruf besar/kecil), dan aplikasi langsung terbuka!
            </p>
          </div>

          <!-- Opsi 2 -->
          <div style="border: var(--border-sm); border-radius: 10px; padding: 10px; background: #F0FDF4;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <b style="font-size: 12px;">🏷️ Opsi 2: Kunci Pemulihan (Recovery Key)</b>
            </div>
            <p style="font-size: 11px; color: #555; margin: 0; line-height: 1.45;">
              Jika lupa jawaban pertanyaan rahasia, masukkan 6-karakter kode unik (contoh: <code>RT-8924</code>) yang pernah kamu simpan/screenshot/kirim ke WhatsApp pribadimu saat awal membuat PIN.
            </p>
          </div>

          <!-- Opsi 3 -->
          <div style="border: var(--border-sm); border-radius: 10px; padding: 10px; background: #FFF5F5;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <b style="font-size: 12px; color: #B91C1C;">🚨 Opsi 3: Reset Darurat & Restore Cadangan</b>
            </div>
            <p style="font-size: 11px; color: #666; margin: 0; line-height: 1.45;">
              Jika benar-benar lupa keduanya, pilih opsi <b>"Reset PIN Aplikasi"</b>. Ini akan menghapus PIN sehingga kamu bisa masuk kembali. Jika kamu punya file backup JSON yang pernah diunduh, kamu tinggal klik "Pulihkan Data".
            </p>
          </div>

        </div>
      </div>
    `;
  }

  if (tabName === 'backup') {
    return `
      <div class="m-card" style="background: #FFF; padding: 14px; border: var(--border-sm); box-shadow: var(--shadow-sm);">
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
          <span class="badge badge-lavender" style="margin: 0; font-size: 9px;">DATA PORTABILITY</span>
          <h3 style="font-family: var(--font-heading); font-size: 14px; font-weight: 800; margin: 0;">Cara Backup & Pindah ke HP Baru</h3>
        </div>

        <p style="font-size: 11.5px; color: #444; line-height: 1.5; margin-bottom: 12px;">
          Karena tidak ada database di cloud, <b>kamu adalah pemilik sejati datamu</b>. Jika kamu berniat ganti smartphone baru atau ingin mengamankan catatan dari pembersihan cache browser:
        </p>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          
          <div style="background: #EFF6FF; border: var(--border-sm); border-radius: 10px; padding: 10px;">
            <b style="font-size: 12px; color: #1D4ED8;">📥 Langkah 1: Unduh Cadangan Data (Backup)</b>
            <ol style="font-size: 11px; color: #444; margin: 4px 0 0; padding-left: 18px; line-height: 1.5;">
              <li>Buka tab <b>📌 Catatanku</b> di Kespro atau Self-Help (atau menu Portal).</li>
              <li>Klik tombol <b>"📥 Cadangkan Data (.json)"</b>.</li>
              <li>HP-mu akan otomatis mengunduh file bernama <code>cadangan-ruang-tumbuh-YYYY-MM-DD.json</code>.</li>
              <li>Simpan file kecil ini di Google Drive, memori HP, atau kirimkan ke chat WhatsApp pribadimu.</li>
            </ol>
          </div>

          <div style="background: #F0FDF4; border: var(--border-sm); border-radius: 10px; padding: 10px;">
            <b style="font-size: 12px; color: #15803D;">📤 Langkah 2: Pulihkan Data di HP Baru (Restore)</b>
            <ol style="font-size: 11px; color: #444; margin: 4px 0 0; padding-left: 18px; line-height: 1.5;">
              <li>Buka website Ruang Tumbuh di HP barumu.</li>
              <li>Klik tombol <b>"📤 Pulihkan Data"</b>.</li>
              <li>Pilih file <code>.json</code> cadangan yang tadi kamu simpan.</li>
              <li>Klik konfirmasi pulihkan. Dalam 1 detik, seluruh riwayat jurnal, afirmasi, pelacak siklus, dan bookmark-mu langsung kembali 100%!</li>
            </ol>
          </div>

        </div>

        <div style="display: flex; gap: 8px; margin-top: 14px;">
          <button class="btn-m btn-m-primary" style="flex: 1; font-size: 11px; padding: 8px;" onclick="exportAllUserData()">
            📥 Unduh Cadangan Sekarang
          </button>
          <button class="btn-m btn-m-white" style="flex: 1; font-size: 11px; padding: 8px;" onclick="triggerImportUserData()">
            📤 Pulihkan Data (.json)
          </button>
        </div>
      </div>
    `;
  }

  if (tabName === 'pwa') {
    return `
      <div class="m-card" style="background: #FFF; padding: 14px; border: var(--border-sm); box-shadow: var(--shadow-sm);">
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
          <span class="badge badge-mint" style="margin: 0; font-size: 9px;">PROGRESSIVE WEB APP</span>
          <h3 style="font-family: var(--font-heading); font-size: 14px; font-weight: 800; margin: 0;">Pasang di Layar HP & Mode Offline</h3>
        </div>

        <p style="font-size: 11.5px; color: #444; line-height: 1.5; margin-bottom: 12px;">
          Aplikasi ini sudah berteknologi <b>PWA (Progressive Web App)</b>. Kamu bisa memasangnya seperti aplikasi Play Store/App Store tanpa perlu download puluhan megabyte:
        </p>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          
          <div style="background: #FFFBEA; border: var(--border-sm); border-radius: 10px; padding: 10px;">
            <b style="font-size: 12px; color: #854D0E;">📱 Di Android (Google Chrome):</b>
            <ol style="font-size: 11px; color: #444; margin: 4px 0 0; padding-left: 18px; line-height: 1.5;">
              <li>Buka website ini lewat browser Chrome.</li>
              <li>Jika banner <i>"Pasang di Layar HP"</i> muncul di portal, cukup klik tombol <b>"Pasang"</b>.</li>
              <li>Atau tekan menu titik tiga (⋮) di pojok kanan atas Chrome -> pilih <b>"Tambahkan ke Layar Utama" (Add to Home screen)</b>.</li>
            </ol>
          </div>

          <div style="background: #EFF6FF; border: var(--border-sm); border-radius: 10px; padding: 10px;">
            <b style="font-size: 12px; color: #1D4ED8;">🍏 Di iPhone / iPad (Safari):</b>
            <ol style="font-size: 11px; color: #444; margin: 4px 0 0; padding-left: 18px; line-height: 1.5;">
              <li>Buka website ini lewat browser Safari.</li>
              <li>Tekan ikon <b>Bagikan (Share)</b> di bilah bawah (kotak dengan panah ke atas).</li>
              <li>Gulir ke bawah dan pilih <b>"Tambah ke Layar Utama" (Add to Home Screen)</b>.</li>
            </ol>
          </div>

        </div>

        <div style="margin-top: 14px; background: #F0FDF4; border: 1.5px dashed #22C55E; border-radius: 10px; padding: 10px; font-size: 11px; color: #166534; line-height: 1.45;">
          💡 <b>Keuntungan Menginstall:</b> Ikon aplikasi akan muncul di layar utama HP, berjalan full-screen tanpa bilah alamat browser, dan dapat dibuka kapan saja meski sedang tidak ada sinyal internet!
        </div>
      </div>
    `;
  }

  return '';
}

// Attach to window
window.openAppGuidanceModal = openAppGuidanceModal;
window.switchGuideTab = switchGuideTab;
