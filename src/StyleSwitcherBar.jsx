import React from 'react';

export default function StyleSwitcherBar({ currentStyle = 1, onSelectStyle }) {
  const styles = [
    {
      id: 1,
      name: 'Style 1',
      desc: 'Neo-Brutalism',
      icon: '⚡',
      badge: 'Bold & Pop',
      activeBg: 'bg-[#FFE066] text-black border-black shadow-[2px_2px_0px_#000]',
      hoverBg: 'hover:bg-[#FFE066]/20'
    },
    {
      id: 2,
      name: 'Style 2',
      desc: 'Scrapbook',
      icon: '📓',
      badge: 'Warm Journal',
      activeBg: 'bg-[#FFE5D9] text-[#4a3525] border-[#9c6644] shadow-[2px_2px_0px_#9c6644]',
      hoverBg: 'hover:bg-[#FFE5D9]/20'
    },
    {
      id: 3,
      name: 'Style 3',
      desc: 'Memphis Pop',
      icon: '🎨',
      badge: 'Retro 80s',
      activeBg: 'bg-[#06D6A0] text-black border-black shadow-[2px_2px_0px_#000]',
      hoverBg: 'hover:bg-[#06D6A0]/20'
    },
    {
      id: 4,
      name: 'Style 4',
      desc: 'Risograph',
      icon: '🖨️',
      badge: 'Indie Zine',
      activeBg: 'bg-[#FA2A55] text-white border-white shadow-[2px_2px_0px_#00F0FF]',
      hoverBg: 'hover:bg-[#FA2A55]/20'
    }
  ];

  return (
    <header className="sticky top-0 z-[100] w-full bg-[#0F172A] border-b-2 border-black/40 text-white shadow-xl no-print">
      <div className="max-w-7xl mx-auto px-3 py-2 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-3">
        
        {/* Branding & Info */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧠</span>
            <div>
              <span className="font-black text-sm sm:text-base tracking-tight block leading-tight">
                Workbook Mental Health
              </span>
              <span className="text-[10px] sm:text-xs text-amber-400 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                1 Halaman • 4 Pilihan Style Desain
              </span>
            </div>
          </div>
          
          <div className="md:hidden text-[11px] font-bold px-2 py-0.5 rounded bg-white/10 text-gray-200">
            Style {currentStyle} Aktif
          </div>
        </div>

        {/* Buttons: Style 1, Style 2, Style 3, Style 4 */}
        <div className="flex items-center gap-1.5 sm:gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none justify-start md:justify-end">
          <span className="text-[11px] font-extrabold uppercase text-gray-400 hidden lg:inline mr-1 tracking-wider shrink-0">
            PILIH STYLE:
          </span>

          {styles.map((s) => {
            const isActive = currentStyle === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelectStyle && onSelectStyle(s.id)}
                className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 py-1.5 px-2.5 sm:px-3.5 rounded-xl text-xs font-black transition-all shrink-0 border-2 cursor-pointer active:scale-95 ${
                  isActive
                    ? `${s.activeBg} scale-[1.03] ring-2 ring-white/50`
                    : `bg-white/10 text-gray-300 border-white/20 ${s.hoverBg} hover:text-white hover:border-white/40`
                }`}
                title={`Ganti ke ${s.name}: ${s.desc}`}
              >
                <span className="text-sm sm:text-base">{s.icon}</span>
                <div className="text-left leading-tight">
                  <div className="flex items-center gap-1">
                    <span>{s.name}</span>
                    {isActive && (
                      <span className="hidden sm:inline text-[9px] bg-black/25 px-1 py-0.2 rounded font-mono">
                        AKTIF
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] font-medium hidden sm:block ${isActive ? 'opacity-90' : 'text-gray-400'}`}>
                    {s.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
