import { IMessengers } from "@sotah-inc/server";
import { wrap } from "async-middleware";
import { Request, Response, Router } from "express";
import { Connection } from "typeorm";

import { handleResult } from "../controllers";
import { UserController } from "../controllers/user";
import { getRouter as getBaseRouter } from "./user/base";
import { getRouter as getPostsRouter } from "./user/posts-crud";
import { getRouter as getPreferencesRouter } from "./user/preferences";
import { getRouter as getPricelistsCrudRouter } from "./user/pricelists-crud";
import { getRouter as getProfessionPricelistsCrudRouter } from "./user/profession-pricelists-crud";
import { getRouter as getProfileRouter } from "./user/profile";

export function getRouter(dbConn: Connection, messengers: IMessengers): Router {
  const router = Router();
  const controller = new UserController(dbConn);

  router.use("/user/posts", getPostsRouter(dbConn));
  router.use("/user/preferences", getPreferencesRouter(dbConn));
  router.use("/user/pricelists", getPricelistsCrudRouter(dbConn, messengers));
  router.use("/user/profession-pricelists", getProfessionPricelistsCrudRouter(dbConn));
  router.use("/user/profile", getProfileRouter(dbConn));
  router.use("/user", getBaseRouter(dbConn));

  router.post(
    "/users",
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await controller.createUser(req, res)),
    ),
  );

  return router;
}
