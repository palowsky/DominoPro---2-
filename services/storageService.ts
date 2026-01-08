
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
  adminPin: '1234',
});

/**
 * Robust IndexedDB implementation for self-hosting with high data volume.
 */
const getDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    try {
      if (!window.indexedDB) {
        throw new Error("IndexedDB is not supported");
      }
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error("Database blocked"));
    } catch (e) {
      reject(e);
    }
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
        const dbResult = request.result;
        // Logic: Use DB result if it has data. If it's empty/null, try localStorage.
        if (dbResult && (dbResult.players?.length > 0 || dbResult.games?.length > 0)) {
           resolve(dbResult);
        } else {
           // Fallback to localStorage if DB is fresh or empty
           const saved = localStorage.getItem('DOMINO_PRO_LAST_STATE');
           if (saved) {
             try {
                const parsed = JSON.parse(saved);
                resolve(parsed);
                // Self-heal: populate DB with localstorage data
                saveToDB(parsed);
             } catch {
                resolve(getInitialState());
             }
           } else {
             resolve(getInitialState());
           }
        }
      };
      
      const handleError = () => {
        const saved = localStorage.getItem('DOMINO_PRO_LAST_STATE');
        resolve(saved ? JSON.parse(saved) : getInitialState());
      };

      request.onerror = handleError;
      transaction.onabort = handleError;
      transaction.onerror = handleError;
    });
  } catch (e) {
    console.warn('Falling back to localStorage due to DB error', e);
    const saved = localStorage.getItem('DOMINO_PRO_LAST_STATE');
    if (!saved) return getInitialState();
    try {
      return JSON.parse(saved);
    } catch (parseError) {
      return getInitialState();
    }
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
  localStorage.setItem('DOMINO_PRO_LAST_STATE', JSON.stringify(state)); // Always keep a fallback copy
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
  const newXp = (player.xp || 0) + xpGain;
  return {
    ...player,
    xp: newXp,
    level: calculateLevel(newXp)
  };
};
