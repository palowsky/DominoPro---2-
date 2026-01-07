
import React, { useState } from 'react';
import { Player, Game } from '../types';
import { generateWeeklySummary } from '../services/geminiService';
import { Newspaper, Zap, Quote } from 'lucide-react';

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
      topPlayers: players.sort((a,b) => b.xp - a.xp).slice(0, 3).map(p => ({ n: p.nickname, xp: p.xp, w: p.wins })),
      recentGames: games.slice(-5).map(g => ({ m: g.mode, w: g.winners.length }))
    });
    
    const text = await generateWeeklySummary(dataString);
    setSummary(text);
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black italic uppercase text-slate-200">El Noticiero</h2>
      </div>

      <div className="glass-card p-6 rounded-[2.5rem] relative overflow-hidden bg-gradient-to-br from-sky-500/5 to-transparent">
        <div className="relative z-10 space-y-6">
          <div className="flex items-center space-x-3 text-sky-500">
            <Zap size={24} className="fill-current" />
            <span className="font-black italic uppercase tracking-tighter">Resumen de Tigueraje</span>
          </div>

          {!summary ? (
            <div className="space-y-4 text-center py-8">
              <p className="text-slate-400 text-sm font-medium px-4">
                Analizamos los datos de la liga para darte el dato real de quién es el más duro y quién está pidiendo cacao.
              </p>
              <button 
                onClick={getSummary}
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-black text-white bg-sky-500 transition-all ${loading ? 'opacity-50' : 'hover:scale-105 active:scale-95'}`}
              >
                {loading ? 'ANALIZANDO TIGUERAJE...' : 'GENERAR RESUMEN'}
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 relative">
                <Quote size={20} className="text-sky-500/30 absolute -top-2 -left-1" />
                <p className="text-slate-200 leading-relaxed text-sm whitespace-pre-wrap font-medium">
                  {summary}
                </p>
              </div>
              <button 
                onClick={() => setSummary(null)}
                className="w-full py-3 rounded-2xl font-black text-xs text-slate-500 uppercase border border-white/5"
              >
                Generar Nuevo Resumen
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 rounded-3xl text-center space-y-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Partidas Jugadas</div>
          <div className="text-3xl font-black italic text-white">{games.length}</div>
        </div>
        <div className="glass-card p-4 rounded-3xl text-center space-y-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Goles de Capicúa</div>
          <div className="text-3xl font-black italic text-sky-500">{games.filter(g => g.isCapicua).length}</div>
        </div>
      </div>
    </div>
  );
};
