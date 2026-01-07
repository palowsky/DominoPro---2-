
import { Level, Badge } from './types';

export const LEVEL_THRESHOLDS: Record<Level, number> = {
  'Pollito': 0,
  'Principiante': 200,      
  'Tiguere': 800,           
  'Maestro': 2500,          
  'Leyenda': 6000,          
};

export const BADGES: Badge[] = [
  { id: 'capicuero', name: 'Capicuero', description: 'Victoria por Capicúa', icon: '🎯' },
  { id: 'pato-mayor', name: 'Pato Mayor', description: '5 derrotas en Pintintín', icon: '🦆' },
  { id: 'racha-fuego', name: 'Racha de Victorias', description: '3 victorias consecutivas', icon: '📈' },
  { id: 'racha-leyenda', name: 'Dominio de Liga', description: '10 victorias consecutivas', icon: '⭐' },
  { id: 'leyenda-viva', name: 'Estatus Leyenda', description: 'Nivel Leyenda alcanzado', icon: '🏆' },
  { id: 'matador', name: 'Veterano', description: '10 partidas ganadas', icon: '🎖️' },
  { id: 'blanqueador', name: 'Blanqueo', description: 'Victoria con oponente en 0', icon: '🧼' },
  { id: 'nocturno', name: 'Jugador Nocturno', description: 'Victoria después de medianoche', icon: '🌙' },
];

export const XP_REWARDS = {
  GAME_PLAYED: 10,     
  WIN: 20,            
  CAPICUA: 25,         
  BLANQUEO_BONUS: 15,  
};

export const XP_RANK_COLORS = {
  'Pollito': 'from-slate-400 to-slate-500', // Novato
  'Principiante': 'from-blue-400 to-blue-600', 
  'Tiguere': 'from-red-400 to-red-600', // Avanzado
  'Maestro': 'from-blue-700 to-blue-900', 
  'Leyenda': 'from-red-700 to-red-900 shadow-red-500/50', 
};

export const LEVEL_UP_MESSAGES = [
  "¡Nivel superado!",
  "Progreso de liga actualizado.",
  "Nuevo rango alcanzado con éxito.",
  "Ascenso en el ranking oficial.",
  "Felicidades por su desempeño."
];
