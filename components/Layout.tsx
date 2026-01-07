
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Play, Newspaper, Settings, Users } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Trophy, label: 'Ranking' },
    { path: '/play', icon: Play, label: 'Jugar' },
    { path: '/summary', icon: Newspaper, label: 'Noticias' },
    { path: '/admin', icon: Settings, label: 'Admin' },
  ];

  return (
    <div className="min-h-screen flex flex-col pb-24">
      <header className="px-6 pt-8 pb-4">
        <h1 className="text-3xl black-italic text-sky-500 tracking-tighter uppercase italic">
          Domino <span className="text-white">PRO</span>
        </h1>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Dominican Edition</p>
      </header>

      <main className="flex-1 px-4 overflow-y-auto">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-white/10 px-6 py-3 flex justify-between items-center z-50 rounded-t-3xl">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center space-y-1 transition-colors ${
                isActive ? 'text-sky-500' : 'text-slate-500'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-sky-500/20 scale-110' : ''}`}>
                <Icon size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
