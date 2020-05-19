import {
  IAuction,
  IExpansion,
  IItemClass,
  IItemsMap,
  IPricelistHistoryMap,
  IPriceListMap,
  IPrices,
  IProfession,
  IRealmModificationDates,
  IRegionComposite,
  IRegionConnectedRealmTuple,
  ItemId,
  Locale,
  RealmSlug,
  RegionName,
  SortDirection,
  SortKind,
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
  region_name: RegionName;
  realm_slug: RealmSlug;
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
  regions: IRegionComposite[];
  item_classes: {
    classes: IItemClass[];
  };
  expansions: IExpansion[];
  professions: IProfession[];
}

export interface IGetPricelistHistoriesRequest {
  region_name: RegionName;
  realm_slug: RealmSlug;
  item_ids: ItemId[];
  lower_bounds: number;
  upper_bounds: number;
}

export interface IItemPricelistHistoryMap {
  [itemId: number]: IPricelistHistoryMap<IPrices>;
}

export interface IGetPricelistHistoriesResponse {
  history: IItemPricelistHistoryMap;
}

export interface IQueryRealmModificationDatesRequest {
  region_name: RegionName;
  realm_slug: RealmSlug;
}

export type IQueryRealmModificationDatesResponse = IRealmModificationDates;

export interface IRealmModificationDatesResponse {
  [regionName: string]: {
    [realmSlug: string]: IRealmModificationDates;
  };
}

export interface IQueryAuctionStatsRequest {
  region_name?: RegionName;
  realm_slug?: RealmSlug;
}

export interface IQueryAuctionStatsItem {
  total_auctions: number;
  total_quantity: number;
  total_buyout: number;
}

export interface IQueryAuctionStatsResponse {
  [key: number]: IQueryAuctionStatsItem;
}

export interface IValidateRegionRealmRequest {
  region_name: string;
  realm_slug: string;
}

export interface IValidateRegionRealmResponse {
  is_valid: boolean;
}
