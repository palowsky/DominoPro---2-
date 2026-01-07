
import React, { useState } from 'react';
import { Player } from '../types';
import { UserPlus, Download, Upload, Trash2, Lock, ShieldCheck, UserMinus, Plus } from 'lucide-react';
import { getDisplayName } from './League';

interface AdminProps {
  players: Player[];
  onAddPlayer: (name: string, nickname?: string) => void;
  onArchivePlayer: (id: string) => void;
  onResetData: () => void;
  onImportData: (json: string) => void;
}

export const Admin: React.FC<AdminProps> = ({ 
  players, 
  onAddPlayer, 
  onArchivePlayer, 
  onResetData, 
  onImportData 
}) => {
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [newName, setNewName] = useState('');
  const [newNickname, setNewNickname] = useState('');

  const handleUnlock = () => {
    if (pin === '1234') {
      setIsUnlocked(true);
    } else {
      alert('Acceso denegado. PIN incorrecto.');
      setPin('');
    }
  };

  const handleAdd = () => {
    if (!newName) return;
    onAddPlayer(newName, newNickname || undefined);
    setNewName('');
    setNewNickname('');
  };

  const exportData = () => {
    const data = localStorage.getItem('DOMINO_PRO_LAST_STATE');
    const blob = new Blob([data || '{}'], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `domino-pro-oficial-${Date.now()}.json`;
    a.click();
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          onImportData(e.target?.result as string);
          alert('Datos importados correctamente.');
        } catch (err) {
          alert('Error al procesar el archivo.');
        }
      };
      reader.readAsText(file);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center space-y-8 pt-12">
        <div className="p-8 glass-card rounded-full text-blue-600 border-blue-600/30">
          <Lock size={64} />
        </div>
        <div className="text-center space-y-2 px-6">
          <h2 className="text-2xl font-black italic uppercase tracking-tight">Acceso Administrativo</h2>
          <p className="text-slate-500 text-sm">Ingrese el código de seguridad de la liga.</p>
        </div>
        <div className="flex space-x-3">
          {[1,2,3,4].map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full border border-blue-600/50 ${pin.length > i ? 'bg-blue-600 shadow-[0_0_8px_rgba(29,78,216,0.5)]' : 'bg-transparent'}`} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 w-full max-w-xs px-4">
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button 
              key={n} 
              onClick={() => setPin(p => p.length < 4 ? p + n : p)}
              className="w-full aspect-square glass-card rounded-2xl text-2xl font-black text-white hover:bg-blue-600/20 active:scale-90 transition-all border-white/5"
            >
              {n}
            </button>
          ))}
          <button onClick={() => setPin('')} className="glass-card rounded-2xl flex items-center justify-center font-bold text-red-600 border-red-600/20">C</button>
          <button onClick={() => setPin(p => p.length < 4 ? p + '0' : p)} className="glass-card rounded-2xl text-2xl font-black text-white">0</button>
          <button onClick={handleUnlock} className="glass-card rounded-2xl flex items-center justify-center text-blue-500 border-blue-500/20"><ShieldCheck /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500 pb-12">
      <div className="space-y-4">
        <h2 className="text-xl font-black italic uppercase text-slate-200 px-2 tracking-tight">Registro de Jugadores</h2>
        <div className="glass-card p-6 rounded-[2.5rem] space-y-4 border-white/10">
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre Completo *</label>
              <input 
                type="text" 
                placeholder="Ej: Juan Pérez"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:border-blue-600 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Apodo (Opcional)</label>
              <input 
                type="text" 
                placeholder="Ej: El Capitán"
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
                className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:border-blue-600 transition-all"
              />
            </div>
          </div>
          <button 
            onClick={handleAdd}
            disabled={!newName}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-600/20 disabled:opacity-20 active:scale-[0.98] transition-all flex items-center justify-center"
          >
            <Plus size={18} className="mr-2" /> REGISTRAR
          </button>
        </div>

        <div className="space-y-2 mt-6">
          <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-2 mb-2">Miembros Activos</h3>
          <div className="grid grid-cols-1 gap-2">
            {players.map(p => (
              <div key={p.id} className="glass-card p-4 rounded-3xl flex justify-between items-center border-white/5">
                <div className="flex flex-col">
                  <span className="font-black italic text-white text-sm">
                    {getDisplayName(p)}
                  </span>
                  {p.nickname && <span className="text-[9px] text-slate-500 uppercase font-bold">{p.name}</span>}
                </div>
                <button 
                  onClick={() => { if(confirm('¿Desea dar de baja a este jugador?')) onArchivePlayer(p.id); }}
                  className="p-2 text-slate-700 hover:text-red-600 transition-colors bg-white/5 rounded-xl"
                >
                  <UserMinus size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-white/5 space-y-6">
        <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-2">Gestión de Datos</h3>
        <div className="grid grid-cols-2 gap-4 px-2">
          <button 
            onClick={exportData}
            className="glass-card p-6 rounded-[2rem] flex flex-col items-center space-y-3 text-blue-500 border-blue-500/20 hover:bg-blue-600/5 transition-all"
          >
            <Download size={24} />
            <span className="text-[9px] font-black uppercase tracking-widest">Exportar</span>
          </button>
          <label className="glass-card p-6 rounded-[2rem] flex flex-col items-center space-y-3 text-slate-400 border-white/10 cursor-pointer hover:bg-white/5 transition-all">
            <Upload size={24} />
            <span className="text-[9px] font-black uppercase tracking-widest">Importar</span>
            <input type="file" onChange={importData} className="hidden" accept=".json" />
          </label>
        </div>
        <div className="px-2">
          <button 
            onClick={() => { if(confirm('¡ADENCIÓN! Se eliminarán todos los registros de la liga de forma permanente.')) onResetData(); }}
            className="w-full py-5 rounded-[2rem] bg-red-600/10 border border-red-600/30 text-red-600 font-black italic uppercase tracking-widest flex items-center justify-center space-x-2 active:bg-red-600 active:text-white transition-all"
          >
            <Trash2 size={20} />
            <span>Resetear Base de Datos</span>
          </button>
        </div>
      </div>
    </div>
  );
};
