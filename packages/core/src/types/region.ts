import {
  IGameVersionTuple,
  IHrefReference,
  ILinksBase,
  LocaleMapping,
  UnixTimestamp,
} from "./index";

export type RegionName = string;

export interface IRegionTuple {
  region_name: RegionName;
}

export type RegionVersionTuple = IRegionTuple & IGameVersionTuple;

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

export enum StatusKind {
  Downloaded = "downloaded",
  LiveAuctionsReceived = "liveAuctionsReceived",
  ItemPricesReceived = "itemPricesReceived",
  RecipePricesReceived = "recipePricesReceived",
  StatsReceived = "statsReceived",
}

export interface IStatusTimestamps {
  [key: string]: UnixTimestamp;
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
  status_timestamps: IStatusTimestamps;
}

export interface IRegionVersionConnectedRealmTuple extends RegionVersionTuple {
  connected_realm_id: ConnectedRealmId;
}

export interface IRegionVersionRealmTuple extends RegionVersionTuple {
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
