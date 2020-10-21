import { IAuction } from "../auction";
import { IPostJson, IProfessionPricelistJson } from "../entities";
import { ExpansionName, IExpansion } from "../expansion";
import {
  IConnectedRealmComposite,
  IErrorResponse,
  IPricesFlagged,
  IRegionComposite,
  IShortPet,
  ITokenHistory,
  IValidationErrorResponse,
  Locale,
  SortDirection,
  SortKind,
} from "../index";
import { ItemId } from "../item";
import { IItemClass } from "../item-class";
import {
  IItemPriceLimits,
  IItemPricelistHistoryMap,
  IPriceLimits,
  IPriceListMap,
} from "../pricelist";
import { IProfession } from "../profession";
import { IShortItem } from "../short-item";

// new
export interface IGetBootResponseData {
  regions: IRegionComposite[];
  item_classes: IItemClass[];
  expansions: IExpansion[];
  professions: IProfession[];
}

export type GetBootResponse = IGetBootResponseData | null;

export interface IGetPostResponseData {
  post: IPostJson;
}

export type GetPostResponse = IGetPostResponseData | IValidationErrorResponse;

export interface IGetPostsResponseData {
  posts: IPostJson[];
}

export type GetPostsResponse = IGetPostsResponseData;

export interface IGetConnectedRealmsResponseData {
  connectedRealms: IConnectedRealmComposite[];
}

export type GetConnectedRealmsResponse = IGetConnectedRealmsResponseData | null;

export interface IGetItemResponseData {
  item: IShortItem;
}

export type GetItemResponse = IGetItemResponseData | IErrorResponse | IValidationErrorResponse;

export interface IGetAuctionsRequest {
  count: number;
  page: number;
  sortKind: SortKind;
  sortDirection: SortDirection;
  locale: Locale;

  itemFilters?: ItemId[];
}

export interface IGetAuctionsResponseData {
  auctions: IAuction[];
  total: number;
  total_count: number;
  items: IShortItem[];
  professionPricelists: IProfessionPricelistJson[];
}

export type GetAuctionsResponse =
  | IGetAuctionsResponseData
  | IErrorResponse
  | IValidationErrorResponse
  | null;

export interface IQueryItemsRequest {
  query?: string;
  locale: string;
}

export interface IQueryItemsItem {
  item: IShortItem | null;
  target: string;
  rank: number;
}

export interface IQueryItemsResponseData {
  items: IQueryItemsItem[];
}

export type QueryItemsResponse =
  | IQueryItemsResponseData
  | IErrorResponse
  | IValidationErrorResponse
  | null;

export type QueryPetsRequest = IQueryItemsRequest;

export interface IQueryPetsItem {
  item: IShortPet | null;
  target: string;
  rank: number;
}

export interface IQueryPetsResponseData {
  items: IQueryPetsItem[];
}

export type QueryPetsResponse =
  | IQueryPetsResponseData
  | IErrorResponse
  | IValidationErrorResponse
  | null;

export interface IGetPricelistRequest {
  item_ids: ItemId[];
}

export interface IGetPricelistResponseData {
  price_list: IPriceListMap;
  items: IShortItem[];
}

export type GetPricelistResponse = IGetPricelistResponseData | IValidationErrorResponse | null;

export interface IGetPricelistHistoriesRequest {
  item_ids: ItemId[];
  lower_bounds?: number;
  upper_bounds?: number;
}

export interface IGetPricelistHistoriesResponseData {
  history: IItemPricelistHistoryMap<IPricesFlagged>;
  items: IShortItem[];
  itemPriceLimits: IItemPriceLimits;
  overallPriceLimits: IPriceLimits;
}

export type GetPricelistHistoriesResponse =
  | IGetPricelistHistoriesResponseData
  | IValidationErrorResponse
  | null;

export interface IGetUnmetDemandRequest {
  expansion: ExpansionName;
}

export interface IGetUnmetDemandResponseData {
  items: IShortItem[];
  professionPricelists: IProfessionPricelistJson[];
  unmetItemIds: ItemId[];
}

export type GetUnmetDemandResponse =
  | IGetUnmetDemandResponseData
  | IValidationErrorResponse
  | IErrorResponse
  | null;

export interface IGetProfessionPricelistsResponseData {
  profession_pricelists: IProfessionPricelistJson[];
  items: IShortItem[];
}

export type GetProfessionPricelistsResponse =
  | IGetProfessionPricelistsResponseData
  | IValidationErrorResponse
  | null;

export interface IGetTokenHistoryResponseData {
  history: ITokenHistory;
}

export type GetTokenHistoryResponse = IGetTokenHistoryResponseData | null;

export interface IQueryAuctionStatsItem {
  total_auctions: number;
  total_quantity: number;
  total_buyout: number;
}

export interface IQueryAuctionStatsResponseData {
  [key: number]: IQueryAuctionStatsItem | undefined;
}

export type QueryAuctionStatsResponse = IQueryAuctionStatsResponseData | null;

export type GetProfessionPricelistResponse =
  | IProfessionPricelistJson
  | IValidationErrorResponse
  | null;
