import express, { Request, Response, NextFunction } from 'express';
import httpContext from 'express-http-context';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import config from './config/config';
import { customErrors } from './enums';
import { routes } from './routes';
import { sequelize } from './models';
import { CustomError, WSresponse, logger } from './lib';

// Error handler
const exceptionMiddleware = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof CustomError) {
    logger.error(err, 'Api middleware exception');

    const httpStatus = customErrors[err.errorCode] && customErrors[err.errorCode].HTTPStatusCode;

    return res
      .status(httpStatus || 500)
      .send(new WSresponse(false, err.data, err.errorCode, err.substitutions));
  }

  logger.error(err);
  res.status(500);

  // If development environment send internal error data
  if (['TEST', 'QA', 'DEV'].includes(config.env)) {
    return res.send(new WSresponse(false, err));
  }

  return res.send(new WSresponse(false));
};

export class App {
  public server: express.Application;

  constructor() {
    this.server = express();

    this.server.use(httpContext.middleware);
    this.configureLogging();
    this.configureMiddleware();
    this.configureRoutes();
  }

  public async connectToDatabase() {
    try {
      await sequelize().authenticate();
      logger.info('Database connection successfully');
    } catch (error) {
      logger.error(error, 'Database connection failed');
      throw error;
    }
  }

  public async connectToMongo() {
    try {
      await mongoose.connect(config.mongoUrl);
      logger.info('MongoDB connection successfully');
    } catch (error) {
      logger.error(error, 'MongoDB connection failed');
      throw error;
    }
  }

  private configureLogging() {
    const format = config.env === 'LOCAL' ? 'dev' : 'tiny';
    const httpLogger = morgan(format, {
      skip: (req: Request, _res: Response) => {
        return req.baseUrl == '/api/health';
      },
    });
    this.server.use(httpLogger);
  }

  private configureMiddleware() {
    this.server.use(bodyParser.text());
    this.server.use(bodyParser.json());
    this.server.use(bodyParser.urlencoded({ extended: false }));
    this.server.use(helmet()); // for security purposes
    this.server.use(
      cors({
        credentials: true,
      }),
    ); // enable all CORS Requests
    this.server.use(cookieParser());
  }

  private configureRoutes() {
    this.server.use('/api', routes);
    // catch 404 and forward to error handler
    this.server.use((req: Request, res: Response) => {
      res.status(404);
      res.send(new WSresponse(false));
    });
    this.server.use(exceptionMiddleware);
  }
}

export default App;
