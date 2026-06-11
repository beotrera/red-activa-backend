import { ReportModel } from '../models/report.model';
import { SeederLog } from '../models/seeder-log.model';
import { logger } from '../lib';

const SEEDER_ID = 'reports-v1';

export const runReportsSeeders = async (): Promise<void> => {
  try {
    const alreadyRan = await SeederLog.findById(SEEDER_ID);
    if (alreadyRan) {
      logger.info(`Seeder "${SEEDER_ID}" already ran, skipping`);
      return;
    }

    const reports = [
      {
        fullName: 'Roberto Ángel Ferreyra',
        description: 'Hombre de aproximadamente 55 años, contextura robusta, cabello canoso corto. Vestía camisa a cuadros azul y blanca, pantalón de jean oscuro y zapatillas blancas. Tiene un tatuaje de una cruz en el antebrazo izquierdo y una cicatriz notable en la ceja derecha. Usa anteojos de armazón negra. Desapareció el 3 de junio caminando hacia la parada de colectivo.',
        picture: '/uploads/reports/placeholder.jpg',
      },
      {
        fullName: 'Camila Inés Suárez',
        description: 'Mujer joven de unos 22 años, delgada, cabello largo lacio color negro con mechas rubias. Tez morena clara. Al momento de la desaparición llevaba campera de jean corta, remera blanca con estampado floral, pantalón tipo palazzo negro y zapatillas rosas. Tiene un tatuaje de una mariposa en el tobillo derecho y las orejas con múltiples aros. Sin marcas físicas adicionales.',
        picture: '/uploads/reports/placeholder.jpg',
      },
      {
        fullName: 'Néstor Fabián Quiroga',
        description: 'Hombre adulto mayor, aproximadamente 70 años. Contextura delgada, altura baja, piel muy blanca. Padece deterioro cognitivo. Vestía ropa de cama: pantalón de pijama a rayas celeste y blanco y remera blanca sin mangas. Descalzo. No porta documentos. Tiene manchas de vitíligo en ambas manos y cuello. Calvo con franja de cabello blanco en los costados.',
        picture: '/uploads/reports/placeholder.jpg',
      },
      {
        fullName: 'Valentina Rocío Medina',
        description: 'Adolescente de 16 años, contextura media, cabello castaño oscuro recogido en colita. Llevaba uniforme escolar: guardapolvo blanco, pollera gris y mochila verde con parches de bandas de rock. Tiene frenillos metálicos. Marca de nacimiento color marrón en la mejilla izquierda. Calzaba zapatillas de lona negras. Fue vista por última vez saliendo del colegio.',
        picture: '/uploads/reports/placeholder.jpg',
      },
    ];

    await ReportModel.insertMany(reports);
    await SeederLog.create({ _id: SEEDER_ID });

    logger.info(`Seeder "${SEEDER_ID}" completed — ${reports.length} reports inserted`);
  } catch (err) {
    logger.error(err, `Seeder "${SEEDER_ID}" failed`);
    throw err;
  }
};
