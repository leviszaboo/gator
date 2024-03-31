import mqConnection from "./utils/rabbitMqConnection";

const shutdownSignals: NodeJS.Signals[] = ["SIGINT", "SIGTERM", "SIGQUIT"];

const handleIncoming = (msg: string) => {
  try {
    const parsedMessage = JSON.parse(msg);

    console.log(`Received Notification`, parsedMessage);

    // Implement your own notification flow
  } catch (error) {
    console.error(`Error While Parsing the message`);
  }
};

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
