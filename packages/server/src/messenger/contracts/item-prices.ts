import {
  IPricelistHistoryMap,
  IPrices,
  IRegionConnectedRealmTuple,
  ItemId,
  UnixTimestamp,
} from "@sotah-inc/core";

export interface IGetItemPricesHistoryRequest {
  tuple: IRegionConnectedRealmTuple;
  item_ids: ItemId[];
  lower_bounds: UnixTimestamp;
  upper_bounds: UnixTimestamp;
}

export interface IItemPricelistHistoryMap {
  [itemId: number]: IPricelistHistoryMap<IPrices> | undefined;
}

export interface IGetItemPricesHistoryResponse {
  history: IItemPricelistHistoryMap;
}
