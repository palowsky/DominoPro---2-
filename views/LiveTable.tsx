
import React, { useState, useCallback } from 'react';
import { GameMode } from '../types';
import { Users, Target, Trash2, Trophy, Clover, Plus, LayoutGrid, ChevronRight, X, Shield, Swords, Delete, Eraser, Check, Flame } from 'lucide-react';
import { getDisplayName } from './League';
import { useLeague } from '../contexts/LeagueContext';

// --- Audio & Haptic System ---
const playSound = (type: 'click' | 'delete' | 'success' | 'error') => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  const now = ctx.currentTime;

  if (type === 'click') {
    // Soft high-tech pop
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    osc.start(now);
    osc.stop(now + 0.1);
  } else if (type === 'delete') {
    // Low mechanical click
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(100, now + 0.1);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  } else if (type === 'success') {
    // Ascending major chord
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major
    notes.forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      o.connect(g);
      g.connect(ctx.destination);
      const start = now + (i * 0.05);
      g.gain.setValueAtTime(0, start);
      g.gain.linearRampToValueAtTime(0.1, start + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
      o.start(start);
      o.stop(start + 0.5);
    });
  }
  
  // Haptic feedback for mobile
  if (navigator.vibrate) {
    navigator.vibrate(type === 'success' ? [50, 50, 50] : 10);
  }
};

export const LiveTable: React.FC = () => {
  const { players, activeSessions, startSession, finishSession, updateScore, cancelSession } = useLeague();
  const [isOpeningMesa, setIsOpeningMesa] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [mode, setMode] = useState<GameMode>('2v2');
  
  // En modo 2v2: indices 0,1 son Pareja 1 (Casa); indices 2,3 son Pareja 2 (Visitante)
  const [selected, setSelected] = useState<string[]>([]);
  
  const [isAnoteOpen, setIsAnoteOpen] = useState(false);
  const [tempPoints, setTempPoints] = useState<string>('0');
  
  // En 2v2, seleccionamos el equipo primero, luego el jugador específico
  const [selectedTeamForPoints, setSelectedTeamForPoints] = useState<string[] | null>(null); 
  const [targetPlayerId, setTargetPlayerId] = useState<string | null>(null);

  const togglePlayer = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(p => p !== id));
    } else {
      const limit = mode === '2v2' ? 4 : 3;
      if (selected.length < limit) {
        setSelected([...selected, id]);
      }
    }
  };

  const handleStart = () => {
    startSession(mode, selected);
    setIsOpeningMesa(false);
    setSelected([]);
  };

  const openAnote = (teamPlayers: string[]) => {
    setSelectedTeamForPoints(teamPlayers);
    setTargetPlayerId(teamPlayers[0]);
    setTempPoints('');
    setIsAnoteOpen(true);
  };

  const handleKeypad = (num: number) => {
    playSound('click');
    setTempPoints(prev => {
      if (prev.length >= 3) return prev;
      return prev + num.toString();
    });
  };

  const handleBackspace = () => {
    playSound('delete');
    setTempPoints(prev => prev.slice(0, -1));
  };
  
  const handleClear = () => {
      playSound('delete');
      setTempPoints('');
  };

  const submitScore = () => {
    const points = parseInt(tempPoints || '0', 10);
    if (targetPlayerId && selectedSessionId && points > 0) {
      playSound('success');
      updateScore(selectedSessionId, targetPlayerId, points);
      setIsAnoteOpen(false);
      setTargetPlayerId(null);
      setSelectedTeamForPoints(null);
      setTempPoints('0');
    }
  };

  // Renderiza la vista de sesión activa
  if (selectedSessionId) {
    const session = activeSessions.find(s => s.id === selectedSessionId);
    if (!session) { setSelectedSessionId(null); return null; }
    
    const isPintintin = session.mode === 'Pintintin';
    const winScore = isPintintin ? 150 : 200;

    let teams: { name: string, players: string[], score: number }[] = [];

    if (isPintintin) {
      teams = session.players.map(pid => ({
        name: getDisplayName(players.find(p => p.id === pid)),
        players: [pid],
        score: session.scores[pid] || 0
      }));
    } else {
      const team1Ids = session.players.slice(0, 2);
      const team2Ids = session.players.slice(2, 4);
      
      const score1 = (session.scores[team1Ids[0]] || 0) + (session.scores[team1Ids[1]] || 0);
      const score2 = (session.scores[team2Ids[0]] || 0) + (session.scores[team2Ids[1]] || 0);

      teams = [
        { name: 'Pareja 1 (Casa)', players: team1Ids, score: score1 },
        { name: 'Pareja 2 (Visita)', players: team2Ids, score: score2 }
      ];
    }

    const potentialWinningTeam = teams.find(t => t.score >= winScore);

    return (
      <div className="space-y-6 animate-in slide-in-from-bottom duration-500 pb-12">
        {/* Header de la Sesión */}
        <div className="flex justify-between items-center px-2">
          <button onClick={() => setSelectedSessionId(null)} className="p-2 bg-white/5 rounded-full text-slate-400">
            <ChevronRight className="rotate-180" size={20} />
          </button>
          <div className="text-center">
            <h2 className="text-lg font-black italic uppercase text-white tracking-tight">Mesa Activa</h2>
            <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{session.mode}</div>
          </div>
          <button onClick={() => { if(confirm('¿Cancelar mesa?')) cancelSession(session.id); }} className="p-2 bg-red-600/10 rounded-full text-red-600"><Trash2 size={20} /></button>
        </div>

        {/* Tablero de Puntuación */}
        <div className={`grid ${isPintintin ? 'grid-cols-2' : 'grid-cols-1'} gap-4 px-2`}>
          {teams.map((team, idx) => {
            const teamMaxStreak = Math.max(...team.players.map(pid => players.find(p => p.id === pid)?.streak || 0));
            const isOnFire = teamMaxStreak >= 3;
            const isInferno = teamMaxStreak >= 10;

            return (
              <div 
                key={idx} 
                onClick={() => openAnote(team.players)} 
                className={`glass-card p-6 rounded-[2.5rem] relative group overflow-hidden border-white/5 active:scale-[0.98] transition-all cursor-pointer ${isPintintin ? '' : 'flex items-center justify-between'} ${isOnFire ? 'animate-fire-border border-orange-500/50' : ''}`}
              >
                {/* Fire Indicator Icon */}
                {isOnFire && (
                  <div className="absolute top-0 right-0 p-3 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
                    <Flame className="text-orange-500 animate-pulse drop-shadow-[0_0_8px_rgba(255,69,0,0.8)]" size={20} fill="currentColor" />
                  </div>
                )}

                {/* Información del Equipo/Jugador */}
                <div className={isPintintin ? 'text-center' : 'flex-1'}>
                  <div className="text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">{team.name}</div>
                  <div className={`font-bold text-slate-300 ${isPintintin ? 'text-sm' : 'text-lg leading-tight'}`}>
                    {team.players.map(pid => getDisplayName(players.find(p => p.id === pid))).join(' & ')}
                  </div>
                  {!isPintintin && (
                    <div className="h-1.5 w-24 bg-slate-900 rounded-full mt-3 overflow-hidden border border-white/5">
                        <div className={`h-full transition-all duration-700 ${team.score >= winScore ? 'bg-green-500' : 'bg-blue-600'}`} style={{ width: `${Math.min((team.score/winScore)*100, 100)}%` }} />
                    </div>
                  )}
                </div>

                {/* Puntuación Grande */}
                <div className={isPintintin ? 'mt-2 text-center' : 'text-right pl-4'}>
                  <div className={`font-black italic text-white ${isPintintin ? 'text-4xl' : 'text-6xl'} ${isInferno ? 'animate-inferno-text' : ''}`}>{team.score}</div>
                </div>
                
                {isPintintin && (
                  <div className="h-1.5 w-full bg-slate-900 rounded-full mt-4 overflow-hidden border border-white/5">
                      <div className="h-full bg-blue-600 transition-all duration-700" style={{ width: `${Math.min((team.score/winScore)*100, 100)}%` }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Botones de Victoria */}
        {potentialWinningTeam && (
          <div className="mx-2 glass-card p-6 rounded-[3rem] border-blue-600/30 bg-blue-600/5 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="text-center">
                <h3 className="font-black italic text-blue-500 uppercase tracking-tighter text-lg">¡TENEMOS GANADOR!</h3>
                <p className="text-white font-bold text-sm mt-1">{potentialWinningTeam.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
               <button onClick={() => finishSession(session.id, potentialWinningTeam.players, session.scores, false)} className="bg-blue-600 text-white font-black uppercase text-xs py-4 rounded-2xl flex items-center justify-center shadow-lg hover:bg-blue-500"><Trophy size={16} className="mr-2" /> VICTORIA</button>
               <button onClick={() => finishSession(session.id, potentialWinningTeam.players, session.scores, true)} className="bg-red-600 text-white font-black uppercase text-xs py-4 rounded-2xl flex items-center justify-center shadow-lg hover:bg-red-500"><Target size={16} className="mr-2" /> CAPICÚA</button>
            </div>
          </div>
        )}

        {/* --- MODAL DE ANOTACIÓN INMERSIVO --- */}
        {isAnoteOpen && selectedTeamForPoints && (
          <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="w-full max-w-sm bg-slate-900/50 rounded-t-[3rem] sm:rounded-[3rem] p-6 pb-10 space-y-6 animate-in slide-in-from-bottom duration-300 border-t sm:border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center">
              
              {/* Handle para móvil */}
              <div className="w-12 h-1.5 bg-white/10 rounded-full mb-2 sm:hidden"></div>

              {/* Header: Quién Anotó */}
              <div className="w-full">
                {!isPintintin && (
                    <div className="flex p-1.5 bg-slate-950/80 rounded-2xl mb-4 border border-white/5">
                        {selectedTeamForPoints.map(pid => (
                            <button 
                                key={pid}
                                onClick={() => { playSound('click'); setTargetPlayerId(pid); }}
                                className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all duration-300 ${targetPlayerId === pid ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                            >
                                {getDisplayName(players.find(p => p.id === pid))}
                            </button>
                        ))}
                    </div>
                )}
                <div className="text-center">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">PUNTOS PARA</div>
                  <div className="text-xl font-black text-white italic truncate tracking-tight">
                      {isPintintin 
                          ? getDisplayName(players.find(p => p.id === targetPlayerId!)) 
                          : (targetPlayerId ? getDisplayName(players.find(p => p.id === targetPlayerId)) : 'Selecciona Jugador')
                      }
                  </div>
                </div>
              </div>

              {/* Display Numérico Gigante */}
              <div className="w-full py-4 flex justify-center">
                <div className={`text-8xl font-black italic tabular-nums tracking-tighter drop-shadow-2xl transition-all duration-200 ${tempPoints ? 'text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400' : 'text-slate-800'}`}>
                  {tempPoints || '0'}
                </div>
              </div>

              {/* Keypad Numérico Ergonómico */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <button 
                    key={num} 
                    onClick={() => handleKeypad(num)} 
                    className="h-16 rounded-2xl bg-white/5 border-t border-white/10 text-3xl font-bold text-white shadow-lg active:scale-90 active:bg-blue-600 active:border-blue-500 active:shadow-blue-600/50 transition-all duration-100 flex items-center justify-center group"
                  >
                    <span className="group-active:scale-110 transition-transform">{num}</span>
                  </button>
                ))}
                
                {/* Botón Borrar Todo */}
                <button 
                  onClick={handleClear} 
                  className="h-16 rounded-2xl bg-red-500/10 border-t border-red-500/20 flex items-center justify-center text-red-500 active:scale-90 active:bg-red-600 active:text-white transition-all duration-100"
                >
                  <Eraser size={24} strokeWidth={2.5} />
                </button>
                
                <button 
                  onClick={() => handleKeypad(0)} 
                  className="h-16 rounded-2xl bg-white/5 border-t border-white/10 text-3xl font-bold text-white shadow-lg active:scale-90 active:bg-blue-600 active:border-blue-500 transition-all duration-100"
                >
                  0
                </button>
                
                {/* Botón Backspace */}
                <button 
                  onClick={handleBackspace} 
                  className="h-16 rounded-2xl bg-white/5 border-t border-white/10 flex items-center justify-center text-slate-400 active:scale-90 active:bg-white/20 active:text-white transition-all duration-100"
                >
                  <Delete size={24} strokeWidth={2.5} />
                </button>
              </div>

              {/* Botones de Acción */}
              <div className="grid grid-cols-2 gap-4 w-full pt-4">
                <button onClick={() => setIsAnoteOpen(false)} className="py-4 rounded-2xl font-black text-slate-500 bg-slate-900 uppercase text-xs tracking-widest border border-white/5 active:scale-95 transition-transform">Cancelar</button>
                <button 
                    onClick={submitScore} 
                    disabled={!targetPlayerId || !tempPoints} 
                    className="py-4 rounded-2xl font-black text-white bg-blue-600 uppercase text-xs tracking-widest shadow-[0_0_30px_rgba(37,99,235,0.3)] disabled:opacity-50 disabled:shadow-none active:scale-95 transition-all flex items-center justify-center space-x-2"
                >
                    <span>Guardar</span>
                    <Check size={16} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- Vista de Creación de Mesa (Sin cambios funcionales, solo estilo consistente) ---
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-black italic uppercase text-slate-200 tracking-tight">Panel de Partidas</h2>
        <button onClick={() => setIsOpeningMesa(true)} className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-600/20 active:scale-90 transition-transform"><Plus size={20} /></button>
      </div>

      <div className="space-y-3 px-2">
        {activeSessions.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-[3rem] border-dashed border-white/10">
            <LayoutGrid className="mx-auto text-slate-800 mb-4" size={48} />
            <p className="text-slate-500 text-sm font-medium">No hay sesiones activas.</p>
          </div>
        ) : (
          activeSessions.map(session => (
            <div key={session.id} onClick={() => setSelectedSessionId(session.id)} className="glass-card p-5 rounded-[2rem] flex items-center justify-between border-l-4 border-blue-700 cursor-pointer active:scale-[0.98] transition-all">
              <div className="flex-1 mr-4">
                <div className="flex items-center space-x-2 mb-1">
                   <span className="font-black italic uppercase text-sm text-white">{session.mode}</span>
                   {session.mode === '2v2' && <span className="text-[9px] px-1.5 py-0.5 bg-blue-500/10 text-blue-500 rounded border border-blue-500/20 font-bold">PAREJAS</span>}
                </div>
                <div className="text-[10px] font-bold text-slate-500 truncate">
                  {session.players.map(id => getDisplayName(players.find(p => p.id === id))).join(session.mode === '2v2' ? ' ' : ' / ')}
                </div>
              </div>
              <ChevronRight className="text-slate-800" size={18} />
            </div>
          ))
        )}
      </div>

      {isOpeningMesa && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/95 backdrop-blur-xl animate-in fade-in">
          <div className="glass-card w-full max-w-lg rounded-t-[3rem] sm:rounded-[3rem] p-6 sm:p-8 space-y-6 animate-in slide-in-from-bottom border-white/10 max-h-[95vh] overflow-y-auto flex flex-col">
            <div className="flex justify-between items-center shrink-0">
              <h3 className="text-xl font-black italic uppercase text-white">Nueva Sesión</h3>
              <button onClick={() => setIsOpeningMesa(false)} className="p-2 bg-white/5 rounded-full text-slate-500 hover:text-white"><X size={20} /></button>
            </div>
            
            {/* Selector de Modo */}
            <div className="grid grid-cols-2 gap-4 shrink-0">
              <button onClick={() => { setMode('2v2'); setSelected([]); }} className={`p-4 rounded-[2rem] border-2 transition-all ${mode === '2v2' ? 'border-blue-600 bg-blue-600/10 shadow-[0_0_15px_rgba(37,99,235,0.2)]' : 'border-white/5 opacity-60'}`}>
                <div className="flex justify-center mb-2"><Users size={24} className={mode === '2v2' ? 'text-blue-500' : 'text-slate-500'} /></div>
                <span className={`text-[10px] font-black uppercase block text-center ${mode === '2v2' ? 'text-white' : 'text-slate-500'}`}>Parejas</span>
              </button>
              <button onClick={() => { setMode('Pintintin'); setSelected([]); }} className={`p-4 rounded-[2rem] border-2 transition-all ${mode === 'Pintintin' ? 'border-blue-600 bg-blue-600/10 shadow-[0_0_15px_rgba(37,99,235,0.2)]' : 'border-white/5 opacity-60'}`}>
                <div className="flex justify-center mb-2"><Clover size={24} className={mode === 'Pintintin' ? 'text-blue-500' : 'text-slate-500'} /></div>
                <span className={`text-[10px] font-black uppercase block text-center ${mode === 'Pintintin' ? 'text-white' : 'text-slate-500'}`}>Pintintín</span>
              </button>
            </div>

            {/* Configuración de Equipos (2v2) o Selección Simple (Pintintin) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
                {mode === '2v2' ? (
                    <div className="space-y-4">
                        {/* Pareja 1 */}
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 px-2">
                                <Shield size={12} className="text-blue-500" />
                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Pareja 1 (Casa)</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {[0, 1].map(idx => {
                                    const pId = selected[idx];
                                    const player = pId ? players.find(p => p.id === pId) : null;
                                    return (
                                        <div 
                                            key={`p1-${idx}`} 
                                            onClick={() => pId && togglePlayer(pId)}
                                            className={`h-16 rounded-2xl border flex items-center justify-center p-2 text-center transition-all ${player ? 'bg-blue-600/20 border-blue-500/50' : 'bg-slate-900 border-dashed border-white/10'}`}
                                        >
                                            {player ? (
                                                <span className="text-xs font-black text-white truncate leading-none">{getDisplayName(player)}</span>
                                            ) : (
                                                <span className="text-[9px] font-bold text-slate-700 uppercase">Vacío</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex justify-center -my-2 relative z-10">
                            <div className="bg-slate-950 p-2 rounded-full border border-white/10">
                                <Swords size={16} className="text-slate-500" />
                            </div>
                        </div>

                        {/* Pareja 2 */}
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 px-2">
                                <Swords size={12} className="text-red-500" />
                                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Pareja 2 (Visita)</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {[2, 3].map(idx => {
                                    const pId = selected[idx];
                                    const player = pId ? players.find(p => p.id === pId) : null;
                                    return (
                                        <div 
                                            key={`p2-${idx}`} 
                                            onClick={() => pId && togglePlayer(pId)}
                                            className={`h-16 rounded-2xl border flex items-center justify-center p-2 text-center transition-all ${player ? 'bg-red-600/20 border-red-500/50' : 'bg-slate-900 border-dashed border-white/10'}`}
                                        >
                                            {player ? (
                                                <span className="text-xs font-black text-white truncate leading-none">{getDisplayName(player)}</span>
                                            ) : (
                                                <span className="text-[9px] font-bold text-slate-700 uppercase">Vacío</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2">
                       {/* UI Selección simple para Pintintin */}
                       {selected.map(pid => (
                           <div key={pid} onClick={() => togglePlayer(pid)} className="bg-blue-600/20 border border-blue-500/50 p-3 rounded-2xl flex items-center justify-between">
                               <span className="text-xs font-bold text-white truncate">{getDisplayName(players.find(p => p.id === pid))}</span>
                               <X size={14} className="text-blue-400" />
                           </div>
                       ))}
                       {Array.from({ length: Math.max(0, (mode === 'Pintintin' ? 3 : 4) - selected.length) }).map((_, i) => (
                           <div key={i} className="bg-slate-900 border-dashed border-white/10 p-3 rounded-2xl flex items-center justify-center">
                               <span className="text-[9px] text-slate-700 font-bold uppercase">Jugador {selected.length + i + 1}</span>
                           </div>
                       ))}
                    </div>
                )}

                {/* Lista de Jugadores Disponibles */}
                <div className="pt-4 border-t border-white/10">
                    <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Disponibles</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {players.filter(p => p.status === 'active' && !selected.includes(p.id)).map(player => (
                        <button key={player.id} onClick={() => togglePlayer(player.id)} className="p-3 rounded-2xl border border-white/5 bg-slate-900/50 text-left hover:bg-white/5 transition-colors">
                            <span className="text-xs font-bold truncate text-slate-400 block">{getDisplayName(player)}</span>
                        </button>
                        ))}
                    </div>
                </div>
            </div>

            <button disabled={selected.length < (mode === '2v2' ? 4 : 3)} onClick={handleStart} className="w-full py-5 rounded-[1.5rem] bg-blue-600 text-white font-black uppercase tracking-widest text-sm disabled:opacity-20 shrink-0 shadow-xl shadow-blue-900/20">
              {mode === '2v2' ? '¡DALE!' : 'INICIAR'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
