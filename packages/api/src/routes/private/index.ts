import { auth } from "@sotah-inc/server";
import { wrap } from "async-middleware";
import { Express, Request, Response } from "express";
import { Connection } from "typeorm";

import { handleResult } from "../../controllers";
import { UserController } from "../../controllers/user";

export function mount(app: Express, dbConn: Connection): void {
  const controller = new UserController(dbConn);

  app.post(
    "/user/last-path",
    auth(dbConn),
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await controller.saveLastPath(req, res)),
    ),
  );
}
