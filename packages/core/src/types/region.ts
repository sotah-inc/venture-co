import { IHrefReference, ILinksBase, LocaleMapping, UnixTimestamp } from "./index";

export type RegionName = string;

export interface IRegionTuple {
  region_name: RegionName;
}

export type ConnectedRealmId = number;

export interface IRegionConnectedRealmTuple extends IRegionTuple {
  connected_realm_id: ConnectedRealmId;
}

export interface IRegionRealmTuple extends IRegionTuple {
  realm_slug: RealmSlug;
}

export type RegionId = number;

export type RealmId = number;

export interface IRegionComposite {
  config_region: {
    name: RegionName;
    hostname: string;
    primary: boolean;
  };
  connected_realms: Array<{
    connected_realm: ILinksBase & {
      id: ConnectedRealmId;
      has_queue: boolean;
      status: {
        type: string;
        name: LocaleMapping;
      };
      population: {
        type: string;
        name: LocaleMapping;
      };
      realms: Array<
        ILinksBase & {
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
            type: string;
            name: LocaleMapping;
          };
          is_tournament: boolean;
          slug: RealmSlug;
        }
      >;
      mythic_leaderboards: IHrefReference;
      auctions: IHrefReference;
    };
    modification_dates: {
      downloaded: UnixTimestamp;
      live_auctions_received: UnixTimestamp;
      pricelist_history_received: UnixTimestamp;
    };
  }>;
}

export type RealmSlug = string;

export enum RealmPopulation {
  na = "n/a",
  medium = "medium",
  high = "high",
  full = "full",
}

export interface IRealmModificationDates {
  downloaded: number;
  live_auctions_received: number;
  pricelist_histories_received: number;
}

export interface IRealm {
  regionName: RegionName;
  type: string;
  population: RealmPopulation;
  queue: boolean;
  status: boolean;
  name: string;
  slug: RealmSlug;
  battlegroup: string;
  locale: string;
  timezone: string;
  connected_realms: RealmSlug[];
}
