import {
  GameVersion,
  IConfigRegion,
  IConnectedRealmComposite,
  IExpansion,
  IItemClass,
  IStatusTimestamps,
} from "@sotah-inc/core";

export * from "./auctions";
export * from "./price-lists";
export * from "./items";
export * from "./query-general";
export * from "./pets";
export * from "./item-prices";

export enum code {
  ok = 1,
  genericError = -1,
  msgJsonParseError = -2,
  notFound = -3,
  userError = -4,
}

export interface IGetSessionSecretResponse {
  session_secret: string;
}

export interface IGetBootResponse {
  regions: IConfigRegion[];
  gameVersions: GameVersion[];
  expansions: IExpansion[];
  firebase_config: {
    browser_api_key: string;
  };
}

export interface IGetItemClassesResponse {
  item_classes: IItemClass[];
}

export interface IRealmModificationDatesResponse {
  [regionName: string]:
    | undefined
    | {
        [connectedRealmId: number]: IStatusTimestamps | undefined;
      };
}

export interface IValidateRegionConnectedRealmResponse {
  is_valid: boolean;
}

export type ValidateRegionRealmResponse = IValidateRegionConnectedRealmResponse;

export type ValidateRegionResponse = IValidateRegionConnectedRealmResponse;

export interface IResolveConnectedRealmResponse {
  connected_realm: IConnectedRealmComposite;
}

export interface IResolveResponse<T> {
  data: T | null;
  code: code;
  error: string | null;
}
