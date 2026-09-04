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

/* --- MEMPHIS DESIGN DECORATIVE ATOMS --- */

// Polka Dot Pattern Box
const DotPattern = ({ className = "" }) => (
  <div 
    className={`absolute pointer-events-none opacity-25 ${className}`}
    style={{
      backgroundImage: 'radial-gradient(#000 2px, transparent 2px)',
      backgroundSize: '14px 14px'
    }}
  />
);

// Squiggle SVG Divider
const MemphisSquiggle = ({ color = "#FF006E", className = "" }) => (
  <svg className={`w-28 h-6 ${className}`} viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M0 10 Q 12.5 0, 25 10 T 50 10 T 75 10 T 100 10" 
      stroke={color} 
      strokeWidth="5" 
      strokeLinecap="round" 
      fill="transparent" 
    />
  </svg>
);

// Floating Geometric Confetti
const MemphisConfetti = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
    <div className="absolute top-4 left-6 w-5 h-5 rounded-full border-4 border-[#3A86FF] bg-[#FFBE0B]" />
    <div className="absolute top-12 right-10 w-6 h-6 border-4 border-black rotate-45 bg-[#FF006E]" />
    <div className="absolute bottom-6 left-12 text-2xl font-black text-[#8338EC]">+ +</div>
    <div className="absolute bottom-8 right-8 w-8 h-4 rounded-full border-3 border-black bg-[#06D6A0] -rotate-12" />
  </div>
);

// Memphis Card with offset colored shadow & bold black border
const MemphisCard = ({ 
  children, 
  bgColor = "bg-white", 
  shadowColor = "shadow-[6px_6px_0px_0px_#000000]", 
  className = "", 
  pattern = false,
  corner = "rounded-3xl"
}) => (
  <div className={`relative ${bgColor} border-4 border-black ${corner} p-6 sm:p-7 ${shadowColor} transition-transform hover:-translate-y-1 ${className}`}>
    {pattern && <DotPattern className="inset-0 rounded-3xl" />}
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

// Memphis Button
const MemphisButton = ({ children, onClick, color = "bg-[#FFBE0B]", active = false, className = "", type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    className={`border-4 border-black rounded-2xl px-5 py-3 font-extrabold uppercase tracking-wider text-sm sm:text-base transition-all
      ${active 
        ? `${color} translate-x-[4px] translate-y-[4px] shadow-none ring-2 ring-black` 
        : `${color} shadow-[5px_5px_0px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_#000000] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none`}
      ${className}`}
  >
    {children}
  </button>
);

// Memphis Input
const MemphisInput = ({ placeholder, value = "", onChange, className = "", ...props }) => (
  <input 
    type="text" 
    placeholder={placeholder} 
    value={value ?? ""}
    onChange={onChange}
    {...props}
    className={`w-full border-4 border-black rounded-2xl p-4 font-bold text-lg bg-white focus:bg-[#FFF3B0] focus:outline-none shadow-[4px_4px_0px_0px_#000000] transition-colors placeholder:text-gray-400 ${className}`} 
  />
);

// Memphis TextArea
const MemphisTextArea = ({ placeholder, rows = 3, value = "", onChange, className = "", ...props }) => (
  <textarea 
    rows={rows}
    placeholder={placeholder} 
    value={value ?? ""}
    onChange={onChange}
    {...props}
    className={`w-full border-4 border-black rounded-2xl p-4 font-bold text-lg bg-white focus:bg-[#FFF3B0] focus:outline-none shadow-[4px_4px_0px_0px_#000000] transition-colors resize-none placeholder:text-gray-400 ${className}`} 
  />
);

// Memphis Sticker Pill
const MemphisPill = ({ label, selected, onClick, emoji = "✨", color = "bg-[#FFBE0B]" }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center gap-2 border-3 border-black rounded-full px-4 py-2 font-black text-sm tracking-wide transition-all transform active:scale-95
      ${selected 
        ? `${color} shadow-[3px_3px_0px_0px_#000000] -translate-y-0.5 rotate-1 ring-2 ring-black` 
        : 'bg-white hover:bg-gray-100 shadow-[2px_2px_0px_0px_#000000]'}`}
  >
    <span>{emoji}</span>
    <span>{label}</span>
  </button>
);

/* --- SECTIONS / MODUL MEMPHIS --- */

const Beranda = ({ data, updateData }) => (
  <div className="space-y-8 animate-fade-in print-content">
    {/* Big Arched Memphis Hero Banner */}
    <div className="relative bg-[#FFBE0B] border-4 border-black rounded-[40px] p-8 sm:p-12 text-center shadow-[10px_10px_0px_0px_#000000] overflow-hidden">
      <MemphisConfetti />
      <DotPattern className="inset-0" />
      
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 bg-[#FF006E] text-white border-3 border-black px-4 py-1.5 rounded-full font-black text-sm uppercase tracking-widest mb-4 rotate-[-2deg] shadow-[3px_3px_0px_0px_#000]">
          ⚡ Youth Mental Health Hub
        </div>
        
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-black leading-none mb-4">
          Kesehatan<br/>Mental Remaja
        </h1>
        
        <div className="flex justify-center my-3">
          <MemphisSquiggle color="#000000" className="w-36 h-8" />
        </div>

        <p className="text-xl sm:text-2xl font-black text-black bg-white inline-block px-5 py-2 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_#FF006E] mt-2">
          Kenali Diri • Kelola Emosi • Bangun Hidup yang Lebih Baik
        </p>
      </div>
    </div>

    {/* Profil & Disclaimer Grid */}
    <div className="grid md:grid-cols-2 gap-8">
      <MemphisCard bgColor="bg-[#3A86FF]" shadowColor="shadow-[8px_8px_0px_0px_#000000]" pattern={true}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black uppercase text-white flex items-center gap-2">
            🏷️ Profil Remaja
          </h2>
          <span className="bg-[#FFBE0B] border-2 border-black font-black text-xs px-2.5 py-1 rounded-full uppercase">
            Workbook ID
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="font-black text-white block mb-1">Nama Panggilan:</label>
            <MemphisInput 
              placeholder="Siapa namamu?" 
              value={data.profile.nama}
              onChange={(e) => updateData('profile', 'nama', e.target.value)}
            />
          </div>
          <div>
            <label className="font-black text-white block mb-1">Kelas / Usia:</label>
            <MemphisInput 
              placeholder="Berapa usiamu?" 
              value={data.profile.usia}
              onChange={(e) => updateData('profile', 'usia', e.target.value)}
            />
          </div>
        </div>
      </MemphisCard>

      <MemphisCard bgColor="bg-[#FF006E]" shadowColor="shadow-[8px_8px_0px_0px_#000000]">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-3xl">🛡️</span>
          <h2 className="text-2xl font-black uppercase text-white tracking-wide">
            DISCLAIMER
          </h2>
        </div>
        <p className="font-bold text-lg text-white leading-relaxed mb-4">
          Buku (aplikasi) ini adalah bahan edukasi (self-help) untuk berlatih sehari-hari, bukan pengganti diagnosis atau perawatan profesional.
        </p>
        <div className="bg-white p-4 rounded-2xl border-3 border-black text-black font-extrabold text-base shadow-[4px_4px_0px_0px_#000]">
          💛 Jika masalah terasa terlalu berat, ceritakan kepada orang dewasa yang kamu percaya atau tenaga profesional.
        </div>
      </MemphisCard>
    </div>

    {/* Cara Pakai Infografis */}
    <MemphisCard bgColor="bg-[#06D6A0]" shadowColor="shadow-[8px_8px_0px_0px_#000000]">
      <h3 className="text-2xl sm:text-3xl font-black uppercase mb-3 text-black">
        🎲 Panduan Petualangan Workbook Ini
      </h3>
      <div className="grid sm:grid-cols-3 gap-4 mt-4 font-bold text-black">
        <div className="bg-white p-4 rounded-2xl border-3 border-black shadow-[3px_3px_0px_0px_#000]">
          <div className="text-3xl mb-2">📖</div>
          <h4 className="font-black uppercase mb-1">Teman Sehari-hari</h4>
          <p className="text-sm">Baca sesuai kebutuhanmu, tanpa harus dipaksa selesai sekaligus.</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border-3 border-black shadow-[3px_3px_0px_0px_#000]">
          <div className="text-3xl mb-2">🎯</div>
          <h4 className="font-black uppercase mb-1">Jujur Tanpa Takut</h4>
          <p className="text-sm">Tidak ada jawaban salah atau ujian nilai. Ini ruang ekspresi bebasmu.</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border-3 border-black shadow-[3px_3px_0px_0px_#000]">
          <div className="text-3xl mb-2">💾</div>
          <h4 className="font-black uppercase mb-1">Privat & Fleksibel</h4>
          <p className="text-sm">Data otomatis tersimpan di perambanmu dan dapat dicetak ke PDF kapan saja.</p>
        </div>
      </div>
    </MemphisCard>
  </div>
);

const MateriBacaan = () => {
  const [activeArticle, setActiveArticle] = useState(null);

  const articles = [
    {
      id: 1,
      tag: "LEVEL 01",
      title: "Mengenal Kesehatan Mental",
      color: "bg-[#FF006E]",
      shadow: "shadow-[6px_6px_0px_0px_#FFBE0B]",
      textColor: "text-white",
      excerpt: "Mental yang sehat bukan berarti kamu harus selalu bahagia.",
      content: (
        <div className="space-y-4 font-bold text-lg text-black">
          <p>Mental yang sehat bukan berarti kamu harus selalu bahagia atau tersenyum 24 jam sehari. Kamu tetap berhak merasa sedih, kecewa, marah, takut, atau cemas.</p>
          <p>Yang penting adalah belajar mengenali emosi tersebut, mengelolanya dengan cara yang sehat, dan tahu kapan perlu meminta bantuan kawan atau ahli.</p>
          <div className="bg-[#FFF3B0] p-4 border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000] mt-4">
            <strong className="block text-xl uppercase font-black mb-1">⚡ Ingat Baik-Baik:</strong>
            Sama seperti tubuh yang bisa sakit flu atau pegal, pikiran dan emosi kita juga bisa merasa lelah dan butuh dirawat!
          </div>
        </div>
      )
    },
    {
      id: 2,
      tag: "LEVEL 02",
      title: "Pikiranmu Seperti Baterai HP",
      color: "bg-[#3A86FF]",
      shadow: "shadow-[6px_6px_0px_0px_#06D6A0]",
      textColor: "text-white",
      excerpt: "Apa yang terjadi kalau aplikasi berjalan terlalu banyak?",
      content: (
        <div className="space-y-6 font-bold text-black">
          <p className="text-lg">Kalau baterai HP hampir habis, puluhan aplikasi berjalan di latar belakang, dan tidak pernah dicas, HP bisa menjadi lambat atau bahkan mati mendadak. Pikiranmu juga membutuhkan waktu istirahat, dukungan, dan waktu untuk pulih.</p>
          
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="bg-[#FFBE0B] p-5 border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000]">
              <h4 className="text-xl font-black uppercase text-black mb-2">🪫 Baterai Menipis</h4>
              <p className="text-sm">Disebabkan oleh kurang tidur, tekanan tugas sekolah, konflik dengan teman/keluarga, atau terlalu banyak tuntutan dari sekitar.</p>
            </div>
            <div className="bg-[#FF006E] p-5 border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000] text-white">
              <h4 className="text-xl font-black uppercase mb-2">🐌 Sistem Melambat</h4>
              <p className="text-sm">Akibatnya kamu jadi sulit fokus, mudah marah atau tersinggung, kehilangan motivasi, atau merasa kewalahan menghadapi hari.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      tag: "LEVEL 03",
      title: "Emosi Bukanlah Musuh",
      color: "bg-[#8338EC]",
      shadow: "shadow-[6px_6px_0px_0px_#FF006E]",
      textColor: "text-white",
      excerpt: "Mengapa kita merasakan marah, sedih, atau takut?",
      content: (
        <div className="space-y-4 font-bold text-lg text-black">
          <p>Banyak orang mengira emosi negatif itu buruk dan harus ditekan atau disembunyikan. Padahal, emosi bukanlah musuh.</p>
          <p>Marah, sedih, kecewa, takut, atau malu adalah <strong>sinyal</strong> bahwa ada sesuatu yang sedang terjadi dalam diri kita atau di sekitar kita yang butuh perhatian.</p>
          <ul className="space-y-2 bg-[#06D6A0] p-4 border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000] text-black mt-4">
            <li className="flex items-center gap-2">🔹 Yang penting bukan menghilangkan emosinya.</li>
            <li className="flex items-center gap-2">🔹 Tetapi belajar mengenali apa yang kita rasakan.</li>
            <li className="flex items-center gap-2">🔹 Memahami mengapa kita merasakannya.</li>
            <li className="flex items-center gap-2">🔹 Dan meresponsnya dengan cara yang lebih sehat (tanpa menyakiti diri sendiri atau orang lain).</li>
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
          className="font-black text-base uppercase flex items-center gap-2 border-4 border-black px-5 py-2.5 rounded-full bg-white hover:bg-[#FFBE0B] shadow-[4px_4px_0px_0px_#000] no-print transition-all"
        >
          ⬅ Kembali ke Daftar Materi
        </button>

        <MemphisCard bgColor="bg-white" shadowColor="shadow-[10px_10px_0px_0px_#000000]">
          <div className="inline-block px-3.5 py-1 rounded-full border-3 border-black font-black text-xs text-white uppercase mb-3 bg-[#FF006E]">
            {article.tag}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase mb-6 text-black border-b-4 border-black pb-4">
            {article.title}
          </h2>
          {article.content}
        </MemphisCard>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in print-content">
      <div className="bg-white border-4 border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_#FF006E]">
        <h2 className="text-3xl sm:text-4xl font-black uppercase mb-1">📚 Pojok Baca & Refleksi</h2>
        <p className="font-bold text-lg text-gray-700">Pahami dirimu lewat rangkuman materi visual yang segar dan mudah dipahami.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <div 
            key={article.id} 
            onClick={() => setActiveArticle(article.id)}
            className={`border-4 border-black rounded-3xl p-6 ${article.color} shadow-[8px_8px_0px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#000000] transition-all cursor-pointer flex flex-col justify-between select-none`}
          >
            <div>
              <span className="inline-block bg-black text-white text-xs font-black px-3 py-1 rounded-full uppercase mb-3">
                {article.tag}
              </span>
              <h3 className={`text-2xl font-black uppercase mb-3 ${article.textColor}`}>
                {article.title}
              </h3>
              <p className="font-bold text-base text-white/95 mb-6">
                {article.excerpt}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-[#FFBE0B] text-black font-black text-sm uppercase px-4 py-2 border-3 border-black rounded-xl shadow-[3px_3px_0px_0px_#000]">
                Baca Sekarang ➔
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const JurnalEmosi = ({ data, updateData }) => {
  const emosiList = [
    { label: "Senang", emoji: "☀️", color: "bg-[#FFBE0B]" },
    { label: "Tenang", emoji: "🍃", color: "bg-[#06D6A0]" },
    { label: "Biasa saja", emoji: "☁️", color: "bg-[#E2E8F0]" },
    { label: "Sedih", emoji: "🌧️", color: "bg-[#4CC9F0]" },
    { label: "Marah", emoji: "⚡", color: "bg-[#FF006E]" },
    { label: "Cemas", emoji: "🌀", color: "bg-[#FF9E00]" },
    { label: "Bingung", emoji: "❓", color: "bg-[#8338EC]" },
    { label: "Malu", emoji: "🙈", color: "bg-[#FF5D8F]" },
    { label: "Kecewa", emoji: "💔", color: "bg-[#FF758F]" },
    { label: "Lelah", emoji: "🪫", color: "bg-[#CBD5E1]" },
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
      <div className="bg-[#FF006E] border-4 border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_#000000] text-white">
        <h2 className="text-3xl font-black uppercase mb-1">🤝 Emotion Diary</h2>
        <p className="font-bold text-lg">Kenali gelombang emosimu tanpa mencela dirimu sendiri.</p>
      </div>

      <MemphisCard bgColor="bg-white" shadowColor="shadow-[8px_8px_0px_0px_#3A86FF]">
        <h3 className="text-2xl font-black uppercase mb-4">A. Emosi apa yang kurasakan hari ini?</h3>
        <div className="flex flex-wrap gap-2.5">
          {emosiList.map(item => (
            <MemphisPill 
              key={item.label}
              label={item.label}
              emoji={item.emoji}
              color={item.color}
              selected={selectedEmosi.includes(item.label)}
              onClick={() => toggleEmosi(item.label)}
            />
          ))}
        </div>
      </MemphisCard>

      <div className="grid md:grid-cols-2 gap-8">
        <MemphisCard bgColor="bg-[#FFBE0B]" shadowColor="shadow-[8px_8px_0px_0px_#000000]">
          <h3 className="text-xl font-black uppercase mb-1">B. Apa yang terjadi?</h3>
          <p className="font-bold text-sm mb-2 text-black/80">Tuliskan situasi pemicu yang mempengaruhi emosimu.</p>
          <MemphisTextArea 
            placeholder="Misal: Dimarahi orang tua karena terlambat pulang..." 
            rows={4}
            value={data.jurnalEmosi.situasi}
            onChange={(e) => updateData('jurnalEmosi', 'situasi', e.target.value)}
          />
        </MemphisCard>

        <MemphisCard bgColor="bg-[#06D6A0]" shadowColor="shadow-[8px_8px_0px_0px_#000000]">
          <h3 className="text-xl font-black uppercase mb-1">C. Apa yang kupikirkan?</h3>
          <p className="font-bold text-sm mb-2 text-black/80">Pikiran atau praduga yang bermunculan.</p>
          <MemphisTextArea 
            placeholder="Misal: Orang tua tidak menyayangiku dan tidak peduli alasan..." 
            rows={4}
            value={data.jurnalEmosi.pikiran}
            onChange={(e) => updateData('jurnalEmosi', 'pikiran', e.target.value)}
          />
        </MemphisCard>
      </div>

      <MemphisCard bgColor="bg-white" shadowColor="shadow-[8px_8px_0px_0px_#8338EC]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-black uppercase">D. Seberapa kuat emosinya? (1-10)</h3>
          <span className="text-2xl font-black bg-[#FFBE0B] border-3 border-black px-4 py-1 rounded-full shadow-[3px_3px_0px_0px_#000]">
            Skor: {data.jurnalEmosi.intensitas || 5}
          </span>
        </div>
        <input 
          type="range" 
          min="1" 
          max="10" 
          value={data.jurnalEmosi.intensitas || 5} 
          onChange={(e) => updateData('jurnalEmosi', 'intensitas', parseInt(e.target.value))}
          className="w-full accent-black h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer border-3 border-black no-print" 
        />
        <div className="flex justify-between font-black text-lg mt-3">
          <span>🌱 1 (Ringan)</span>
          <span>⚡ 5 (Sedang)</span>
          <span>🌊 10 (Sangat Kuat)</span>
        </div>
      </MemphisCard>

      <div className="grid md:grid-cols-2 gap-8">
        <MemphisCard bgColor="bg-white" shadowColor="shadow-[8px_8px_0px_0px_#000000]">
          <h3 className="text-xl font-black uppercase mb-2">E. Apa yang kulakukan setelahnya?</h3>
          <MemphisTextArea 
            placeholder="Misal: Menangis di kamar, mogok bicara..." 
            rows={3}
            value={data.jurnalEmosi.tindakan}
            onChange={(e) => updateData('jurnalEmosi', 'tindakan', e.target.value)}
          />
        </MemphisCard>

        <MemphisCard bgColor="bg-[#3A86FF]" shadowColor="shadow-[8px_8px_0px_0px_#000000]">
          <h3 className="text-xl font-black uppercase mb-2 text-white">F. Alternatif Respon Sehat</h3>
          <MemphisTextArea 
            placeholder="Berusaha tenang dengan relaksasi napas, menjelaskan pelan-pelan..." 
            rows={3}
            value={data.jurnalEmosi.alternatif}
            onChange={(e) => updateData('jurnalEmosi', 'alternatif', e.target.value)}
          />
        </MemphisCard>
      </div>

      <div className="bg-black text-white p-6 rounded-3xl border-4 border-[#FF006E] font-bold flex gap-4 items-center shadow-[8px_8px_0px_0px_#FFBE0B]">
        <span className="text-4xl shrink-0">🌱</span>
        <p className="text-lg">
          "Aku tidak harus memusnahkan semua emosi. Aku sedang belajar memahaminya. Emosi bukanlah musuh, melainkan kawan yang membunyikan sinyal."
        </p>
      </div>
    </div>
  );
};

const KelolaPikiran = ({ data, updateData }) => (
  <div className="space-y-8 animate-fade-in print-content">
    <div className="bg-[#3A86FF] border-4 border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_#000000] text-white">
      <h2 className="text-3xl font-black uppercase mb-1">🧠 Stop Overthinking</h2>
      <p className="font-bold text-lg">Periksa pikiranmu, cari fakta konkret, lalu pilih langkah kecil.</p>
    </div>

    {/* STOP Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { l: 'S', title: 'STOP', desc: 'Berhenti sejenak dari pikiran yang berputar liar.', c: 'bg-[#FFBE0B]' },
        { l: 'T', title: 'TAKE A BREATH', desc: 'Tarik napas perlahan dan embuskan 3 kali.', c: 'bg-[#06D6A0]' },
        { l: 'O', title: 'OBSERVE', desc: 'Amati pikiran, perasaan, dan fakta yang nyata.', c: 'bg-[#FF006E]', text: 'text-white' },
        { l: 'P', title: 'PROCEED', desc: 'Pilih satu tindakan kecil yang realistis.', c: 'bg-white' }
      ].map(item => (
        <div key={item.l} className={`${item.c} border-4 border-black rounded-3xl p-5 text-center shadow-[6px_6px_0px_0px_#000000] flex flex-col items-center justify-center`}>
          <div className="w-16 h-16 rounded-full bg-white text-black border-4 border-black flex items-center justify-center text-4xl font-black mb-2 shadow-[3px_3px_0px_0px_#000]">
            {item.l}
          </div>
          <h3 className={`font-black text-lg uppercase mb-1 ${item.text || 'text-black'}`}>{item.title}</h3>
          <p className={`font-bold text-xs ${item.text || 'text-black'}`}>{item.desc}</p>
        </div>
      ))}
    </div>

    <MemphisCard bgColor="bg-white" shadowColor="shadow-[8px_8px_0px_0px_#06D6A0]">
      <h3 className="text-2xl font-black uppercase mb-4">🔍 Tantang Pikiranmu</h3>
      <div className="space-y-4">
        <div>
          <label className="font-black block mb-2">Pikiran otomatis yang terus mengganggu:</label>
          <MemphisTextArea 
            placeholder="Sebutkan hal yang mengganggumu..." 
            rows={2}
            value={data.kelolaPikiran.pikiranMuncul}
            onChange={(e) => updateData('kelolaPikiran', 'pikiranMuncul', e.target.value)}
          />
        </div>
        <div>
          <label className="font-black block mb-2 text-[#06D6A0] bg-black inline-block px-3 py-1 rounded-xl">
            Pikiran/Tindakan yang lebih realistis dan membantu:
          </label>
          <MemphisTextArea 
            placeholder="Contoh: Aku tidak harus percaya pada setiap asumsi di kepalaku..." 
            rows={2}
            value={data.kelolaPikiran.pikiranRealistis}
            onChange={(e) => updateData('kelolaPikiran', 'pikiranRealistis', e.target.value)}
          />
        </div>
      </div>
    </MemphisCard>

    <MemphisCard bgColor="bg-[#FFBE0B]" shadowColor="shadow-[8px_8px_0px_0px_#FF006E]">
      <h2 className="text-3xl font-black uppercase mb-2">🧊 Grounding 5-4-3-2-1</h2>
      <p className="font-bold mb-5">Kembalikan perhatian ke apa yang sedang terjadi di sekitarmu saat ini. Sebutkan...</p>

      <div className="space-y-3">
        {[
          { n: '5', label: 'Hal yang bisa kamu LIHAT', key: 'lihat' },
          { n: '4', label: 'Hal yang bisa kamu SENTUH', key: 'sentuh' },
          { n: '3', label: 'Suara yang bisa kamu DENGAR', key: 'dengar' },
          { n: '2', label: 'Aroma yang bisa kamu CIUM', key: 'cium' },
          { n: '1', label: 'Hal yang bisa kamu RASAKAN', key: 'rasakan' },
        ].map(item => (
          <div key={item.n} className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center text-2xl font-black shrink-0 shadow-[3px_3px_0px_0px_#FFF]">
              {item.n}
            </span>
            <MemphisInput 
              placeholder={item.label}
              value={data.kelolaPikiran[item.key]}
              onChange={(e) => updateData('kelolaPikiran', item.key, e.target.value)}
            />
          </div>
        ))}
      </div>
    </MemphisCard>
  </div>
);

const KekuatanDiri = ({ data, updateData }) => {
  const needsList = ["Didengarkan", "Istirahat", "Dukungan", "Waktu", "Bantuan masalah", "Ruang mencoba lagi"];
  const selectedNeeds = data.kekuatanDiri.selectedNeeds || [];

  const toggleNeed = (need) => {
    if (selectedNeeds.includes(need)) {
      updateData('kekuatanDiri', 'selectedNeeds', selectedNeeds.filter(n => n !== need));
    } else {
      updateData('kekuatanDiri', 'selectedNeeds', [...selectedNeeds, need]);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in print-content">
      <div className="bg-[#8338EC] border-4 border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_#000000] text-white">
        <h2 className="text-3xl font-black uppercase mb-1">✨ Aku Punya Kekuatan</h2>
        <p className="font-bold text-lg">Kenali kelebihan dan hal baik yang pernah kamu lakukan.</p>
      </div>

      <MemphisCard bgColor="bg-white" shadowColor="shadow-[8px_8px_0px_0px_#FFBE0B]">
        <h3 className="text-2xl font-black uppercase mb-4">3 Hal yang pernah kulakukan dengan baik:</h3>
        <div className="space-y-3 mb-6">
          <MemphisInput 
            placeholder="1." 
            value={data.kekuatanDiri.halBaik1}
            onChange={(e) => updateData('kekuatanDiri', 'halBaik1', e.target.value)}
          />
          <MemphisInput 
            placeholder="2." 
            value={data.kekuatanDiri.halBaik2}
            onChange={(e) => updateData('kekuatanDiri', 'halBaik2', e.target.value)}
          />
          <MemphisInput 
            placeholder="3." 
            value={data.kekuatanDiri.halBaik3}
            onChange={(e) => updateData('kekuatanDiri', 'halBaik3', e.target.value)}
          />
        </div>

        <h3 className="text-2xl font-black uppercase mb-2 border-t-4 border-black pt-4">
          Hal berat yang pernah berhasil kulewati:
        </h3>
        <MemphisTextArea 
          placeholder="Ceritakan sedikit perjuanganmu..." 
          rows={2}
          value={data.kekuatanDiri.halBerat}
          onChange={(e) => updateData('kekuatanDiri', 'halBerat', e.target.value)}
        />
      </MemphisCard>

      <MemphisCard bgColor="bg-[#FF006E]" shadowColor="shadow-[8px_8px_0px_0px_#000000]">
        <h2 className="text-3xl font-black uppercase mb-2 text-white">
          🌸 Bicara Baik Pada Diri (Self-Compassion)
        </h2>
        <p className="font-bold text-white mb-4">
          Bayangkan sahabatmu mengalami masalah yang sama. Apa yang akan kamu katakan kepadanya?
        </p>
        <div className="space-y-4">
          <div>
            <label className="font-black text-white block mb-1">
              Kalimat yang biasanya kukatakan pada diriku (saat down):
            </label>
            <MemphisTextArea 
              placeholder="..." 
              rows={2}
              value={data.kekuatanDiri.selfTalkDown}
              onChange={(e) => updateData('kekuatanDiri', 'selfTalkDown', e.target.value)}
            />
          </div>
          <div>
            <label className="font-black text-white block mb-1">
              Kalimat yang lebih RAMAH dan REALISTIS:
            </label>
            <MemphisTextArea 
              placeholder="..." 
              rows={2}
              className="bg-[#FFF3B0]"
              value={data.kekuatanDiri.selfTalkRamah}
              onChange={(e) => updateData('kekuatanDiri', 'selfTalkRamah', e.target.value)}
            />
          </div>
        </div>
      </MemphisCard>

      <MemphisCard bgColor="bg-[#06D6A0]" shadowColor="shadow-[8px_8px_0px_0px_#000000]">
        <h3 className="text-2xl font-black uppercase mb-4 text-black">
          Apa yang sebenarnya kubutuhkan saat ini?
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {needsList.map(need => {
            const isChecked = selectedNeeds.includes(need);
            return (
              <label 
                key={need}
                onClick={() => toggleNeed(need)}
                className={`flex items-center gap-3 font-black text-base cursor-pointer border-4 border-black p-3.5 rounded-2xl shadow-[4px_4px_0px_0px_#000] transition-all select-none
                  ${isChecked ? 'bg-[#FFBE0B] -translate-y-1' : 'bg-white hover:bg-gray-50'}`}
              >
                <input 
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}}
                  className="w-6 h-6 border-3 border-black accent-[#FF006E] pointer-events-none"
                />
                <span>{need}</span>
              </label>
            );
          })}
        </div>
      </MemphisCard>
    </div>
  );
};

const Keseharian = ({ data, updateData }) => {
  const habits = [
    "Buka sosmed tanpa tujuan",
    "Membandingkan diri di internet",
    "Sulit berhenti scrolling",
    "Layar sampai ganggu tidur"
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
      <div className="bg-[#FFBE0B] border-4 border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_#000000]">
        <h2 className="text-3xl font-black uppercase mb-1">📴 Keseharian & Evaluasi</h2>
        <p className="font-bold text-lg">Menghargai hal kecil, mengelola stres, dan menjaga batasan layar.</p>
      </div>

      <MemphisCard bgColor="bg-white" shadowColor="shadow-[8px_8px_0px_0px_#FF006E]">
        <h3 className="text-2xl font-black uppercase mb-2">🌻 Syukur Hari Ini (Gratitude Journal)</h3>
        <p className="font-bold mb-4 text-gray-700">Menyadari hal baik yang tetap ada di tengah hari yang tidak sempurna.</p>
        <div className="space-y-4">
          <MemphisTextArea 
            placeholder="Hari ini aku bersyukur karena..." 
            rows={2}
            value={data.keseharian.syukur1}
            onChange={(e) => updateData('keseharian', 'syukur1', e.target.value)}
          />
          <MemphisTextArea 
            placeholder="Mengapa ini berarti bagiku?" 
            rows={2}
            value={data.keseharian.syukur2}
            onChange={(e) => updateData('keseharian', 'syukur2', e.target.value)}
          />
          <MemphisTextArea 
            placeholder="Hal kecil yang ingin aku nikmati besok:" 
            rows={2}
            value={data.keseharian.syukur3}
            onChange={(e) => updateData('keseharian', 'syukur3', e.target.value)}
          />
        </div>
      </MemphisCard>

      <div className="grid md:grid-cols-2 gap-8">
        <MemphisCard bgColor="bg-[#FFBE0B]" shadowColor="shadow-[8px_8px_0px_0px_#000000]">
          <h3 className="text-2xl font-black uppercase mb-2">Stress Diary</h3>
          <p className="font-bold text-sm mb-4">Kenali sumber stres dan pilih respons sehat.</p>
          <div className="space-y-4">
            <MemphisInput 
              placeholder="Situasi saat ini (cth: tugas banyak)" 
              value={data.keseharian.stressSituasi}
              onChange={(e) => updateData('keseharian', 'stressSituasi', e.target.value)}
            />
            <MemphisInput 
              placeholder="Apa yang bisa kukontrol? (cth: tidak menunda)" 
              value={data.keseharian.stressKontrol}
              onChange={(e) => updateData('keseharian', 'stressKontrol', e.target.value)}
            />
            <MemphisInput 
              placeholder="Langkah kecil (cth: kerjakan 30 menit)" 
              value={data.keseharian.stressLangkah}
              onChange={(e) => updateData('keseharian', 'stressLangkah', e.target.value)}
            />
          </div>
        </MemphisCard>

        <MemphisCard bgColor="bg-[#06D6A0]" shadowColor="shadow-[8px_8px_0px_0px_#000000]">
          <h3 className="text-2xl font-black uppercase mb-4">Cek Kebiasaan Digital</h3>
          <div className="space-y-3">
            {habits.map((item, i) => (
              <label 
                key={i}
                onClick={() => toggleHabit(item)}
                className="flex items-start gap-3 font-black cursor-pointer select-none"
              >
                <input 
                  type="checkbox"
                  checked={digitalHabits.includes(item)}
                  onChange={() => {}}
                  className="w-6 h-6 mt-1 border-3 border-black accent-[#FF006E] pointer-events-none"
                />
                <span className={digitalHabits.includes(item) ? "line-through opacity-80" : ""}>{item}</span>
              </label>
            ))}
            <div className="mt-4 pt-4 border-t-4 border-black">
              <label className="font-black mb-2 block">Satu batas digital yang kupilih:</label>
              <MemphisInput 
                placeholder="Misal: HP jauh dari kasur" 
                value={data.keseharian.batasDigital}
                onChange={(e) => updateData('keseharian', 'batasDigital', e.target.value)}
              />
            </div>
          </div>
        </MemphisCard>
      </div>
    </div>
  );
};

const Support = ({ data, updateData }) => (
  <div className="space-y-8 animate-fade-in print-content">
    <div className="bg-[#06D6A0] border-4 border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_#000000]">
      <h2 className="text-3xl font-black uppercase mb-1">👥 Support Circle & Rencana</h2>
      <p className="font-bold text-lg">Petakan dukungan sekitar dan rencanakan kebaikan untuk dirimu.</p>
    </div>

    <MemphisCard bgColor="bg-white" shadowColor="shadow-[8px_8px_0px_0px_#3A86FF]">
      <h3 className="text-2xl font-black uppercase mb-4">Apakah Pertemananmu Sehat?</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[#C7F9CC] border-4 border-black p-5 rounded-2xl shadow-[4px_4px_0px_#000]">
          <h4 className="font-black text-lg mb-2 flex items-center gap-2">😊 Teman Sehat Biasanya:</h4>
          <ul className="list-disc list-inside font-bold space-y-1">
            <li>Mau mendengarkan & menghargai</li>
            <li>Tidak memaksa / mempermalukan</li>
            <li>Bisa beda pendapat tanpa menjatuhkan</li>
            <li>Menghargai saat kamu bilang "Tidak"</li>
          </ul>
        </div>
        <div className="bg-[#FFCCD5] border-4 border-black p-5 rounded-2xl shadow-[4px_4px_0px_#000]">
          <h4 className="font-black text-lg mb-2 flex items-center gap-2">😞 Waspada Jika Teman:</h4>
          <ul className="list-disc list-inside font-bold space-y-1">
            <li>Terus memaksa setelah ditolak</li>
            <li>Mengancam / membuat merasa bersalah</li>
            <li>Menyebarkan rahasiamu</li>
            <li>Menghukummu karena menolak sesuatu</li>
          </ul>
        </div>
      </div>

      <h3 className="text-2xl font-black uppercase mt-8 mb-4 border-t-4 border-black pt-4">
        Orang Tempat Bercerita:
      </h3>
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <MemphisInput 
            placeholder="Siapa?" 
            className="sm:w-1/3"
            value={data.support.cerita1Nama}
            onChange={(e) => updateData('support', 'cerita1Nama', e.target.value)}
          />
          <MemphisInput 
            placeholder="Kapan bisa dihubungi?" 
            className="sm:w-2/3"
            value={data.support.cerita1Waktu}
            onChange={(e) => updateData('support', 'cerita1Waktu', e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <MemphisInput 
            placeholder="Siapa?" 
            className="sm:w-1/3"
            value={data.support.cerita2Nama}
            onChange={(e) => updateData('support', 'cerita2Nama', e.target.value)}
          />
          <MemphisInput 
            placeholder="Kapan bisa dihubungi?" 
            className="sm:w-2/3"
            value={data.support.cerita2Waktu}
            onChange={(e) => updateData('support', 'cerita2Waktu', e.target.value)}
          />
        </div>
      </div>
    </MemphisCard>

    <MemphisCard bgColor="bg-[#FFBE0B]" shadowColor="shadow-[8px_8px_0px_0px_#FF006E]">
      <h3 className="text-2xl font-black uppercase mb-2">🎯 Rencana Kecilku</h3>
      <p className="font-bold mb-4">Mulai saat ini, aku mengizinkan diriku berproses semakin baik.</p>
      <div className="space-y-4">
        <div>
          <label className="font-black block mb-1">Satu kebiasaan yang ingin kutingkatkan:</label>
          <MemphisInput 
            placeholder="..." 
            value={data.support.rencanaTingkatkan}
            onChange={(e) => updateData('support', 'rencanaTingkatkan', e.target.value)}
          />
        </div>
        <div>
          <label className="font-black block mb-1">Satu hal yang ingin kukurangi:</label>
          <MemphisInput 
            placeholder="..." 
            value={data.support.rencanaKurangi}
            onChange={(e) => updateData('support', 'rencanaKurangi', e.target.value)}
          />
        </div>
        <div>
          <label className="font-black block mb-1">Satu aktivitas yang ingin kulakukan untuk diriku:</label>
          <MemphisInput 
            placeholder="..." 
            value={data.support.rencanaAktivitas}
            onChange={(e) => updateData('support', 'rencanaAktivitas', e.target.value)}
          />
        </div>
      </div>
    </MemphisCard>
  </div>
);

/* --- MAIN MEMPHIS APP --- */

export default function MemphisApp({
  formData: propFormData,
  updateData: propUpdateData,
  activeTab: propActiveTab,
  setActiveTab: propSetActiveTab,
  onSelectStyle,
  currentStyle = 3,
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
    if (window.confirm("Apakah kamu yakin ingin mengosongkan seluruh formulir?")) {
      setLocalFormData(defaultData);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (err) {}
    }
  });

  const tabs = [
    { id: 'beranda', label: 'Beranda', icon: '📖', color: 'bg-[#FFBE0B]' },
    { id: 'bacaan', label: 'Materi Bacaan', icon: '📚', color: 'bg-[#06D6A0]' },
    { id: 'emosi', label: 'Jurnal Emosi', icon: '🤝', color: 'bg-[#FF006E]' },
    { id: 'pikiran', label: 'Kelola Pikiran', icon: '🧠', color: 'bg-[#3A86FF]' },
    { id: 'kekuatan', label: 'Kekuatan Diri', icon: '✨', color: 'bg-[#8338EC]' },
    { id: 'keseharian', label: 'Keseharian', icon: '📴', color: 'bg-[#FF9E00]' },
    { id: 'support', label: 'Support & Rencana', icon: '👥', color: 'bg-[#06D6A0]' },
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
    <div className="min-h-screen bg-[#FFFDF7] text-black font-sans selection:bg-[#FF006E] selection:text-white flex flex-col md:flex-row print-layout">
      
      {/* Background Retro Memphis Dots */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-15 z-0"
        style={{
          backgroundImage: 'radial-gradient(#3A86FF 2px, transparent 2px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Mobile Top Header */}
      <div className="md:hidden border-b-4 border-black bg-white p-4 flex justify-between items-center sticky top-0 z-50 no-print shadow-md">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-[#FF006E] border-3 border-black flex items-center justify-center text-white text-xs font-black">
            M
          </span>
          <h1 className="font-black text-xl uppercase tracking-tighter">Memphis Mental</h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="border-3 border-black px-3 py-1 rounded-xl bg-[#FFBE0B] shadow-[2px_2px_0px_#000] font-black text-lg"
        >
          {isMobileMenuOpen ? '✖' : '☰ MENU'}
        </button>
      </div>

      {/* Sidebar Memphis Navigation */}
      <nav className={`
        ${isMobileMenuOpen ? 'block' : 'hidden'} 
        md:flex flex-col w-full md:w-80 shrink-0 bg-white border-r-4 border-black p-6 md:sticky md:top-0 md:h-screen md:overflow-y-auto z-40
        absolute md:relative left-0 top-[65px] md:top-0 h-[calc(100vh-65px)] border-b-4 md:border-b-0 no-print shadow-xl
      `}>
        {/* Brand Logo */}
        <div className="hidden md:block mb-8 relative">
          <div className="bg-[#FF006E] text-white border-4 border-black p-4 rounded-3xl shadow-[5px_5px_0px_0px_#000] -rotate-1">
            <h1 className="text-3xl font-black uppercase leading-none tracking-tight">
              MEMPHIS
            </h1>
            <p className="text-sm font-extrabold text-[#FFBE0B] uppercase mt-1">
              ★ Mental Health Journal ★
            </p>
          </div>
          <div className="absolute -bottom-3 right-3 w-7 h-7 rounded-full bg-[#06D6A0] border-3 border-black shadow-[2px_2px_0px_#000]" />
        </div>

        {/* Tab Items */}
        <ul className="space-y-3 flex-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <li key={tab.id}>
                <button
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 border-4 border-black rounded-2xl p-3.5 font-black uppercase text-left transition-all text-sm sm:text-base
                    ${isActive 
                      ? `${tab.color} ${tab.id === 'emosi' ? 'text-white' : 'text-black'} translate-x-[4px] translate-y-[4px] shadow-none ring-2 ring-black` 
                      : 'bg-white hover:bg-gray-50 shadow-[4px_4px_0px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000]'
                    }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Actions & Style Switchers */}
        <div className="mt-8 space-y-3">
          <button 
            onClick={handlePrintCurrent}
            className="w-full flex items-center justify-center gap-2 border-3 border-black rounded-2xl p-2.5 font-black uppercase bg-[#06D6A0] text-black hover:bg-[#05be8e] transition-colors shadow-[3px_3px_0px_0px_#000] text-sm"
          >
            🖨️ Cetak Tab Ini
          </button>
          <button 
            onClick={handlePrintFullWorkbook}
            className="w-full flex items-center justify-center gap-2 border-3 border-black rounded-2xl p-2.5 font-black uppercase bg-black text-white hover:bg-gray-800 transition-colors shadow-[3px_3px_0px_0px_#FF006E] text-sm"
          >
            📑 Cetak Seluruh Buku
          </button>

          {/* Navigasi Alternatif Lain */}
          <div className="pt-2 border-t-3 border-dashed border-black space-y-2">
            <span className="text-xs font-black uppercase text-gray-500 flex items-center justify-between">
              <span>🎨 Ganti Desain:</span>
              <span className="bg-[#06D6A0] text-black px-1.5 py-0.5 rounded text-[10px] font-black">Style 3 Aktif</span>
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button 
                type="button"
                onClick={() => onSelectStyle ? onSelectStyle(1) : (window.location.href = './index.html')}
                className="w-full py-2 px-1 font-black uppercase text-xs rounded-xl border-2 border-black bg-[#FFE066] text-black hover:opacity-90 transition-all shadow-[2px_2px_0px_0px_#000] flex items-center justify-center gap-1"
              >
                <span>⚡ Style 1</span>
              </button>
              <button 
                type="button"
                onClick={() => onSelectStyle ? onSelectStyle(2) : (window.location.href = './scrapbook.html')}
                className="w-full py-2 px-1 font-black uppercase text-xs rounded-xl border-2 border-black bg-[#FFE5D9] text-[#4a3525] hover:opacity-90 transition-all shadow-[2px_2px_0px_0px_#000] flex items-center justify-center gap-1"
              >
                <span>📓 Style 2</span>
              </button>
              <button 
                type="button"
                onClick={() => onSelectStyle ? onSelectStyle(3) : null}
                className="w-full py-2 px-1 font-black uppercase text-xs rounded-xl border-2 border-black bg-black text-[#06D6A0] shadow-none flex items-center justify-center gap-1"
              >
                <span>🎨 Style 3</span>
              </button>
              <button 
                type="button"
                onClick={() => onSelectStyle ? onSelectStyle(4) : (window.location.href = './risograph.html')}
                className="w-full py-2 px-1 font-black uppercase text-xs rounded-xl border-2 border-black bg-[#FA2A55] text-white hover:opacity-90 transition-all shadow-[2px_2px_0px_0px_#000] flex items-center justify-center gap-1"
              >
                <span>🖨️ Style 4</span>
              </button>
            </div>
          </div>

          <div className="p-2.5 border-3 border-black bg-[#FFF3B0] rounded-xl text-xs font-black text-center shadow-[2px_2px_0px_#000]">
            🔒 Tersimpan otomatis di perambanmu.
          </div>

          <button 
            onClick={handleReset}
            className="w-full text-xs font-black text-red-600 hover:text-red-800 underline text-center pt-1 block uppercase"
          >
            Reset Seluruh Form
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-12 overflow-y-auto relative z-10 print-area">
        <div className="max-w-4xl mx-auto">
          {printAll ? (
            <div className="space-y-12">
              <div className="border-b-8 border-black pb-4 text-center mb-8">
                <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight">
                  Workbook Kesehatan Mental Remaja (Memphis Edition)
                </h1>
                {formData.profile.nama && (
                  <p className="text-xl font-bold mt-2">Buku Milik: {formData.profile.nama} {formData.profile.usia ? `(${formData.profile.usia})` : ''}</p>
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
