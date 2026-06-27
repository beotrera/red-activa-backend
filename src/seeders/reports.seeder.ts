import { ReportModel } from '../models/report.model';
import { SeederLog } from '../models/seeder-log.model';
import { Gender } from '../enums';
import { logger } from '../lib';

const SEEDER_ID = 'reports-v4';

export const runReportsSeeders = async (): Promise<void> => {
  try {
    const alreadyRan = await SeederLog.findById(SEEDER_ID);
    if (alreadyRan) {
      logger.info(`Seeder "${SEEDER_ID}" already ran, skipping`);
      return;
    }

    await ReportModel.deleteMany({});

    const reports = [
      // ── Reportes originales (re-insertados) ──────────────────────────────
      {
        fullName: 'Roberto Ángel Ferreyra',
        description: 'Hombre de aproximadamente 45 años, contextura robusta, cabello canoso corto. Vestía camisa a cuadros azul y blanca, pantalón de jean oscuro. Tatuaje de una cruz en el antebrazo izquierdo y cicatriz en la ceja derecha. Usa anteojos de armazón negra.',
        picture: '/uploads/reports/placeholder.jpg',
        neighborhood: 'Almagro',
        lastSeenDate: new Date('2026-05-28T18:30:00'),
        gender: Gender.MALE,
        estimatedAge: 45,
        height: 1.76,
        weight: 88,
      },
      {
        fullName: 'Camila Inés Suárez',
        description: 'Mujer joven de 25 años, delgada, cabello largo lacio negro. Campera de jean corta, remera blanca, pantalón negro. Tatuaje de mariposa en el tobillo derecho y múltiples aros en las orejas.',
        picture: '/uploads/reports/placeholder.jpg',
        neighborhood: 'Palermo',
        lastSeenDate: new Date('2026-06-01T21:00:00'),
        gender: Gender.FEMALE,
        estimatedAge: 25,
        height: 1.63,
        weight: 54,
      },
      {
        fullName: 'Néstor Fabián Quiroga',
        description: 'Hombre adulto mayor de unos 70 años. Contextura delgada, tez blanca. Padece deterioro cognitivo. Vestía pijama a rayas celeste y blanco. Descalzo. Manchas de vitíligo en ambas manos y cuello. Calvo con franja de cabello blanco en los costados.',
        picture: '/uploads/reports/placeholder.jpg',
        neighborhood: 'Recoleta',
        lastSeenDate: new Date('2026-06-05T07:15:00'),
        gender: Gender.MALE,
        estimatedAge: 70,
      },
      {
        fullName: 'Valentina Rocío Medina',
        description: 'Adolescente de 17 años, contextura media, cabello castaño oscuro en colita. Guardapolvo blanco, pollera gris y mochila verde. Frenillos metálicos. Marca de nacimiento marrón en la mejilla izquierda. Zapatillas de lona negras.',
        picture: '/uploads/reports/placeholder.jpg',
        neighborhood: 'Balvanera',
        lastSeenDate: new Date('2026-06-03T13:45:00'),
        gender: Gender.FEMALE,
        estimatedAge: 17,
        height: 1.60,
      },
      {
        fullName: 'Marcelo Darío Fuentes',
        description: 'Hombre de 40 años, contextura atlética, cabello negro corto. Tatuaje de águila en el antebrazo derecho. Cicatriz en el mentón. Vestía remera deportiva gris y pantalón de jean. Orientado. Salió a correr y no regresó.',
        picture: '/uploads/reports/placeholder.jpg',
        neighborhood: 'Almagro',
        lastSeenDate: new Date('2026-06-02T06:30:00'),
        gender: Gender.MALE,
        estimatedAge: 40,
        height: 1.79,
        weight: 82,
      },
      {
        fullName: 'Luciana Beatriz Torres',
        description: 'Mujer de unos 28 años, cabello castaño corto. Piercing en oreja izquierda. Marca de nacimiento en el cuello lado derecho. Vestía ropa informal. Desorientada según testigos.',
        picture: '/uploads/reports/placeholder.jpg',
        neighborhood: 'Almagro',
        lastSeenDate: new Date('2026-06-03T16:00:00'),
        gender: Gender.FEMALE,
        estimatedAge: 28,
        height: 1.62,
        weight: 56,
      },

      // ── Nuevos reportes ───────────────────────────────────────────────────
      {
        fullName: 'Hugo Ernesto Villareal',
        description: 'Hombre de 55 años, contextura robusta, cabello negro con mucho gris. Bigote oscuro. Tatuaje de la Virgen María en el antebrazo derecho. Vestía camisa de trabajo azul y pantalón de trabajo beige. Calzado de seguridad. Salió al trabajo y no regresó.',
        picture: '/uploads/reports/placeholder.jpg',
        neighborhood: 'Flores',
        lastSeenDate: new Date('2026-06-06T06:00:00'),
        gender: Gender.MALE,
        estimatedAge: 55,
        height: 1.71,
        weight: 90,
      },
      {
        fullName: 'Patricia Mónica Herrera',
        description: 'Mujer de 35 años, contextura media, cabello rubio oscuro ondulado largo hasta los hombros. Cicatriz quirúrgica en el abdomen. Vestía ropa de enfermería celeste. Anteojos de armazón azul. Fue vista saliendo de su trabajo a las 20 hs.',
        picture: '/uploads/reports/placeholder.jpg',
        neighborhood: 'Caballito',
        lastSeenDate: new Date('2026-06-02T20:00:00'),
        gender: Gender.FEMALE,
        estimatedAge: 35,
        height: 1.66,
        weight: 61,
      },
      {
        fullName: 'Julián Martín Pérez',
        description: 'Joven de 22 años, piel morena, cabello oscuro muy corto. Tatuaje de texto en el cuello (inicial "J"). Contextura delgada. Vestía remera de fútbol y pantalón de jean. Zapatillas deportivas blancas.',
        picture: '/uploads/reports/placeholder.jpg',
        neighborhood: 'Barracas',
        lastSeenDate: new Date('2026-06-04T22:00:00'),
        gender: Gender.MALE,
        estimatedAge: 22,
        height: 1.75,
        weight: 68,
      },
      {
        fullName: 'Elena Rosa Domínguez',
        description: 'Mujer de 62 años, cabello rubio teñido corto. Contextura media. Vestía abrigo largo gris y anteojos de sol sin receta. Llevaba bolso de cuero negro. Padece inicio de demencia senil. Desapareció del centro comercial.',
        picture: '/uploads/reports/placeholder.jpg',
        neighborhood: 'Belgrano',
        lastSeenDate: new Date('2026-06-07T11:00:00'),
        gender: Gender.FEMALE,
        estimatedAge: 62,
        height: 1.57,
        weight: 63,
      },
      {
        fullName: 'Sergio Gustavo Acuña',
        description: 'Hombre de 48 años, cabello oscuro con canas, corto. Vestía jogging azul marino y zapatillas blancas deportivas. Estaba corriendo por el parque y no regresó a su domicilio. Sin señas particulares visibles.',
        picture: '/uploads/reports/placeholder.jpg',
        neighborhood: 'Villa Urquiza',
        lastSeenDate: new Date('2026-06-08T06:30:00'),
        gender: Gender.MALE,
        estimatedAge: 48,
        height: 1.74,
        weight: 80,
      },
      {
        fullName: 'Mariana Sol Vega',
        description: 'Mujer de 30 años, cabello castaño oscuro largo. Tatuaje de pluma de tinta en el costado del torso. Vestía vestido floreado y sandalias. Muy callada según testigos. Fue vista en la feria artesanal del barrio.',
        picture: '/uploads/reports/placeholder.jpg',
        neighborhood: 'San Telmo',
        lastSeenDate: new Date('2026-06-06T17:00:00'),
        gender: Gender.FEMALE,
        estimatedAge: 30,
        height: 1.67,
        weight: 57,
      },
      {
        fullName: 'Oscar Alfredo Romero',
        description: 'Hombre adulto mayor de 67 años, contextura delgada. Cabello blanco escaso. Usaba bastón de madera. Vestía traje marrón clásico muy gastado. Padece Alzheimer diagnosticado. Salió de su casa sin avisar.',
        picture: '/uploads/reports/placeholder.jpg',
        neighborhood: 'Boedo',
        lastSeenDate: new Date('2026-06-04T07:00:00'),
        gender: Gender.MALE,
        estimatedAge: 67,
      },
      {
        fullName: 'Florencia Noelia Castro',
        description: 'Joven de 19 años, cabello azulado corto (teñido recientemente). Múltiples piercings y aros grandes. Vestía remera negra de banda de rock, pantalón de cuero y zapatillas plataforma. Tatuaje de corazón en el cuello. No llegó a casa tras una salida nocturna.',
        picture: '/uploads/reports/placeholder.jpg',
        neighborhood: 'Villa Crespo',
        lastSeenDate: new Date('2026-06-07T23:00:00'),
        gender: Gender.FEMALE,
        estimatedAge: 19,
        height: 1.68,
      },
      {
        fullName: 'Diego Hernán Morales',
        description: 'Hombre de 38 años, cabello castaño oscuro corto. Barba de varios días. Tatuaje de reloj de arena en el antebrazo izquierdo. Vestía ropa de trabajo (pantalón beige y camisa de manga corta). Salió a buscar materiales y no regresó.',
        picture: '/uploads/reports/placeholder.jpg',
        neighborhood: 'Chacarita',
        lastSeenDate: new Date('2026-06-06T10:00:00'),
        gender: Gender.MALE,
        estimatedAge: 38,
        height: 1.76,
        weight: 79,
      },
      {
        fullName: 'Silvia Beatriz Núñez',
        description: 'Mujer de 72 años, cabello blanco corto. Contextura delgada. Vestía camisón floreado y pantuflas celestes. Padece deterioro cognitivo avanzado. Fue vista caminando sola de noche cerca de su domicilio.',
        picture: '/uploads/reports/placeholder.jpg',
        neighborhood: 'Recoleta',
        lastSeenDate: new Date('2026-06-06T22:00:00'),
        gender: Gender.FEMALE,
        estimatedAge: 72,
      },
      {
        fullName: 'Gonzalo Andrés Pereyra',
        description: 'Hombre de 33 años, piel morena, cabello oscuro muy corto. Tatuaje del nombre "Gloria" en el pecho. Vestía remera de fútbol celeste y blanca y jean. Fue visto en el puerto del barrio y no regresó.',
        picture: '/uploads/reports/placeholder.jpg',
        neighborhood: 'La Boca',
        lastSeenDate: new Date('2026-06-05T14:00:00'),
        gender: Gender.MALE,
        estimatedAge: 33,
        height: 1.68,
        weight: 70,
      },
      {
        fullName: 'Adriana Claudia Ruiz',
        description: 'Mujer de 44 años, cabello oscuro con mechas rubias, largo a los hombros. Vestía ropa de oficina formal. Tatuaje de estrella pequeña en el tobillo. Fue vista saliendo de su trabajo en el microcentro.',
        picture: '/uploads/reports/placeholder.jpg',
        neighborhood: 'Monserrat',
        lastSeenDate: new Date('2026-06-05T18:30:00'),
        gender: Gender.FEMALE,
        estimatedAge: 44,
        height: 1.64,
        weight: 60,
      },
      {
        fullName: 'Federico José Blanco',
        description: 'Hombre de 27 años, contextura atlética, cabello castaño oscuro corto moderno. Vestía traje oscuro sin corbata y zapatos de cuero. Fue visto saliendo de un restaurante del barrio de madrugada.',
        picture: '/uploads/reports/placeholder.jpg',
        neighborhood: 'Puerto Madero',
        lastSeenDate: new Date('2026-06-04T00:30:00'),
        gender: Gender.MALE,
        estimatedAge: 27,
        height: 1.83,
        weight: 79,
      },
      {
        fullName: 'Norma Ester Salinas',
        description: 'Mujer de 58 años, cabello gris con permanente. Contextura media. Vestía ropa oscura de trabajo y cartera negra. Fue vista en la estación de subte y no llegó a destino. Repite el nombre "Miguel" insistentemente.',
        picture: '/uploads/reports/placeholder.jpg',
        neighborhood: 'Constitucion',
        lastSeenDate: new Date('2026-06-04T09:00:00'),
        gender: Gender.FEMALE,
        estimatedAge: 58,
        height: 1.55,
      },
      {
        fullName: 'Ramón Antonio Ojeda',
        description: 'Hombre de 60 años, cabello blanco peinado, bigote gris. Vestía camisa a cuadros y pantalón de vestir. Calzado marrón de cuero. Salió a caminar con el andador por el parque y no regresó. Tiene diagnóstico de deterioro cognitivo leve.',
        picture: '/uploads/reports/placeholder.jpg',
        neighborhood: 'Coghlan',
        lastSeenDate: new Date('2026-06-08T16:00:00'),
        gender: Gender.MALE,
        estimatedAge: 60,
      },
      {
        fullName: 'Jesica Anahí Peralta',
        description: 'Mujer joven de unos 22 años. Vestía campera de jena negra corta, remera blanca y pantalón negro. Tatuaje en el pie derecho con figura de indio tomando merca. Cabello oscuro lacio recogido. Múltiples aros en las orejas.',
        picture: '/uploads/reports/placeholder.jpg',
        neighborhood: 'Palermo',
        lastSeenDate: new Date('2026-06-01T20:30:00'),
        gender: Gender.FEMALE,
        estimatedAge: 22,
        height: 1.63,
        weight: 54,
      },
      {
        fullName: 'Verónica Paola Ibáñez',
        description: 'Mujer de 25 años, cabello castaño rizado largo. Vestía ropa de trabajo artístico con manchas de pintura. Cartera de tela artesanal. Fue vista en una muestra de arte del barrio y no volvió a casa.',
        picture: '/uploads/reports/placeholder.jpg',
        neighborhood: 'Villa Ortuzar',
        lastSeenDate: new Date('2026-06-09T19:00:00'),
        gender: Gender.FEMALE,
        estimatedAge: 25,
        height: 1.70,
        weight: 58,
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
