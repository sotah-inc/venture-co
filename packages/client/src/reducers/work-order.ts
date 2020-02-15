import { WorkOrderActions } from "../actions/work-order";
import { defaultWorkOrderState, IWorkOrderState } from "../types/work-order";
import { runners } from "./handlers";

type State = Readonly<IWorkOrderState>;

export const workOrder = (state: State | undefined, action: WorkOrderActions): State => {
  if (typeof state === "undefined") {
    return defaultWorkOrderState;
  }

  return runners.workOrder(state, action);
};
