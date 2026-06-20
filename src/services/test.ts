import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

async function compararDescripciones(desc1, desc2) {
  const prompt = `Sos un asistente que compara descripciones físicas de personas en español, para uso forense/investigativo de prueba. Analizá similitudes considerando:
- Sinónimos y variantes (jean/jena/denim, remera/playera)
- Ubicaciones corporales cercanas o compatibles (pie y tobillo se consideran zona compatible, no un punto en contra)
- Datos adicionales en una descripción que no están en la otra NO deben penalizar el score (más detalle no es una diferencia)
- Solo penalizar contradicciones reales (ej: dice "rubia" en una y "morocha" en otra)

Devolvé SOLO un JSON válido, sin texto adicional ni markdown, con esta forma exacta:
{"score": <entero 1-100>, "coincidencias": ["..."], "diferencias": ["..."], "razonamiento": "..."}

Descripción 1: ${desc1}

Descripción 2: ${desc2}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    },
  });

  return JSON.parse(response.text);
}

export const a = { compararDescripciones };

/*
  return {
    score: 1,
    coincidencias: [],
    diferencias: [
      'Género (Mujer vs. Hombre)',
      'Edad (Joven vs. Adulto mayor de 70 años)',
      'Vestimenta (Campera de jena, remera blanca y pantalón negro vs. Pijama a rayas celeste y blanco, descalzo)',
      'Características distintivas (Tatuaje en forma de mariposa en el pie vs. Manchas de vitíligo en manos y cuello, calvo con franja de cabello blanco en los costados)',
    ],
    razonamiento:
      'Las descripciones corresponden a individuos de géneros y rangos de edad completamente opuestos. La vestimenta descrita en ambos casos es totalmente diferente. Las características físicas distintivas (tatuaje en uno, vitíligo y calvicie en el otro) no presentan ninguna similitud ni compatibilidad. No se encontró ninguna característica compartida ni compatible entre ambas descripciones, resultando en contradicciones fundamentales en casi todos los puntos de comparación.',
  };

  {
        "score": 65,
        "coincidencias": [
            "Ambas descripciones mencionan 'Mujer joven'.",
            "Ambas describen una 'campera de jena/jean' (considerando 'jena' y 'jean' como variantes o sinónimos).",
            "Ambas mencionan 'remera blanca'.",
            "Ambas mencionan 'pantalón negro'.",
            "Ambas ubican un tatuaje en la zona del pie/tobillo (considerado compatible según las instrucciones)."
        ],
        "diferencias": [
            "El diseño del tatuaje es completamente diferente: 'indio tomando merca' en la Descripción 1 y 'mariposa' en la Descripción 2."
        ],
        "razonamiento": "Existe una alta coincidencia en la vestimenta (tipo de campera, remera blanca, pantalón negro) y en la descripción general de la persona ('Mujer joven'). La ubicación del tatuaje es compatible (pie vs. tobillo), lo cual no se considera una diferencia. Sin embargo, la contradicción en el diseño del tatuaje ('indio tomando merca' vs. 'mariposa') es un elemento de identificación clave y por lo tanto, una diferencia significativa. Los detalles adicionales de la Descripción 2 (edad, complexión, cabello, aros) no se consideran diferencias al no haber sido mencionados en la Descripción 1, solo aportan más detalle."
    }
*/
