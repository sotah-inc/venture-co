import { IToastProps } from "@blueprintjs/core";

import { ActionsUnion, createAction } from "./helpers";

export const INSERT_TOAST = "INSERT_TOAST";
export const InsertToast = (payload: IToastProps) => createAction(INSERT_TOAST, payload);

export const OvenActions = {
  InsertToast,
};

export type OvenActions = ActionsUnion<typeof OvenActions>;
