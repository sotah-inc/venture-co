import {
  ConnectedRealmId,
  IConnectedRealmComposite,
  IItemClass,
  IItemsMap,
  IItemSubClass,
  IRealm,
  IRegionComposite,
  IUserJson,
  RegionName,
} from "@sotah-inc/core";

import { FetchLevel } from "./main";
import { IConnectedRealmModificationDates } from "../../../core/src/types";

export interface IRegions {
  [key: string]: IRegionComposite;
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
  items: IItemsMap;
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

export type ILineItemOpen = ILineItem<{ [dataKey: string]: number | null }>;

export interface IClientRealm {
  regionName: RegionName;
  connectedRealmId: ConnectedRealmId;
  realm: IRealm;
  population: IConnectedRealmComposite["connected_realm"]["population"];
  realmModificationDates: IConnectedRealmModificationDates;
}
