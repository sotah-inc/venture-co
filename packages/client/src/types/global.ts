import {
  IItemClass,
  IItemsMap,
  IRegion,
  IStatusRealm,
  ISubItemClass,
  IUserJson,
} from "@sotah-inc/core";

import { FetchLevel } from "./main";

export interface IRegions {
  [key: string]: IRegion;
}
// error types
export interface IErrors {
  [key: string]: string;
}

// realm types
export interface IRealms {
  [key: string]: IStatusRealm;
}

// user types
export interface IProfile {
  user: IUserJson;
  token: string;
}

// item-classes
export interface ISubItemClasses {
  [key: number]: ISubItemClass;
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

export type ILineItemOpen = ILineItem<{ [dataKey: string]: number }>;
