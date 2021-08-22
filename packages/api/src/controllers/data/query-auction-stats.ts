import { QueryAuctionStatsResponse } from "@sotah-inc/core";
import { IMessengers } from "@sotah-inc/server";
import { code } from "@sotah-inc/server/build/dist/messenger/contracts";
import { Response } from "express";
import HTTPStatus from "http-status";

import { IRequestResult, PlainRequest } from "../index";
import { resolveRealmSlug } from "../resolvers";

export class QueryAuctionStatsController {
  private messengers: IMessengers;

  constructor(messengers: IMessengers) {
    this.messengers = messengers;
  }

  public async queryAuctionStats(
    req: PlainRequest,
    _res: Response,
  ): Promise<IRequestResult<QueryAuctionStatsResponse>> {
    const resolveRealmSlugResult = await resolveRealmSlug(req.params, this.messengers.regions);
    if (resolveRealmSlugResult.errorResponse !== null) {
      return resolveRealmSlugResult.errorResponse;
    }

    const msg = await this.messengers.stats.queryAuctionStats(resolveRealmSlugResult.data.tuple);
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
