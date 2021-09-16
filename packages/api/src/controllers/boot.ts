import { GetBootResponse, Locale } from "@sotah-inc/core";
import { IMessengers } from "@sotah-inc/server";
import { code } from "@sotah-inc/server/build/dist/messenger/contracts";
import { Response } from "express";
import HTTPStatus from "http-status";

import { resolveRegionComposites } from "./resolvers";
import { validate, validationErrorsToResponse } from "./validators";
import { createSchema, GameVersionRule } from "./validators/yup";

import { IRequestResult, PlainRequest } from "./index";

export class BootController {
  private messengers: IMessengers;

  constructor(messengers: IMessengers) {
    this.messengers = messengers;
  }

  public async getBoot(
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<GetBootResponse>> {
    const validateResult = await validate(
      createSchema({ game_version: GameVersionRule }),
      req.params,
    );
    if (validateResult.errors !== null) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: validationErrorsToResponse(validateResult.errors),
      };
    }

    const bootMessage = await this.messengers.boot.boot();
    if (bootMessage.code !== code.ok) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const bootResult = await bootMessage.decode();
    if (bootResult === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const resolveRegionCompositesResult = await resolveRegionComposites(
      bootResult.regions,
      validateResult.body.game_version,
      this.messengers.regions,
    );
    if (resolveRegionCompositesResult.errorResponse !== null) {
      return resolveRegionCompositesResult.errorResponse;
    }

    const professionsMessage = await this.messengers.professions.professions(Locale.EnUS);
    if (professionsMessage.code !== code.ok) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }
    const professionsResult = await professionsMessage.decode();
    if (professionsResult === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      data: {
        ...bootResult,
        regions: resolveRegionCompositesResult.data,
        professions: professionsResult.professions,
      },
      status: HTTPStatus.OK,
    };
  }
}
