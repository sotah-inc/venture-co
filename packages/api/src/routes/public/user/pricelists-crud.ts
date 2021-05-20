import { auth, IMessengers, User } from "@sotah-inc/server";
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
      handleResult(res, await controller.createPricelist(req.user as User, req.body)),
    ),
  );

  router.get(
    "/",
    auth(dbConn),
    wrap(async (req: Request, res: Response) =>
      handleResult(
        res,
        await controller.getPricelists(req.user as User, String(req.query.locale)),
      ),
    ),
  );

  router.get(
    "/:id([0-9]+)",
    auth(dbConn),
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await controller.getPricelist(Number(req.params.id), req.user as User)),
    ),
  );

  router.get(
    "/:pricelist_slug",
    auth(dbConn),
    wrap(async (req: Request, res: Response) =>
      handleResult(
        res,
        await controller.getPricelistFromSlug(req.user as User, req.params.pricelist_slug),
      ),
    ),
  );

  router.put(
    "/:id",
    auth(dbConn),
    wrap(async (req: Request, res: Response) =>
      handleResult(
        res,
        await controller.updatePricelist(Number(req.params.id), req.user as User, req.body),
      ),
    ),
  );

  router.delete(
    "/:id",
    auth(dbConn),
    wrap(async (req: Request, res: Response) =>
      handleResult(
        res,
        await controller.deletePricelist(Number(req.params.id), req.user as User),
      ),
    ),
  );

  return router;
}
