import { IToastProps } from "@blueprintjs/core";

export interface IOvenState {
  toast: IToastProps;
  index: number;
}

export const defaultOvenState: IOvenState = {
  index: 0,
  toast: { message: "" },
};
