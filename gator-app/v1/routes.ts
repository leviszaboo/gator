import { Express, Request, Response } from "express";
import {
  createUserHandler,
  getUserByIdHandler,
  loginUserHandler,
} from "./controller/user.controller";
import {
  createUserSchema,
  getUserByIdSchema,
  loginUserSchema,
} from "./schema/user.schema";
import {
  invalidateTokenHandler,
  reissueAccessTokenHandler,
} from "./controller/token.controller";
import validateResource from "./middleware/validateResource";
import logger from "./utils/logger";
import {
  invalidateTokenSchema,
  reissueTokenSchema,
} from "./schema/token.schema";

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
   *      401:
   *        description: Unauthorized
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
   *      404:
   *        description: Not found
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
   *      401:
   *        description: Unauthorized
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
   * '/api/tokens/reissue-token':
   *  get:
   *    tags:
   *      - Tokens
   *    summary: Reissue a JWT accesstoken.
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/ReissueTokenInput'
   *    responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/ReissueTokenResponse'
   *      401:
   *        description: Unauthorized
   *      404:
   *        description: Not found
   *      400:
   *        description: Bad request
   *      500:
   *       description: Internal server error
   */
  app.post(
    "/api/v1/tokens/reissue-token",
    validateResource(reissueTokenSchema),
    reissueAccessTokenHandler,
  );

  /**
   * @openapi
   * '/api/tokens/invalidate-token':
   *  post:
   *     tags:
   *     - Tokens
   *     summary: Invalidate a token
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/InvalidateTokenInput'
   *     responses:
   *       204:
   *         description: Success
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Internal server error
   */
  app.post(
    "/api/v1/tokens/invalidate-token",
    validateResource(invalidateTokenSchema),
    invalidateTokenHandler,
  );
}
