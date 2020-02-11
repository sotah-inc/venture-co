import { LoadWorkOrderEntrypoint, WorkOrderActions } from "../../actions/work-order";
import { FetchLevel } from "../../types/main";
import { IWorkOrderState } from "../../types/work-order";
import { IKindHandlers, Runner } from "./index";

export const handlers: IKindHandlers<IWorkOrderState, WorkOrderActions> = {
  entrypoint: {
    workOrder: {
      load: (state: IWorkOrderState, action: ReturnType<typeof LoadWorkOrderEntrypoint>) => {
        if (action.payload.workOrders.errors !== null) {
          return {
            ...state,
            loadId: action.payload.loadId,
            orders: {
              data: [],
              errors: action.payload.workOrders.errors,
              level: FetchLevel.failure,
            },
          };
        }

        return {
          ...state,
          loadId: action.payload.loadId,
          orders: {
            data: action.payload.workOrders.data!.orders,
            errors: {},
            level: FetchLevel.success,
          },
        };
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
