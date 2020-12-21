import {
  GetItemPriceHistoriesResponse,
  IGetItemPriceHistoriesRequest,
  IGetItemPriceHistoriesResponseData,
  ItemId,
  Locale,
  RealmSlug,
  RegionName,
} from "@sotah-inc/core";
import * as HTTPStatus from "http-status";

import { getApiEndpoint } from "./config";
import { gatherWithQuery } from "./gather";

export interface IGetItemPriceHistoriesOptions {
  regionName: RegionName;
  realmSlug: RealmSlug;
  itemIds: ItemId[];
  locale: Locale;
}

export const getItemPriceHistories = async (
  opts: IGetItemPriceHistoriesOptions,
): Promise<IGetItemPriceHistoriesResponseData | null> => {
  const { regionName, realmSlug, itemIds } = opts;
  const { body, status } = await gatherWithQuery<
    { locale: Locale },
    GetItemPriceHistoriesResponse,
    IGetItemPriceHistoriesRequest
  >({
    body: { item_ids: itemIds },
    headers: new Headers({
      "content-type": "application/json",
    }),
    method: "POST",
    query: { locale: opts.locale },
    url: `${getApiEndpoint()}/item-price-histories/${regionName}/${realmSlug}`,
  });
  if (status !== HTTPStatus.OK) {
    return null;
  }

  return body as IGetItemPriceHistoriesResponseData;
};
