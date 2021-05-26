import config from 'config';
import './util/moduleAlias';
import logger from '@src/loaders/logger';
import SetupServer from '@src/server';

enum ExitStatus {
  Failure = 1,
  Success = 0,
}

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`App exiting due to an unhandled promise: ${promise} and reason: ${reason}`);
  // lets throw the error and let the uncaughtException handle below handle it
  throw reason;
});

process.on('uncaughtException', error => {
  logger.error(`App exiting due to an uncaught exception: ${error}`);
  process.exit(ExitStatus.Failure);
});

(async (): Promise<void> => {
  try {
    const server = new SetupServer(config.get('App.port'));
    await server.init();
    server.start();

    ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(exitSignal =>
      process.on(exitSignal, async () => {
        logger.info(`ExitSignal invoked: ${exitSignal}`);
        try {
          await server.close();
          logger.info(`App exited with success`);
          process.exit(ExitStatus.Success);
        } catch (error) {
          logger.error(`App exited with error: ${error}`);
          process.exit(ExitStatus.Failure);
        }
      })
    );
  } catch (error) {
    logger.error(`App exited with error: ${error}`);
    process.exit(ExitStatus.Failure);
  }
})();
