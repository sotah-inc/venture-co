import { IHrefReference, ILinksBase, LocaleMapping, UnixTimestamp } from "./index";

export type RegionName = string;

export interface IRegionTuple {
  region_name: RegionName;
}

export type ConnectedRealmId = number;

export type RealmSlug = string;

export type RegionId = number;

export type RealmId = number;

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
    type: string;
    name: LocaleMapping;
  };
  is_tournament: boolean;
  slug: RealmSlug;
}

export interface IConnectedRealmComposite {
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
    realms: IRealm[];
    mythic_leaderboards: IHrefReference;
    auctions: IHrefReference;
  };
  modification_dates: {
    downloaded: UnixTimestamp;
    live_auctions_received: UnixTimestamp;
    pricelist_history_received: UnixTimestamp;
  };
}

export interface IRegionConnectedRealmTuple extends IRegionTuple {
  connected_realm_id: ConnectedRealmId;
}

export interface IRegionRealmTuple extends IRegionTuple {
  realm_slug: RealmSlug;
}

export interface IRegionComposite {
  config_region: {
    name: RegionName;
    hostname: string;
    primary: boolean;
  };
  connected_realms: IConnectedRealmComposite[];
}
