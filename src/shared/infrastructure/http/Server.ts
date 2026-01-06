import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { Logger } from '../logger/Logger';
import { errorHandler } from './middlewares/errorHandler';
import { createHealthRoutes } from './routes/healthRoutes';

export class Server {
  private app: Application;

  constructor(private readonly logger: Logger) {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
  }

  private setupMiddlewares(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    });
    this.app.use(limiter);
  }

  private setupRoutes(): void {
    this.app.use(createHealthRoutes());
  }

  public getApp(): Application {
    return this.app;
  }

  public setupErrorHandler(): void {
    this.app.use(errorHandler(this.logger));
  }

  public async start(port: number): Promise<void> {
    return new Promise((resolve) => {
      this.app.listen(port, () => {
        this.logger.info(`Server running on port ${port}`);
        resolve();
      });
    });
  }
}
