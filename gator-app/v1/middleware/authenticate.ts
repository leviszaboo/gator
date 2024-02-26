import config from "config";
import { NextFunction, Request, Response } from "express";

export default function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const apiKey = req.headers["x-api-key"];
  const appId = req.headers["x-app-id"];

  if (!apiKey) {
    return res.status(401).send("Missing API Key.");
  }

  if (!appId) {
    return res.status(401).send("Missing App ID.");
  }

  if (apiKey !== config.get("API_KEY") || appId !== config.get("APP_ID")) {
    return res.status(401).send("Provided API Key or App ID is invalid.");
  }

  return next();
}
