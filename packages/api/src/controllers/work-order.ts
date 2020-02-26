import {
  GameVersion,
  ICreateWorkOrderRequest,
  ICreateWorkOrderResponse,
  IPrefillWorkOrderItemResponse,
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
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
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
    if (!validateMsg.data!.is_valid) {
      const validationErrors: IValidationErrorResponse = {
        error: "Region-name and realm-slug combination was not valid",
      };

      return {
        data: validationErrors,
        status: HTTPStatus.NOT_FOUND,
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

    const itemIds = orders.map(v => v.itemId);
    const itemsMsg = await this.messenger.getItems(itemIds);
    if (itemsMsg.code !== code.ok) {
      const validationErrors: IValidationErrorResponse = { error: "Failed to resolve items" };

      return {
        data: validationErrors,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      data: { orders: orders.map(v => v.toJson()), totalResults, items: itemsMsg.data!.items },
      status: HTTPStatus.OK,
    };
  };

  public prefillWorkOrderItem: QueryRequestHandler<
    IPrefillWorkOrderItemResponse | IValidationErrorResponse
  > = async req => {
    const itemId = (req.query as { [key: string]: string })["itemId"] ?? "";
    const parsedItemId = Number(itemId);

    const itemsMsg = await this.messenger.getItems([parsedItemId]);
    if (itemsMsg.code !== code.ok) {
      const validationErrors: IValidationErrorResponse = { error: "failed to fetch items" };

      return {
        data: validationErrors,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const foundItem = itemsMsg.data!.items[parsedItemId] ?? null;
    if (foundItem === null) {
      const validationErrors: IValidationErrorResponse = { error: "failed to resolve item" };

      return {
        data: validationErrors,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const regionName = req.params["regionName"];
    const realmSlug = req.params["realmSlug"];

    const pricesMessage = await this.messenger.getPriceList({
      item_ids: [foundItem.id],
      realm_slug: realmSlug,
      region_name: regionName,
    });
    if (pricesMessage.code !== code.ok) {
      const validationErrors: IValidationErrorResponse = { error: "failed to fetch prices" };

      return {
        data: validationErrors,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const foundPrice = pricesMessage.data!.price_list[foundItem.id] ?? null;

    if (foundPrice === null) {
      const validationErrors: IValidationErrorResponse = { error: "failed to resolve item price" };

      return {
        data: validationErrors,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      data: { currentPrice: foundPrice.average_buyout_per },
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
