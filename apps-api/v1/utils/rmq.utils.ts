import client, { Connection, Channel } from "amqplib";
import { Config } from "./options";
import logger from "./logger";
import { InitializerMessage } from "../types/rmq.types";

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

  async sendToQueue(queue: string, message: any) {
    try {
      if (!this.channel) {
        await this.connect();
      }

      this.channel!.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async close() {
    if (this.channel) {
      await this.channel.close();
    }

    if (this.connection) {
      await this.connection.close();
    }

    this.connected = false;
  }
}

export const sendInitializerMessage = async (message: InitializerMessage) => {
  try {
    await mqConnection.sendToQueue(INITIALIZER_QUEUE, message);
  } catch (err) {
    logger.error(err);

    throw err;
  }
};

const mqConnection = new RabbitMQConnection();

export default mqConnection;
