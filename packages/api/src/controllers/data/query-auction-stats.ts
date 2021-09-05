import { QueryAuctionStatsResponse } from "@sotah-inc/core";
import { IMessengers } from "@sotah-inc/server";
import { code } from "@sotah-inc/server/build/dist/messenger/contracts";
import { Response } from "express";
import HTTPStatus from "http-status";
import { z } from "zod";

import { IRequestResult, PlainRequest } from "../index";
import { resolveRealmSlug, ResolveResult } from "../resolvers";
import { validate, validationErrorsToResponse } from "../validators";

export class QueryAuctionStatsController {
  private messengers: IMessengers;

  constructor(messengers: IMessengers) {
    this.messengers = messengers;
  }

  public async queryAuctionStats(
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<QueryAuctionStatsResponse>> {
    const validateParamsResult = await validate(
      z.object({
        gameVersion: z.string().nonempty(),
        regionName: z.string().optional(),
        realmSlug: z.string().optional(),
      }),
      req.params,
    );
    if (validateParamsResult.errors !== null) {
      return {
        status: HTTPStatus.BAD_REQUEST,
        data: validationErrorsToResponse(validateParamsResult.errors),
      };
    }

    const connectedRealmIdResult = await (async (): Promise<ResolveResult<number>> => {
      if (validateParamsResult.body.regionName === undefined) {
        return {
          errorResponse: null,
          data: 0,
        };
      }

      if (validateParamsResult.body.realmSlug === undefined) {
        return {
          errorResponse: null,
          data: 0,
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
        return {
          errorResponse: resolveRealmSlugResult.errorResponse,
        };
      }

      return {
        errorResponse: null,
        data: resolveRealmSlugResult.data.connectedRealm.connected_realm.id,
      };
    })();
    if (connectedRealmIdResult.errorResponse !== null) {
      return connectedRealmIdResult.errorResponse;
    }

    const msg = await this.messengers.stats.queryAuctionStats({
      game_version: validateParamsResult.body.gameVersion,
      region_name: validateParamsResult.body.regionName ?? "",
      connected_realm_id: connectedRealmIdResult.data,
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

    const auctionStatsResult = await msg.decode();
    if (!auctionStatsResult) {
      return {
        data: null,
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      data: auctionStatsResult,
      status: HTTPStatus.OK,
    };
  }
}
