import { ITokenHistory, IWorkOrderJson } from "@sotah-inc/core";

import { IFetchData } from "./global";
import { FetchLevel } from "./main";

export interface IRegionTokenHistories {
  [regionName: string]: ITokenHistory | undefined;
}

export interface IWorkOrderState {
  orders: IFetchData<IWorkOrderJson[]>;
}

export const defaultWorkOrderState: IWorkOrderState = {
  orders: {
    data: [],
    errors: {},
    level: FetchLevel.initial,
  },
};
