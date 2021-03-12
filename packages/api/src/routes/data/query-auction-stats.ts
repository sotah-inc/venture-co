import { IMessengers } from "@sotah-inc/server";
import { wrap } from "async-middleware";
import { Request, Response, Router } from "express";

import { handleResult } from "../../controllers";
import { QueryAuctionStatsController } from "../../controllers/data/query-auction-stats";

export function getRouter(messengers: IMessengers): Router {
  const router = Router();
  const controller = new QueryAuctionStatsController(messengers);

  router.get(
    "/:regionName/:connectedRealmId",
    wrap(async (req: Request, res: Response) => {
      const regionName = req.params.regionName;
      const connectedRealmId = Number(req.params.connectedRealmId);

      handleResult(res, await controller.queryAuctionStats(regionName, connectedRealmId));
    }),
  );
  router.get(
    "/:regionName",
    wrap(async (req: Request, res: Response) => {
      const regionName = req.params.regionName;

      handleResult(res, await controller.queryAuctionStats(regionName));
    }),
  );
  router.get(
    "/",
    wrap(async (_req: Request, res: Response) =>
      handleResult(res, await controller.queryAuctionStats()),
    ),
  );

  return router;
}
