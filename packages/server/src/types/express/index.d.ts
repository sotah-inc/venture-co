import { User } from "../../db";

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Request {
      sotahUser: User | undefined;
    }
  }
}
