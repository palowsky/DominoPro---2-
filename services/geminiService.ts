
/**
 * LOCAL DOMINICAN LOGIC ENGINE
 * Replaces external AI dependencies to allow for 100% offline/self-hosted operation.
 */

const NICKNAME_PREFIXES = ['El Rubio', 'Neno', 'Pocho', 'Bulin', 'Montro', 'Don', 'Papi', 'El Fuerte', 'Tito', 'Mangu', 'Salami', 'Klk', 'Dato', 'Pilo', 'Chacho'];
const NICKNAME_SUFFIXES = ['Flow', 'Vip', 'Calle', 'Platino', '27', 'Real', '05', 'Duro', 'Activo', 'En Alta', 'Grasa', 'Popi', 'Wawawa'];
const SLANG_TEMPLATES = [
  (top: string, bottom: string, total: number) => `¡KLK mi gente! Aquí dándole el dato real de la liga. ${top} está en altísima, no cree en nadie y anda repartiendo mangu con salami en cada mesa. Por otro lado, ${bottom} está pidiendo cacao y dando una pena terrible, parece que se le olvidó cómo se cuentan las fichas. Llevamos ${total} partidas de puro fuego. ¡Sigan jugando que esto está picante!`,
  (top: string, bottom: string, total: number) => `Atención tigueraje: ${top} se coronó como el papá de la mesa esta semana. Tiene a todo el mundo a monte. Mientras tanto, ${bottom} anda como un pollito mojado, no gana ni una partida de práctica. Ya van ${total} juegos y la calle está que arde. ¡Dique que hay revancha mañana!`,
  (top: string, bottom: string, total: number) => `Dímelo cantando, el ranking no miente: ${top} es el que tiene la grasa ahora mismo. ${bottom} está en el suelo, pidiendo un tiempo fuera porque no aguanta la presión. Con ${total} juegos encima, la liga está más dura que un coco. ¡El que tenga miedo que se compre un perro!`
];

export async function generateDominicanNickname(realName: string): Promise<string> {
  // Simulate a small network delay for "AI effect" even though it's local
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const prefix = NICKNAME_PREFIXES[Math.floor(Math.random() * NICKNAME_PREFIXES.length)];
  const suffix = NICKNAME_SUFFIXES[Math.floor(Math.random() * NICKNAME_SUFFIXES.length)];
  const usePrefix = Math.random() > 0.5;
  
  // Transform name: Juan -> Juancho, Pedro -> Pedrito
  let transformed = realName.length > 3 ? realName.substring(0, 4) : realName;
  transformed += Math.random() > 0.5 ? 'ito' : 'cho';

  if (usePrefix) return `${prefix} ${realName.split(' ')[0]}`;
  return `${realName.split(' ')[0]} ${suffix}`;
}

export async function generateWeeklySummary(leagueDataJson: string): Promise<string> {
  // Simulate logic processing delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const data = JSON.parse(leagueDataJson);
  const topPlayer = data.topPlayers?.[0]?.n || "Nadie";
  const bottomPlayer = data.topPlayers?.length > 1 
    ? data.topPlayers[data.topPlayers.length - 1].n 
    : "El que no juega";
  
  const totalGames = data.recentGames?.length || 0;
  
  const template = SLANG_TEMPLATES[Math.floor(Math.random() * SLANG_TEMPLATES.length)];
  return template(topPlayer, bottomPlayer, totalGames);
}
