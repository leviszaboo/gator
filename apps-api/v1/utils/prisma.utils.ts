import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";
import { CreateAppInput } from "../types/prisma.types";
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
