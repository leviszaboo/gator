import "dotenv/config";

export default {
  PORT: process.env.PORT || 3001,
  RMQ_URL: process.env.RMQ_URL,
  INITIALIZER_QUEUE: process.env.INITIALIZER_QUEUE,
};
