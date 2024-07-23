import { PrismaUpdateAppInput } from "./prisma.types";
import { KeysToCamelCase } from "./types";

export type UpdateAppInput = KeysToCamelCase<PrismaUpdateAppInput>;
