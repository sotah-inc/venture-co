import { IWorkOrderJson, OrderDirection, OrderKind, SortPerPage } from "@sotah-inc/core";

import { IFetchData } from "./global";
import { FetchLevel } from "./main";

export interface IWorkOrderState {
  loadId: string;
  orders: IFetchData<IWorkOrderJson[]>;
  perPage: SortPerPage;
  currentPage: number;
  orderBy: OrderKind;
  orderDirection: OrderDirection;
}

export const defaultWorkOrderState: IWorkOrderState = {
  currentPage: 1,
  loadId: "",
  orderBy: OrderKind.CreatedAt,
  orderDirection: OrderDirection.Desc,
  orders: {
    data: [],
    errors: {},
    level: FetchLevel.initial,
  },
  perPage: SortPerPage.Fifty,
};
