import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";
import { AppModel, PrismaUpdateAppInput } from "../types/prisma.types";

export const updateAppField = async (
  id: string,
  updateData: PrismaUpdateAppInput,
): Promise<AppModel> => {
  return await prisma.apps.update({
    where: {
      app_id: id,
    },
    data: {
      ...updateData,
    },
  });
};
