import { InitializerMessage } from "../types/rmq.types";
import ecsClient from "../aws/ecsClient";
import { generateInitializerTaskCommand } from "./ecs.utils";
import logger from "./logger";
import { RunTaskCommandOutput } from "@aws-sdk/client-ecs";
import { updateApp } from "../service/app.service";

export const publishContainer = async ({
  userId,
  appName,
  appId,
}: InitializerMessage) => {
  const { apiKey, command } = generateInitializerTaskCommand(appId);

  const res: RunTaskCommandOutput = await ecsClient.send(command);

  if (!res.tasks || !res.tasks[0].taskArn) {
    logger.error(
      `Error publishing container for userId: ${userId}, appName: ${appName}, appId: ${appId}`,
    );
    return;
  }

  logger.info(
    `Container published for userId: ${userId}, appName: ${appName}, appId: ${appId}`,
  );

  const taskId = res.tasks[0].taskArn!.split("/").pop();

  await updateApp({
    appId,
    status: "published",
    url: "pending",
    taskId: taskId,
    apiKey,
  });
};
