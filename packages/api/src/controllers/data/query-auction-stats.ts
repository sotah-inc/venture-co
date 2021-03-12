import {
  ConnectedRealmId,
  IRegionConnectedRealmTuple,
  QueryAuctionStatsResponse,
  RegionName,
} from "@sotah-inc/core";
import { IMessengers } from "@sotah-inc/server";
import { code } from "@sotah-inc/server/build/dist/messenger/contracts";
import HTTPStatus from "http-status";

import { IRequestResult } from "../index";

export class QueryAuctionStatsController {
  private messengers: IMessengers;

  constructor(messengers: IMessengers) {
    this.messengers = messengers;
  }

  public async queryAuctionStats(
    regionName?: RegionName,
    connectedRealmId?: ConnectedRealmId,
  ): Promise<IRequestResult<QueryAuctionStatsResponse>> {
    const params = ((): Partial<IRegionConnectedRealmTuple> => {
      if (typeof regionName === "undefined" || regionName.length === 0) {
        return {};
      }

      if (typeof connectedRealmId === "undefined") {
        return { region_name: regionName };
      }

      return {
        connected_realm_id: Number(connectedRealmId),
        region_name: regionName,
      };
    })();

    const msg = await this.messengers.auctions.queryAuctionStats(params);
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
