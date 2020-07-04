import {
  IPrefillWorkOrderItemResponseData,
  IQueryWorkOrdersResponseData,
  OrderDirection,
  OrderKind,
  SortPerPage,
} from "@sotah-inc/core";

import { IErrors, IFetchData } from "./global";
import { FetchLevel } from "./main";

export interface IWorkOrderState {
  loadId: string;
  orders: IFetchData<IQueryWorkOrdersResponseData>;
  perPage: SortPerPage;
  currentPage: number;
  orderBy: OrderKind;
  orderDirection: OrderDirection;
  isWorkOrderDialogOpen: boolean;
  mutateOrderLevel: FetchLevel;
  mutateOrderErrors: IErrors;
  prefillWorkOrderItem: IFetchData<IPrefillWorkOrderItemResponseData>;
}

export const defaultWorkOrderState: IWorkOrderState = {
  currentPage: 0,
  isWorkOrderDialogOpen: false,
  loadId: "",
  mutateOrderErrors: {},
  mutateOrderLevel: FetchLevel.initial,
  orderBy: OrderKind.CreatedAt,
  orderDirection: OrderDirection.Desc,
  orders: {
    data: { items: {}, orders: [], totalResults: 0 },
    errors: {},
    level: FetchLevel.initial,
  },
  perPage: SortPerPage.Ten,
  prefillWorkOrderItem: {
    data: { currentPrice: 0 },
    errors: {},
    level: FetchLevel.initial,
  },
};
