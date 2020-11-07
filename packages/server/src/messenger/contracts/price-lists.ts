import {
  IPricelistHistoryMap,
  IPriceListMap,
  IPrices,
  IRegionConnectedRealmTuple,
  ItemId,
  UnixTimestamp,
} from "@sotah-inc/core";

export interface IGetPricelistRequest {
  tuple: IRegionConnectedRealmTuple;
  item_ids: ItemId[];
}

export interface IGetPricelistResponse {
  price_list: IPriceListMap;
}

export interface IGetPricelistHistoriesRequest {
  tuple: IRegionConnectedRealmTuple;
  item_ids: ItemId[];
  lower_bounds: UnixTimestamp;
  upper_bounds: UnixTimestamp;
}

export interface IItemPricelistHistoryMap {
  [itemId: number]: IPricelistHistoryMap<IPrices> | undefined;
}

export interface IGetPricelistHistoriesResponse {
  history: IItemPricelistHistoryMap;
}
