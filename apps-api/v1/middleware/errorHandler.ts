import { Request, Response, NextFunction } from "express";
import * as Errors from "../errors";

const errorClasses = Object.values(Errors);

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (errorClasses.some((errorClass) => err instanceof errorClass)) {
    const { name, errorCode, message } = err;

    res.status(err.statusCode).send({
      error: {
        name,
        errorCode,
        message,
      },
    });
  }

  res.status(500).send({
    error: {
      message: "An unexpected error occurred. Please try again later.",
    },
  });
};
