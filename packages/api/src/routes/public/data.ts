import {
  IGetItemPriceHistoriesRequest,
  IGetPricelistRequest,
  IGetUnmetDemandRequest,
} from "@sotah-inc/core";
import { IMessengers } from "@sotah-inc/server";
import { wrap } from "async-middleware";
import { Request, Response, Router } from "express";
import { Connection } from "typeorm";

import { DataController, handleResult } from "../../controllers";
import { ProfessionsController } from "../../controllers/data/professions";
import { ProfessionPricelistController } from "../../controllers/profession-pricelist";
import { getRouter as getQueryAuctionStatsRouter } from "./data/query-auction-stats";

export function getRouter(dbConn: Connection, messengers: IMessengers): Router {
  const router = Router();
  const controller = new DataController(messengers, dbConn);
  const professionsController = new ProfessionsController(messengers);
  const professionPricelistController = new ProfessionPricelistController(messengers, dbConn);

  router.use("/query-auction-stats", getQueryAuctionStatsRouter(messengers));

  router.get(
    "/posts",
    wrap(async (_req: Request, res: Response) => handleResult(res, await controller.getPosts())),
  );
  router.get(
    "/posts/:post_slug",
    wrap(async (req: Request, res: Response) => {
      const postSlug = req.params.post_slug;

      handleResult(res, await controller.getPost(postSlug));
    }),
  );
  router.get(
    "/boot",
    wrap(async (_req: Request, res: Response) => handleResult(res, await controller.getBoot())),
  );
  router.get(
    "/item-classes",
    wrap(async (_req: Request, res: Response) =>
      handleResult(res, await controller.getItemClasses()),
    ),
  );
  router.get(
    "/connected-realms/:regionName",
    wrap(async (req: Request, res: Response) => {
      const regionName = req.params.regionName;

      handleResult(res, await controller.getConnectedRealms(regionName));
    }),
  );
  router.get(
    "/token-history",
    wrap(async (_req: Request, res: Response) => {
      handleResult(res, await controller.getTokenHistory());
    }),
  );
  router.get(
    "/token-history/:regionName",
    wrap(async (req: Request, res: Response) => {
      const regionName = req.params.regionName;

      handleResult(res, await controller.getRegionTokenHistory(regionName));
    }),
  );
  router.get(
    "/auctions/:regionName/:realmSlug",
    wrap(async (req: Request, res: Response) => {
      const regionName = req.params.regionName;
      const realmSlug = req.params.realmSlug;

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
      const itemId = Number(req.params.itemId);

      handleResult(res, await controller.getItem(itemId, String(req.query.locale)));
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
      const regionName = req.params.regionName;
      const realmSlug = req.params.realmSlug;
      const itemIds = (req.body as IGetPricelistRequest).item_ids;

      handleResult(
        res,
        await controller.getPricelist(regionName, realmSlug, itemIds, String(req.query.locale)),
      );
    }),
  );
  router.post(
    "/item-price-histories/:regionName/:realmSlug",
    wrap(async (req: Request, res: Response) => {
      const regionName = req.params.regionName;
      const realmSlug = req.params.realmSlug;
      const itemIds = (req.body as IGetItemPriceHistoriesRequest).item_ids;

      handleResult(
        res,
        await controller.getItemPriceHistories(
          regionName,
          realmSlug,
          itemIds,
          String(req.query.locale),
        ),
      );
    }),
  );
  router.get(
    "/recipe-price-histories/:regionName/:realmSlug/:recipeId",
    wrap(async (req: Request, res: Response) => {
      const regionName = req.params.regionName;
      const realmSlug = req.params.realmSlug;
      const recipeId = req.params.recipeId;

      handleResult(
        res,
        await professionsController.getRecipePriceHistories(
          regionName,
          realmSlug,
          Number(recipeId),
          String(req.query.locale),
        ),
      );
    }),
  );
  router.post(
    "/unmet-demand/:regionName/:realmSlug",
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await controller.getUnmetDemand(req, res)),
    ),
  );
  router.get(
    "/profession-pricelists/:professionId/:expansion",
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await professionPricelistController.getProfessionPricelists(req, res)),
    ),
  );
  router.get(
    "/profession-pricelists/:professionId/:expansion/:pricelist_slug",
    wrap(async (req: Request, res: Response) => {
      handleResult(res, await professionPricelistController.getProfessionPricelist(req, res));
    }),
  );
  router.get(
    "/professions",
    wrap(async (req: Request, res: Response) => {
      handleResult(res, await professionsController.getProfessions(String(req.query.locale)));
    }),
  );
  router.get(
    "/skill-tier/:profession/:skillTier",
    wrap(async (req: Request, res: Response) => {
      const professionId = req.params.profession;
      const skillTierId = req.params.skillTier;
      handleResult(
        res,
        await professionsController.getSkillTier(
          Number(professionId),
          Number(skillTierId),
          String(req.query.locale),
        ),
      );
    }),
  );
  router.get(
    "/recipe/:recipe",
    wrap(async (req: Request, res: Response) => {
      const recipeId = req.params.recipe;
      handleResult(
        res,
        await professionsController.getRecipe(Number(recipeId), String(req.query.locale)),
      );
    }),
  );
  router.get(
    "/recipes",
    wrap(async (req: Request, res: Response) => {
      handleResult(res, await professionsController.queryRecipes(req.query));
    }),
  );
  router.get(
    "/items-recipes",
    wrap(async (req: Request, res: Response) => {
      handleResult(res, await professionsController.getItemsRecipes(req.query));
    }),
  );
  router.get(
    "/items-vendor-prices",
    wrap(async (req: Request, res: Response) => {
      handleResult(res, await professionsController.vendorPrices(req.query));
    }),
  );

  return router;
}
