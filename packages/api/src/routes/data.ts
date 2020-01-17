import { Messenger } from "@sotah-inc/server";
import { wrap } from "async-middleware";
import { Request, Response, Router } from "express";
import { Connection } from "typeorm";

import { DataController, handle } from "../controllers";

export const getRouter = (dbConn: Connection, messenger: Messenger): Router => {
  const router = Router();
  const controller = new DataController(messenger, dbConn);

  router.get(
    "/posts",
    wrap(async (req: Request, res: Response) => {
      await handle(controller.getPosts, req, res);
    }),
  );
  router.get(
    "/posts/:post_slug",
    wrap(async (req: Request, res: Response) => {
      await handle(controller.getPost, req, res);
    }),
  );
  router.get(
    "/boot",
    wrap(async (req: Request, res: Response) => {
      await handle(controller.getBoot, req, res);
    }),
  );
  router.get(
    "/region/:regionName/realms",
    wrap(async (req: Request, res: Response) => {
      await handle(controller.getRealms, req, res);
    }),
  );
  router.get(
    "/region/:regionName/token-history",
    wrap(async (req: Request, res: Response) => {
      await handle(controller.getTokenHistory, req, res);
    }),
  );
  router.get(
    "/region/:regionName/realm/:realmSlug/auctions",
    wrap(async (req: Request, res: Response) => {
      await handle(controller.getAuctions, req, res);
    }),
  );
  router.post(
    "/items",
    wrap(async (req: Request, res: Response) => {
      await handle(controller.queryItems, req, res);
    }),
  );
  router.get(
    "/item/:itemId",
    wrap(async (req: Request, res: Response) => {
      await handle(controller.getItem, req, res);
    }),
  );
  router.post(
    "/region/:regionName/realm/:realmSlug/query-auctions",
    wrap(async (req: Request, res: Response) => {
      await handle(controller.queryAuctions, req, res);
    }),
  );
  router.post(
    "/region/:regionName/realm/:realmSlug/price-list",
    wrap(async (req: Request, res: Response) => {
      await handle(controller.getPricelist, req, res);
    }),
  );
  router.post(
    "/region/:regionName/realm/:realmSlug/price-list-history",
    wrap(async (req: Request, res: Response) => {
      await handle(controller.getPricelistHistories, req, res);
    }),
  );
  router.post(
    "/region/:regionName/realm/:realmSlug/unmet-demand",
    wrap(async (req: Request, res: Response) => {
      await handle(controller.getUnmetDemand, req, res);
    }),
  );
  router.get(
    "/profession-pricelists/:profession/:expansion",
    wrap(async (req: Request, res: Response) => {
      await handle(controller.getProfessionPricelists, req, res);
    }),
  );
  router.get(
    "/profession-pricelists/:profession/:expansion/:pricelist_slug",
    wrap(async (req: Request, res: Response) => {
      await handle(controller.getProfessionPricelist, req, res);
    }),
  );

  return router;
};
