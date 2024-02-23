import { Request, Response } from "express";
import { createUser, getUserById, loginUser } from "../service/user.service";
import {
  CreateUserInput,
  GetUserByIdInput,
  LoginUserInput,
} from "../schema/user.schema";
import UserNotFoundError from "../errors/user/UserNotFoundError";
import IncorrectPasswordError from "../errors/user/IncorrectPasswordError";
import EmailExistsError from "../errors/user/EmailExistsError";
import { setTokenCookie } from "../utils/jwt.utils";
import { get } from "lodash";
import { blackListToken, checkBlackListedToken } from "../service/blacklist.service";

export async function getUserByIdHandler(
  req: Request<GetUserByIdInput["params"]>,
  res: Response
) {
  try {
    const userId = req.params.user_id;
    const user = await getUserById(userId);

    return res.send(user);
  } catch (err: any) {
    if (err instanceof UserNotFoundError) {
      return res.status(404).send({ ...err, message: err.message });
    }

    return res.status(500).send("Could not retrieve user. Please try again.");
  }
}

export async function loginUserHandler(
  req: Request<{}, {}, LoginUserInput["body"]>,
  res: Response
) {
  try {
    const { user, accessToken, refreshToken } = await loginUser(req.body);

    res.setHeader("Authorization", `Bearer ${accessToken}`);
    setTokenCookie(res, refreshToken, "refresh");

    return res.send({ user, accessToken });
  } catch (err: any) {
    if (err instanceof UserNotFoundError) {
      return res.status(404).send({ ...err, message: err.message });
    }

    if (err instanceof IncorrectPasswordError) {
      return res.status(401).send({ ...err, message: err.message });
    }

    return res.status(500).send("Unable to login. Please try again.");
  }
}

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) {
  try {
    const user = await createUser(req.body);

    return res.send(user);
  } catch (err: any) {
    if (err instanceof EmailExistsError) {
      return res.status(409).send({ ...err, message: err.message });
    }

    return res.status(500).send("Unable to create user. Please try again.");
  }
}

export async function logOutUserHandler(req: Request, res: Response) {
  try {
    const accessToken = get(req, "headers.authorization", "").replace(
      /^Bearer\s/,
      ""
    );

    const refreshToken = req.cookies.refreshToken;

    if (accessToken) {
      await blackListToken(accessToken);
    }

    if (refreshToken) {
      await blackListToken(refreshToken);
    }

    res.setHeader("Authorization", "");
    res.clearCookie("refresh");
    res.sendStatus(204);
  } catch (err: any) {
    return res.status(500).send("Unsuccessful logout. Please try again.");
  }
};
