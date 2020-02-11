import { ITokenHistory, IWorkOrderJson } from "@sotah-inc/core";

import { IFetchData } from "./global";
import { FetchLevel } from "./main";

export interface IRegionTokenHistories {
  [regionName: string]: ITokenHistory | undefined;
}

export interface IWorkOrderState {
  loadId: string;
  orders: IFetchData<IWorkOrderJson[]>;
}

export const defaultWorkOrderState: IWorkOrderState = {
  loadId: "",
  orders: {
    data: [],
    errors: {},
    level: FetchLevel.initial,
  },
};
