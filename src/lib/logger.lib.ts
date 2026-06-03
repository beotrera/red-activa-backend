import httpContext from 'express-http-context';
import pino from 'pino';
import config from '../config/config';

import { CustomError } from './custom_error.lib';

// Pretty print if not prod
let prettyPrint: any = false;
if (config.env === 'LOCAL') {
  prettyPrint = {
    colorize: true,
    translateTime: true,
  };
}

// Data to be included in every log
const mixin = () => {
  return {
    traceId: httpContext.get('traceId'),
    loggedManagerId: httpContext.get('managerId'),
  };
};

export const logger = pino({
  level: config.logger.level,
  base: null, // Don't add pid & hostname to logs
  prettyPrint,
  nestedKey: 'data', // Key to place any logged object under
  mixin,
  serializers: {
    // Needed because errors don't get serialized when using nestedKey
    data: (data) => {
      if (data instanceof Error || data instanceof CustomError) {
        return { err: pino.stdSerializers.err(data) };
      }

      if (data.err) {
        data.err = pino.stdSerializers.err(data.err);
      }

      return data;
    },
  },
});
