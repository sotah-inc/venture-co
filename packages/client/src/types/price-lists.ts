import {
  IExpansion,
  IItemMarketPrices,
  IItemPriceLimits,
  IItemPricelistHistoryMap,
  IItemsMap,
  IPriceLimits,
  IPricelistJson,
  IPriceListMap,
  IProfession,
  IProfessionPricelistJson,
  IQueryOwnerItemsMap,
  ItemId,
  IUpdatePricelistRequest,
} from "@sotah-inc/core";

import { IUpdatePricelistResult } from "../api/price-lists";
import { IFetchInfo } from "./global";
import { FetchLevel } from "./main";

export interface IPriceListsState {
  pricelists: IPricelistJson[];
  createPricelist: IFetchInfo;
  updatePricelist: IFetchInfo;
  entryCreateLevel: FetchLevel;
  selectedList: IPricelistJson | null;
  isAddListDialogOpen: boolean;
  isEditListDialogOpen: boolean;
  isDeleteListDialogOpen: boolean;
  isAddEntryDialogOpen: boolean;
  getPricelistsLevel: FetchLevel;
  items: IItemsMap;
  deletePricelist: IFetchInfo;
  selectedProfession: IProfession | null;
  professionPricelists: IExpansionProfessionPricelistMap;
  getProfessionPricelistsLevel: FetchLevel;
  selectedExpansion: IExpansion | null;
  getUnmetDemandLevel: FetchLevel;
  unmetDemandItemIds: ItemId[];
  unmetDemandProfessionPricelists: IProfessionPricelistJson[];
  getPricelistLevel: FetchLevel;
  pricelistMap: IPriceListMap;
  getPricelistHistoryLevel: FetchLevel;
  pricelistHistoryMap: IItemPricelistHistoryMap;
  getItemsOwnershipLevel: FetchLevel;
  itemsOwnershipMap: IQueryOwnerItemsMap;
  itemsPriceLimits: IItemPriceLimits;
  overallPriceLimits: IPriceLimits;
  itemsMarketPrices: IItemMarketPrices;
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
  getPricelistHistoryLevel: FetchLevel.initial,
  getPricelistLevel: FetchLevel.initial,
  getPricelistsLevel: FetchLevel.initial,
  getProfessionPricelistsLevel: FetchLevel.initial,
  getUnmetDemandLevel: FetchLevel.initial,
  isAddEntryDialogOpen: false,
  isAddListDialogOpen: false,
  isDeleteListDialogOpen: false,
  isEditListDialogOpen: false,
  items: [],
  itemsMarketPrices: {},
  itemsOwnershipMap: {},
  itemsPriceLimits: {},
  overallPriceLimits: { lower: 0, upper: 0 },
  pricelistHistoryMap: {},
  pricelistMap: {},
  pricelists: [],
  professionPricelists: {},
  selectedExpansion: null,
  selectedList: null,
  selectedProfession: null,
  unmetDemandItemIds: [],
  unmetDemandProfessionPricelists: [],
  updatePricelist: { level: FetchLevel.initial, errors: {} },
};
