import { auth } from "@sotah-inc/server";
import { wrap } from "async-middleware";
import { Request, Response, Router } from "express";
import { Connection } from "typeorm";

import { handle } from "../../controllers";
// tslint:disable-next-line:max-line-length
import { ProfessionPricelistsCrudController } from "../../controllers/user/profession-pricelists-crud";

export const getRouter = (dbConn: Connection) => {
  const router = Router();
  const controller = new ProfessionPricelistsCrudController(dbConn);

  router.post(
    "/",
    auth,
    wrap(async (req: Request, res: Response) => {
      await handle(controller.createProfessionPricelist, req, res);
    }),
  );

  router.delete(
    "/:pricelist_id",
    auth,
    wrap(async (req: Request, res: Response) => {
      await handle(controller.deleteProfessionPricelist, req, res);
    }),
  );

  return router;
};
