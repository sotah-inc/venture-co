import { auth, Messenger } from "@sotah-inc/server";
import { wrap } from "async-middleware";
import { Request, Response, Router } from "express";
import { Connection } from "typeorm";

import { handle } from "../controllers";
import { WorkOrderController } from "../controllers/work-order";

export const getRouter = (dbConn: Connection, messenger: Messenger): Router => {
  const router = Router();
  const controller = new WorkOrderController(messenger, dbConn);

  router.get(
    "/work-orders/:gameVersion/:regionName/:realmSlug",
    wrap(async (req: Request, res: Response) => {
      await handle(controller.queryWorkOrders, req, res);
    }),
  );
  router.get(
    "/work-orders/:gameVersion/:regionName/:realmSlug/prefill-item",
    wrap(async (req: Request, res: Response) => {
      await handle(controller.prefillWorkOrderItem, req, res);
    }),
  );
  router.post(
    "/work-orders/:gameVersion/:regionName/:realmSlug",
    auth,
    wrap(async (req: Request, res: Response) => {
      await handle(controller.createWorkOrder.bind(controller), req, res);
    }),
  );

  return router;
};
