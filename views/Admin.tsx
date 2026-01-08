
import React, { useState } from 'react';
import { Download, Upload, Trash2, Lock, ShieldCheck, UserMinus, Plus, Shield, UserCheck, Archive, RotateCcw, KeyRound, Save } from 'lucide-react';
import { getDisplayName } from './League';
import { useLeague } from '../contexts/LeagueContext';

export const Admin: React.FC = () => {
  const { players, addPlayer, archivePlayer, unarchivePlayer, deletePlayer, toggleAdmin, resetData, importData, adminPin, updateAdminPin } = useLeague();
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [newName, setNewName] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPinCandidate, setNewPinCandidate] = useState('');

  const handleUnlock = () => {
    // Default to '1234' if undefined
    const currentPin = adminPin || '1234';
    if (pin === currentPin) setIsUnlocked(true);
    else { alert('PIN incorrecto.'); setPin(''); }
  };

  const handleAdd = () => {
    if (!newName) return;
    addPlayer(newName, newNickname || undefined);
    setNewName('');
    setNewNickname('');
  };

  const handleChangePin = () => {
    if (newPinCandidate.length !== 4) return alert('El PIN debe ser de 4 dígitos numéricos');
    updateAdminPin(newPinCandidate);
    setIsChangingPin(false);
    setNewPinCandidate('');
    alert('PIN de seguridad actualizado correctamente');
  };

  const exportData = () => {
    const data = localStorage.getItem('DOMINO_PRO_LAST_STATE');
    const blob = new Blob([data || '{}'], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `domino-pro-${Date.now()}.json`;
    a.click();
  };

  const onImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        importData(e.target?.result as string);
        alert('Datos importados.');
      };
      reader.readAsText(file);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center space-y-8 pt-12">
        <div className="p-8 glass-card rounded-full text-blue-600 border-blue-600/30"><Lock size={64} /></div>
        <div className="text-center px-6">
          <h2 className="text-2xl font-black italic uppercase">Admin Access</h2>
          <p className="text-slate-500 text-sm">Ingrese el código de seguridad.</p>
        </div>
        <div className="grid grid-cols-3 gap-4 w-full max-w-xs px-4">
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n} onClick={() => setPin(p => p.length < 4 ? p + n : p)} className="w-full aspect-square glass-card rounded-2xl text-2xl font-black text-white">{n}</button>
          ))}
          <button onClick={() => setPin('')} className="glass-card rounded-2xl font-bold text-red-600">C</button>
          <button onClick={() => setPin(p => p.length < 4 ? p + '0' : p)} className="glass-card rounded-2xl text-2xl font-black text-white">0</button>
          <button onClick={handleUnlock} className="glass-card rounded-2xl flex items-center justify-center text-blue-500"><ShieldCheck /></button>
        </div>
        <div className="h-4 flex space-x-2">
            {[...Array(4)].map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${i < pin.length ? 'bg-blue-500' : 'bg-slate-800'}`}></div>
            ))}
        </div>
      </div>
    );
  }

  const filteredPlayers = players.filter(p => showArchived ? p.status === 'archived' : p.status === 'active');

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500 pb-12">
      <div className="space-y-4">
        <h2 className="text-xl font-black italic uppercase text-slate-200 px-2">Registrar Jugador</h2>
        <div className="glass-card p-6 rounded-[2.5rem] space-y-4 border-white/10 mx-2">
          <input type="text" placeholder="Nombre Completo" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 font-bold text-sm" />
          <input type="text" placeholder="Apodo" value={newNickname} onChange={(e) => setNewNickname(e.target.value)} className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 font-bold text-sm" />
          <button onClick={handleAdd} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg"><Plus size={18} className="mr-2 inline" /> REGISTRAR</button>
        </div>

        <div className="flex items-center justify-between px-2 mt-8">
           <h2 className="text-xl font-black italic uppercase text-slate-200">Gestión de Usuarios</h2>
           <button onClick={() => setShowArchived(!showArchived)} className="text-[10px] font-bold uppercase text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
             {showArchived ? 'Ver Activos' : 'Ver Archivados'}
           </button>
        </div>

        <div className="space-y-2 px-2">
          {filteredPlayers.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm italic">No hay jugadores en esta lista.</div>
          ) : (
            filteredPlayers.map(p => (
              <div key={p.id} className="glass-card p-4 rounded-3xl flex justify-between items-center border-white/5">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${p.isAdmin ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-black italic text-white text-sm block">{getDisplayName(p)}</span>
                    <span className="text-[9px] uppercase font-bold text-slate-500 flex items-center">
                      {p.isAdmin && <Shield size={10} className="mr-1 text-blue-500" />}
                      {p.status}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button onClick={() => toggleAdmin(p.id)} className={`p-2 rounded-xl transition-colors ${p.isAdmin ? 'text-blue-500 bg-blue-500/10' : 'text-slate-600 bg-white/5'}`}>
                    <Shield size={16} />
                  </button>
                  
                  {p.status === 'active' ? (
                     <button onClick={() => { if(confirm('¿Archivar jugador? No aparecerá en nuevas partidas.')) archivePlayer(p.id); }} className="p-2 text-slate-600 bg-white/5 rounded-xl hover:text-orange-500 hover:bg-orange-500/10">
                        <Archive size={16} />
                     </button>
                  ) : (
                     <button onClick={() => unarchivePlayer(p.id)} className="p-2 text-slate-600 bg-white/5 rounded-xl hover:text-green-500 hover:bg-green-500/10">
                        <RotateCcw size={16} />
                     </button>
                  )}
                  
                  <button onClick={() => { if(confirm('¡PELIGRO! ¿Eliminar permanentemente a este jugador? Se perderá su historial.')) deletePlayer(p.id); }} className="p-2 text-slate-600 bg-white/5 rounded-xl hover:text-red-600 hover:bg-red-600/10">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Security Section */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <h2 className="text-xl font-black italic uppercase text-slate-200 px-2">Seguridad</h2>
        <div className="glass-card p-6 rounded-[2.5rem] flex items-center justify-between border-white/10 mx-2">
            <div className="flex items-center space-x-3 text-slate-400">
                <KeyRound size={24} />
                <span className="font-bold text-sm">PIN de Acceso</span>
            </div>
            <button onClick={() => setIsChangingPin(!isChangingPin)} className="bg-white/5 text-slate-300 px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-white/5 tracking-wider hover:bg-white/10 hover:text-white transition-colors">
                {isChangingPin ? 'Cancelar' : 'Cambiar'}
            </button>
        </div>
        {isChangingPin && (
            <div className="glass-card p-6 rounded-[2.5rem] border-white/10 mx-2 animate-in slide-in-from-top-2 flex flex-col space-y-3">
                 <input 
                    type="number" 
                    maxLength={4} 
                    placeholder="Nuevo PIN (4 dígitos)" 
                    value={newPinCandidate} 
                    onChange={e => { if(e.target.value.length <= 4) setNewPinCandidate(e.target.value); }} 
                    className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 font-bold text-sm text-center tracking-[0.5em]" 
                 />
                 <button onClick={handleChangePin} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg flex items-center justify-center">
                    <Save size={16} className="mr-2" /> Guardar Nuevo PIN
                 </button>
            </div>
        )}
      </div>

      <div className="pt-8 border-t border-white/5 space-y-6 px-2">
        <h2 className="text-xl font-black italic uppercase text-slate-200">Base de Datos</h2>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={exportData} className="glass-card p-6 rounded-[2rem] flex flex-col items-center space-y-3 text-blue-500 hover:bg-white/5 transition-colors"><Download size={24} /><span>Exportar</span></button>
          <label className="glass-card p-6 rounded-[2rem] flex flex-col items-center space-y-3 text-slate-400 cursor-pointer hover:bg-white/5 transition-colors"><Upload size={24} /><span>Importar</span><input type="file" onChange={onImport} className="hidden" accept=".json" /></label>
        </div>
        <button onClick={() => { if(confirm('¡ATENCIÓN! ¿Borrar TODOS los datos de la liga? Esta acción no se puede deshacer.')) resetData(); }} className="w-full py-5 rounded-[2rem] bg-red-600/10 border border-red-600/30 text-red-600 font-black uppercase"><Trash2 size={20} className="inline mr-2" /> Resetear Todo</button>
      </div>
    </div>
  );
};
