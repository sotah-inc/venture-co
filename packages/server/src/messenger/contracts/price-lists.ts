import { IItemPrices, IRegionVersionConnectedRealmTuple, ItemId } from "@sotah-inc/core";

export interface IGetPricelistRequest {
  tuple: IRegionVersionConnectedRealmTuple;
  item_ids: ItemId[];
}

export interface IGetPricelistResponse {
  price_list: IItemPrices;
}
