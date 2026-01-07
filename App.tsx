
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { League } from './views/League';
import { LiveTable } from './views/LiveTable';
import { Summary } from './views/Summary';
import { Admin } from './views/Admin';
import { GamificationOverlay } from './components/GamificationOverlay';
import { 
  getInitialState, 
  onStateUpdate, 
  syncState,
  updatePlayerXP,
  loadFromDB,
  calculateLevel
} from './services/storageService';
import { LeagueState, Player, GameMode, Game, LiveSession, AchievementEvent } from './types';
import { XP_REWARDS, LEVEL_UP_MESSAGES } from './constants';

const App: React.FC = () => {
  const [state, setState] = useState<LeagueState>(getInitialState());
  const [isLoading, setIsLoading] = useState(true);
  const [activeAchievement, setActiveAchievement] = useState<AchievementEvent | null>(null);

  // Initial database load
  useEffect(() => {
    const init = async () => {
      const dbState = await loadFromDB();
      setState(dbState);
      setIsLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    const unsub = onStateUpdate(setState);
    return unsub;
  }, []);

  const handleAddPlayer = (name: string, nickname?: string) => {
    const newPlayer: Player = {
      id: crypto.randomUUID(),
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
      lastGameDate: Date.now(),
    };
    const newState = { ...state, players: [...state.players, newPlayer] };
    setState(newState);
    syncState(newState);
  };

  const finishSession = (sessionId: string, winners: string[], scores: Record<string, number>, isCapicua: boolean) => {
    const session = state.activeSessions.find(s => s.id === sessionId);
    if (!session) return;

    const losers = session.players.filter(p => !winners.includes(p));
    const isBlanqueo = losers.every(lId => (scores[lId] || 0) === 0);

    const game: Game = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      mode: session.mode,
      winners,
      losers,
      isCapicua,
      scores,
      isBlanqueo
    };

    let achievements: AchievementEvent[] = [];

    const updatedPlayers = state.players.map(player => {
      let p = { ...player };
      const isWinner = winners.includes(p.id);
      const isLoser = game.losers.includes(p.id);

      if (isWinner || isLoser) {
        const oldLevel = p.level;
        let xpGain = XP_REWARDS.GAME_PLAYED;
        
        if (isWinner) {
          p.wins += 1;
          p.streak += 1;
          xpGain += XP_REWARDS.WIN;
          if (isCapicua) {
            p.capicuas += 1;
            xpGain += XP_REWARDS.CAPICUA;
            if (!p.badges.includes('capicuero')) {
              p.badges.push('capicuero');
              achievements.push({ id: crypto.randomUUID(), playerId: p.id, type: 'badge_unlocked', title: 'Capicuero', subtitle: `¡Victoria por Capicúa!`, icon: '🎯', timestamp: Date.now() });
            }
          }
          if (isBlanqueo) {
            xpGain += XP_REWARDS.BLANQUEO_BONUS;
            if (!p.badges.includes('blanqueador')) {
              p.badges.push('blanqueador');
              achievements.push({ id: crypto.randomUUID(), playerId: p.id, type: 'badge_unlocked', title: 'Blanqueador', subtitle: '¡Victoria sin puntos rivales!', icon: '🧼', timestamp: Date.now() });
            }
          }
          if (p.streak === 3 && !p.badges.includes('racha-fuego')) {
            p.badges.push('racha-fuego');
            achievements.push({ id: crypto.randomUUID(), playerId: p.id, type: 'badge_unlocked', title: 'Racha Activa', subtitle: '¡Excelente desempeño continuo!', icon: '📈', timestamp: Date.now() });
          }
          if (p.streak === 10 && !p.badges.includes('racha-leyenda')) {
            p.badges.push('racha-leyenda');
            achievements.push({ id: crypto.randomUUID(), playerId: p.id, type: 'badge_unlocked', title: 'Dominio de Liga', subtitle: '¡10 victorias consecutivas registradas!', icon: '⭐', timestamp: Date.now() });
          }
        } else {
          p.losses += 1;
          p.streak = 0;
        }

        p = updatePlayerXP(p, xpGain);
        if (p.level !== oldLevel) {
          achievements.push({
            id: crypto.randomUUID(),
            playerId: p.id,
            type: 'level_up',
            title: `Ascenso de Rango`,
            subtitle: LEVEL_UP_MESSAGES[Math.floor(Math.random() * LEVEL_UP_MESSAGES.length)],
            icon: '✨',
            timestamp: Date.now()
          });
        }
      }
      return p;
    });

    if (achievements.length > 0) {
      setActiveAchievement(achievements[0]);
    }

    const newState = {
      ...state,
      players: updatedPlayers,
      games: [game, ...state.games],
      activeSessions: state.activeSessions.filter(s => s.id !== sessionId)
    };
    setState(newState);
    syncState(newState);
  };

  const startSession = (mode: GameMode, selectedPlayers: string[]) => {
    if (state.activeSessions.length >= 25) {
      alert('Límite de mesas alcanzado.');
      return;
    }
    const session: LiveSession = {
      id: crypto.randomUUID(),
      mode,
      players: selectedPlayers,
      scores: selectedPlayers.reduce((acc, id) => ({ ...acc, [id]: 0 }), {}),
      isActive: true,
      startTime: Date.now(),
    };
    const newState = { ...state, activeSessions: [...state.activeSessions, session] };
    setState(newState);
    syncState(newState);
  };

  const updateSessionScore = (sessionId: string, playerId: string, points: number) => {
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
  };

  const cancelSession = (sessionId: string) => {
    const newState = { ...state, activeSessions: state.activeSessions.filter(s => s.id !== sessionId) };
    setState(newState);
    syncState(newState);
  };

  if (isLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<League players={state.players} games={state.games} />} />
          <Route path="/play" element={<LiveTable players={state.players} activeSessions={state.activeSessions} onStartSession={startSession} onUpdateScore={updateSessionScore} onFinishSession={finishSession} onCancelSession={cancelSession} />} />
          <Route path="/summary" element={<Summary players={state.players} games={state.games} />} />
          <Route path="/admin" element={<Admin players={state.players} onAddPlayer={handleAddPlayer} onArchivePlayer={(id) => syncState({...state, players: state.players.filter(p => p.id !== id)})} onResetData={() => syncState(getInitialState())} onImportData={(j) => syncState(JSON.parse(j))} />} />
        </Routes>
      </Layout>
      <GamificationOverlay event={activeAchievement} onComplete={() => setActiveAchievement(null)} />
    </HashRouter>
  );
};

export default App;
