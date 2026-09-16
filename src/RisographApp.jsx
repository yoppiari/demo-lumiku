import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'mental_health_workbook_data_v1';

const defaultData = {
  profile: {
    nama: '',
    usia: ''
  },
  jurnalEmosi: {
    selectedEmosi: [],
    situasi: '',
    pikiran: '',
    intensitas: 5,
    tindakan: '',
    alternatif: ''
  },
  kelolaPikiran: {
    pikiranMuncul: '',
    pikiranRealistis: '',
    lihat: '',
    sentuh: '',
    dengar: '',
    cium: '',
    rasakan: ''
  },
  kekuatanDiri: {
    halBaik1: '',
    halBaik2: '',
    halBaik3: '',
    halBerat: '',
    selfTalkDown: '',
    selfTalkRamah: '',
    selectedNeeds: []
  },
  keseharian: {
    syukur1: '',
    syukur2: '',
    syukur3: '',
    stressSituasi: '',
    stressKontrol: '',
    stressLangkah: '',
    digitalHabits: [],
    batasDigital: ''
  },
  support: {
    cerita1Nama: '',
    cerita1Waktu: '',
    cerita2Nama: '',
    cerita2Waktu: '',
    rencanaTingkatkan: '',
    rencanaKurangi: '',
    rencanaAktivitas: ''
  }
};

/* --- RISOGRAPH & WEBTOON UI ATOMS --- */

// Registration crosshair mark (Riso print alignment mark)
const RegistrationMark = ({ className = "" }) => (
  <div className={`pointer-events-none select-none flex items-center justify-center text-[#FA2A55] opacity-60 font-mono text-xs ${className}`}>
    <span className="inline-block">⌖</span>
  </div>
);

// Riso Overprint Badge / Stamp
const RisoBadge = ({ text, color = "bg-[#FA2A55]", textColor = "text-white", rotate = "-rotate-1" }) => (
  <span className={`inline-block px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider ${color} ${textColor} border-2 border-[#0D2C54] shadow-[3px_3px_0px_#0D2C54] ${rotate}`}>
    {text}
  </span>
);

// Webtoon Comic Panel Container with offset Riso shadow
const WebtoonPanel = ({ 
  children, 
  title, 
  badge, 
  sceneNumber, 
  accent = "pink", // "pink" | "blue" | "yellow" | "teal"
  className = "" 
}) => {
  const accentBorder = {
    pink: "border-[#FA2A55] shadow-[5px_5px_0px_#0D2C54]",
    blue: "border-[#0D2C54] shadow-[5px_5px_0px_#FA2A55]",
    yellow: "border-[#0D2C54] shadow-[5px_5px_0px_#F9BC15]",
    teal: "border-[#00A896] shadow-[5px_5px_0px_#0D2C54]"
  }[accent] || "border-[#0D2C54] shadow-[5px_5px_0px_#FA2A55]";

  return (
    <div className={`relative bg-[#FFFDF9] border-3 rounded-xl p-5 sm:p-7 ${accentBorder} transition-all ${className}`}>
      {/* Halftone Top Corner Accent */}
      <div className="absolute top-2 right-3 flex items-center gap-1.5 opacity-40 select-none">
        <span className="text-[10px] font-mono text-[#0D2C54]">RISO•SCREEN</span>
        <span className="w-2 h-2 rounded-full bg-[#FA2A55]" />
        <span className="w-2 h-2 rounded-full bg-[#0D2C54]" />
      </div>

      {/* Panel Scene / Chapter Header */}
      {(sceneNumber || badge || title) && (
        <div className="flex flex-wrap items-center gap-2 mb-4 pb-2 border-b-2 border-dashed border-[#0D2C54]/20">
          {sceneNumber && (
            <span className="font-mono text-xs font-black uppercase px-2 py-0.5 bg-[#0D2C54] text-[#FAF7EE] rounded">
              {sceneNumber}
            </span>
          )}
          {badge && <RisoBadge text={badge} color="bg-[#F9BC15]" textColor="text-[#0D2C54]" rotate="rotate-0" />}
          {title && <h3 className="font-mono text-lg font-black uppercase tracking-tight text-[#0D2C54]">{title}</h3>}
        </div>
      )}

      {children}
    </div>
  );
};

// Webtoon Comic Speech Bubble
const SpeechBubble = ({ 
  speaker = "TIM KONSELOR", 
  avatar = "🧑‍🏫", 
  children, 
  direction = "left", 
  bgColor = "bg-white",
  borderColor = "border-[#0D2C54]",
  bubbleTail = true 
}) => (
  <div className="my-4 relative">
    <div className="flex items-center gap-2 mb-1.5">
      <span className="text-xl">{avatar}</span>
      <span className="font-mono text-xs font-black uppercase tracking-wider text-[#FA2A55] bg-[#FAF7EE] px-2 py-0.5 border border-[#0D2C54] shadow-[1px_1px_0px_#0D2C54]">
        {speaker}
      </span>
    </div>
    <div className={`relative ${bgColor} border-2 ${borderColor} rounded-2xl p-4 shadow-[3px_3px_0px_#0D2C54] text-sm leading-relaxed text-[#0D2C54] font-medium`}>
      {children}
      {bubbleTail && (
        <div className="absolute -top-2 left-6 w-3 h-3 bg-white border-t-2 border-l-2 border-[#0D2C54] -rotate-45" />
      )}
    </div>
  </div>
);

// Comic Thought Bubble (💭)
const ThoughtBubble = ({ children, title = "Suara di Kepala" }) => (
  <div className="p-4 bg-[#FAF5FF] border-2 border-dashed border-[#7E22CE] rounded-2xl shadow-[3px_3px_0px_#7E22CE] my-3">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-lg">💭</span>
      <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#7E22CE]">
        {title}
      </span>
    </div>
    <div className="text-sm italic text-[#4C1D95]">
      {children}
    </div>
  </div>
);

// Narrator Caption Box (Komik webtoon narrator text)
const NarratorBox = ({ children, chapter = "CATATAN NARATOR" }) => (
  <div className="bg-[#0D2C54] text-[#FAF7EE] p-3.5 rounded-lg border-2 border-[#FA2A55] shadow-[3px_3px_0px_#FA2A55] my-3">
    <div className="flex items-center justify-between mb-1">
      <span className="font-mono text-[10px] tracking-widest text-[#F9BC15] uppercase font-bold">
        {chapter}
      </span>
      <span className="text-xs">✦</span>
    </div>
    <div className="font-sans text-xs sm:text-sm leading-relaxed opacity-95">
      {children}
    </div>
  </div>
);

// Risograph Input Field
const RisoInput = ({ value, onChange, placeholder, className = "" }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full bg-white border-2 border-[#0D2C54] rounded-lg px-3.5 py-2 text-sm text-[#0D2C54] placeholder:text-[#0D2C54]/40 font-mono focus:outline-none focus:border-[#FA2A55] focus:ring-2 focus:ring-[#FA2A55]/30 shadow-[2px_2px_0px_#0D2C54] transition-all ${className}`}
  />
);

// Risograph Textarea
const RisoTextarea = ({ value, onChange, placeholder, rows = 3, className = "" }) => (
  <textarea
    rows={rows}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full bg-white border-2 border-[#0D2C54] rounded-lg p-3 text-sm text-[#0D2C54] placeholder:text-[#0D2C54]/40 font-sans focus:outline-none focus:border-[#FA2A55] focus:ring-2 focus:ring-[#FA2A55]/30 shadow-[2px_2px_0px_#0D2C54] transition-all resize-none ${className}`}
  />
);

// Riso Action Pill / Selection Tag
const RisoTag = ({ label, selected, onClick, emoji = "✨" }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded-lg border-2 transition-all ${
      selected
        ? "bg-[#FA2A55] text-white border-[#0D2C54] shadow-[3px_3px_0px_#0D2C54] -translate-y-0.5"
        : "bg-white text-[#0D2C54] border-[#0D2C54] hover:bg-[#FAF7EE] shadow-[1px_1px_0px_#0D2C54]"
    }`}
  >
    <span>{emoji}</span>
    <span>{label}</span>
  </button>
);

/* ========================================================================= */
/* --- 7 MODUL / HALAMAN INDIE ZINE --- */
/* ========================================================================= */

/* 1. BERANDA (COVER & PROFIL) */
const Beranda = ({ data, updateData }) => (
  <div className="space-y-6 animate-fade-in print-content">
    {/* Zine Front Cover */}
    <div className="relative bg-[#FFFDF9] border-4 border-[#0D2C54] rounded-2xl p-6 sm:p-10 shadow-[8px_8px_0px_#FA2A55] overflow-hidden">
      {/* Registration Marks */}
      <RegistrationMark className="absolute top-2 left-2" />
      <RegistrationMark className="absolute top-2 right-2" />
      <RegistrationMark className="absolute bottom-2 left-2" />
      <RegistrationMark className="absolute bottom-2 right-2" />

      {/* Top Issue Bar */}
      <div className="flex flex-wrap items-center justify-between border-b-2 border-[#0D2C54] pb-3 mb-6 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#FA2A55] inline-block animate-pulse" />
          <span className="font-mono text-xs font-black uppercase text-[#0D2C54] tracking-widest">
            RUANG TUMBUH PRESS // ZINE ISSUE #01
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#0D2C54]">
          <span className="px-2 py-0.5 bg-[#FAF7EE] border border-[#0D2C54] font-bold">2-COLOR RISO</span>
          <span className="px-2 py-0.5 bg-[#FA2A55] text-white font-bold">SPOT INK</span>
        </div>
      </div>

      {/* Comic Header Title */}
      <div className="text-center my-4">
        <div className="inline-block bg-[#F9BC15] text-[#0D2C54] border-2 border-[#0D2C54] px-4 py-1 rounded-full font-mono text-xs font-black uppercase tracking-widest shadow-[2px_2px_0px_#0D2C54] mb-3 -rotate-1">
          ✦ SPECIAL EDITION FOR TEENS ✦
        </div>

        <h1 className="font-mono text-4xl sm:text-6xl font-black uppercase text-[#0D2C54] tracking-tighter leading-none mb-3">
          KESEHATAN <br />
          <span className="text-[#FA2A55] underline decoration-[#0D2C54] decoration-4">MENTAL REMAJA</span>
        </h1>

        <p className="font-mono text-sm sm:text-base font-bold text-[#0D2C54] max-w-xl mx-auto mt-2">
          Kenali Diri • Kelola Emosi • Bangun Hidup yang Lebih Baik
        </p>
      </div>

      {/* Sound effect sticker */}
      <div className="text-center my-3">
        <span className="inline-block bg-[#00A896] text-white font-mono text-xs font-black px-3 py-1 rounded border-2 border-[#0D2C54] shadow-[3px_3px_0px_#0D2C54] rotate-2">
          ⚡ *SELF-DISCOVERY JOURNEY* ⚡
        </span>
      </div>
    </div>

    {/* Profil & Disclaimer Panels */}
    <div className="grid md:grid-cols-2 gap-6">
      {/* Panel Profil */}
      <WebtoonPanel sceneNumber="SCENE 01" title="LEMBAR IDENTITAS DIRI" accent="pink">
        <p className="font-sans text-xs text-[#0D2C54]/80 mb-4">
          Buku zine ini milikmu sepenuhnya. Tuliskan identitas personalmu di bawah ini:
        </p>
        <div className="space-y-4">
          <div>
            <label className="font-mono text-xs font-bold uppercase text-[#0D2C54] block mb-1">
              Nama Lengkap / Panggilan:
            </label>
            <RisoInput
              placeholder="Misal: Rian / Kirana"
              value={data.profile.nama}
              onChange={(e) => updateData('profile', 'nama', e.target.value)}
            />
          </div>
          <div>
            <label className="font-mono text-xs font-bold uppercase text-[#0D2C54] block mb-1">
              Usia / Kelas Saat Ini:
            </label>
            <RisoInput
              placeholder="Misal: 16 Tahun / XI SMA"
              value={data.profile.usia}
              onChange={(e) => updateData('profile', 'usia', e.target.value)}
            />
          </div>
        </div>
      </WebtoonPanel>

      {/* Panel Disclaimer Medis */}
      <WebtoonPanel sceneNumber="WARNING" title="PANDUAN & DISCLAIMER" accent="yellow">
        <SpeechBubble speaker="TIM KONSELOR" avatar="🧑‍🏫">
          "Zine ini adalah teman berlatih harian (self-help) dan panduan refleksi emosi, <strong>bukan pengganti diagnosis atau konseling medis</strong>."
        </SpeechBubble>

        <NarratorBox chapter="PERINGATAN PENTING">
          Jika beban pikiran terasa terlalu berat, jangan dipendam sendiri. Segera hubungi orang dewasa yang kamu percaya, guru BK, atau profesional kesehatan mental.
        </NarratorBox>
      </WebtoonPanel>
    </div>

    {/* Cara Pakai Infografis Webtoon Panel Grid */}
    <WebtoonPanel sceneNumber="PANDUAN" title="3 ATURAN MEMBACA ZINE INI" accent="blue">
      <div className="grid sm:grid-cols-3 gap-4 font-sans text-xs">
        <div className="bg-[#FAF7EE] p-3.5 border-2 border-[#0D2C54] rounded-lg shadow-[2px_2px_0px_#0D2C54]">
          <div className="font-mono text-base font-black text-[#FA2A55] mb-1">01. BEBAS RUTE</div>
          <p className="text-[#0D2C54] leading-relaxed">
            Tidak harus dibaca berurutan. Buka bab yang paling kamu butuhkan saat ini.
          </p>
        </div>
        <div className="bg-[#FAF7EE] p-3.5 border-2 border-[#0D2C54] rounded-lg shadow-[2px_2px_0px_#0D2C54]">
          <div className="font-mono text-base font-black text-[#00A896] mb-1">02. JUJUR & NYATA</div>
          <p className="text-[#0D2C54] leading-relaxed">
            Tidak ada jawaban salah atau benar. Tulis apa yang sungguh-sungguh kamu rasakan.
          </p>
        </div>
        <div className="bg-[#FAF7EE] p-3.5 border-2 border-[#0D2C54] rounded-lg shadow-[2px_2px_0px_#0D2C54]">
          <div className="font-mono text-base font-black text-[#F9BC15] mb-1">03. AMBIL JEDA</div>
          <p className="text-[#0D2C54] leading-relaxed">
            Jika terasa melelahkan, tutup sejenak, tarik napas dalam, dan kembali kapan saja.
          </p>
        </div>
      </div>
    </WebtoonPanel>
  </div>
);

/* 2. MATERI EDUKASI (POJOK BACA) */
const Materi = () => (
  <div className="space-y-6 animate-fade-in print-content">
    <div className="border-b-2 border-[#0D2C54] pb-2">
      <RisoBadge text="EDUKASI RINGKAS" color="bg-[#0D2C54]" textColor="text-white" />
      <h2 className="font-mono text-2xl sm:text-3xl font-black uppercase text-[#0D2C54] tracking-tight mt-1">
        POJOK BACA: 3 HAL PENTING TENTANG DIRIMU
      </h2>
    </div>

    {/* Materi 1 */}
    <WebtoonPanel sceneNumber="BAB 01" title="MENGENAL KESEHATAN MENTAL" accent="blue">
      <SpeechBubble speaker="TIM KONSELOR">
        "Kesehatan mental itu sama pentingnya dengan kesehatan fisik. Pikiran, emosi, dan tindakanmu selalu saling terhubung dalam lingkaran tak terlihat."
      </SpeechBubble>

      <div className="grid sm:grid-cols-3 gap-3 my-4 font-mono text-xs">
        <div className="p-3 bg-[#FAF7EE] border-2 border-[#0D2C54] rounded text-center">
          <div className="text-xl mb-1">🧠</div>
          <div className="font-black text-[#FA2A55]">PIKIRAN</div>
          <p className="text-[11px] font-sans mt-1">Apa yang kamu bayangkan atau simpulkan.</p>
        </div>
        <div className="p-3 bg-[#FAF7EE] border-2 border-[#0D2C54] rounded text-center">
          <div className="text-xl mb-1">💓</div>
          <div className="font-black text-[#00A896]">EMOSI</div>
          <p className="text-[11px] font-sans mt-1">Sensasi batin: senang, takut, marah, sedih.</p>
        </div>
        <div className="p-3 bg-[#FAF7EE] border-2 border-[#0D2C54] rounded text-center">
          <div className="text-xl mb-1">🏃</div>
          <div className="font-black text-[#F9BC15]">TINDAKAN</div>
          <p className="text-[11px] font-sans mt-1">Respon dan perilakumu terhadap situasi.</p>
        </div>
      </div>

      <NarratorBox chapter="PELAJARAN UTAMA">
        Ketika pikiranmu negatif, emosimu ikut tegang, dan perilakumu bisa berubah defensif. Kunci memutus rantai ini adalah menyadari pikiran tersebut sejak awal.
      </NarratorBox>
    </WebtoonPanel>

    {/* Materi 2 */}
    <WebtoonPanel sceneNumber="BAB 02" title="PIKIRANMU SEPERTI BATERAI HP" accent="pink">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-16 border-3 border-[#0D2C54] rounded-lg p-1 flex flex-col justify-end bg-white shadow-[2px_2px_0px_#FA2A55]">
          <div className="w-full bg-[#FA2A55] h-2/5 rounded" />
        </div>
        <div>
          <h4 className="font-mono text-base font-bold text-[#0D2C54]">STATUS ENERGI: PERLU DI-CHARGE!</h4>
          <p className="font-sans text-xs text-[#0D2C54]/80">
            Energi mentalmu terbatas tiap hari. Jangan habiskan untuk hal yang tak terkontrol.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 text-xs font-sans">
        <div className="p-3.5 bg-[#FFF0F3] border-2 border-[#FA2A55] rounded-lg">
          <span className="font-mono font-bold text-[#FA2A55] block mb-1">🔻 HAL YANG MENGURAS BATERAI:</span>
          <ul className="list-disc list-inside space-y-1 text-[#0D2C54]">
            <li>Kurang tidur karena doomscrolling larut malam</li>
            <li>Membandingkan diri dengan orang di medsos</li>
            <li>Memendam amarah atau takut menolak (*people pleasing*)</li>
          </ul>
        </div>
        <div className="p-3.5 bg-[#E6F8F6] border-2 border-[#00A896] rounded-lg">
          <span className="font-mono font-bold text-[#00A896] block mb-1">⚡ HAL YANG MENGISI ULANG:</span>
          <ul className="list-disc list-inside space-y-1 text-[#0D2C54]">
            <li>Tidur cukup 7–8 jam & minum air teratur</li>
            <li>Curhat ke sahabat atau orang tua yang aman</li>
            <li>Menyalurkan hobi tanpa tuntutan sempurna</li>
          </ul>
        </div>
      </div>
    </WebtoonPanel>

    {/* Materi 3 */}
    <WebtoonPanel sceneNumber="BAB 03" title="EMOSI BUKANLAH MUSUH" accent="yellow">
      <SpeechBubble speaker="TIM KONSELOR">
        "Marah, cemas, atau sedih bukan berarti kamu 'rusak'. Semua emosi adalah sistem alarm bawaan tubuh untuk melindungimu."
      </SpeechBubble>

      <NarratorBox chapter="TIPS SAKTI">
        Alih-alih menyalahkan diri (*"Kenapa sih aku cengeng banget?"*), gantilah dengan rasa penasaran: (*"Ada apa ya? Emosi ini sedang mencoba memberitahuku apa?"*).
      </NarratorBox>
    </WebtoonPanel>
  </div>
);

/* 3. JURNAL EMOSI */
const JurnalEmosi = ({ data, updateData }) => {
  const emosiOptions = [
    { label: 'Senang', emoji: '😊' },
    { label: 'Cemas', emoji: '😰' },
    { label: 'Sedih', emoji: '😢' },
    { label: 'Marah', emoji: '😡' },
    { label: 'Lelah', emoji: '🥱' },
    { label: 'Takut', emoji: '😨' },
    { label: 'Bingung', emoji: '😵‍💫' },
    { label: 'Malu', emoji: '😳' },
    { label: 'Lega', emoji: '😌' },
    { label: 'Kecewa', emoji: '😞' },
    { label: 'Bangga', emoji: '😎' },
    { label: 'Tenang', emoji: '🍃' },
  ];

  const toggleEmosi = (label) => {
    const curr = data.jurnalEmosi.selectedEmosi || [];
    if (curr.includes(label)) {
      updateData('jurnalEmosi', 'selectedEmosi', curr.filter(i => i !== label));
    } else {
      updateData('jurnalEmosi', 'selectedEmosi', [...curr, label]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in print-content">
      <div className="border-b-2 border-[#0D2C54] pb-2">
        <RisoBadge text="LOG HARIAN" color="bg-[#FA2A55]" textColor="text-white" />
        <h2 className="font-mono text-2xl sm:text-3xl font-black uppercase text-[#0D2C54] tracking-tight mt-1">
          JURNAL RASA (EMOTION DIARY)
        </h2>
      </div>

      <WebtoonPanel sceneNumber="PANEL 01" title="APA YANG SEDANG KAMU RASAKAN?" accent="pink">
        <p className="font-sans text-xs text-[#0D2C54]/80 mb-3">
          Pilih satu atau beberapa emosi yang dominan menyapamu hari ini:
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {emosiOptions.map((e) => (
            <RisoTag
              key={e.label}
              label={e.label}
              emoji={e.emoji}
              selected={(data.jurnalEmosi.selectedEmosi || []).includes(e.label)}
              onClick={() => toggleEmosi(e.label)}
            />
          ))}
        </div>
      </WebtoonPanel>

      <WebtoonPanel sceneNumber="PANEL 02" title="PEMICU & KATA-KATA PIKIRAN" accent="blue">
        <div className="space-y-4">
          <div>
            <label className="font-mono text-xs font-bold uppercase text-[#0D2C54] block mb-1">
              1. Situasi Pemicu (Apa yang sedang terjadi?):
            </label>
            <RisoTextarea
              placeholder="Contoh: Mendapat nilai tugas di bawah ekspektasi, atau pesan WhatsApp belum dibalas seharian..."
              value={data.jurnalEmosi.situasi}
              onChange={(e) => updateData('jurnalEmosi', 'situasi', e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <label className="font-mono text-xs font-bold uppercase text-[#0D2C54] block mb-1">
              2. Kata-kata yang Melintas di Kepala (Praduga Otomatis):
            </label>
            <ThoughtBubble>
              <RisoInput
                placeholder="Misal: 'Aku memang bodoh', atau 'Mereka pasti membenciku'..."
                value={data.jurnalEmosi.pikiran}
                onChange={(e) => updateData('jurnalEmosi', 'pikiran', e.target.value)}
              />
            </ThoughtBubble>
          </div>
        </div>
      </WebtoonPanel>

      <WebtoonPanel sceneNumber="PANEL 03" title="SKALA INTENSITAS EMOSI (1 - 10)" accent="yellow">
        <div className="flex items-center justify-between font-mono text-xs font-bold mb-2">
          <span className="text-[#00A896]">1: Ringan / Tipis</span>
          <span className="px-3 py-1 bg-[#FA2A55] text-white rounded font-black text-sm shadow-[2px_2px_0px_#0D2C54]">
            LEVEL: {data.jurnalEmosi.intensitas}
          </span>
          <span className="text-[#FA2A55]">10: Sangat Meledak</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={data.jurnalEmosi.intensitas}
          onChange={(e) => updateData('jurnalEmosi', 'intensitas', parseInt(e.target.value, 10))}
          className="w-full accent-[#FA2A55] h-3 bg-white border-2 border-[#0D2C54] rounded-lg cursor-pointer"
        />
      </WebtoonPanel>

      <WebtoonPanel sceneNumber="PANEL 04" title="RESPON SAAT INI VS RESPON SEHAT" accent="teal">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-xs font-bold uppercase text-[#0D2C54] block mb-1">
              Apa yang kamu lakukan saat emosi itu muncul?
            </label>
            <RisoTextarea
              placeholder="Misal: Mengurung diri di kamar, membanting bantal, atau scrolling medsos tanpa henti..."
              value={data.jurnalEmosi.tindakan}
              onChange={(e) => updateData('jurnalEmosi', 'tindakan', e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <label className="font-mono text-xs font-bold uppercase text-[#00A896] block mb-1">
              Alternatif respon yang lebih aman/sehat:
            </label>
            <RisoTextarea
              placeholder="Misal: Minum air putih dingin, jalan kaki 10 menit, atau tulis uneg-uneg di buku ini..."
              value={data.jurnalEmosi.alternatif}
              onChange={(e) => updateData('jurnalEmosi', 'alternatif', e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </WebtoonPanel>
    </div>
  );
};

/* 4. KELOLA PIKIRAN (STOP & GROUNDING) */
const KelolaPikiran = ({ data, updateData }) => (
  <div className="space-y-6 animate-fade-in print-content">
    <div className="border-b-2 border-[#0D2C54] pb-2">
      <RisoBadge text="ANTI-OVERTHINKING" color="bg-[#00A896]" textColor="text-white" />
      <h2 className="font-mono text-2xl sm:text-3xl font-black uppercase text-[#0D2C54] tracking-tight mt-1">
        KELOLA PIKIRAN: PROTOKOL PENENANG
      </h2>
    </div>

    {/* Metode STOP */}
    <WebtoonPanel sceneNumber="TEKNIK 01" title="METODE S-T-O-P (REM DARURAT PIKIRAN)" accent="pink">
      <p className="font-sans text-xs text-[#0D2C54]/80 mb-4">
        Saat kepalamu terasa penuh atau mulai panik, gunakan empat langkah cepat ini:
      </p>
      <div className="grid sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3 bg-[#FAF7EE] border-2 border-[#0D2C54] rounded-lg shadow-[2px_2px_0px_#0D2C54]">
          <div className="text-xl font-black text-[#FA2A55] mb-1">S - STOP</div>
          <p className="font-sans text-[11px] text-[#0D2C54]">Hentikan apa pun yang sedang kamu lakukan sekarang.</p>
        </div>
        <div className="p-3 bg-[#FAF7EE] border-2 border-[#0D2C54] rounded-lg shadow-[2px_2px_0px_#0D2C54]">
          <div className="text-xl font-black text-[#00A896] mb-1">T - TAKE</div>
          <p className="font-sans text-[11px] text-[#0D2C54]">Tarik napas panjang dari hidung, hembuskan perlahan.</p>
        </div>
        <div className="p-3 bg-[#FAF7EE] border-2 border-[#0D2C54] rounded-lg shadow-[2px_2px_0px_#0D2C54]">
          <div className="text-xl font-black text-[#F9BC15] mb-1">O - OBSERVE</div>
          <p className="font-sans text-[11px] text-[#0D2C54]">Amati detak jantung dan sensasi tubuhmu tanpa menghakimi.</p>
        </div>
        <div className="p-3 bg-[#FAF7EE] border-2 border-[#0D2C54] rounded-lg shadow-[2px_2px_0px_#0D2C54]">
          <div className="text-xl font-black text-[#0D2C54] mb-1">P - PROCEED</div>
          <p className="font-sans text-[11px] text-[#0D2C54]">Lanjutkan tindakan dengan satu langkah kecil yang tenang.</p>
        </div>
      </div>
    </WebtoonPanel>

    {/* Uji Pikiran Realistis */}
    <WebtoonPanel sceneNumber="TEKNIK 02" title="MENANTANG ASUMSI NEGATIF" accent="yellow">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="font-mono text-xs font-bold uppercase text-[#FA2A55] block mb-1">
            ❌ Pikiran Buruk / Bencana yang Menghantui:
          </label>
          <RisoTextarea
            placeholder="Contoh: 'Kalau aku gagal ujian ini, masa depanku langsung tamat selamanya'..."
            value={data.kelolaPikiran.pikiranMuncul}
            onChange={(e) => updateData('kelolaPikiran', 'pikiranMuncul', e.target.value)}
            rows={3}
          />
        </div>
        <div>
          <label className="font-mono text-xs font-bold uppercase text-[#00A896] block mb-1">
            ✅ Cara Pandang Alternatif yang Lebih Adil & Realistis:
          </label>
          <RisoTextarea
            placeholder="Contoh: 'Ujian ini penting, tapi satu nilai tidak mendefinisikan masa depanku. Aku masih bisa memperbaikinya'..."
            value={data.kelolaPikiran.pikiranRealistis}
            onChange={(e) => updateData('kelolaPikiran', 'pikiranRealistis', e.target.value)}
            rows={3}
          />
        </div>
      </div>
    </WebtoonPanel>

    {/* Grounding 5-4-3-2-1 */}
    <WebtoonPanel sceneNumber="TEKNIK 03" title="TEKNIK GROUNDING PANCAINDRA 5-4-3-2-1" accent="blue">
      <p className="font-sans text-xs text-[#0D2C54]/80 mb-3">
        Kembalikan kesadaranmu ke ruangan saat ini dengan mengaktifkan pancaindra:
      </p>
      <div className="space-y-3 font-sans text-xs">
        <div>
          <label className="font-mono font-bold text-[#0D2C54] block mb-1">
            👀 5 Hal yang bisa kamu LIHAT di sekitarmu:
          </label>
          <RisoInput
            placeholder="Misal: Jam dinding, gantungan baju, daun jendela, buku, sepatu..."
            value={data.kelolaPikiran.lihat}
            onChange={(e) => updateData('kelolaPikiran', 'lihat', e.target.value)}
          />
        </div>
        <div>
          <label className="font-mono font-bold text-[#0D2C54] block mb-1">
            ✋ 4 Hal yang bisa kamu SENTUH atau rasakan di kulitmu:
          </label>
          <RisoInput
            placeholder="Misal: Tekstur selimut, dinginnya lantai, kancing kemeja, meja..."
            value={data.kelolaPikiran.sentuh}
            onChange={(e) => updateData('kelolaPikiran', 'sentuh', e.target.value)}
          />
        </div>
        <div>
          <label className="font-mono font-bold text-[#0D2C54] block mb-1">
            👂 3 Suara yang bisa kamu DENGAR sekarang:
          </label>
          <RisoInput
            placeholder="Misal: Kicau burung, desau angin kipas, dengung kendaraan jauh..."
            value={data.kelolaPikiran.dengar}
            onChange={(e) => updateData('kelolaPikiran', 'dengar', e.target.value)}
          />
        </div>
        <div>
          <label className="font-mono font-bold text-[#0D2C54] block mb-1">
            👃 2 Aroma yang bisa kamu CIUM:
          </label>
          <RisoInput
            placeholder="Misal: Aroma minyak angin, aroma sabun mandi, wangi teh..."
            value={data.kelolaPikiran.cium}
            onChange={(e) => updateData('kelolaPikiran', 'cium', e.target.value)}
          />
        </div>
        <div>
          <label className="font-mono font-bold text-[#0D2C54] block mb-1">
            👅 1 Rasa yang kamu KECAP atau 1 kalimat baik untuk diri:
          </label>
          <RisoInput
            placeholder="Misal: Rasa sisa pasta gigi, atau 'Aku aman dan aku bernapas'..."
            value={data.kelolaPikiran.rasakan}
            onChange={(e) => updateData('kelolaPikiran', 'rasakan', e.target.value)}
          />
        </div>
      </div>
    </WebtoonPanel>
  </div>
);

/* 5. KEKUATAN DIRI & SELF-COMPASSION */
const KekuatanDiri = ({ data, updateData }) => {
  const needsList = [
    'Tidur / Istirahat Cukup',
    'Minum Air & Makan Enak',
    'Ngobrol dengan Teman Baik',
    'Menangis Tanpa Dihakimi',
    'Jalan Kaki Menghirup Udara',
    'Detoks Medsos 1 Hari',
    'Pelukan / Kasih Sayang',
    'Waktu Sendiri Tanpa Gangguan',
  ];

  const toggleNeed = (need) => {
    const curr = data.kekuatanDiri.selectedNeeds || [];
    if (curr.includes(need)) {
      updateData('kekuatanDiri', 'selectedNeeds', curr.filter(i => i !== need));
    } else {
      updateData('kekuatanDiri', 'selectedNeeds', [...curr, need]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in print-content">
      <div className="border-b-2 border-[#0D2C54] pb-2">
        <RisoBadge text="SELF-COMPASSION" color="bg-[#F9BC15]" textColor="text-[#0D2C54]" />
        <h2 className="font-mono text-2xl sm:text-3xl font-black uppercase text-[#0D2C54] tracking-tight mt-1">
          KEKUATAN DIRI & WELAS ASIH
        </h2>
      </div>

      <WebtoonPanel sceneNumber="MODUL 01" title="3 HAL BAIK TENTANG DIRIKU HARI INI" accent="yellow">
        <p className="font-sans text-xs text-[#0D2C54]/80 mb-3">
          Tidak perlu hal megah. Upaya kecilmu untuk bertahan juga merupakan keberhasilan besar.
        </p>
        <div className="space-y-2.5">
          <RisoInput
            placeholder="1. Hari ini aku berhasil..."
            value={data.kekuatanDiri.halBaik1}
            onChange={(e) => updateData('kekuatanDiri', 'halBaik1', e.target.value)}
          />
          <RisoInput
            placeholder="2. Sifat baik yang kuapresiasi dari diriku..."
            value={data.kekuatanDiri.halBaik2}
            onChange={(e) => updateData('kekuatanDiri', 'halBaik2', e.target.value)}
          />
          <RisoInput
            placeholder="3. Kebaikan kecil yang kulakukan untuk orang lain/diri sendiri..."
            value={data.kekuatanDiri.halBaik3}
            onChange={(e) => updateData('kekuatanDiri', 'halBaik3', e.target.value)}
          />
        </div>
      </WebtoonPanel>

      <WebtoonPanel sceneNumber="MODUL 02" title="BUKTI KETANGGUHAN MASA LALU" accent="pink">
        <label className="font-mono text-xs font-bold uppercase text-[#0D2C54] block mb-1">
          Satu masa sulit yang pernah berhasil kamu lalui:
        </label>
        <RisoTextarea
          placeholder="Tuliskan pengalaman berat yang dulu kamu kira tak sanggup kamu lewati, namun nyatanya kamu berhasil sampai hari ini..."
          value={data.kekuatanDiri.halBerat}
          onChange={(e) => updateData('kekuatanDiri', 'halBerat', e.target.value)}
          rows={3}
        />
        <NarratorBox chapter="INGATAN PENTING">
          Kekuatan itu ada di dalam dirimu saat itu. Kekuatan yang sama masih ada bersamamu sekarang.
        </NarratorBox>
      </WebtoonPanel>

      <WebtoonPanel sceneNumber="MODUL 03" title="GANTI SUARA MENYALAHKAN DIRI" accent="blue">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-xs font-bold uppercase text-[#FA2A55] block mb-1">
              Saat kamu merasa down / gagal, apa kata kasarmu?
            </label>
            <RisoTextarea
              placeholder="Contoh: 'Kenapa sih aku selalu payah dan bikin kecewa orang?'..."
              value={data.kekuatanDiri.selfTalkDown}
              onChange={(e) => updateData('kekuatanDiri', 'selfTalkDown', e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <label className="font-mono text-xs font-bold uppercase text-[#00A896] block mb-1">
              Bagaimana jika sahabatmu yang mengatakannya? Apa kalimat lembutmu?
            </label>
            <RisoTextarea
              placeholder="Contoh: 'Wajar kamu sedih hari ini. Kamu sudah berusaha keras, istirahatlah dulu'..."
              value={data.kekuatanDiri.selfTalkRamah}
              onChange={(e) => updateData('kekuatanDiri', 'selfTalkRamah', e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </WebtoonPanel>

      <WebtoonPanel sceneNumber="MODUL 04" title="CHECKLIST KEBUTUHAN BATIN SAAT INI" accent="teal">
        <p className="font-sans text-xs text-[#0D2C54]/80 mb-3">
          Centang apa yang paling dibutuhkan oleh jiwa dan ragamu sekarang:
        </p>
        <div className="grid sm:grid-cols-2 gap-2">
          {needsList.map((need) => {
            const isChecked = (data.kekuatanDiri.selectedNeeds || []).includes(need);
            return (
              <button
                key={need}
                type="button"
                onClick={() => toggleNeed(need)}
                className={`flex items-center gap-2 p-2.5 rounded-lg border-2 text-left font-mono text-xs transition-all ${
                  isChecked
                    ? 'bg-[#00A896] text-white border-[#0D2C54] shadow-[2px_2px_0px_#0D2C54]'
                    : 'bg-white text-[#0D2C54] border-[#0D2C54] hover:bg-[#FAF7EE]'
                }`}
              >
                <span>{isChecked ? '☑' : '☐'}</span>
                <span>{need}</span>
              </button>
            );
          })}
        </div>
      </WebtoonPanel>
    </div>
  );
};

/* 6. KESEHARIAN & EVALUASI */
const Keseharian = ({ data, updateData }) => {
  const habits = [
    'Langsung cek HP dalam 10 menit pertama setelah bangun tidur',
    'Scrolling medsos tanpa tujuan lebih dari 2 jam',
    'Menunda tidur larut malam demi menonton layar HP',
    'Merasa iri / rendah diri setelah melihat status orang lain',
    'Merasa cemas jika HP tidak ada di genggaman tangan',
  ];

  const toggleHabit = (h) => {
    const curr = data.keseharian.digitalHabits || [];
    if (curr.includes(h)) {
      updateData('keseharian', 'digitalHabits', curr.filter(i => i !== h));
    } else {
      updateData('keseharian', 'digitalHabits', [...curr, h]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in print-content">
      <div className="border-b-2 border-[#0D2C54] pb-2">
        <RisoBadge text="RUTINITAS" color="bg-[#0D2C54]" textColor="text-white" />
        <h2 className="font-mono text-2xl sm:text-3xl font-black uppercase text-[#0D2C54] tracking-tight mt-1">
          KESEHARIAN & DIGITAL WELLBEING
        </h2>
      </div>

      {/* Syukur Harian */}
      <WebtoonPanel sceneNumber="HARIAN 01" title="JURNAL RASA SYUKUR (GRATITUDE)" accent="yellow">
        <p className="font-sans text-xs text-[#0D2C54]/80 mb-3">
          Tuliskan 3 hal kecil hari ini yang membuat hatimu merasa hangat:
        </p>
        <div className="space-y-2.5">
          <RisoInput
            placeholder="1. Makanan enak / cuaca teduh / senyuman orang..."
            value={data.keseharian.syukur1}
            onChange={(e) => updateData('keseharian', 'syukur1', e.target.value)}
          />
          <RisoInput
            placeholder="2. Obrolan lucu / lagu yang enak didengar..."
            value={data.keseharian.syukur2}
            onChange={(e) => updateData('keseharian', 'syukur2', e.target.value)}
          />
          <RisoInput
            placeholder="3. Satu hal yang patut dirayakan hari ini..."
            value={data.keseharian.syukur3}
            onChange={(e) => updateData('keseharian', 'syukur3', e.target.value)}
          />
        </div>
      </WebtoonPanel>

      {/* Lingkaran Kontrol */}
      <WebtoonPanel sceneNumber="HARIAN 02" title="LINGKARAN KENDALI (CIRCLE OF CONTROL)" accent="blue">
        <div className="space-y-3">
          <div>
            <label className="font-mono text-xs font-bold uppercase text-[#0D2C54] block mb-1">
              Situasi yang sedang membuatmu tertekan:
            </label>
            <RisoInput
              placeholder="Contoh: Gosip di sekolah / tugas kelompok yang menumpuk..."
              value={data.keseharian.stressSituasi}
              onChange={(e) => updateData('keseharian', 'stressSituasi', e.target.value)}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs font-bold uppercase text-[#FA2A55] block mb-1">
                🚫 Di Luar Kendaliku (Lepaskan):
              </label>
              <RisoTextarea
                placeholder="Perkataan orang lain, sikap teman, keputusan guru, masa lalu..."
                value={data.keseharian.stressKontrol}
                onChange={(e) => updateData('keseharian', 'stressKontrol', e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <label className="font-mono text-xs font-bold uppercase text-[#00A896] block mb-1">
                🎯 Di Dalam Kendaliku (Fokuskan):
              </label>
              <RisoTextarea
                placeholder="Waktu tidurku, kata-kata yang kuucapkan, usahaku, batasan privasiku..."
                value={data.keseharian.stressLangkah}
                onChange={(e) => updateData('keseharian', 'stressLangkah', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>
      </WebtoonPanel>

      {/* Digital Wellbeing */}
      <WebtoonPanel sceneNumber="HARIAN 03" title="EVALUASI KEBIASAAN LAYAR SMARTPHONE" accent="pink">
        <p className="font-sans text-xs text-[#0D2C54]/80 mb-3">
          Centang kebiasaan yang sering kamu alami belakangan ini:
        </p>
        <div className="space-y-2 mb-4">
          {habits.map((h) => {
            const isChecked = (data.keseharian.digitalHabits || []).includes(h);
            return (
              <button
                key={h}
                type="button"
                onClick={() => toggleHabit(h)}
                className={`w-full flex items-center gap-2 p-2.5 rounded-lg border-2 text-left font-mono text-xs transition-all ${
                  isChecked
                    ? 'bg-[#FA2A55] text-white border-[#0D2C54] shadow-[2px_2px_0px_#0D2C54]'
                    : 'bg-white text-[#0D2C54] border-[#0D2C54] hover:bg-[#FAF7EE]'
                }`}
              >
                <span>{isChecked ? '☑' : '☐'}</span>
                <span>{h}</span>
              </button>
            );
          })}
        </div>

        <div>
          <label className="font-mono text-xs font-bold uppercase text-[#0D2C54] block mb-1">
            Batas Layar Sehat yang Ingin Kucoba Mulai Minggu Ini:
          </label>
          <RisoInput
            placeholder="Contoh: Menaruh HP di luar kamar saat tidur, atau stop medsos setelah jam 9 malam..."
            value={data.keseharian.batasDigital}
            onChange={(e) => updateData('keseharian', 'batasDigital', e.target.value)}
          />
        </div>
      </WebtoonPanel>
    </div>
  );
};

/* 7. SUPPORT CIRCLE & RENCANA */
const Support = ({ data, updateData }) => (
  <div className="space-y-6 animate-fade-in print-content">
    <div className="border-b-2 border-[#0D2C54] pb-2">
      <RisoBadge text="LINGKARAN AMAN" color="bg-[#FA2A55]" textColor="text-white" />
      <h2 className="font-mono text-2xl sm:text-3xl font-black uppercase text-[#0D2C54] tracking-tight mt-1">
        SUPPORT CIRCLE & AKSI NYATA
      </h2>
    </div>

    {/* Teman Sehat vs Waspada */}
    <WebtoonPanel sceneNumber="CIRCLE 01" title="NAVIGASI PERTEMANAN: SEHAT VS WASPADA" accent="blue">
      <div className="grid sm:grid-cols-2 gap-4 text-xs font-sans">
        <div className="p-3.5 bg-[#E6F8F6] border-2 border-[#00A896] rounded-lg">
          <span className="font-mono font-bold text-[#00A896] block mb-1.5">💚 CIRI TEMAN SEHAT (GREEN FLAGS):</span>
          <ul className="list-disc list-inside space-y-1 text-[#0D2C54]">
            <li>Mendengarkan tanpa langsung menghakimi</li>
            <li>Menghargai batasan (*boundaries*) dan kata 'tidak'-mu</li>
            <li>Ikut bahagia saat kamu mencapai hal baik</li>
            <li>Bisa diajak bicara jujur dan saling mendukung</li>
          </ul>
        </div>
        <div className="p-3.5 bg-[#FFF0F3] border-2 border-[#FA2A55] rounded-lg">
          <span className="font-mono font-bold text-[#FA2A55] block mb-1.5">🚩 CIRI PERLU WASPADA (RED FLAGS):</span>
          <ul className="list-disc list-inside space-y-1 text-[#0D2C54]">
            <li>Meremehkan atau menertawakan masalah batinmu</li>
            <li>Suka menyebarkan rahasiamu ke orang lain</li>
            <li>Membuatmu merasa bersalah jika tidak menuruti maunya</li>
            <li>Hanya datang saat butuh bantuanmu saja</li>
          </ul>
        </div>
      </div>
    </WebtoonPanel>

    {/* Dua Orang Terpercaya */}
    <WebtoonPanel sceneNumber="CIRCLE 02" title="DAFTAR ORANG TERPERCAYA (SAFE HAVEN)" accent="pink">
      <p className="font-sans text-xs text-[#0D2C54]/80 mb-3">
        Tuliskan 2 nama orang yang membuatmu merasa aman untuk bercerita apa adanya:
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="p-3.5 bg-white border-2 border-[#0D2C54] rounded-lg shadow-[2px_2px_0px_#0D2C54]">
          <span className="font-mono text-xs font-bold text-[#FA2A55] block mb-2">ORANG TERPERCAYA 1:</span>
          <div className="space-y-2">
            <RisoInput
              placeholder="Nama / Hubungan (Misal: Sahabat / Kakak)"
              value={data.support.cerita1Nama}
              onChange={(e) => updateData('support', 'cerita1Nama', e.target.value)}
            />
            <RisoInput
              placeholder="Kapan & cara menghubunginya (Misal: Chat WA malam hari)"
              value={data.support.cerita1Waktu}
              onChange={(e) => updateData('support', 'cerita1Waktu', e.target.value)}
            />
          </div>
        </div>

        <div className="p-3.5 bg-white border-2 border-[#0D2C54] rounded-lg shadow-[2px_2px_0px_#0D2C54]">
          <span className="font-mono text-xs font-bold text-[#00A896] block mb-2">ORANG TERPERCAYA 2:</span>
          <div className="space-y-2">
            <RisoInput
              placeholder="Nama / Hubungan (Misal: Ibu / Guru BK / Konselor)"
              value={data.support.cerita2Nama}
              onChange={(e) => updateData('support', 'cerita2Nama', e.target.value)}
            />
            <RisoInput
              placeholder="Kapan & cara menghubunginya"
              value={data.support.cerita2Waktu}
              onChange={(e) => updateData('support', 'cerita2Waktu', e.target.value)}
            />
          </div>
        </div>
      </div>
    </WebtoonPanel>

    {/* Rencana Aksi Harian */}
    <WebtoonPanel sceneNumber="CIRCLE 03" title="RENCANA AKSI KECIL 24 JAM KE DEPAN" accent="yellow">
      <div className="space-y-3">
        <div>
          <label className="font-mono text-xs font-bold uppercase text-[#00A896] block mb-1">
            + 1 Kebiasaan Sehat yang Ingin Kutingkatkan:
          </label>
          <RisoInput
            placeholder="Contoh: Minum 2 liter air / tidur sebelum jam 11..."
            value={data.support.rencanaTingkatkan}
            onChange={(e) => updateData('support', 'rencanaTingkatkan', e.target.value)}
          />
        </div>
        <div>
          <label className="font-mono text-xs font-bold uppercase text-[#FA2A55] block mb-1">
            - 1 Kebiasaan Kurang Sehat yang Ingin Kukurangi:
          </label>
          <RisoInput
            placeholder="Contoh: Mengeluh di status medsos / begadang main game..."
            value={data.support.rencanaKurangi}
            onChange={(e) => updateData('support', 'rencanaKurangi', e.target.value)}
          />
        </div>
        <div>
          <label className="font-mono text-xs font-bold uppercase text-[#F9BC15] block mb-1">
            ★ 1 Aktivitas Menyenangkan untuk Self-Care Hari Ini:
          </label>
          <RisoInput
            placeholder="Contoh: Menggambar, mendengarkan album lagu favorit, atau makan es krim..."
            value={data.support.rencanaAktivitas}
            onChange={(e) => updateData('support', 'rencanaAktivitas', e.target.value)}
          />
        </div>
      </div>
    </WebtoonPanel>
  </div>
);

/* ========================================================================= */
/* --- MAIN COMPONENT: RISOGRAPH APP --- */
/* ========================================================================= */

export default function RisographApp({
  formData: propFormData,
  updateData: propUpdateData,
  activeTab: propActiveTab,
  setActiveTab: propSetActiveTab,
  onSelectStyle,
  currentStyle = 4,
  handleReset: propHandleReset
}) {
  const [localActiveTab, setLocalActiveTab] = useState('beranda');
  const [localFormData, setLocalFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultData, ...parsed };
      }
    } catch (e) {
      console.error('Failed to parse saved data', e);
    }
    return defaultData;
  });

  const formData = propFormData || localFormData;
  const activeTab = propActiveTab || localActiveTab;
  const setActiveTab = propSetActiveTab || setLocalActiveTab;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [printAll, setPrintAll] = useState(false);

  useEffect(() => {
    if (!propFormData) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      } catch (e) {
        console.error('Failed to save data', e);
      }
    }
  }, [formData, propFormData]);

  const updateData = propUpdateData || ((section, field, value) => {
    setLocalFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  });

  const handleReset = propHandleReset || (() => {
    if (window.confirm('Yakin ingin mereset seluruh isi catatan? Data tidak bisa dikembalikan.')) {
      setLocalFormData(defaultData);
      localStorage.removeItem(STORAGE_KEY);
    }
  });

  const tabs = [
    { id: 'beranda', label: 'Cover & Profil', icon: '📖', badge: 'VOL.1' },
    { id: 'bacaan', label: 'Pojok Baca Remaja', icon: '📚', badge: '3 BAB' },
    { id: 'emosi', label: 'Jurnal Emosi Harian', icon: '🤝', badge: 'DIARY' },
    { id: 'pikiran', label: 'Kelola Pikiran Negatif', icon: '🧠', badge: 'S-T-O-P' },
    { id: 'kekuatan', label: 'Kekuatan Batin Diri', icon: '✨', badge: 'SURVIVE' },
    { id: 'keseharian', label: 'Habit & Stress Check', icon: '📴', badge: 'DAILY' },
    { id: 'support', label: 'Support & Rencana Hidup', icon: '👥', badge: 'ACTION' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'beranda': return <Beranda data={formData} updateData={updateData} />;
      case 'materi':
      case 'bacaan': return <Materi />;
      case 'emosi': return <JurnalEmosi data={formData} updateData={updateData} />;
      case 'pikiran': return <KelolaPikiran data={formData} updateData={updateData} />;
      case 'kekuatan': return <KekuatanDiri data={formData} updateData={updateData} />;
      case 'keseharian': return <Keseharian data={formData} updateData={updateData} />;
      case 'support': return <Support data={formData} updateData={updateData} />;
      default: return <Beranda data={formData} updateData={updateData} />;
    }
  };

  const handlePrintCurrent = () => {
    setPrintAll(false);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handlePrintFullWorkbook = () => {
    setPrintAll(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => setPrintAll(false), 500);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-[#FAF7EE] text-[#0D2C54] font-sans selection:bg-[#FA2A55] selection:text-white flex flex-col md:flex-row print-layout">
      {/* Background Halftone Screen Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-5 z-0"
        style={{
          backgroundImage: 'radial-gradient(#0D2C54 1.5px, transparent 1.5px)',
          backgroundSize: '16px 16px'
        }}
      />

      {/* Mobile Top Header */}
      <div className="md:hidden border-b-3 border-[#0D2C54] bg-[#FFFDF9] p-4 flex justify-between items-center sticky top-0 z-50 no-print shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded bg-[#FA2A55] border-2 border-[#0D2C54] flex items-center justify-center text-white font-mono font-black text-xs">
            RZ
          </span>
          <div>
            <h1 className="font-mono font-black text-sm uppercase tracking-tight text-[#0D2C54]">RISO ZINE EDITION</h1>
            <p className="text-[10px] font-mono text-[#FA2A55]">RUANG TUMBUH PRESS</p>
          </div>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="border-2 border-[#0D2C54] px-3 py-1 rounded bg-[#F9BC15] font-mono font-black text-xs shadow-[2px_2px_0px_#0D2C54]"
        >
          {isMobileMenuOpen ? '✖ TUTUP' : '☰ MENU'}
        </button>
      </div>

      {/* Sidebar Risograph Navigation */}
      <nav className={`
        ${isMobileMenuOpen ? 'block' : 'hidden'} 
        md:flex flex-col w-full md:w-80 shrink-0 bg-[#FFFDF9] border-r-3 border-[#0D2C54] p-5 md:sticky md:top-0 md:h-screen md:overflow-y-auto z-40
        absolute md:relative left-0 top-[60px] md:top-0 h-[calc(100vh-60px)] border-b-3 md:border-b-0 no-print shadow-lg
      `}>
        {/* Zine Masthead */}
        <div className="hidden md:block mb-6 relative">
          <div className="bg-[#0D2C54] text-[#FAF7EE] border-2 border-[#FA2A55] p-4 rounded-xl shadow-[4px_4px_0px_#FA2A55] -rotate-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#F9BC15] mb-1">
              <span>VOL. 01 // 2026</span>
              <span>INDIE ZINE</span>
            </div>
            <h1 className="font-mono text-2xl font-black uppercase leading-none tracking-tight">
              RISOGRAPH
            </h1>
            <p className="font-mono text-[11px] font-bold text-[#FA2A55] uppercase mt-1">
              ★ Mental Health Zine ★
            </p>
          </div>
          <RegistrationMark className="absolute -top-3 -right-2" />
        </div>

        {/* Tab Navigation List */}
        <ul className="space-y-2 flex-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <li key={tab.id}>
                <button
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left font-mono text-xs uppercase px-3 py-2.5 rounded-lg border-2 transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-[#FA2A55] text-white border-[#0D2C54] shadow-[3px_3px_0px_#0D2C54] -translate-y-0.5'
                      : 'bg-white text-[#0D2C54] border-[#0D2C54]/60 hover:border-[#0D2C54] hover:bg-[#FAF7EE] shadow-[1px_1px_0px_#0D2C54]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{tab.icon}</span>
                    <span className="font-bold">{tab.label}</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive ? 'bg-[#0D2C54] text-[#FAF7EE]' : 'bg-[#FAF7EE] text-[#0D2C54] border border-[#0D2C54]/30'
                  }`}>
                    {tab.badge}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Action Controls & Style Switcher */}
        <div className="mt-6 pt-4 border-t-2 border-dashed border-[#0D2C54]/30 space-y-2.5">
          <button 
            onClick={handlePrintCurrent}
            className="w-full flex items-center justify-center gap-2 border-2 border-[#0D2C54] rounded-lg py-2 px-3 font-mono font-black uppercase bg-[#00A896] text-white hover:bg-[#008f80] transition-colors shadow-[2px_2px_0px_#0D2C54] text-xs"
          >
            🖨️ Cetak Tab Ini
          </button>
          <button 
            onClick={handlePrintFullWorkbook}
            className="w-full flex items-center justify-center gap-2 border-2 border-[#0D2C54] rounded-lg py-2 px-3 font-mono font-black uppercase bg-[#0D2C54] text-[#FAF7EE] hover:bg-[#153e70] transition-colors shadow-[2px_2px_0px_#FA2A55] text-xs"
          >
            📑 Cetak Seluruh Zine
          </button>

          {/* Style Switchers */}
          <div className="pt-2 border-t-2 border-dashed border-[#0D2C54]/30 space-y-2">
            <div className="text-[10px] font-mono text-[#0D2C54] uppercase font-bold flex items-center justify-between">
              <span>🖨️ GAYA DESAIN:</span>
              <span className="bg-[#FA2A55] text-white px-1.5 py-0.2 rounded text-[9px] font-bold">Style 4 Aktif</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 font-mono">
              <button 
                type="button"
                onClick={() => onSelectStyle ? onSelectStyle(1) : (window.location.href = './index.html')}
                className="w-full flex items-center justify-center gap-1 border-2 border-[#0D2C54] rounded-lg py-1.5 px-1 font-bold uppercase bg-[#FFE066] text-black hover:opacity-90 transition-all text-[11px] shadow-[2px_2px_0px_#0D2C54]"
              >
                <span>⚡ Style 1</span>
              </button>

              <button 
                type="button"
                onClick={() => onSelectStyle ? onSelectStyle(2) : (window.location.href = './scrapbook.html')}
                className="w-full flex items-center justify-center gap-1 border-2 border-[#0D2C54] rounded-lg py-1.5 px-1 font-bold uppercase bg-[#FFE5D9] text-[#4a3525] hover:opacity-90 transition-all text-[11px] shadow-[2px_2px_0px_#0D2C54]"
              >
                <span>📓 Style 2</span>
              </button>

              <button 
                type="button"
                onClick={() => onSelectStyle ? onSelectStyle(3) : (window.location.href = './memphis.html')}
                className="w-full flex items-center justify-center gap-1 border-2 border-[#0D2C54] rounded-lg py-1.5 px-1 font-bold uppercase bg-[#06D6A0] text-black hover:opacity-90 transition-all text-[11px] shadow-[2px_2px_0px_#0D2C54]"
              >
                <span>🎨 Style 3</span>
              </button>

              <button 
                type="button"
                onClick={() => onSelectStyle ? onSelectStyle(4) : null}
                className="w-full flex items-center justify-center gap-1 border-2 border-[#0D2C54] rounded-lg py-1.5 px-1 font-bold uppercase bg-[#0D2C54] text-[#00F0FF] shadow-none text-[11px]"
              >
                <span>🖨️ Style 4</span>
              </button>
            </div>
          </div>

          <div className="p-2.5 bg-[#FAF7EE] border border-[#0D2C54] rounded-lg text-[10px] font-mono text-center text-[#0D2C54]">
            🔒 Data tersimpan otomatis di localStorage browser.
          </div>

          <button 
            onClick={handleReset}
            className="w-full text-[11px] font-mono text-[#FA2A55] hover:underline text-center pt-1 block font-bold"
          >
            Reset Seluruh Jawaban
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto print-area relative">
        <div className="max-w-3xl mx-auto">
          {printAll ? (
            <div className="space-y-12">
              <Beranda data={formData} updateData={updateData} />
              <Materi />
              <JurnalEmosi data={formData} updateData={updateData} />
              <KelolaPikiran data={formData} updateData={updateData} />
              <KekuatanDiri data={formData} updateData={updateData} />
              <Keseharian data={formData} updateData={updateData} />
              <Support data={formData} updateData={updateData} />
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </main>
    </div>
  );
}
