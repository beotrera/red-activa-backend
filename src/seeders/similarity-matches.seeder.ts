import { PersonModel } from '../models/person.model';
import { ReportModel } from '../models/report.model';
import { SimilarityMatchModel } from '../models/similarity-match.model';
import { SeederLog } from '../models/seeder-log.model';
import { logger } from '../lib';

const SEEDER_ID = 'similarity-matches-v2';

export const runSimilarityMatchesSeeders = async (): Promise<void> => {
  try {
    const alreadyRan = await SeederLog.findById(SEEDER_ID);
    if (alreadyRan) {
      logger.info(`Seeder "${SEEDER_ID}" already ran, skipping`);
      return;
    }

    // ── Buscar los 4 NNs diseñados para match ─────────────────────────────
    const nnMatch1 = await PersonModel.findOne({
      neighborhood: 'Almagro',
      distinctiveFeatures: /tatuaje de águila en el antebrazo derecho\. cicatriz en el mentón/i,
    });

    const nnMatch2 = await PersonModel.findOne({
      neighborhood: 'Boedo',
      distinctiveFeatures: /piercing en oreja izquierda.*marca de nacimiento en el cuello/i,
    });

    const nnMatch3 = await PersonModel.findOne({
      neighborhood: 'Palermo',
      distinctiveFeatures: /cabello largo lacio negro.*tatuaje de mariposa en el tobillo derecho/i,
    });

    const nnMatch4 = await PersonModel.findOne({
      neighborhood: 'Recoleta',
      distinctiveFeatures: /pijama a rayas celeste y blanco.*vitíligo/i,
    });

    // ── Buscar los reportes correspondientes ──────────────────────────────
    const reportFuentes = await ReportModel.findOne({ fullName: 'Marcelo Darío Fuentes' });
    const reportTorres = await ReportModel.findOne({ fullName: 'Luciana Beatriz Torres' });
    const reportSuarez = await ReportModel.findOne({ fullName: 'Camila Inés Suárez' });
    const reportQuiroga = await ReportModel.findOne({ fullName: 'Néstor Fabián Quiroga' });

    // ── Reportes adicionales para matches secundarios ─────────────────────
    const reportFerreyra = await ReportModel.findOne({ fullName: 'Roberto Ángel Ferreyra' });
    const reportMedina = await ReportModel.findOne({ fullName: 'Valentina Rocío Medina' });
    const reportNunez = await ReportModel.findOne({ fullName: 'Silvia Beatriz Núñez' });
    const reportPeralta = await ReportModel.findOne({ fullName: 'Jesica Anahí Peralta' });

    if (!nnMatch1 || !nnMatch2 || !nnMatch3 || !nnMatch4) {
      throw new Error('Required NN persons not found. Run persons seeder first.');
    }

    if (!reportFuentes || !reportTorres || !reportSuarez || !reportQuiroga) {
      throw new Error('Required reports not found. Run reports seeder first.');
    }

    await SimilarityMatchModel.deleteMany({});

    const matches = [
      // ── NN-1 (Almagro, hombre atlético, águila + cicatriz) ──────────────
      // Match principal: Marcelo Fuentes — score muy alto
      {
        person: nnMatch1._id,
        report: reportFuentes._id,
        score: 92,
        differences: [
          'La remera reportada era "deportiva gris" — la persona NN ingresó sin remera (heridas en torso).',
          'El reporte indica que "salió a correr", la persona NN fue hallada en la vía pública sin zapatillas de running.',
        ],
        reasoning:
          'Existe una compatibilidad muy alta entre ambas descripciones. Ambos presentan contextura atlética, cabello negro corto, tatuaje de águila en el antebrazo derecho y cicatriz en el mentón — tres marcas físicas altamente específicas que coinciden con precisión. El rango etario del NN (38-46 años) es compatible con los 40 años reportados. La altura (1,79 m) y el peso (82 kg) coinciden exactamente. Las únicas diferencias menores son la vestimenta al ingreso y el calzado, atribuibles al transcurso del tiempo desde la desaparición. Se recomienda priorizar esta comparación y contactar a la familia denunciante de inmediato.',
      },
      // Match secundario: Roberto Ferreyra — score bajo
      ...(reportFerreyra
        ? [
            {
              person: nnMatch1._id,
              report: reportFerreyra._id,
              score: 18,
              differences: [
                'Género compatible (ambos masculinos), pero el contextura difiere: Ferreyra es "robusto" y el NN es "atlético".',
                'Ferreyra tiene cabello canoso; el NN tiene cabello negro corto.',
                'Las señas particulares no coinciden: Ferreyra tiene tatuaje de cruz en antebrazo izquierdo y cicatriz en ceja derecha; el NN tiene águila en antebrazo derecho y cicatriz en mentón.',
                'Las edades reportadas difieren significativamente: 45 años (Ferreyra) vs rango 38-46 del NN, pero las características no se alinean.',
              ],
              reasoning:
                'Si bien comparten el género y un rango etario parcialmente compatible, las señas particulares difieren de manera significativa: la ubicación y el diseño de los tatuajes, así como la ubicación de la cicatriz, son indicadores de identificación de alta fiabilidad y no presentan coincidencia. Las diferencias en contextura y coloración del cabello refuerzan la baja probabilidad de que se trate de la misma persona. No se recomienda priorizar esta comparación.',
            },
          ]
        : []),

      // ── NN-2 (Boedo, mujer, castaño corto, piercing, lunar cuello) ───────
      // Match principal: Luciana Torres — score alto
      {
        person: nnMatch2._id,
        report: reportTorres._id,
        score: 88,
        differences: [
          'El barrio difiere: el reporte indica "Almagro" como último avistamiento; el NN fue hallado en "Boedo" (barrios limítrofes).',
          'El reporte dice "vestía ropa informal" sin mayor detalle; sin información de vestimenta en el ingreso del NN.',
        ],
        reasoning:
          'La coincidencia entre ambas descripciones es muy elevada en los rasgos de identificación más específicos: cabello castaño corto, piercing en oreja izquierda y marca de nacimiento en el cuello lado derecho. Todos estos elementos, en conjunto, representan un patrón de identificación altamente inusual que reduce drásticamente la probabilidad de coincidencia casual. La edad reportada (28 años) es compatible con el rango del NN (25-31 años). La altura (1,62 m) y el peso (55-56 kg) coinciden casi exactamente. La diferencia barrial es menor dado que Almagro y Boedo son adyacentes. El estado de consciencia (desorientada en ambos casos) también es consistente. Se recomienda gestionar la identificación con carácter urgente.',
      },
      // Match secundario: Valentina Medina — score muy bajo
      ...(reportMedina
        ? [
            {
              person: nnMatch2._id,
              report: reportMedina._id,
              score: 12,
              differences: [
                'Género compatible (ambas femeninas), pero la edad difiere marcadamente: Medina tiene 17 años vs rango 25-31 del NN.',
                'Medina tiene cabello castaño en colita, el NN tiene cabello castaño corto.',
                'Medina presenta frenillos metálicos; el NN no.',
                'Las señas particulares no coinciden: Medina tiene marca de nacimiento en la mejilla, el NN en el cuello.',
              ],
              reasoning:
                'Aunque ambas son mujeres de cabello castaño, las diferencias en edad, largo de cabello, accesorios dentales y localización de la marca de nacimiento son determinantes. La diferencia etaria de aproximadamente 10 años es significativa para una identificación positiva. Se descarta la coincidencia.',
            },
          ]
        : []),

      // ── NN-3 (Palermo, mujer, largo negro, campera jean, mariposa tobillo) ─
      // Match principal: Camila Suárez — score alto
      {
        person: nnMatch3._id,
        report: reportSuarez._id,
        score: 85,
        differences: [
          'El reporte indica que Camila tenía "campera de jean corta y remera blanca"; el NN ingresó con ropa diferente (puede haber cambiado de ropa).',
          'El reporte menciona "pantalón negro"; el NN fue hallado con pantalón oscuro sin especificar color exacto.',
        ],
        reasoning:
          'La compatibilidad es alta en múltiples indicadores físicos: cabello largo lacio negro, contextura delgada, tatuaje de mariposa en el tobillo derecho y múltiples aros en las orejas. La coincidencia del tatuaje de mariposa en el tobillo derecho es especialmente relevante como indicador diferencial. La edad reportada (25 años) coincide con el rango del NN (22-28 años). La altura (1,63 m) y el peso (54 kg) son prácticamente idénticos. Ambas fueron encontradas/reportadas en Palermo. La diferencia en vestimenta es la única discrepancia notable y puede explicarse por cambio de indumentaria. Se recomienda avanzar en el proceso de identificación.',
      },

      // ── NN-3 vs Jesica Peralta — match por vestimenta, diferencia en tatuaje
      ...(reportPeralta
        ? [
            {
              person: nnMatch3._id,
              report: reportPeralta._id,
              score: 85,
              differences: [
                "El diseño del tatuaje es completamente diferente: 'indio tomando merca' en el reporte y 'mariposa' en la descripción de la NN.",
              ],
              reasoning:
                "Existe una alta coincidencia en la vestimenta (campera de jean/jena, remera blanca, pantalón negro) y en la descripción general de la persona ('mujer joven'). La ubicación del tatuaje es compatible (pie vs. tobillo), lo cual no se considera una diferencia. Sin embargo, la contradicción en el diseño del tatuaje ('indio tomando merca' vs. 'mariposa') es un elemento de identificación clave y por lo tanto, una diferencia significativa. Los detalles adicionales de la descripción de la NN (cabello negro lacio, edad, aros) no se consideran diferencias al no haber sido mencionados en el reporte, solo aportan más detalle.",
            },
          ]
        : []),

      // ── NN-4 (Recoleta, adulto mayor, pijama, vitíligo, calvo) ────────────
      // Match principal: Néstor Quiroga — score muy alto
      {
        person: nnMatch4._id,
        report: reportQuiroga._id,
        score: 91,
        differences: [
          'El reporte indica que Néstor fue visto "descalzo"; el NN también ingresó descalzo, lo cual es consistente.',
          'No se observan diferencias significativas entre ambas descripciones.',
        ],
        reasoning:
          'La concordancia entre ambas descripciones es excepcionalmente alta. El conjunto de características es muy específico y difícil de coincidir casualmente: pijama a rayas celeste y blanco, descalzo, manchas de vitíligo en manos y cuello, calvicie con franja de cabello blanco en los costados, y aparente deterioro cognitivo. Cada uno de estos elementos por separado ya sería relevante; la coincidencia simultánea de todos ellos genera una probabilidad de identidad muy elevada. El rango etario del NN (65-75 años) es perfectamente compatible con los 70 años reportados. El barrio de hallazgo (Recoleta) coincide con el barrio del reporte. Se recomienda activar protocolo de identificación urgente y contactar a la familia de inmediato.',
      },
      // Match secundario adicional: Silvia Núñez (adulta mayor, deterioro cognitivo) — score bajo
      ...(reportNunez
        ? [
            {
              person: nnMatch4._id,
              report: reportNunez._id,
              score: 8,
              differences: [
                'Género diferente: el NN es masculino, Silvia Núñez es femenina.',
                'La descripción de Núñez (cabello blanco corto, camisón floreado) no coincide con el NN (calvo con pijama a rayas).',
                'Aunque ambos presentan deterioro cognitivo, no hay coincidencia en ninguna característica física específica.',
              ],
              reasoning:
                'El único elemento compartido es la presencia de deterioro cognitivo en ambos casos, lo cual es una característica frecuente en adultos mayores y no constituye un indicador diferencial útil. El género diferente descarta por completo la coincidencia. No se recomienda avanzar en esta comparación.',
            },
          ]
        : []),
    ];

    await SimilarityMatchModel.insertMany(matches);
    await SeederLog.create({ _id: SEEDER_ID });

    logger.info(`Seeder "${SEEDER_ID}" completed — ${matches.length} similarity matches inserted`);
  } catch (err) {
    logger.error(err, `Seeder "${SEEDER_ID}" failed`);
    throw err;
  }
};
