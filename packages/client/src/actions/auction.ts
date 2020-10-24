import {
  IGetAuctionsResponseData,
  IQueryGeneralItem,
  IQueryGeneralItemItem,
  SortPerPage,
} from "@sotah-inc/core";
import { Dispatch } from "redux";

import { getAuctions, IGetAuctionsOptions } from "../api/data";
import { ISortChangeOptions } from "../types/auction";
import { ActionsUnion, createAction } from "./helpers";

export const REQUEST_AUCTIONS = "REQUEST_AUCTIONS";
export const RECEIVE_AUCTIONS = "RECEIVE_AUCTIONS";
const RequestAuctions = () => createAction(REQUEST_AUCTIONS);
export const ReceiveAuctions = (payload: IGetAuctionsResponseData | null) =>
  createAction(RECEIVE_AUCTIONS, payload);
type FetchAuctionsType = ReturnType<typeof RequestAuctions | typeof ReceiveAuctions>;
export const FetchAuctions = (opts: IGetAuctionsOptions) => {
  return async (dispatch: Dispatch<FetchAuctionsType>) => {
    dispatch(RequestAuctions());
    dispatch(ReceiveAuctions(await getAuctions(opts)));
  };
};

export const SELECT_ITEM_QUERYAUCTIONS = "SELECT_ITEM_QUERYAUCTIONS";
export const SelectItemQueryAuctions = (payload: IQueryGeneralItemItem) =>
  createAction(SELECT_ITEM_QUERYAUCTIONS, payload);

export const SET_CURRENTPAGE_QUERYAUCTIONS = "SET_CURRENTPAGE_QUERYAUCTIONS";
export const SetCurrentPageQueryAuctions = (payload: number) =>
  createAction(SET_CURRENTPAGE_QUERYAUCTIONS, payload);

export const SET_PERPAGE_QUERYAUCTIONS = "SET_PERPAGE_QUERYAUCTIONS";
export const SetPerPageQueryAuctions = (payload: SortPerPage) =>
  createAction(SET_PERPAGE_QUERYAUCTIONS, payload);

export const SET_SORT_QUERYAUCTIONS = "SET_SORT_QUERYAUCTIONS";
export const SetSortQueryAuctions = (payload: ISortChangeOptions) =>
  createAction(SET_SORT_QUERYAUCTIONS, payload);

export const ACTIVESELECT_CHANGE = "ACTIVESELECT_CHANGE";
export const ActiveSelectChange = (payload: boolean) => createAction(ACTIVESELECT_CHANGE, payload);

export interface ILoadAuctionListEntrypoint {
  auctions: IGetAuctionsResponseData | null;
  querySelected: IQueryGeneralItemItem[];
  initialQueryResults: IQueryGeneralItem[];
}

export const LOAD_AUCTIONLIST_ENTRYPOINT = "LOAD_AUCTIONLIST_ENTRYPOINT";
export const LoadAuctionListEntrypoint = (payload: ILoadAuctionListEntrypoint) =>
  createAction(LOAD_AUCTIONLIST_ENTRYPOINT, payload);

export const AuctionActions = {
  ActiveSelectChange,
  LoadAuctionListEntrypoint,
  ReceiveAuctions,
  RequestAuctions,
  SelectItemQueryAuctions,
  SetCurrentPageQueryAuctions,
  SetPerPageQueryAuctions,
  SetSortQueryAuctions,
};

export type AuctionActions = ActionsUnion<typeof AuctionActions>;
