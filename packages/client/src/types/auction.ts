import {
  IAuction,
  IGetItemsRecipesResponseData,
  IItemsMarketPrice,
  IProfessionPricelistJson,
  IQueryGeneralItem,
  IQueryGeneralItemItem,
  IShortItem,
  IShortPet,
  SortDirection,
  SortKind,
  SortPerPage,
} from "@sotah-inc/core";

import { IFetchData } from "./global";
import { FetchLevel } from "./main";

export interface IAuctionState {
  auctionsResult: IFetchData<IAuctionResultData>;
  options: IAuctionsOptions;
  totalResults: number;
  activeSelect: boolean;
  relatedProfessionPricelists: IProfessionPricelistJson[];
  itemsRecipes: IGetItemsRecipesResponseData;
}

export interface IAuctionResultData {
  auctions: IAuction[];
  items: IShortItem[];
  pets: IShortPet[];
  items_market_price: IItemsMarketPrice[];
}

export interface IAuctionsOptions {
  currentPage: number;
  auctionsPerPage: SortPerPage;
  sortDirection: SortDirection;
  sortKind: SortKind;
  selected: IQueryGeneralItemItem[];
  initialQueryResults: IQueryGeneralItem[];
}

export interface ISortChangeOptions {
  sortKind: SortKind;
  sortDirection: SortDirection;
}

export const defaultAuctionState: IAuctionState = {
  activeSelect: true,
  auctionsResult: {
    data: {
      auctions: [],
      items: [],
      items_market_price: [],
      pets: [],
    },
    errors: {},
    level: FetchLevel.initial,
  },
  itemsRecipes: {
    recipes: [],
    professions: [],
    skillTiers: [],
    itemsRecipes: [],
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
