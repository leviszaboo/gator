import "dotenv/config";

export default {
  RMQ_URL: process.env.RMQ_URL,
  INITIALIZER_QUEUE: process.env.INITIALIZER_QUEUE,
};
