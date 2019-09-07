import { IItemClass, IRegion, IStatusRealm, ISubItemClass, IUserJson } from "@sotah-inc/core";

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
