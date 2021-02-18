/* eslint-disable func-style,@typescript-eslint/explicit-module-boundary-types */
import { SortPerPage } from "@sotah-inc/core";
import { Dispatch } from "redux";

import {
  createWorkOrder,
  ICreateWorkOrderOptions,
  ICreateWorkOrderResult,
  IPrefillWorkOrderItemOptions,
  IPrefillWorkOrderItemResult,
  IQueryWorkOrdersResult,
  prefillWorkOrderItem,
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
  return async (dispatch: Dispatch): Promise<void> => {
    dispatch(RequestWorkOrderQuery());
    dispatch(ReceiveWorkOrderQuery(await queryWorkOrders(opts)));
  };
};

export const REQUEST_WORKORDER_CREATE = "REQUEST_WORKORDER_CREATE";
export const RequestWorkOrderCreate = () => createAction(REQUEST_WORKORDER_CREATE);
export const RECEIVE_WORKORDER_CREATE = "RECEIVE_WORKORDER_CREATE";
export const ReceiveWorkOrderCreate = (payload: ICreateWorkOrderResult) =>
  createAction(RECEIVE_WORKORDER_CREATE, payload);
export const FetchCreateWorkOrder = (token: string, opts: ICreateWorkOrderOptions) => {
  return async (dispatch: Dispatch): Promise<void> => {
    dispatch(RequestWorkOrderCreate());
    dispatch(ReceiveWorkOrderCreate(await createWorkOrder(token, opts)));
  };
};

export const CHANGE_IS_WORKORDER_DIALOG_OPEN = "CHANGE_IS_WORKORDER_DIALOG_OPEN";
export const ChangeIsWorkOrderDialogOpen = (payload: boolean) =>
  createAction(CHANGE_IS_WORKORDER_DIALOG_OPEN, payload);

export const REQUEST_WORKORDERITEM_PREFILL = "REQUEST_WORKORDERITEM_PREFILL";
export const RequestWorkOrderItemPrefill = () => createAction(REQUEST_WORKORDERITEM_PREFILL);
export const RECEIVE_WORKORDERITEM_PREFILL = "RECEIVE_WORKORDERITEM_PREFILL";
export const ReceiveWorkOrderItemPrefill = (payload: IPrefillWorkOrderItemResult) =>
  createAction(RECEIVE_WORKORDERITEM_PREFILL, payload);
export const FetchWorkOrderItemPrefill = (opts: IPrefillWorkOrderItemOptions) => {
  return async (dispatch: Dispatch) => {
    dispatch(RequestWorkOrderItemPrefill());
    dispatch(ReceiveWorkOrderItemPrefill(await prefillWorkOrderItem(opts)));
  };
};

export const RESET_WORKORDERITEM_PREFILL = "RESET_WORKORDERITEM_PREFILL";
export const ResetWorkOrderItemPrefill = () => createAction(RESET_WORKORDERITEM_PREFILL);

export const WorkOrderActions = {
  ChangeIsWorkOrderDialogOpen,
  LoadWorkOrderEntrypoint,
  ReceiveWorkOrderCreate,
  ReceiveWorkOrderItemPrefill,
  ReceiveWorkOrderQuery,
  RequestWorkOrderCreate,
  RequestWorkOrderItemPrefill,
  RequestWorkOrderQuery,
  ResetWorkOrderItemPrefill,
  SetWorkOrderPage,
  SetWorkOrderPerPage,
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type WorkOrderActions = ActionsUnion<typeof WorkOrderActions>;
