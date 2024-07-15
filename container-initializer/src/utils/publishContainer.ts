import { InitializerMessage } from "../types/rmq.types";
import ecsClient from "../aws/ecsClient";
import generateInitializerTaskCommand from "../aws/initializerTaskCommand";
import mqConnection from "./rmq.utils";
import logger from "./logger";

export const publishContainer = async ({
  userId,
  appName,
  appId,
}: InitializerMessage) => {
  const { apiKey, command } = generateInitializerTaskCommand({
    userId,
    appName,
    appId,
  });

  ecsClient.send(command);

  mqConnection.publishToStatusQueue({
    userId,
    apiKey,
    appName,
    appId,
    status: "PENDING",
  });

  logger.info(
    `Container published for userId: ${userId}, appName: ${appName}, appId: ${appId}`,
  );
};
