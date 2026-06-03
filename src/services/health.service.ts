import { logger } from '../lib';

const getHealthStatus = (): string => {
  logger.info('The application is up and running!');
  return 'Up & running ;)!';
};

export const healthService = {
  getHealthStatus,
};
