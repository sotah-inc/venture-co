import {
  IExpansion,
  IItemPriceLimits,
  IItemPricelistHistoryMap,
  IPriceLimits,
  IPricelistJson,
  IPriceListMap,
  IProfession,
  IProfessionPricelistJson,
  ItemId,
  IUpdatePricelistRequest,
} from "@sotah-inc/core";

import { IUpdatePricelistResult } from "../api/price-lists";
import { IFetchData, IFetchInfo, IItemsData } from "./global";
import { FetchLevel } from "./main";

export interface IPricelistHistoryState {
  history: IItemPricelistHistoryMap;
  itemPriceLimits: IItemPriceLimits;
  overallPriceLimits: IPriceLimits;
}

export interface IUnmetDemandState {
  professionPricelists: IProfessionPricelistJson[];
  unmetItemIds: ItemId[];
}

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
  pricelists: IFetchData<IItemsData<IPricelistJson[]>>;
  pricelistHistory: IFetchData<IItemsData<IPricelistHistoryState>>;
  priceTable: IFetchData<IItemsData<IPriceListMap>>;
  professionPricelists: IFetchData<IItemsData<IExpansionProfessionPricelistMap>>;
  unmetDemand: IFetchData<IItemsData<IUnmetDemandState>>;
}

export interface IExpansionProfessionPricelistMap {
  [key: string]: IProfessionPricelistJson[] | undefined;
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
  priceTable: {
    data: {
      data: {},
      items: {},
    },
    errors: {},
    level: FetchLevel.initial,
  },
  pricelistHistory: {
    data: {
      data: {
        history: {},
        itemPriceLimits: {},
        overallPriceLimits: { lower: 0, upper: 0 },
      },
      items: {},
    },
    errors: {},
    level: FetchLevel.initial,
  },
  pricelists: {
    data: {
      data: [],
      items: {},
    },
    errors: {},
    level: FetchLevel.initial,
  },
  professionPricelists: {
    data: {
      data: {},
      items: {},
    },
    errors: {},
    level: FetchLevel.initial,
  },
  selectedExpansion: null,
  selectedList: null,
  selectedProfession: null,
  unmetDemand: {
    data: {
      data: {
        professionPricelists: [],
        unmetItemIds: [],
      },
      items: {},
    },
    errors: {},
    level: FetchLevel.initial,
  },
  updatePricelist: { level: FetchLevel.initial, errors: {} },
};
