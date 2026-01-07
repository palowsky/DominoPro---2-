
export type Level = 'Pollito' | 'Principiante' | 'Tiguere' | 'Maestro' | 'Leyenda';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier?: 'Bronze' | 'Silver' | 'Gold' | 'Platino';
}

export interface AchievementEvent {
  id: string;
  playerId: string;
  type: 'level_up' | 'badge_unlocked';
  title: string;
  subtitle: string;
  icon: string;
  timestamp: number;
}

export interface Player {
  id: string;
  name: string;
  nickname: string;
  xp: number;
  level: Level;
  wins: number;
  losses: number;
  capicuas: number;
  pintintinStats: {
    wins: number;
    patos: number; 
  };
  streak: number;
  badges: string[];
  status: 'active' | 'archived';
  lastGameDate?: number;
}

export type GameMode = '2v2' | 'Pintintin';

export interface Game {
  id: string;
  timestamp: number;
  mode: GameMode;
  winners: string[]; 
  losers: string[]; 
  isCapicua: boolean;
  scores: Record<string, number>;
  isBlanqueo?: boolean;
}

export interface LiveSession {
  id: string;
  mode: GameMode;
  players: string[];
  scores: Record<string, number>;
  isActive: boolean;
  startTime: number;
}

export interface LeagueState {
  players: Player[];
  games: Game[];
  activeSessions: LiveSession[];
}
