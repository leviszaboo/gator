import { InitializerMessage, StatusMessage } from "../types/rmq.types";
import { prismaCreateApp, getAppByUniqueKey } from "../utils/prisma.utils";
import logger from "../utils/logger";
import { snakeToCamelCase } from "./helpers/snakeToCamelCase";
import { App } from "../types/app.types";
import { PrismaErrorCodes } from "../utils/options";
import { ConflictError, InternalServerError, NotFoundError } from "../errors";

export const createApp = async (input: InitializerMessage): Promise<App> => {
  const { userId, appName, appId } = input;

  try {
    const app = await prismaCreateApp({
      user_id: userId,
      app_name: appName,
      app_id: appId,
      api_key: "pending",
      status: "pending",
      url: "pending",
      task_id: "pending",
    });

    logger.info(`App created with ID: ${app.app_id}`);

    return snakeToCamelCase(app) as App;
  } catch (err: any) {
    if (err.code === PrismaErrorCodes.UNIQUE_CONSTRAINT_FAILED) {
      logger.error(`App already exists with ID: ${appId}`);

      throw new ConflictError(`App already exists with ID: ${appId}`);
    }

    logger.error(err);

    throw new InternalServerError("An error occurred while creating the app.");
  }
};

export const getApp = async (appId: string): Promise<App> => {
  try {
    const app = await getAppByUniqueKey({
      app_id: appId,
    });

    if (!app) {
      throw new NotFoundError(`App not found with ID: ${appId}`);
    }

    return snakeToCamelCase(app) as App;
  } catch (err: any) {
    logger.error(err);

    throw new InternalServerError("An error occurred while getting the app.");
  }
};
