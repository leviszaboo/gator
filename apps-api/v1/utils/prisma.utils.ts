import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";
import { CreateAppInput, FindUniqueAppInput } from "../types/prisma.types";
import { AppModel } from "../types/app.types";

export const prismaCreateApp = async ({
  ...input
}: CreateAppInput): Promise<AppModel> => {
  const app = await prisma.apps.create({
    data: {
      ...input,
    },
  });

  return app;
};

export const getAppByUniqueKey = async (
  input: FindUniqueAppInput,
): Promise<AppModel | null> => {
  return await prisma.apps.findUnique({
    where: {
      ...input,
    },
  });
};
