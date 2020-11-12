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
import { getRouter as getQueryAuctionStatsRouter } from "./data/query-auction-stats";

export const getRouter = (dbConn: Connection, messenger: Messenger): Router => {
  const router = Router();
  const controller = new DataController(messenger, dbConn);

  router.use("/query-auction-stats", getQueryAuctionStatsRouter(messenger));

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
    "/auctions/:regionName/:realmSlug",
    wrap(async (req: Request, res: Response) => {
      const regionName = req.params["regionName"];
      const realmSlug = req.params["realmSlug"];

      handleResult(
        res,
        await controller.getAuctions(
          regionName,
          realmSlug,
          req.query,
          req.headers["if-modified-since"],
        ),
      );
    }),
  );
  router.get(
    "/items",
    wrap(async (req: Request, res: Response) => {
      handleResult(res, await controller.queryItems(req.query));
    }),
  );
  router.get(
    "/item/:itemId",
    wrap(async (req: Request, res: Response) => {
      const itemId = Number(req.params["itemId"]);

      handleResult(res, await controller.getItem(itemId, String(req.query["locale"])));
    }),
  );
  router.get(
    "/pets",
    wrap(async (req: Request, res: Response) => {
      handleResult(res, await controller.queryPets(req.query));
    }),
  );
  router.get(
    "/query-general",
    wrap(async (req: Request, res: Response) => {
      handleResult(res, await controller.queryGeneral(req.query));
    }),
  );
  router.post(
    "/price-list/:regionName/:realmSlug",
    wrap(async (req: Request, res: Response) => {
      const regionName = req.params["regionName"];
      const realmSlug = req.params["realmSlug"];
      const itemIds = (req.body as IGetPricelistRequest).item_ids;

      handleResult(
        res,
        await controller.getPricelist(regionName, realmSlug, itemIds, String(req.query["locale"])),
      );
    }),
  );
  router.post(
    "/price-list-history/:regionName/:realmSlug",
    wrap(async (req: Request, res: Response) => {
      const regionName = req.params["regionName"];
      const realmSlug = req.params["realmSlug"];
      const itemIds = (req.body as IGetPricelistHistoriesRequest).item_ids;

      handleResult(
        res,
        await controller.getPricelistHistories(
          regionName,
          realmSlug,
          itemIds,
          String(req.query["locale"]),
        ),
      );
    }),
  );
  router.post(
    "/unmet-demand/:regionName/:realmSlug",
    wrap(async (req: Request, res: Response) => {
      const regionName = req.params["regionName"];
      const realmSlug = req.params["realmSlug"];
      const expansionName = (req.body as IGetUnmetDemandRequest).expansion;

      handleResult(
        res,
        await controller.getUnmetDemand(
          regionName,
          realmSlug,
          expansionName,
          String(req.query["locale"]),
        ),
      );
    }),
  );
  router.get(
    "/profession-pricelists/:profession/:expansion",
    wrap(async (req: Request, res: Response) => {
      const professionName = req.params["profession"];
      const expansionName = req.params["expansion"];

      handleResult(
        res,
        await controller.getProfessionPricelists(
          professionName,
          expansionName,
          String(req.query["locale"]),
        ),
      );
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
  router.get(
    "/professions",
    wrap(async (req: Request, res: Response) => {
      handleResult(res, await controller.getProfessions(String(req.query["locale"])));
    }),
  );
  router.get(
    "/skill-tier/:profession/:skillTier",
    wrap(async (req: Request, res: Response) => {
      const professionId = req.params["profession"];
      const skillTierId = req.params["skillTier"];
      handleResult(
        res,
        await controller.getSkillTier(
          Number(professionId),
          Number(skillTierId),
          String(req.query["locale"]),
        ),
      );
    }),
  );
  router.get(
    "/recipe/:recipe",
    wrap(async (req: Request, res: Response) => {
      const recipeId = req.params["recipe"];
      handleResult(res, await controller.getRecipe(Number(recipeId), String(req.query["locale"])));
    }),
  );

  return router;
};
