import { Messenger } from "@sotah-inc/server";
import { wrap } from "async-middleware";
import { Request, Response, Router } from "express";
import { Connection } from "typeorm";

import { DataController, handle, handleResult } from "../controllers";

export const getRouter = (dbConn: Connection, messenger: Messenger): Router => {
  const router = Router();
  const controller = new DataController(messenger, dbConn);

  router.get(
    "/posts",
    wrap(async (_req: Request, res: Response) => handleResult(res, await controller.getPosts())),
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
    "/connected-realms/:regionName",
    wrap(async (req: Request, res: Response) => {
      await handle(controller.getConnectedRealms, req, res);
    }),
  );
  router.get(
    "/token-history/:regionName",
    wrap(async (req: Request, res: Response) => {
      await handle(controller.getTokenHistory, req, res);
    }),
  );
  router.get(
    "/query-auction-stats/:regionName/:connectedRealmId",
    wrap(async (req: Request, res: Response) => {
      await handle(controller.queryAuctionStats, req, res);
    }),
  );
  router.get(
    "/query-auction-stats/:regionName",
    wrap(async (req: Request, res: Response) => {
      await handle(controller.queryAuctionStats, req, res);
    }),
  );
  router.get(
    "/query-auction-stats",
    wrap(async (req: Request, res: Response) => {
      await handle(controller.queryAuctionStats, req, res);
    }),
  );
  router.get(
    "/query-auctions/:regionName/:connectedRealmId",
    wrap(async (req: Request, res: Response) => {
      await handle(controller.queryAuctions, req, res);
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
    "/price-list/:regionName/:connectedRealmId",
    wrap(async (req: Request, res: Response) => {
      await handle(controller.getPricelist, req, res);
    }),
  );
  router.post(
    "/price-list-history/:regionName/:connectedRealmId",
    wrap(async (req: Request, res: Response) => {
      await handle(controller.getPricelistHistories, req, res);
    }),
  );
  router.post(
    "/unmet-demand/:regionName/:connectedRealmId",
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
