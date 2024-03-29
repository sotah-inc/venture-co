import {
  IItemPrices,
  IPricelistJson,
  IProfessionPricelistJson,
  ItemId,
  UpdatePricelistRequest,
} from "@sotah-inc/core";

import { IUpdatePricelistResult } from "../api/price-lists";
import { IFetchData, IFetchInfo, IItemPriceHistoriesState, IItemsData } from "./global";
import { FetchLevel } from "./main";

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
  pricelists: IFetchData<IItemsData<IPricelistJson[]>>;
  itemPriceHistories: IFetchData<IItemsData<IItemPriceHistoriesState>>;
  priceTable: IFetchData<IItemsData<IItemPrices>>;
  professionPricelists: IFetchData<IItemsData<IProfessionPricelistJson[]>>;
  unmetDemand: IFetchData<IItemsData<IUnmetDemandState>>;
  loadId: string;
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
  request: UpdatePricelistRequest;
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
  itemPriceHistories: {
    data: {
      data: {
        history: {},
      },
      items: [],
    },
    errors: {},
    level: FetchLevel.initial,
  },
  loadId: "",
  priceTable: {
    data: {
      data: {},
      items: [],
    },
    errors: {},
    level: FetchLevel.initial,
  },
  pricelists: {
    data: {
      data: [],
      items: [],
    },
    errors: {},
    level: FetchLevel.initial,
  },
  professionPricelists: {
    data: {
      data: [],
      items: [],
    },
    errors: {},
    level: FetchLevel.initial,
  },
  selectedList: null,
  unmetDemand: {
    data: {
      data: {
        professionPricelists: [],
        unmetItemIds: [],
      },
      items: [],
    },
    errors: {},
    level: FetchLevel.initial,
  },
  updatePricelist: { level: FetchLevel.initial, errors: {} },
};
