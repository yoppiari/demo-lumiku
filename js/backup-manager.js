// ==========================================================================
// BACKUP & RESTORE MANAGER (ZERO-DATABASE DATA PORTABILITY)
// Ruang Tumbuh Remaja - JSON Export / Import Engine
// ==========================================================================

function exportAllUserData() {
  const exportPayload = {
    app: "Ruang Tumbuh Remaja",
    version: "2.0",
    exportedAt: new Date().toISOString(),
    data: {
      // Kespro Storage
      kespro_track: localStorage.getItem('kespro_track'),
      kespro_read_chapters: localStorage.getItem('kespro_read_chapters'),
      kespro_bookmarks: localStorage.getItem('kespro_bookmarks'),
      kespro_safety_card: localStorage.getItem('kespro_safety_card'),
      kespro_radar_result: localStorage.getItem('kespro_radar_result'),
      kespro_period_tracker: localStorage.getItem('kespro_period_tracker'),
      kespro_daily_affirmation: localStorage.getItem('kespro_daily_affirmation'),
      kespro_notes_history: localStorage.getItem('kespro_notes_history'),

      // Self-Help Storage
      selfhelp_data: localStorage.getItem('selfhelp_data'),
      selfhelp_read_chapters: localStorage.getItem('selfhelp_read_chapters'),
      selfhelp_bookmarks: localStorage.getItem('selfhelp_bookmarks'),
      selfhelp_gratitude_history: localStorage.getItem('selfhelp_gratitude_history')
    }
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `cadangan-ruang-tumbuh-${dateStr}.json`;

  const downloadAnchor = document.createElement('a');
  downloadAnchor.href = url;
  downloadAnchor.download = fileName;
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  document.body.removeChild(downloadAnchor);
  URL.revokeObjectURL(url);

  showToast(`📦 Cadangan berhasil diunduh: ${fileName}`);
}

function triggerImportUserData() {
  const fileInput = document.getElementById('rt-universal-file-input');
  if (fileInput) {
    fileInput.value = '';
    fileInput.click();
  }
}

function handleImportFileSelected(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const content = e.target.result;
      const parsed = JSON.parse(content);

      if (!parsed || !parsed.data) {
        throw new Error('Format cadangan tidak dikenali.');
      }

      const confirmRestore = confirm(
        `Ditemukan data cadangan tertanggal ${parsed.exportedAt?.slice(0,10) || 'sebelumnya'}.\nApakah kamu ingin memulihkan data ini? Data yang ada di perangkat akan diperbarui.`
      );

      if (!confirmRestore) return;

      // Restore keys
      const d = parsed.data;
      if (d.kespro_track !== undefined && d.kespro_track !== null) localStorage.setItem('kespro_track', d.kespro_track);
      if (d.kespro_read_chapters) localStorage.setItem('kespro_read_chapters', d.kespro_read_chapters);
      if (d.kespro_bookmarks) localStorage.setItem('kespro_bookmarks', d.kespro_bookmarks);
      if (d.kespro_safety_card) localStorage.setItem('kespro_safety_card', d.kespro_safety_card);
      if (d.kespro_radar_result) localStorage.setItem('kespro_radar_result', d.kespro_radar_result);
      if (d.kespro_period_tracker) localStorage.setItem('kespro_period_tracker', d.kespro_period_tracker);
      if (d.kespro_daily_affirmation) localStorage.setItem('kespro_daily_affirmation', d.kespro_daily_affirmation);
      if (d.kespro_notes_history) localStorage.setItem('kespro_notes_history', d.kespro_notes_history);

      if (d.selfhelp_data) localStorage.setItem('selfhelp_data', d.selfhelp_data);
      if (d.selfhelp_read_chapters) localStorage.setItem('selfhelp_read_chapters', d.selfhelp_read_chapters);
      if (d.selfhelp_bookmarks) localStorage.setItem('selfhelp_bookmarks', d.selfhelp_bookmarks);
      if (d.selfhelp_gratitude_history) localStorage.setItem('selfhelp_gratitude_history', d.selfhelp_gratitude_history);

      showToast('🎉 Seluruh data & riwayat berhasil dipulihkan!');

      // Refresh applications if loaded
      if (typeof initKesproApp === 'function') initKesproApp();
      if (typeof initSelfHelpApp === 'function') initSelfHelpApp();
      if (typeof updateSecuritySettingsUI === 'function') updateSecuritySettingsUI();
      if (typeof renderMentalHealthInsights === 'function') renderMentalHealthInsights();

    } catch (err) {
      console.error('Import error:', err);
      alert('Gagal membaca file cadangan: ' + (err.message || 'File tidak valid.'));
    }
  };

  reader.readAsText(file);
}

// Attach to window
window.exportAllUserData = exportAllUserData;
window.triggerImportUserData = triggerImportUserData;
window.handleImportFileSelected = handleImportFileSelected;
