import { IQueryWorkOrdersResult } from "../api/work-order";
import { ActionsUnion, createAction } from "./helpers";

export interface ILoadWorkOrderEntrypoint {
  loadId: string;
  workOrders: IQueryWorkOrdersResult;
}

export const LOAD_WORKORDER_ENTRYPOINT = "LOAD_WORKORDER_ENTRYPOINT";
export const LoadWorkOrderEntrypoint = (payload: ILoadWorkOrderEntrypoint) =>
  createAction(LOAD_WORKORDER_ENTRYPOINT, payload);

export const WorkOrderActions = {
  LoadWorkOrderEntrypoint,
};

export type WorkOrderActions = ActionsUnion<typeof WorkOrderActions>;
