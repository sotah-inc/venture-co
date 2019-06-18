import { getApp, getLogger } from "@sotah-inc/api";
import * as http from "http";
import * as process from "process";

// app init
const natsHost = process.env["NATS_HOST"] || "";
const natsPort = process.env["NATS_PORT"] || "";
const dbHost = process.env["DB_HOST"] || "";
const dbPassword = process.env["DB_PASSWORD"] || "";
const isGceEnv = (() => {
  const result = process.env["IS_GCE_ENV"] || "";
  return result === "1";
})();

// logger init
const logger = getLogger({ level: "debug", isGceEnv });

const appPort = process.env["PORT"];
(async () => {
  const app = await getApp({ logger, natsHost, natsPort, dbHost, dbPassword, isGceEnv });
  if (app === null) {
    logger.info("Failed to initialize app");
    process.exit(-1);

    return;
  }
  const server = http.createServer(app);
  server.listen(appPort, () => logger.info(`Listening on ${appPort}`));
  process.on("SIGTERM", () => {
    logger.info("Caught SIGTERM, closing server");
    server.close(() => {
      logger.info("Server closed, exiting");
      process.exit(0);
    });
  });
})();
