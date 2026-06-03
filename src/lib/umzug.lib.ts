import { Sequelize } from 'sequelize';
import { SequelizeStorage, Umzug } from 'umzug';
import { logger } from '.';
import config from '../config/config';
import { sequelize } from '../models';

const sequelizeConfig = sequelize();

const umzugMigrations = new Umzug({
  migrations: {
    glob: 'migrations/*.js',
    resolve: ({ name, path, context }) => {
      // adjust the migration parameters Umzug will
      // pass to migration methods, this is done because
      // Sequilize-CLI generates migrations that require
      // two parameters be passed to the up and down methods
      // but by default Umzug will only pass the first
      const migration = require(path || ''); // eslint-disable-line
      return {
        name,
        up: async () => await migration.up(context, Sequelize), // eslint-disable-line
        down: async () => await migration.down(context, Sequelize), // eslint-disable-line
      };
    },
  },
  context: sequelizeConfig.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize: sequelizeConfig }),
  logger,
});

const umzugSeeders = new Umzug({
  migrations: {
    glob: config.env === 'PROD' ? 'seeders/prod/*.js' : 'seeders/dev_qa/*.js',
    resolve: ({ name, path, context }) => {
      const seeder = require(path || ''); // eslint-disable-line
      return {
        name,
        up: async () => await seeder.up(context, Sequelize), // eslint-disable-line
        down: async () => await seeder.down(context, Sequelize), // eslint-disable-line
      };
    },
  },
  context: sequelizeConfig.getQueryInterface(),
  storage: new SequelizeStorage({
    sequelize: sequelizeConfig,
    modelName: 'SequelizeSeeder',
  }),
  logger,
});

export const umzug = { umzugMigrations, umzugSeeders };
