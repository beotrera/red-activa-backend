import { UserModel } from '../models/user.model';
import { InstitutionModel } from '../models/institution.model';
import { UserRole, Gender } from '../enums';
import { logger } from '../lib';
import { SeederLog } from '../models/seeder-log.model';

const SEEDER_ID = 'users-v1';

export const runUsersSeeders = async (): Promise<void> => {
  try {
    const alreadyRan = await SeederLog.findById(SEEDER_ID);
    if (alreadyRan) {
      logger.info(`Seeder "${SEEDER_ID}" already ran, skipping`);
      return;
    }

    const italiano = await InstitutionModel.findOne({ name: 'Hospital Italiano de Buenos Aires' });
    const aleman = await InstitutionModel.findOne({ name: 'Hospital Alemán' });

    if (!italiano || !aleman) {
      throw new Error('Required institutions not found. Run institutions seeder first.');
    }

    const users = [
      {
        email: 'carlos.mendez@italiano.org.ar',
        password: 'test',
        firstName: 'Carlos',
        lastName: 'Méndez',
        role: UserRole.DOCTOR,
        gender: Gender.MALE,
        institution: italiano._id,
        avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      },
      {
        email: 'laura.garcia@italiano.org.ar',
        password: 'test',
        firstName: 'Laura',
        lastName: 'García',
        role: UserRole.NURSE,
        gender: Gender.FEMALE,
        institution: italiano._id,
        avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      },
      {
        email: 'sofia.rodriguez@aleman.org.ar',
        password: 'test',
        firstName: 'Sofía',
        lastName: 'Rodríguez',
        role: UserRole.PSYCHOLOGIST,
        gender: Gender.FEMALE,
        institution: aleman._id,
        avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      },
    ];

    for (const userData of users) {
      const user = new UserModel(userData);
      await user.save(); // triggers bcrypt pre-save hook
    }

    await SeederLog.create({ _id: SEEDER_ID });

    logger.info(`Seeder "${SEEDER_ID}" completed — ${users.length} users created`);
  } catch (err) {
    logger.error(err, `Seeder "${SEEDER_ID}" failed`);
    throw err;
  }
};
