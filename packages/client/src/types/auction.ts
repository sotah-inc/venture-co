import { SortDirection, SortKind } from "../api-types";
import { IAuction } from "../api-types/auction";
import { IQueryAuctionsItem } from "../api-types/contracts/data";
import { IProfessionPricelistJson } from "../api-types/entities";
import { IItemsMap } from "../api-types/item";
import { FetchLevel } from "./main";

export interface IAuctionState {
  fetchAuctionsLevel: FetchLevel;
  auctions: IAuction[];
  currentPage: number;
  auctionsPerPage: number;
  totalResults: number;
  sortDirection: SortDirection;
  sortKind: SortKind;
  queryAuctionsLevel: FetchLevel;
  queryAuctionResults: IQueryAuctionsItem[];
  selectedQueryAuctionResults: IQueryAuctionsItem[];
  activeSelect: boolean;
  items: IItemsMap;
  relatedProfessionPricelists: IProfessionPricelistJson[];
}

export interface ISortChangeOptions {
  sortKind: SortKind;
  sortDirection: SortDirection;
}

export const defaultAuctionState: IAuctionState = {
  activeSelect: true,
  auctions: [],
  auctionsPerPage: 10,
  currentPage: 0,
  fetchAuctionsLevel: FetchLevel.initial,
  items: {},
  queryAuctionResults: [],
  queryAuctionsLevel: FetchLevel.initial,
  relatedProfessionPricelists: [],
  selectedQueryAuctionResults: [],
  sortDirection: SortDirection.none,
  sortKind: SortKind.none,
  totalResults: 0,
};
