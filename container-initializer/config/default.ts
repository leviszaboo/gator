import "dotenv/config";

export default {
  RMQ_URL: process.env.RMQ_URL,
  INITIALIZER_QUEUE: process.env.INITIALIZER_QUEUE,
  STATUS_QUEUE: process.env.STATUS_QUEUE,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  ECS_CLUSTER: process.env.ECS_CLUSTER,
  TASK_DEFINITION: process.env.TASK_DEFINITION,
  CONTAINER_DATABASE_URL: process.env.CONTAINER_DATABASE_URL,
  CONTAINER_POSTGRES_PASSWORD: process.env.CONTAINER_POSTGRES_PASSWORD,
  CONTAINER_BCRYPT_SALT: process.env.CONTAINER_BCRYPT_SALT,
};
