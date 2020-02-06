import HTTPStatus from "http-status";

import { RequestHandler } from "./index";

export class WorkOrderController {
  public queryWorkOrders: RequestHandler<null, null> = async _req => {
    return {
      status: HTTPStatus.OK,
    };
  };
}
