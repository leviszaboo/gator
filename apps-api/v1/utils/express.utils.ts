import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "../routes";
import { GracefulShutdownManager } from "@moebius/http-graceful-shutdown";
import { Server } from "http";
import { exit } from "process";
import logger from "./logger";
import { errorHandler } from "../middleware/errorHandler";
import mqConnection from "./rmq.utils";

export const shutdownSignals: NodeJS.Signals[] = [
  "SIGINT",
  "SIGTERM",
  "SIGHUP",
];

export const createServer = () => {
  const app = express();

  app.enable("trust proxy");

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  routes(app);

  app.use(errorHandler);

  return app;
};

export const gracefulShutdown = (
  server: Server,
  signal: (typeof shutdownSignals)[number],
) => {
  const shutdownManager = new GracefulShutdownManager(server);
  logger.info(`Received ${signal}. Starting graceful shutdown.`);

  mqConnection.close();

  shutdownManager.terminate(() => {
    logger.info("Server is gracefully terminated");
    exit(0);
  });
};
