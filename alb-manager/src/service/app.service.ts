import { prismaGetAppsWhere, updateAppField } from "../utils/prisma.utils";
import logger from "../utils/logger";
import { App, UpdateAppInput } from "../types/app.types";
import { snakeToCamelCase } from "./helpers/snakeToCamelCase";

export const getAppsByStatus = async (status: string): Promise<App[]> => {
  try {
    const apps = await prismaGetAppsWhere({
      status,
    });

    return apps.map((app) => snakeToCamelCase(app));
  } catch (err: any) {
    throw new Error(`Error fetching apps. Error: ${err}`);
  }
};

export const updateApp = async (input: UpdateAppInput): Promise<void> => {
  const { appId, status, url } = input;

  try {
    const app = await updateAppField(appId as string, {
      status: status,
      url: url,
    });

    logger.info(`App updated with ID: ${app.app_id}`);
  } catch (err: any) {
    logger.error(`Error updating app with ID: ${appId}. Error: ${err.message}`);
  }
};
