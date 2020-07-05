import {
  IGetAuctionsResponse,
  IItem,
  IQueryAuctionsItem,
  IQueryAuctionsResponse,
} from "@sotah-inc/core";
import { Dispatch } from "redux";

import { getAuctions, IGetAuctionsOptions, IGetAuctionsOptions, getAuctions } from "../api/data";
import { ISortChangeOptions } from "../types/auction";
import { ActionsUnion, createAction } from "./helpers";

export const REQUEST_AUCTIONS = "REQUEST_AUCTIONS";
export const RECEIVE_AUCTIONS = "RECEIVE_AUCTIONS";
const RequestAuctions = () => createAction(REQUEST_AUCTIONS);
export const ReceiveAuctions = (payload: IGetAuctionsResponse | null) =>
  createAction(RECEIVE_AUCTIONS, payload);
type FetchAuctionsType = ReturnType<typeof RequestAuctions | typeof ReceiveAuctions>;
export const FetchAuctions = (opts: IGetAuctionsOptions) => {
  return async (dispatch: Dispatch<FetchAuctionsType>) => {
    dispatch(RequestAuctions());
    dispatch(ReceiveAuctions(await getAuctions(opts)));
  };
};

export const PAGE_CHANGE = "PAGE_CHANGE";
export const PageChange = (payload: number) => createAction(PAGE_CHANGE, payload);

export const COUNT_CHANGE = "COUNT_CHANGE";
export const CountChange = (payload: number) => createAction(COUNT_CHANGE, payload);

export const SORT_CHANGE = "SORT_CHANGE";
export const SortChange = (payload: ISortChangeOptions) => createAction(SORT_CHANGE, payload);

export const ITEM_FILTER_CHANGE = "ITEM_FILTER_CHANGE";
export const ItemFilterChange = (item: IItem | null) => createAction(ITEM_FILTER_CHANGE, item);

export const REQUEST_AUCTIONS_QUERY = "REQUEST_AUCTIONS_QUERY";
export const RECEIVE_AUCTIONS_QUERY = "RECEIVE_AUCTIONS_QUERY";
const RequestAuctionsQuery = () => createAction(REQUEST_AUCTIONS_QUERY);
export const ReceiveAuctionsQuery = (payload: IQueryAuctionsResponse | null) =>
  createAction(RECEIVE_AUCTIONS_QUERY, payload);
type QueryAuctionsType = ReturnType<typeof RequestAuctionsQuery | typeof ReceiveAuctionsQuery>;
export const FetchAuctionsQuery = (opts: IGetAuctionsOptions) => {
  return async (dispatch: Dispatch<QueryAuctionsType>) => {
    dispatch(RequestAuctionsQuery());
    dispatch(ReceiveAuctionsQuery(await getAuctions(opts)));
  };
};

export const REFRESH_AUCTIONS_QUERY = "REFRESH_AUCTIONS_QUERY";
export const RefreshAuctionsQuery = (payload: IQueryAuctionsItem[]) =>
  createAction(REFRESH_AUCTIONS_QUERY, payload);

export const ADD_AUCTIONS_QUERY = "ADD_AUCTIONS_QUERY";
export const AddAuctionsQuery = (payload: IQueryAuctionsItem) =>
  createAction(ADD_AUCTIONS_QUERY, payload);
export const REMOVE_AUCTIONS_QUERY = "REMOVE_AUCTIONS_QUERY";
export const RemoveAuctionsQuery = (payload: number) =>
  createAction(REMOVE_AUCTIONS_QUERY, payload);

export const ACTIVESELECT_CHANGE = "ACTIVESELECT_CHANGE";
export const ActiveSelectChange = (payload: boolean) => createAction(ACTIVESELECT_CHANGE, payload);

export interface ILoadAuctionListEntrypoint {
  auctions: IGetAuctionsResponse | null;
  auctionsQuery: IQueryAuctionsResponse | null;
}

export const LOAD_AUCTIONLIST_ENTRYPOINT = "LOAD_AUCTIONLIST_ENTRYPOINT";
export const LoadAuctionListEntrypoint = (payload: ILoadAuctionListEntrypoint) =>
  createAction(LOAD_AUCTIONLIST_ENTRYPOINT, payload);

export const AuctionActions = {
  ActiveSelectChange,
  AddAuctionsQuery,
  CountChange,
  ItemFilterChange,
  LoadAuctionListEntrypoint,
  PageChange,
  ReceiveAuctions,
  ReceiveAuctionsQuery,
  RefreshAuctionsQuery,
  RemoveAuctionsQuery,
  RequestAuctions,
  RequestAuctionsQuery,
  SortChange,
};

export type AuctionActions = ActionsUnion<typeof AuctionActions>;
