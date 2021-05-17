import { auth, User } from "@sotah-inc/server";
import { wrap } from "async-middleware";
import { Request, Response, Router } from "express";
import { Connection } from "typeorm";

import { handleResult } from "../../controllers";
import { UserController } from "../../controllers/user";

export function getRouter(dbConn: Connection): Router {
  const router = Router();
  const controller = new UserController(dbConn);

  router.get(
    "/",
    auth(dbConn),
    wrap(async (req: Request, res: Response) => {
      res.json((req.user as User).toJson());
    }),
  );

  router.post(
    "/verify",
    auth(dbConn),
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await controller.verifyUser(req, res)),
    ),
  );

  router.post(
    "/verify-confirm",
    auth(dbConn),
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await controller.verifyUserConfirm(req, res)),
    ),
  );

  return router;
}
