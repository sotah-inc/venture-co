import { auth } from "@sotah-inc/server";
import { wrap } from "async-middleware";
import { Request, Response, Router } from "express";
import { Connection } from "typeorm";

import { handle } from "../../controllers";
import { PostCrudController } from "../../controllers/user/post-crud";

export const getRouter = (dbConn: Connection): Router => {
  const router = Router();
  const controller = new PostCrudController(dbConn);

  router.post(
    "/",
    auth,
    wrap(async (req: Request, res: Response) => {
      await handle(controller.createPost.bind(controller), req, res);
    }),
  );

  router.put(
    "/:post_id",
    auth,
    wrap(async (req: Request, res: Response) => {
      await handle(controller.updatePost.bind(controller), req, res);
    }),
  );

  router.delete(
    "/:post_id",
    auth,
    wrap(async (req: Request, res: Response) => {
      await handle(controller.deletePost.bind(controller), req, res);
    }),
  );

  return router;
};
