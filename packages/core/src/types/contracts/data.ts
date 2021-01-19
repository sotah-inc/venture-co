import { IAuction } from "../auction";
import { IPostJson, IProfessionPricelistJson } from "../entities";
import { ExpansionName, IExpansion } from "../expansion";
import {
  IConnectedRealmComposite,
  IErrorResponse,
  IItemPrices,
  IRegionComposite,
  IRegionTokenHistory,
  IShortPet,
  IShortTokenHistory,
  IValidationErrorResponse,
  Locale,
  PetId,
  SortDirection,
  SortKind,
} from "../index";
import { ItemId } from "../item";
import { IItemClass } from "../item-class";
import { IProfession } from "../profession";
import { IShortItem } from "../short-item";

export * from "./data/index";

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
  petFilters?: PetId[];
}

export interface IGetAuctionsResponseData {
  auctions: IAuction[];
  total: number;
  total_count: number;
  items: IShortItem[];
  pets: IShortPet[];
  professionPricelists: IProfessionPricelistJson[];
}

export type GetAuctionsResponse =
  | IGetAuctionsResponseData
  | IErrorResponse
  | IValidationErrorResponse
  | null;

export interface IGetPricelistRequest {
  item_ids: ItemId[];
}

export interface IGetPricelistResponseData {
  price_list: IItemPrices;
  items: IShortItem[];
}

export type GetPricelistResponse = IGetPricelistResponseData | IValidationErrorResponse | null;

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

export interface IGetRegionTokenHistoryResponseData {
  history: IRegionTokenHistory;
}
export type GetRegionTokenHistoryResponse = IGetRegionTokenHistoryResponseData | null;

export type GetShortTokenHistoryResponse = IGetShortTokenHistoryResponseData | null;

export interface IGetShortTokenHistoryResponseData {
  history: IShortTokenHistory;
}

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
