import { CHANGE_IS_WORKORDER_DIALOG_OPEN, WorkOrderActions } from "../actions/work-order";
import { defaultWorkOrderState, IWorkOrderState } from "../types/work-order";
import { runners } from "./handlers";

type State = Readonly<IWorkOrderState>;

export const workOrder = (state: State | undefined, action: WorkOrderActions): State => {
  if (typeof state === "undefined") {
    return defaultWorkOrderState;
  }

  switch (action.type) {
    case CHANGE_IS_WORKORDER_DIALOG_OPEN:
      return { ...state, isWorkOrderDialogOpen: action.payload };
    default:
      return runners.workOrder(state, action);
  }
};
