import {
  CreateWorkOrderResponse,
  GameVersion,
  ICreateWorkOrderRequest,
  ItemId,
  IValidationErrorResponse,
  Locale,
  OrderDirection,
  OrderKind,
  PrefillWorkOrderItemResponse,
  QueryWorkOrdersResponse,
  RealmSlug,
  RegionName,
  UserLevel,
} from "@sotah-inc/core";
import { IMessengers, User, WorkOrder, WorkOrderRepository } from "@sotah-inc/server";
import { code } from "@sotah-inc/server/build/dist/messenger/contracts";
import { Response } from "express";
import HTTPStatus from "http-status";
import { ParsedQs } from "qs";
import { Connection } from "typeorm";

import { resolveRealmSlug } from "./resolvers";
import { validate, validationErrorsToResponse, Validator } from "./validators";
import {
  CreateWorkOrderRequestRules,
  QueryWorkOrdersParamsRules,
} from "./validators/yup";

import { Authenticator, IRequest, IRequestResult } from "./index";

export class WorkOrderController {
  private messengers: IMessengers;

  private dbConn: Connection;

  constructor(messengers: IMessengers, dbConn: Connection) {
    this.messengers = messengers;
    this.dbConn = dbConn;
  }

  public async queryWorkOrders(
    req: IRequest<null>,
    _res: Response,
  ): Promise<IRequestResult<QueryWorkOrdersResponse>> {
    const resolveResult = await resolveRealmSlug(req.params, this.messengers.regions);
    if (resolveResult.errorResponse !== null) {
      return resolveResult.errorResponse;
    }

    const validateResult = await validate(QueryWorkOrdersParamsRules, req.query);
    if (validateResult.errors !== null) {
      return {
        data: validationErrorsToResponse(validateResult.errors),
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const { count: totalResults, orders } = await this.dbConn
      .getCustomRepository(WorkOrderRepository)
      .findBy({
        connectedRealmId: resolveResult.data.connectedRealm.connected_realm.id,
        gameVersion: resolveResult.data.gameVersion,
        orderBy: validateResult.body.orderBy,
        orderDirection: result.data.orderDirection as OrderDirection,
        page: result.data.page,
        perPage: result.data.perPage,
        regionName,
      });

    const itemsMsg = await this.messengers.items.getItems({
      itemIds: orders.map(v => v.itemId),
      locale: result.data.locale,
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
    gameVersion: string,
    regionName: RegionName,
    realmSlug: RealmSlug,
    itemId: ItemId,
    locale: string,
  ): Promise<IRequestResult<PrefillWorkOrderItemResponse>> {
    if (!Object.values(GameVersion).includes(gameVersion as GameVersion)) {
      const validationErrors: IValidationErrorResponse = {
        error: "could not validate game-version",
      };

      return {
        data: validationErrors,
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    if (!Object.values(Locale).includes(locale as Locale)) {
      const validationErrors: IValidationErrorResponse = {
        error: "could not validate locale",
      };

      return {
        data: validationErrors,
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    const itemsMsg = await this.messengers.items.getItems({
      locale: locale as Locale,
      itemIds: [itemId],
    });
    if (itemsMsg.code !== code.ok) {
      const validationErrors: IValidationErrorResponse = { error: "failed to fetch items" };

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

    const foundItem = itemsResult.items[itemId];
    if (typeof foundItem === "undefined") {
      const validationErrors: IValidationErrorResponse = { error: "failed to resolve item" };

      return {
        data: validationErrors,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const resolveMessage = await this.messengers.regions.resolveConnectedRealm({
      realm_slug: realmSlug,
      region_name: regionName,
    });
    switch (resolveMessage.code) {
    case code.ok:
      break;
    case code.notFound: {
      const notFoundValidationErrors: IValidationErrorResponse = {
        error: "could not resolve connected-realm",
      };

      return {
        data: notFoundValidationErrors,
        status: HTTPStatus.NOT_FOUND,
      };
    }
    default: {
      const defaultValidationErrors: IValidationErrorResponse = {
        error: "could not resolve connected-realm",
      };

      return {
        data: defaultValidationErrors,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }
    }

    const resolveResult = await resolveMessage.decode();
    if (resolveResult === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const pricesMessage = await this.messengers.auctions.getPriceList({
      item_ids: [foundItem.id],
      tuple: {
        connected_realm_id: resolveResult.connected_realm.connected_realm.id,
        region_name: regionName,
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

    const foundPrice = pricesResult.price_list[foundItem.id];

    return {
      data: { currentPrice: foundPrice?.market_price_buyout_per ?? null },
      status: HTTPStatus.OK,
    };
  }

  @Authenticator<ICreateWorkOrderRequest, CreateWorkOrderResponse>(UserLevel.Regular)
  @Validator<ICreateWorkOrderRequest, CreateWorkOrderResponse>(CreateWorkOrderRequestRules)
  public async createWorkOrder(
    req: IRequest<ICreateWorkOrderRequest>,
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
