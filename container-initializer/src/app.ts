import mqConnection, { handleIncoming } from "./utils/rmq.utils";

const shutdownSignals: NodeJS.Signals[] = ["SIGINT", "SIGTERM", "SIGQUIT"];

const startService = async () => {
  await mqConnection.connect();

  await mqConnection.consume(handleIncoming);
};

const shutdownService = async () => {
  await mqConnection.close();
};

startService();

shutdownSignals.forEach((signal) => {
  process.on(signal, async () => {
    console.log(`Received ${signal}, shutting down gracefully`);
    await shutdownService();
    process.exit(0);
  });
});
