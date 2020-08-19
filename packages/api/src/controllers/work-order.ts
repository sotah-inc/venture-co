import {
  CreateWorkOrderResponse,
  GameVersion,
  ICreateWorkOrderRequest,
  ItemId,
  IValidationErrorResponse,
  OrderDirection,
  OrderKind,
  PrefillWorkOrderItemResponse,
  QueryWorkOrdersResponse,
  RealmSlug,
  RegionName,
  UserLevel,
} from "@sotah-inc/core";
import { code, Messenger, User, WorkOrder, WorkOrderRepository } from "@sotah-inc/server";
import { Response } from "express";
import HTTPStatus from "http-status";
import { ParsedQs } from "qs";
import { Connection } from "typeorm";

import {
  CreateWorkOrderRequestRules,
  QueryWorkOrdersParamsRules,
  validate,
  yupValidationErrorToResponse,
} from "../lib/validator-rules";
import { Authenticator, IRequest, IRequestResult, Validator } from "./index";

export class WorkOrderController {
  private messenger: Messenger;
  private dbConn: Connection;

  constructor(messenger: Messenger, dbConn: Connection) {
    this.messenger = messenger;
    this.dbConn = dbConn;
  }

  public async queryWorkOrders(
    gameVersion: string,
    regionName: RegionName,
    realmSlug: RealmSlug,
    query: ParsedQs,
  ): Promise<IRequestResult<QueryWorkOrdersResponse>> {
    const result = await validate(QueryWorkOrdersParamsRules, {
      ...query,
      gameVersion,
    });
    if (result.error || !result.data) {
      return {
        data: yupValidationErrorToResponse(result.error),
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const resolveMessage = await this.messenger.resolveConnectedRealm({
      realm_slug: realmSlug,
      region_name: regionName,
    });
    switch (resolveMessage.code) {
      case code.ok:
        break;
      case code.notFound:
        const notFoundValidationErrors: IValidationErrorResponse = {
          error: "could not resolve connected-realm",
        };

        return {
          data: notFoundValidationErrors,
          status: HTTPStatus.NOT_FOUND,
        };
      default:
        const defaultValidationErrors: IValidationErrorResponse = {
          error: "could not resolve connected-realm",
        };

        return {
          data: defaultValidationErrors,
          status: HTTPStatus.INTERNAL_SERVER_ERROR,
        };
    }

    const resolveResult = await resolveMessage.decode();
    if (resolveResult === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const { count: totalResults, orders } = await this.dbConn
      .getCustomRepository(WorkOrderRepository)
      .findBy({
        connectedRealmId: resolveResult.connected_realm.connected_realm.id,
        gameVersion: result.data.gameVersion as GameVersion,
        orderBy: result.data.orderBy as OrderKind,
        orderDirection: result.data.orderDirection as OrderDirection,
        page: result.data.page,
        perPage: result.data.perPage,
        regionName,
      });

    const itemsMsg = await this.messenger.getItems(orders.map(v => v.itemId));
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

    const itemsMsg = await this.messenger.getItems([itemId]);
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

    const resolveMessage = await this.messenger.resolveConnectedRealm({
      realm_slug: realmSlug,
      region_name: regionName,
    });
    switch (resolveMessage.code) {
      case code.ok:
        break;
      case code.notFound:
        const notFoundValidationErrors: IValidationErrorResponse = {
          error: "could not resolve connected-realm",
        };

        return {
          data: notFoundValidationErrors,
          status: HTTPStatus.NOT_FOUND,
        };
      default:
        const defaultValidationErrors: IValidationErrorResponse = {
          error: "could not resolve connected-realm",
        };

        return {
          data: defaultValidationErrors,
          status: HTTPStatus.INTERNAL_SERVER_ERROR,
        };
    }

    const resolveResult = await resolveMessage.decode();
    if (resolveResult === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const pricesMessage = await this.messenger.getPriceList({
      item_ids: [foundItem.blizzard_meta.id],
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

    const foundPrice = pricesResult.price_list[foundItem.blizzard_meta.id];

    return {
      data: { currentPrice: foundPrice?.average_buyout_per ?? null },
      status: HTTPStatus.OK,
    };
  }

  @Authenticator<ICreateWorkOrderRequest, CreateWorkOrderResponse>(UserLevel.Regular)
  @Validator<ICreateWorkOrderRequest, CreateWorkOrderResponse>(CreateWorkOrderRequestRules)
  public async createWorkOrder(
    req: IRequest<ICreateWorkOrderRequest>,
    _res: Response,
  ): Promise<IRequestResult<CreateWorkOrderResponse>> {
    const { realmSlug, regionName, gameVersion } = req.params;

    if (!Object.values(GameVersion).includes(gameVersion as GameVersion)) {
      const validationErrors: IValidationErrorResponse = {
        error: "could not validate game-version",
      };

      return {
        data: validationErrors,
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    const resolveMessage = await this.messenger.resolveConnectedRealm({
      realm_slug: realmSlug,
      region_name: regionName,
    });
    switch (resolveMessage.code) {
      case code.ok:
        break;
      case code.notFound:
        const notFoundValidationErrors: IValidationErrorResponse = {
          error: "could not resolve connected-realm",
        };

        return {
          data: notFoundValidationErrors,
          status: HTTPStatus.NOT_FOUND,
        };
      default:
        const defaultValidationErrors: IValidationErrorResponse = {
          error: "could not resolve connected-realm",
        };

        return {
          data: defaultValidationErrors,
          status: HTTPStatus.INTERNAL_SERVER_ERROR,
        };
    }

    const resolveResult = await resolveMessage.decode();
    if (resolveResult === null) {
      const resolveError: IValidationErrorResponse = {
        error: "could not resolve connected-realm",
      };

      return {
        data: resolveError,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const { body } = req;

    const workOrder = new WorkOrder();
    workOrder.user = req.user as User;
    workOrder.gameVersion = gameVersion as GameVersion;
    workOrder.regionName = regionName;
    workOrder.connectedRealmId = resolveResult.connected_realm.connected_realm.id;
    workOrder.itemId = body.itemId;
    workOrder.price = body.price;
    workOrder.quantity = body.quantity;
    await this.dbConn.manager.save(workOrder);

    return { status: HTTPStatus.CREATED, data: { order: workOrder.toJson() } };
  }
}
