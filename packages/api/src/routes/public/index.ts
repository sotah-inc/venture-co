import { IMessengers } from "@sotah-inc/server";
import { Express } from "express";
import { Connection } from "typeorm";

import { getRouter as getDataRouter } from "./data";
import { router as defaultRouter } from "./default";
import { getRouter as getUserRouter } from "./user";
import { getRouter as getWorkOrderRouter } from "./work-order";

export interface IMountOptions {
  app: Express;
  dbConn: Connection;
  messengers: IMessengers;
  clientHost: string;
}

export function mount({ app, dbConn, messengers, clientHost }: IMountOptions): void {
  app.use("/", defaultRouter);
  app.use("/", getDataRouter(dbConn, messengers));
  app.use("/", getUserRouter(dbConn, messengers, clientHost));
  app.use("/", getWorkOrderRouter(dbConn, messengers));
}
