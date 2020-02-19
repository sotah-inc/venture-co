import {
  GameVersion,
  ICreateWorkOrderRequest,
  ICreateWorkOrderResponse,
  IQueryWorkOrdersParams,
  IQueryWorkOrdersResponse,
  IValidationErrorResponse,
  OrderDirection,
  OrderKind,
  UserLevel,
} from "@sotah-inc/core";
import { code, Messenger, User, WorkOrder, WorkOrderRepository } from "@sotah-inc/server";
import { Response } from "express";
import HTTPStatus from "http-status";
import { Connection } from "typeorm";

import { CreateWorkOrderRequestRules, QueryWorkOrdersParamsRules } from "../lib/validator-rules";
import { Authenticator, IRequest, IRequestResult, QueryRequestHandler, Validator } from "./index";

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

    const { count: totalResults, orders } = await this.dbConn
      .getCustomRepository(WorkOrderRepository)
      .findBy({
        ...result,
        gameVersion: result.gameVersion as GameVersion,
        orderBy: result.orderBy as OrderKind,
        orderDirection: result.orderDirection as OrderDirection,
        realmSlug: req.params["realmSlug"],
        regionName: req.params["regionName"],
      });

    return {
      data: { orders: orders.map(v => v.toJson()), totalResults },
      status: HTTPStatus.OK,
    };
  };

  @Authenticator<ICreateWorkOrderRequest, ICreateWorkOrderResponse>(UserLevel.Regular)
  @Validator<ICreateWorkOrderRequest, ICreateWorkOrderResponse>(CreateWorkOrderRequestRules)
  public async createWorkOrder(
    req: IRequest<ICreateWorkOrderRequest>,
    _res: Response,
  ): Promise<IRequestResult<ICreateWorkOrderResponse | IValidationErrorResponse>> {
    const { realmSlug, regionName, gameVersion } = req.params;

    if (!Object.values(GameVersion).includes(gameVersion as GameVersion)) {
      const validationErrors: IValidationErrorResponse = {
        error: "Could not validate game-version",
      };

      return {
        data: validationErrors,
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    const validateMsg = await this.messenger.validateRegionRealm({
      realm_slug: realmSlug,
      region_name: regionName,
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

    const { body } = req;

    const workOrder = new WorkOrder();
    workOrder.user = req.user as User;
    workOrder.gameVersion = gameVersion as GameVersion;
    workOrder.regionName = regionName;
    workOrder.realmSlug = realmSlug;
    workOrder.itemId = body.itemId;
    workOrder.price = body.price;
    workOrder.quantity = body.quantity;
    await this.dbConn.manager.save(workOrder);

    return { status: HTTPStatus.CREATED, data: { order: workOrder.toJson() } };
  }
}
