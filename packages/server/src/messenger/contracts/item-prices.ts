import {
  IPriceHistories,
  IPrices,
  IRegionConnectedRealmTuple,
  ItemId,
  UnixTimestamp,
} from "@sotah-inc/core";

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
