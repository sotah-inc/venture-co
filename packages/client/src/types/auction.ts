import {
  IAuction,
  IProfessionPricelistJson,
  IQueryAuctionsItem,
  SortDirection,
  SortKind,
} from "@sotah-inc/core";
import { IItemsData } from "./global";

import { FetchLevel } from "./main";

export interface IAuctionState {
  fetchAuctionsLevel: FetchLevel;
  auctions: IItemsData<IAuction[]>;
  currentPage: number;
  auctionsPerPage: number;
  totalResults: number;
  sortDirection: SortDirection;
  sortKind: SortKind;
  queryAuctionsLevel: FetchLevel;
  queryAuctionResults: IQueryAuctionsItem[];
  selectedQueryAuctionResults: IQueryAuctionsItem[];
  activeSelect: boolean;
  relatedProfessionPricelists: IProfessionPricelistJson[];
}

export interface ISortChangeOptions {
  sortKind: SortKind;
  sortDirection: SortDirection;
}

export const defaultAuctionState: IAuctionState = {
  activeSelect: true,
  auctions: { data: [], items: {} },
  auctionsPerPage: 10,
  currentPage: 0,
  fetchAuctionsLevel: FetchLevel.initial,
  queryAuctionResults: [],
  queryAuctionsLevel: FetchLevel.initial,
  relatedProfessionPricelists: [],
  selectedQueryAuctionResults: [],
  sortDirection: SortDirection.none,
  sortKind: SortKind.none,
  totalResults: 0,
};
