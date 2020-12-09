import {
  IConfigRegion,
  IConnectedRealmComposite,
  IConnectedRealmModificationDates,
  IExpansion,
  IItemClass,
  IProfession,
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
  item_classes: IItemClass[];
  expansions: IExpansion[];
  professions: IProfession[];
}

export interface IRealmModificationDatesResponse {
  [regionName: string]:
    | undefined
    | {
        [connectedRealmId: number]: IConnectedRealmModificationDates | undefined;
      };
}

export interface IValidateRegionConnectedRealmResponse {
  is_valid: boolean;
}

export type ValidateRegionRealmResponse = IValidateRegionConnectedRealmResponse;

export interface IResolveConnectedRealmResponse {
  connected_realm: IConnectedRealmComposite;
}

export interface IResolveResponse<T> {
  data: T | null;
  code: code;
  error: string | null;
}
