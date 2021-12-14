import { GetConnectedRealmsResponse, StatusKind } from "@sotah-inc/core";
import { GetRegionResponse } from "@sotah-inc/core/build/dist/types/contracts/data";
import { IMessengers } from "@sotah-inc/server";
import { code } from "@sotah-inc/server/build/dist/messenger/contracts";
import { Response } from "express";
import HTTPStatus from "http-status";
import moment from "moment";

import { resolveConnectedRealms } from "./resolvers";
import { validate, validationErrorsToResponse } from "./validators";
import { createSchema, GameVersionRule, LocaleRule, RegionNameRule } from "./validators/yup";

import { IRequestResult, PlainRequest } from "./index";

export class RegionsController {
  private messengers: IMessengers;

  constructor(messengers: IMessengers) {
    this.messengers = messengers;
  }

  public async getRegion(
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<GetRegionResponse>> {
    // validating params
    const validateParamsResult = await validate(
      createSchema({
        gameVersion: GameVersionRule,
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

    // validating query
    const validateQueryResult = await validate(createSchema({ locale: LocaleRule }), req.query);
    if (validateQueryResult.errors !== null) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: validationErrorsToResponse(validateQueryResult.errors),
      };
    }

    // resolving boot
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

    // resolving connected-realms
    const resolveConnectedRealmsResult = await resolveConnectedRealms(
      validateParamsResult.body.gameVersion,
      validateParamsResult.body.regionName,
      this.messengers.regions,
    );
    if (resolveConnectedRealmsResult.errorResponse !== null) {
      return resolveConnectedRealmsResult.errorResponse;
    }

    // resolving professions
    const professionsMsg = await this.messengers.professions.professions(
      validateQueryResult.body.locale,
    );
    if (professionsMsg.code !== code.ok) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    const professionsResult = await professionsMsg.decode();
    if (professionsResult === null) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      data: {
        connectedRealms: resolveConnectedRealmsResult.data,
        professions: professionsResult.professions,
      },
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
