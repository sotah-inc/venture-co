import {
  ConnectedRealmId,
  IConnectedRealmComposite,
  IItemClass,
  IItemPriceHistories,
  IItemSubClass,
  IPricesFlagged,
  IRealm,
  IConfigRegion,
  IShortItem,
  IStatusTimestamps,
  IUserJson,
  RegionName,
  IGameVersionTuple,
} from "@sotah-inc/core";

import { FetchLevel } from "./main";

export enum RenderMode {
  Initial,
  Server,
  Client,
}

export interface IRegions {
  [key: string]: IConfigRegion | undefined;
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
  statusTimestamps: IStatusTimestamps;
}

export interface IItemPriceHistoriesState {
  history: IItemPriceHistories<IPricesFlagged>;
}

export interface IRouteConfig {
  url: string;
  asDest: string;
}

export type VersionRouteConfig = IGameVersionTuple & IRouteConfig;

export interface IVersionToggleConfig {
  destinations: VersionRouteConfig[];
}
