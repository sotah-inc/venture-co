import { auth } from "@sotah-inc/server";
import { wrap } from "async-middleware";
import { Request, Response, Router } from "express";
import { Connection } from "typeorm";

import { handleResult } from "../../../controllers";
import {
  ProfessionPricelistsCrudController,
} from "../../../controllers/user/profession-pricelists-crud";

export function getRouter(dbConn: Connection): Router {
  const router = Router();
  const controller = new ProfessionPricelistsCrudController(dbConn);

  router.post(
    "/",
    auth(dbConn),
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await controller.createProfessionPricelist(req, res)),
    ),
  );

  router.delete(
    "/:pricelist_id",
    auth(dbConn),
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await controller.deleteProfessionPricelist(req, res)),
    ),
  );

  return router;
}
