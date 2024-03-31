import config from "config";

export const Config = {
  RMQ_URL: config.get<string>("RMQ_URL"),
  INITIALIZER_QUEUE: config.get<string>("INITIALIZER_QUEUE"),
} as const;
