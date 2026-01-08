
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Play, Newspaper, Settings } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Trophy, label: 'Ranking' },
    { path: '/play', icon: Play, label: 'Partida' },
    { path: '/summary', icon: Newspaper, label: 'Resumen' },
    { path: '/admin', icon: Settings, label: 'Ajustes' },
  ];

  return (
    <div className="min-h-screen flex flex-col pb-24">
      <header className="px-6 pt-8 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl black-italic tracking-tighter uppercase italic flex items-center">
            <span className="text-blue-600">DOMINO</span>
            <span className="text-white ml-2">PRO</span>
          </h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">LIGA OFICIAL DOMINICANA</p>
        </div>
        <div className="relative shadow-xl shadow-blue-900/20 transform hover:scale-105 transition-transform duration-300 group">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20" className="w-10 h-auto rounded-[3px] border border-white/10">
              <rect width="30" height="20" fill="white"/>
              <rect width="13" height="9" fill="#002d62"/>
              <rect x="17" width="13" height="9" fill="#ce1126"/>
              <rect y="11" width="13" height="9" fill="#ce1126"/>
              <rect x="17" y="11" width="13" height="9" fill="#002d62"/>
              {/* Pequeño detalle del escudo central */}
              <rect x="13.5" y="8.5" width="3" height="3" rx="0.5" fill="#205a39" className="opacity-80" />
           </svg>
           <div className="absolute inset-0 rounded-[3px] ring-1 ring-inset ring-white/5 pointer-events-none"></div>
        </div>
      </header>

      <main className="flex-1 px-4 overflow-y-auto">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-white/10 px-6 py-4 flex justify-between items-center z-50 rounded-t-[2.5rem]">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center space-y-1 transition-all ${
                isActive ? 'text-white' : 'text-slate-500'
              }`}
            >
              <div className={`p-2 rounded-2xl transition-all ${isActive ? 'bg-blue-600 shadow-lg shadow-blue-600/30 scale-110' : ''}`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-wider ${isActive ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
