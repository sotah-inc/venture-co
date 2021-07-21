import { IRegionVersionConnectedRealmTuple, ItemId } from "@sotah-inc/core";

export interface IItemsMarketPriceRequest {
  tuple: IRegionVersionConnectedRealmTuple;
  item_ids: ItemId[];
}

export interface IItemsMarketPriceResponse {
  items_market_price: {
    [id: number]: number | undefined;
  };
}
