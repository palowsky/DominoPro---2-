
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  LeagueState, Player, GameMode, Game, LiveSession, AchievementEvent 
} from '../types';
import { 
  getInitialState, onStateUpdate, syncState, updatePlayerXP, loadFromDB 
} from '../services/storageService';
import { XP_REWARDS, LEVEL_UP_MESSAGES, BADGES } from '../constants';

// Utility for safe UUID generation
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

interface LeagueContextType extends LeagueState {
  isLoading: boolean;
  activeAchievement: AchievementEvent | null;
  addPlayer: (name: string, nickname?: string) => void;
  archivePlayer: (id: string) => void;
  unarchivePlayer: (id: string) => void;
  deletePlayer: (id: string) => void;
  toggleAdmin: (id: string) => void;
  startSession: (mode: GameMode, selectedPlayers: string[]) => void;
  finishSession: (sessionId: string, winners: string[], scores: Record<string, number>, isCapicua: boolean) => void;
  updateScore: (sessionId: string, playerId: string, points: number) => void;
  cancelSession: (sessionId: string) => void;
  resetData: () => void;
  importData: (json: string) => void;
  clearAchievement: () => void;
  updateAdminPin: (newPin: string) => void;
}

const LeagueContext = createContext<LeagueContextType | null>(null);

export const LeagueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<LeagueState>(getInitialState());
  const [isLoading, setIsLoading] = useState(true);
  const [activeAchievement, setActiveAchievement] = useState<AchievementEvent | null>(null);

  // Carga inicial y Sincronización entre pestañas
  useEffect(() => {
    const init = async () => {
      try {
        const dbState = await loadFromDB();
        setState(dbState || getInitialState());
      } catch (err) {
        console.error("Failed to load initial state:", err);
        setState(getInitialState());
      } finally {
        setIsLoading(false);
      }
    };
    init();

    return onStateUpdate((newState) => {
      if (newState) setState(newState);
    });
  }, []);

  const addPlayer = useCallback((name: string, nickname?: string) => {
    const newPlayer: Player = {
      id: generateId(),
      name,
      nickname: nickname?.trim() || undefined,
      xp: 0,
      level: 'Pollito',
      wins: 0,
      losses: 0,
      capicuas: 0,
      pintintinStats: { wins: 0, patos: 0 },
      streak: 0,
      badges: [],
      status: 'active',
      isAdmin: false,
      lastGameDate: Date.now(),
    };
    const newState: LeagueState = { ...state, players: [...state.players, newPlayer] };
    setState(newState);
    syncState(newState);
  }, [state]);

  const archivePlayer = useCallback((id: string) => {
    const newState: LeagueState = { 
      ...state, 
      players: state.players.map(p => p.id === id ? { ...p, status: 'archived' as const } : p)
    };
    setState(newState);
    syncState(newState);
  }, [state]);

  const unarchivePlayer = useCallback((id: string) => {
    const newState: LeagueState = { 
      ...state, 
      players: state.players.map(p => p.id === id ? { ...p, status: 'active' as const } : p)
    };
    setState(newState);
    syncState(newState);
  }, [state]);

  const deletePlayer = useCallback((id: string) => {
    const newState = {
      ...state,
      players: state.players.filter(p => p.id !== id)
    };
    setState(newState);
    syncState(newState);
  }, [state]);

  const toggleAdmin = useCallback((id: string) => {
    const newState = {
      ...state,
      players: state.players.map(p => p.id === id ? { ...p, isAdmin: !p.isAdmin } : p)
    };
    setState(newState);
    syncState(newState);
  }, [state]);

  const startSession = useCallback((mode: GameMode, selectedPlayers: string[]) => {
    const session: LiveSession = {
      id: generateId(),
      mode,
      players: selectedPlayers,
      scores: selectedPlayers.reduce((acc, id) => ({ ...acc, [id]: 0 }), {}),
      isActive: true,
      startTime: Date.now(),
    };
    const newState = { ...state, activeSessions: [...state.activeSessions, session] };
    setState(newState);
    syncState(newState);
  }, [state]);

  const updateScore = useCallback((sessionId: string, playerId: string, points: number) => {
    const newState = {
      ...state,
      activeSessions: state.activeSessions.map(session => 
        session.id === sessionId 
          ? { ...session, scores: { ...session.scores, [playerId]: (session.scores[playerId] || 0) + points } }
          : session
      )
    };
    setState(newState);
    syncState(newState);
  }, [state]);

  // --- LÓGICA DE JUEGO Y LOGROS ---
  const finishSession = useCallback((sessionId: string, winners: string[], scores: Record<string, number>, isCapicua: boolean) => {
    const session = state.activeSessions.find(s => s.id === sessionId);
    if (!session) return;

    const losers = session.players.filter(p => !winners.includes(p));
    const isBlanqueo = losers.every(lId => (scores[lId] || 0) === 0);

    // Lógica Específica de Pintintin: Determinar Segundo Lugar
    let pintintinRunnerUpId: string | null = null;
    if (session.mode === 'Pintintin' && losers.length > 0) {
        // El segundo lugar es el perdedor con la puntuación más alta
        const sortedLosers = [...losers].sort((a, b) => (scores[b] || 0) - (scores[a] || 0));
        pintintinRunnerUpId = sortedLosers[0];
    }

    const game: Game = {
      id: generateId(),
      timestamp: Date.now(),
      mode: session.mode,
      winners,
      losers,
      isCapicua,
      scores,
      isBlanqueo
    };

    let newAchievements: AchievementEvent[] = [];

    const updatedPlayers = state.players.map(player => {
      let p = { ...player };
      const isWinner = winners.includes(p.id);
      const isLoser = losers.includes(p.id);
      const isPintintinRunnerUp = p.id === pintintinRunnerUpId;

      if (isWinner || isLoser) {
        // 1. Stats Updates
        const oldLevel = p.level;
        let xpGain = XP_REWARDS.GAME_PLAYED;

        if (isWinner) {
          p.wins += 1;
          p.streak += 1;
          xpGain += XP_REWARDS.WIN;
          if (isCapicua) {
             p.capicuas += 1;
             xpGain += XP_REWARDS.CAPICUA;
          }
          if (isBlanqueo) xpGain += XP_REWARDS.BLANQUEO_BONUS;
          if (game.mode === 'Pintintin') p.pintintinStats.wins += 1;

        } else {
          // Lógica de Perdedor
          p.streak = 0; // Se resetea la racha aunque sea segundo lugar (porque no ganó)

          if (isPintintinRunnerUp) {
             // El segundo lugar en Pintintin NO suma derrota y gana XP extra
             xpGain += Math.floor(XP_REWARDS.WIN * 0.33); // 33% de una victoria
             // No incrementamos p.losses ni p.pintintinStats.patos
          } else {
             // Perdedor normal
             p.losses += 1;
             if (game.mode === 'Pintintin') p.pintintinStats.patos += 1;
          }
        }

        // 2. XP & Level
        p = updatePlayerXP(p, xpGain);
        if (p.level !== oldLevel) {
          newAchievements.push({
            id: generateId(), playerId: p.id, type: 'level_up', title: `Ascenso de Rango`,
            subtitle: `${p.level}: ${LEVEL_UP_MESSAGES[Math.floor(Math.random() * LEVEL_UP_MESSAGES.length)]}`,
            icon: '✨', timestamp: Date.now()
          });
        }

        // 3. BADGE CHECKING ENGINE
        const awardBadge = (badgeId: string) => {
            if (!p.badges.includes(badgeId)) {
                p.badges.push(badgeId);
                const badgeInfo = BADGES.find(b => b.id === badgeId);
                if (badgeInfo) {
                    newAchievements.push({
                        id: generateId(), playerId: p.id, type: 'badge_unlocked',
                        title: badgeInfo.name, subtitle: badgeInfo.description, icon: badgeInfo.icon, timestamp: Date.now()
                    });
                }
            }
        };

        const totalGames = p.wins + p.losses;
        const v2Wins = p.wins - p.pintintinStats.wins; // Victorias solo en parejas

        // --- Participación & Constancia ---
        awardBadge('bautizo');
        if (totalGames >= 5) awardBadge('iniciado');
        if (totalGames >= 50) awardBadge('veterano');
        if (totalGames >= 200) awardBadge('vicioso');
        if (totalGames >= 500) awardBadge('domino-oro'); // NEW
        
        if (p.losses >= 20) awardBadge('guerrero');
        if (p.losses >= 100) awardBadge('muralla'); // NEW
        if (p.xp >= 10000) awardBadge('padrino'); // NEW


        // --- Victorias ---
        if (p.wins >= 10) awardBadge('matador');
        if (p.wins >= 25) awardBadge('jefe');
        if (p.wins >= 50) awardBadge('verdugo');
        if (p.wins >= 100) awardBadge('papaupa');
        if (p.wins >= 200) awardBadge('inmortal');

        if (v2Wins >= 100) awardBadge('arquitecto'); // NEW (Victorias en 2v2)

        // --- Rachas ---
        if (p.streak >= 3) awardBadge('racha-fuego');
        if (p.streak >= 5) awardBadge('calenton');
        if (p.streak >= 7) awardBadge('invicto');
        if (p.streak >= 10) awardBadge('intocable');
        if (p.streak >= 15) awardBadge('imparable'); // NEW
        if (p.streak >= 20) awardBadge('invencible'); // NEW


        // --- Capicúas ---
        if (p.capicuas >= 1) awardBadge('ojo-aguila');
        if (p.capicuas >= 5) awardBadge('capicuero');
        if (p.capicuas >= 10) awardBadge('francotirador');
        if (p.capicuas >= 25) awardBadge('rey-capicua');
        if (p.capicuas >= 50) awardBadge('manos-seda'); // NEW


        // --- Pintintín ---
        if (p.pintintinStats.wins >= 5) awardBadge('pintintin-pro');
        if (p.pintintinStats.wins >= 20) awardBadge('dueno-patio');
        if (p.pintintinStats.wins >= 50) awardBadge('lobo-solitario'); // NEW
        
        if (p.pintintinStats.patos >= 10) awardBadge('pato-mayor');
        if (p.pintintinStats.patos >= 25) awardBadge('pato-feo');


        // --- Especiales y Rangos ---
        if (['Maestro', 'Leyenda'].includes(p.level)) awardBadge('profesor'); // NEW
        
        if (p.level === 'Leyenda') {
             awardBadge('leyenda-viva');
             if (!player.badges.includes('leyenda-viva')) { // Double check for instant notification
                // Already handled in awardBadge, this block is just for context logic if needed
             }
        }

        if (isWinner) {
            if (isBlanqueo) awardBadge('zapatero');
            
            const now = new Date();
            const hour = now.getHours();
            const day = now.getDay(); // 0 = Domingo, 6 = Sábado

            // Nocturno: Entre 12AM (0) y 5AM (5)
            if (hour >= 0 && hour < 5) awardBadge('nocturno');
            
            // Trasnochador: Entre 8 PM (20) y 12 AM (0)
            if (hour >= 20 && hour <= 23) awardBadge('trasnochador'); // NEW
            
            // Días Específicos
            if (day === 6) awardBadge('fiebre-sabado'); // NEW
            if (day === 0) awardBadge('domingo-asado'); // NEW
        }

      }
      return p;
    });

    if (newAchievements.length > 0) setActiveAchievement(newAchievements[0]);

    const newState = {
      ...state,
      players: updatedPlayers,
      games: [game, ...state.games],
      activeSessions: state.activeSessions.filter(s => s.id !== sessionId)
    };
    setState(newState);
    syncState(newState);
  }, [state]);

  const cancelSession = useCallback((sessionId: string) => {
    const newState = { ...state, activeSessions: state.activeSessions.filter(s => s.id !== sessionId) };
    setState(newState);
    syncState(newState);
  }, [state]);

  const resetData = useCallback(() => {
    const newState = getInitialState();
    setState(newState);
    syncState(newState);
  }, []);

  const importData = useCallback((json: string) => {
    try {
      const newState = JSON.parse(json);
      setState(newState);
      syncState(newState);
    } catch (e) {
      console.error("Error al importar datos", e);
    }
  }, []);

  const clearAchievement = () => setActiveAchievement(null);

  const updateAdminPin = useCallback((newPin: string) => {
    const newState = { ...state, adminPin: newPin };
    setState(newState);
    syncState(newState);
  }, [state]);

  const value = useMemo(() => ({
    ...state,
    isLoading,
    activeAchievement,
    addPlayer,
    archivePlayer,
    unarchivePlayer,
    deletePlayer,
    toggleAdmin,
    startSession,
    finishSession,
    updateScore,
    cancelSession,
    resetData,
    importData,
    clearAchievement,
    updateAdminPin
  }), [state, isLoading, activeAchievement, addPlayer, archivePlayer, unarchivePlayer, deletePlayer, toggleAdmin, startSession, finishSession, updateScore, cancelSession, resetData, importData, updateAdminPin]);

  return <LeagueContext.Provider value={value}>{children}</LeagueContext.Provider>;
};

export const useLeague = () => {
  const context = useContext(LeagueContext);
  if (!context) throw new Error('useLeague debe usarse dentro de LeagueProvider');
  return context;
};
