import {
  GameVersion,
  ICreateWorkOrderRequest,
  ICreateWorkOrderResponse,
  IPrefillWorkOrderItemResponse,
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

import {
  CreateWorkOrderRequestRules,
  QueryWorkOrdersParamsRules,
  validate,
  yupValidationErrorToResponse,
} from "../lib/validator-rules";
import { Authenticator, IRequest, IRequestResult, QueryRequestHandler, Validator } from "./index";

export class WorkOrderController {
  private messenger: Messenger;
  private dbConn: Connection;

  constructor(messenger: Messenger, dbConn: Connection) {
    this.messenger = messenger;
    this.dbConn = dbConn;
  }

  public queryWorkOrders: QueryRequestHandler<
    IQueryWorkOrdersResponse | IValidationErrorResponse | null
  > = async req => {
    const regionName = req.params["regionName"];
    const realmSlug = req.params["realmSlug"];

    const result = await validate(QueryWorkOrdersParamsRules, {
      ...(req.query as { [key: string]: string }),
      gameVersion: req.params["gameVersion"],
    });
    if (result.error || !result.data) {
      return {
        data: yupValidationErrorToResponse(result.error),
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const validateMsg = await this.messenger.validateRegionRealm({
      realm_slug: realmSlug,
      region_name: regionName,
    });
    if (validateMsg.code !== code.ok) {
      const validationErrors: IValidationErrorResponse = {
        error: "could not validate region-name and realm-slug",
      };

      return {
        data: validationErrors,
        status: HTTPStatus.BAD_REQUEST,
      };
    }
    const validateResult = await validateMsg.decode();
    if (validateResult === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    if (!validateResult.is_valid) {
      const validationErrors: IValidationErrorResponse = {
        error: "region-name and realm-slug combination was not valid",
      };

      return {
        data: validationErrors,
        status: HTTPStatus.NOT_FOUND,
      };
    }

    const { count: totalResults, orders } = await this.dbConn
      .getCustomRepository(WorkOrderRepository)
      .findBy({
        gameVersion: result.data.gameVersion as GameVersion,
        orderBy: result.data.orderBy as OrderKind,
        orderDirection: result.data.orderDirection as OrderDirection,
        page: result.data.page,
        perPage: result.data.perPage,
        realmSlug,
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

    const foundItem = (await itemsMsg.decode())!.items[parsedItemId] ?? null;
    if (foundItem === null) {
      const validationErrors: IValidationErrorResponse = { error: "failed to resolve item" };

      return {
        data: validationErrors,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const { regionName, connectedRealmId } = req.params;

    const pricesMessage = await this.messenger.getPriceList({
      item_ids: [foundItem.blizzard_meta.id],
      tuple: {
        connected_realm_id: Number(connectedRealmId),
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

    const foundPrice = (await pricesMessage.decode())!.price_list[foundItem.blizzard_meta.id];

    return {
      data: { currentPrice: foundPrice?.average_buyout_per ?? null },
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
        error: "could not validate game-version",
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
        error: "could not validate region-name and realm-slug",
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
