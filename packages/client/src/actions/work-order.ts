import { SortPerPage } from "@sotah-inc/core";

import { IQueryWorkOrdersResult } from "../api/work-order";
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

export const WorkOrderActions = {
  LoadWorkOrderEntrypoint,
  SetWorkOrderPerPage,
};

export type WorkOrderActions = ActionsUnion<typeof WorkOrderActions>;
