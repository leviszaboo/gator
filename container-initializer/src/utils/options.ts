import config from "config";

export enum Models {
  APPS = "apps",
}

export const Config = {
  RMQ_URL: config.get<string>("RMQ_URL"),
  INITIALIZER_QUEUE: config.get<string>("INITIALIZER_QUEUE"),
  STATUS_QUEUE: config.get<string>("STATUS_QUEUE"),
  AWS_ACCESS_KEY: config.get<string>("AWS_ACCESS_KEY"),
  AWS_SECRET_ACCESS_KEY: config.get<string>("AWS_SECRET_ACCESS_KEY"),
  ECS_CLUSTER: config.get<string>("ECS_CLUSTER"),
  TASK_DEFINITION: config.get<string>("TASK_DEFINITION"),
  CONTAINER_DATABASE_URL: config.get<string>("CONTAINER_DATABASE_URL"),
  CONTAINER_POSTGRES_PASSWORD: config.get<string>(
    "CONTAINER_POSTGRES_PASSWORD",
  ),
  CONTAINER_BCRYPT_SALT: config.get<string>("CONTAINER_BCRYPT_SALT"),
} as const;
