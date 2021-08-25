import { auth } from "@sotah-inc/server";
import { wrap } from "async-middleware";
import { Request, Response, Router } from "express";
import { Connection } from "typeorm";

import { handleResult } from "../../../controllers";
import { UserController } from "../../../controllers/user";

export function getRouter(dbConn: Connection, clientHost: string): Router {
  const router = Router();
  const controller = new UserController(dbConn, clientHost);

  router.get(
    "/",
    auth(dbConn),
    wrap(async (req: Request, res: Response) => {
      const user = req.sotahUser;
      if (user === undefined) {
        res.json({});

        return;
      }

      res.json(user.toJson());
    }),
  );

  router.post(
    "/verify",
    auth(dbConn),
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await controller.verifyUser(req, res)),
    ),
  );

  return router;
}
