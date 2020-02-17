import { IQueryWorkOrdersResponse, OrderDirection, OrderKind, SortPerPage } from "@sotah-inc/core";

import { IFetchData } from "./global";
import { FetchLevel } from "./main";

export interface IWorkOrderState {
  loadId: string;
  orders: IFetchData<IQueryWorkOrdersResponse>;
  perPage: SortPerPage;
  currentPage: number;
  orderBy: OrderKind;
  orderDirection: OrderDirection;
}

export const defaultWorkOrderState: IWorkOrderState = {
  currentPage: 0,
  loadId: "",
  orderBy: OrderKind.CreatedAt,
  orderDirection: OrderDirection.Desc,
  orders: {
    data: { orders: [], totalResults: 0 },
    errors: {},
    level: FetchLevel.initial,
  },
  perPage: SortPerPage.Ten,
};
