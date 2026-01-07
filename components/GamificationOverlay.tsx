
import React, { useEffect, useState } from 'react';
import { AchievementEvent } from '../types';
import { Award, Zap, Sparkles } from 'lucide-react';

interface Props {
  event: AchievementEvent | null;
  onComplete: () => void;
}

export const GamificationOverlay: React.FC<Props> = ({ event, onComplete }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (event) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onComplete, 500);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [event, onComplete]);

  if (!event) return null;

  return (
    <div className={`fixed inset-0 z-[300] flex items-center justify-center p-6 pointer-events-none transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0 scale-95'}`}>
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" />
      
      <div className="glass-card relative p-8 rounded-[3rem] border-sky-500/50 bg-sky-500/10 shadow-2xl shadow-sky-500/20 text-center max-w-xs w-full animate-in zoom-in-95 duration-300">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-sky-500 rounded-full flex items-center justify-center shadow-xl shadow-sky-500/40 border-4 border-slate-950">
          {event.type === 'level_up' ? <Sparkles size={40} className="text-white" /> : <Award size={40} className="text-white" />}
        </div>
        
        <div className="mt-8 space-y-2">
          <h4 className="text-sky-500 font-black italic uppercase tracking-widest text-xs">Achievement Unlocked</h4>
          <h3 className="text-3xl font-black italic text-white uppercase leading-tight tracking-tighter">{event.title}</h3>
          <p className="text-slate-300 font-bold text-sm italic">"{event.subtitle}"</p>
        </div>

        <div className="mt-6 flex justify-center space-x-1 text-sky-500/50">
          <Zap size={16} fill="currentColor" />
          <Zap size={16} fill="currentColor" />
          <Zap size={16} fill="currentColor" />
        </div>
      </div>
    </div>
  );
};
