import { auth } from "@sotah-inc/server";
import { wrap } from "async-middleware";
import { Request, Response, Router } from "express";
import { Connection } from "typeorm";

import { handleResult } from "../../controllers";
import { ProfileController } from "../../controllers/user/profile";

export function getRouter(dbConn: Connection): Router {
  const router = Router();
  const controller = new ProfileController(dbConn);

  router.put(
    "/",
    auth,
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await controller.updateProfile(req, res)),
    ),
  );

  return router;
}
