import client, { Connection, Channel } from "amqplib";
import { Config } from "./options";
import logger from "./logger";
import { InitializerMessage } from "../types/rmq.types";

const { RMQ_URL, INITIALIZER_QUEUE } = Config;

class RabbitMQConnection {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private connected: boolean = false;

  private disconnecting: boolean = false;

  async connect(
    retryCount: number = 5,
    initialRetryDelay: number = 1000,
  ): Promise<void> {
    if (this.connected && this.channel) return;

    let attempts = 0;
    let retryDelay = initialRetryDelay;

    while (attempts < retryCount) {
      try {
        logger.info(
          `Attempting to connect to RabbitMQ Server (Attempt ${attempts + 1})`,
        );

        this.connection = await client.connect(RMQ_URL);
        logger.info(`Rabbit MQ Connection is ready`);

        this.channel = await this.connection.createChannel();
        logger.info(`Created RabbitMQ Channel successfully`);

        this.setupEventListeners();

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
          retryDelay *= 2;
        }
      }
    }

    logger.error(
      `Failed to connect to RabbitMQ Server after ${retryCount} attempts. Shutting down...`,
    );
    process.exit(1);
  }

  private setupEventListeners(): void {
    if (!this.connection) {
      throw new Error(
        "Connection is not established, cannot setup event listeners.",
      );
    }

    this.connection.on("close", () => {
      if (this.disconnecting) {
        return;
      }

      logger.warn(
        "RabbitMQ connection closed unexpectedly. Attempting to reconnect...",
      );
      this.connected = false;
      this.connect().catch((err) => logger.error("Reconnection failed", err));
    });

    this.connection.on("error", (error) => {
      logger.error("RabbitMQ connection error:", error);
    });

    if (!this.channel) {
      throw new Error(
        "Channel is not established, cannot setup event listeners.",
      );
    }

    this.channel.on("error", (error) => {
      logger.error("RabbitMQ channel error:", error);
    });

    this.channel.on("close", () => {
      if (this.disconnecting) {
        return;
      }

      logger.warn(
        "RabbitMQ channel closed unexpectedly. Attempting to reconnect...",
      );

      this.connected = false;

      this.connect().catch((err) => logger.error("Reconnection failed", err));
    });
  }

  async sendToQueue<T>(queue: string, message: T): Promise<void> {
    try {
      if (!this.channel) {
        throw new Error("Channel is not initialized.");
      }

      await this.channel.assertQueue(queue, {
        durable: true,
      });

      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        persistent: true,
      });
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async close(): Promise<void> {
    try {
      if (this.disconnecting) {
        return;
      }

      this.disconnecting = true;

      if (this.channel) {
        await this.channel.close();
      }

      if (this.connection) {
        await this.connection.close();
      }

      this.connected = false;
      this.disconnecting = false;
    } catch (error) {
      logger.error(error);
      this.disconnecting = false;

      throw error;
    } finally {
      logger.info("RabbitMQ Connection closed successfully");
    }
  }
}

export const sendInitializerMessage = async (
  message: InitializerMessage,
): Promise<void> => {
  try {
    await mqConnection.sendToQueue(INITIALIZER_QUEUE, message);
  } catch (err) {
    logger.error(err);

    throw err;
  }
};

const mqConnection = new RabbitMQConnection();

export default mqConnection;
