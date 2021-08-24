import { IShortPet, QueryResponse } from "@sotah-inc/core";
import { IMessengers } from "@sotah-inc/server";
import { Response } from "express";
import HTTPStatus from "http-status";
import * as yup from "yup";

import { validate, validationErrorsToResponse } from "./validators";
import { createSchema, GameVersionRule, LocaleRule } from "./validators/yup";

import { IRequestResult, PlainRequest } from "./index";

export class PetsController {
  private messengers: IMessengers;

  constructor(messengers: IMessengers) {
    this.messengers = messengers;
  }

  public async queryPets(
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<QueryResponse<IShortPet>>> {
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

    // resolving pets-query message
    const results = await this.messengers.pets.resolveQueryPets({
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
}
