import { NatsConnection } from "nats";

import {
  LiveAuctionsMessenger,
  GeneralMessenger,
  ItemsMessenger,
  PetsMessenger,
  PricelistHistoryMessenger,
  ProfessionsMessenger,
  RegionsMessenger,
  BootMessenger,
  StatsMessenger,
  TokensMessenger,
} from "./messengers";

export * from "./messengers";
export * from "./contracts";

export interface IMessengers {
  boot: BootMessenger;
  general: GeneralMessenger;
  items: ItemsMessenger;
  liveAuctions: LiveAuctionsMessenger;
  pets: PetsMessenger;
  pricelistHistory: PricelistHistoryMessenger;
  professions: ProfessionsMessenger;
  regions: RegionsMessenger;
  stats: StatsMessenger;
  tokens: TokensMessenger;
}

export function getMessengers(conn: NatsConnection): IMessengers {
  const itemsMessenger = new ItemsMessenger(conn);
  const petsMessenger = new PetsMessenger(conn);
  const pricelistHistoryMessenger = new PricelistHistoryMessenger(conn);

  return {
    boot: new BootMessenger(conn),
    general: new GeneralMessenger(conn, itemsMessenger, petsMessenger, pricelistHistoryMessenger),
    items: itemsMessenger,
    liveAuctions: new LiveAuctionsMessenger(conn, itemsMessenger, petsMessenger),
    pets: petsMessenger,
    pricelistHistory: new PricelistHistoryMessenger(conn),
    professions: new ProfessionsMessenger(conn, itemsMessenger),
    regions: new RegionsMessenger(conn),
    stats: new StatsMessenger(conn),
    tokens: new TokensMessenger(conn),
  };
}
