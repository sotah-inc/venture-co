import {
  IErrorResponse,
  IGetAuctionsRequest,
  IGetAuctionsResponse,
  IGetBootResponse,
  IGetItemResponse,
  IGetPostsResponse,
  IGetPricelistHistoriesRequest,
  IGetPricelistHistoriesResponse,
  IGetPricelistRequest,
  IGetPricelistResponse,
  IGetRealmsResponse,
  IGetTokenHistoryResponse,
  IItem,
  IPostJson,
  IQueryAuctionsRequest,
  IQueryAuctionsResponse,
  IQueryItemsRequest,
  IQueryItemsResponse,
  IStatusRealm,
  ItemId,
  ITokenHistory,
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

export const getBoot = async (): Promise<IGetBootResponse | null> => {
  const { body, status } = await gather<null, IGetBootResponse>({
    url: `${getApiEndpoint()}/boot`,
  });
  if (status !== HTTPStatus.OK) {
    return null;
  }

  return body;
};

export const getStatus = async (regionName: RegionName): Promise<IStatusRealm[] | null> => {
  const { body, status } = await gather<null, IGetRealmsResponse>({
    url: `${getApiEndpoint()}/region/${regionName}/realms`,
  });
  if (status !== HTTPStatus.OK) {
    return null;
  }

  return body!.realms;
};

export interface IGetAuctionsOptions {
  regionName: string;
  realmSlug: string;
  request: IGetAuctionsRequest;
}

export const getAuctions = async (
  opts: IGetAuctionsOptions,
): Promise<IGetAuctionsResponse | null> => {
  const { regionName, realmSlug, request } = opts;
  const { body, status } = await gatherWithQuery<IGetAuctionsRequest, IGetAuctionsResponse>({
    method: "GET",
    query: request,
    url: `${getApiEndpoint()}/region/${regionName}/realm/${realmSlug}/auctions`,
  });
  if (status !== HTTPStatus.OK) {
    return null;
  }

  return body;
};

export const getItems = async (query: string): Promise<IQueryItemsResponse | null> => {
  const { body, status } = await gather<IQueryItemsRequest, IQueryItemsResponse>({
    body: { query },
    method: "POST",
    url: `${getApiEndpoint()}/items`,
  });
  if (status !== HTTPStatus.OK) {
    return null;
  }

  return body;
};

export interface IGetItemResult {
  item: IItem | null;
  error: string | null;
}

export const getItem = async (itemId: ItemId): Promise<IGetItemResult> => {
  const { body, status } = await gather<null, IGetItemResponse | IErrorResponse>({
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
    item: (body as IGetItemResponse).item,
  };
};

export interface IQueryAuctionsOptions {
  regionName: string;
  realmSlug: string;
  query: string;
}

export const queryAuctions = async (
  opts: IQueryAuctionsOptions,
): Promise<IQueryAuctionsResponse | null> => {
  const { regionName, realmSlug, query } = opts;
  const { body, status } = await gather<IQueryAuctionsRequest, IQueryAuctionsResponse>({
    body: { query },
    method: "POST",
    url: `${getApiEndpoint()}/region/${regionName}/realm/${realmSlug}/query-auctions`,
  });
  if (status !== HTTPStatus.OK) {
    return null;
  }

  return body;
};

export interface IGetPriceListOptions {
  regionName: string;
  realmSlug: string;
  itemIds: ItemId[];
}

export const getPriceList = async (
  opts: IGetPriceListOptions,
): Promise<IGetPricelistResponse | null> => {
  const { regionName, realmSlug, itemIds } = opts;
  const { body, status } = await gather<IGetPricelistRequest, IGetPricelistResponse>({
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
): Promise<IGetPricelistHistoriesResponse | null> => {
  const { regionName, realmSlug, itemIds } = opts;
  const { body, status } = await gather<
    IGetPricelistHistoriesRequest,
    IGetPricelistHistoriesResponse
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
  const { body, status } = await gather<null, IGetPostsResponse>({
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
  const { body, status } = await gather<null, IGetTokenHistoryResponse>({
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
