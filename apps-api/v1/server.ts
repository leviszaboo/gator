import logger from "./utils/logger";
import {
  createServer,
  gracefulShutdown,
  shutdownSignals,
} from "./utils/express.utils";
import { Config } from "./utils/options";
import mqConnection from "./utils/rmq.utils";

const port = Config.PORT;

export async function startServer() {
  const app = createServer();

  const server = app.listen(port, () => {
    logger.info(`App is running on http://localhost:${port}`);

    mqConnection.connect();
  });

  shutdownSignals.forEach((signal) => {
    process.on(signal, () => {
      gracefulShutdown(server, signal);
    });
  });
}

startServer();
