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

const NeoBox = ({ children, className = "", bgColor = "bg-white", noShadow = false }) => (
  <div className={`border-4 border-black ${bgColor} ${noShadow ? '' : 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'} rounded-2xl p-6 transition-all ${className}`}>
    {children}
  </div>
);

const NeoButton = ({ children, onClick, className = "", bgColor = "bg-[#FF90E8]", active = false, type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    className={`border-4 border-black rounded-xl px-6 py-3 font-black uppercase tracking-widest transition-all
      ${active ? `${bgColor} translate-x-[4px] translate-y-[4px] shadow-none` : `${bgColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none`}
      ${className}`}
  >
    {children}
  </button>
);

const NeoInput = ({ placeholder, type = "text", className = "", value = "", onChange, ...props }) => (
  <input 
    type={type} 
    placeholder={placeholder} 
    value={value ?? ""}
    onChange={onChange}
    {...props}
    className={`w-full border-4 border-black rounded-xl p-4 font-bold text-lg focus:outline-none focus:bg-[#FFF4E0] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors ${className}`} 
  />
);

const NeoTextArea = ({ placeholder, className = "", rows = 3, value = "", onChange, ...props }) => (
  <textarea 
    placeholder={placeholder} 
    rows={rows}
    value={value ?? ""}
    onChange={onChange}
    {...props}
    className={`w-full border-4 border-black rounded-xl p-4 font-bold text-lg focus:outline-none focus:bg-[#FFF4E0] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors resize-none ${className}`} 
  />
);

const NeoPill = ({ label, selected, onClick, bgColor = "bg-[#FFE066]" }) => (
  <button
    type="button"
    onClick={onClick}
    className={`border-4 border-black rounded-full px-4 py-2 font-bold transition-all
      ${selected ? `${bgColor} shadow-none translate-x-[2px] translate-y-[2px]` : `bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50`}`}
  >
    {label}
  </button>
);

const Beranda = ({ data, updateData }) => (
  <div className="space-y-8 animate-fade-in print-content">
    <NeoBox bgColor="bg-[#FF90E8]" className="text-center">
      <h1 className="text-4xl md:text-6xl font-black uppercase mb-4 tracking-tighter">Kesehatan<br/>Mental Remaja</h1>
      <p className="text-xl font-bold border-t-4 border-black pt-4 inline-block">Kenali diri • Kelola emosi • Bangun hidup yang lebih baik</p>
    </NeoBox>

    <div className="grid md:grid-cols-2 gap-8">
      <NeoBox bgColor="bg-[#FFE066]">
        <h2 className="text-2xl font-black mb-4 flex items-center gap-2">📖 Profilku</h2>
        <div className="space-y-4">
          <div>
            <label className="font-bold mb-2 block">Nama Panggilan:</label>
            <NeoInput 
              placeholder="Tulis namamu di sini..." 
              value={data.profile.nama}
              onChange={(e) => updateData('profile', 'nama', e.target.value)}
            />
          </div>
          <div>
            <label className="font-bold mb-2 block">Kelas / Usia:</label>
            <NeoInput 
              placeholder="Berapa usiamu?" 
              value={data.profile.usia}
              onChange={(e) => updateData('profile', 'usia', e.target.value)}
            />
          </div>
        </div>
      </NeoBox>

      <NeoBox bgColor="bg-white" className="border-dashed border-8 border-[#FF5757]">
        <h2 className="text-2xl font-black mb-4 text-[#FF5757] flex items-center gap-2">🛡️ DISCLAIMER</h2>
        <p className="font-bold text-lg">Buku (aplikasi) ini adalah bahan edukasi (self-help) untuk berlatih sehari-hari, bukan pengganti diagnosis atau perawatan profesional.</p>
        <p className="font-bold mt-4">Jika masalah terasa terlalu berat, ceritakan kepada orang dewasa yang kamu percaya atau tenaga profesional.</p>
      </NeoBox>
    </div>

    {/* Info Tambahan dari Buku */}
    <NeoBox bgColor="bg-[#4ECDC4]">
      <h3 className="text-2xl font-black mb-3">💡 Cara Menggunakan Workbook Ini</h3>
      <ul className="list-disc list-inside space-y-2 font-bold text-lg">
        <li><strong>Buku ini adalah temanmu:</strong> Baca sesuai kebutuhan, tidak harus selesai sekaligus.</li>
        <li><strong>Tulis dengan jujur:</strong> Tidak ada jawaban salah atau dinilai, ini ruang amanmu.</li>
        <li><strong>Simpan & Cetak kapan saja:</strong> Datamu tersimpan otomatis di browsermu dan bisa dicetak sebagai PDF.</li>
      </ul>
    </NeoBox>
  </div>
);

const MateriBacaan = () => {
  const [activeArticle, setActiveArticle] = useState(null);

  const articles = [
    {
      id: 1,
      title: "🧠 Mengenal Kesehatan Mental",
      bgColor: "bg-[#FF90E8]",
      excerpt: "Mental yang sehat bukan berarti kamu harus selalu bahagia.",
      content: (
        <div className="space-y-4 font-bold text-lg">
          <p>Mental yang sehat bukan berarti kamu harus selalu bahagia. Kamu tetap boleh merasa sedih, kecewa, marah, takut, atau cemas.</p>
          <p>Yang penting adalah belajar mengenali emosi tersebut, mengelolanya dengan cara yang sehat, dan tahu kapan perlu meminta bantuan.</p>
          <p className="bg-white p-4 border-2 border-black rounded-lg mt-4">
            <strong>Ingat:</strong> Sama seperti tubuh yang bisa sakit flu, pikiran dan emosi kita juga bisa merasa lelah dan butuh dirawat.
          </p>
        </div>
      )
    },
    {
      id: 2,
      title: "🔋 Pikiranmu Seperti Baterai HP",
      bgColor: "bg-[#4ECDC4]",
      excerpt: "Apa yang terjadi kalau aplikasinya terlalu banyak?",
      content: (
        <div className="space-y-6 font-bold">
          <p className="text-lg">Kalau baterai HP hampir habis, banyak aplikasi berjalan, dan tidak pernah diisi ulang, HP bisa menjadi lambat atau mati. Pikiran juga membutuhkan istirahat, dukungan, dan waktu untuk pulih.</p>
          
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="bg-red-100 p-4 border-2 border-black rounded-xl">
              <h4 className="text-xl font-black text-red-600 mb-2">🪫 Baterai Menipis</h4>
              <p>Disebabkan oleh kurang tidur, tekanan tugas sekolah, konflik dengan teman/keluarga, atau terlalu banyak tuntutan dari sekitar.</p>
            </div>
            <div className="bg-orange-100 p-4 border-2 border-black rounded-xl">
              <h4 className="text-xl font-black text-orange-700 mb-2">🐌 Sistem Melambat</h4>
              <p>Akibatnya kamu jadi sulit fokus, mudah marah atau tersinggung, kehilangan motivasi, atau merasa kewalahan menghadapi hari.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "🚨 Emosi Bukanlah Musuh",
      bgColor: "bg-[#FFE066]",
      excerpt: "Mengapa kita merasakan marah, sedih, atau takut?",
      content: (
        <div className="space-y-4 font-bold text-lg">
          <p>Banyak orang mengira emosi negatif itu buruk dan harus ditekan. Padahal, emosi bukanlah musuh.</p>
          <p>Marah, sedih, kecewa, takut, atau malu adalah <strong>sinyal</strong> bahwa ada sesuatu yang sedang terjadi dalam diri kita atau di sekitar kita yang butuh perhatian.</p>
          <ul className="list-disc list-inside space-y-2 bg-white p-4 border-2 border-black rounded-lg mt-4">
            <li>Yang penting bukan menghilangkan emosinya.</li>
            <li>Tetapi belajar mengenali apa yang kita rasakan.</li>
            <li>Memahami mengapa kita merasakannya.</li>
            <li>Dan meresponsnya dengan cara yang lebih sehat (tanpa menyakiti diri sendiri atau orang lain).</li>
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
          className="font-black text-lg flex items-center gap-2 border-2 border-black px-4 py-2 rounded-xl bg-white hover:bg-gray-100 shadow-[2px_2px_0px_#000] no-print"
        >
          ⬅ Kembali ke Daftar Materi
        </button>
        <NeoBox bgColor={article.bgColor}>
          <h2 className="text-3xl md:text-4xl font-black mb-6">
            {article.title}
          </h2>
          <div className="leading-relaxed">
            {article.content}
          </div>
        </NeoBox>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in print-content">
      <NeoBox bgColor="bg-white">
        <h2 className="text-3xl font-black uppercase mb-2">📚 Pojok Baca</h2>
        <p className="font-bold text-xl">Materi ringan dari dokumen untuk membantumu lebih paham tentang dirimu sendiri.</p>
      </NeoBox>

      <div className="grid md:grid-cols-2 gap-6">
        {articles.map(article => (
          <div 
            key={article.id} 
            onClick={() => setActiveArticle(article.id)}
            className={`border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer flex flex-col justify-between ${article.bgColor}`}
          >
            <div>
              <h3 className="text-2xl font-black mb-3">{article.title}</h3>
              <p className="font-bold mb-6 text-gray-900">{article.excerpt}</p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-white text-black font-black px-4 py-2 border-2 border-black rounded-lg">
                Baca ➔
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const JurnalEmosi = ({ data, updateData }) => {
  const emosiList = ["Senang", "Tenang", "Biasa saja", "Sedih", "Marah", "Cemas", "Bingung", "Malu", "Kecewa", "Lelah"];
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
      <NeoBox bgColor="bg-[#FF90E8]">
        <h2 className="text-3xl font-black uppercase mb-2">🤝 Emotion Diary</h2>
        <p className="font-bold text-xl">Kenali emosi tanpa menghakimi diri sendiri.</p>
      </NeoBox>

      <NeoBox bgColor="bg-white">
        <h3 className="text-2xl font-black mb-4">A. Emosi apa yang kurasakan hari ini?</h3>
        <div className="flex flex-wrap gap-3">
          {emosiList.map(e => (
            <NeoPill 
              key={e} 
              label={e} 
              selected={selectedEmosi.includes(e)} 
              onClick={() => toggleEmosi(e)} 
              bgColor="bg-[#FF90E8]" 
            />
          ))}
        </div>
      </NeoBox>

      <div className="grid md:grid-cols-2 gap-8">
        <NeoBox bgColor="bg-[#FFE066]">
          <h3 className="text-xl font-black mb-2">B. Apa yang terjadi?</h3>
          <p className="font-bold mb-2 text-sm">Tuliskan situasi yang paling mempengaruhi emosimu.</p>
          <NeoTextArea 
            placeholder="Misal: Dimarahi orang tua karena pulang terlambat..." 
            rows={4} 
            value={data.jurnalEmosi.situasi}
            onChange={(e) => updateData('jurnalEmosi', 'situasi', e.target.value)}
          />
        </NeoBox>
        <NeoBox bgColor="bg-[#4ECDC4]">
          <h3 className="text-xl font-black mb-2">C. Apa yang kupikirkan?</h3>
          <p className="font-bold mb-2 text-sm">Pikiran yang muncul mengikuti perasaanmu.</p>
          <NeoTextArea 
            placeholder="Misal: Orang tua tidak menyayangiku, tidak peduli alasanku..." 
            rows={4} 
            value={data.jurnalEmosi.pikiran}
            onChange={(e) => updateData('jurnalEmosi', 'pikiran', e.target.value)}
          />
        </NeoBox>
      </div>

      <NeoBox bgColor="bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-black">D. Seberapa kuat emosinya? (1-10)</h3>
          <span className="text-2xl font-black bg-[#FFE066] border-2 border-black px-3 py-1 rounded-lg">
            Skor: {data.jurnalEmosi.intensitas || 5}
          </span>
        </div>
        <input 
          type="range" 
          min="1" 
          max="10" 
          value={data.jurnalEmosi.intensitas || 5} 
          onChange={(e) => updateData('jurnalEmosi', 'intensitas', parseInt(e.target.value))}
          className="w-full accent-black h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer border-2 border-black no-print" 
        />
        <div className="flex justify-between font-black text-xl mt-2">
          <span>1 (Ringan)</span><span>5 (Sedang)</span><span>10 (Sangat Kuat)</span>
        </div>
      </NeoBox>

      <div className="grid md:grid-cols-2 gap-8">
        <NeoBox bgColor="bg-white" className="border-dashed">
          <h3 className="text-xl font-black mb-2">E. Apa yang kulakukan setelahnya?</h3>
          <NeoTextArea 
            placeholder="Misal: Menangis, malas berbicara..." 
            rows={3} 
            value={data.jurnalEmosi.tindakan}
            onChange={(e) => updateData('jurnalEmosi', 'tindakan', e.target.value)}
          />
        </NeoBox>
        <NeoBox bgColor="bg-[#FF90E8]">
          <h3 className="text-xl font-black mb-2">F. Alternatif Respon Sehat</h3>
          <NeoTextArea 
            placeholder="Berusaha tenang dengan relaksasi napas, mengakui kesalahan..." 
            rows={3} 
            value={data.jurnalEmosi.alternatif}
            onChange={(e) => updateData('jurnalEmosi', 'alternatif', e.target.value)}
          />
        </NeoBox>
      </div>

      <div className="bg-black text-white p-6 rounded-xl font-bold flex gap-4 items-start shadow-[8px_8px_0px_0px_#FF90E8]">
         <span className="text-3xl shrink-0">🌱</span>
         <p className="text-lg">Aku tidak harus menghilangkan semua emosi. Aku sedang belajar memahaminya. Emosi bukan musuh, melainkan sinyal.</p>
      </div>
    </div>
  );
};

const KelolaPikiran = ({ data, updateData }) => (
  <div className="space-y-8 animate-fade-in print-content">
    <NeoBox bgColor="bg-[#FF5757]" className="text-white">
      <h2 className="text-3xl font-black uppercase mb-2 text-black">🧠 Stop Overthinking</h2>
      <p className="font-bold text-xl text-black">Periksa pikiran, cari fakta, lalu pilih langkah kecil.</p>
    </NeoBox>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[
        { l: 'S', title: 'STOP', desc: 'Berhenti sejenak dari pikiran yang berputar.', c: 'bg-[#FFE066]' },
        { l: 'T', title: 'TAKE A BREATH', desc: 'Tarik napas perlahan 3 kali.', c: 'bg-[#4ECDC4]' },
        { l: 'O', title: 'OBSERVE', desc: 'Amati pikiran, perasaan, dan fakta yang ada.', c: 'bg-[#FF90E8]' },
        { l: 'P', title: 'PROCEED', desc: 'Pilih satu langkah kecil yang realistis.', c: 'bg-white' }
      ].map(item => (
        <NeoBox key={item.l} bgColor={item.c} className="text-center flex flex-col items-center justify-center">
          <div className="text-6xl font-black mb-2 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] text-black">{item.l}</div>
          <h3 className="font-black text-lg mb-2">{item.title}</h3>
          <p className="font-bold text-sm">{item.desc}</p>
        </NeoBox>
      ))}
    </div>

    <NeoBox bgColor="bg-white">
      <h3 className="text-xl font-black mb-4">Tantang Pikiranmu</h3>
      <div className="space-y-4">
        <div>
          <label className="font-bold mb-2 block">Pikiran yang terus muncul (setelah kejadian tidak enak):</label>
          <NeoTextArea 
            placeholder="Sebutkan hal yang mengganggumu..." 
            rows={2} 
            value={data.kelolaPikiran.pikiranMuncul}
            onChange={(e) => updateData('kelolaPikiran', 'pikiranMuncul', e.target.value)}
          />
        </div>
        <div>
          <label className="font-bold mb-2 block">Pikiran/Tindakan yang lebih realistis dan membantu:</label>
          <NeoTextArea 
            placeholder="Contoh: Aku tidak harus percaya pada setiap pikiran di kepalaku..." 
            rows={2} 
            className="focus:bg-[#bbf7d0]"
            value={data.kelolaPikiran.pikiranRealistis}
            onChange={(e) => updateData('kelolaPikiran', 'pikiranRealistis', e.target.value)}
          />
        </div>
      </div>
    </NeoBox>

    <NeoBox bgColor="bg-[#4ECDC4]">
      <h2 className="text-3xl font-black uppercase mb-4">🧊 Grounding 5-4-3-2-1</h2>
      <p className="font-bold mb-6">Kembalikan perhatian ke apa yang sedang terjadi sekarang. Sebutkan...</p>
      
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-4xl font-black">5</span>
          <NeoInput 
            placeholder="Hal yang bisa kamu LIHAT" 
            className="flex-1" 
            value={data.kelolaPikiran.lihat}
            onChange={(e) => updateData('kelolaPikiran', 'lihat', e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-4xl font-black">4</span>
          <NeoInput 
            placeholder="Hal yang bisa kamu SENTUH" 
            className="flex-1" 
            value={data.kelolaPikiran.sentuh}
            onChange={(e) => updateData('kelolaPikiran', 'sentuh', e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-4xl font-black">3</span>
          <NeoInput 
            placeholder="Suara yang bisa kamu DENGAR" 
            className="flex-1" 
            value={data.kelolaPikiran.dengar}
            onChange={(e) => updateData('kelolaPikiran', 'dengar', e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-4xl font-black">2</span>
          <NeoInput 
            placeholder="Aroma yang bisa kamu CIUM" 
            className="flex-1" 
            value={data.kelolaPikiran.cium}
            onChange={(e) => updateData('kelolaPikiran', 'cium', e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-4xl font-black">1</span>
          <NeoInput 
            placeholder="Hal yang bisa kamu RASAKAN" 
            className="flex-1" 
            value={data.kelolaPikiran.rasakan}
            onChange={(e) => updateData('kelolaPikiran', 'rasakan', e.target.value)}
          />
        </div>
      </div>
    </NeoBox>
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
      <NeoBox bgColor="bg-[#FFE066]">
        <h2 className="text-3xl font-black uppercase mb-2">✨ Aku Punya Kekuatan</h2>
        <p className="font-bold text-xl">Kenali kelebihan dan hal yang sudah kamu lakukan dengan baik.</p>
      </NeoBox>

      <NeoBox bgColor="bg-white">
        <h3 className="text-xl font-black mb-4">3 Hal yang pernah aku lakukan dengan baik:</h3>
        <div className="space-y-3">
          <NeoInput 
            placeholder="1." 
            value={data.kekuatanDiri.halBaik1}
            onChange={(e) => updateData('kekuatanDiri', 'halBaik1', e.target.value)}
          />
          <NeoInput 
            placeholder="2." 
            value={data.kekuatanDiri.halBaik2}
            onChange={(e) => updateData('kekuatanDiri', 'halBaik2', e.target.value)}
          />
          <NeoInput 
            placeholder="3." 
            value={data.kekuatanDiri.halBaik3}
            onChange={(e) => updateData('kekuatanDiri', 'halBaik3', e.target.value)}
          />
        </div>
        <h3 className="text-xl font-black mt-6 mb-4">Hal berat yang pernah berhasil kulewati:</h3>
        <NeoTextArea 
          placeholder="Ceritakan sedikit..." 
          rows={2} 
          value={data.kekuatanDiri.halBerat}
          onChange={(e) => updateData('kekuatanDiri', 'halBerat', e.target.value)}
        />
      </NeoBox>

      <NeoBox bgColor="bg-[#FF90E8]">
        <h2 className="text-3xl font-black uppercase mb-4">Bicara Baik Pada Diri (Self-Compassion)</h2>
        <p className="font-bold mb-4">Bayangkan sahabatmu mengalami masalah yang sama. Apa yang akan kamu katakan kepadanya?</p>
        <div className="space-y-4">
          <div>
            <label className="font-bold mb-2 block">Kalimat yang biasanya kukatakan pada diriku (saat down):</label>
            <NeoTextArea 
              placeholder="..." 
              rows={2} 
              value={data.kekuatanDiri.selfTalkDown}
              onChange={(e) => updateData('kekuatanDiri', 'selfTalkDown', e.target.value)}
            />
          </div>
          <div>
            <label className="font-bold mb-2 block">Kalimat yang lebih RAMAH dan REALISTIS:</label>
            <NeoTextArea 
              placeholder="..." 
              rows={2} 
              value={data.kekuatanDiri.selfTalkRamah}
              onChange={(e) => updateData('kekuatanDiri', 'selfTalkRamah', e.target.value)}
            />
          </div>
        </div>
      </NeoBox>

      <NeoBox bgColor="bg-[#4ECDC4]">
        <h3 className="text-2xl font-black mb-4">Apa yang sebenarnya kubutuhkan saat ini?</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {needsList.map(need => (
             <label 
               key={need} 
               onClick={() => toggleNeed(need)}
               className={`flex items-center gap-3 font-bold text-lg cursor-pointer border-4 border-black p-3 rounded-lg shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-colors ${
                 selectedNeeds.includes(need) ? 'bg-[#FFE066]' : 'bg-white hover:bg-gray-50'
               }`}
             >
               <input 
                 type="checkbox" 
                 checked={selectedNeeds.includes(need)}
                 onChange={() => {}}
                 className="w-6 h-6 border-4 border-black accent-[#FF90E8] pointer-events-none" 
               />
               {need}
             </label>
          ))}
        </div>
      </NeoBox>
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
      <NeoBox bgColor="bg-[#FF90E8]">
        <h2 className="text-3xl font-black uppercase mb-2">📴 Keseharian & Evaluasi</h2>
        <p className="font-bold text-xl">Menghargai hal kecil, mengelola stres & menjaga batasan layar.</p>
      </NeoBox>

      <NeoBox bgColor="bg-white">
        <h3 className="text-2xl font-black mb-4">Syukur Hari Ini (Gratitude Journal)</h3>
        <p className="font-bold mb-4">Bukan berarti mengabaikan masalah, tapi menyadari hal baik yang tetap ada di tengah hari yang tidak sempurna.</p>
        <div className="space-y-4">
          <NeoTextArea 
            placeholder="Hari ini aku bersyukur karena..." 
            rows={2} 
            value={data.keseharian.syukur1}
            onChange={(e) => updateData('keseharian', 'syukur1', e.target.value)}
          />
          <NeoTextArea 
            placeholder="Mengapa ini berarti bagiku?" 
            rows={2} 
            value={data.keseharian.syukur2}
            onChange={(e) => updateData('keseharian', 'syukur2', e.target.value)}
          />
          <NeoTextArea 
            placeholder="Hal kecil yang ingin aku nikmati besok:" 
            rows={2} 
            value={data.keseharian.syukur3}
            onChange={(e) => updateData('keseharian', 'syukur3', e.target.value)}
          />
        </div>
      </NeoBox>

      <div className="grid md:grid-cols-2 gap-8">
        <NeoBox bgColor="bg-[#FFE066]">
          <h3 className="text-2xl font-black mb-4">Stress Diary</h3>
          <p className="font-bold mb-4 text-sm">Kenali sumber stres dan pilih respons sehat.</p>
          <div className="space-y-4">
            <NeoInput 
              placeholder="Situasi saat ini (cth: tugas banyak)" 
              value={data.keseharian.stressSituasi}
              onChange={(e) => updateData('keseharian', 'stressSituasi', e.target.value)}
            />
            <NeoInput 
              placeholder="Apa yang bisa kukontrol? (cth: tidak menunda)" 
              value={data.keseharian.stressKontrol}
              onChange={(e) => updateData('keseharian', 'stressKontrol', e.target.value)}
            />
            <NeoInput 
              placeholder="Langkah kecil (cth: kerjakan 30 menit)" 
              value={data.keseharian.stressLangkah}
              onChange={(e) => updateData('keseharian', 'stressLangkah', e.target.value)}
            />
          </div>
        </NeoBox>

        <NeoBox bgColor="bg-[#4ECDC4]">
          <h3 className="text-2xl font-black mb-4 flex items-center gap-2">Cek Kebiasaan Digital</h3>
          <div className="space-y-4">
            {habits.map((item, i) => (
               <label 
                 key={i} 
                 onClick={() => toggleHabit(item)}
                 className="flex items-start gap-3 font-bold cursor-pointer select-none"
               >
                 <input 
                   type="checkbox" 
                   checked={digitalHabits.includes(item)}
                   onChange={() => {}}
                   className="w-6 h-6 mt-1 border-4 border-black accent-[#FF90E8] pointer-events-none" 
                 />
                 <span>{item}</span>
               </label>
            ))}
            <div className="mt-4 pt-4 border-t-4 border-black">
              <label className="font-black mb-2 block">Satu batas digital yang kupilih:</label>
              <NeoInput 
                placeholder="Misal: HP jauh dari kasur" 
                value={data.keseharian.batasDigital}
                onChange={(e) => updateData('keseharian', 'batasDigital', e.target.value)}
              />
            </div>
          </div>
        </NeoBox>
      </div>
    </div>
  );
};

const Support = ({ data, updateData }) => (
  <div className="space-y-8 animate-fade-in print-content">
    <NeoBox bgColor="bg-[#4ECDC4]">
      <h2 className="text-3xl font-black uppercase mb-2 flex items-center gap-2">👥 Support Circle & Rencana</h2>
      <p className="font-bold text-xl">Petakan dukungan dan rencanakan kebaikan untuk dirimu.</p>
    </NeoBox>

    <NeoBox bgColor="bg-white">
      <h3 className="text-2xl font-black mb-4">Apakah Pertemananmu Sehat?</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[#bbf7d0] border-4 border-black p-4 rounded-xl shadow-[4px_4px_0px_#000]">
          <h4 className="font-black text-lg mb-2 flex items-center gap-2">😊 Teman Sehat Biasanya:</h4>
          <ul className="list-disc list-inside font-bold space-y-1">
            <li>Mau mendengarkan & menghargai</li>
            <li>Tidak memaksa / mempermalukan</li>
            <li>Bisa beda pendapat tanpa menjatuhkan</li>
            <li>Menghargai saat kamu bilang "Tidak"</li>
          </ul>
        </div>
        <div className="bg-[#fecaca] border-4 border-black p-4 rounded-xl shadow-[4px_4px_0px_#000]">
          <h4 className="font-black text-lg mb-2 flex items-center gap-2">😞 Waspada Jika Teman:</h4>
          <ul className="list-disc list-inside font-bold space-y-1">
            <li>Terus memaksa setelah ditolak</li>
            <li>Mengancam / membuat merasa bersalah</li>
            <li>Menyebarkan rahasiamu</li>
            <li>Menghukummu karena menolak sesuatu</li>
          </ul>
        </div>
      </div>
      
      <h3 className="text-2xl font-black mt-8 mb-4">Orang Tempat Bercerita</h3>
      <div className="space-y-3">
        <div className="flex gap-2">
          <NeoInput 
            placeholder="Siapa?" 
            className="w-1/3" 
            value={data.support.cerita1Nama}
            onChange={(e) => updateData('support', 'cerita1Nama', e.target.value)}
          />
          <NeoInput 
            placeholder="Kapan bisa dihubungi?" 
            className="w-2/3" 
            value={data.support.cerita1Waktu}
            onChange={(e) => updateData('support', 'cerita1Waktu', e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <NeoInput 
            placeholder="Siapa?" 
            className="w-1/3" 
            value={data.support.cerita2Nama}
            onChange={(e) => updateData('support', 'cerita2Nama', e.target.value)}
          />
          <NeoInput 
            placeholder="Kapan bisa dihubungi?" 
            className="w-2/3" 
            value={data.support.cerita2Waktu}
            onChange={(e) => updateData('support', 'cerita2Waktu', e.target.value)}
          />
        </div>
      </div>
    </NeoBox>

    <NeoBox bgColor="bg-[#FFE066]">
      <h3 className="text-2xl font-black mb-4 flex items-center gap-2">🎯 Rencana Kecilku</h3>
      <p className="font-bold mb-4">Mulai saat ini, aku mengizinkan diriku berproses semakin baik.</p>
      <div className="space-y-4">
        <div>
          <label className="font-bold block mb-1">Satu kebiasaan yang ingin kutingkatkan:</label>
          <NeoInput 
            placeholder="..." 
            value={data.support.rencanaTingkatkan}
            onChange={(e) => updateData('support', 'rencanaTingkatkan', e.target.value)}
          />
        </div>
        <div>
          <label className="font-bold block mb-1">Satu hal yang ingin kukurangi:</label>
          <NeoInput 
            placeholder="..." 
            value={data.support.rencanaKurangi}
            onChange={(e) => updateData('support', 'rencanaKurangi', e.target.value)}
          />
        </div>
        <div>
          <label className="font-bold block mb-1">Satu aktivitas yang ingin kulakukan untuk diriku:</label>
          <NeoInput 
            placeholder="..." 
            value={data.support.rencanaAktivitas}
            onChange={(e) => updateData('support', 'rencanaAktivitas', e.target.value)}
          />
        </div>
      </div>
    </NeoBox>
  </div>
);

export default function NeoBrutalismApp({
  formData: propFormData,
  updateData: propUpdateData,
  activeTab: propActiveTab,
  setActiveTab: propSetActiveTab,
  onSelectStyle,
  currentStyle = 1,
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

  // Auto-save to localStorage only if managing own state
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
    if (window.confirm("Apakah kamu yakin ingin mengosongkan seluruh lembar kerja?")) {
      setLocalFormData(defaultData);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (err) {}
    }
  });

  const tabs = [
    { id: 'beranda', label: 'Beranda', icon: <span className="text-xl">📖</span> },
    { id: 'bacaan', label: 'Materi Bacaan', icon: <span className="text-xl">📚</span> },
    { id: 'emosi', label: 'Jurnal Emosi', icon: <span className="text-xl">🤝</span> },
    { id: 'pikiran', label: 'Kelola Pikiran', icon: <span className="text-xl">🧠</span> },
    { id: 'kekuatan', label: 'Kekuatan Diri', icon: <span className="text-xl">✨</span> },
    { id: 'keseharian', label: 'Keseharian', icon: <span className="text-xl">📴</span> },
    { id: 'support', label: 'Support & Rencana', icon: <span className="text-xl">👥</span> },
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

  // Fungsi untuk Print / Save PDF
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
      // Reset back after print dialog closes
      setTimeout(() => setPrintAll(false), 500);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-[#FEF6E4] text-black font-sans selection:bg-[#FF90E8] flex flex-col md:flex-row print-layout">
      
      {/* Mobile Header - Hidden in Print */}
      <div className="md:hidden border-b-4 border-black bg-white p-4 flex justify-between items-center sticky top-0 z-50 no-print">
        <h1 className="font-black text-xl uppercase tracking-tighter">Buku Mental Remaja</h1>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="border-2 border-black px-3 py-1 rounded-lg bg-[#FFE066] shadow-[2px_2px_0px_#000] font-black text-xl active:translate-x-[2px] active:translate-y-[2px]"
          aria-label="Buka Menu"
        >
          {isMobileMenuOpen ? '✖' : '☰'}
        </button>
      </div>

      {/* Sidebar Navigation - Hidden in Print */}
      <nav className={`
        ${isMobileMenuOpen ? 'block' : 'hidden'} 
        md:flex flex-col w-full md:w-80 shrink-0 bg-white border-r-4 border-black p-6 md:sticky md:top-0 md:h-screen md:overflow-y-auto z-40
        absolute md:relative left-0 top-[65px] md:top-0 h-[calc(100vh-65px)] border-b-4 md:border-b-0 no-print
      `}>
        <div className="hidden md:block mb-8">
          <h1 className="text-3xl font-black uppercase leading-none tracking-tighter bg-[#FFE066] inline-block px-2 border-4 border-black shadow-[4px_4px_0px_#000] -rotate-2">Self Help</h1>
          <h1 className="text-3xl font-black uppercase leading-none tracking-tighter bg-[#FF90E8] inline-block px-2 border-4 border-black shadow-[4px_4px_0px_#000] mt-2 rotate-1">Workbook</h1>
        </div>

        <ul className="space-y-3 flex-1">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 border-4 border-black rounded-xl p-3 md:p-4 font-black uppercase text-left transition-all text-sm md:text-base
                  ${activeTab === tab.id 
                    ? 'bg-[#4ECDC4] translate-x-[4px] translate-y-[4px] shadow-none' 
                    : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000]'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Fitur Simpan PDF Tanpa Database */}
        <div className="mt-8 space-y-3">
          <button 
            onClick={handlePrintCurrent}
            className="w-full flex items-center justify-center gap-2 border-4 border-black rounded-xl p-3 font-black uppercase bg-[#FF90E8] text-black hover:bg-[#ff7be3] transition-colors shadow-[4px_4px_0px_#000] text-sm"
          >
            🖨️ Cetak Tab Ini
          </button>
          <button 
            onClick={handlePrintFullWorkbook}
            className="w-full flex items-center justify-center gap-2 border-4 border-black rounded-xl p-3 font-black uppercase bg-black text-white hover:bg-gray-800 transition-colors shadow-[4px_4px_0px_#FF90E8] text-sm"
          >
            📑 Cetak Seluruh Buku
          </button>

          {/* Selector 4 Style di Sidebar */}
          <div className="p-3 border-4 border-black bg-[#FFE066] rounded-xl space-y-2 shadow-[3px_3px_0px_#000]">
            <p className="text-[11px] font-black uppercase tracking-wider text-black flex items-center justify-between">
              <span>🎨 Ganti Gaya Desain:</span>
              <span className="bg-black text-white px-1.5 py-0.5 rounded text-[10px]">Style 1 Aktif</span>
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              <button 
                type="button"
                onClick={() => onSelectStyle ? onSelectStyle(1) : null}
                className="w-full py-2 px-1.5 font-black uppercase text-xs rounded-lg border-2 border-black bg-black text-[#FFE066] shadow-none flex items-center justify-center gap-1"
              >
                <span>⚡ Style 1</span>
              </button>
              <button 
                type="button"
                onClick={() => onSelectStyle ? onSelectStyle(2) : (window.location.href = './scrapbook.html')}
                className="w-full py-2 px-1.5 font-black uppercase text-xs rounded-lg border-2 border-black bg-[#FFE5D9] text-[#4a3525] hover:bg-[#ffd5c2] shadow-[2px_2px_0px_#000] active:translate-x-0.5 transition-all flex items-center justify-center gap-1"
              >
                <span>📓 Style 2</span>
              </button>
              <button 
                type="button"
                onClick={() => onSelectStyle ? onSelectStyle(3) : (window.location.href = './memphis.html')}
                className="w-full py-2 px-1.5 font-black uppercase text-xs rounded-lg border-2 border-black bg-[#06D6A0] text-black hover:bg-[#05be8d] shadow-[2px_2px_0px_#000] active:translate-x-0.5 transition-all flex items-center justify-center gap-1"
              >
                <span>🎨 Style 3</span>
              </button>
              <button 
                type="button"
                onClick={() => onSelectStyle ? onSelectStyle(4) : (window.location.href = './risograph.html')}
                className="w-full py-2 px-1.5 font-black uppercase text-xs rounded-lg border-2 border-black bg-[#FA2A55] text-white hover:bg-[#e01944] shadow-[2px_2px_0px_#000] active:translate-x-0.5 transition-all flex items-center justify-center gap-1"
              >
                <span>🖨️ Style 4</span>
              </button>
            </div>
          </div>
          
          <div className="p-3 border-4 border-black border-dashed bg-[#FFF4E0] rounded-xl text-xs font-bold text-center">
            🔒 "Datamu aman. Semua hanya tersimpan otomatis di browsermu sendiri."
          </div>

          <button 
            onClick={handleReset}
            className="w-full text-xs font-bold text-red-600 hover:text-red-800 underline text-center pt-1 block"
          >
            Hapus / Reset Isi Form
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-10 lg:p-16 overflow-y-auto print-area">
        <div className="max-w-4xl mx-auto">
          {printAll ? (
            /* Mode cetak semua bab buku */
            <div className="space-y-12">
              <div className="border-b-8 border-black pb-4 text-center mb-8">
                <h1 className="text-4xl font-black uppercase tracking-tighter">Buku Self-Help Kesehatan Mental Remaja</h1>
                {formData.profile.nama && (
                  <p className="text-xl font-bold mt-2">Buku Milik: {formData.profile.nama} {formData.profile.usia ? `(${formData.profile.usia})` : ''}</p>
                )}
              </div>
              <section className="print-content"><Beranda data={formData} updateData={updateData} /></section>
              <div className="page-break" style={{ pageBreakBefore: 'always' }}></div>
              <section className="print-content"><MateriBacaan /></section>
              <div className="page-break" style={{ pageBreakBefore: 'always' }}></div>
              <section className="print-content"><JurnalEmosi data={formData} updateData={updateData} /></section>
              <div className="page-break" style={{ pageBreakBefore: 'always' }}></div>
              <section className="print-content"><KelolaPikiran data={formData} updateData={updateData} /></section>
              <div className="page-break" style={{ pageBreakBefore: 'always' }}></div>
              <section className="print-content"><KekuatanDiri data={formData} updateData={updateData} /></section>
              <div className="page-break" style={{ pageBreakBefore: 'always' }}></div>
              <section className="print-content"><Keseharian data={formData} updateData={updateData} /></section>
              <div className="page-break" style={{ pageBreakBefore: 'always' }}></div>
              <section className="print-content"><Support data={formData} updateData={updateData} /></section>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </main>
      
      {/* CSS Styles: Animation & Print Logic */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }

        /* PRINT STYLES - Ini untuk menyembunyikan UI saat disave jadi PDF */
        @media print {
          .no-print { display: none !important; }
          .print-layout { display: block !important; background: white !important; }
          .print-area { padding: 0 !important; margin: 0 !important; }
          body { background-color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          /* Paksa border neo-brutalism untuk tetap muncul saat diprint */
          .border-4 { border-width: 4px !important; border-color: black !important; }
          .shadow-\\[8px_8px_0px_0px_rgba\\(0\\,0\\,0\\,1\\)\\] { box-shadow: 8px 8px 0px 0px rgba(0,0,0,1) !important; }
          .print-content { page-break-inside: avoid; }
          ::-webkit-input-placeholder { color: transparent !important; }
        }
      `}} />
    </div>
  );
}
