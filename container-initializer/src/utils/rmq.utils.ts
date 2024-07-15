import client, { Connection, Channel } from "amqplib";
import logger from "./logger";
import { HandlerCB, StatusMessage } from "../types/rmq.types";
import { Config } from "./options";
import { InitializerMessageSchema } from "../schema/initializerMessage.schema";
import { publishContainer } from "./publishContainer";

const { RMQ_URL, INITIALIZER_QUEUE, STATUS_QUEUE } = Config;

class RabbitMQConnection {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private connected: boolean = false;
  private disconnecting: boolean = false;

  async connect(retryCount = 5, initialRetryDelay = 1000) {
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
      `Failed to connect to RabbitMQ Server after ${retryCount} attempts`,
    );
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

  async publishToStatusQueue(message: StatusMessage) {
    if (!this.channel) {
      logger.error("Channel is not available.");
      return;
    }

    await this.channel.assertQueue(STATUS_QUEUE, {
      durable: true,
    });

    const messageBuffer = Buffer.from(JSON.stringify(message));

    this.channel.sendToQueue(STATUS_QUEUE, messageBuffer, {
      persistent: true,
    });
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

export const handleIncoming = (message: Buffer) => {
  const messageObject = JSON.parse(message.toString());

  const validMessage = InitializerMessageSchema.parse(messageObject);

  if (validMessage) {
    logger.info(`Received Instruction`, validMessage);

    publishContainer(validMessage);
  } else {
    return logger.error(`Invalid Message Received`);
  }
};

const mqConnection = new RabbitMQConnection();

export default mqConnection;
