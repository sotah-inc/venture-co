import { IQueryWorkOrdersResponse, IValidationErrorResponse } from "@sotah-inc/core";
import { Messenger } from "@sotah-inc/server";
import HTTPStatus from "http-status";
import { Connection } from "typeorm";

import { QueryRequestHandler } from "./index";

export class WorkOrderController {
  private messenger: Messenger;
  private dbConn: Connection;

  constructor(messenger: Messenger, dbConn: Connection) {
    this.messenger = messenger;
    this.dbConn = dbConn;
  }

  public queryWorkOrders: QueryRequestHandler<
    IQueryWorkOrdersResponse | IValidationErrorResponse
  > = async req => {
    return {
      status: HTTPStatus.OK,
    };
  };
}
