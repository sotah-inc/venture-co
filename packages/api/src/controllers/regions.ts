import { GetConnectedRealmsResponse, StatusKind } from "@sotah-inc/core";
import { IMessengers } from "@sotah-inc/server";
import { Response } from "express";
import HTTPStatus from "http-status";
import moment from "moment";

import { resolveConnectedRealms } from "./resolvers";
import { validate, validationErrorsToResponse } from "./validators";
import { createSchema, GameVersionRule, RegionNameRule } from "./validators/yup";

import { IRequestResult, PlainRequest } from "./index";

export class RegionsController {
  private messengers: IMessengers;

  constructor(messengers: IMessengers) {
    this.messengers = messengers;
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

    const resolveConnectedRealmsResult = await resolveConnectedRealms(
      validateParamsResult.body.gameVersion,
      validateParamsResult.body.regionName,
      this.messengers.regions,
    );
    if (resolveConnectedRealmsResult.errorResponse !== null) {
      return resolveConnectedRealmsResult.errorResponse;
    }

    const lastModifiedDate: moment.Moment | null = (() => {
      const latestDownloaded = resolveConnectedRealmsResult.data.reduce<number | null>(
        (result, connectedRealm) => {
          const foundTimestamp = connectedRealm.status_timestamps[StatusKind.Downloaded];
          if (foundTimestamp === undefined) {
            return result;
          }

          if (result === null || foundTimestamp > result) {
            return foundTimestamp;
          }

          return result;
        },
        null,
      );

      if (latestDownloaded === null) {
        return null;
      }

      return moment(latestDownloaded * 1000).utc();
    })();
    if (lastModifiedDate === null) {
      return {
        data: { connectedRealms: resolveConnectedRealmsResult.data },
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
        data: { connectedRealms: resolveConnectedRealmsResult.data },
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
      data: { connectedRealms: resolveConnectedRealmsResult.data },
      headers,
      status: HTTPStatus.OK,
    };
  }
}
