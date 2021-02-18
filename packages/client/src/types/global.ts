import {
  ConnectedRealmId,
  IConnectedRealmComposite,
  IConnectedRealmModificationDates,
  IItemClass,
  IItemPriceHistories,
  IItemSubClass,
  IPricesFlagged,
  IRealm,
  IRegionComposite,
  IShortItem,
  IUserJson,
  RegionName,
} from "@sotah-inc/core";

import { FetchLevel } from "./main";

export interface IRegions {
  [key: string]: IRegionComposite | undefined;
}
// error types
export interface IErrors {
  [key: string]: string | undefined;
}

// user types
export interface IProfile {
  user: IUserJson;
  token: string;
}

// item-classes
export interface ISubItemClasses {
  [key: number]: IItemSubClass;
}

export interface IItemClasses {
  [key: number]: IItemClassWithSub;
}

export interface IItemClassWithSub extends IItemClass {
  subClassesMap: ISubItemClasses;
}

export interface IItemsData<T> {
  items: IShortItem[];
  data: T;
}

export interface IFetchInfo {
  level: FetchLevel;
  errors: IErrors;
}

export interface IFetchData<T> extends IFetchInfo {
  data: T;
}

export interface ILineItem<T> {
  name: number;
  data: T;
}

export interface ILineItemOpenData {
  [dataKey: string]: number | null | undefined;
}

export type ILineItemOpen = ILineItem<ILineItemOpenData>;

export interface IClientRealm {
  regionName: RegionName;
  connectedRealmId: ConnectedRealmId;
  realm: IRealm;
  population: IConnectedRealmComposite["connected_realm"]["population"];
  realmModificationDates: IConnectedRealmModificationDates;
}

export interface IItemPriceHistoriesState {
  history: IItemPriceHistories<IPricesFlagged>;
}

export interface IRouteConfig {
  url: string;
  asDest: string;
}