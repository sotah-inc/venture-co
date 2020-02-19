import { SortPerPage } from "@sotah-inc/core";
import { Dispatch } from "redux";

import {
  createWorkOrder,
  ICreateWorkOrderOptions,
  ICreateWorkOrderResult,
  IQueryWorkOrdersResult,
  queryWorkOrders,
  QueryWorkOrdersOptions,
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
export const FetchWorkOrderQuery = (opts: QueryWorkOrdersOptions) => {
  return async (dispatch: Dispatch) => {
    dispatch(RequestWorkOrderQuery());
    dispatch(ReceiveWorkOrderQuery(await queryWorkOrders(opts)));
  };
};

export const REQUEST_WORKORDER_CREATE = "REQUEST_WORKORDER_CREATE";
export const RequestWorkOrderCreate = () => createAction(REQUEST_WORKORDER_CREATE);
export const RECEIVE_WORKORDER_CREATE = "RECEIVE_WORKORDER_CREATE";
export const ReceiveWorkOrderCreate = (payload: ICreateWorkOrderResult) =>
  createAction(RECEIVE_WORKORDER_CREATE, payload);
export const FetchCreateWorkOrder = (opts: ICreateWorkOrderOptions) => {
  return async (dispatch: Dispatch) => {
    dispatch(RequestWorkOrderCreate());
    dispatch(ReceiveWorkOrderCreate(await createWorkOrder(opts)));
  };
};

export const WorkOrderActions = {
  LoadWorkOrderEntrypoint,
  ReceiveWorkOrderCreate,
  ReceiveWorkOrderQuery,
  RequestWorkOrderCreate,
  RequestWorkOrderQuery,
  SetWorkOrderPage,
  SetWorkOrderPerPage,
};

export type WorkOrderActions = ActionsUnion<typeof WorkOrderActions>;
