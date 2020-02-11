import { WorkOrderActions } from "../actions/work-order";
import { defaultWorkOrderState, IWorkOrderState } from "../types/work-order";

type State = Readonly<IWorkOrderState>;

export const workOrder = (state: State | undefined, _action: WorkOrderActions): State => {
  if (typeof state === "undefined") {
    return defaultWorkOrderState;
  }

  return state;
};
