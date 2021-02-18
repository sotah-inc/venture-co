/* eslint-disable func-style,@typescript-eslint/explicit-module-boundary-types */
import { IToastProps } from "@blueprintjs/core";

import { ActionsUnion, createAction } from "./helpers";

export const INSERT_TOAST = "INSERT_TOAST";
export const InsertToast = (payload: IToastProps) => createAction(INSERT_TOAST, payload);

export const OvenActions = {
  InsertToast,
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OvenActions = ActionsUnion<typeof OvenActions>;
