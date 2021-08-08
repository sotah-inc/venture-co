import {
  GetItemClassesResponse,
  GetItemPriceHistoriesResponse,
  GetItemResponse,
  GetPricelistResponse,
  IErrorResponse,
  IGetItemResponseData,
  IQueryResponseData,
  IShortItem,
  ItemId,
  ItemRecipeKind,
  IValidationErrorResponse,
  Locale,
  QueryResponse,
  RealmSlug,
  RegionName,
} from "@sotah-inc/core";
import { IMessengers } from "@sotah-inc/server";
import { code } from "@sotah-inc/server/build/dist/messenger/contracts";
import { Response } from "express";
import HTTPStatus from "http-status";
import { ParsedQs } from "qs";

import { validate, validationErrorsToResponse } from "./validators";
import { createSchema, GameVersionRule, ItemIdRule, LocaleRule } from "./validators/yup";

import { IRequestResult, PlainRequest } from "./index";

export class ItemsController {
  private messengers: IMessengers;

  constructor(messengers: IMessengers) {
    this.messengers = messengers;
  }

  public async getItemClasses(
    _req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<GetItemClassesResponse>> {
    const msg = await this.messengers.items.itemClasses();
    if (msg.code !== code.ok) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const result = await msg.decode();
    if (result === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      data: {
        item_classes: result.item_classes,
      },
      status: HTTPStatus.OK,
    };
  }

  public async getItem(
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<GetItemResponse>> {
    const validateQueryResult = await validate(
      createSchema({
        locale: LocaleRule,
      }),
      req.query,
    );
    if (validateQueryResult.errors !== null) {
      return {
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
        data: validationErrorsToResponse(validateQueryResult.errors),
      };
    }

    const validateParamsResult = await validate(
      createSchema({
        itemId: ItemIdRule,
        gameVersion: GameVersionRule,
      }),
      req.params,
    );
    if (validateParamsResult.errors !== null) {
      return {
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
        data: validationErrorsToResponse(validateParamsResult.errors),
      };
    }

    const msg = await this.messengers.items.items({
      itemIds: [validateParamsResult.body.itemId],
      locale: validateQueryResult.body.locale,
      game_version: validateParamsResult.body.gameVersion,
    });
    if (msg.code !== code.ok) {
      const errorResponse: IErrorResponse = { error: "failed to fetch items" };

      return {
        data: errorResponse,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const itemsResult = await msg.decode();
    if (itemsResult === null) {
      const errorResponse: IErrorResponse = { error: "failed to fetch items" };

      return {
        data: errorResponse,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const foundItem = itemsResult.items.find(v => v.id === validateParamsResult.body.itemId);
    if (typeof foundItem === "undefined") {
      const errorResponse: IErrorResponse = { error: "item not found" };

      return {
        data: errorResponse,
        status: HTTPStatus.NOT_FOUND,
      };
    }

    const itemRecipeIdsMessage = await this.messengers.professions.itemsRecipes({
      kind: ItemRecipeKind.CraftedBy,
      item_ids: [validateParamsResult.body.itemId],
    });
    if (itemRecipeIdsMessage.code !== code.ok) {
      const errorResponse: IErrorResponse = { error: "failed to resolve items-recipes" };

      return {
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
        data: errorResponse,
      };
    }

    const itemRecipeIdsResult = await itemRecipeIdsMessage.decode();
    if (itemRecipeIdsResult === null) {
      const errorResponse: IErrorResponse = { error: "failed to decode items-recipes" };

      return {
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
        data: errorResponse,
      };
    }

    const itemResponse: IGetItemResponseData = {
      item: foundItem,
      itemRecipes: itemRecipeIdsResult[validateParamsResult.body.itemId],
    };

    return { data: itemResponse, status: HTTPStatus.OK };
  }

  public async queryItems(query: ParsedQs): Promise<IRequestResult<QueryResponse<IShortItem>>> {
    // parsing request params
    const validateParamsResult = await validate(QueryParamRules, query);
    if (validateParamsResult.error || !validateParamsResult.data) {
      return {
        data: yupValidationErrorToResponse(validateParamsResult.error),
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    // resolving items-query message
    const results = await this.messengers.items.resolveQueryItems({
      locale: validateParamsResult.data.locale as Locale,
      query: validateParamsResult.data.query ?? "",
    });
    if (results === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    // formatting a response
    const data: IQueryResponseData<IShortItem> = {
      items: results,
    };

    return {
      data,
      status: HTTPStatus.OK,
    };
  }

  public async getPricelist(
    regionName: RegionName,
    realmSlug: RealmSlug,
    itemIds: ItemId[],
    locale: string,
  ): Promise<IRequestResult<GetPricelistResponse>> {
    if (!Object.values(Locale).includes(locale as Locale)) {
      const validationErrors: IValidationErrorResponse = {
        error: "could not validate locale",
      };

      return {
        data: validationErrors,
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    // resolving connected-realm
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

    const pricelistMessage = await this.messengers.auctions.getPriceList({
      item_ids: itemIds,
      tuple: {
        connected_realm_id: resolveResult.connected_realm.connected_realm.id,
        region_name: regionName,
      },
    });
    if (pricelistMessage.code !== code.ok) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }
    const pricelistResult = await pricelistMessage.decode();
    if (pricelistResult === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const itemsMessage = await this.messengers.items.getItems({
      itemIds,
      locale: locale as Locale,
    });
    if (itemsMessage.code !== code.ok) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }
    const itemsResult = await itemsMessage.decode();
    if (itemsResult === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const items = itemsResult.items;

    return {
      data: { price_list: pricelistResult.price_list, items },
      status: HTTPStatus.OK,
    };
  }

  public async getItemPriceHistories(
    regionName: RegionName,
    realmSlug: RealmSlug,
    itemIds: ItemId[],
    locale: string,
  ): Promise<IRequestResult<GetItemPriceHistoriesResponse>> {
    if (!Object.values(Locale).includes(locale as Locale)) {
      const validationErrors: IValidationErrorResponse = {
        error: "could not validate locale",
      };

      return {
        data: validationErrors,
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    // resolving connected-realm
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

    const currentUnixTimestamp = Math.floor(Date.now() / 1000);
    const lowerBounds = currentUnixTimestamp - 60 * 60 * 24 * 14;
    const itemPricesHistoryMessage = await this.messengers.general.resolveItemPricesHistory({
      item_ids: itemIds,
      lower_bounds: lowerBounds,
      tuple: {
        connected_realm_id: resolveResult.connected_realm.connected_realm.id,
        region_name: regionName,
      },
      upper_bounds: currentUnixTimestamp,
    });
    if (itemPricesHistoryMessage.code !== code.ok || itemPricesHistoryMessage.data === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const itemsMessage = await this.messengers.items.getItems({
      itemIds,
      locale: locale as Locale,
    });
    if (itemsMessage.code !== code.ok) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }
    const itemsResult = await itemsMessage.decode();
    if (!itemsResult) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }
    const items = itemsResult.items;

    return {
      data: {
        history: itemPricesHistoryMessage.data.history,
        items,
      },
      status: HTTPStatus.OK,
    };
  }
}
