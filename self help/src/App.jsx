import React, { useState, useEffect, useCallback } from 'react';
import MemphisApp from './MemphisApp.jsx';

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



export default function App() {
  const [activeTab, setActiveTab] = useState('beranda');

  // Shared formData
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
    if (window.confirm("Apakah kamu yakin ingin mengosongkan seluruh lembar kerja? Semua isian akan dihapus.")) {
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
    handleReset
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Main Memphis Content (Locked to Memphis Style) */}
      <div className="flex-1 w-full">
        <MemphisApp {...commonProps} />
      </div>
    </div>
  );
}
