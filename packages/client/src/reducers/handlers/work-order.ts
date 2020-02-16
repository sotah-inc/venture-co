import {
  LoadWorkOrderEntrypoint,
  ReceiveWorkOrderQuery,
  SetWorkOrderPerPage,
  WorkOrderActions,
} from "../../actions/work-order";
import { FetchLevel } from "../../types/main";
import { IWorkOrderState } from "../../types/work-order";
import { IKindHandlers, Runner } from "./index";

export const handlers: IKindHandlers<IWorkOrderState, WorkOrderActions> = {
  entrypoint: {
    workorder: {
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
  perpage: {
    workorder: {
      set: (
        state: IWorkOrderState,
        action: ReturnType<typeof SetWorkOrderPerPage>,
      ): IWorkOrderState => {
        return { ...state, perPage: action.payload };
      },
    },
  },
  query: {
    workorder: {
      receive: (state, action: ReturnType<typeof ReceiveWorkOrderQuery>) => {
        if (action.payload.errors !== null) {
          return {
            ...state,
            orders: { ...state.orders, level: FetchLevel.failure, errors: action.payload.errors },
          };
        }

        return {
          ...state,
          orders: { ...state.orders, level: FetchLevel.success, data: action.payload.data!.orders },
        };
      },
      request: state => {
        return { ...state, orders: { ...state.orders, level: FetchLevel.fetching } };
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
