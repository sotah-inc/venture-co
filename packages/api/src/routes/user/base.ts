import { auth, User } from "@sotah-inc/server";
import { wrap } from "async-middleware";
import { Request, Response, Router } from "express";
import { Connection } from "typeorm";

export function getRouter(dbConn: Connection): Router {
  const router = Router();

  router.get(
    "/",
    auth(dbConn),
    wrap(async (req: Request, res: Response) => {
      res.json((req.user as User).toJson());
    }),
  );

  return router;
}
