import { appendSessions, connectDatabase, Messenger } from "@sotah-inc/server";
import compression from "compression";
import express from "express";
import * as HttpStatus from "http-status";
import * as nats from "nats";
import { v4 as uuidv4 } from "uuid";
import { Logger } from "winston";

import { defaultRouter, getDataRouter, getUserRouter, getWorkOrderRouter } from "../routes";

export interface IOptions {
  logger: Logger;
  natsHost: string;
  natsPort: string;
  dbHost: string;
  dbPassword?: string;
  isGceEnv: boolean;
}

export const getApp = async (opts: IOptions): Promise<express.Express | null> => {
  const { logger, natsHost, natsPort, dbHost, dbPassword } = opts;

  logger.info("starting app");

  // const errors = isGceEnv ? new ErrorReporting() : null;

  // express init
  let app = express();
  app.set("etag", false);
  app.use(express.json());
  app.use(compression());
  app.use((_, res, next) => {
    res.set("Cache-Control", "private");
    next();
  });

  // messenger init
  logger.info("connecting to nats", { natsHost, natsPort });
  const natsConnection = await (async () => {
    const conn = nats.connect({
      maxReconnectAttempts: 5,
      reconnectTimeWait: 100,
      url: `nats://${natsHost}:${natsPort}`,
    });
    return new Promise<nats.Client | null>(resolve => {
      conn.on("connect", () => resolve(conn));
      conn.on("error", err => {
        logger.error("failed to connect to nats", { err });

        resolve(null);
      });
    });
  })();
  if (natsConnection === null) {
    return null;
  }
  const messenger = new Messenger(natsConnection);
  await messenger.getBoot();

  // db init
  logger.info("connecting to db", { dbHost, dbPassword });
  const dbConn = await (async () => {
    try {
      return await connectDatabase({
        connectionName: `app-${uuidv4()}`,
        dbHostname: dbHost,
        dbName: "postgres",
        password: typeof dbPassword !== "undefined" ? dbPassword : "",
        port: 5432,
        username: "postgres",
      });
    } catch (err) {
      logger.error("failed to connect to db", { err });

      return null;
    }
  })();
  if (dbConn === null) {
    return null;
  }

  // session init
  logger.info("appending session middleware");
  app = await appendSessions(app, messenger, dbConn);

  // request logging
  logger.info("appending cors middleware");
  app.use((req, res, next) => {
    logger.info("received HTTP request", { url: req.originalUrl, method: req.method });

    res.set("access-control-allow-origin", "*");
    res.set("access-control-allow-headers", "content-type,authorization");
    res.set("access-control-allow-methods", "GET,POST,PUT,DELETE");
    next();
  });

  // route init
  logger.info("appending route middlewares");
  app.use("/", defaultRouter);
  app.use("/", getDataRouter(dbConn, messenger));
  app.use("/", getUserRouter(dbConn, messenger));
  app.use("/", getWorkOrderRouter(dbConn, messenger));

  // error handlers
  // if (isGceEnv && errors !== null) {
  //     logger.info("Appending gcp error-reporting");

  //     app.use(errors.express);
  // }
  logger.info("appending error middleware");
  app.use((err: Error, _: express.Request, res: express.Response, next: () => void) => {
    logger.error("dumping out error response", { error: err });

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err.message);
    next();
  });

  return app;
};
