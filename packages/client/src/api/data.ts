import {
  GetBootResponse,
  GetConnectedRealmsResponse,
  GetPricelistResponse,
  IConnectedRealmComposite,
  IGetBootResponseData,
  IGetItemClassesResponseData,
  IGetPricelistRequest,
  IGetPricelistResponseData,
  IQueryGeneralResponseData,
  ItemId,
  Locale,
  QueryGeneralRequest,
  QueryGeneralResponse,
  RealmSlug,
  RegionName,
  GetItemClassesResponse,
  RegionVersionTuple,
} from "@sotah-inc/core";
import { IGetConnectedRealmsResponseData } from "@sotah-inc/core/build/dist/types/contracts/data";
import * as HTTPStatus from "http-status";

import { getApiEndpoint } from "./config";
import { gather, gatherWithQuery } from "./gather";

export async function getBoot(): Promise<IGetBootResponseData | null> {
  const { body, status } = await gather<null, GetBootResponse>({
    url: `${getApiEndpoint()}/boot`,
  });
  if (status !== HTTPStatus.OK) {
    return null;
  }

  return body as IGetBootResponseData;
}

export async function getItemClasses(): Promise<IGetItemClassesResponseData | null> {
  const { body, status } = await gather<null, GetItemClassesResponse>({
    url: `${getApiEndpoint()}/item-classes`,
  });
  if (status !== HTTPStatus.OK) {
    return null;
  }

  return body;
}

export interface IGetConnectedRealmsOptions {
  tuple: RegionVersionTuple;
  locale: Locale;
}

export async function getConnectedRealms(
  opts: IGetConnectedRealmsOptions,
): Promise<IConnectedRealmComposite[] | null> {
  const { body, status } = await gatherWithQuery<{ locale: Locale }, GetConnectedRealmsResponse>({
    url: [getApiEndpoint(), "connected-realms", opts.tuple.game_version, opts.tuple.region_name],
    query: {
      locale: opts.locale,
    },
  });
  if (status !== HTTPStatus.OK || body === null) {
    return null;
  }

  return (body as IGetConnectedRealmsResponseData).connectedRealms;
}

export async function queryGeneral(
  req: QueryGeneralRequest,
): Promise<IQueryGeneralResponseData | null> {
  const { body, status } = await gatherWithQuery<QueryGeneralRequest, QueryGeneralResponse>({
    method: "GET",
    query: req,
    url: `${getApiEndpoint()}/query-general`,
  });
  if (status !== HTTPStatus.OK) {
    return null;
  }

  return body as IQueryGeneralResponseData;
}

export interface IGetPriceListOptions {
  regionName: RegionName;
  realmSlug: RealmSlug;
  itemIds: ItemId[];
  locale: Locale;
}

export async function getPriceList(
  opts: IGetPriceListOptions,
): Promise<IGetPricelistResponseData | null> {
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
}
