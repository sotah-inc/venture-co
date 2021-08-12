import { User as SotahUser } from "@sotah-inc/server";

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Request {
      sotahUser: SotahUser | undefined;
    }
  }
}
