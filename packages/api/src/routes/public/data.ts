import { IMessengers } from "@sotah-inc/server";
import { wrap } from "async-middleware";
import { Request, Response, Router } from "express";
import { Connection } from "typeorm";

import { DataController, handleResult } from "../../controllers";
import { AuctionsController } from "../../controllers/auctions";
import { BootController } from "../../controllers/boot";
import { ProfessionsController } from "../../controllers/data/professions";
import { ItemsController } from "../../controllers/items";
import { PetsController } from "../../controllers/pets";
import { PostsController } from "../../controllers/posts";
import { ProfessionPricelistController } from "../../controllers/profession-pricelist";
import { RegionsController } from "../../controllers/regions";
import { TokenHistoryController } from "../../controllers/token-history";
import { getRouter as getQueryAuctionStatsRouter } from "./data/query-auction-stats";

export function getRouter(dbConn: Connection, messengers: IMessengers): Router {
  const router = Router();
  const dataController = new DataController(messengers, dbConn);
  const professionsController = new ProfessionsController(messengers);
  const professionPricelistController = new ProfessionPricelistController(messengers, dbConn);
  const itemsController = new ItemsController(messengers);
  const petsController = new PetsController(messengers);
  const auctionsController = new AuctionsController(messengers, dbConn);
  const tokenHistoryController = new TokenHistoryController(messengers);
  const bootController = new BootController(messengers);
  const postsController = new PostsController(dbConn);
  const regionsController = new RegionsController(messengers);

  router.use("/query-auction-stats", getQueryAuctionStatsRouter(messengers));

  router.get(
    "/posts",
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await postsController.getPosts(req, res)),
    ),
  );
  router.get(
    "/posts/:post_slug",
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await postsController.getPost(req, res)),
    ),
  );
  router.get(
    "/boot",
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await bootController.getBoot(req, res)),
    ),
  );
  router.get(
    "/item-classes",
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await itemsController.getItemClasses(req, res)),
    ),
  );
  router.get(
    "/connected-realms/:gameVersion/:regionName",
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await regionsController.getConnectedRealms(req, res)),
    ),
  );
  router.get(
    "/region/:gameVersion/:regionName",
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await regionsController.getRegion(req, res)),
    ),
  );
  router.get(
    "/token-history",
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await tokenHistoryController.getTokenHistory(req, res)),
    ),
  );
  router.get(
    "/token-history/:regionName",
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await tokenHistoryController.getRegionTokenHistory(req, res)),
    ),
  );
  router.get(
    "/auctions/:gameVersion/:regionName/:realmSlug",
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await auctionsController.getAuctions(req, res)),
    ),
  );
  router.get(
    "/items",
    wrap(async (req: Request, res: Response) => {
      handleResult(res, await itemsController.queryItems(req, res));
    }),
  );
  router.get(
    "/item/:itemId",
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await itemsController.getItem(req, res)),
    ),
  );
  router.get(
    "/pets",
    wrap(async (req: Request, res: Response) => {
      handleResult(res, await petsController.queryPets(req, res));
    }),
  );
  router.get(
    "/query-general",
    wrap(async (req: Request, res: Response) => {
      handleResult(res, await dataController.queryGeneral(req, res));
    }),
  );
  router.post(
    "/price-list/:regionName/:realmSlug",
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await itemsController.getPricelist(req, res)),
    ),
  );
  router.post(
    "/item-price-histories/:regionName/:realmSlug",
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await itemsController.getItemPriceHistories(req, res)),
    ),
  );
  router.get(
    "/recipe-price-histories/:regionName/:realmSlug/:recipeId",
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await professionsController.getRecipePriceHistories(req, res)),
    ),
  );
  router.post(
    "/unmet-demand/:regionName/:realmSlug",
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await dataController.getUnmetDemand(req, res)),
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
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await professionPricelistController.getProfessionPricelist(req, res)),
    ),
  );
  router.get(
    "/professions",
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await professionsController.getProfessions(req, res)),
    ),
  );
  router.get(
    "/skill-tier/:profession/:skillTier",
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await professionsController.getSkillTier(req, res)),
    ),
  );
  router.get(
    "/recipe/:recipe",
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await professionsController.getRecipe(req, res)),
    ),
  );
  router.get(
    "/recipes",
    wrap(async (req: Request, res: Response) => {
      handleResult(res, await professionsController.queryRecipes(req, res));
    }),
  );
  router.get(
    "/items-recipes",
    wrap(async (req: Request, res: Response) => {
      handleResult(res, await professionsController.getItemsRecipes(req, res));
    }),
  );
  router.get(
    "/items-vendor-prices/:gameVersion",
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await professionsController.vendorPrices(req, res)),
    ),
  );

  return router;
}
