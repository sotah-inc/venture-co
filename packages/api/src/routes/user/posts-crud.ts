import { auth } from "@sotah-inc/server";
import { wrap } from "async-middleware";
import { Request, Response, Router } from "express";
import { Connection } from "typeorm";

import { handleResult } from "../../controllers";
import { PostCrudController } from "../../controllers/user/post-crud";

export function getRouter(dbConn: Connection): Router {
  const router = Router();
  const controller = new PostCrudController(dbConn);

  router.post(
    "/",
    auth,
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await controller.createPost(req, res)),
    ),
  );

  router.put(
    "/:post_id",
    auth,
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await controller.updatePost(req, res)),
    ),
  );

  router.delete(
    "/:post_id",
    auth,
    wrap(async (req: Request, res: Response) =>
      handleResult(res, await controller.deletePost(req, res)),
    ),
  );

  return router;
}
