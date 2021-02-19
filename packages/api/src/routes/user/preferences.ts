import { auth } from "@sotah-inc/server";
import { wrap } from "async-middleware";
import { Request, Response, Router } from "express";
import { Connection } from "typeorm";

import { handleResult } from "../../controllers";
import { PreferencesController } from "../../controllers/user/preferences";

export function getRouter(dbConn: Connection): Router {
  const router = Router();
  const controller = new PreferencesController(dbConn);

  router.get(
    "/",
    auth,
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await controller.getPreferences(req, res)),
    ),
  );

  router.post(
    "/",
    auth,
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await controller.createPreferences(req, res)),
    ),
  );

  router.put(
    "/",
    auth,
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await controller.updatePreferences(req, res)),
    ),
  );

  return router;
}
