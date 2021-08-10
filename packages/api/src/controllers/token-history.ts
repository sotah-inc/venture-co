import { GetRegionTokenHistoryResponse, GetShortTokenHistoryResponse } from "@sotah-inc/core";
import { IMessengers } from "@sotah-inc/server";
import { code } from "@sotah-inc/server/build/dist/messenger/contracts";
import { Response } from "express";
import HTTPStatus from "http-status";

import { validate, validationErrorsToResponse } from "./validators";
import { createSchema, RegionNameRule } from "./validators/yup";

import { IRequestResult, PlainRequest } from "./index";

export class TokenHistoryController {
  private messengers: IMessengers;

  constructor(messengers: IMessengers) {
    this.messengers = messengers;
  }

  public async getRegionTokenHistory(
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<GetRegionTokenHistoryResponse>> {
    const validateParamsResult = await validate(
      createSchema({
        regionName: RegionNameRule,
      }),
      req.params,
    );
    if (validateParamsResult.errors !== null) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: validationErrorsToResponse(validateParamsResult.errors),
      };
    }

    const msg = await this.messengers.tokens.regionTokenHistory({
      region_name: validateParamsResult.body.regionName,
    });
    if (msg.code !== code.ok) {
      if (msg.code === code.notFound) {
        return {
          data: null,
          status: HTTPStatus.NOT_FOUND,
        };
      }

      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const regionTokenHistoryResult = await msg.decode();
    if (!regionTokenHistoryResult) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      data: { history: regionTokenHistoryResult },
      status: HTTPStatus.OK,
    };
  }

  public async getTokenHistory(
    _req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<GetShortTokenHistoryResponse>> {
    const msg = await this.messengers.tokens.tokenHistory();
    if (msg.code !== code.ok) {
      if (msg.code === code.notFound) {
        return {
          data: null,
          status: HTTPStatus.NOT_FOUND,
        };
      }

      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const tokenHistoryResult = await msg.decode();
    if (!tokenHistoryResult) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      data: { history: tokenHistoryResult.history },
      status: HTTPStatus.OK,
    };
  }
}
