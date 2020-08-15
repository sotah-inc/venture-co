import {
  IAuction,
  IConfigRegion,
  IConnectedRealmModificationDates,
  IExpansion,
  IItemClass,
  IItemsMap,
  IPricelistHistoryMap,
  IPriceListMap,
  IPrices,
  IProfession,
  IRegionConnectedRealmTuple,
  ItemId,
  Locale,
  SortDirection,
  SortKind,
  UnixTimestamp,
} from "@sotah-inc/core";

export interface IGetAuctionsRequest {
  tuple: IRegionConnectedRealmTuple;
  page: number;
  count: number;
  sort_kind: SortKind;
  sort_direction: SortDirection;
  item_filters: ItemId[];
}

export interface IGetAuctionsResponse {
  auctions: IAuction[];
  total: number;
  total_count: number;
}

export interface IGetPricelistRequest {
  tuple: IRegionConnectedRealmTuple;
  item_ids: ItemId[];
}

export interface IGetPricelistResponse {
  price_list: IPriceListMap;
}

export interface IGetSessionSecretResponse {
  session_secret: string;
}

export interface IQueryItemsRequest {
  query: string;
  locale: Locale;
}

export interface IQueryItemsResponse {
  items: Array<{
    item_id: ItemId;
    target: string;
    rank: number;
  }>;
}

export interface IGetItemsResponse {
  items: IItemsMap;
}

export interface IGetBootResponse {
  regions: IConfigRegion[];
  item_classes: IItemClass[];
  expansions: IExpansion[];
  professions: IProfession[];
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

export interface IRealmModificationDatesResponse {
  [regionName: string]:
    | undefined
    | {
        [connectedRealmId: number]: IConnectedRealmModificationDates | undefined;
      };
}

export interface IQueryAuctionStatsItem {
  total_auctions: number;
  total_quantity: number;
  total_buyout: number;
}

export interface IQueryAuctionStatsResponse {
  [key: number]: IQueryAuctionStatsItem | undefined;
}

export interface IValidateRegionConnectedRealmResponse {
  is_valid: boolean;
}

export type ValidateRegionRealmResponse = IValidateRegionConnectedRealmResponse;
