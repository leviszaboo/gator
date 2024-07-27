import {
  AppModel,
  PrismaAppWhereInput,
  PrismaUpdateAppInput,
} from "./prisma.types";
import { KeysToCamelCase } from "./types";

export type AppWhereInput = KeysToCamelCase<PrismaAppWhereInput>;
export type UpdateAppInput = KeysToCamelCase<PrismaUpdateAppInput>;

export type App = KeysToCamelCase<AppModel>;
