import {
  IAuction,
  IRegionConnectedRealmTuple,
  ItemId,
  PetId,
  SortDirection,
  SortKind,
} from "@sotah-inc/core";

import { IGetItemsResponse } from "./items";
import { IGetPetsResponse } from "./pets";

import { IResolveResponse } from "./index";

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

export interface IQueryAuctionStatsItem {
  total_auctions: number;
  total_quantity: number;
  total_buyout: number;
}

export interface IQueryAuctionStatsResponse {
  [key: number]: IQueryAuctionStatsItem | undefined;
}

export type ResolveAuctionsResponse = IResolveResponse<{
  auctions: IGetAuctionsResponse;
  items: IGetItemsResponse;
  pets: IGetPetsResponse;
}>;
