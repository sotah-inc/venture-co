import { IPriceListMap, IRegionConnectedRealmTuple, ItemId } from "@sotah-inc/core";

export interface IGetPricelistRequest {
  tuple: IRegionConnectedRealmTuple;
  item_ids: ItemId[];
}

export interface IGetPricelistResponse {
  price_list: IPriceListMap;
}
