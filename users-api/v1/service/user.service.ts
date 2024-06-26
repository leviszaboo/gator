import { ResultSetHeader } from "mysql2";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { UserInput, User } from "../models/user.model";
import pool from "../db/connect";
import { signJwt, verifyJwt } from "../utils/jwt.utils";
import UserNotFoundError from "../errors/user/UserNotFoundError";
import config from "config";
import IncorrectPasswordError from "../errors/user/IncorrectPasswordError";
import EmailExistsError from "../errors/user/EmailExistsError";
import logger from "../utils/logger";

export async function getUserById(id: string) {
  try {
    const [user] = await pool.query<User[]>(
      "SELECT * FROM users WHERE user_id = ?",
      [id],
    );

    if (!user[0]) {
      throw new UserNotFoundError("User not found with the provided user ID.");
    }

    return { user_id: user[0].user_id, email: user[0].email };
  } catch (err: any) {
    throw err;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const [user] = await pool.query<User[]>(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );

    return user[0];
  } catch (err: any) {
    throw err;
  }
}

interface AuthResponse {
  user: {
    userId: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
}

export async function loginUser(input: UserInput): Promise<AuthResponse> {
  try {
    const user = await getUserByEmail(input.email);

    if (!user) {
      throw new UserNotFoundError(
        "User not found with the provided email address.",
      );
    }

    const passwordMatch = await bcrypt.compare(
      input.password,
      user.password_hash,
    );

    if (!passwordMatch) {
      throw new IncorrectPasswordError(
        "Incorrect password for the provided email address.",
      );
    }

    const token = signJwt(
      {
        userId: user.user_id,
        email: user.email,
      },
      "access",
      {
        expiresIn: config.get<string>("JWT.accessTokenExpiresIn"),
      },
    );

    const refreshToken = signJwt({ userId: user.user_id }, "refresh", {
      expiresIn: config.get<string>("JWT.refreshTokenExpiresIn"),
    });

    return {
      user: {
        userId: user.user_id,
        email: user.email,
      },
      accessToken: token,
      refreshToken: refreshToken,
    };
  } catch (err: any) {
    throw err;
  }
}

export async function createUser(input: UserInput) {
  try {
    const existingUser = await getUserByEmail(input.email);

    if (existingUser) {
      throw new EmailExistsError(
        "A user account with the provided email address already exists.",
      );
    }

    const userId = uuidv4();
    const passwordHash = await bcrypt.hash(input.password, 10);

    const [userInsertResult] = await pool.query<ResultSetHeader>(
      `INSERT INTO users (
                user_id,
                email,
                password_hash
            )
            VALUES (?, ?, ?)`,
      [userId, input.email, passwordHash],
    );

    if (userInsertResult.affectedRows === 1) {
      const newlyCreatedUser = await getUserByEmail(input.email);

      if (newlyCreatedUser) {
        return {
          user_id: newlyCreatedUser.user_id,
          email: newlyCreatedUser.email,
        };
      } else {
        throw new Error("Failed to retrieve the user.");
      }
    } else {
      throw new Error("Failed to insert the user.");
    }
  } catch (err: any) {
    throw err;
  }
}

export async function reissueAccessToken(refreshToken: string) {
  const { decoded } = await verifyJwt(refreshToken, "refresh");

  if (!decoded)
    return {
      newAccessToken: null,
      newRefreshToken: null,
    };

  const user = await getUserById(decoded.userId);

  if (!user)
    return {
      newAccessToken: null,
      newRefreshToken: null,
    };

  const newRefreshToken = signJwt({ userId: user.user_id }, "refresh", {
    expiresIn: "1d",
  });

  const newAccessToken = signJwt(
    { userId: user.user_id, email: user.email },
    "access",
    {
      expiresIn: "5m",
    },
  );

  logger.info(`Reissued access token for user ${user.user_id}`);

  return {
    newAccessToken: newAccessToken,
    newRefreshToken: newRefreshToken,
  };
}
