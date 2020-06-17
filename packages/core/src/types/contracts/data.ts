import { IAuction } from "../auction";
import { IPostJson, IProfessionPricelistJson } from "../entities";
import { ExpansionName, IExpansion } from "../expansion";
import {
  IPricesFlagged,
  IRealmComposite,
  IRegionComposite,
  ITokenHistory,
  IValidationErrorResponse,
  RealmSlug,
  RegionName,
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
import { IRealm, IRealmModificationDates } from "../region";

export interface IGetBootResponse {
  regions: IRegionComposite[];
  item_classes: IItemClass[];
  expansions: IExpansion[];
  professions: IProfession[];
}

export type GetBootResponse = null | {
  regions: IRegionComposite[];
  item_classes: IItemClass[];
  expansions: IExpansion[];
  professions: IProfession[];
};

export interface IGetTokenHistoryResponse {
  history: ITokenHistory;
}

export interface IStatusRealm extends IRealm {
  regionName: string;
  realm_modification_dates: IRealmModificationDates;
}

export interface IGetConnectedRealmsResponse {
  connectedRealms: IRealmComposite[];
}

export interface IGetAuctionsRequest {
  count: number;
  page: number;
  sortKind: SortKind;
  sortDirection: SortDirection;
  itemFilters: ItemId[];
}

export interface IGetAuctionsResponse {
  auctions: IAuction[];
  total: number;
  total_count: number;
  items: IItemsMap;
  professionPricelists: IProfessionPricelistJson[];
}

export interface IQueryItemsRequest {
  query: string;
}

export interface IQueryItemsItem {
  item: IItem | null;
  target: string;
  rank: number;
}

export interface IQueryItemsResponse {
  items: IQueryItemsItem[];
}

export interface IGetItemResponse {
  item: IItem;
}

export interface IGetPricelistRequest {
  item_ids: ItemId[];
}

export interface IGetPricelistResponse {
  price_list: IPriceListMap;
  items: IItemsMap;
}

export interface IGetPricelistHistoriesRequest {
  item_ids: ItemId[];
  lower_bounds?: number;
  upper_bounds?: number;
}

export interface IGetPricelistHistoriesResponse {
  history: IItemPricelistHistoryMap<IPricesFlagged>;
  items: IItemsMap;
  itemPriceLimits: IItemPriceLimits;
  overallPriceLimits: IPriceLimits;
}

export interface IGetUnmetDemandRequest {
  expansion: ExpansionName;
}

export interface IGetUnmetDemandResponse {
  items: IItemsMap;
  professionPricelists: IProfessionPricelistJson[];
  unmetItemIds: ItemId[];
}

export interface IGetProfessionPricelistsResponse {
  profession_pricelists: IProfessionPricelistJson[];
  items: IItemsMap;
}

export interface IGetPostsResponse {
  posts: IPostJson[];
}

export type GetPostResponse =
  | IValidationErrorResponse
  | {
      post: IPostJson;
    };

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
  [key: number]: IQueryAuctionStatsItem | undefined;
}
