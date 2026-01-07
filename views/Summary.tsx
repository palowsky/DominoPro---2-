
import React, { useState } from 'react';
import { Player, Game } from '../types';
import { generateWeeklySummary } from '../services/geminiService';
import { Newspaper, Zap, Quote } from 'lucide-react';
import { getDisplayName } from './League';

interface SummaryProps {
  players: Player[];
  games: Game[];
}

export const Summary: React.FC<SummaryProps> = ({ players, games }) => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const getSummary = async () => {
    setLoading(true);
    const dataString = JSON.stringify({
      topPlayers: players.sort((a,b) => b.xp - a.xp).slice(0, 3).map(p => ({ n: getDisplayName(p), xp: p.xp, w: p.wins })),
      recentGames: games.slice(-5).map(g => ({ m: g.mode, w: g.winners.length }))
    });
    
    const text = await generateWeeklySummary(dataString);
    setSummary(text);
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-500 pb-12">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-black italic uppercase text-slate-200 tracking-tight">Resumen de Liga</h2>
      </div>

      <div className="glass-card p-6 rounded-[2.5rem] relative overflow-hidden bg-gradient-to-br from-blue-600/5 to-transparent border-white/5">
        <div className="relative z-10 space-y-6">
          <div className="flex items-center space-x-3 text-blue-500">
            <Newspaper size={24} />
            <span className="font-black italic uppercase tracking-tighter">Analítica Semanal</span>
          </div>

          {!summary ? (
            <div className="space-y-4 text-center py-8">
              <p className="text-slate-500 text-sm font-medium px-4 leading-relaxed">
                Genere un reporte basado en el desempeño reciente de los jugadores registrados en la base oficial.
              </p>
              <button 
                onClick={getSummary}
                disabled={loading}
                className={`w-full py-5 rounded-2xl font-black text-white bg-blue-600 shadow-lg shadow-blue-600/20 transition-all ${loading ? 'opacity-50' : 'hover:scale-102 active:scale-98'}`}
              >
                {loading ? 'ANALIZANDO DESEMPEÑO...' : 'GENERAR REPORTE'}
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10 relative">
                <Quote size={20} className="text-blue-500/30 absolute -top-2 -left-1" />
                <p className="text-slate-200 leading-relaxed text-sm font-medium">
                  {summary}
                </p>
              </div>
              <button 
                onClick={() => setSummary(null)}
                className="w-full py-4 rounded-2xl font-black text-[10px] text-slate-500 uppercase border border-white/5"
              >
                Nuevo Análisis
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 px-2">
        <div className="glass-card p-5 rounded-[2rem] text-center space-y-1 border-white/5">
          <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Partidas</div>
          <div className="text-3xl font-black italic text-white">{games.length}</div>
        </div>
        <div className="glass-card p-5 rounded-[2rem] text-center space-y-1 border-white/5">
          <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Capicúas</div>
          <div className="text-3xl font-black italic text-blue-500">{games.filter(g => g.isCapicua).length}</div>
        </div>
      </div>
    </div>
  );
};
