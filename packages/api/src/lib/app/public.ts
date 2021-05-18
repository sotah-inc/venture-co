import { IMessengers } from "@sotah-inc/server";
import { Express } from "express";
import { Connection } from "typeorm";

import { defaultRouter, getDataRouter, getUserRouter, getWorkOrderRouter } from "../../routes";

export function publicApp(app: Express, dbConn: Connection, messengers: IMessengers): void {
  app.use("/", defaultRouter);
  app.use("/", getDataRouter(dbConn, messengers));
  app.use("/", getUserRouter(dbConn, messengers));
  app.use("/", getWorkOrderRouter(dbConn, messengers));
}
