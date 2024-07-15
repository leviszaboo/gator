import { InitializerMessage } from "../types/rmq.types";
import ecsClient from "../aws/ecsClient";
import generateInitializerTaskCommand from "../aws/initializerTaskCommand";

export const publishContainer = ({
  userId,
  appName,
  appId,
}: InitializerMessage) => {
  console.log(`Publishing container for ${userId}, ${appName}, ${appId}`);

  const command = generateInitializerTaskCommand({ userId, appName, appId });

  try {
    const result = ecsClient.send(command);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};
