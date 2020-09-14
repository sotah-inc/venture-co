import { auth, Messenger, User } from "@sotah-inc/server";
import { wrap } from "async-middleware";
import { Request, Response, Router } from "express";
import { Connection } from "typeorm";

import { handleResult } from "../../controllers";
import { PricelistCrudController } from "../../controllers/user/pricelist-crud";

export const getRouter = (dbConn: Connection, messenger: Messenger): Router => {
  const router = Router();
  const controller = new PricelistCrudController(dbConn, messenger);

  router.post(
    "/",
    auth,
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await controller.createPricelist(req.user as User, req.body)),
    ),
  );

  router.get(
    "/",
    auth,
    wrap(async (req: Request, res: Response) =>
      handleResult(
        res,
        await controller.getPricelists(req.user as User, String(req.query["locale"])),
      ),
    ),
  );

  router.get(
    "/:id([0-9]+)",
    auth,
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await controller.getPricelist(Number(req.params["id"]), req.user as User)),
    ),
  );

  router.get(
    "/:pricelist_slug",
    auth,
    wrap(async (req: Request, res: Response) =>
      handleResult(
        res,
        await controller.getPricelistFromSlug(req.user as User, req.params["pricelist_slug"]),
      ),
    ),
  );

  router.put(
    "/:id",
    auth,
    wrap(async (req: Request, res: Response) =>
      handleResult(
        res,
        await controller.updatePricelist(Number(req.params["id"]), req.user as User, req.body),
      ),
    ),
  );

  router.delete(
    "/:id",
    auth,
    wrap(async (req: Request, res: Response) =>
      handleResult(
        res,
        await controller.deletePricelist(Number(req.params["id"]), req.user as User),
      ),
    ),
  );

  return router;
};
