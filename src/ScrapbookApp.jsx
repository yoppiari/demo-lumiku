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

/* --- SCRAPBOOK ATOMS & DECORATIONS --- */

// Pita / Washi tape dekoratif
const WashiTape = ({ color = "bg-[#fcd5ce]/85", className = "", rotate = "-rotate-2" }) => (
  <div 
    className={`h-6 w-24 ${color} backdrop-blur-[1px] opacity-90 shadow-xs border-y border-black/10 pointer-events-none ${rotate} ${className}`}
    style={{
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      clipPath: 'polygon(0% 5%, 3% 0%, 97% 0%, 100% 5%, 98% 95%, 95% 100%, 2% 100%, 0% 95%)'
    }}
  />
);

// Pin / Thumbtack dekoratif
const Thumbtack = ({ color = "text-rose-500", className = "" }) => (
  <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 select-none filter drop-shadow-md text-2xl ${className}`}>
    📌
  </div>
);

// Paperclip dekoratif
const Paperclip = ({ className = "" }) => (
  <div className={`absolute -top-3.5 right-6 z-20 select-none filter drop-shadow-sm text-2xl rotate-12 ${className}`}>
    📎
  </div>
);

// Kartu Scrapbook / Sticky note
const ScrapCard = ({ 
  children, 
  bgColor = "bg-[#fffdf7]", 
  className = "", 
  tape = true, 
  tapeColor = "bg-[#fcd5ce]/80", 
  tapeRotate = "-rotate-1",
  pin = false,
  clip = false,
  tilt = ""
}) => (
  <div className={`relative ${bgColor} p-6 sm:p-7 rounded-2xl shadow-[4px_6px_20px_rgba(78,52,46,0.08)] border border-[#e8dfd5] transition-all hover:shadow-[6px_10px_25px_rgba(78,52,46,0.12)] ${tilt} ${className}`}>
    {pin && <Thumbtack />}
    {clip && <Paperclip />}
    {tape && !pin && (
      <WashiTape color={tapeColor} rotate={tapeRotate} className="absolute -top-3 left-1/2 -translate-x-1/2" />
    )}
    {children}
  </div>
);

// Input gaya tulisan tangan di atas kertas bergaris
const ScrapInput = ({ placeholder, value = "", onChange, className = "", ...props }) => (
  <input 
    type="text" 
    placeholder={placeholder} 
    value={value ?? ""}
    onChange={onChange}
    {...props}
    className={`w-full bg-[#fefcf8] border-b-2 border-dashed border-[#b8a593] focus:border-solid focus:border-[#7d5a42] px-3 py-2 font-hand text-xl text-[#3d2f25] placeholder:text-[#b8aa9f] focus:outline-none transition-colors ${className}`} 
  />
);

// Textarea gaya buku harian bergaris
const ScrapTextArea = ({ placeholder, rows = 3, value = "", onChange, className = "", ...props }) => (
  <textarea 
    rows={rows}
    placeholder={placeholder} 
    value={value ?? ""}
    onChange={onChange}
    {...props}
    className={`w-full bg-[#fdfbf7] rounded-xl p-4 font-hand text-xl text-[#3a2d24] placeholder:text-[#b8aa9f] focus:outline-none border-2 border-dashed border-[#d5c7b9] focus:border-[#8b5e3c] focus:bg-[#fffefb] shadow-inner transition-colors resize-none leading-relaxed ${className}`} 
  />
);

// Sticker Pill untuk emosi / tag
const StickerPill = ({ label, selected, onClick, emoji = "✨", activeColor = "bg-[#ffe082]" }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-base font-hand font-bold border-2 transition-all transform active:scale-95 select-none
      ${selected 
        ? `${activeColor} border-[#7c5335] text-[#3e230e] shadow-[2px_3px_8px_rgba(124,83,53,0.25)] -translate-y-0.5 scale-105 rotate-1` 
        : 'bg-white/90 border-[#ded3c7] text-[#6b584a] hover:bg-[#fff9ef] hover:border-[#b8a593] hover:rotate-1'}`}
  >
    <span>{emoji}</span>
    <span>{label}</span>
  </button>
);

/* --- SECTIONS / MODUL --- */

const Beranda = ({ data, updateData }) => (
  <div className="space-y-8 animate-fade-in print-content">
    {/* Cover Header Scrapbook */}
    <div className="relative bg-[#ffe5d9] p-8 sm:p-12 rounded-3xl border-2 border-dashed border-[#d4a373] shadow-[5px_8px_25px_rgba(78,52,46,0.12)] text-center overflow-hidden">
      <WashiTape color="bg-[#b7e4c7]/90" rotate="-rotate-3" className="absolute -top-1 left-8 w-28" />
      <WashiTape color="bg-[#fbcfe8]/90" rotate="rotate-4" className="absolute -top-1 right-8 w-28" />
      
      <div className="inline-block bg-[#faedcd] px-4 py-1.5 rounded-full border border-[#d4a373] text-sm font-hand font-bold text-[#6b4a2a] mb-3 -rotate-1 shadow-xs">
        📖 Jurnal Edukasi & Self-Care Remaja
      </div>
      
      <h1 className="text-4xl sm:text-6xl font-serifHand font-bold text-[#4a3525] tracking-tight leading-tight mb-3">
        Kesehatan Mental Remaja
      </h1>
      
      <p className="text-xl sm:text-2xl font-hand text-[#6b4e3d] max-w-xl mx-auto border-t-2 border-dashed border-[#d4a373] pt-4 mt-2">
        ✨ Kenali diri • Kelola emosi • Bangun hidup yang lebih baik ✨
      </p>

      {/* Doodle stiker dekorasi */}
      <span className="absolute bottom-4 left-4 text-3xl opacity-80 select-none">🌿</span>
      <span className="absolute bottom-4 right-4 text-3xl opacity-80 select-none">🌸</span>
    </div>

    {/* Profil & Disclaimer Grid */}
    <div className="grid md:grid-cols-2 gap-8">
      {/* Polaroid / Kartu Profil */}
      <ScrapCard bgColor="bg-[#fff9db]" tilt="-rotate-1" tapeColor="bg-[#bde0fe]/85" tapeRotate="rotate-2">
        <div className="flex items-center justify-between border-b-2 border-dashed border-[#e9d8a6] pb-3 mb-4">
          <h2 className="text-2xl font-serifHand font-bold text-[#5c4033] flex items-center gap-2">
            🏷️ Lembar Pemilik
          </h2>
          <span className="text-xs font-hand text-[#8b725c] bg-white/80 px-2 py-0.5 rounded border border-[#e9d8a6]">
            Pribadi & Rahasia
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="font-hand font-bold text-lg text-[#5c4033] block mb-1">
              Nama Panggilan:
            </label>
            <ScrapInput 
              placeholder="Tulis namamu di sini..." 
              value={data.profile.nama}
              onChange={(e) => updateData('profile', 'nama', e.target.value)}
            />
          </div>
          <div>
            <label className="font-hand font-bold text-lg text-[#5c4033] block mb-1">
              Kelas / Usia:
            </label>
            <ScrapInput 
              placeholder="Berapa usiamu sekarang?" 
              value={data.profile.usia}
              onChange={(e) => updateData('profile', 'usia', e.target.value)}
            />
          </div>
        </div>
      </ScrapCard>

      {/* Note Disclaimer */}
      <ScrapCard bgColor="bg-[#fdf0ed]" tilt="rotate-1" pin={true} className="border-rose-200">
        <h2 className="text-2xl font-serifHand font-bold text-rose-800 mb-2 flex items-center gap-2">
          🛡️ Ruang Aman (Disclaimer)
        </h2>
        <p className="font-hand text-lg text-rose-900/90 leading-relaxed">
          Buku jurnal ini adalah sarana edukasi diri (*self-help*) untuk berlatih sehari-hari, bukan pengganti diagnosis maupun penanganan profesional medis/psikologis.
        </p>
        <p className="font-hand text-lg text-rose-900/90 font-bold mt-3 bg-white/70 p-3 rounded-xl border border-rose-200">
          💛 Jika perasaan atau beban terasa terlalu berat, ceritakan kepada orang dewasa yang kamu percaya atau tenaga profesional. Kamu tidak harus sendirian.
        </p>
      </ScrapCard>
    </div>

    {/* Petunjuk Penggunaan Lembar Jurnal */}
    <ScrapCard bgColor="bg-[#e8f5e9]" clip={true} className="border-emerald-200">
      <h3 className="text-2xl font-serifHand font-bold text-emerald-900 mb-2">
        🌿 Cara Menikmati Workbook Ini
      </h3>
      <ul className="font-hand text-xl text-emerald-900 space-y-2 list-none">
        <li className="flex items-start gap-2">
          <span>☕</span>
          <span><strong>Buku ini adalah temanmu:</strong> Buka kapan saja sesuai suasana hatimu, tanpa perlu terburu-buru menyelesaikannya sekaligus.</span>
        </li>
        <li className="flex items-start gap-2">
          <span>🎨</span>
          <span><strong>Tulis sejujurnya:</strong> Tidak ada penilaian benar atau salah. Ini adalah kanvas aman bagi pikiranmu.</span>
        </li>
        <li className="flex items-start gap-2">
          <span>🔒</span>
          <span><strong>Privat & Tersimpan:</strong> Isianmu langsung tersimpan aman di browsermu dan siap kamu cetak kapan pun kamu mau.</span>
        </li>
      </ul>
    </ScrapCard>
  </div>
);

const MateriBacaan = () => {
  const [activeArticle, setActiveArticle] = useState(null);

  const articles = [
    {
      id: 1,
      tag: "Modul 01",
      sticker: "🧠",
      tapeColor: "bg-[#fbcfe8]/80",
      title: "Mengenal Kesehatan Mental",
      bgColor: "bg-[#fff1f2]",
      borderColor: "border-pink-200",
      excerpt: "Mental yang sehat bukan berarti kamu harus selalu merasa bahagia sepanjang waktu.",
      content: (
        <div className="space-y-4 font-hand text-xl text-[#4a3525] leading-relaxed">
          <p>Mental yang sehat bukan berarti kamu harus selalu bahagia atau tersenyum setiap saat. Kamu sepenuhnya boleh dan manusiawi saat merasa sedih, kecewa, marah, takut, maupun cemas.</p>
          <p>Hal yang paling berharga adalah belajar menyadari emosi tersebut saat hadir, mengekspresikannya dengan cara yang aman bagi dirimu dan sekitar, serta tahu kapan saatnya meminta rangkulan atau bantuan.</p>
          <div className="bg-[#fff9db] p-4 rounded-xl border-2 border-dashed border-[#e9d8a6] mt-4 rotate-[-0.5deg]">
            <strong className="text-[#5c4033] block mb-1">💡 Pengingat Hangat:</strong>
            Sama seperti tubuh kita yang sesekali bisa terkena flu atau lelah, pikiran dan batin kita pun wajar merasakan letih dan berhak mendapat waktu istirahat yang cukup.
          </div>
        </div>
      )
    },
    {
      id: 2,
      tag: "Modul 02",
      sticker: "🔋",
      tapeColor: "bg-[#bbf7d0]/80",
      title: "Pikiranmu Seperti Baterai HP",
      bgColor: "bg-[#f0fdf4]",
      borderColor: "border-green-200",
      excerpt: "Apa yang terjadi kalau aplikasi berjalan terlalu banyak dan tidak pernah diisi daya?",
      content: (
        <div className="space-y-6 font-hand text-xl text-[#334125]">
          <p className="leading-relaxed">Bayangkan smartphone-mu yang terus membuka puluhan aplikasi berat bersamaan, layarnya menyala terus, dan colokan charger-nya diabaikan. HP pasti cepat panas, melambat, bahkan tiba-tiba mati kehabisan daya. Batin dan pikiranmu bekerja dengan cara yang sangat mirip!</p>
          
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="bg-[#fee2e2] p-5 rounded-2xl border-2 border-dashed border-red-300 rotate-[-1deg]">
              <h4 className="text-2xl font-serifHand font-bold text-red-700 mb-1">🪫 Baterai Menipis</h4>
              <p className="text-lg text-red-900 leading-snug">Dipicu oleh kurang tidur, tumpukan tugas ujian, perdebatan dengan kawan/keluarga, atau ekspektasi yang terlalu tinggi.</p>
            </div>
            <div className="bg-[#ffedd5] p-5 rounded-2xl border-2 border-dashed border-amber-300 rotate-[1deg]">
              <h4 className="text-2xl font-serifHand font-bold text-amber-800 mb-1">🐌 Sistem Melambat</h4>
              <p className="text-lg text-amber-950 leading-snug">Tiba-tiba sulit berkonsentrasi, gampang tersinggung pada hal sepele, motivasi menguap, atau merasa kewalahan.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      tag: "Modul 03",
      sticker: "🚨",
      tapeColor: "bg-[#fed7aa]/80",
      title: "Emosi Bukanlah Musuh",
      bgColor: "bg-[#fff7ed]",
      borderColor: "border-orange-200",
      excerpt: "Mengapa kita merasakan marah, cemas, atau sedih? Mereka adalah sinyal penting.",
      content: (
        <div className="space-y-4 font-hand text-xl text-[#452a18] leading-relaxed">
          <p>Sering kali kita mengira bahwa rasa marah atau sedih adalah hal yang 'buruk' dan harus segera ditekan atau disembunyikan. Padahal, emosi bukanlah musuh yang harus dilawan.</p>
          <p>Rasa marah, sedih, kecewa, takut, atau malu sebenarnya adalah <strong>alarm atau sinyal alami</strong> tubuh kita bahwa ada sesuatu di dalam atau di luar diri kita yang membutuhkan perhatian dan kelembutan.</p>
          <ul className="space-y-2 bg-[#fffdfa] p-5 rounded-2xl border-2 border-dashed border-[#e6ccb2] mt-4">
            <li className="flex items-center gap-2">⭐ Tujuannya bukan mematikan atau membuang rasa itu.</li>
            <li className="flex items-center gap-2">⭐ Melainkan belajar memberi nama pada apa yang kita rasakan.</li>
            <li className="flex items-center gap-2">⭐ Memahami alasan di balik pesan yang dibawanya.</li>
            <li className="flex items-center gap-2">⭐ Dan meresponsnya secara bijak tanpa menyakiti diri maupun orang lain.</li>
          </ul>
        </div>
      )
    }
  ];

  if (activeArticle) {
    const article = articles.find(a => a.id === activeArticle);
    return (
      <div className="space-y-6 animate-fade-in print-content">
        <button 
          onClick={() => setActiveArticle(null)}
          className="font-hand font-bold text-xl flex items-center gap-2 px-5 py-2 rounded-full bg-white border-2 border-[#d5c7b9] hover:bg-[#fff9ef] shadow-sm no-print transition-transform active:scale-95"
        >
          ⬅ Kembali ke Kliping Materi
        </button>

        <ScrapCard bgColor={article.bgColor} tapeColor={article.tapeColor} className={article.borderColor}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{article.sticker}</span>
            <span className="text-sm font-hand uppercase font-bold tracking-widest text-[#7c5335] bg-white/70 px-3 py-1 rounded-full border border-[#e8dfd5]">
              {article.tag}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serifHand font-bold text-[#4a3525] mb-6">
            {article.title}
          </h2>
          {article.content}
        </ScrapCard>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in print-content">
      <div className="text-center sm:text-left border-b-2 border-dashed border-[#d5c7b9] pb-4">
        <h2 className="text-3xl sm:text-4xl font-serifHand font-bold text-[#4a3525]">
          📚 Kliping Bacaan Refleksi
        </h2>
        <p className="font-hand text-xl text-[#7c5335]">
          Catatan ringan untuk membantumu lebih akrab dan sayang pada diri sendiri.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {articles.map((article, idx) => (
          <div 
            key={article.id} 
            onClick={() => setActiveArticle(article.id)}
            className={`relative ${article.bgColor} p-6 rounded-2xl border-2 border-dashed ${article.borderColor} shadow-[4px_6px_18px_rgba(78,52,46,0.06)] hover:shadow-[6px_10px_22px_rgba(78,52,46,0.12)] hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between select-none ${idx % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}
          >
            <WashiTape color={article.tapeColor} className="absolute -top-3 right-6 w-20" />
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{article.sticker}</span>
                <span className="text-xs font-hand font-bold text-[#8b725c]">{article.tag}</span>
              </div>
              <h3 className="text-2xl font-serifHand font-bold text-[#4a3525] mb-2">
                {article.title}
              </h3>
              <p className="font-hand text-lg text-[#6b584a] mb-6 leading-relaxed">
                {article.excerpt}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-white/90 text-[#4a3525] font-hand font-bold text-lg px-4 py-1.5 rounded-full border border-[#d5c7b9] shadow-xs hover:bg-[#fffdf7]">
                Buka Catatan ➔
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const JurnalEmosi = ({ data, updateData }) => {
  const emosiItems = [
    { label: "Senang", emoji: "☀️", color: "bg-[#fef08a]" },
    { label: "Tenang", emoji: "🍃", color: "bg-[#bbf7d0]" },
    { label: "Biasa saja", emoji: "☁️", color: "bg-[#e2e8f0]" },
    { label: "Sedih", emoji: "🌧️", color: "bg-[#bae6fd]" },
    { label: "Marah", emoji: "⚡", color: "bg-[#fecaca]" },
    { label: "Cemas", emoji: "🌀", color: "bg-[#fed7aa]" },
    { label: "Bingung", emoji: "❓", color: "bg-[#e9d5ff]" },
    { label: "Malu", emoji: "🙈", color: "bg-[#fbcfe8]" },
    { label: "Kecewa", emoji: "💔", color: "bg-[#fed7aa]" },
    { label: "Lelah", emoji: "🪫", color: "bg-[#e5e7eb]" },
  ];

  const selectedEmosi = data.jurnalEmosi.selectedEmosi || [];

  const toggleEmosi = (e) => {
    if (selectedEmosi.includes(e)) {
      updateData('jurnalEmosi', 'selectedEmosi', selectedEmosi.filter(i => i !== e));
    } else {
      updateData('jurnalEmosi', 'selectedEmosi', [...selectedEmosi, e]);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in print-content">
      <div className="relative bg-[#fff7d6] p-6 rounded-2xl border-2 border-dashed border-[#e9d8a6] shadow-sm">
        <WashiTape color="bg-[#fbcfe8]/80" rotate="-rotate-2" className="absolute -top-3 left-6 w-24" />
        <h2 className="text-3xl font-serifHand font-bold text-[#5c4033] mb-1">
          🤝 Jurnal Rasa (Emotion Diary)
        </h2>
        <p className="font-hand text-xl text-[#7c5335]">
          Ruang untuk menyapa emosimu tanpa menghakimi dirimu sendiri.
        </p>
      </div>

      {/* Bagian A: Pilihan Emosi */}
      <ScrapCard bgColor="bg-white" tapeColor="bg-[#bbf7d0]/80">
        <h3 className="text-2xl font-serifHand font-bold text-[#4a3525] mb-3">
          A. Emosi apa yang sedang bertamu hari ini?
        </h3>
        <p className="font-hand text-base text-[#8b725c] mb-4">
          (Bisa memilih lebih dari satu stiker emosi yang kamu rasakan)
        </p>
        <div className="flex flex-wrap gap-2.5">
          {emosiItems.map(item => (
            <StickerPill 
              key={item.label}
              label={item.label}
              emoji={item.emoji}
              selected={selectedEmosi.includes(item.label)}
              onClick={() => toggleEmosi(item.label)}
              activeColor={item.color}
            />
          ))}
        </div>
      </ScrapCard>

      {/* Bagian B & C: Situasi & Pikiran */}
      <div className="grid md:grid-cols-2 gap-6">
        <ScrapCard bgColor="bg-[#fff9db]" tilt="-rotate-1" tapeColor="bg-[#fed7aa]/80">
          <h3 className="text-xl font-serifHand font-bold text-[#5c4033] mb-1">
            B. Apa yang sebenarnya terjadi?
          </h3>
          <p className="font-hand text-sm text-[#8b725c] mb-2">Tuliskan kejadian atau situasi pemicu:</p>
          <ScrapTextArea 
            placeholder="Cth: Tadi dimarahi karena terlambat sampai rumah..."
            rows={4}
            value={data.jurnalEmosi.situasi}
            onChange={(e) => updateData('jurnalEmosi', 'situasi', e.target.value)}
          />
        </ScrapCard>

        <ScrapCard bgColor="bg-[#e0f2fe]" tilt="rotate-1" tapeColor="bg-[#bae6fd]/80">
          <h3 className="text-xl font-serifHand font-bold text-[#1e3a8a] mb-1">
            C. Apa yang terlintas di pikiranmu?
          </h3>
          <p className="font-hand text-sm text-[#3b82f6] mb-2">Pikiran atau kekhawatiran yang bermunculan:</p>
          <ScrapTextArea 
            placeholder="Cth: Rasanya orang tua tidak mengerti alasanku sama sekali..."
            rows={4}
            value={data.jurnalEmosi.pikiran}
            onChange={(e) => updateData('jurnalEmosi', 'pikiran', e.target.value)}
          />
        </ScrapCard>
      </div>

      {/* Bagian D: Intensitas Emosi */}
      <ScrapCard bgColor="bg-white" clip={true}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-serifHand font-bold text-[#4a3525]">
            D. Seberapa kuat gelombang emosinya? (1-10)
          </h3>
          <span className="font-hand font-bold text-xl bg-[#faedcd] border border-[#d4a373] text-[#5c4033] px-3.5 py-1 rounded-full shadow-xs">
            Skor: {data.jurnalEmosi.intensitas || 5} / 10
          </span>
        </div>
        <input 
          type="range" 
          min="1" 
          max="10" 
          value={data.jurnalEmosi.intensitas || 5} 
          onChange={(e) => updateData('jurnalEmosi', 'intensitas', parseInt(e.target.value))}
          className="w-full accent-[#d4a373] h-3 bg-[#e8dfd5] rounded-lg appearance-none cursor-pointer border border-[#c5b5a4] no-print" 
        />
        <div className="flex justify-between font-hand text-lg text-[#7c5335] mt-2 font-bold">
          <span>🌱 1 (Ringan)</span>
          <span>⚡ 5 (Sedang)</span>
          <span>🌊 10 (Sangat Kuat)</span>
        </div>
      </ScrapCard>

      {/* Bagian E & F: Tindakan & Alternatif Sehat */}
      <div className="grid md:grid-cols-2 gap-6">
        <ScrapCard bgColor="bg-[#fdfaf5]" className="border-dashed">
          <h3 className="text-xl font-serifHand font-bold text-[#5c4033] mb-1">
            E. Apa yang kulakukan setelah itu?
          </h3>
          <ScrapTextArea 
            placeholder="Cth: Mengunci pintu kamar, menangis sendirian, malas bicara..."
            rows={3}
            value={data.jurnalEmosi.tindakan}
            onChange={(e) => updateData('jurnalEmosi', 'tindakan', e.target.value)}
          />
        </ScrapCard>

        <ScrapCard bgColor="bg-[#f3e8ff]" tapeColor="bg-[#d8b4fe]/80">
          <h3 className="text-xl font-serifHand font-bold text-[#581c87] mb-1">
            F. Alternatif Respon yang Lebih Sehat
          </h3>
          <ScrapTextArea 
            placeholder="Cth: Minum air hangat, menarik napas perlahan, dan bicara pelan-pelan..."
            rows={3}
            value={data.jurnalEmosi.alternatif}
            onChange={(e) => updateData('jurnalEmosi', 'alternatif', e.target.value)}
          />
        </ScrapCard>
      </div>

      {/* Catatan Penguat Hati */}
      <div className="relative bg-[#faedcd] p-6 rounded-2xl border-2 border-dashed border-[#d4a373] flex gap-4 items-center shadow-xs">
        <span className="text-4xl select-none">🌱</span>
        <p className="font-hand text-xl text-[#5c4033] leading-relaxed">
          "Aku tidak harus tergesa-gesa membuang semua emosi. Aku sedang belajar memahaminya. Emosi bukanlah musuh, melainkan kawan yang membunyikan sinyal."
        </p>
      </div>
    </div>
  );
};

const KelolaPikiran = ({ data, updateData }) => (
  <div className="space-y-8 animate-fade-in print-content">
    <div className="bg-[#fecdd3] p-6 rounded-2xl border-2 border-dashed border-rose-300">
      <h2 className="text-3xl font-serifHand font-bold text-rose-900 mb-1">
        🧠 Mengurai Pikiran (Stop Overthinking)
      </h2>
      <p className="font-hand text-xl text-rose-950">
        Berhenti sejenak, periksa fakta dengan jernih, lalu ambil satu langkah kecil.
      </p>
    </div>

    {/* S - T - O - P Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { l: 'S', title: 'STOP', desc: 'Hentikan sejenak roda pikiran yang berputar liar.', c: 'bg-[#fff3b0]', t: 'bg-[#fde047]/80' },
        { l: 'T', title: 'TAKE A BREATH', desc: 'Tarik napas lembut dan buang perlahan 3 kali.', c: 'bg-[#bbf7d0]', t: 'bg-[#86efac]/80' },
        { l: 'O', title: 'OBSERVE', desc: 'Amati apa yang dirasakan tubuh dan fakta sebenarnya.', c: 'bg-[#fed7aa]', t: 'bg-[#fdba74]/80' },
        { l: 'P', title: 'PROCEED', desc: 'Pilih satu tindakan kecil yang nyata & realistis.', c: 'bg-[#fbcfe8]', t: 'bg-[#f472b6]/80' }
      ].map((item, i) => (
        <ScrapCard key={item.l} bgColor={item.c} tapeColor={item.t} className="text-center flex flex-col items-center justify-center p-5">
          <div className="text-5xl font-serifHand font-bold text-[#4a3525] mb-1">
            {item.l}
          </div>
          <h3 className="font-serifHand font-bold text-xl text-[#4a3525] mb-1">
            {item.title}
          </h3>
          <p className="font-hand text-base text-[#6b584a] leading-snug">
            {item.desc}
          </p>
        </ScrapCard>
      ))}
    </div>

    {/* Tantang Pikiran */}
    <ScrapCard bgColor="bg-white" clip={true}>
      <h3 className="text-2xl font-serifHand font-bold text-[#4a3525] mb-2">
        🔍 Mari Menantang Pikiranmu Sendiri
      </h3>
      <p className="font-hand text-base text-[#8b725c] mb-4">
        Kadang pikiran kita membesar-besarkan skenario terburuk yang belum tentu terjadi.
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="font-hand font-bold text-lg text-[#5c4033] block mb-1">
            Pikiran otomatis yang terus mengganggumu:
          </label>
          <ScrapTextArea 
            placeholder="Cth: Semua orang pasti membenciku karena kesalahanku tadi..."
            rows={2}
            value={data.kelolaPikiran.pikiranMuncul}
            onChange={(e) => updateData('kelolaPikiran', 'pikiranMuncul', e.target.value)}
          />
        </div>
        <div>
          <label className="font-hand font-bold text-lg text-[#2e7d32] block mb-1">
            Fakta / Pikiran alternatif yang lebih adil dan menenangkan:
          </label>
          <ScrapTextArea 
            placeholder="Cth: Aku memang berbuat salah, tapi manusiawi untuk belajar. Aku tidak harus mempercayai semua ketakutan di kepalaku..."
            rows={2}
            className="bg-[#f0fdf4] border-emerald-300 text-emerald-900"
            value={data.kelolaPikiran.pikiranRealistis}
            onChange={(e) => updateData('kelolaPikiran', 'pikiranRealistis', e.target.value)}
          />
        </div>
      </div>
    </ScrapCard>

    {/* Grounding 5-4-3-2-1 */}
    <ScrapCard bgColor="bg-[#e0f2fe]" tapeColor="bg-[#bae6fd]/80">
      <h2 className="text-3xl font-serifHand font-bold text-[#0369a1] mb-1">
        🧊 Latihan Grounding 5-4-3-2-1
      </h2>
      <p className="font-hand text-lg text-[#0c4a6e] mb-5">
        Ajak panca inderamu kembali ke saat ini. Luangkan waktu sejenak untuk mencari:
      </p>

      <div className="space-y-3">
        {[
          { num: "5", label: "Hal yang bisa kamu LIHAT di sekitarmu", key: "lihat" },
          { num: "4", label: "Benda yang bisa kamu SENTUH teksturnya", key: "sentuh" },
          { num: "3", label: "Suara yang bisa kamu DENGAR saat ini", key: "dengar" },
          { num: "2", label: "Aroma yang bisa kamu CIUM di sekelilingmu", key: "cium" },
          { num: "1", label: "Satu rasa nyaman yang bisa kamu RASAKAN di tubuh", key: "rasakan" },
        ].map(item => (
          <div key={item.num} className="flex items-center gap-3 bg-white/90 p-2.5 rounded-xl border border-sky-200">
            <span className="font-serifHand font-bold text-3xl text-sky-700 w-8 text-center shrink-0">
              {item.num}
            </span>
            <ScrapInput 
              placeholder={item.label}
              className="border-none bg-transparent"
              value={data.kelolaPikiran[item.key]}
              onChange={(e) => updateData('kelolaPikiran', item.key, e.target.value)}
            />
          </div>
        ))}
      </div>
    </ScrapCard>
  </div>
);

const KekuatanDiri = ({ data, updateData }) => {
  const needs = [
    { text: "Didengarkan", icon: "👂" },
    { text: "Istirahat cukup", icon: "🛌" },
    { text: "Dukungan teman", icon: "🤝" },
    { text: "Waktu sendirian", icon: "⏳" },
    { text: "Bantuan masalah", icon: "🛠️" },
    { text: "Ruang mencoba lagi", icon: "🎨" }
  ];

  const selectedNeeds = data.kekuatanDiri.selectedNeeds || [];

  const toggleNeed = (needText) => {
    if (selectedNeeds.includes(needText)) {
      updateData('kekuatanDiri', 'selectedNeeds', selectedNeeds.filter(n => n !== needText));
    } else {
      updateData('kekuatanDiri', 'selectedNeeds', [...selectedNeeds, needText]);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in print-content">
      <div className="bg-[#fef08a] p-6 rounded-2xl border-2 border-dashed border-[#eab308]">
        <h2 className="text-3xl font-serifHand font-bold text-[#713f12] mb-1">
          ✨ Bukti Kekuatan Diriku
        </h2>
        <p className="font-hand text-xl text-[#854d0e]">
          Menengok kembali jejak keberanian dan kebaikan yang sudah pernah kamu ukir.
        </p>
      </div>

      {/* 3 Hal Baik */}
      <ScrapCard bgColor="bg-white" tapeColor="bg-[#fde047]/80">
        <h3 className="text-2xl font-serifHand font-bold text-[#4a3525] mb-2">
          Tiga hal yang pernah berhasil kulakukan dengan baik:
        </h3>
        <div className="space-y-3 mb-6">
          <ScrapInput 
            placeholder="1. Cth: Menyelesaikan tugas meski rasanya malas..."
            value={data.kekuatanDiri.halBaik1}
            onChange={(e) => updateData('kekuatanDiri', 'halBaik1', e.target.value)}
          />
          <ScrapInput 
            placeholder="2. Cth: Berani jujur dan minta maaf kepada kawan..."
            value={data.kekuatanDiri.halBaik2}
            onChange={(e) => updateData('kekuatanDiri', 'halBaik2', e.target.value)}
          />
          <ScrapInput 
            placeholder="3. Cth: Menemani adik / mendengarkan curhat teman..."
            value={data.kekuatanDiri.halBaik3}
            onChange={(e) => updateData('kekuatanDiri', 'halBaik3', e.target.value)}
          />
        </div>

        <h3 className="text-2xl font-serifHand font-bold text-[#4a3525] mb-2 border-t-2 border-dashed border-[#e8dfd5] pt-4">
          Momen berat yang pernah berhasil kulalui di masa lalu:
        </h3>
        <ScrapTextArea 
          placeholder="Tuliskan sedikit tentang bagaimana kamu berhasil bertahan..."
          rows={2}
          value={data.kekuatanDiri.halBerat}
          onChange={(e) => updateData('kekuatanDiri', 'halBerat', e.target.value)}
        />
      </ScrapCard>

      {/* Self-Compassion */}
      <ScrapCard bgColor="bg-[#fdf2f8]" tapeColor="bg-[#fbcfe8]/80">
        <h2 className="text-3xl font-serifHand font-bold text-pink-900 mb-2">
          🌸 Bicara Lembut Pada Diri (Self-Compassion)
        </h2>
        <p className="font-hand text-lg text-pink-950 mb-4">
          Bayangkan sahabat baikmu sedang mengalami kesulitan yang sama. Kata-kata hangat apa yang akan kamu ucapkan padanya?
        </p>

        <div className="space-y-4">
          <div>
            <label className="font-hand font-bold text-lg text-rose-900 block mb-1">
              Kalimat kasar/menyalahkan yang biasanya kuucapkan pada diriku saat gagal:
            </label>
            <ScrapTextArea 
              placeholder="Cth: Kamu payah banget, nggak ada yang bisa kamu lakukan dengan benar..."
              rows={2}
              value={data.kekuatanDiri.selfTalkDown}
              onChange={(e) => updateData('kekuatanDiri', 'selfTalkDown', e.target.value)}
            />
          </div>
          <div>
            <label className="font-hand font-bold text-lg text-emerald-900 block mb-1">
              Kalimat yang LEBIH RAMAH dan PENUH KASIH SAYANG:
            </label>
            <ScrapTextArea 
              placeholder="Cth: Tak apa berbuat salah, kamu sudah berusaha sekuat tenaga. Tarik napas, besok kita coba lagi ya..."
              rows={2}
              className="bg-[#f0fdf4] border-emerald-300 text-emerald-900"
              value={data.kekuatanDiri.selfTalkRamah}
              onChange={(e) => updateData('kekuatanDiri', 'selfTalkRamah', e.target.value)}
            />
          </div>
        </div>
      </ScrapCard>

      {/* Kebutuhan Saat Ini */}
      <ScrapCard bgColor="bg-[#f0fdf4]" clip={true}>
        <h3 className="text-2xl font-serifHand font-bold text-emerald-900 mb-2">
          🌿 Apa yang sebenarnya paling kubutuhkan saat ini?
        </h3>
        <p className="font-hand text-base text-emerald-800 mb-4">
          Centang kebutuhan batinmu agar kamu bisa memenuhinya:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {needs.map(need => {
            const isChecked = selectedNeeds.includes(need.text);
            return (
              <label 
                key={need.text}
                onClick={() => toggleNeed(need.text)}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer select-none font-hand text-lg
                  ${isChecked 
                    ? 'bg-[#dcfce7] border-emerald-600 text-emerald-950 font-bold shadow-xs scale-[1.02]' 
                    : 'bg-white/90 border-[#d5c7b9] text-[#6b584a] hover:bg-[#fff9ef]'}`}
              >
                <input 
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}}
                  className="w-5 h-5 accent-emerald-600 rounded pointer-events-none"
                />
                <span>{need.icon}</span>
                <span>{need.text}</span>
              </label>
            );
          })}
        </div>
      </ScrapCard>
    </div>
  );
};

const Keseharian = ({ data, updateData }) => {
  const habits = [
    "Membuka media sosial tanpa tujuan jelas",
    "Membandingkan pencapaian diri dengan feed orang lain",
    "Sulit menghentikan doom-scrolling berjam-jam",
    "Menatap layar HP hingga larut malam dan mengorbankan tidur"
  ];

  const digitalHabits = data.keseharian.digitalHabits || [];

  const toggleHabit = (item) => {
    if (digitalHabits.includes(item)) {
      updateData('keseharian', 'digitalHabits', digitalHabits.filter(h => h !== item));
    } else {
      updateData('keseharian', 'digitalHabits', [...digitalHabits, item]);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in print-content">
      <div className="bg-[#e9d5ff] p-6 rounded-2xl border-2 border-dashed border-purple-300">
        <h2 className="text-3xl font-serifHand font-bold text-purple-900 mb-1">
          📴 Keseharian & Evaluasi Diri
        </h2>
        <p className="font-hand text-xl text-purple-950">
          Menghargai hal-hal kecil, mengurai benang stres, dan mengatur batasan layar.
        </p>
      </div>

      {/* Jurnal Rasa Syukur */}
      <ScrapCard bgColor="bg-[#fffbeb]" tapeColor="bg-[#fef08a]/90">
        <h3 className="text-2xl font-serifHand font-bold text-[#78350f] mb-1">
          🌻 Syukur Hari Ini (Gratitude Journal)
        </h3>
        <p className="font-hand text-base text-[#92400e] mb-4">
          Bukan untuk mengabaikan kesulitan, melainkan menyadari setitik berkah yang tetap ada di hari yang tidak sempurna.
        </p>

        <div className="space-y-4">
          <div>
            <label className="font-hand font-bold text-lg text-[#78350f] block mb-1">
              Hari ini aku bersyukur atas hal kecil berupa:
            </label>
            <ScrapTextArea 
              placeholder="Cth: Masih bisa menikmati teh hangat di pagi hari..."
              rows={2}
              value={data.keseharian.syukur1}
              onChange={(e) => updateData('keseharian', 'syukur1', e.target.value)}
            />
          </div>
          <div>
            <label className="font-hand font-bold text-lg text-[#78350f] block mb-1">
              Mengapa hal ini terasa berarti untukku?
            </label>
            <ScrapTextArea 
              placeholder="Cth: Karena membuat tubuhku lebih tenang dan rileks..."
              rows={2}
              value={data.keseharian.syukur2}
              onChange={(e) => updateData('keseharian', 'syukur2', e.target.value)}
            />
          </div>
          <div>
            <label className="font-hand font-bold text-lg text-[#78350f] block mb-1">
              Satu hal menyenangkan yang ingin kunikmati besok:
            </label>
            <ScrapTextArea 
              placeholder="Cth: Berjalan-jalan melihat langit sore atau mendengarkan lagu favorit..."
              rows={2}
              value={data.keseharian.syukur3}
              onChange={(e) => updateData('keseharian', 'syukur3', e.target.value)}
            />
          </div>
        </div>
      </ScrapCard>

      {/* Stress Diary & Digital Wellbeing */}
      <div className="grid md:grid-cols-2 gap-6">
        <ScrapCard bgColor="bg-[#ffedd5]" tilt="-rotate-1" tapeColor="bg-[#fed7aa]/80">
          <h3 className="text-2xl font-serifHand font-bold text-amber-950 mb-1">
            📦 Mengurai Stres (Stress Diary)
          </h3>
          <p className="font-hand text-sm text-amber-900 mb-3">Kenali sumber beban dan pilih langkah kecil:</p>
          
          <div className="space-y-3">
            <div>
              <label className="font-hand font-bold text-base text-amber-950">Situasi yang memicu:</label>
              <ScrapInput 
                placeholder="Cth: Tugas kelompok menumpuk..."
                value={data.keseharian.stressSituasi}
                onChange={(e) => updateData('keseharian', 'stressSituasi', e.target.value)}
              />
            </div>
            <div>
              <label className="font-hand font-bold text-base text-amber-950">Hal yang ADA DALAM kendaliku:</label>
              <ScrapInput 
                placeholder="Cth: Mengerjakan bagianku tanpa menunda..."
                value={data.keseharian.stressKontrol}
                onChange={(e) => updateData('keseharian', 'stressKontrol', e.target.value)}
              />
            </div>
            <div>
              <label className="font-hand font-bold text-base text-amber-950">Satu langkah kecil konkret:</label>
              <ScrapInput 
                placeholder="Cth: Buka laptop dan cicil selama 20 menit..."
                value={data.keseharian.stressLangkah}
                onChange={(e) => updateData('keseharian', 'stressLangkah', e.target.value)}
              />
            </div>
          </div>
        </ScrapCard>

        <ScrapCard bgColor="bg-[#ecfdf5]" tilt="rotate-1" tapeColor="bg-[#a7f3d0]/80">
          <h3 className="text-2xl font-serifHand font-bold text-emerald-950 mb-1">
            📵 Cek Kebiasaan Layar
          </h3>
          <p className="font-hand text-sm text-emerald-900 mb-3">Tandai kebiasaan yang sering menguras energimu:</p>
          
          <div className="space-y-2.5">
            {habits.map((item, i) => {
              const isChecked = digitalHabits.includes(item);
              return (
                <label 
                  key={i}
                  onClick={() => toggleHabit(item)}
                  className="flex items-start gap-2.5 font-hand text-lg cursor-pointer select-none text-emerald-950"
                >
                  <input 
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="w-5 h-5 mt-1 accent-emerald-600 rounded pointer-events-none"
                  />
                  <span className={isChecked ? "line-through opacity-75 text-emerald-800" : ""}>
                    {item}
                  </span>
                </label>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t-2 border-dashed border-emerald-200">
            <label className="font-hand font-bold text-base text-emerald-950 block mb-1">
              Satu batasan digital yang kupilih untuk kucoba:
            </label>
            <ScrapInput 
              placeholder="Cth: Meletakkan HP di luar jangkauan kasur sebelum tidur..."
              value={data.keseharian.batasDigital}
              onChange={(e) => updateData('keseharian', 'batasDigital', e.target.value)}
            />
          </div>
        </ScrapCard>
      </div>
    </div>
  );
};

const Support = ({ data, updateData }) => (
  <div className="space-y-8 animate-fade-in print-content">
    <div className="bg-[#ccfbf1] p-6 rounded-2xl border-2 border-dashed border-teal-300">
      <h2 className="text-3xl font-serifHand font-bold text-teal-900 mb-1">
        👥 Lingkaran Pendukung & Rencana Nyata
      </h2>
      <p className="font-hand text-xl text-teal-950">
        Memetakan pertemanan yang sehat serta merangkai komitmen kebaikan bagi diri.
      </p>
    </div>

    {/* Pertemanan Sehat vs Waspada */}
    <ScrapCard bgColor="bg-white" clip={true}>
      <h3 className="text-2xl font-serifHand font-bold text-[#4a3525] mb-4">
        Apakah Lingkungan Pertemananmu Menyehatkan?
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[#f0fdf4] p-5 rounded-2xl border-2 border-dashed border-emerald-300 rotate-[-0.5deg]">
          <h4 className="font-serifHand font-bold text-xl text-emerald-800 mb-2 flex items-center gap-1.5">
            😊 Ciri Sahabat yang Sehat:
          </h4>
          <ul className="font-hand text-lg text-emerald-950 space-y-1.5 list-disc list-inside">
            <li>Bersedia mendengarkan tanpa langsung menghakimi.</li>
            <li>Tidak memaksa atau mempermalukan di depan orang banyak.</li>
            <li>Bisa berbeda pendapat tanpa harus menjatuhkan martabat.</li>
            <li>Menghormati dan menghargai ketika kamu mengatakan "Tidak".</li>
          </ul>
        </div>

        <div className="bg-[#fff1f2] p-5 rounded-2xl border-2 border-dashed border-rose-300 rotate-[0.5deg]">
          <h4 className="font-serifHand font-bold text-xl text-rose-800 mb-2 flex items-center gap-1.5">
            ⚠️ Waspada Jika Ada Teman yang:
          </h4>
          <ul className="font-hand text-lg text-rose-950 space-y-1.5 list-disc list-inside">
            <li>Terus mendesak setelah kamu menyatakan keberatan.</li>
            <li>Mengancam atau membuatmu merasa bersalah (*guilt-tripping*).</li>
            <li>Menyebarkan rahasia pribadimu kepada orang lain.</li>
            <li>Menghukum atau mengucilkanmu karena kamu menolak sesuatu.</li>
          </ul>
        </div>
      </div>

      <h3 className="text-2xl font-serifHand font-bold text-[#4a3525] mt-8 mb-3 border-t-2 border-dashed border-[#e8dfd5] pt-4">
        Orang Terpercaya Tempat Bercerita:
      </h3>

      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <ScrapInput 
            placeholder="Siapa namanya? (Cth: Sahabat / Guru BK / Ibu)" 
            className="sm:w-1/3"
            value={data.support.cerita1Nama}
            onChange={(e) => updateData('support', 'cerita1Nama', e.target.value)}
          />
          <ScrapInput 
            placeholder="Kapan biasanya bisa dihubungi?" 
            className="sm:w-2/3"
            value={data.support.cerita1Waktu}
            onChange={(e) => updateData('support', 'cerita1Waktu', e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <ScrapInput 
            placeholder="Siapa namanya?" 
            className="sm:w-1/3"
            value={data.support.cerita2Nama}
            onChange={(e) => updateData('support', 'cerita2Nama', e.target.value)}
          />
          <ScrapInput 
            placeholder="Kapan biasanya bisa dihubungi?" 
            className="sm:w-2/3"
            value={data.support.cerita2Waktu}
            onChange={(e) => updateData('support', 'cerita2Waktu', e.target.value)}
          />
        </div>
      </div>
    </ScrapCard>

    {/* Rencana Kecilku */}
    <ScrapCard bgColor="#fffdf7" tapeColor="bg-[#fed7aa]/90">
      <h3 className="text-2xl font-serifHand font-bold text-[#7c5335] mb-2 flex items-center gap-2">
        🎯 Rencana Langkah Kecilku
      </h3>
      <p className="font-hand text-lg text-[#8b725c] mb-4">
        Mulai saat ini, aku memberi ruang pada diriku untuk berproses selangkah demi selangkah.
      </p>

      <div className="space-y-4">
        <div>
          <label className="font-hand font-bold text-lg text-[#5c4033] block mb-1">
            🌱 Satu kebiasaan baik yang ingin kutingkatkan:
          </label>
          <ScrapInput 
            placeholder="Cth: Minum air putih cukup dan tidur sebelum jam 11 malam..."
            value={data.support.rencanaTingkatkan}
            onChange={(e) => updateData('support', 'rencanaTingkatkan', e.target.value)}
          />
        </div>
        <div>
          <label className="font-hand font-bold text-lg text-[#5c4033] block mb-1">
            🍂 Satu hal yang ingin kukurangi:
          </label>
          <ScrapInput 
            placeholder="Cth: Mengkritik diriku sendiri terlalu keras..."
            value={data.support.rencanaKurangi}
            onChange={(e) => updateData('support', 'rencanaKurangi', e.target.value)}
          />
        </div>
        <div>
          <label className="font-hand font-bold text-lg text-[#5c4033] block mb-1">
            🎨 Satu aktivitas menyenangkan khusus untuk menyayangi diriku:
          </label>
          <ScrapInput 
            placeholder="Cth: Bersepeda di akhir pekan atau menggambar tanpa beban..."
            value={data.support.rencanaAktivitas}
            onChange={(e) => updateData('support', 'rencanaAktivitas', e.target.value)}
          />
        </div>
      </div>
    </ScrapCard>
  </div>
);

/* --- MAIN APP CONTAINER --- */

export default function ScrapbookApp({
  formData: propFormData,
  updateData: propUpdateData,
  activeTab: propActiveTab,
  setActiveTab: propSetActiveTab,
  onSelectStyle,
  currentStyle = 2,
  handleReset: propHandleReset
}) {
  const [localActiveTab, setLocalActiveTab] = useState('beranda');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [localFormData, setLocalFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error("Gagal membaca dari localStorage", err);
    }
    return defaultData;
  });

  const formData = propFormData || localFormData;
  const activeTab = propActiveTab || localActiveTab;
  const setActiveTab = propSetActiveTab || setLocalActiveTab;

  const [printAll, setPrintAll] = useState(false);

  // Simpan otomatis ke localStorage jika menggunakan local state
  useEffect(() => {
    if (!propFormData) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      } catch (err) {
        console.error("Gagal menyimpan ke localStorage", err);
      }
    }
  }, [formData, propFormData]);

  const updateData = propUpdateData || ((section, field, value) => {
    setLocalFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  });

  const handleReset = propHandleReset || (() => {
    if (window.confirm("Apakah kamu yakin ingin mengosongkan seluruh lembar catatan scrapbook ini?")) {
      setLocalFormData(defaultData);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (err) {}
    }
  });

  const tabs = [
    { id: 'beranda', label: 'Cover & Profil', icon: '📖' },
    { id: 'bacaan', label: 'Kliping Materi', icon: '📚' },
    { id: 'emosi', label: 'Jurnal Rasa', icon: '🤝' },
    { id: 'pikiran', label: 'Urai Pikiran', icon: '🧠' },
    { id: 'kekuatan', label: 'Kekuatan Diri', icon: '✨' },
    { id: 'keseharian', label: 'Keseharian', icon: '📴' },
    { id: 'support', label: 'Lingkar Teman', icon: '👥' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'beranda': return <Beranda data={formData} updateData={updateData} />;
      case 'bacaan': return <MateriBacaan />;
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
    <div className="min-h-screen bg-[#faf5ec] text-[#3d2f25] font-sans selection:bg-[#ffe5d9] flex flex-col md:flex-row print-layout">
      
      {/* Mobile Topbar */}
      <div className="md:hidden bg-[#fffdf7] border-b-2 border-dashed border-[#d5c7b9] p-4 flex justify-between items-center sticky top-0 z-50 no-print shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📓</span>
          <span className="font-serifHand font-bold text-2xl text-[#4a3525]">Scrapbook Mental</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="border-2 border-[#d5c7b9] px-3 py-1 rounded-xl bg-[#faedcd] font-hand font-bold text-xl"
          aria-label="Menu"
        >
          {isMobileMenuOpen ? '✖ Tutup' : '☰ Lembar'}
        </button>
      </div>

      {/* Sidebar Scrapbook Navigation */}
      <nav className={`
        ${isMobileMenuOpen ? 'block' : 'hidden'} 
        md:flex flex-col w-full md:w-80 shrink-0 bg-[#fffdf9] border-r-2 border-dashed border-[#d5c7b9] p-6 md:sticky md:top-0 md:h-screen md:overflow-y-auto z-40
        absolute md:relative left-0 top-[65px] md:top-0 h-[calc(100vh-65px)] border-b-2 md:border-b-0 no-print shadow-sm
      `}>
        {/* Header Buku Jurnal */}
        <div className="hidden md:block mb-8 relative">
          <WashiTape color="bg-[#fbcfe8]/80" rotate="-rotate-3" className="absolute -top-3 left-4 w-24" />
          <div className="bg-[#faedcd] p-4 rounded-2xl border-2 border-dashed border-[#d4a373] shadow-xs text-center">
            <h1 className="text-3xl font-serifHand font-bold text-[#4a3525] leading-none">
              Scrapbook
            </h1>
            <p className="text-lg font-hand text-[#6b4e3d] mt-1">
              Buku Harian Kesehatan Mental
            </p>
          </div>
        </div>

        {/* Tab Links */}
        <ul className="space-y-2.5 flex-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <li key={tab.id}>
                <button
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-hand font-bold text-lg text-left transition-all
                    ${isActive 
                      ? 'bg-[#ffe5d9] text-[#4a3525] border-2 border-[#d4a373] shadow-sm translate-x-1 rotate-1 scale-[1.02]' 
                      : 'bg-white/80 hover:bg-[#fff9ef] text-[#6b584a] border border-[#e8dfd5] hover:border-[#d5c7b9]'
                    }`}
                >
                  <span className="text-2xl">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Action Controls & Print */}
        <div className="mt-8 space-y-3">
          <button 
            onClick={handlePrintCurrent}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 font-hand font-bold text-lg bg-[#bde0fe] hover:bg-[#a2d2ff] text-[#1e3a8a] border-2 border-[#90b4ce] transition-colors shadow-xs"
          >
            🖨️ Cetak Lembar Ini
          </button>
          
          <button 
            onClick={handlePrintFullWorkbook}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 font-hand font-bold text-lg bg-[#d8b4fe] hover:bg-[#c084fc] text-[#4c1d95] border-2 border-[#a855f7] transition-colors shadow-xs"
          >
            📑 Cetak Seluruh Scrapbook
          </button>

          {/* Switcher 4 Desain di Sidebar */}
          <div className="p-3 bg-[#faedcd]/70 rounded-2xl border-2 border-dashed border-[#d4a373] space-y-2">
            <p className="text-xs font-hand font-bold text-[#6b584a] flex items-center justify-between">
              <span>📓 Pilihan Gaya Desain:</span>
              <span className="bg-[#d4a373] text-white px-2 py-0.5 rounded-full text-[11px]">Style 2 Aktif</span>
            </p>
            <div className="grid grid-cols-2 gap-1.5 font-hand">
              <button
                type="button"
                onClick={() => onSelectStyle ? onSelectStyle(1) : (window.location.href = './index.html')}
                className="w-full py-2 px-1.5 font-bold text-sm bg-[#ffea79] hover:bg-[#fed049] text-[#422006] rounded-xl border border-[#ca8a04] transition-all shadow-xs flex items-center justify-center gap-1"
              >
                <span>⚡ Style 1</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectStyle ? onSelectStyle(2) : null}
                className="w-full py-2 px-1.5 font-bold text-sm bg-[#78350f] text-[#fefae0] rounded-xl border border-[#78350f] transition-all shadow-xs flex items-center justify-center gap-1"
              >
                <span>📓 Style 2</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectStyle ? onSelectStyle(3) : (window.location.href = './memphis.html')}
                className="w-full py-2 px-1.5 font-bold text-sm bg-[#06D6A0] hover:bg-[#05be8e] text-black rounded-xl border border-black transition-all shadow-xs flex items-center justify-center gap-1"
              >
                <span>🎨 Style 3</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectStyle ? onSelectStyle(4) : (window.location.href = './risograph.html')}
                className="w-full py-2 px-1.5 font-bold text-sm bg-[#FA2A55] hover:opacity-90 text-white rounded-xl border border-black transition-all shadow-xs flex items-center justify-center gap-1"
              >
                <span>🖨️ Style 4</span>
              </button>
            </div>
          </div>
          
          <div className="p-3 bg-[#fefae0] rounded-xl border border-dashed border-[#d4a373] text-xs font-hand text-center text-[#7c5335]">
            🔒 Semua catatan tersimpan secara otomatis & privat di browsermu.
          </div>

          <button 
            onClick={handleReset}
            className="w-full text-xs font-hand text-rose-600 hover:text-rose-800 underline text-center pt-1 block"
          >
            Kosongkan / Reset Catatan
          </button>
        </div>
      </nav>

      {/* Main Reading / Writing Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-14 overflow-y-auto print-area">
        <div className="max-w-4xl mx-auto">
          {printAll ? (
            <div className="space-y-12">
              <div className="border-b-4 border-dashed border-[#d4a373] pb-6 text-center mb-8">
                <h1 className="text-4xl sm:text-5xl font-serifHand font-bold text-[#4a3525]">
                  Buku Jurnal Scrapbook Kesehatan Mental Remaja
                </h1>
                {formData.profile.nama && (
                  <p className="font-hand text-2xl text-[#6b4e3d] mt-2">
                    Lembar Catatan Milik: <strong>{formData.profile.nama}</strong> {formData.profile.usia ? `(${formData.profile.usia})` : ''}
                  </p>
                )}
              </div>
              <section className="print-content"><Beranda data={formData} updateData={updateData} /></section>
              <div style={{ pageBreakBefore: 'always' }}></div>
              <section className="print-content"><MateriBacaan /></section>
              <div style={{ pageBreakBefore: 'always' }}></div>
              <section className="print-content"><JurnalEmosi data={formData} updateData={updateData} /></section>
              <div style={{ pageBreakBefore: 'always' }}></div>
              <section className="print-content"><KelolaPikiran data={formData} updateData={updateData} /></section>
              <div style={{ pageBreakBefore: 'always' }}></div>
              <section className="print-content"><KekuatanDiri data={formData} updateData={updateData} /></section>
              <div style={{ pageBreakBefore: 'always' }}></div>
              <section className="print-content"><Keseharian data={formData} updateData={updateData} /></section>
              <div style={{ pageBreakBefore: 'always' }}></div>
              <section className="print-content"><Support data={formData} updateData={updateData} /></section>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </main>
    </div>
  );
}
