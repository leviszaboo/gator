import "dotenv/config";

export default {
  rmqUrl: process.env.RMQ_URL,
  INITIALIZER_QUEUE: process.env.INITIALIZER_QUEUE,
};
