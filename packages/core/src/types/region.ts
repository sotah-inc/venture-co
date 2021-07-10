import {
  IGameVersionTuple,
  IHrefReference,
  ILinksBase,
  LocaleMapping,
  UnixTimestamp,
} from "./index";

export type RegionName = string;

export interface IRegionVersionTuple extends IGameVersionTuple {
  region_name: RegionName;
}

export type ConnectedRealmId = number;

export type RealmSlug = string;

export type RegionId = number;

export type RealmId = number;

export enum RealmType {
  Normal = "NORMAL",
}

export interface IRealm extends ILinksBase {
  id: RealmId;
  region: ILinksBase & {
    id: RegionId;
    name: LocaleMapping;
  };
  connected_realm: IHrefReference;
  name: LocaleMapping;
  category: LocaleMapping;
  locale: string;
  timezone: string;
  type: {
    type: RealmType;
    name: LocaleMapping;
  };
  is_tournament: boolean;
  slug: RealmSlug;
}

export interface IConnectedRealmModificationDates {
  downloaded: UnixTimestamp;
  live_auctions_received: UnixTimestamp;
  pricelist_history_received: UnixTimestamp;
}

export enum RealmStatus {
  Up = "UP",
  Down = "DOWN",
}

export enum RealmPopulation {
  Low = "LOW",
  Medium = "MEDIUM",
  High = "HIGH",
}

export interface IConnectedRealmComposite {
  connected_realm: ILinksBase & {
    id: ConnectedRealmId;
    has_queue: boolean;
    status: {
      type: RealmStatus;
      name: LocaleMapping;
    };
    population: {
      type: RealmPopulation;
      name: LocaleMapping;
    };
    realms: IRealm[];
    mythic_leaderboards: IHrefReference;
    auctions: IHrefReference;
  };
  modification_dates: IConnectedRealmModificationDates;
}

export interface IRegionVersionConnectedRealmTuple extends IRegionVersionTuple {
  connected_realm_id: ConnectedRealmId;
}

export interface IRegionVersionRealmTuple extends IRegionVersionTuple {
  realm_slug: RealmSlug;
}

export interface IConfigRegion {
  name: RegionName;
  hostname: string;
  primary: boolean;
}

export interface IRegionComposite {
  config_region: IConfigRegion;
  connected_realms: IConnectedRealmComposite[];
}
