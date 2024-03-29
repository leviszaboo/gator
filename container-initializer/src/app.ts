import mqConnection from "./utils/rabbitMqConnection";

const handleIncoming = (msg: string) => {
  try {
    const parsedMessage = JSON.parse(msg);

    console.log(`Received Notification`, parsedMessage);

    // Implement your own notification flow
  } catch (error) {
    console.error(`Error While Parsing the message`);
  }
};

const startServer = async () => {
  await mqConnection.connect();

  await mqConnection.consume(handleIncoming);
};

startServer();
