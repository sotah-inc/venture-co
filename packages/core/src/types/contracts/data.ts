import { IAuction } from "../auction";
import { IPostJson, IProfessionPricelistJson } from "../entities";
import { ExpansionName, IExpansion } from "../expansion";
import {
  IConnectedRealmComposite,
  IErrorResponse,
  IPricesFlagged,
  IRegionComposite,
  ITokenHistory,
  IValidationErrorResponse,
  SortDirection,
  SortKind,
} from "../index";
import { IItem, IItemsMap, ItemId } from "../item";
import { IItemClass } from "../item-class";
import {
  IItemPriceLimits,
  IItemPricelistHistoryMap,
  IPriceLimits,
  IPriceListMap,
} from "../pricelist";
import { IProfession } from "../profession";

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
  item: IItem;
}

export type GetItemResponse = IGetItemResponseData | IErrorResponse;

export interface IGetAuctionsRequest {
  count: number;
  page: number;
  sortKind: SortKind;
  sortDirection: SortDirection;
  itemFilters: ItemId[];
}

export interface IGetAuctionsResponseData {
  auctions: IAuction[];
  total: number;
  total_count: number;
  items: IItemsMap;
  professionPricelists: IProfessionPricelistJson[];
}

export type GetAuctionsResponse =
  | IGetAuctionsResponseData
  | IErrorResponse
  | IValidationErrorResponse
  | null;

export interface IQueryItemsRequest {
  query: string;
}

export interface IQueryItemsItem {
  item: IItem | null;
  target: string;
  rank: number;
}

export interface IQueryItemsResponseData {
  items: IQueryItemsItem[];
}

export type QueryItemsResponse = IQueryItemsResponseData | IErrorResponse | null;

export interface IGetPricelistRequest {
  item_ids: ItemId[];
}

export interface IGetPricelistResponseData {
  price_list: IPriceListMap;
  items: IItemsMap;
}

export type GetPricelistResponse = IGetPricelistResponseData | IValidationErrorResponse | null;

export interface IGetPricelistHistoriesRequest {
  item_ids: ItemId[];
  lower_bounds?: number;
  upper_bounds?: number;
}

export interface IGetPricelistHistoriesResponseData {
  history: IItemPricelistHistoryMap<IPricesFlagged>;
  items: IItemsMap;
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
  items: IItemsMap;
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
  items: IItemsMap;
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
