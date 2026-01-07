
import React, { useState } from 'react';
import { Player, GameMode, LiveSession } from '../types';
import { Users, Target, Check, Trash2, Trophy, Clover, Plus, LayoutGrid, ChevronRight, X } from 'lucide-react';

interface LiveTableProps {
  players: Player[];
  activeSessions: LiveSession[];
  onStartSession: (mode: GameMode, selectedPlayers: string[]) => void;
  onFinishSession: (sessionId: string, winners: string[], scores: Record<string, number>, isCapicua: boolean) => void;
  onUpdateScore: (sessionId: string, playerId: string, points: number) => void;
  onCancelSession: (sessionId: string) => void;
}

export const LiveTable: React.FC<LiveTableProps> = ({ 
  players, 
  activeSessions, 
  onStartSession, 
  onFinishSession,
  onUpdateScore,
  onCancelSession
}) => {
  const [isOpeningMesa, setIsOpeningMesa] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [mode, setMode] = useState<GameMode>('2v2');
  const [selected, setSelected] = useState<string[]>([]);
  
  // Scoring Overlay state
  const [isAnoteOpen, setIsAnoteOpen] = useState(false);
  const [tempPoints, setTempPoints] = useState<number>(0);
  const [currentPlayerForPoints, setCurrentPlayerForPoints] = useState<string | null>(null);

  const togglePlayer = (id: string) => {
    const limit = mode === '2v2' ? 4 : 3;
    if (selected.includes(id)) {
      setSelected(selected.filter(p => p !== id));
    } else if (selected.length < limit) {
      setSelected([...selected, id]);
    }
  };

  const handleStart = () => {
    onStartSession(mode, selected);
    setIsOpeningMesa(false);
    setSelected([]);
  };

  const openAnote = (playerId: string) => {
    setCurrentPlayerForPoints(playerId);
    setTempPoints(0);
    setIsAnoteOpen(true);
  };

  const submitScore = () => {
    if (currentPlayerForPoints && selectedSessionId) {
      onUpdateScore(selectedSessionId, currentPlayerForPoints, tempPoints);
      setIsAnoteOpen(false);
      setCurrentPlayerForPoints(null);
    }
  };

  // Render detail view for a specific session
  if (selectedSessionId) {
    const session = activeSessions.find(s => s.id === selectedSessionId);
    if (!session) { setSelectedSessionId(null); return null; }

    const isPintintin = session.mode === 'Pintintin';
    const winScore = isPintintin ? 150 : 200;
    const potentialWinners = session.players.filter(pId => session.scores[pId] >= winScore);

    return (
      <div className="space-y-6 animate-in slide-in-from-bottom duration-500 pb-12">
        <div className="flex justify-between items-center px-2">
          <button onClick={() => setSelectedSessionId(null)} className="p-2 bg-white/5 rounded-full text-slate-400">
            <ChevronRight className="rotate-180" size={20} />
          </button>
          <div className="text-center">
            <h2 className="text-lg font-black italic uppercase">Mesa en Curso</h2>
            <div className="text-[10px] font-black text-sky-500 uppercase">{session.mode} • {new Date(session.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
          </div>
          <button onClick={() => { if(confirm('¿Cerrar mesa sin guardar?')) onCancelSession(session.id); }} className="p-2 bg-rose-500/10 rounded-full text-rose-500"><Trash2 size={20} /></button>
        </div>

        <div className="grid grid-cols-2 gap-4 px-2">
          {session.players.map(pId => {
            const player = players.find(p => p.id === pId);
            const score = session.scores[pId] || 0;
            return (
              <div key={pId} onClick={() => openAnote(pId)} className="glass-card p-6 rounded-[2.5rem] text-center active:scale-95 transition-all border-white/5 hover:border-sky-500/30">
                <div className="text-[10px] font-black text-slate-500 uppercase mb-2 truncate px-2">{player?.nickname}</div>
                <div className="text-5xl font-black italic text-white">{score}</div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-sky-500 transition-all duration-700" style={{ width: `${Math.min((score/winScore)*100, 100)}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {potentialWinners.length > 0 && (
          <div className="mx-2 glass-card p-6 rounded-[2.5rem] border-emerald-500/30 bg-emerald-500/5 space-y-4 animate-in zoom-in-95">
            <h3 className="text-center font-black italic text-emerald-400 uppercase tracking-tighter">¡Hay un Ganador!</h3>
            <div className="grid grid-cols-2 gap-3">
               <button onClick={() => onFinishSession(session.id, potentialWinners, session.scores, false)} className="bg-emerald-500 text-white font-black uppercase text-xs py-4 rounded-2xl flex items-center justify-center"><Trophy size={16} className="mr-2" /> GANAR</button>
               <button onClick={() => onFinishSession(session.id, potentialWinners, session.scores, true)} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black uppercase text-xs py-4 rounded-2xl flex items-center justify-center"><Target size={16} className="mr-2" /> CAPICÚA</button>
            </div>
          </div>
        )}

        {isAnoteOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-2xl">
            <div className="glass-card w-full max-w-sm rounded-[3rem] p-8 space-y-8 animate-in zoom-in-95 duration-200 shadow-2xl shadow-sky-500/10 border-sky-500/20">
              <div className="text-center">
                <h3 className="text-slate-500 font-black uppercase text-[10px] tracking-widest mb-1">Anotar puntos para</h3>
                <div className="text-2xl font-black text-white italic">{players.find(p => p.id === currentPlayerForPoints)?.nickname}</div>
              </div>
              <div className="flex items-center justify-center space-x-8">
                <button onClick={() => setTempPoints(p => Math.max(0, p - 5))} className="w-16 h-16 rounded-3xl bg-slate-900 border border-white/5 text-2xl font-black text-rose-500 active:scale-90 transition-transform">-</button>
                <div className="text-7xl font-black italic text-white tabular-nums">{tempPoints}</div>
                <button onClick={() => setTempPoints(p => p + 5)} className="w-16 h-16 rounded-3xl bg-sky-500/10 border border-sky-500/30 text-2xl font-black text-sky-500 active:scale-90 transition-transform">+</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setIsAnoteOpen(false)} className="py-5 rounded-3xl font-black text-slate-500 bg-slate-900 uppercase text-xs tracking-widest">Cancelar</button>
                <button onClick={submitScore} className="py-5 rounded-3xl font-black text-white bg-sky-500 uppercase text-xs tracking-widest shadow-lg shadow-sky-500/30">¡ANOTE!</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Dashboard View optimized for up to 25 games
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-black italic uppercase text-slate-200">Salón de Juego</h2>
        <div className="flex items-center space-x-3">
          <span className="text-[10px] font-black text-slate-500 uppercase">{activeSessions.length}/25 MESAS</span>
          <button 
            onClick={() => setIsOpeningMesa(true)} 
            disabled={activeSessions.length >= 25}
            className="bg-sky-500 text-white p-3 rounded-2xl shadow-lg shadow-sky-500/20 active:scale-90 transition-all disabled:opacity-20"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {activeSessions.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-[3rem] border-dashed border-white/10 mx-2">
            <LayoutGrid className="mx-auto text-slate-800 mb-4" size={48} />
            <p className="text-slate-500 text-sm font-medium">No hay partidas activas.</p>
            <button onClick={() => setIsOpeningMesa(true)} className="mt-4 text-sky-500 font-black text-xs uppercase tracking-widest bg-sky-500/10 px-6 py-3 rounded-xl border border-sky-500/20">Abrir Nueva Mesa</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-2">
            {activeSessions.map(session => (
              <div 
                key={session.id} 
                onClick={() => setSelectedSessionId(session.id)} 
                className="glass-card p-5 rounded-[2rem] flex items-center justify-between border-l-4 border-sky-500 cursor-pointer active:scale-[0.98] transition-all hover:bg-white/5 group"
              >
                <div className="flex-1 mr-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-black italic text-white uppercase text-sm">{session.mode}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 mt-1 truncate">
                    {session.players.map(id => players.find(p => p.id === id)?.nickname).join(' • ')}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-xs font-black text-sky-500 uppercase">
                      {Math.max(...Object.values(session.scores))} pts
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 group-hover:bg-sky-500/10 transition-colors">
                    <ChevronRight className="text-slate-700 group-hover:text-sky-500" size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isOpeningMesa && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in">
          <div className="glass-card w-full max-w-lg rounded-t-[3rem] sm:rounded-[3rem] p-8 space-y-6 animate-in slide-in-from-bottom duration-300 border-white/10 shadow-2xl">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xl font-black italic uppercase">Configurar Mesa</h3>
              <button onClick={() => setIsOpeningMesa(false)} className="p-2 bg-white/5 rounded-full text-slate-500"><X size={20} /></button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => { setMode('2v2'); setSelected([]); }} 
                className={`p-6 rounded-[2rem] border-2 flex flex-col items-center transition-all ${mode === '2v2' ? 'border-sky-500 bg-sky-500/10 shadow-lg shadow-sky-500/5' : 'border-white/5'}`}
              >
                <Users size={28} className={mode === '2v2' ? 'text-sky-500' : 'text-slate-600'} />
                <span className={`text-[10px] font-black uppercase mt-3 tracking-widest ${mode === '2v2' ? 'text-sky-400' : 'text-slate-500'}`}>PAREJAS (4)</span>
              </button>
              <button 
                onClick={() => { setMode('Pintintin'); setSelected([]); }} 
                className={`p-6 rounded-[2rem] border-2 flex flex-col items-center transition-all ${mode === 'Pintintin' ? 'border-sky-500 bg-sky-500/10 shadow-lg shadow-sky-500/5' : 'border-white/5'}`}
              >
                <Clover size={28} className={mode === 'Pintintin' ? 'text-sky-500' : 'text-slate-600'} />
                <span className={`text-[10px] font-black uppercase mt-3 tracking-widest ${mode === 'Pintintin' ? 'text-sky-400' : 'text-slate-500'}`}>PINTINTÍN (3)</span>
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2 mb-2">Seleccionar Tigueres ({selected.length}/{mode === '2v2' ? 4 : 3})</h4>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {players.filter(p => p.status === 'active').map(player => (
                  <button 
                    key={player.id} 
                    onClick={() => togglePlayer(player.id)} 
                    className={`p-4 rounded-2xl border text-left flex justify-between items-center transition-all ${selected.includes(player.id) ? 'border-sky-500 bg-sky-500/10' : 'border-white/5 active:bg-white/5'}`}
                  >
                    <span className={`text-xs font-bold truncate ${selected.includes(player.id) ? 'text-white' : 'text-slate-400'}`}>{player.nickname}</span>
                    {selected.includes(player.id) && <Check size={14} className="text-sky-500" />}
                  </button>
                ))}
              </div>
            </div>

            <button 
              disabled={selected.length < (mode === '2v2' ? 4 : 3)} 
              onClick={handleStart} 
              className="w-full py-5 rounded-[1.5rem] bg-sky-500 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-sky-500/30 disabled:opacity-20 active:scale-95 transition-all"
            >
              SENTARSE A JUGAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
