import dotenv from 'dotenv';
dotenv.config();
import config from './config/config';
import { App } from './app';
import { logger, umzug } from './lib';

const port = config.port;
const app = new App();

app.server.listen(port, () => logger.info({ port }, 'Server running'));

/**
 * Function to connect to the DB, run migrations and start sqs polling.
 * If the DB connection fails it waits 10 seconds and tries to reconnect again until success.
 */
const handleDatabaseConnectionAndStartPolling = () => {
  app
    .connectToDatabase()
    .then(async () => {
      logger.info('Connected to database');
      try {
        await umzug.umzugMigrations.up();
        await umzug.umzugSeeders.up();
      } catch (err) {
        logger.error(err, 'Error with umzug');
      }
    })
    .catch((err) => {
      // error. Wait 10 seconds and try again
      logger.error(err, 'Connection error!');
      logger.info('Trying to connect again');

      setTimeout(handleDatabaseConnectionAndStartPolling, 10000);
    });
};

// Connect to db, run migrations and start sqs polling. Also handle connection error
handleDatabaseConnectionAndStartPolling();

const handleMongoConnection = () => {
  app.connectToMongo().catch((err) => {
    logger.error(err, 'MongoDB connection error, retrying in 10s');
    setTimeout(handleMongoConnection, 10000);
  });
};

handleMongoConnection();
