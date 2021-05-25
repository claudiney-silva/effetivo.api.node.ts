import express, { Application } from 'express';
import * as http from 'http';
import cors from 'cors';
import expressPino from 'express-pino-logger';
import swaggerUI from 'swagger-ui-express';
import logger from '@src/loaders/logger';
import { swaggerDocs, swaggerUIOtions } from '@src/loaders/documentation';
import * as database from '@src/loaders/database';
import * as passport from '@src/loaders/passport';
import routes from '@src/controllers';
import errorMiddleware from '@src/middlewares/error';

export default class SetupServer {
  private server?: http.Server;

  private port: number;

  private app: Application;

  constructor(port = 3000) {
    this.port = port;
    this.app = express();
  }

  public async init(): Promise<void> {
    this.setupMiddlewares();
    this.setupDocumentation();
    this.setupPassport();
    this.setupControllers();
    await this.setupDatabase();

    // deve ser o último para tratar errors
    this.setupErrorHandlers();
  }

  public start(): void {
    this.server = this.app.listen(this.port, (): void => {
      logger.info(`Server listening on port: ${this.port}`);
    });
  }

  public async close(): Promise<void> {
    await database.close();
    if (this.server) {
      await new Promise<void>((resolve, reject) => {
        this.server?.close(err => {
          if (err) {
            return reject(err);
          }
          return resolve();
        });
      });
    }
  }

  private async setupDatabase(): Promise<void> {
    await database.connect();
  }

  private setupMiddlewares(): void {
    // Body parsing Middleware
    this.app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));
    this.app.use(expressPino({ logger }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private async setupDocumentation(): Promise<void> {
    /*
	this.app.get('/swagger.json', function (req, res) {
		res.setHeader('Content-Type', 'application/json');
		res.send(swaggerDocs);
	});
	*/
    this.app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs, swaggerUIOtions));
  }

  private setupPassport(): void {
    passport.init(this.app);
  }

  private setupControllers(): void {
    this.app.use(routes);
  }

  private setupErrorHandlers(): void {
    this.app.use(errorMiddleware);
  }
}
