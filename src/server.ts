import express, { Application } from 'express';
import * as http from 'http';
import cors from 'cors';
import expressPino from 'express-pino-logger';
import routes from './routes';
import logger from './loaders/logger';

export default class SetupServer {
  private server?: http.Server;

  private app: Application = express();

  private port: number;

  constructor(port = 3000) {
    this.port = port;
  }

  public async init(): Promise<void> {
    this.setupExpress();
  }

  private setupExpress(): void {
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    // Body parsing Middleware
    this.app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));
    this.app.use(expressPino({ logger }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private routes(): void {
    this.app.use(routes);
  }

  public start(): void {
    this.server = this.app.listen(this.port, (): void => {
      logger.info(`Server listening on port: ${this.port}`);
    });
  }

  public async close(): Promise<void> {
    console.log('close database...here');
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
}
