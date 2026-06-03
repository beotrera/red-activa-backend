import dotenv from 'dotenv';
dotenv.config();
import config from './config/config';
import { App } from './app';
import { logger } from './lib';

const port = config.port;
const app = new App();

app.server.listen(port, () => logger.info({ port }, 'Server running'));

const handleDatabaseConnectionAndStartPolling = () => {
  app.connectToDatabase().catch((err) => {
    logger.error(err, 'MongoDB connection error, retrying in 10s');
    setTimeout(handleDatabaseConnectionAndStartPolling, 10000);
  });
};

// Connect to db.
handleDatabaseConnectionAndStartPolling();
