import client, { Connection, Channel } from "amqplib";
import logger from "./logger";
import { HandlerCB } from "../types/rmq.types";
import { Config } from "./options";
import { InitializerMessageSchema } from "../schema/initializerMessage.schema";

const { RMQ_URL, INITIALIZER_QUEUE } = Config;

class RabbitMQConnection {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private connected: boolean = false;

  async connect(retryCount = 5, retryDelay = 3000) {
    if (this.connected && this.channel) return;

    let attempts = 0;

    while (attempts < retryCount) {
      try {
        logger.info(
          `Attempting to connect to RabbitMQ Server (Attempt ${attempts + 1})`,
        );

        this.connection = await client.connect(RMQ_URL);
        logger.info(`Rabbit MQ Connection is ready`);

        this.channel = await this.connection.createChannel();
        logger.info(`Created RabbitMQ Channel successfully`);

        this.connected = true;
        return;
      } catch (error) {
        logger.error(error);
        logger.error(
          `Attempt ${attempts + 1} failed: Not connected to MQ Server`,
        );

        attempts++;
        if (attempts < retryCount) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }
    }

    logger.error(
      `Failed to connect to RabbitMQ Server after ${retryCount} attempts`,
    );
  }

  async consume(handleIncoming: HandlerCB) {
    if (!this.channel) {
      logger.error("Channel is not available.");
      return;
    }

    await this.channel.assertQueue(INITIALIZER_QUEUE, {
      durable: true,
    });

    this.channel.consume(
      INITIALIZER_QUEUE,
      (message) => {
        {
          if (!message) {
            return logger.error(`Invalid incoming message`);
          }
          handleIncoming(message.content);
          this.channel!.ack(message);
        }
      },
      {
        noAck: false,
      },
    );
  }

  async close(): Promise<void> {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
    this.connected = false;
  }
}

export const handleIncoming = (message: Buffer) => {
  try {
    const messageObject = JSON.parse(message.toString());

    const validMessage = InitializerMessageSchema.parse(messageObject);

    logger.info(`Received Instruction`, validMessage);
  } catch (error) {
    logger.error(`Error While Parsing the message`);
    logger.error(error);
  }
};

const mqConnection = new RabbitMQConnection();

export default mqConnection;
