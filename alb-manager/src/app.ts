import logger from "./utils/logger";
import { handleConnection } from "./db/connect";
import { urlServiceLoop } from "./utils/urlServiceLoop";

const shutdownSignals: NodeJS.Signals[] = ["SIGINT", "SIGTERM", "SIGQUIT"];

const startService = async () => {
  await handleConnection();

  urlServiceLoop();
};

startService();

shutdownSignals.forEach((signal) => {
  process.on(signal, async () => {
    logger.info(`Received ${signal}, shutting down gracefully`);

    process.exit(0);
  });
});
