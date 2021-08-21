import { auth, IMessengers } from "@sotah-inc/server";
import { wrap } from "async-middleware";
import { Request, Response, Router } from "express";
import { Connection } from "typeorm";

import { handleResult } from "../../../controllers";
import { PricelistCrudController } from "../../../controllers/user/pricelist-crud";

export function getRouter(dbConn: Connection, messengers: IMessengers): Router {
  const router = Router();
  const controller = new PricelistCrudController(dbConn, messengers);

  router.post(
    "/",
    auth(dbConn),
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await controller.createPricelist(req, res)),
    ),
  );

  router.get(
    "/",
    auth(dbConn),
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await controller.getPricelists(req, res)),
    ),
  );

  router.get(
    "/:id([0-9]+)",
    auth(dbConn),
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await controller.getPricelist(req, res)),
    ),
  );

  router.get(
    "/:pricelist_slug",
    auth(dbConn),
    wrap(async (req: Request, res: Response) =>
      handleResult(
        res,
        await controller.getPricelistFromSlug(req, res),
      ),
    ),
  );

  router.put(
    "/:id",
    auth(dbConn),
    wrap(async (req: Request, res: Response) =>
      handleResult(
        res,
        await controller.updatePricelist(req, res),
      ),
    ),
  );

  router.delete(
    "/:id",
    auth(dbConn),
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await controller.deletePricelist(req, res)),
    ),
  );

  return router;
}
