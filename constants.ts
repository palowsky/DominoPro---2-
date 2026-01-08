
import { Level, Badge } from './types';

export const LEVEL_THRESHOLDS: Record<Level, number> = {
  'Pollito': 0,
  'Principiante': 200,      
  'Tiguere': 800,           
  'Maestro': 2500,          
  'Leyenda': 6000,          
};

export const BADGES: Badge[] = [
  // --- INICIO Y PARTICIPACIÓN (5) ---
  { id: 'bautizo', name: 'El Bautizo', description: 'Completar tu primera partida', icon: '👶', tier: 'Bronze' },
  { id: 'iniciado', name: 'Iniciado', description: 'Jugar 5 partidas totales', icon: '🎲', tier: 'Bronze' },
  { id: 'veterano', name: 'Veterano', description: 'Jugar 50 partidas totales', icon: '🎖️', tier: 'Silver' },
  { id: 'vicioso', name: 'Vicioso', description: 'Jugar 200 partidas totales', icon: '🔋', tier: 'Gold' },
  { id: 'guerrero', name: 'Guerrero', description: 'Acumular 20 derrotas (Se aprende perdiendo)', icon: '⚔️', tier: 'Bronze' },

  // --- VICTORIAS (5) ---
  { id: 'matador', name: 'Matador', description: 'Ganar 10 partidas', icon: '🔫', tier: 'Bronze' },
  { id: 'jefe', name: 'El Jefe', description: 'Ganar 25 partidas', icon: '👔', tier: 'Bronze' },
  { id: 'verdugo', name: 'El Verdugo', description: 'Ganar 50 partidas', icon: '🪓', tier: 'Silver' },
  { id: 'papaupa', name: 'El Papaupa', description: 'Ganar 100 partidas', icon: '🦁', tier: 'Gold' },
  { id: 'inmortal', name: 'Inmortal', description: 'Ganar 200 partidas', icon: '🏛️', tier: 'Platino' },

  // --- HABILIDAD Y EXPERTOS (NUEVOS + EXISTENTES) ---
  { id: 'ojo-aguila', name: 'Ojo de Águila', description: 'Realizar tu primer Capicúa', icon: '👁️', tier: 'Bronze' },
  { id: 'capicuero', name: 'Capicuero', description: 'Realizar 5 Capicúas totales', icon: '🎯', tier: 'Bronze' },
  { id: 'francotirador', name: 'Francotirador', description: 'Realizar 10 Capicúas totales', icon: '🔭', tier: 'Silver' },
  { id: 'rey-capicua', name: 'Rey Capicúa', description: 'Realizar 25 Capicúas totales', icon: '🤴', tier: 'Gold' },
  { id: 'manos-seda', name: 'Manos de Seda', description: 'Realizar 50 Capicúas totales', icon: '🎩', tier: 'Platino' }, // NEW
  { id: 'zapatero', name: 'Zapatero', description: 'Ganar por Blanqueo (0 puntos al rival)', icon: '👞', tier: 'Gold' },
  { id: 'arquitecto', name: 'El Arquitecto', description: 'Ganar 100 partidas en Parejas (2v2)', icon: '📐', tier: 'Gold' }, // NEW

  // --- RACHAS E IMPARABLES ---
  { id: 'racha-fuego', name: 'En Su Agua', description: 'Racha de 3 victorias seguidas', icon: '🔥', tier: 'Silver' },
  { id: 'calenton', name: 'Calentón', description: 'Racha de 5 victorias seguidas', icon: '🌋', tier: 'Silver' },
  { id: 'invicto', name: 'Invicto', description: 'Racha de 7 victorias seguidas', icon: '🛡️', tier: 'Gold' },
  { id: 'intocable', name: 'Intocable', description: 'Racha de 10 victorias seguidas', icon: '👻', tier: 'Platino' },
  { id: 'imparable', name: 'Imparable', description: 'Racha de 15 victorias seguidas', icon: '🚀', tier: 'Platino' }, // NEW
  { id: 'invencible', name: 'Invencible', description: 'Racha de 20 victorias seguidas', icon: '☄️', tier: 'Platino' }, // NEW

  // --- PINTINTÍN MASTERY ---
  { id: 'pintintin-pro', name: 'Rey del Patio', description: 'Ganar 5 partidas de Pintintín', icon: '🍀', tier: 'Bronze' },
  { id: 'dueno-patio', name: 'Dueño del Patio', description: 'Ganar 20 partidas de Pintintín', icon: '🏰', tier: 'Gold' },
  { id: 'lobo-solitario', name: 'Lobo Solitario', description: 'Ganar 50 partidas de Pintintín', icon: '🐺', tier: 'Platino' }, // NEW
  { id: 'pato-mayor', name: 'Pato Mayor', description: 'Perder 10 veces en Pintintín', icon: '🦆', tier: 'Bronze' },
  { id: 'pato-feo', name: 'El Patito Feo', description: 'Perder 25 veces en Pintintín', icon: '🦢', tier: 'Silver' },

  // --- CONSTANCIA Y ESTATUS (NUEVOS) ---
  { id: 'domino-oro', name: 'Dominó de Oro', description: 'Jugar 500 partidas totales', icon: '🏆', tier: 'Platino' }, // NEW
  { id: 'muralla', name: 'La Muralla', description: 'Acumular 100 derrotas (Resiliencia)', icon: '🧱', tier: 'Silver' }, // NEW
  { id: 'profesor', name: 'El Profesor', description: 'Alcanzar el nivel Maestro', icon: '🎓', tier: 'Gold' }, // NEW
  { id: 'padrino', name: 'El Padrino', description: 'Acumular 10,000 XP', icon: '🕴️', tier: 'Platino' }, // NEW
  { id: 'leyenda-viva', name: 'Leyenda Viva', description: 'Alcanzar el nivel Leyenda', icon: '👑', tier: 'Platino' },

  // --- EVENTOS TEMPORALES (NUEVOS) ---
  { id: 'fiebre-sabado', name: 'Fiebre de Sábado', description: 'Ganar una partida un Sábado', icon: '🕺', tier: 'Silver' }, // NEW
  { id: 'domingo-asado', name: 'Domingo de Asado', description: 'Ganar una partida un Domingo', icon: '🍖', tier: 'Silver' }, // NEW
  { id: 'trasnochador', name: 'Trasnochador', description: 'Ganar entre las 8 PM y 12 AM', icon: '🍸', tier: 'Silver' }, // NEW
  { id: 'nocturno', name: 'Sereno', description: 'Ganar de madrugada (12 AM - 5 AM)', icon: '🌙', tier: 'Platino' },
];

export const XP_REWARDS = {
  GAME_PLAYED: 10,     
  WIN: 20,            
  CAPICUA: 25,         
  BLANQUEO_BONUS: 50,  
};

export const XP_RANK_COLORS = {
  'Pollito': 'from-slate-400 to-slate-500', 
  'Principiante': 'from-blue-400 to-blue-600', 
  'Tiguere': 'from-amber-500 to-orange-600',
  'Maestro': 'from-emerald-500 to-emerald-700', 
  'Leyenda': 'from-purple-600 to-indigo-900 shadow-purple-500/50', 
};

export const LEVEL_UP_MESSAGES = [
  "¡Nivel superado! Ya no eres tan novato.",
  "¡Subiste de rango! El respeto se gana.",
  "Nuevo nivel desbloqueado. ¡Sigue así!",
  "Tu jerarquía en la liga ha aumentado.",
  "¡Felicidades! Estás haciendo historia."
];
