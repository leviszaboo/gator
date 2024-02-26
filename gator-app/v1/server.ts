import config from "config";
import routes from "./routes";
import logger from "./utils/logger";
import createServer from "./utils/createServer";
import { GracefulShutdownManager } from "@moebius/http-graceful-shutdown";
import { Express } from "express";
import { Server } from "http";
import closeConnection from "./db/cleanup";

const port = config.get<number>("port");

const shutdownSignals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];

function gracefulShutdown(
  server: Server,
  signal: (typeof shutdownSignals)[number],
) {
  const shutdownManager = new GracefulShutdownManager(server);
  logger.info(`Received ${signal}. Starting graceful shutdown.`);
  closeConnection();
  shutdownManager.terminate(() => {
    logger.info("Server is gracefully terminated");
    process.exit(0);
  });
}

async function startServer() {
  const app = createServer();

  const server = app.listen(port, () => {
    logger.info(`App is running on http://localhost:${port}`);
    logger.info(`Initializing MySQL connection...`);
    routes(app);
  });

  shutdownSignals.forEach((signal) => {
    process.on(signal, () => {
      gracefulShutdown(server, signal);
    });
  });
}

startServer();
