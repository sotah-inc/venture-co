import {
  IGetPricelistHistoriesRequest,
  IGetPricelistRequest,
  IGetUnmetDemandRequest,
} from "@sotah-inc/core";
import { Messenger } from "@sotah-inc/server";
import { wrap } from "async-middleware";
import { Request, Response, Router } from "express";
import { Connection } from "typeorm";

import { DataController, handleResult } from "../controllers";

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
      const postSlug = req.params["post_slug"];

      handleResult(res, await controller.getPost(postSlug));
    }),
  );
  router.get(
    "/boot",
    wrap(async (_req: Request, res: Response) => handleResult(res, await controller.getBoot())),
  );
  router.get(
    "/connected-realms/:regionName",
    wrap(async (req: Request, res: Response) => {
      const regionName = req.params["regionName"];

      handleResult(res, await controller.getConnectedRealms(regionName));
    }),
  );
  router.get(
    "/token-history/:regionName",
    wrap(async (req: Request, res: Response) => {
      const regionName = req.params["regionName"];

      handleResult(res, await controller.getTokenHistory(regionName));
    }),
  );
  router.get(
    "/query-auction-stats/:regionName/:connectedRealmId",
    wrap(async (req: Request, res: Response) => {
      const regionName = req.params["regionName"];
      const connectedRealmId = Number(req.params["connectedRealmId"]);

      handleResult(res, await controller.queryAuctionStats(regionName, connectedRealmId));
    }),
  );
  router.get(
    "/query-auction-stats/:regionName",
    wrap(async (req: Request, res: Response) => {
      const regionName = req.params["regionName"];

      handleResult(res, await controller.queryAuctionStats(regionName));
    }),
  );
  router.get(
    "/query-auction-stats",
    wrap(async (_req: Request, res: Response) =>
      handleResult(res, await controller.queryAuctionStats()),
    ),
  );
  router.get(
    "/query-auctions/:regionName/:connectedRealmId",
    wrap(async (req: Request, res: Response) => {
      const regionName = req.params["regionName"];
      const connectedRealmId = Number(req.params["connectedRealmId"]);

      handleResult(
        res,
        await controller.queryAuctions(
          regionName,
          connectedRealmId,
          req.query,
          req.headers["if-modified-since"],
        ),
      );
    }),
  );
  router.post(
    "/items",
    wrap(async (req: Request, res: Response) => {
      const query = req.params["query"];

      handleResult(res, await controller.queryItems(query));
    }),
  );
  router.get(
    "/item/:itemId",
    wrap(async (req: Request, res: Response) => {
      const itemId = Number(req.params["itemId"]);

      handleResult(res, await controller.getItem(itemId));
    }),
  );
  router.post(
    "/price-list/:regionName/:connectedRealmId",
    wrap(async (req: Request, res: Response) => {
      const regionName = req.params["regionName"];
      const connectedRealmId = Number(req.params["connectedRealmId"]);
      const itemIds = (req.body as IGetPricelistRequest).item_ids;

      handleResult(res, await controller.getPricelist(regionName, connectedRealmId, itemIds));
    }),
  );
  router.post(
    "/price-list-history/:regionName/:connectedRealmId",
    wrap(async (req: Request, res: Response) => {
      const regionName = req.params["regionName"];
      const connectedRealmId = Number(req.params["connectedRealmId"]);
      const itemIds = (req.body as IGetPricelistHistoriesRequest).item_ids;

      handleResult(
        res,
        await controller.getPricelistHistories(regionName, connectedRealmId, itemIds),
      );
    }),
  );
  router.post(
    "/unmet-demand/:regionName/:connectedRealmId",
    wrap(async (req: Request, res: Response) => {
      const regionName = req.params["regionName"];
      const connectedRealmId = Number(req.params["connectedRealmId"]);
      const expansionName = (req.body as IGetUnmetDemandRequest).expansion;

      handleResult(
        res,
        await controller.getUnmetDemand(regionName, connectedRealmId, expansionName),
      );
    }),
  );
  router.get(
    "/profession-pricelists/:profession/:expansion",
    wrap(async (req: Request, res: Response) => {
      const professionName = req.params["profession"];
      const expansionName = req.params["expansion"];

      handleResult(res, await controller.getProfessionPricelists(professionName, expansionName));
    }),
  );
  router.get(
    "/profession-pricelists/:profession/:expansion/:pricelist_slug",
    wrap(async (req: Request, res: Response) => {
      const professionName = req.params["profession"];
      const expansionName = req.params["expansion"];
      const pricelistSlug = req.params["pricelist_slug"];

      handleResult(
        res,
        await controller.getProfessionPricelist(professionName, expansionName, pricelistSlug),
      );
    }),
  );

  return router;
};
