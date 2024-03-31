import { Express } from "express";
import { Endpoints } from "./utils/options";
import { createAuthAppHandler } from "./controller/app.controller";
import validateResource from "./middleware/validateResource";
import { createAppSchema } from "./schema/app.schema";

export default function routes(app: Express) {
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.post(
    Endpoints.CREATE_AUTH_APP,
    validateResource(createAppSchema),
    createAuthAppHandler,
  );
}
