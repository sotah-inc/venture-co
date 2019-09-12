import { auth, User } from "@sotah-inc/server";
import { wrap } from "async-middleware";
import { Request, Response, Router } from "express";

export const getRouter = () => {
  const router = Router();

  router.get(
    "/",
    auth,
    wrap(async (req: Request, res: Response) => {
      res.json((req.user as User).toJson());
    }),
  );

  return router;
};
