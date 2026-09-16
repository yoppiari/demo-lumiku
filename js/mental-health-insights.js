// ==========================================================================
// MENTAL HEALTH INSIGHTS & EMOTION TENDENCY ENGINE
// Ruang Tumbuh Remaja - Local-First Analytical Engine & Riwayat Jurnal
// ==========================================================================

let currentInsightTimeframe = 'all'; // '7d', '30d', 'all'

function renderMentalHealthInsights() {
  const container = document.getElementById('sh-mental-health-insights-container');
  if (!container) return;

  const allEntries = selfHelpData?.savedJournalEntries || [];

  if (allEntries.length === 0) {
    container.innerHTML = `
      <div class="m-card" style="text-align: center; padding: 22px 14px; background: #FFF;">
        <div style="font-size: 32px; margin-bottom: 6px;">🌱</div>
        <div style="font-family: var(--font-heading); font-size: 14px; font-weight: 800; margin-bottom: 4px;">
          Belum Ada Riwayat Jurnal Cukup
        </div>
        <p style="font-size: 11.5px; color: #666; margin: 0 0 12px; line-height: 1.4;">
          Isi dan simpan jurnal emosi di atas minimal 1 kali untuk melihat analisis tren kondisi kesehatan mentalmu.
        </p>
      </div>
    `;
    return;
  }

  // Filter entries based on timeframe
  const now = Date.now();
  const filteredEntries = allEntries.filter(entry => {
    if (currentInsightTimeframe === 'all') return true;
    const entryTime = entry.id || 0;
    const daysDiff = (now - entryTime) / (1000 * 60 * 60 * 24);
    if (currentInsightTimeframe === '7d') return daysDiff <= 7;
    if (currentInsightTimeframe === '30d') return daysDiff <= 30;
    return true;
  });

  const totalFiltered = filteredEntries.length;
  if (totalFiltered === 0) {
    container.innerHTML = `
      <div class="m-card" style="text-align: center; padding: 18px; background: #FFF;">
        <p style="font-size: 12px; color: #777;">
          Tidak ada entri jurnal pada rentang <b>${currentInsightTimeframe === '7d' ? '7 hari' : '30 hari'} terakhir</b>.
        </p>
        <button class="btn-m btn-m-white" style="font-size: 11px; padding: 4px 10px;" onclick="setInsightTimeframe('all')">
          Tampilkan Semua Riwayat
        </button>
      </div>
    `;
    return;
  }

  // Calculate intensity average
  const totalIntensity = filteredEntries.reduce((sum, e) => sum + (e.intensity || 5), 0);
  const avgIntensity = (totalIntensity / totalFiltered).toFixed(1);

  // Count emotion frequency
  const emotionCounts = {};
  let totalEmotionTags = 0;

  filteredEntries.forEach(entry => {
    (entry.emotions || []).forEach(em => {
      emotionCounts[em] = (emotionCounts[em] || 0) + 1;
      totalEmotionTags++;
    });
  });

  // Sort emotions by count descending
  const sortedEmotions = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1]);

  // Determine mental health tendency profile
  const profile = determineTendencyProfile(sortedEmotions, avgIntensity, totalFiltered);

  // Render UI
  container.innerHTML = `
    <div class="m-card" style="padding: 16px; margin-bottom: 16px; background: #FFF; border: var(--border); box-shadow: var(--shadow-sm);">
      
      <!-- Timeframe Filter Buttons -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 6px;">
        <span style="font-size: 11px; font-weight: 800; color: #666; text-transform: uppercase;">
          📊 TREN KONDISI MENTAL
        </span>
        <div style="display: flex; gap: 4px;">
          <button type="button" class="btn-m ${currentInsightTimeframe === '7d' ? 'btn-m-primary' : 'btn-m-white'}" style="font-size: 10px; padding: 3px 8px;" onclick="setInsightTimeframe('7d')">7 Hari</button>
          <button type="button" class="btn-m ${currentInsightTimeframe === '30d' ? 'btn-m-primary' : 'btn-m-white'}" style="font-size: 10px; padding: 3px 8px;" onclick="setInsightTimeframe('30d')">30 Hari</button>
          <button type="button" class="btn-m ${currentInsightTimeframe === 'all' ? 'btn-m-primary' : 'btn-m-white'}" style="font-size: 10px; padding: 3px 8px;" onclick="setInsightTimeframe('all')">Semua</button>
        </div>
      </div>

      <!-- Tendency Summary Card -->
      <div style="background: ${profile.bgColor}; border: var(--border-sm); border-radius: 14px; padding: 14px; margin-bottom: 14px; box-shadow: var(--shadow-sm);">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
          <span style="font-size: 24px;">${profile.icon}</span>
          <div>
            <div style="font-size: 9.5px; font-weight: 800; text-transform: uppercase; color: #444;">HASIL ANALISIS POLA EMOSI</div>
            <div style="font-family: var(--font-heading); font-size: 14.5px; font-weight: 800; color: var(--ink);">
              ${profile.title}
            </div>
          </div>
        </div>

        <p style="font-size: 11.5px; color: #222; line-height: 1.45; margin: 0 0 10px;">
          ${profile.description}
        </p>

        <!-- Mini Stats Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding-top: 8px; border-top: 1px dashed rgba(0,0,0,0.15);">
          <div>
            <span style="font-size: 10px; color: #555; display: block;">Rata-rata Beban Emosi:</span>
            <b style="font-size: 13px;">${avgIntensity} / 10</b>
            <span class="badge ${avgIntensity >= 7 ? 'badge-coral' : avgIntensity >= 4 ? 'badge-yellow' : 'badge-mint'}" style="font-size: 8.5px; margin: 0 0 0 4px;">
              ${avgIntensity >= 7 ? 'Tinggi' : avgIntensity >= 4 ? 'Sedang' : 'Ringan'}
            </span>
          </div>
          <div>
            <span style="font-size: 10px; color: #555; display: block;">Total Jurnal Tercatat:</span>
            <b style="font-size: 13px;">${totalFiltered} Catatan</b>
          </div>
        </div>
      </div>

      <!-- Actionable Advice Card -->
      <div style="background: #F8F9FA; border: var(--border-sm); border-radius: 12px; padding: 12px; margin-bottom: 14px;">
        <div style="font-size: 11px; font-weight: 800; color: #333; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
          <span>💡 Rekomendasi Adaptif:</span>
        </div>
        <p style="font-size: 11.5px; color: #444; margin: 0 0 8px; line-height: 1.4;">
          ${profile.advice}
        </p>
        ${profile.recommendedTool ? `
          <button class="btn-m btn-m-mint" style="font-size: 11px; padding: 5px 12px; width: 100%;" onclick="openSelfHelpTool('${profile.recommendedTool}')">
            ${profile.toolButtonText} →
          </button>
        ` : ''}
      </div>

      <!-- Emotion Distribution Breakdown (Pure CSS Neo-Memphis Bars) -->
      <div style="margin-top: 12px;">
        <div style="font-size: 11.5px; font-weight: 800; margin-bottom: 8px;">
          Distribusi Emosi yang Paling Sering Muncul:
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          ${sortedEmotions.slice(0, 5).map(([emotion, count]) => {
            const pct = Math.round((count / (totalEmotionTags || 1)) * 100);
            return `
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; margin-bottom: 2px;">
                  <span>${emotion}</span>
                  <span>${count}x (${pct}%)</span>
                </div>
                <div style="height: 12px; background: #EFEFEF; border: 1.5px solid var(--ink); border-radius: 6px; overflow: hidden; box-shadow: 1px 1px 0px var(--ink);">
                  <div style="width: ${pct}%; height: 100%; background: ${getEmotionColor(emotion)};"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

    </div>
  `;
}

function setInsightTimeframe(tf) {
  currentInsightTimeframe = tf;
  renderMentalHealthInsights();
}

// Logic to determine mental health tendency
function determineTendencyProfile(sortedEmotions, avgIntensity, totalCount) {
  const topEmotions = sortedEmotions.slice(0, 3).map(e => e[0]);
  const isLelahDominant = topEmotions.includes('Lelah') || topEmotions.includes('Kewalahan');
  const isCemasDominant = topEmotions.includes('Cemas') || topEmotions.includes('Takut');
  const isSedihDominant = topEmotions.includes('Sedih') || topEmotions.includes('Kecewa');
  const isMarahDominant = topEmotions.includes('Marah');
  const isPositifDominant = topEmotions.includes('Tenang') || topEmotions.includes('Senang') || topEmotions.includes('Bersyukur');

  if (isLelahDominant && (isCemasDominant || avgIntensity >= 6.0)) {
    return {
      icon: '⚡',
      title: 'Kelelahan Mental & Burnout (Overwhelmed)',
      bgColor: '#FFF3D6',
      description: 'Riwayatmu menunjukkan frekuensi rasa <b>Lelah</b> dan <b>Kewalahan</b> yang cukup tinggi. Pikiranmu mungkin sedang memproses terlalu banyak tuntutan sekolah, relasi, atau media sosial sekaligus.',
      advice: 'Tubuhmu meminta istirahat sensorik. Hindari scroll layar sebelum tidur dan ambil jeda pernapasan.',
      recommendedTool: 'stop_method',
      toolButtonText: 'Latihan Metode S-T-O-P (5 Menit Jeda)'
    };
  }

  if (isCemasDominant) {
    return {
      icon: '🌊',
      title: 'Kecemasan & Overthinking (Anxious Mind)',
      bgColor: '#FCE7F3',
      description: 'Pikiranmu cenderung sering berada di mode <b>Waspada Tinggi (Cemas/Takut)</b> dan mengkhawatirkan hal-hal yang belum terjadi atau berada di luar kendali.',
      advice: 'Tarik kembali fokusmu ke saat ini menggunakan grounding panca indera agar sistem saraf rileks.',
      recommendedTool: 'grounding_54321',
      toolButtonText: 'Buka Grounding 5-4-3-2-1'
    };
  }

  if (isSedihDominant) {
    return {
      icon: '🌧️',
      title: 'Fase Low Energy & Butuh Self-Compassion',
      bgColor: '#E0F2FE',
      description: 'Emosi <b>Sedih</b> atau <b>Kecewa</b> paling sering terekam belakangan ini. Perasaan ini sangat valid, jangan dipaksa langsung ceria jika hatimu masih butuh waktu berduka.',
      advice: 'Perlakukan dirimu seperti sahabat terbaik. Tulis hal-hal kecil yang masih bisa kamu syukuri hari ini.',
      recommendedTool: 'cbt_reframing',
      toolButtonText: 'Refleksi CBT Reframing Sehat'
    };
  }

  if (isMarahDominant) {
    return {
      icon: '🔥',
      title: 'Frustrasi & Ketegangan Emosional',
      bgColor: '#FFE4E6',
      description: 'Rasa <b>Marah</b> atau kesal mendominasi catatanmu. Kemarahan adalah sinyal sehat bahwa ada batasan pribadimu yang dilanggar atau ketidakadilan yang kamu rasakan.',
      advice: 'Salurkan ketegangan lewat aktivitas fisik atau tuliskan unek-unek secara bebas di jurnal.',
      recommendedTool: 'stop_method',
      toolButtonText: 'Gunakan Metode S-T-O-P'
    };
  }

  if (isPositifDominant) {
    return {
      icon: '🌱',
      title: 'Kondisi Relatif Stabil, Tenang & Resilien',
      bgColor: '#DCFCE7',
      description: 'Kabar baik! Riwayat emosimu menunjukkan kondisi yang <b>Tenang, Bersyukur, dan Sehat</b>. Kamu memiliki daya lenting (*resilience*) yang baik dalam menghadapi dinamika harian.',
      advice: 'Terus rawat kebiasaan refleksi positif ini dan rayakan pencapaian kecilmu setiap hari!',
      recommendedTool: null,
      toolButtonText: null
    };
  }

  // Default: Dynamic / Rollercoaster
  return {
    icon: '🎢',
    title: 'Emosi Dinamis & Fluktuatif',
    bgColor: '#F3E8FF',
    description: 'Catatanmu menunjukkan spektrum emosi yang beragam dan berganti-ganti. Ini sangat wajar di masa remaja saat hormon dan lingkunganmu terus berubah.',
    advice: 'Amati tanpa menghakimi diri sendiri saat gelombang emosi datang silih berganti.',
    recommendedTool: 'grounding_54321',
    toolButtonText: 'Latihan Grounding 5-4-3-2-1'
  };
}

function getEmotionColor(emotion) {
  const map = {
    'Cemas': '#FF6B6B',
    'Takut': '#8338EC',
    'Sedih': '#3A86FF',
    'Marah': '#E11D48',
    'Bingung': '#FFBE0B',
    'Kecewa': '#FB7185',
    'Lelah': '#F59E0B',
    'Tenang': '#10B981',
    'Senang': '#FFD93D',
    'Bangga': '#8B5CF6',
    'Bersyukur': '#06D6A0'
  };
  return map[emotion] || '#FFD93D';
}

// --------------------------------------------------------------------------
// EXTENDED JOURNAL HISTORY LIST (WITH DELETE & DETAIL MODAL)
// --------------------------------------------------------------------------
function deleteJournalEntry(id) {
  if (confirm('Hapus entri jurnal ini dari riwayat?')) {
    if (!selfHelpData.savedJournalEntries) return;
    selfHelpData.savedJournalEntries = selfHelpData.savedJournalEntries.filter(e => e.id !== id);
    saveSelfHelpData();
    renderMentalHealthInsights();
    if (typeof renderJournalHistory === 'function') renderJournalHistory();
    if (typeof updateSelfHelpMoodStatus === 'function') updateSelfHelpMoodStatus();
    showToast('🗑️ Entri jurnal dihapus.');
  }
}

// Attach to window
window.renderMentalHealthInsights = renderMentalHealthInsights;
window.setInsightTimeframe = setInsightTimeframe;
window.deleteJournalEntry = deleteJournalEntry;
