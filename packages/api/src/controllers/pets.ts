import { IShortPet, Locale, QueryResponse } from "@sotah-inc/core";
import { IMessengers } from "@sotah-inc/server";
import { Response } from "express";
import HTTPStatus from "http-status";

import { validate, validationErrorsToResponse } from "./validators";
import { QueryParamRules } from "./validators/yup";

import { IRequestResult, PlainRequest } from "./index";

export class DataController {
  private messengers: IMessengers;

  constructor(messengers: IMessengers) {
    this.messengers = messengers;
  }

  public async queryPets(
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<QueryResponse<IShortPet>>> {
    const validateQueryResult = await validate(QueryParamRules, req.query);
    if (validateQueryResult.errors !== null) {
      return {
        data: validationErrorsToResponse(validateQueryResult.errors),
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    // resolving pets-query message
    const results = await this.messengers.pets.resolveQueryPets({
      locale: validateQueryResult.body.locale as Locale,
      query: validateQueryResult.body.query ?? "",
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
