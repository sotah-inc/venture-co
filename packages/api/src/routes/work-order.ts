import { auth, Messenger } from "@sotah-inc/server";
import { wrap } from "async-middleware";
import { Request, Response, Router } from "express";
import { Connection } from "typeorm";

import { handleResult } from "../controllers";
import { WorkOrderController } from "../controllers/work-order";

export function getRouter(dbConn: Connection, messenger: Messenger): Router {
  const router = Router();
  const controller = new WorkOrderController(messenger, dbConn);

  router.get(
    "/work-orders/:gameVersion/:regionName/:realmSlug",
    wrap(async (req: Request, res: Response) =>
      handleResult(
        res,
        await controller.queryWorkOrders(
          req.params.gameVersion,
          req.params.regionName,
          req.params.realmSlug,
          req.query,
        ),
      ),
    ),
  );
  router.get(
    "/work-orders/:gameVersion/:regionName/:realmSlug/prefill-item",
    wrap(async (req: Request, res: Response) =>
      handleResult(
        res,
        await controller.prefillWorkOrderItem(
          req.params.gameVersion,
          req.params.regionName,
          req.params.realmSlug,
          Number(req.query.itemId),
          String(req.query.locale),
        ),
      ),
    ),
  );
  router.post(
    "/work-orders/:gameVersion/:regionName/:realmSlug",
    auth,
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await controller.createWorkOrder(req, res)),
    ),
  );

  return router;
}
