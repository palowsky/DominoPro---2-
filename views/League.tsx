
import React, { useState } from 'react';
import { Player, Level } from '../types';
import { XP_RANK_COLORS, LEVEL_THRESHOLDS, BADGES } from '../constants';
import { X, History, Award, ChevronRight, Search, Star, Users, Medal, Sparkles, BookOpen } from 'lucide-react';
import { useLeague } from '../contexts/LeagueContext';
import { RuleBook } from '../components/RuleBook';

const getFormalLevelName = (level: Level): string => {
  switch(level) {
    case 'Pollito': return 'Novato';
    case 'Principiante': return 'Principiante';
    case 'Tiguere': return 'Avanzado';
    case 'Maestro': return 'Maestro';
    case 'Leyenda': return 'Leyenda';
  }
};

export const getDisplayName = (player?: Player): string => {
  if (!player) return 'Jugador';
  return player.nickname || player.name;
};

export const League: React.FC = () => {
  const { players, games } = useLeague();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRules, setShowRules] = useState(false);
  const sortedPlayers = [...players].sort((a, b) => b.xp - a.xp);

  const getPlayerHistory = (id: string) => {
    return games
      .filter(g => g.winners.includes(id) || g.losers.includes(id))
      .sort((a, b) => b.timestamp - a.timestamp);
  };

  const getLevelProgress = (xp: number, currentLevel: Level) => {
    const currentThreshold = LEVEL_THRESHOLDS[currentLevel];
    const levels = Object.keys(LEVEL_THRESHOLDS) as Level[];
    const currentIndex = levels.indexOf(currentLevel);
    const nextLevel = levels[currentIndex + 1];
    
    // Si es nivel máximo (Leyenda)
    if (!nextLevel) return { progress: 100, remaining: 0, nextThreshold: xp, currentThreshold };
    
    const nextThreshold = LEVEL_THRESHOLDS[nextLevel];
    const progress = ((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
    const remaining = nextThreshold - xp;
    
    return { 
        progress: Math.min(Math.max(progress, 0), 100),
        remaining,
        nextThreshold,
        currentThreshold
    };
  };

  const filteredPlayers = sortedPlayers.filter(p => 
    (p.nickname?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-black italic uppercase text-slate-200 tracking-tight">Ranking Oficial</h2>
          <div className="bg-blue-600/10 text-blue-500 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase border border-blue-500/20">
            {players.length}
          </div>
        </div>
        
        <button 
          onClick={() => setShowRules(true)}
          className="p-2 bg-white/5 hover:bg-blue-600/20 rounded-xl text-slate-400 hover:text-blue-400 transition-all border border-transparent hover:border-blue-500/30"
        >
          <BookOpen size={20} />
        </button>
      </div>

      <div className="px-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre o apodo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-sm font-bold text-white outline-none focus:border-blue-600/50 transition-all placeholder:text-slate-600"
          />
          {searchTerm && (
            <button 
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
            >
                <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {filteredPlayers.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-[3rem] border-dashed border-white/5 mx-2">
            <Users className="mx-auto text-slate-800 mb-4" size={48} />
            <p className="text-slate-500 text-sm font-medium">
                {searchTerm ? 'No se encontraron jugadores.' : 'No hay registros.'}
            </p>
          </div>
        ) : (
          filteredPlayers.map((player) => {
            const { progress, remaining, nextThreshold } = getLevelProgress(player.xp, player.level);
            const playerIndex = sortedPlayers.findIndex(p => p.id === player.id);
            const isSearching = searchTerm.length > 0;
            const history = getPlayerHistory(player.id).slice(0, 3);
            const isOnStreak = player.streak >= 3;
            const isMaxLevel = player.level === 'Leyenda';
            const isCloseToLevelUp = !isMaxLevel && progress > 85;

            return (
              <div 
                key={player.id} 
                onClick={() => setSelectedPlayer(player)}
                className={`glass-card p-5 rounded-[2.5rem] relative overflow-hidden cursor-pointer hover:border-blue-500/40 transition-all border-white/5 mx-2 group ${isOnStreak ? 'animate-streak' : ''}`}
              >
                <div className="absolute top-4 right-4 text-3xl font-black italic text-white/5 leading-none">#{playerIndex + 1}</div>
                <div className="flex items-center space-x-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${XP_RANK_COLORS[player.level]} flex items-center justify-center text-2xl shadow-xl border border-white/20 shrink-0`}>
                    {playerIndex === 0 ? '🏆' : getDisplayName(player).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                       <h3 className="font-black text-lg text-white leading-tight italic truncate">{getDisplayName(player)}</h3>
                       {isOnStreak && <Star size={12} className="text-red-500 fill-current" />}
                    </div>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{getFormalLevelName(player.level)}</span>
                      <span className="text-slate-700 text-[10px]">|</span>
                      <div className="flex items-center text-[9px] font-black text-blue-500 uppercase">{player.xp} XP</div>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-800" />
                </div>

                {isSearching && (
                  <div className="mt-5 space-y-3 animate-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white/5 rounded-2xl p-2 text-center border border-white/5">
                        <div className="text-[7px] font-black text-slate-500 uppercase mb-0.5 tracking-widest">V</div>
                        <div className="text-sm font-black text-white">{player.wins}</div>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-2 text-center border border-white/5">
                        <div className="text-[7px] font-black text-slate-500 uppercase mb-0.5 tracking-widest">D</div>
                        <div className="text-sm font-black text-slate-400">{player.losses}</div>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-2 text-center border border-white/5">
                        <div className="text-[7px] font-black text-blue-500/50 uppercase mb-0.5 tracking-widest">C</div>
                        <div className="text-sm font-black text-blue-500">{player.capicuas}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 bg-slate-900/50 rounded-xl border border-white/5">
                      <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Últimos 3</span>
                      <div className="flex space-x-2">
                        {history.length > 0 ? history.map((g, i) => (
                          <div key={i} className={`w-2.5 h-2.5 rounded-full ${g.winners.includes(player.id) ? 'bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]' : 'bg-red-600 shadow-[0_0_5px_rgba(220,38,38,0.5)]'}`} />
                        )) : <span className="text-[8px] text-slate-700 italic uppercase">Sin juegos</span>}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Level Progress Bar */}
                <div className="mt-4 px-1 relative">
                  <div className="flex justify-between items-end mb-1.5">
                      <span className={`text-[9px] font-black uppercase tracking-wider flex items-center transition-colors ${isCloseToLevelUp ? 'text-blue-400 animate-pulse' : 'text-slate-500'}`}>
                          {isMaxLevel ? 'Nivel Máximo' : (
                             <>
                               {isCloseToLevelUp && <Sparkles size={10} className="mr-1.5" />}
                               Próximo: {remaining} XP
                             </>
                          )}
                      </span>
                      <span className="text-[9px] font-bold text-slate-600 font-mono tracking-tight">
                         {isMaxLevel ? 'MAX' : `${Math.floor(player.xp)}/${nextThreshold}`}
                      </span>
                  </div>
                  <div className="h-2 w-full bg-slate-950/50 rounded-full overflow-hidden border border-white/5 p-[1px] shadow-inner">
                    <div 
                        className={`h-full rounded-full bg-gradient-to-r ${XP_RANK_COLORS[player.level]} transition-all duration-1000 ease-out relative`} 
                        style={{ width: `${progress}%` }} 
                    >
                        {isCloseToLevelUp && (
                             <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedPlayer && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/95 backdrop-blur-xl animate-in fade-in">
          <div className="glass-card w-full max-w-lg rounded-t-[3rem] sm:rounded-[3rem] p-8 space-y-8 animate-in slide-in-from-bottom duration-300 border-white/10 max-h-[90vh] overflow-y-auto custom-scrollbar">
             <div className="flex justify-between items-start">
              <div className="flex items-center space-x-5">
                <div className={`w-20 h-20 rounded-[2rem] bg-gradient-to-br ${XP_RANK_COLORS[selectedPlayer.level]} flex items-center justify-center text-4xl shadow-2xl border-2 border-white/20`}>
                  {getDisplayName(selectedPlayer).charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-3xl font-black italic text-white leading-none tracking-tighter">{getDisplayName(selectedPlayer)}</h3>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">{selectedPlayer.name}</p>
                  <div className="flex items-center mt-3 space-x-2">
                    <span className="px-3 py-1 bg-blue-600/10 rounded-full text-[10px] font-black text-blue-500 uppercase border border-blue-500/20">{getFormalLevelName(selectedPlayer.level)}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedPlayer(null)} className="p-3 bg-white/5 rounded-full text-slate-500 hover:text-white"><X size={20} /></button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Victorias', val: selectedPlayer.wins, color: 'text-white' },
                { label: 'Derrotas', val: selectedPlayer.losses, color: 'text-slate-500' },
                { label: 'Capicúas', val: selectedPlayer.capicuas, color: 'text-blue-500' }
              ].map((stat, i) => (
                <div key={i} className="bg-slate-900/50 p-4 rounded-3xl text-center border border-white/5">
                  <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">{stat.label}</div>
                  <div className={`text-2xl font-black italic ${stat.color}`}>{stat.val}</div>
                </div>
              ))}
            </div>

            {/* --- SECCIÓN DE BADGES (EXPANDIDA) --- */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                 <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center">
                    <Medal size={14} className="mr-2 text-yellow-500" /> Sala de Trofeos
                 </h4>
                 <span className="text-[10px] font-bold text-slate-700">{selectedPlayer.badges.length} / {BADGES.length}</span>
              </div>
              
              {/* Rejilla optimizada para 37+ items: gap más pequeño en movil, iconos ligeramente más compactos */}
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 sm:gap-3 bg-slate-900/30 p-4 rounded-[2rem] border border-white/5">
                 {BADGES.map(badge => {
                     const isUnlocked = selectedPlayer.badges.includes(badge.id);
                     let tierColor = 'border-slate-800';
                     if (badge.tier === 'Gold') tierColor = 'border-yellow-500/50 shadow-yellow-500/20';
                     if (badge.tier === 'Silver') tierColor = 'border-slate-300/50 shadow-slate-300/20';
                     if (badge.tier === 'Platino') tierColor = 'border-purple-500/50 shadow-purple-500/20';
                     if (badge.tier === 'Bronze') tierColor = 'border-orange-700/50';

                     return (
                         <div key={badge.id} className="relative group flex flex-col items-center">
                             <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl sm:text-2xl border transition-all duration-300 ${isUnlocked ? `bg-gradient-to-br from-slate-800 to-slate-900 ${tierColor} shadow-lg scale-100` : 'bg-slate-900/50 border-white/5 opacity-30 grayscale scale-90'}`}>
                                 {badge.icon}
                             </div>
                             {/* Tooltip mejorado */}
                             {isUnlocked && (
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-950 text-[9px] font-bold text-white px-3 py-1.5 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-20 pointer-events-none shadow-xl transform translate-y-2 group-hover:translate-y-0">
                                    {badge.name}
                                </div>
                             )}
                         </div>
                     )
                 })}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center px-1">
                <History size={14} className="mr-2 text-blue-500" /> Historial Reciente
              </h4>
              <div className="space-y-2 pb-4">
                {getPlayerHistory(selectedPlayer.id).slice(0, 5).map(g => {
                  const won = g.winners.includes(selectedPlayer.id);
                  return (
                    <div key={g.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex items-center space-x-4">
                        <div className={`w-2 h-2 rounded-full ${won ? 'bg-blue-500 shadow-[0_0_8px_rgba(29,78,216,0.5)]' : 'bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]'}`} />
                        <div>
                          <div className="text-xs font-black text-white uppercase italic">{g.mode}</div>
                          <div className="text-[9px] font-bold text-slate-500 uppercase">{new Date(g.timestamp).toLocaleDateString()}</div>
                        </div>
                      </div>
                      {g.isCapicua && <span className="text-[9px] font-black text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 uppercase">CAPICÚA</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rules Modal Integration */}
      <RuleBook isOpen={showRules} onClose={() => setShowRules(false)} />
    </div>
  );
};
