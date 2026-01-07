
import React, { useState } from 'react';
import { Player } from '../types';
import { generateDominicanNickname } from '../services/geminiService';
import { UserPlus, Download, Upload, Trash2, Lock, ShieldCheck, UserCog, UserMinus } from 'lucide-react';

interface AdminProps {
  players: Player[];
  onAddPlayer: (name: string, nickname: string) => void;
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
  const [isGenerating, setIsGenerating] = useState(false);

  const handleUnlock = () => {
    if (pin === '1234') {
      setIsUnlocked(true);
    } else {
      alert('PIN Incorrecto. Dale pa tras.');
      setPin('');
    }
  };

  const handleAdd = async () => {
    if (!newName) return;
    setIsGenerating(true);
    const nickname = await generateDominicanNickname(newName);
    onAddPlayer(newName, nickname);
    setNewName('');
    setIsGenerating(false);
  };

  const exportData = () => {
    const data = localStorage.getItem('DOMINO_PRO_STATE');
    const blob = new Blob([data || '{}'], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `domino-pro-backup-${Date.now()}.json`;
    a.click();
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => onImportData(e.target?.result as string);
      reader.readAsText(file);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center space-y-8 pt-12">
        <div className="p-8 glass-card rounded-full text-sky-500">
          <Lock size={64} />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black italic uppercase">Área de Control</h2>
          <p className="text-slate-500 text-sm">Ingresa el PIN para gestionar la liga.</p>
        </div>
        <div className="flex space-x-2">
          {[1,2,3,4].map((_, i) => (
            <div key={i} className={`w-4 h-4 rounded-full border-2 border-sky-500/50 ${pin.length > i ? 'bg-sky-500' : ''}`} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button 
              key={n} 
              onClick={() => setPin(p => p.length < 4 ? p + n : p)}
              className="w-full aspect-square glass-card rounded-2xl text-2xl font-black hover:bg-sky-500/20 active:scale-90 transition-all"
            >
              {n}
            </button>
          ))}
          <button onClick={() => setPin('')} className="col-start-1 glass-card rounded-2xl flex items-center justify-center font-bold text-rose-500">C</button>
          <button onClick={() => setPin(p => p.length < 4 ? p + '0' : p)} className="glass-card rounded-2xl text-2xl font-black">0</button>
          <button onClick={handleUnlock} className="glass-card rounded-2xl flex items-center justify-center text-sky-500"><ShieldCheck /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="space-y-4">
        <h2 className="text-xl font-black italic uppercase">Gestión de Tigueres</h2>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Nombre Real"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 bg-slate-900 border border-white/10 rounded-2xl px-4 py-4 font-bold outline-none focus:border-sky-500"
          />
          <button 
            onClick={handleAdd}
            disabled={isGenerating || !newName}
            className="bg-sky-500 text-white p-4 rounded-2xl shadow-lg shadow-sky-500/20 disabled:opacity-50"
          >
            {isGenerating ? '...' : <UserPlus />}
          </button>
        </div>

        <div className="space-y-2">
          {players.map(p => (
            <div key={p.id} className="glass-card p-4 rounded-2xl flex justify-between items-center">
              <div className="flex flex-col">
                <span className="font-bold text-white">{p.nickname}</span>
                <span className="text-[10px] text-slate-500 uppercase">{p.name}</span>
              </div>
              <button 
                onClick={() => onArchivePlayer(p.id)}
                className="text-slate-600 hover:text-rose-500 transition-colors"
              >
                <UserMinus size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-8 border-t border-white/5 space-y-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Herramientas de Datos</h3>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={exportData}
            className="glass-card p-6 rounded-3xl flex flex-col items-center space-y-2 text-sky-500 border-sky-500/20"
          >
            <Download />
            <span className="text-xs font-black uppercase">Exportar</span>
          </button>
          <label className="glass-card p-6 rounded-3xl flex flex-col items-center space-y-2 text-emerald-500 border-emerald-500/20 cursor-pointer">
            <Upload />
            <span className="text-xs font-black uppercase">Importar</span>
            <input type="file" onChange={importData} className="hidden" accept=".json" />
          </label>
        </div>
        <button 
          onClick={() => { if(confirm('¿Borrar todo? No hay vuelta atrás.')) onResetData(); }}
          className="w-full py-5 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-500 font-black italic uppercase tracking-widest flex items-center justify-center space-x-2"
        >
          <Trash2 size={20} />
          <span>Resetear Liga</span>
        </button>
      </div>
    </div>
  );
};
