import { StatusMessage } from "../types/rmq.types";
import { updateAppField } from "../utils/prisma.utils";
import logger from "../utils/logger";
import { UpdateAppInput } from "../types/app.types";

export const updateApp = async (input: UpdateAppInput): Promise<void> => {
  const { appId, status, url, taskId, apiKey } = input;

  try {
    const app = await updateAppField(appId as string, {
      status: status,
      url: url,
      task_id: taskId,
      api_key: apiKey,
    });

    logger.info(`App updated with ID: ${app.app_id}`);
  } catch (err: any) {
    logger.error(`Error updating app with ID: ${appId}. Error: ${err.message}`);
  }
};
