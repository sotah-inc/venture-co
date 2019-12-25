import {
  IExpansion,
  IGetPricelistHistoriesResponse,
  IItemMarketPrices,
  IPricelistJson,
  IPriceListMap,
  IProfession,
  IProfessionPricelistJson,
  IQueryOwnerItemsMap,
  ItemId,
  IUpdatePricelistRequest,
} from "@sotah-inc/core";

import { IUpdatePricelistResult } from "../api/price-lists";
import { IFetchData, IFetchInfo } from "./global";
import { FetchLevel } from "./main";

export interface IPriceListsState {
  createPricelist: IFetchInfo;
  updatePricelist: IFetchInfo;
  entryCreateLevel: FetchLevel;
  selectedList: IPricelistJson | null;
  isAddListDialogOpen: boolean;
  isEditListDialogOpen: boolean;
  isDeleteListDialogOpen: boolean;
  isAddEntryDialogOpen: boolean;
  deletePricelist: IFetchInfo;
  selectedProfession: IProfession | null;
  selectedExpansion: IExpansion | null;
  getUnmetDemandLevel: FetchLevel;
  unmetDemandItemIds: ItemId[];
  unmetDemandProfessionPricelists: IProfessionPricelistJson[];
  getItemsOwnershipLevel: FetchLevel;
  itemsOwnershipMap: IQueryOwnerItemsMap;
  itemsMarketPrices: IItemMarketPrices;

  pricelists: IFetchData<IPricelistJson[]>;
  pricelistHistory: IFetchData<IGetPricelistHistoriesResponse>;
  priceTable: IFetchData<IPriceListMap>;
  professionPricelists: IFetchData<IExpansionProfessionPricelistMap>;
}

export interface IExpansionProfessionPricelistMap {
  [key: string]: IProfessionPricelistJson[];
}

export enum ListDialogStep {
  list,
  entry,
  finish,
}

interface IUpdatePricelistMeta {
  isAddEntryDialogOpen?: boolean;
  isEditListDialogOpen?: boolean;
}

export interface IUpdatePricelistRequestOptions {
  request: IUpdatePricelistRequest;
  meta: IUpdatePricelistMeta;
  token: string;
  id: number;
}

export interface IUpdatePricelistResponseOptions {
  result: IUpdatePricelistResult;
  meta: IUpdatePricelistMeta;
}

export const defaultPriceListsState: IPriceListsState = {
  createPricelist: { level: FetchLevel.initial, errors: {} },
  deletePricelist: { level: FetchLevel.initial, errors: {} },
  entryCreateLevel: FetchLevel.initial,
  getItemsOwnershipLevel: FetchLevel.initial,
  getUnmetDemandLevel: FetchLevel.initial,
  isAddEntryDialogOpen: false,
  isAddListDialogOpen: false,
  isDeleteListDialogOpen: false,
  isEditListDialogOpen: false,
  itemsMarketPrices: {},
  itemsOwnershipMap: {},
  pricelists: {
    data: [],
    errors: {},
    level: FetchLevel.initial,
  },
  selectedExpansion: null,
  selectedList: null,
  selectedProfession: null,
  unmetDemandItemIds: [],
  unmetDemandProfessionPricelists: [],
  updatePricelist: { level: FetchLevel.initial, errors: {} },

  priceTable: {
    data: {},
    errors: {},
    level: FetchLevel.initial,
  },
  pricelistHistory: {
    data: {
      history: {},
      itemPriceLimits: {},
      items: {},
      overallPriceLimits: { lower: 0, upper: 0 },
    },
    errors: {},
    level: FetchLevel.initial,
  },
  professionPricelists: {
    data: {},
    errors: {},
    level: FetchLevel.initial,
  },
};
