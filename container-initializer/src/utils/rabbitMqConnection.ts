import client, { Connection, Channel } from "amqplib";
import config from "config";
import logger from "./logger";
import { warn } from "console";

type HandlerCB = (msg: string) => any;

const rmqUrl = config.get<string>("rmqUrl");
const INITIALIZER_QUEUE = config.get<string>("INITIALIZER_QUEUE");

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

        this.connection = await client.connect(rmqUrl);
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

  async consume(handleIncomingNotification: HandlerCB) {
    if (!this.channel) {
      logger.error("Channel is not available.");
      return;
    }

    await this.channel.assertQueue(INITIALIZER_QUEUE, {
      durable: true,
    });

    this.channel.consume(
      INITIALIZER_QUEUE,
      (msg) => {
        {
          if (!msg) {
            return logger.error(`Invalid incoming message`);
          }
          handleIncomingNotification(msg?.content?.toString());
          this.channel!.ack(msg);
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

const mqConnection = new RabbitMQConnection();

export default mqConnection;
