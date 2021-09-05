/* eslint-disable no-console */
import {
  GetItemClassesResponse,
  GetItemPriceHistoriesResponse,
  GetItemResponse,
  GetPricelistResponse,
  IErrorResponse,
  IShortItem,
  ItemRecipeKind,
  QueryResponse,
} from "@sotah-inc/core";
import { IMessengers } from "@sotah-inc/server";
import { code } from "@sotah-inc/server/build/dist/messenger/contracts";
import { Response } from "express";
import HTTPStatus from "http-status";
import { string } from "yup";

import { resolveItem, resolveRealmSlug } from "./resolvers";
import { validate, validationErrorsToResponse } from "./validators";
import {
  createSchema,
  GameVersionRule,
  ItemIdRule,
  ItemIdsRule,
  LocaleRule,
} from "./validators/yup";

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

    const resolveItemResult = await resolveItem(
      validateParamsResult.body.gameVersion,
      validateQueryResult.body.locale,
      validateParamsResult.body.itemId,
      this.messengers.items,
    );
    if (resolveItemResult.errorResponse !== null) {
      return resolveItemResult.errorResponse;
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

    return {
      data: {
        item: resolveItemResult.data.item,
        itemRecipes: itemRecipeIdsResult[validateParamsResult.body.itemId],
      },
      status: HTTPStatus.OK,
    };
  }

  public async queryItems(
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<QueryResponse<IShortItem>>> {
    const validateQueryResult = await validate(
      createSchema({
        locale: LocaleRule,
        query: string(),
        gameVersion: GameVersionRule,
      }),
      req.query,
    );
    if (validateQueryResult.errors !== null) {
      return {
        data: validationErrorsToResponse(validateQueryResult.errors),
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    const results = await this.messengers.items.resolveQueryItems({
      locale: validateQueryResult.body.locale,
      query: validateQueryResult.body.query,
      game_version: validateQueryResult.body.gameVersion,
    });
    if (results === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      data: {
        items: results,
      },
      status: HTTPStatus.OK,
    };
  }

  public async getPricelist(
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<GetPricelistResponse>> {
    const resolveRealmSlugResult = await resolveRealmSlug(req.params, this.messengers.regions);
    if (resolveRealmSlugResult.errorResponse !== null) {
      return resolveRealmSlugResult.errorResponse;
    }

    const resolveQueryResult = await validate(createSchema({ locale: LocaleRule }), req.query);
    if (resolveQueryResult.errors !== null) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: validationErrorsToResponse(resolveQueryResult.errors),
      };
    }

    const itemIdsResult = await validate(
      createSchema({
        itemIds: ItemIdsRule,
      }),
      req.body,
    );
    if (itemIdsResult.errors !== null) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: validationErrorsToResponse(itemIdsResult.errors),
      };
    }

    const pricelistMessage = await this.messengers.liveAuctions.priceList({
      item_ids: itemIdsResult.body.itemIds,
      tuple: resolveRealmSlugResult.data.tuple,
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

    const itemsMessage = await this.messengers.items.items({
      itemIds: itemIdsResult.body.itemIds,
      locale: resolveQueryResult.body.locale,
      game_version: resolveRealmSlugResult.data.gameVersion,
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
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<GetItemPriceHistoriesResponse>> {
    const resolveRealmSlugResult = await resolveRealmSlug(req.params, this.messengers.regions);
    if (resolveRealmSlugResult.errorResponse !== null) {
      return resolveRealmSlugResult.errorResponse;
    }

    const resolveQueryResult = await validate(createSchema({ locale: LocaleRule }), req.query);
    if (resolveQueryResult.errors !== null) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: validationErrorsToResponse(resolveQueryResult.errors),
      };
    }

    const itemIdsResult = await validate(
      createSchema({
        itemIds: ItemIdsRule,
      }),
      req.body,
    );
    if (itemIdsResult.errors !== null) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: validationErrorsToResponse(itemIdsResult.errors),
      };
    }

    const currentUnixTimestamp = Math.floor(Date.now() / 1000);
    const lowerBounds = currentUnixTimestamp - 60 * 60 * 24 * 14;
    const itemPricesHistoryMessage = await this.messengers.general.resolveItemPricesHistory({
      item_ids: itemIdsResult.body.itemIds,
      lower_bounds: lowerBounds,
      tuple: resolveRealmSlugResult.data.tuple,
      upper_bounds: currentUnixTimestamp,
    });
    if (itemPricesHistoryMessage.code !== code.ok || itemPricesHistoryMessage.data === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const itemsMessage = await this.messengers.items.items({
      itemIds: itemIdsResult.body.itemIds,
      locale: resolveQueryResult.body.locale,
      game_version: resolveRealmSlugResult.data.gameVersion,
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
