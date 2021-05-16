import { NextFunction, Request, Response } from "express";
import HttpStatus from "http-status";
import { Connection } from "typeorm";

import { User } from "../../db";
import { verifyIdToken, VerifyIdTokenCode } from "./verify-id-token";

export * from "./verify-id-token";

export function auth(dbConn: Connection) {
  return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    const authToken = req.headers.authorization;
    if (authToken === undefined) {
      res.status(HttpStatus.FORBIDDEN).send({
        error: "auth required",
      });

      return;
    }

    const foundToken = authToken.split(" ")[1];
    if (foundToken === undefined || foundToken.length === 0) {
      res.status(HttpStatus.FORBIDDEN).send({
        error: "auth invalid",
      });

      return;
    }

    const verifyIdTokenResult = await verifyIdToken(foundToken);

    switch (verifyIdTokenResult.code) {
    case VerifyIdTokenCode.NotFound:
      res.status(HttpStatus.NOT_FOUND).send({
        error: "user not found",
      });

      return;
    case VerifyIdTokenCode.Error:
      console.error("could not verify id-token", { verifyIdTokenResult });

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        error: "unknown error",
      });

      return;
    case VerifyIdTokenCode.Ok:
    default:
      break;
    }

    if (verifyIdTokenResult.firebaseUid === null) {
      console.error("firebase-uid was null", { verifyIdTokenResult });

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        error: "uid not provided",
      });

      return;
    }

    const user = await dbConn
      .getRepository(User)
      .findOne({ where: { firebaseUid: verifyIdTokenResult.firebaseUid } });
    if (user === undefined) {
      next();

      return;
    }

    req.user = user;

    next();
  };
}
