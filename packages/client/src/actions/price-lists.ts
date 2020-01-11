import {
  ExpansionName,
  ICreatePricelistRequest,
  ICreateProfessionPricelistRequest,
  IExpansion,
  IGetPricelistHistoriesResponse,
  IGetPricelistResponse,
  IGetPricelistsResponse,
  IPricelistJson,
  IProfession,
  ProfessionName,
} from "@sotah-inc/core";
import { Dispatch } from "redux";

import {
  getPriceList,
  getPriceListHistory,
  IGetPriceListHistoryOptions,
  IGetPriceListOptions,
} from "../api/data";
import {
  createPricelist,
  createProfessionPricelist,
  deletePricelist,
  deleteProfessionPricelist,
  getPricelists,
  getProfessionPricelists,
  ICreatePricelistResult,
  ICreateProfessionPricelistResult,
  IDeleteProfessionPricelistResult,
  IGetProfessionPricelistsResult,
  IGetUnmetDemandResult,
  updatePricelist,
} from "../api/price-lists";
import { FetchLevel } from "../types/main";
import {
  IUpdatePricelistRequestOptions,
  IUpdatePricelistResponseOptions,
} from "../types/price-lists";
import { ActionsUnion, createAction } from "./helpers";

export const REQUEST_CREATE_PRICELIST = "REQUEST_CREATE_PRICELIST";
export const RequestCreatePricelist = () => createAction(REQUEST_CREATE_PRICELIST);
export const RECEIVE_CREATE_PRICELIST = "RECEIVE_CREATE_PRICELIST";
export const ReceiveCreatePricelist = (payload: ICreatePricelistResult) =>
  createAction(RECEIVE_CREATE_PRICELIST, payload);
type FetchCreatePricelistType = ReturnType<
  typeof RequestCreatePricelist | typeof ReceiveCreatePricelist
>;
export const FetchCreatePricelist = (token: string, request: ICreatePricelistRequest) => {
  return async (dispatch: Dispatch<FetchCreatePricelistType>) => {
    dispatch(RequestCreatePricelist());
    dispatch(ReceiveCreatePricelist(await createPricelist(token, request)));
  };
};

export const REQUEST_UPDATE_PRICELIST = "REQUEST_UPDATE_PRICELIST";
export const RequestUpdatePricelist = () => createAction(REQUEST_UPDATE_PRICELIST);
export const RECEIVE_UPDATE_PRICELIST = "RECEIVE_UPDATE_PRICELIST";
export const ReceiveUpdatePricelist = (payload: IUpdatePricelistResponseOptions) =>
  createAction(RECEIVE_UPDATE_PRICELIST, payload);
type FetchUpdatePricelistType = ReturnType<
  typeof RequestUpdatePricelist | typeof ReceiveUpdatePricelist
>;
export const FetchUpdatePricelist = (opts: IUpdatePricelistRequestOptions) => {
  return async (dispatch: Dispatch<FetchUpdatePricelistType>) => {
    dispatch(RequestUpdatePricelist());
    dispatch(
      ReceiveUpdatePricelist({
        meta: opts.meta,
        result: await updatePricelist(opts.token, opts.id, opts.request),
      }),
    );
  };
};

export const REQUEST_DELETE_PRICELIST = "REQUEST_DELETE_PRICELIST";
export const RequestDeletePricelist = () => createAction(REQUEST_DELETE_PRICELIST);
export const RECEIVE_DELETE_PRICELIST = "RECEIVE_DELETE_PRICELIST";
export const ReceiveDeletePricelist = (payload: number | null) =>
  createAction(RECEIVE_DELETE_PRICELIST, payload);
type FetchDeletePricelistType = ReturnType<
  typeof RequestDeletePricelist | typeof ReceiveDeletePricelist
>;
export const FetchDeletePricelist = (token: string, id: number) => {
  return async (dispatch: Dispatch<FetchDeletePricelistType>) => {
    dispatch(RequestDeletePricelist());
    dispatch(ReceiveDeletePricelist(await deletePricelist(token, id)));
  };
};

export const REQUEST_GET_PRICELISTS = "REQUEST_GET_PRICELISTS";
export const RequestGetPricelists = () => createAction(REQUEST_GET_PRICELISTS);
export const RECEIVE_GET_PRICELISTS = "RECEIVE_GET_PRICELISTS";
export const ReceiveGetPricelists = (payload: IGetPricelistsResponse) =>
  createAction(RECEIVE_GET_PRICELISTS, payload);
type FetchGetPricelistsType = ReturnType<typeof RequestGetPricelists | typeof ReceiveGetPricelists>;
export const FetchGetPricelists = (token: string) => {
  return async (dispatch: Dispatch<FetchGetPricelistsType>) => {
    dispatch(RequestGetPricelists());
    dispatch(ReceiveGetPricelists(await getPricelists(token)));
  };
};

export const CHANGE_ENTRY_CREATELEVEL = "CHANGE_ENTRY_CREATELEVEL";
export const ChangeEntryCreateLevel = (payload: FetchLevel) =>
  createAction(CHANGE_ENTRY_CREATELEVEL, payload);

export const CHANGE_IS_ADD_LIST_DIALOG_OPEN = "CHANGE_IS_ADD_LIST_DIALOG_OPEN";
export const ChangeIsAddListDialogOpen = (payload: boolean) =>
  createAction(CHANGE_IS_ADD_LIST_DIALOG_OPEN, payload);

export const CHANGE_IS_EDIT_LIST_DIALOG_OPEN = "CHANGE_IS_EDIT_LIST_DIALOG_OPEN";
export const ChangeIsEditListDialogOpen = (payload: boolean) =>
  createAction(CHANGE_IS_EDIT_LIST_DIALOG_OPEN, payload);

export const CHANGE_IS_DELETE_LIST_DIALOG_OPEN = "CHANGE_IS_DELETE_LIST_DIALOG_OPEN";
export const ChangeIsDeleteListDialogOpen = (payload: boolean) =>
  createAction(CHANGE_IS_DELETE_LIST_DIALOG_OPEN, payload);

export const CHANGE_IS_ADD_ENTRY_DIALOG_OPEN = "CHANGE_IS_ADD_ENTRY_DIALOG_OPEN";
export const ChangeIsAddEntryDialogOpen = (payload: boolean) =>
  createAction(CHANGE_IS_ADD_ENTRY_DIALOG_OPEN, payload);

export const REQUEST_CREATE_PROFESSIONPRICELIST = "REQUEST_CREATE_PROFESSIONPRICELIST";
export const RequestCreateProfessionPricelist = () =>
  createAction(REQUEST_CREATE_PROFESSIONPRICELIST);
export const RECEIVE_CREATE_PROFESSIONPRICELIST = "RECEIVE_CREATE_PROFESSIONPRICELIST";
export const ReceiveCreateProfessionPricelist = (payload: ICreateProfessionPricelistResult) =>
  createAction(RECEIVE_CREATE_PROFESSIONPRICELIST, payload);
type FetchCreateProfessionPricelistType = ReturnType<
  typeof RequestCreateProfessionPricelist | typeof ReceiveCreateProfessionPricelist
>;
export const FetchCreateProfessionPricelist = (
  token: string,
  request: ICreateProfessionPricelistRequest,
) => {
  return async (dispatch: Dispatch<FetchCreateProfessionPricelistType>) => {
    dispatch(RequestCreateProfessionPricelist());
    dispatch(ReceiveCreateProfessionPricelist(await createProfessionPricelist(token, request)));
  };
};

export const REQUEST_DELETE_PROFESSIONPRICELIST = "REQUEST_DELETE_PROFESSIONPRICELIST";
export const RequestDeleteProfessionPricelist = () =>
  createAction(REQUEST_DELETE_PROFESSIONPRICELIST);
export const RECEIVE_DELETE_PROFESSIONPRICELIST = "RECEIVE_DELETE_PROFESSIONPRICELIST";
export const ReceiveDeleteProfessionPricelist = (payload: IDeleteProfessionPricelistResult) =>
  createAction(RECEIVE_DELETE_PROFESSIONPRICELIST, payload);
type FetchDeleteProfessionPricelistType = ReturnType<
  typeof RequestDeleteProfessionPricelist | typeof ReceiveDeleteProfessionPricelist
>;
export const FetchDeleteProfessionPricelist = (token: string, id: number) => {
  return async (dispatch: Dispatch<FetchDeleteProfessionPricelistType>) => {
    dispatch(RequestDeleteProfessionPricelist());
    dispatch(ReceiveDeleteProfessionPricelist(await deleteProfessionPricelist(token, id)));
  };
};

export const REQUEST_GET_PROFESSIONPRICELISTS = "REQUEST_GET_PROFESSIONPRICELISTS";
export const RequestGetProfessionPricelists = () => createAction(REQUEST_GET_PROFESSIONPRICELISTS);
export const RECEIVE_GET_PROFESSIONPRICELISTS = "RECEIVE_GET_PROFESSIONPRICELISTS";
export const ReceiveGetProfessionPricelists = (payload: IGetProfessionPricelistsResult) =>
  createAction(RECEIVE_GET_PROFESSIONPRICELISTS, payload);
type FetchProfessionPricelistsType = ReturnType<
  typeof RequestGetProfessionPricelists | typeof ReceiveGetProfessionPricelists
>;
export const FetchGetProfessionPricelists = (
  profession: ProfessionName,
  expansion: ExpansionName,
) => {
  return async (dispatch: Dispatch<FetchProfessionPricelistsType>) => {
    dispatch(RequestGetProfessionPricelists());
    dispatch(ReceiveGetProfessionPricelists(await getProfessionPricelists(profession, expansion)));
  };
};

export const REQUEST_GET_PRICELIST = "REQUEST_GET_PRICELIST";
export const RequestGetPricelist = () => createAction(REQUEST_GET_PRICELIST);
export const RECEIVE_GET_PRICELIST = "RECEIVE_GET_PRICELIST";
export const ReceiveGetPricelist = (payload: IGetPricelistResponse | null) =>
  createAction(RECEIVE_GET_PRICELIST, payload);
type FetchGetPricelist = ReturnType<typeof RequestGetPricelist | typeof ReceiveGetPricelist>;
export const FetchGetPricelist = (opts: IGetPriceListOptions) => {
  return async (dispatch: Dispatch<FetchGetPricelist>) => {
    dispatch(RequestGetPricelist());
    dispatch(ReceiveGetPricelist(await getPriceList(opts)));
  };
};

export const REQUEST_GET_PRICELISTHISTORY = "REQUEST_GET_PRICELISTHISTORY";
export const RequestGetPricelistHistory = () => createAction(REQUEST_GET_PRICELISTHISTORY);
export const RECEIVE_GET_PRICELISTHISTORY = "RECEIVE_GET_PRICELISTHISTORY";
export const ReceiveGetPricelistHistory = (payload: IGetPricelistHistoriesResponse | null) =>
  createAction(RECEIVE_GET_PRICELISTHISTORY, payload);
type FetchGetPricelistHistory = ReturnType<
  typeof RequestGetPricelistHistory | typeof ReceiveGetPricelistHistory
>;
export const FetchGetPricelistHistory = (opts: IGetPriceListHistoryOptions) => {
  return async (dispatch: Dispatch<FetchGetPricelistHistory>) => {
    dispatch(RequestGetPricelistHistory());
    dispatch(ReceiveGetPricelistHistory(await getPriceListHistory(opts)));
  };
};

export interface ILoadPricelistsEntrypointFront {
  professionName?: ProfessionName;
  expansionName?: ExpansionName;
  pricelistSlug?: string;
  pricelistHistory?: IGetPricelistHistoriesResponse | null;
  currentPrices?: IGetPricelistResponse | null;
  selectedList?: IPricelistJson | null;
  professionPricelists?: IGetProfessionPricelistsResult;
  unmetDemand?: IGetUnmetDemandResult;
  loadId: string;
}

export interface ILoadPricelistsEntrypoint extends ILoadPricelistsEntrypointFront {
  professions: IProfession[];
  expansions: IExpansion[];
}

export const LOAD_PRICELISTS_ENTRYPOINT = "LOAD_PRICELISTS_ENTRYPOINT";
export const LoadPricelistsEntrypoint = (payload: ILoadPricelistsEntrypoint) =>
  createAction(LOAD_PRICELISTS_ENTRYPOINT, payload);

export const PriceListsActions = {
  ChangeEntryCreateLevel,
  ChangeIsAddEntryDialogOpen,
  ChangeIsAddListDialogOpen,
  ChangeIsDeleteListDialogOpen,
  ChangeIsEditListDialogOpen,
  LoadPricelistsEntrypoint,
  ReceiveCreatePricelist,
  ReceiveCreateProfessionPricelist,
  ReceiveDeletePricelist,
  ReceiveDeleteProfessionPricelist,
  ReceiveGetPricelist,
  ReceiveGetPricelistHistory,
  ReceiveGetPricelists,
  ReceiveGetProfessionPricelists,
  ReceiveUpdatePricelist,
  RequestCreatePricelist,
  RequestCreateProfessionPricelist,
  RequestDeletePricelist,
  RequestDeleteProfessionPricelist,
  RequestGetPricelist,
  RequestGetPricelistHistory,
  RequestGetPricelists,
  RequestGetProfessionPricelists,
  RequestUpdatePricelist,
};

export type PriceListsActions = ActionsUnion<typeof PriceListsActions>;
