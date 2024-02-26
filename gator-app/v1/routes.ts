import { Express, Request, Response } from "express";
import {
  createUserHandler,
  getUserByIdHandler,
  logOutUserHandler,
  loginUserHandler,
} from "./controller/user.controller";
import {
  createUserSchema,
  getUserByIdSchema,
  loginUserSchema,
} from "./schema/user.schema";
import validateResource from "./middleware/validateResource";
import requireUser from "./middleware/requireUser";
import logger from "./utils/logger";

export default function routes(app: Express) {
  /**
   * @openapi
   * /api/v1/ping:
   *   get:
   *     tag:
   *       - "ping"
   *     description: Returns pong if the server is running
   *     responses:
   *       200:
   *        description: server is running
   */
  app.get("/api/v1/ping", (_req: Request, res: Response) => {
    logger.info("pong");
    res.status(200).send("pong");
  });

  /**
   * @openapi
   * '/api/users/register':
   *  post:
   *     tags:
   *     - User
   *     summary: Register a user
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/CreateUserInput'
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/CreateUserResponse'
   *      409:
   *        description: Conflict
   *      400:
   *        description: Bad request
   *      500:
   *       description: Internal server error
   */
  app.post(
    "/api/v1/users/register",
    validateResource(createUserSchema),
    createUserHandler,
  );

  /**
   * @openapi
   * '/api/users/login':
   *  post:
   *     tags:
   *     - User
   *     summary: Login a user
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/LoginUserInput'
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/LoginUserResponse'
   *      401:
   *        description: Unauthorized
   *      400:
   *        description: Bad request
   *      500:
   *       description: Internal server error
   */
  app.post(
    "/api/v1/users/login",
    validateResource(loginUserSchema),
    loginUserHandler,
  );

  /**
   * @openapi
   * '/api/users/{user_id}':
   *  get:
   *     tags:
   *     - User
   *     summary: Get a user by ID
   *     parameters:
   *     - in: path
   *       name: user_id
   *       required: true
   *       schema:
   *         type: string
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/GetUserByIdResponse'
   *      404:
   *        description: Not found
   *      400:
   *        description: Bad request
   *      500:
   *       description: Internal server error
   */
  app.get(
    "/api/v1/users/:user_id",
    validateResource(getUserByIdSchema),
    getUserByIdHandler,
  );

  app.put("/api/v1/users/:user_id/update-email");

  app.put("/api/v1/users/:user_id/reset-password");

  app.get("/api/v1/users/:user_id/verify-email");

  app.delete("/api/v1/users/:user_id");

  /**
   * @openapi
   * '/api/tokens/invalidate-token':
   *  post:
   *     tags:
   *     - Tokens
   *     summary: Invalidate a token
   *     responses:
   *      200:
   *        description: Success
   *      500:
   *       description: Internal server error
   */
  app.post("/api/v1/tokens/invalidate-token", requireUser, logOutUserHandler);
}
