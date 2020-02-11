import { LoadWorkOrderEntrypoint, WorkOrderActions } from "../../actions/work-order";
import { IWorkOrderState } from "../../types/work-order";
import { IKindHandlers, Runner } from "./index";

export const handlers: IKindHandlers<IWorkOrderState, WorkOrderActions> = {
  entrypoint: {
    workOrder: {
      load: (state: IWorkOrderState, _action: ReturnType<typeof LoadWorkOrderEntrypoint>) => {
        return { ...state };
      },
    },
  },
};

export const run: Runner<IWorkOrderState, WorkOrderActions> = (
  state: IWorkOrderState,
  action: WorkOrderActions,
): IWorkOrderState => {
  const [kind, verb, task] = action.type
    .split("_")
    .reverse()
    .map(v => v.toLowerCase());
  if (!(kind in handlers)) {
    return state;
  }
  const kindHandlers = handlers[kind];

  if (!(verb in kindHandlers)) {
    return state;
  }
  const verbHandlers = kindHandlers[verb];

  if (!(task in verbHandlers)) {
    return state;
  }
  const taskHandler = verbHandlers[task];

  return taskHandler(state, action);
};
