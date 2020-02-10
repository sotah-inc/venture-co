import {
  GameVersion,
  IQueryWorkOrdersParams,
  IQueryWorkOrdersResponse,
  IValidationErrorResponse,
} from "@sotah-inc/core";
import { code, Messenger, OrderDirection, OrderKind, WorkOrderRepository } from "@sotah-inc/server";
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
    let result: (IQueryWorkOrdersParams & { gameVersion: string }) | null = null;
    try {
      result = await QueryWorkOrdersParamsRules.validate({
        ...(req.query as { [key: string]: string }),
        gameVersion: req.params["gameVersion"],
      });
    } catch (err) {
      const validationErrors: IValidationErrorResponse = { [err.path]: err.message };

      return {
        data: validationErrors,
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    const validateMsg = await this.messenger.validateRegionRealm({
      realm_slug: req.params["realmSlug"],
      region_name: req.params["regionName"],
    });
    if (validateMsg.code !== code.ok) {
      const validationErrors: IValidationErrorResponse = {
        error: "Could not validate region-name and realm-slug",
      };

      return {
        data: validationErrors,
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    const orders = await this.dbConn.getCustomRepository(WorkOrderRepository).findBy({
      ...result,
      gameVersion: result.gameVersion as GameVersion,
      orderBy: result.orderBy as OrderKind,
      orderDirection: result.orderDirection as OrderDirection,
      realmSlug: req.params["realmSlug"],
      regionName: req.params["regionName"],
    });

    return {
      data: { orders: orders.map(v => v.toJson()) },
      status: HTTPStatus.OK,
    };
  };
}
