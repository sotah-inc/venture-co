import { auth } from "@sotah-inc/server";
import { wrap } from "async-middleware";
import { Request, Response, Router } from "express";
import { Connection } from "typeorm";

import { handle } from "../../controllers";
import { ProfileController } from "../../controllers/user/profile";

export const getRouter = (dbConn: Connection): Router => {
  const router = Router();
  const controller = new ProfileController(dbConn);

  router.put(
    "/",
    auth,
    wrap(async (req: Request, res: Response) => {
      await handle(controller.updateProfile.bind(controller), req, res);
    }),
  );

  return router;
};
