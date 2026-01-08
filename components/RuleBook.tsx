
import React, { useState } from 'react';
import { X, BookOpen, Users, ShieldAlert, Swords, Gavel, Clock, Hand, Scale } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'general' | '2v2' | 'pintintin';

export const RuleBook: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('general');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-6 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl bg-slate-900/50 sm:rounded-[2.5rem] flex flex-col border border-white/10 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-slate-900/50 sm:rounded-t-[2.5rem]">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
              <BookOpen size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black italic uppercase text-white tracking-tight">Reglamento</h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Normas Oficiales del Club</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-2 gap-2 border-b border-white/5 bg-slate-950/30">
          <button 
            onClick={() => setActiveTab('general')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition-all ${activeTab === 'general' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}
          >
            <Gavel size={14} /> <span>General</span>
          </button>
          <button 
            onClick={() => setActiveTab('2v2')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition-all ${activeTab === '2v2' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}
          >
            <Users size={14} /> <span>Parejas</span>
          </button>
          <button 
            onClick={() => setActiveTab('pintintin')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition-all ${activeTab === 'pintintin' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}
          >
            <Swords size={14} /> <span>Pintintín</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-gradient-to-b from-slate-900/50 to-slate-950/50">
          
          {activeTab === 'general' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <h3 className="text-blue-500 font-black italic uppercase text-sm flex items-center mb-4">
                  <ShieldAlert className="mr-2" size={18} /> Etiqueta y Disciplina
                </h3>
                
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 min-w-[6px] h-[6px] rounded-full bg-red-500" />
                    <p className="text-sm text-slate-300"><strong className="text-white font-bold">Cero Señas:</strong> Cualquier gesto, palabra o movimiento que indique la posesión de fichas resultará en la anulación de la mano y 25 puntos para el equipo contrario.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 min-w-[6px] h-[6px] rounded-full bg-red-500" />
                    <p className="text-sm text-slate-300"><strong className="text-white font-bold">Ley del Silencio:</strong> No se permite hablar de la jugada mientras las fichas están vivas. "El dominó lo inventó un mudo".</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 min-w-[6px] h-[6px] rounded-full bg-orange-500" />
                    <p className="text-sm text-slate-300"><strong className="text-white font-bold">Ficha Jugada:</strong> Una vez la ficha toca la mesa o se suelta, se considera jugada. No hay rectificación (salvo ficha nula por error de palo).</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-blue-500 font-black italic uppercase text-sm flex items-center mb-4">
                  <Clock className="mr-2" size={18} /> Dinámica de Juego
                </h3>
                
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 min-w-[6px] h-[6px] rounded-full bg-blue-500" />
                    <p className="text-sm text-slate-300"><strong className="text-white font-bold">Tiempo de Jugada:</strong> Se espera fluidez. Retrasar el juego injustificadamente (más de 15 segundos sin pensada compleja) es falta leve.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 min-w-[6px] h-[6px] rounded-full bg-blue-500" />
                    <p className="text-sm text-slate-300"><strong className="text-white font-bold">Revolver:</strong> Las fichas deben revolverse boca abajo de manera uniforme. Todos los jugadores tienen derecho a revolver.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === '2v2' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
               <div className="bg-blue-600/10 p-4 rounded-2xl border border-blue-600/20 text-center">
                  <div className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">Meta del Juego</div>
                  <div className="text-3xl font-black italic text-white">200 Puntos</div>
               </div>

               <div className="space-y-4">
                <h3 className="text-white font-bold text-sm uppercase mb-2">Reglas Específicas</h3>
                
                <div className="glass-card p-4 rounded-2xl space-y-4">
                  <div className="flex gap-4">
                    <div className="bg-slate-800 p-3 rounded-xl h-fit"><Hand size={20} className="text-blue-400"/></div>
                    <div>
                      <h4 className="font-bold text-white text-sm">La Salida</h4>
                      <p className="text-xs text-slate-400 mt-1">La primera mano sale el Doble 6. Las siguientes manos sale el jugador que ganó la mano anterior (o su compañero si así lo deciden, pero típicamente el que domina).</p>
                    </div>
                  </div>

                  <div className="h-px bg-white/5" />

                  <div className="flex gap-4">
                    <div className="bg-slate-800 p-3 rounded-xl h-fit"><Scale size={20} className="text-orange-400"/></div>
                    <div>
                      <h4 className="font-bold text-white text-sm">El Tranque</h4>
                      <p className="text-xs text-slate-400 mt-1">En caso de tranque, gana la pareja que sume <strong className="text-white">menos puntos combinados</strong>. Si hay empate en la suma, la mano es nula y se repite la salida.</p>
                    </div>
                  </div>

                  <div className="h-px bg-white/5" />

                  <div className="flex gap-4">
                    <div className="bg-slate-800 p-3 rounded-xl h-fit"><ShieldAlert size={20} className="text-red-400"/></div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Capicúa</h4>
                      <p className="text-xs text-slate-400 mt-1">La Capicúa es válida y se celebra. En esta app se registra separada para estadísticas, pero suma los puntos de la mano normal.</p>
                    </div>
                  </div>
                </div>
               </div>
            </div>
          )}

          {activeTab === 'pintintin' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
               <div className="bg-green-600/10 p-4 rounded-2xl border border-green-600/20 text-center">
                  <div className="text-[10px] font-black uppercase text-green-400 tracking-widest mb-1">Meta del Juego</div>
                  <div className="text-3xl font-black italic text-white">150 Puntos</div>
                  <div className="text-[9px] font-bold text-slate-500 mt-1 uppercase">Todos contra Todos</div>
               </div>

               <div className="space-y-4">
                <div className="glass-card p-4 rounded-2xl space-y-4">
                  <div className="flex gap-4">
                    <div className="bg-slate-800 p-3 rounded-xl h-fit"><Users size={20} className="text-green-400"/></div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Jugadores</h4>
                      <p className="text-xs text-slate-400 mt-1">Diseñado para 3 o 4 jugadores individuales. Cada uno vela por sus propios intereses.</p>
                    </div>
                  </div>

                  <div className="h-px bg-white/5" />

                  <div className="flex gap-4">
                    <div className="bg-slate-800 p-3 rounded-xl h-fit"><Scale size={20} className="text-orange-400"/></div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Puntuación</h4>
                      <p className="text-xs text-slate-400 mt-1">El jugador que domina (o gana el tranque) suma los puntos de <strong className="text-white">todos los oponentes</strong>. El objetivo es llegar a la meta antes que los demás.</p>
                    </div>
                  </div>

                  <div className="h-px bg-white/5" />

                  <div className="flex gap-4">
                    <div className="bg-slate-800 p-3 rounded-xl h-fit"><Swords size={20} className="text-purple-400"/></div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Tranque Individual</h4>
                      <p className="text-xs text-slate-400 mt-1">En el Pintintín, el tranque lo gana el jugador con la ficha (o suma de fichas) más baja individualmente.</p>
                    </div>
                  </div>
                </div>
               </div>
            </div>
          )}

        </div>
        
        {/* Footer */}
        <div className="p-4 bg-slate-900/80 border-t border-white/5 sm:rounded-b-[2.5rem]">
          <button onClick={onClose} className="w-full py-4 rounded-2xl font-black text-white bg-blue-600 hover:bg-blue-500 transition-colors uppercase text-xs tracking-widest shadow-lg">
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
