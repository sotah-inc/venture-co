import { GetUnmetDemandResponse, ItemId, QueryGeneralResponse } from "@sotah-inc/core";
import { IMessengers, ProfessionPricelist } from "@sotah-inc/server";
import { code } from "@sotah-inc/server/build/dist/messenger/contracts";
import { Response } from "express";
import HTTPStatus from "http-status";
import { Connection } from "typeorm";
import * as yup from "yup";

import { resolveRealmSlug } from "./resolvers";
import { validate, validationErrorsToResponse } from "./validators";
import {
  createSchema,
  ExpansionNameRule,
  GameVersionRule,
  LocaleRule,
  RegionNameRule,
  SlugRule,
} from "./validators/yup";

import { IRequestResult, PlainRequest } from "./index";

export class DataController {
  private messengers: IMessengers;

  private dbConn: Connection;

  constructor(messengers: IMessengers, dbConn: Connection) {
    this.messengers = messengers;
    this.dbConn = dbConn;
  }

  public async queryGeneral(
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<QueryGeneralResponse>> {
    const validateQueryResult = await validate(
      createSchema({
        locale: LocaleRule,
        query: yup.string(),
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

    const results = await this.messengers.general.queryGeneral({
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

  public async getUnmetDemand(
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<GetUnmetDemandResponse>> {
    const validateParamsResult = await validate(
      createSchema({
        gameVersion: GameVersionRule,
        regionName: RegionNameRule,
        realmSlug: SlugRule,
        expansionName: ExpansionNameRule,
      }),
      req.params,
    );
    if (validateParamsResult.errors !== null) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: validationErrorsToResponse(validateParamsResult.errors),
      };
    }

    const validateQueryResult = await validate(
      createSchema({
        locale: LocaleRule,
      }),
      req.query,
    );
    if (validateQueryResult.errors !== null) {
      return {
        data: validationErrorsToResponse(validateQueryResult.errors),
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    const resolveRealmSlugResult = await resolveRealmSlug(
      {
        gameVersion: validateParamsResult.body.gameVersion,
        regionName: validateParamsResult.body.regionName,
        realmSlug: validateParamsResult.body.realmSlug,
      },
      this.messengers.regions,
    );
    if (resolveRealmSlugResult.errorResponse !== null) {
      return resolveRealmSlugResult.errorResponse;
    }

    // gathering profession-pricelists
    const professionPricelists = await this.dbConn.getRepository(ProfessionPricelist).find({
      where: { expansion: validateParamsResult.body.expansionName },
    });

    // gathering included item-ids
    const itemIds = professionPricelists.reduce(
      (previousValue: ItemId[], v: ProfessionPricelist) => {
        const pricelistItemIds = (v.pricelist?.entries ?? []).map(entry => entry.itemId);
        for (const itemId of pricelistItemIds) {
          if (previousValue.indexOf(itemId) === -1) {
            previousValue.push(itemId);
          }
        }

        return previousValue;
      },
      [],
    );

    // gathering items
    const itemsMsg = await this.messengers.items.items({
      itemIds,
      locale: validateQueryResult.body.locale,
      game_version: validateParamsResult.body.gameVersion,
    });
    if (itemsMsg.code !== code.ok) {
      return {
        data: { error: itemsMsg.error?.message },
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }
    const itemsResult = await itemsMsg.decode();
    if (!itemsResult) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    // gathering pricing data
    const pricelistMessage = await this.messengers.liveAuctions.priceList({
      item_ids: itemIds,
      tuple: resolveRealmSlugResult.data.tuple,
    });
    if (pricelistMessage.code !== code.ok) {
      return {
        data: { error: pricelistMessage.error?.message },
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }
    const pricelistResult = await pricelistMessage.decode();
    if (!pricelistResult) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    // gathering unmet items
    const unmetItemIds = itemIds.filter(
      v =>
        !Object.keys(pricelistResult.price_list).some(
          pricelistItemId => pricelistItemId === v.toString(),
        ),
    );

    // filtering in unmet profession-pricelists
    const unmetProfessionPricelists = professionPricelists.filter(v => {
      const unmetPricelistItemIds = (v.pricelist?.entries ?? [])
        .map(entry => entry.itemId)
        .filter(itemId => unmetItemIds.indexOf(itemId) > -1);

      return unmetPricelistItemIds.length > 0;
    });

    return {
      data: {
        items: itemsResult.items,
        professionPricelists: unmetProfessionPricelists.map(v => v.toJson()),
        unmetItemIds,
      },
      status: HTTPStatus.OK,
    };
  }
}
