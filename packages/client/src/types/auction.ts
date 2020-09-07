import {
  IAuction,
  IItem,
  IProfessionPricelistJson,
  IQueryItemsItem,
  SortDirection,
  SortKind,
  SortPerPage,
} from "@sotah-inc/core";
import { IFetchData, IItemsData } from "./global";

import { FetchLevel } from "./main";

export interface IAuctionState {
  auctionsResult: IFetchData<IItemsData<IAuction[]>>;
  options: AuctionsOptions;
  totalResults: number;
  activeSelect: boolean;
  relatedProfessionPricelists: IProfessionPricelistJson[];
}

export interface AuctionsOptions {
  currentPage: number;
  auctionsPerPage: SortPerPage;
  sortDirection: SortDirection;
  sortKind: SortKind;
  selected: IItem[];
  initialQueryResults: IQueryItemsItem[];
}

export interface ISortChangeOptions {
  sortKind: SortKind;
  sortDirection: SortDirection;
}

export const defaultAuctionState: IAuctionState = {
  activeSelect: true,
  auctionsResult: {
    data: {
      data: [],
      items: [],
    },
    errors: {},
    level: FetchLevel.initial,
  },
  options: {
    auctionsPerPage: SortPerPage.Ten,
    currentPage: 0,
    initialQueryResults: [],
    selected: [],
    sortDirection: SortDirection.none,
    sortKind: SortKind.none,
  },
  relatedProfessionPricelists: [],
  totalResults: 0,
};
