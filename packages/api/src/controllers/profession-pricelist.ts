import {
  GetProfessionPricelistResponse,
  GetProfessionPricelistsResponse,
  ItemId,
  IValidationErrorResponse,
} from "@sotah-inc/core";
import { IMessengers, ProfessionPricelist, ProfessionPricelistRepository } from "@sotah-inc/server";
import { code } from "@sotah-inc/server/build/dist/messenger/contracts";
import { Response } from "express";
import HTTPStatus from "http-status";
import { Connection } from "typeorm";

import { validate, validationErrorsToResponse } from "./validators";
import {
  createSchema,
  ExpansionNameRule,
  GameVersionRule,
  LocaleRule,
  ProfessionIdRule,
  SlugRule,
} from "./validators/yup";

import { IRequestResult, PlainRequest } from "./index";

export class ProfessionPricelistController {
  private messengers: IMessengers;

  private dbConn: Connection;

  constructor(messengers: IMessengers, dbConn: Connection) {
    this.messengers = messengers;
    this.dbConn = dbConn;
  }

  public async getProfessionPricelists(
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<GetProfessionPricelistsResponse>> {
    const validateParamsResult = await validate(
      createSchema({
        gameVersion: GameVersionRule,
        expansionName: ExpansionNameRule,
        professionId: ProfessionIdRule,
      }),
      req.params,
    );
    if (validateParamsResult.errors !== null) {
      return {
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
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
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
        data: validationErrorsToResponse(validateQueryResult.errors),
      };
    }

    // gathering profession-pricelists
    const professionPricelists = await this.dbConn.getRepository(ProfessionPricelist).find({
      where: {
        professionId: validateParamsResult.body.professionId,
        expansion: validateParamsResult.body.professionId,
      },
    });

    // gathering related items
    const itemIds: ItemId[] = professionPricelists.reduce(
      (pricelistItemIds: ItemId[], professionPricelist) => {
        return (professionPricelist.pricelist?.entries ?? []).reduce(
          (entryItemIds: ItemId[], entry) => {
            if (entryItemIds.indexOf(entry.itemId) === -1) {
              entryItemIds.push(entry.itemId);
            }

            return entryItemIds;
          },
          pricelistItemIds,
        );
      },
      [],
    );

    const itemsMessage = await this.messengers.items.items({
      itemIds,
      locale: validateQueryResult.body.locale,
      game_version: validateParamsResult.body.gameVersion,
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

    // dumping out a response
    return {
      data: {
        items: itemsResult.items,
        profession_pricelists: professionPricelists.map(v => v.toJson()),
      },
      status: HTTPStatus.OK,
    };
  }

  public async getProfessionPricelist(
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<GetProfessionPricelistResponse>> {
    const validateParamsResult = await validate(
      createSchema({
        professionId: ProfessionIdRule,
        expansionName: ExpansionNameRule,
        pricelistSlug: SlugRule,
      }),
      req.params,
    );
    if (validateParamsResult.errors !== null) {
      return {
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
        data: validationErrorsToResponse(validateParamsResult.errors),
      };
    }

    const professionPricelist = await this.dbConn
      .getCustomRepository(ProfessionPricelistRepository)
      .getFromPricelistSlug(
        validateParamsResult.body.professionId,
        validateParamsResult.body.expansionName,
        validateParamsResult.body.pricelistSlug,
      );
    if (professionPricelist === null) {
      return {
        data: null,
        status: HTTPStatus.NOT_FOUND,
      };
    }

    if (typeof professionPricelist.pricelist === "undefined") {
      const validationErrors: IValidationErrorResponse = {
        error: "profession-pricelist pricelist was undefined.",
      };

      return {
        data: validationErrors,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    if (typeof professionPricelist.pricelist.user === "undefined") {
      const validationErrors: IValidationErrorResponse = {
        error: "profession-pricelist pricelist user was undefined.",
      };

      return {
        data: validationErrors,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    if (typeof professionPricelist.pricelist.entries === "undefined") {
      const validationErrors: IValidationErrorResponse = {
        error: "profession-pricelist pricelist entries was undefined.",
      };

      return {
        data: validationErrors,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      data: professionPricelist.toJson(),
      status: HTTPStatus.OK,
    };
  }
}
