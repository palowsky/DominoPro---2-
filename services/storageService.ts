
import { LeagueState, Player, Level, LiveSession, Game } from '../types';
import { LEVEL_THRESHOLDS } from '../constants';

const DB_NAME = 'DominoProDB';
const DB_VERSION = 1;
const STORE_NAME = 'leagueState';
const CHANNEL_NAME = 'DOMINO_PRO_SYNC';

const broadcast = new BroadcastChannel(CHANNEL_NAME);

// Standard state for initial loads
export const getInitialState = (): LeagueState => ({
  players: [],
  games: [],
  activeSessions: [],
});

/**
 * Robust IndexedDB implementation for self-hosting with high data volume.
 */
const getDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const loadFromDB = async (): Promise<LeagueState> => {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get('current');
      request.onsuccess = () => {
        resolve(request.result || getInitialState());
      };
      request.onerror = () => resolve(getInitialState());
    });
  } catch (e) {
    console.error('Failed to load from IndexedDB', e);
    const saved = localStorage.getItem('DOMINO_PRO_LAST_STATE');
    return saved ? JSON.parse(saved) : getInitialState();
  }
};

export const saveToDB = async (state: LeagueState) => {
  try {
    const db = await getDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.put(state, 'current');
  } catch (e) {
    console.error('Failed to save to IndexedDB', e);
  }
};

export const onStateUpdate = (callback: (state: LeagueState) => void) => {
  const handler = (event: MessageEvent) => callback(event.data);
  broadcast.addEventListener('message', handler);
  return () => broadcast.removeEventListener('message', handler);
};

export const syncState = (state: LeagueState) => {
  // Save to DB and broadcast to other tabs
  saveToDB(state);
  localStorage.setItem('DOMINO_PRO_LAST_STATE', JSON.stringify(state)); // Fallback
  broadcast.postMessage(state);
};

export const calculateLevel = (xp: number): Level => {
  if (xp >= LEVEL_THRESHOLDS.Leyenda) return 'Leyenda';
  if (xp >= LEVEL_THRESHOLDS.Maestro) return 'Maestro';
  if (xp >= LEVEL_THRESHOLDS.Tiguere) return 'Tiguere';
  if (xp >= LEVEL_THRESHOLDS.Principiante) return 'Principiante';
  return 'Pollito';
};

export const updatePlayerXP = (player: Player, xpGain: number): Player => {
  const newXp = player.xp + xpGain;
  return {
    ...player,
    xp: newXp,
    level: calculateLevel(newXp)
  };
};
