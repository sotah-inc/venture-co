import {
  ConnectedRealmId,
  GetAuctionsResponse,
  GetBootResponse,
  GetConnectedRealmsResponse,
  GetItemResponse,
  GetPostsResponse,
  GetPricelistHistoriesResponse,
  GetPricelistResponse,
  GetTokenHistoryResponse,
  IConnectedRealmComposite,
  IErrorResponse,
  IGetAuctionsRequest,
  IGetAuctionsResponseData,
  IGetBootResponseData,
  IGetItemResponseData,
  IGetPricelistHistoriesRequest,
  IGetPricelistHistoriesResponseData,
  IGetPricelistRequest,
  IGetPricelistResponseData,
  IPostJson,
  IQueryAuctionStatsResponseData,
  IQueryItemsRequest,
  IQueryItemsResponseData,
  IQueryPetsResponseData,
  IShortItem,
  ItemId,
  ITokenHistory,
  Locale,
  QueryAuctionStatsResponse,
  QueryItemsResponse,
  QueryPetsRequest,
  QueryPetsResponse,
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

export const getConnectedRealms = async (
  regionName: RegionName,
): Promise<IConnectedRealmComposite[] | null> => {
  const { body, status } = await gather<null, GetConnectedRealmsResponse>({
    url: `${getApiEndpoint()}/connected-realms/${regionName}`,
  });
  if (status !== HTTPStatus.OK) {
    return null;
  }

  return body!.connectedRealms;
};

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

export const getItems = async (
  req: IQueryItemsRequest,
): Promise<IQueryItemsResponseData | null> => {
  const { body, status } = await gatherWithQuery<IQueryItemsRequest, QueryItemsResponse>({
    method: "GET",
    query: req,
    url: `${getApiEndpoint()}/items`,
  });
  if (status !== HTTPStatus.OK) {
    return null;
  }

  return body as IQueryItemsResponseData;
};

export const getPets = async (req: QueryPetsRequest): Promise<IQueryPetsResponseData | null> => {
  const { body, status } = await gatherWithQuery<QueryPetsRequest, QueryPetsResponse>({
    method: "GET",
    query: req,
    url: `${getApiEndpoint()}/pets`,
  });
  if (status !== HTTPStatus.OK) {
    return null;
  }

  return body as IQueryPetsResponseData;
};

export interface IGetItemResult {
  item: IShortItem | null;
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

export interface IGetPriceListOptions {
  regionName: RegionName;
  realmSlug: RealmSlug;
  itemIds: ItemId[];
  locale: Locale;
}

export const getPriceList = async (
  opts: IGetPriceListOptions,
): Promise<IGetPricelistResponseData | null> => {
  const { regionName, realmSlug, itemIds } = opts;
  const { body, status } = await gatherWithQuery<
    { locale: Locale },
    GetPricelistResponse,
    IGetPricelistRequest
  >({
    body: { item_ids: itemIds },
    method: "POST",
    query: { locale: opts.locale },
    url: `${getApiEndpoint()}/price-list/${regionName}/${realmSlug}`,
  });
  if (status !== HTTPStatus.OK) {
    return null;
  }

  return body as IGetPricelistResponseData;
};

export interface IGetPriceListHistoryOptions {
  regionName: RegionName;
  realmSlug: RealmSlug;
  itemIds: ItemId[];
  locale: Locale;
}

export const getPriceListHistory = async (
  opts: IGetPriceListHistoryOptions,
): Promise<IGetPricelistHistoriesResponseData | null> => {
  const { regionName, realmSlug, itemIds } = opts;
  const { body, status } = await gatherWithQuery<
    { locale: Locale },
    GetPricelistHistoriesResponse,
    IGetPricelistHistoriesRequest
  >({
    body: { item_ids: itemIds },
    headers: new Headers({
      "content-type": "application/json",
    }),
    method: "POST",
    query: { locale: opts.locale },
    url: `${getApiEndpoint()}/price-list-history/${regionName}/${realmSlug}`,
  });
  if (status !== HTTPStatus.OK) {
    return null;
  }

  return body as IGetPricelistHistoriesResponseData;
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
    url: `${getApiEndpoint()}/token-history/${regionName}`,
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
