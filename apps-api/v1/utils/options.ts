import config from "config";

export enum Endpoints {
  CREATE_AUTH_APP = "/api/v1/create-auth-app",
}

export const Config = {
  PORT: config.get<number>("PORT"),
  RMQ_URL: config.get<string>("RMQ_URL"),
  INITIALIZER_QUEUE: config.get<string>("INITIALIZER_QUEUE"),
} as const;
