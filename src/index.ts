import { Server } from './shared/infrastructure/http/Server';
import { WinstonLogger } from './shared/infrastructure/logger/WinstonLogger';
import { env } from './shared/infrastructure/config/env';

async function main(): Promise<void> {
  const logger = new WinstonLogger();

  try {
    const server = new Server(logger);
    server.setupErrorHandler();

    await server.start(env.port);
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
