import { SortPerPage } from "@sotah-inc/core";
import { Dispatch } from "redux";

import {
  IQueryWorkOrdersOptions,
  IQueryWorkOrdersResult,
  queryWorkOrders,
} from "../api/work-order";
import { ActionsUnion, createAction } from "./helpers";

export interface ILoadWorkOrderEntrypoint {
  loadId: string;
  workOrders: IQueryWorkOrdersResult;
}

export const LOAD_WORKORDER_ENTRYPOINT = "LOAD_WORKORDER_ENTRYPOINT";
export const LoadWorkOrderEntrypoint = (payload: ILoadWorkOrderEntrypoint) =>
  createAction(LOAD_WORKORDER_ENTRYPOINT, payload);

export const SET_WORKORDER_PERPAGE = "SET_WORKORDER_PERPAGE";
export const SetWorkOrderPerPage = (payload: SortPerPage) =>
  createAction(SET_WORKORDER_PERPAGE, payload);

export const SET_WORKORDER_PAGE = "SET_WORKORDER_PAGE";
export const SetWorkOrderPage = (payload: number) => createAction(SET_WORKORDER_PAGE, payload);

export const REQUEST_WORKORDER_QUERY = "REQUEST_WORKORDER_QUERY";
export const RequestWorkOrderQuery = () => createAction(REQUEST_WORKORDER_QUERY);
export const RECEIVE_WORKORDER_QUERY = "RECEIVE_WORKORDER_QUERY";
export const ReceiveWorkOrderQuery = (payload: IQueryWorkOrdersResult) =>
  createAction(RECEIVE_WORKORDER_QUERY, payload);
export const FetchWorkOrderQuery = (opts: IQueryWorkOrdersOptions) => {
  return async (dispatch: Dispatch) => {
    dispatch(RequestWorkOrderQuery());
    dispatch(ReceiveWorkOrderQuery(await queryWorkOrders(opts)));
  };
};

export const WorkOrderActions = {
  LoadWorkOrderEntrypoint,
  ReceiveWorkOrderQuery,
  RequestWorkOrderQuery,
  SetWorkOrderPage,
  SetWorkOrderPerPage,
};

export type WorkOrderActions = ActionsUnion<typeof WorkOrderActions>;
