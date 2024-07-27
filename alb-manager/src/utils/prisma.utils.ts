import { prisma } from "../db/prisma";
import {
  AppModel,
  PrismaAppWhereInput,
  PrismaUpdateAppInput,
} from "../types/prisma.types";

export const prismaGetAppsWhere = async (
  input: PrismaAppWhereInput,
): Promise<AppModel[]> => {
  return await prisma.apps.findMany({
    where: {
      ...input,
    },
  });
};

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
