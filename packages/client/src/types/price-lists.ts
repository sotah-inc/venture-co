import {
  IExpansion,
  IGetPricelistHistoriesResponse,
  IGetUnmetDemandResponse,
  IItemMarketPrices,
  IPricelistJson,
  IPriceListMap,
  IProfession,
  IProfessionPricelistJson,
  IQueryOwnerItemsMap,
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
  itemsMarketPrices: IItemMarketPrices;

  pricelists: IFetchData<IPricelistJson[]>;
  pricelistHistory: IFetchData<IGetPricelistHistoriesResponse>;
  priceTable: IFetchData<IPriceListMap>;
  professionPricelists: IFetchData<IExpansionProfessionPricelistMap>;
  unmetDemand: IFetchData<IGetUnmetDemandResponse>;
  itemsOwnership: IFetchData<IQueryOwnerItemsMap>;
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
  isAddEntryDialogOpen: false,
  isAddListDialogOpen: false,
  isDeleteListDialogOpen: false,
  isEditListDialogOpen: false,
  itemsMarketPrices: {},
  pricelists: {
    data: [],
    errors: {},
    level: FetchLevel.initial,
  },
  selectedExpansion: null,
  selectedList: null,
  selectedProfession: null,
  updatePricelist: { level: FetchLevel.initial, errors: {} },

  itemsOwnership: {
    data: {},
    errors: {},
    level: FetchLevel.initial,
  },
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
  unmetDemand: {
    data: {
      items: {},
      professionPricelists: [],
      unmetItemIds: [],
    },
    errors: {},
    level: FetchLevel.initial,
  },
};
