import { GetConnectedRealmsResponse, StatusKind } from "@sotah-inc/core";
import { GetRegionsResponse } from "@sotah-inc/core/build/dist/types/contracts/data";
import { IMessengers } from "@sotah-inc/server";
import { code } from "@sotah-inc/server/build/dist/messenger/contracts";
import { Response } from "express";
import HTTPStatus from "http-status";
import moment from "moment";

import { validate, validationErrorsToResponse } from "./validators";
import { createSchema, GameVersionRule, RegionNameRule } from "./validators/yup";

import { IRequestResult, PlainRequest } from "./index";

export class RegionsController {
  private messengers: IMessengers;

  constructor(messengers: IMessengers) {
    this.messengers = messengers;
  }

  public async getRegions(
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<GetRegionsResponse>> {
    const validateParamsResult = await validate(
      createSchema({
        gameVersion: GameVersionRule,
      }),
      req.params,
    );
    if (validateParamsResult.errors !== null) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: validationErrorsToResponse(validateParamsResult.errors),
      };
    }

    return {
      data: null,
      status: HTTPStatus.INTERNAL_SERVER_ERROR,
    };
  }

  public async getConnectedRealms(
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<GetConnectedRealmsResponse>> {
    const validateParamsResult = await validate(
      createSchema({
        regionName: RegionNameRule,
        gameVersion: GameVersionRule,
      }),
      req.params,
    );
    if (validateParamsResult.errors !== null) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: validationErrorsToResponse(validateParamsResult.errors),
      };
    }

    const realmsMessage = await this.messengers.regions.connectedRealms({
      region_name: validateParamsResult.body.regionName,
      game_version: validateParamsResult.body.gameVersion,
    });
    switch (realmsMessage.code) {
    case code.notFound:
      return { status: HTTPStatus.NOT_FOUND, data: null };
    default:
      if (realmsMessage.code !== code.ok) {
        return { status: HTTPStatus.INTERNAL_SERVER_ERROR, data: null };
      }

      break;
    }

    const realmsResult = await realmsMessage.decode();
    if (realmsResult === null) {
      return { status: HTTPStatus.INTERNAL_SERVER_ERROR, data: null };
    }
    const data = { connectedRealms: realmsResult };

    const lastModifiedDate: moment.Moment | null = (() => {
      const latestDownloaded = realmsResult.reduce<number | null>((result, connectedRealm) => {
        const foundTimestamp = connectedRealm.status_timestamps[StatusKind.Downloaded];
        if (foundTimestamp === undefined) {
          return result;
        }

        if (result === null || foundTimestamp > result) {
          return foundTimestamp;
        }

        return result;
      }, null);

      if (latestDownloaded === null) {
        return null;
      }

      return moment(latestDownloaded * 1000).utc();
    })();
    if (lastModifiedDate === null) {
      return {
        data,
        status: HTTPStatus.OK,
      };
    }

    const headers = {
      "Cache-Control": ["public", `max-age=${60 * 30}`],
      "Last-Modified": `${lastModifiedDate.format("ddd, DD MMM YYYY HH:mm:ss")} GMT`,
    };

    const ifModifiedSince = req.header("if-modified-since");
    if (ifModifiedSince === undefined) {
      return {
        data,
        headers,
        status: HTTPStatus.OK,
      };
    }

    const ifModifiedSinceDate = moment(new Date(ifModifiedSince)).utc();
    if (lastModifiedDate.isSameOrBefore(ifModifiedSinceDate)) {
      return {
        data: null,
        headers,
        status: HTTPStatus.NOT_MODIFIED,
      };
    }

    return {
      data,
      headers,
      status: HTTPStatus.OK,
    };
  }
}
