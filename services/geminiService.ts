import { GoogleGenAI } from "@google/genai";

/**
 * LÓGICA DE INTELIGENCIA ARTIFICIAL DOMINICANA
 * Se utiliza el modelo gemini-3-flash-preview para generar el resumen con "tigueraje".
 */

export async function generateWeeklySummary(leagueDataJson: string): Promise<string> {
  try {
    // Safety check for process.env to prevent ReferenceError in non-node environments
    const apiKey = (typeof process !== 'undefined' && process.env?.API_KEY) ? process.env.API_KEY : '';
    
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Actúa como un experto cronista de dominó dominicano con mucho "tigueraje" y jocosidad.
      Analiza los siguientes datos de la liga y genera un resumen semanal épico:
      ${leagueDataJson}
      
      Reglas:
      1. Usa jerga dominicana (KLK, grasa, pidiendo cacao, en altísima, mangu, etc.).
      2. Sé gracioso pero resalta los logros.
      3. Menciona quién está dominando y quién debe mejorar.
      4. Mantén el tono de "charla de esquina" pero con respeto a la competencia.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
    });

    return response.text || "No se pudo generar el resumen en este momento, los tigueres están en banda.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Error de conexión con el satélite del patio. Intenta más tarde.";
  }
}

export async function generateDominicanNickname(realName: string): Promise<string> {
  return realName; // No longer used for auto-generation as per previous request
}