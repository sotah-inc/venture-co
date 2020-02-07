import {
  IQueryWorkOrdersParams,
  IQueryWorkOrdersResponse,
  IValidationErrorResponse,
} from "@sotah-inc/core";
import { Messenger } from "@sotah-inc/server";
import HTTPStatus from "http-status";
import { Connection } from "typeorm";

import { QueryWorkOrdersParamsRules } from "../lib/validator-rules";
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
    // parsing request params
    let result: IQueryWorkOrdersParams | null = null;
    try {
      result = await QueryWorkOrdersParamsRules.validate(req.query);
    } catch (err) {
      const validationErrors: IValidationErrorResponse = { [err.path]: err.message };

      return {
        data: validationErrors,
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    return {
      status: HTTPStatus.OK,
    };
  };
}
