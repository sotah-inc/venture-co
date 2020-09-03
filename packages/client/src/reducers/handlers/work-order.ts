import {
  LoadWorkOrderEntrypoint,
  ReceiveWorkOrderItemPrefill,
  ReceiveWorkOrderQuery,
  SetWorkOrderPage,
  SetWorkOrderPerPage,
  WorkOrderActions,
} from "../../actions/work-order";
import { FetchLevel } from "../../types/main";
import { IWorkOrderState } from "../../types/work-order";
import { IKindHandlers, Runner } from "./index";

export const handlers: IKindHandlers<IWorkOrderState, WorkOrderActions> = {
  create: {
    workorder: {
      receive: (
        state: IWorkOrderState,
        action: ReturnType<typeof ReceiveWorkOrderQuery>,
      ): IWorkOrderState => {
        if (action.payload.errors !== null) {
          return {
            ...state,
            mutateOrderErrors: action.payload.errors,
            mutateOrderLevel: FetchLevel.failure,
          };
        }

        return {
          ...state,
          mutateOrderLevel: FetchLevel.success,
          orders: { ...state.orders, level: FetchLevel.prompted },
        };
      },
      request: (state: IWorkOrderState): IWorkOrderState => {
        return { ...state, mutateOrderLevel: FetchLevel.fetching, mutateOrderErrors: {} };
      },
    },
  },
  entrypoint: {
    workorder: {
      load: (state: IWorkOrderState, action: ReturnType<typeof LoadWorkOrderEntrypoint>) => {
        if (action.payload.workOrders.errors !== null) {
          return {
            ...state,
            loadId: action.payload.loadId,
            orders: {
              data: { items: [], totalResults: 0, orders: [] },
              errors: action.payload.workOrders.errors,
              level: FetchLevel.failure,
            },
          };
        }

        return {
          ...state,
          loadId: action.payload.loadId,
          orders: {
            data: action.payload.workOrders.data!,
            errors: {},
            level: FetchLevel.success,
          },
        };
      },
    },
  },
  page: {
    workorder: {
      set: (
        state: IWorkOrderState,
        action: ReturnType<typeof SetWorkOrderPage>,
      ): IWorkOrderState => {
        return { ...state, currentPage: action.payload };
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
  prefill: {
    workorderitem: {
      receive: (state: IWorkOrderState, action: ReturnType<typeof ReceiveWorkOrderItemPrefill>) => {
        if (action.payload.errors !== null) {
          return {
            ...state,
            prefillWorkOrderItem: {
              ...state.prefillWorkOrderItem,
              errors: action.payload.errors,
              level: FetchLevel.failure,
            },
          };
        }

        return {
          ...state,
          prefillWorkOrderItem: {
            data: action.payload.data!,
            errors: {},
            level: FetchLevel.success,
          },
        };
      },
      request: (state: IWorkOrderState) => {
        return {
          ...state,
          prefillWorkOrderItem: {
            ...state.prefillWorkOrderItem,
            errors: {},
            level: FetchLevel.fetching,
          },
        };
      },
      reset: (state: IWorkOrderState) => {
        return {
          ...state,
          prefillWorkOrderItem: {
            data: { currentPrice: 0 },
            errors: {},
            level: FetchLevel.initial,
          },
        };
      },
    },
  },
  query: {
    workorder: {
      receive: (state, action: ReturnType<typeof ReceiveWorkOrderQuery>): IWorkOrderState => {
        if (action.payload.errors !== null) {
          return {
            ...state,
            orders: {
              ...state.orders,
              data: { items: [], orders: [], totalResults: 0 },
              errors: action.payload.errors,
              level: FetchLevel.failure,
            },
          };
        }

        return {
          ...state,
          orders: { ...state.orders, level: FetchLevel.success, data: action.payload.data! },
        };
      },
      request: (state: IWorkOrderState): IWorkOrderState => {
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
  const taskHandler = handlers[kind]?.[verb]?.[task] ?? null;
  if (taskHandler === null) {
    return state;
  }

  return taskHandler(state, action);
};
