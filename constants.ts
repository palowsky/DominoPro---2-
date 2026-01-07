
import { Level, Badge } from './types';

export const LEVEL_THRESHOLDS: Record<Level, number> = {
  'Pollito': 0,
  'Principiante': 200,      // ~15 games
  'Tiguere': 800,           // ~60 games
  'Maestro': 2500,          // ~180 games
  'Leyenda': 6000,          // ~450 games (The true grind)
};

export const BADGES: Badge[] = [
  { id: 'capicuero', name: 'Capicuero', description: 'Gana con una Capicúa', icon: '🎯' },
  { id: 'pato-mayor', name: 'Pato Mayor', description: 'Pierde 5 veces en Pintintín', icon: '🦆' },
  { id: 'racha-fuego', name: 'Racha de Fuego', description: '3 victorias seguidas', icon: '🔥' },
  { id: 'leyenda-viva', name: 'Leyenda Viva', description: 'Llega al nivel Leyenda', icon: '👑' },
  { id: 'matador', name: 'El Matador', description: 'Gana 10 partidas en total', icon: '⚔️' },
  { id: 'blanqueador', name: 'Blanqueador', description: 'Deja al rival en 0', icon: '🧼' },
  { id: 'nocturno', name: 'Sereno', description: 'Gana una partida después de medianoche', icon: '🌙' },
];

export const XP_REWARDS = {
  GAME_PLAYED: 10,     // Reduced from 50
  WIN: 20,            // Reduced from 100
  CAPICUA: 25,         // Reduced from 150
  BLANQUEO_BONUS: 15,  // Reduced from 100
};

export const XP_RANK_COLORS = {
  'Pollito': 'from-slate-400 to-slate-500',
  'Principiante': 'from-emerald-400 to-emerald-500',
  'Tiguere': 'from-sky-400 to-sky-500',
  'Maestro': 'from-purple-400 to-purple-500',
  'Leyenda': 'from-amber-400 to-amber-500 shadow-amber-500/50',
};

export const LEVEL_UP_MESSAGES = [
  "¡Soltaste el cascarón!",
  "¡Te estás poniendo los pantalones!",
  "¡Ya eres un tiguere real!",
  "¡Maestro de la mesa!",
  "¡LEYENDA DEL PATIO!"
];
