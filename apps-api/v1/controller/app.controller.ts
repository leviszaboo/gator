import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { sendInitializerMessage } from "../utils/rmq.utils";
import { CreateAppInput } from "../schema/app.schema";
import { createApp } from "../service/app.service";
import asyncHandler from "express-async-handler";
import { InitializerMessage } from "../types/rmq.types";

export const createAuthAppHandler = asyncHandler(
  async (req: Request<{}, {}, CreateAppInput["body"]>, res: Response) => {
    const { userId, appName } = req.body;
    const appId = uuidv4();

    // Send message to RabbitMQ
    const initializerMessage: InitializerMessage = { userId, appId, appName };
    await sendInitializerMessage(initializerMessage);

    const app = await createApp({
      userId,
      appName,
      appId,
    });

    res.status(201).send(app);
  },
);
