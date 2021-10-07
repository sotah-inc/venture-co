import {
  ConnectedRealmId,
  GameVersion,
  GetAuctionsResponse,
  IGetAuctionsRequest,
  IGetAuctionsResponseData,
  IQueryAuctionStatsResponseData,
  QueryAuctionStatsResponse,
  RealmSlug,
  RegionName,
} from "@sotah-inc/core";
import * as HTTPStatus from "http-status";

import { getApiEndpoint } from "./config";
import { gather, gatherWithQuery } from "./gather";

export interface IGetAuctionsOptions {
  gameVersion: GameVersion;
  regionName: RegionName;
  realmSlug: RealmSlug;
  request: IGetAuctionsRequest;
}

export async function getAuctions(
  opts: IGetAuctionsOptions,
): Promise<IGetAuctionsResponseData | null> {
  const { regionName, realmSlug, request, gameVersion } = opts;
  const { body, status } = await gatherWithQuery<IGetAuctionsRequest, GetAuctionsResponse>({
    method: "GET",
    query: request,
    url: [getApiEndpoint(), "auctions", gameVersion, regionName, realmSlug],
  });
  if (status !== HTTPStatus.OK) {
    return null;
  }

  return body as IGetAuctionsResponseData;
}

export interface IQueryAuctionStatsOptions {
  gameVersion: GameVersion;
  regionName?: RegionName;
  connectedRealmId?: ConnectedRealmId;
}

export interface IQueryAuctionStatsResult {
  response: IQueryAuctionStatsResponseData | null;
  error: string | null;
}

export async function queryAuctionStats({
  gameVersion,
  regionName,
  connectedRealmId,
}: IQueryAuctionStatsOptions): Promise<IQueryAuctionStatsResult> {
  const url = [
    getApiEndpoint(),
    "query-auction-stats",
    gameVersion,
    regionName,
    connectedRealmId?.toString(),
  ];

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

  return { response: body as IQueryAuctionStatsResponseData, error: null };
}
