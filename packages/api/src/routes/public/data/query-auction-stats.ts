import { IMessengers } from "@sotah-inc/server";
import { wrap } from "async-middleware";
import { Request, Response, Router } from "express";

import { handleResult } from "../../../controllers";
import { QueryAuctionStatsController } from "../../../controllers/data/query-auction-stats";

export function getRouter(messengers: IMessengers): Router {
  const router = Router();
  const controller = new QueryAuctionStatsController(messengers);

  router.get(
    "/:regionName/:connectedRealmId",
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await controller.queryAuctionStats(req, res)),
    ),
  );
  router.get(
    "/:regionName",
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await controller.queryAuctionStats(req, res)),
    ),
  );
  router.get(
    "/",
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await controller.queryAuctionStats(req, res)),
    ),
  );

  return router;
}
