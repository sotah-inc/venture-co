import {
  IAuction,
  IConfigRegion,
  IConnectedRealmComposite,
  IConnectedRealmModificationDates,
  IExpansion,
  IItemClass,
  IPricelistHistoryMap,
  IPriceListMap,
  IPrices,
  IProfession,
  IRegionConnectedRealmTuple,
  IShortItem,
  IShortPet,
  ItemId,
  Locale,
  PetId,
  SortDirection,
  SortKind,
  UnixTimestamp,
} from "@sotah-inc/core";

export enum code {
  ok = 1,
  genericError = -1,
  msgJsonParseError = -2,
  notFound = -3,
  userError = -4,
}

export interface IGetAuctionsRequest {
  tuple: IRegionConnectedRealmTuple;
  page: number;
  count: number;
  sort_kind: SortKind;
  sort_direction: SortDirection;
  item_filters: ItemId[];
  pet_filters: PetId[];
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

export interface IQueryItemsResponse {
  items: Array<{
    item_id: ItemId;
    target: string;
    rank: number;
  }>;
}

export interface IGetItemsRequest {
  itemIds: ItemId[];
  locale: Locale;
}

export interface IGetItemsResponse {
  items: IShortItem[];
}

export type QueryPetsRequest = IQueryItemsRequest;

export interface IQueryPetsResponse {
  items: Array<{
    pet_id: PetId;
    target: string;
    rank: number;
  }>;
}

export interface IGetPetsRequest {
  petIds: PetId[];
  locale: Locale;
}

export interface IGetPetsResponse {
  pets: IShortPet[];
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

export interface IResolveConnectedRealmResponse {
  connected_realm: IConnectedRealmComposite;
}

export interface IQueryGeneralRequest {
  query: string;
  locale: Locale;
}

export interface IQueryGeneralItemItem {
  item: IShortItem | null;
  pet: IShortPet | null;
}

export interface IQueryGeneralItem {
  item: IQueryGeneralItemItem;
  target: string;
  rank: number;
}

export interface IResolveResponse<T> {
  data: T | null;
  code: code;
  error: string | null;
}

export type ResolveAuctionsResponse = IResolveResponse<{
  auctions: IGetAuctionsResponse;
  items: IGetItemsResponse;
  pets: IGetPetsResponse;
}>;
