import {
  CreateWorkOrderResponse,
  ICreateWorkOrderRequest,
  IValidationErrorResponse,
  PrefillWorkOrderItemResponse,
  QueryWorkOrdersResponse,
  UserLevel,
} from "@sotah-inc/core";
import { IMessengers, User, WorkOrder, WorkOrderRepository } from "@sotah-inc/server";
import { code } from "@sotah-inc/server/build/dist/messenger/contracts";
import { Response } from "express";
import HTTPStatus from "http-status";
import { Connection } from "typeorm";

import { resolveItem, resolveRealmSlug } from "./resolvers";
import { validate, validationErrorsToResponse, Validator } from "./validators";
import {
  CreateWorkOrderRequestRules,
  QueryWorkOrdersQueryRules,
} from "./validators/yup";

import {
  Authenticator,
  EmptyStringMap,
  IRequest,
  IRequestResult,
  PlainRequest,
  StringMap,
} from "./index";

export class WorkOrderController {
  private messengers: IMessengers;

  private dbConn: Connection;

  constructor(messengers: IMessengers, dbConn: Connection) {
    this.messengers = messengers;
    this.dbConn = dbConn;
  }

  public async queryWorkOrders(
    req: IRequest<undefined, StringMap, StringMap>,
    _res: Response,
  ): Promise<IRequestResult<QueryWorkOrdersResponse>> {
    const resolveResult = await resolveRealmSlug(req.params, this.messengers.regions);
    if (resolveResult.errorResponse !== null) {
      return resolveResult.errorResponse;
    }

    const validateResult = await validate(QueryWorkOrdersQueryRules, req.query);
    if (validateResult.errors !== null) {
      return {
        data: validationErrorsToResponse(validateResult.errors),
        status: HTTPStatus.BAD_REQUEST,
      };
    }
    if (validateResult.body === undefined) {
      return {
        data: {
          error: "validate-result was undefined",
        },
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const { count: totalResults, orders } = await this.dbConn
      .getCustomRepository(WorkOrderRepository)
      .findBy({
        connectedRealmId: resolveResult.data.connectedRealm.connected_realm.id,
        gameVersion: resolveResult.data.gameVersion,
        orderBy: validateResult.body.orderBy,
        orderDirection: validateResult.body.orderDirection,
        page: validateResult.body.page,
        perPage: validateResult.body.perPage,
        regionName: resolveResult.data.regionName,
      });

    const itemsMsg = await this.messengers.items.items({
      itemIds: orders.map(v => v.itemId),
      locale: validateResult.body.locale,
      game_version: resolveResult.data.gameVersion,
    });
    if (itemsMsg.code !== code.ok) {
      const validationErrors: IValidationErrorResponse = { error: "failed to resolve items" };

      return {
        data: validationErrors,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }
    const itemsResult = await itemsMsg.decode();
    if (itemsResult === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      data: {
        items: itemsResult.items,
        orders: orders.map(v => v.toJson()),
        totalResults,
      },
      status: HTTPStatus.OK,
    };
  }

  public async prefillWorkOrderItem(
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<PrefillWorkOrderItemResponse>> {
    const resolveResult = await resolveRealmSlug(req.params, this.messengers.regions);
    if (resolveResult.errorResponse !== null) {
      return resolveResult.errorResponse;
    }

    const resolveItemResult = await resolveItem({
      ...req.query,
      gameVersion: resolveResult.data.gameVersion,
    }, this.messengers.items);
    if (resolveItemResult.errorResponse !== null) {
      return resolveItemResult.errorResponse;
    }

    const pricesMessage = await this.messengers.liveAuctions.priceList({
      item_ids: [resolveItemResult.data.item.id],
      tuple: {
        connected_realm_id: resolveResult.data.connectedRealm.connected_realm.id,
        region_name: resolveResult.data.regionName,
        game_version: resolveResult.data.gameVersion,
      },
    });
    if (pricesMessage.code !== code.ok) {
      const validationErrors: IValidationErrorResponse = { error: "failed to fetch prices" };

      return {
        data: validationErrors,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }
    const pricesResult = await pricesMessage.decode();
    if (pricesResult === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const foundPrice = pricesResult.price_list[resolveItemResult.data.item.id];

    return {
      data: { currentPrice: foundPrice?.market_price_buyout_per ?? null },
      status: HTTPStatus.OK,
    };
  }

  @Authenticator(UserLevel.Regular)
  @Validator(CreateWorkOrderRequestRules)
  public async createWorkOrder(
    req: IRequest<ICreateWorkOrderRequest, EmptyStringMap, EmptyStringMap>,
    _res: Response,
  ): Promise<IRequestResult<CreateWorkOrderResponse>> {
    const resolveResult = await resolveRealmSlug(req.params, this.messengers.regions);
    if (resolveResult.errorResponse !== null) {
      return resolveResult.errorResponse;
    }

    const { body } = req;

    const workOrder = new WorkOrder();
    workOrder.user = req.user as User;
    workOrder.gameVersion = resolveResult.data.gameVersion;
    workOrder.regionName = resolveResult.data.regionName;
    workOrder.connectedRealmId = resolveResult.data.connectedRealm.connected_realm.id;
    workOrder.itemId = body.itemId;
    workOrder.price = body.price;
    workOrder.quantity = body.quantity;
    await this.dbConn.manager.save(workOrder);

    return { status: HTTPStatus.CREATED, data: { order: workOrder.toJson() } };
  }
}
