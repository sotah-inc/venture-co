import {
  ConnectedRealmId,
  GetAuctionsResponse,
  IGetAuctionsRequest,
  IGetAuctionsResponseData,
  IQueryAuctionStatsResponseData,
  QueryAuctionStatsResponse,
  RealmSlug,
  RegionName,
} from "@sotah-inc/core";
import * as HTTPStatus from "http-status";

import { gather, gatherWithQuery, getApiEndpoint } from "./index";

export interface IGetAuctionsOptions {
  regionName: RegionName;
  realmSlug: RealmSlug;
  request: IGetAuctionsRequest;
}

export const getAuctions = async (
  opts: IGetAuctionsOptions,
): Promise<IGetAuctionsResponseData | null> => {
  const { regionName, realmSlug, request } = opts;
  const { body, status } = await gatherWithQuery<IGetAuctionsRequest, GetAuctionsResponse>({
    method: "GET",
    query: request,
    url: `${getApiEndpoint()}/auctions/${regionName}/${realmSlug}`,
  });
  if (status !== HTTPStatus.OK) {
    return null;
  }

  return body as IGetAuctionsResponseData;
};

export interface IQueryAuctionStatsOptions {
  regionName?: RegionName;
  connectedRealmId?: ConnectedRealmId;
}

export interface IQueryAuctionStatsResult {
  response: IQueryAuctionStatsResponseData | null;
  error: string | null;
}

export const queryAuctionStats = async ({
  regionName,
  connectedRealmId,
}: IQueryAuctionStatsOptions): Promise<IQueryAuctionStatsResult> => {
  const url = [getApiEndpoint(), "query-auction-stats", regionName, connectedRealmId?.toString()];

  const { body, status } = await gather<null, QueryAuctionStatsResponse>({
    headers: new Headers({ "content-type": "application/json" }),
    method: "GET",
    url,
  });

  switch (status) {
    case HTTPStatus.OK:
      break;
    default:
      return { response: null, error: "Failure" };
  }

  return { response: body, error: null };
};
