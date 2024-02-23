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

export default function routes(app: Express) {
  /**
   * @route GET /healthcheck
   * @desc Healthcheck endpoint
   * @access Public
   */
  app.get("/healthcheck", (_req: Request, res: Response) =>
    res.sendStatus(200)
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
   * @route GET api/v1/test-auth
   * @desc Tests authentication functionality
   * @access Private
   */
  app.get(
    "/api/v1/test-auth", 
    requireUser, 
    (_req: Request, res: Response) => res.sendStatus(200)
  );
}
