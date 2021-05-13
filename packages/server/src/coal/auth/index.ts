import { NextFunction, Request, Response } from "express";
import HttpStatus from "http-status";
import { Connection } from "typeorm";

import { User } from "../../db";
import { loginUser, LoginUserCode } from "./login-user";

export * from "./login-user";

export function auth(dbConn: Connection) {
  return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    const authToken = req.headers.authorization;
    if (authToken === undefined) {
      res.status(HttpStatus.FORBIDDEN).send({
        error: "auth required",
      });

      return;
    }

    const loginUserResult = await loginUser(authToken.split(" ")[0]);

    switch (loginUserResult.code) {
    case LoginUserCode.NotFound:
      res.status(HttpStatus.NOT_FOUND).send({
        error: "user not found",
      });

      return;
    case LoginUserCode.Error:
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        error: "unknown error",
      });

      return;
    case LoginUserCode.Ok:
    default:
      break;
    }

    const user = await dbConn
      .getRepository(User)
      .findOne({ where: { firebaseUid: loginUserResult.firebaseUid } });
    if (user === undefined) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        error: "token was valid but user not found",
      });

      return;
    }

    req.user = user;

    next();
  };
}
