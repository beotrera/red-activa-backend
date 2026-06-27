import { GoogleGenAI, Type } from '@google/genai';

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) throw new Error('GOOGLE_API_KEY no está definida en .env');
const ai = new GoogleGenAI({ apiKey });


async function compararDescripciones(desc1: string, desc2: string) {
  
  
  const prompt =
  `Sos un asistente que compara descripciones físicas de personas en español, para uso forense/investigativo de prueba. Analizá similitudes considerando:
- Sinónimos y variantes (jean/jena/denim, remera/playera)
- Ubicaciones corporales cercanas o compatibles (pie y tobillo se consideran zona compatible, no un punto en contra)
- Datos adicionales en una descripción que no están en la otra NO deben penalizar el score (más detalle no es una diferencia)
- Solo penalizar contradicciones reales (ej: dice "rubia" en una y "morocha" en otra)

Devolvé SOLO un JSON válido, sin texto adicional ni markdown, con esta forma exacta:
{"score": <entero 1-100>, "matches": ["..."], "differences": ["..."], "reasoning": "..."}

Descripción 1: ${desc1}

Descripción 2: ${desc2}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score:       { type: Type.INTEGER },
          matches:     { type: Type.ARRAY, items: { type: Type.STRING } },
          differences: { type: Type.ARRAY, items: { type: Type.STRING } },
          reasoning:   { type: Type.STRING },
        },
        required: ['score', 'matches', 'differences', 'reasoning'],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error('Gemini devolvió una respuesta vacía');

  return JSON.parse(text);
}

export const googleAI = { compararDescripciones };
