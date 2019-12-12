import { auth, Messenger } from "@sotah-inc/server";
import { wrap } from "async-middleware";
import { Request, Response, Router } from "express";
import { Connection } from "typeorm";

import { handle } from "../../controllers";
import { PricelistCrudController } from "../../controllers/user/pricelist-crud";

export const getRouter = (dbConn: Connection, messenger: Messenger): Router => {
  const router = Router();
  const controller = new PricelistCrudController(dbConn, messenger);

  router.post(
    "/",
    auth,
    wrap(async (req: Request, res: Response) => {
      await handle(controller.createPricelist, req, res);
    }),
  );

  router.get(
    "/",
    auth,
    wrap(async (req: Request, res: Response) => {
      await handle(controller.getPricelists, req, res);
    }),
  );

  router.get(
    "/:id",
    auth,
    wrap(async (req: Request, res: Response) => {
      await handle(controller.getPricelist, req, res);
    }),
  );

  router.get(
    "/:profession/:expansion/:pricelist_slug",
    auth,
    wrap(async (req: Request, res: Response) => {
      await handle(controller.getPricelistFromSlug, req, res);
    }),
  );

  router.put(
    "/:id",
    auth,
    wrap(async (req: Request, res: Response) => {
      await handle(controller.updatePricelist, req, res);
    }),
  );

  router.delete(
    "/:id",
    auth,
    wrap(async (req: Request, res: Response) => {
      await handle(controller.deletePricelist, req, res);
    }),
  );

  return router;
};
