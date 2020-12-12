import {
  GetBootResponse,
  GetConnectedRealmsResponse,
  GetPricelistHistoriesResponse,
  GetPricelistResponse,
  IConnectedRealmComposite,
  IGetBootResponseData,
  IGetPricelistHistoriesRequest,
  IGetPricelistHistoriesResponseData,
  IGetPricelistRequest,
  IGetPricelistResponseData,
  IQueryGeneralResponseData,
  ItemId,
  Locale,
  QueryGeneralRequest,
  QueryGeneralResponse,
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

export const queryGeneral = async (
  req: QueryGeneralRequest,
): Promise<IQueryGeneralResponseData | null> => {
  const { body, status } = await gatherWithQuery<QueryGeneralRequest, QueryGeneralResponse>({
    method: "GET",
    query: req,
    url: `${getApiEndpoint()}/query-general`,
  });
  if (status !== HTTPStatus.OK) {
    return null;
  }

  return body as IQueryGeneralResponseData;
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
