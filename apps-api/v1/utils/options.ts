import config from "config";

export enum Models {
  APPS = "apps",
}

export enum PrismaErrorCodes {
  UNIQUE_CONSTRAINT_FAILED = "P2002",
  RECORD_NOT_FOUND = "P2025",
}

export enum Endpoints {
  CREATE_AUTH_APP = "/api/v1/create-auth-app",
  GET_AUTH_APP = "/api/v1/apps/:appId",
}

export const Config = {
  PORT: config.get<number>("PORT"),
  RMQ_URL: config.get<string>("RMQ_URL"),
  INITIALIZER_QUEUE: config.get<string>("INITIALIZER_QUEUE"),
} as const;
