
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
        <div className="flex space-x-1">
          <div className="w-4 h-3 bg-blue-700 rounded-sm"></div>
          <div className="w-4 h-3 bg-white rounded-sm"></div>
          <div className="w-4 h-3 bg-red-600 rounded-sm"></div>
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
