import {
  IItemPriceHistories,
  IPriceHistories,
  IPrices,
  IPricesFlagged,
  IRegionConnectedRealmTuple,
  ItemId,
  UnixTimestamp,
} from "@sotah-inc/core";

import { IResolveResponse } from "./index";

export interface IGetItemPriceHistoriesRequest {
  tuple: IRegionConnectedRealmTuple;
  item_ids: ItemId[];
  lower_bounds: UnixTimestamp;
  upper_bounds: UnixTimestamp;
}

export interface IItemPriceHistoriesMap {
  [itemId: number]: IPriceHistories<IPrices> | undefined;
}

export interface IGetItemPriceHistoriesResponse {
  history: IItemPriceHistoriesMap;
}

export type ResolveItemPriceHistoriesResponse = IResolveResponse<{
  history: IItemPriceHistories<IPricesFlagged>;
}>;
