
/**
 * LOCAL DOMINICAN LOGIC ENGINE
 * Slang is ONLY used here for the summaries as per user request.
 */

const SLANG_TEMPLATES = [
  (top: string, bottom: string, total: number) => `¡KLK mi gente! Aquí dándole el dato real de la liga. ${top} está en altísima, no cree en nadie y anda repartiendo mangu con salami en cada mesa. Por otro lado, ${bottom} está pidiendo cacao y dando una pena terrible, parece que se le olvidó cómo se cuentan las fichas. Llevamos ${total} partidas de puro fuego. ¡Sigan jugando que esto está picante!`,
  (top: string, bottom: string, total: number) => `Atención tigueraje: ${top} se coronó como el papá de la mesa esta semana. Tiene a todo el mundo a monte. Mientras tanto, ${bottom} anda como un pollito mojado, no gana ni una partida de práctica. Ya van ${total} juegos y la calle está que arde. ¡Dique que hay revancha mañana!`,
  (top: string, bottom: string, total: number) => `Dímelo cantando, el ranking no miente: ${top} es el que tiene la grasa ahora mismo. ${bottom} está en el suelo, pidiendo un tiempo fuera porque no aguanta la presión. Con ${total} juegos encima, la liga está más dura que un coco. ¡El que tenga miedo que se compre un perro!`
];

/**
 * Weekly summary keeps the jocosity and slang.
 */
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

/**
 * Placeholder for compatibility, but the UI now uses manual input for nicknames.
 */
export async function generateDominicanNickname(realName: string): Promise<string> {
  return realName;
}
