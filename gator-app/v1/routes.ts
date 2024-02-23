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
   * @route GET /ping
   * @desc Healthcheck endpoint
   * @access Public
   */
  app.get(
    "/api/v1/ping", 
    (_req: Request, res: Response) => {
      logger.info("pong");
      res.status(200).send("pong");
    }
  );

  /**
   * @route POST api/v1/users/register
   * @desc Registers a user
   * @access Public
   */
  app.post(
    "/api/v1/users/register",
    validateResource(createUserSchema),
    createUserHandler
  );

  /**
   * @route POST api/v1/users/login
   * @desc Registers a user
   * @access Public
   */
  app.post(
    "/api/v1/users/login",
    validateResource(loginUserSchema),
    loginUserHandler
  );

  /**
   * @route GET api/v1/users/:user_id
   * @desc Gets user by unique id
   * @access Public
   */
  app.get(
    "/api/v1/users/:user_id",
    validateResource(getUserByIdSchema),
    getUserByIdHandler
  );

  /**
   * @route POST api/v1/users/logout
   * @desc Logs out a user
   * @access Private
   */
  app.post(
    "/api/v1/users/logout", 
    requireUser, 
    logOutUserHandler
  );

  /**
   * @route PUT api/v1/users/:user_id/update-email
   * @desc Updates a user's email
   * @access Private
   */
  app.put(
    "/api/v1/users/:user_id/update-email"
  )
  
  /**
   * @route PUT api/v1/users/:user_id/reset-password
   * @desc Resets a user's password
   * @access Private
   */
  app.put(
    "/api/v1/users/:user_id/reset-password"
  )

  /**
   * @route GET api/v1/users/:user_id/verify-email
   * @desc Verifies a user's email
   * @access Private
   */
  app.get(
    "/api/v1/users/:user_id/verify-email"
  )

  /**
   * @route DELETE api/v1/users/:user_id
   * @desc Deletes a user
   * @access Private
   */
  app.delete(
    "/api/v1/users/:user_id"
  );

  /**
   * @route GET api/v1/test-auth
   * @desc Tests authentication functionality
   * @access Private
   */
  app.get(
    "/api/v1/test-auth", 
    requireUser, 
    (_req: Request, res: Response) =>
      res.sendStatus(200)
  );
}
