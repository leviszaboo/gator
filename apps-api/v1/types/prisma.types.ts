import type { PrismaClient, Prisma } from "@prisma/client";
import { Models } from "../utils/options";

export type ModelNames = Prisma.ModelName;

export type PrismaModels = {
  [M in ModelNames]: Exclude<
    Awaited<ReturnType<PrismaClient[Uncapitalize<M>]["findUnique"]>>,
    null
  >;
};

export type CreateAppInput = Prisma.appsCreateInput;
export type FindUniqueAppInput = Prisma.appsWhereUniqueInput;
