import {
  GetAuctionsResponse,
  GetBootResponse,
  GetConnectedRealmsResponse,
  GetItemResponse,
  GetPostsResponse,
  GetPricelistHistoriesResponse,
  GetPricelistResponse,
  GetTokenHistoryResponse,
  IErrorResponse,
  IGetAuctionsRequest,
  IGetAuctionsResponseData,
  IGetBootResponseData,
  IGetItemResponseData,
  IGetPricelistHistoriesRequest,
  IGetPricelistHistoriesResponseData,
  IGetPricelistRequest,
  IGetPricelistResponseData,
  IItem,
  IPostJson,
  IQueryAuctionStatsResponseData,
  IQueryItemsRequest,
  IQueryItemsResponseData,
  IRealmComposite,
  ItemId,
  ITokenHistory,
  QueryAuctionStatsResponse,
  QueryItemsResponse,
  RealmSlug,
  RegionName,
} from "@sotah-inc/core";
import * as HTTPStatus from "http-status";

import { gather, gatherWithQuery, getApiEndpoint } from "./index";

export const getPing = async (): Promise<boolean> => {
  try {
    await fetch(`${getApiEndpoint()}/ping`);
    return true;
  } catch (err) {
    return false;
  }
};

export const getBoot = async (): Promise<IGetBootResponseData | null> => {
  const { body, status } = await gather<null, GetBootResponse>({
    url: `${getApiEndpoint()}/boot`,
  });
  if (status !== HTTPStatus.OK) {
    return null;
  }

  return body;
};

export const getStatus = async (regionName: RegionName): Promise<IRealmComposite[] | null> => {
  const { body, status } = await gather<null, GetConnectedRealmsResponse>({
    url: `${getApiEndpoint()}/region/${regionName}/realms`,
  });
  if (status !== HTTPStatus.OK) {
    return null;
  }

  return body!.connectedRealms;
};

export interface IGetAuctionsOptions {
  regionName: string;
  realmSlug: string;
  request: IGetAuctionsRequest;
}

export const getAuctions = async (
  opts: IGetAuctionsOptions,
): Promise<IGetAuctionsResponseData | null> => {
  const { regionName, realmSlug, request } = opts;
  const { body, status } = await gatherWithQuery<IGetAuctionsRequest, GetAuctionsResponse>({
    method: "GET",
    query: request,
    url: `${getApiEndpoint()}/region/${regionName}/realm/${realmSlug}/auctions`,
  });
  if (status !== HTTPStatus.OK) {
    return null;
  }

  return body as IGetAuctionsResponseData;
};

export const getItems = async (query: string): Promise<IQueryItemsResponseData | null> => {
  const { body, status } = await gather<IQueryItemsRequest, QueryItemsResponse>({
    body: { query },
    method: "POST",
    url: `${getApiEndpoint()}/items`,
  });
  if (status !== HTTPStatus.OK) {
    return null;
  }

  return body as IQueryItemsResponseData;
};

export interface IGetItemResult {
  item: IItem | null;
  error: string | null;
}

export const getItem = async (itemId: ItemId): Promise<IGetItemResult> => {
  const { body, status } = await gather<null, GetItemResponse>({
    method: "GET",
    url: `${getApiEndpoint()}/item/${itemId}`,
  });
  if (status !== HTTPStatus.OK) {
    return {
      error: (body as IErrorResponse).error,
      item: null,
    };
  }

  return {
    error: null,
    item: (body as IGetItemResponseData).item,
  };
};

export interface IQueryAuctionsOptions {
  regionName: string;
  realmSlug: string;
  query: string;
}

export interface IGetPriceListOptions {
  regionName: string;
  realmSlug: string;
  itemIds: ItemId[];
}

export const getPriceList = async (
  opts: IGetPriceListOptions,
): Promise<IGetPricelistResponseData | null> => {
  const { regionName, realmSlug, itemIds } = opts;
  const { body, status } = await gather<IGetPricelistRequest, GetPricelistResponse>({
    body: { item_ids: itemIds },
    method: "POST",
    url: `${getApiEndpoint()}/region/${regionName}/realm/${realmSlug}/price-list`,
  });
  if (status !== HTTPStatus.OK) {
    return null;
  }

  return body;
};

export interface IGetPriceListHistoryOptions extends IGetPriceListOptions {
  regionName: string;
  realmSlug: string;
  itemIds: ItemId[];
}

export const getPriceListHistory = async (
  opts: IGetPriceListHistoryOptions,
): Promise<IGetPricelistHistoriesResponseData | null> => {
  const { regionName, realmSlug, itemIds } = opts;
  const { body, status } = await gather<
    IGetPricelistHistoriesRequest,
    GetPricelistHistoriesResponse
  >({
    body: { item_ids: itemIds },
    headers: new Headers({
      "content-type": "application/json",
    }),
    method: "POST",
    url: `${getApiEndpoint()}/region/${regionName}/realm/${realmSlug}/price-list-history`,
  });
  if (status !== HTTPStatus.OK) {
    return null;
  }

  return body;
};

export interface IGetPostsResult {
  posts: IPostJson[];
  error?: string;
}

export const getPosts = async (): Promise<IGetPostsResult> => {
  const { body, status } = await gather<null, GetPostsResponse>({
    headers: new Headers({ "content-type": "application/json" }),
    method: "GET",
    url: `${getApiEndpoint()}/posts`,
  });

  switch (status) {
    case HTTPStatus.OK:
      break;
    default:
      return { posts: [], error: "Failure" };
  }

  return { posts: body!.posts };
};

export interface IGetTokenHistoryResult {
  history: ITokenHistory | null;
  error: string | null;
}

export const getTokenHistory = async (regionName: RegionName): Promise<IGetTokenHistoryResult> => {
  const { body, status } = await gather<null, GetTokenHistoryResponse>({
    headers: new Headers({ "content-type": "application/json" }),
    method: "GET",
    url: `${getApiEndpoint()}/region/${regionName}/token-history`,
  });

  switch (status) {
    case HTTPStatus.OK:
      break;
    default:
      return { history: null, error: "Failure" };
  }

  return { history: body!.history, error: null };
};

export interface IQueryAuctionStatsOptions {
  regionName?: RegionName;
  realmSlug?: RealmSlug;
}

export interface IQueryAuctionStatsResult {
  response: IQueryAuctionStatsResponseData | null;
  error: string | null;
}

export const queryAuctionStats = async ({
  regionName,
  realmSlug,
}: IQueryAuctionStatsOptions): Promise<IQueryAuctionStatsResult> => {
  const url: string = (() => {
    if (typeof regionName === "undefined") {
      return `${getApiEndpoint()}/query-auction-stats`;
    }

    if (typeof realmSlug === "undefined") {
      return `${getApiEndpoint()}/region/${regionName}/query-auction-stats`;
    }

    return `${getApiEndpoint()}/region/${regionName}/realm/${realmSlug}/query-auction-stats`;
  })();

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
