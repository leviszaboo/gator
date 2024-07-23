import mqConnection, { handleIncoming } from "./utils/rmq.utils";
import logger from "./utils/logger";
import { Config } from "./utils/options";
import { handleConnection } from "./db/connect";

const shutdownSignals: NodeJS.Signals[] = ["SIGINT", "SIGTERM", "SIGQUIT"];

const startService = async () => {
  await handleConnection();

  await mqConnection.connect();

  await mqConnection.consume(handleIncoming);
};

const shutdownService = async () => {
  await mqConnection.close();
};

startService();

shutdownSignals.forEach((signal) => {
  process.on(signal, async () => {
    logger.info(`Received ${signal}, shutting down gracefully`);
    await shutdownService();
    process.exit(0);
  });
});
