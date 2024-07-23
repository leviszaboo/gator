import { Models } from "../utils/options";
import { PrismaModels } from "./prisma.types";
import { KeysToCamelCase } from "./types";

export type AppModel = PrismaModels[Models.APPS];

export type App = KeysToCamelCase<AppModel>;
