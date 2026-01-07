
import React, { useState } from 'react';
import { Player, Game, Level } from '../types';
import { XP_RANK_COLORS, LEVEL_THRESHOLDS, BADGES } from '../constants';
import { Trophy, Flame, Target, Users, X, History, Award, ChevronRight, Zap } from 'lucide-react';

interface LeagueProps {
  players: Player[];
  games: Game[];
}

export const League: React.FC<LeagueProps> = ({ players, games }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const sortedPlayers = [...players].sort((a, b) => b.xp - a.xp);

  const getPlayerHistory = (id: string) => {
    return games.filter(g => g.winners.includes(id) || g.losers.includes(id)).slice(0, 5);
  };

  const getLevelProgress = (xp: number, currentLevel: Level) => {
    const currentThreshold = LEVEL_THRESHOLDS[currentLevel];
    const levels = Object.keys(LEVEL_THRESHOLDS) as Level[];
    const currentIndex = levels.indexOf(currentLevel);
    const nextLevel = levels[currentIndex + 1];
    
    if (!nextLevel) return { progress: 100, remaining: 0, next: 'MAX' };

    const nextThreshold = LEVEL_THRESHOLDS[nextLevel];
    const progress = ((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
    const remaining = nextThreshold - xp;

    return { 
      progress: Math.min(Math.max(progress, 0), 100), 
      remaining, 
      next: nextLevel 
    };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-black italic uppercase text-slate-200 tracking-tighter">El Escalafón</h2>
        <div className="bg-sky-500/10 text-sky-500 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-sky-500/20">
          {players.length} Tigueres
        </div>
      </div>

      <div className="space-y-4">
        {sortedPlayers.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-[3rem] border-dashed border-white/5">
            <Users className="mx-auto text-slate-800 mb-4" size={48} />
            <p className="text-slate-500 text-sm font-medium">No hay nadie en el patio.</p>
          </div>
        ) : (
          sortedPlayers.map((player, index) => {
            const { progress } = getLevelProgress(player.xp, player.level);

            return (
              <div 
                key={player.id} 
                onClick={() => setSelectedPlayer(player)}
                className="glass-card p-5 rounded-[2.5rem] relative overflow-hidden cursor-pointer hover:border-sky-500/40 transition-all active:scale-[0.98] border-white/5"
              >
                <div className="absolute top-4 right-4 text-3xl font-black italic text-white/5 tracking-tighter leading-none">#{index + 1}</div>
                <div className="flex items-center space-x-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${XP_RANK_COLORS[player.level]} flex items-center justify-center text-2xl shadow-xl border border-white/20 relative`}>
                    {index === 0 ? '👑' : player.nickname.charAt(0).toUpperCase()}
                    {player.streak >= 3 && (
                      <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border-2 border-slate-950 animate-bounce">
                        ON FIRE
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                       <h3 className="font-black text-lg text-white leading-tight italic">{player.nickname}</h3>
                       {player.level === 'Leyenda' && <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.8)]" />}
                    </div>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">{player.level}</span>
                      <div className="flex items-center text-[9px] font-black text-slate-500 uppercase">
                        <Zap size={10} className="mr-0.5 fill-current" /> {player.xp} XP
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-800" />
                </div>
                <div className="mt-4">
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                    <div className={`h-full bg-gradient-to-r ${XP_RANK_COLORS[player.level]} transition-all duration-700 shadow-lg`} style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Player Profile Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in">
          <div className="glass-card w-full max-w-lg rounded-t-[3rem] sm:rounded-[3rem] p-8 space-y-8 animate-in slide-in-from-bottom duration-300 border-white/10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-5">
                <div className={`w-20 h-20 rounded-[2rem] bg-gradient-to-br ${XP_RANK_COLORS[selectedPlayer.level]} flex items-center justify-center text-4xl shadow-2xl border-2 border-white/20`}>
                  {selectedPlayer.nickname.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-3xl font-black italic text-white leading-none tracking-tighter">{selectedPlayer.nickname}</h3>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-sky-400 uppercase border border-sky-400/20">{selectedPlayer.level}</span>
                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">#{sortedPlayers.findIndex(p => p.id === selectedPlayer.id) + 1} EN EL RANKING</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedPlayer(null)} className="p-3 bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors"><X size={20} /></button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end px-1">
                <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Progreso de Rango</h4>
                {selectedPlayer.level !== 'Leyenda' && (
                  <span className="text-[9px] font-black text-sky-500 italic">Faltan {getLevelProgress(selectedPlayer.xp, selectedPlayer.level).remaining} XP para {getLevelProgress(selectedPlayer.xp, selectedPlayer.level).next}</span>
                )}
              </div>
              <div className="h-4 w-full bg-slate-900 rounded-2xl overflow-hidden border border-white/5 p-1">
                <div 
                  className={`h-full bg-gradient-to-r ${XP_RANK_COLORS[selectedPlayer.level]} rounded-xl transition-all duration-1000`} 
                  style={{ width: `${getLevelProgress(selectedPlayer.xp, selectedPlayer.level).progress}%` }} 
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Victorias', val: selectedPlayer.wins, color: 'text-white' },
                { label: 'Derrotas', val: selectedPlayer.losses, color: 'text-slate-500' },
                { label: 'Capicúas', val: selectedPlayer.capicuas, color: 'text-sky-500' }
              ].map((stat, i) => (
                <div key={i} className="bg-slate-900/50 p-4 rounded-3xl text-center border border-white/5">
                  <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">{stat.label}</div>
                  <div className={`text-2xl font-black italic ${stat.color}`}>{stat.val}</div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center px-1">
                <Award size={14} className="mr-2 text-sky-500" /> Insignias Obtenidas
              </h4>
              <div className="grid grid-cols-4 gap-3">
                {BADGES.map(badge => {
                  const isUnlocked = selectedPlayer.badges.includes(badge.id);
                  return (
                    <div 
                      key={badge.id} 
                      className={`aspect-square rounded-[1.5rem] flex flex-col items-center justify-center border transition-all ${isUnlocked ? 'bg-sky-500/10 border-sky-500/30 grayscale-0' : 'bg-slate-900/50 border-white/5 grayscale opacity-20'}`}
                    >
                      <span className="text-3xl mb-1">{badge.icon}</span>
                      <span className="text-[7px] font-black uppercase text-center px-1 truncate w-full">{badge.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center px-1">
                <History size={14} className="mr-2 text-sky-500" /> Últimos Encuentros
              </h4>
              <div className="space-y-2 pb-4">
                {getPlayerHistory(selectedPlayer.id).map(g => {
                  const won = g.winners.includes(selectedPlayer.id);
                  return (
                    <div key={g.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`w-2 h-2 rounded-full ${won ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`} />
                        <div>
                          <div className="text-xs font-black text-white uppercase italic">{g.mode}</div>
                          <div className="text-[9px] font-bold text-slate-500 uppercase">{new Date(g.timestamp).toLocaleDateString()}</div>
                        </div>
                      </div>
                      {g.isCapicua && <span className="text-[9px] font-black text-sky-500 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 uppercase tracking-widest">CAPICÚA</span>}
                    </div>
                  );
                })}
                {getPlayerHistory(selectedPlayer.id).length === 0 && (
                  <p className="text-center text-[10px] text-slate-600 font-bold uppercase py-4 italic">No hay historial para este tiguere todavía.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
