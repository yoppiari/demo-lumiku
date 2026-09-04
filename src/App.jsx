import React, { useState, useEffect, useCallback } from 'react';
import NeoBrutalismApp from './NeoBrutalismApp.jsx';
import ScrapbookApp from './ScrapbookApp.jsx';
import MemphisApp from './MemphisApp.jsx';
import RisographApp from './RisographApp.jsx';
import StyleSwitcherBar from './StyleSwitcherBar.jsx';

const STORAGE_KEY = 'mental_health_workbook_data_v1';
const STYLE_KEY = 'preferred_workbook_style';

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

function parseStyleFromQuery() {
  if (typeof window === 'undefined') return 1;
  const params = new URLSearchParams(window.location.search);
  const s = params.get('style');
  if (s === '1' || s === 'neo' || s === 'neobrutalism') return 1;
  if (s === '2' || s === 'scrapbook' || s === 'journal') return 2;
  if (s === '3' || s === 'memphis' || s === 'pop') return 3;
  if (s === '4' || s === 'risograph' || s === 'zine') return 4;

  const path = window.location.pathname.toLowerCase();
  if (path.includes('scrapbook')) return 2;
  if (path.includes('memphis')) return 3;
  if (path.includes('risograph')) return 4;

  // Fallback to localStorage
  try {
    const savedStyle = localStorage.getItem(STYLE_KEY);
    if (savedStyle && ['1', '2', '3', '4'].includes(savedStyle)) {
      return parseInt(savedStyle, 10);
    }
  } catch (err) {}

  return 1;
}

export default function App() {
  const [currentStyle, setCurrentStyle] = useState(parseStyleFromQuery);
  const [activeTab, setActiveTab] = useState('beranda');

  // Shared formData across all styles
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultData, ...parsed };
      }
    } catch (err) {
      console.error("Gagal membaca dari localStorage", err);
    }
    return defaultData;
  });

  // Auto-save form data on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (err) {
      console.error("Gagal menyimpan ke localStorage", err);
    }
  }, [formData]);

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const onPopState = () => {
      setCurrentStyle(parseStyleFromQuery());
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleSelectStyle = useCallback((styleId) => {
    setCurrentStyle(styleId);
    try {
      localStorage.setItem(STYLE_KEY, styleId.toString());
    } catch (err) {}

    // Update URL query parameter smoothly without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('style', styleId.toString());
    window.history.replaceState({}, '', url.toString());

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const updateData = useCallback((section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  }, []);

  const handleReset = useCallback(() => {
    if (window.confirm("Apakah kamu yakin ingin mengosongkan seluruh lembar kerja? Semua isian di seluruh style akan dihapus.")) {
      setFormData(defaultData);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (err) {}
    }
  }, []);

  const commonProps = {
    formData,
    updateData,
    activeTab,
    setActiveTab,
    onSelectStyle: handleSelectStyle,
    currentStyle,
    handleReset
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Top Floating/Sticky Style Switcher Bar */}
      <StyleSwitcherBar 
        currentStyle={currentStyle} 
        onSelectStyle={handleSelectStyle} 
      />

      {/* Main Active Style Content */}
      <div className="flex-1 w-full">
        {currentStyle === 1 && <NeoBrutalismApp {...commonProps} />}
        {currentStyle === 2 && <ScrapbookApp {...commonProps} />}
        {currentStyle === 3 && <MemphisApp {...commonProps} />}
        {currentStyle === 4 && <RisographApp {...commonProps} />}
      </div>
    </div>
  );
}
