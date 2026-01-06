import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { Logger } from '../logger/Logger';
import { errorHandler } from './middlewares/errorHandler';
import { createHealthRoutes } from './routes/healthRoutes';
import { createJokesRoutes } from './routes/jokesRoutes';
import { swaggerSpec } from './swagger.config';

export class Server {
  private app: Application;

  constructor(private readonly logger: Logger) {
    this.app = express();
    this.setupMiddlewares();
    this.setupSwagger();
    this.setupRoutes();
    this.setupErrorHandler();
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

  private setupSwagger(): void {
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    this.app.get('/api-docs/swagger.json', (_req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });
  }

  private setupRoutes(): void {
    this.app.use(createHealthRoutes());
    this.app.use('/api/v1/jokes', createJokesRoutes());
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
