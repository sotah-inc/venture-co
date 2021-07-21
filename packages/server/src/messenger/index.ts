import { NatsConnection } from "nats";

import {
  LiveAuctionsMessenger,
  GeneralMessenger,
  ItemsMessenger,
  PetsMessenger,
  PricelistHistoryMessenger,
  ProfessionsMessenger,
  RegionsMessenger,
} from "./messengers";

export * from "./messengers";
export * from "./contracts";

export interface IMessengers {
  auctions: LiveAuctionsMessenger;
  general: GeneralMessenger;
  items: ItemsMessenger;
  pets: PetsMessenger;
  professions: ProfessionsMessenger;
  regions: RegionsMessenger;
}

export function getMessengers(conn: NatsConnection): IMessengers {
  const itemsMessenger = new ItemsMessenger(conn);
  const petsMessenger = new PetsMessenger(conn);
  const pricelistHistoryMessenger = new PricelistHistoryMessenger(conn);

  return {
    auctions: new LiveAuctionsMessenger(conn, itemsMessenger, petsMessenger),
    items: itemsMessenger,
    pets: petsMessenger,
    general: new GeneralMessenger(conn, itemsMessenger, petsMessenger, pricelistHistoryMessenger),
    professions: new ProfessionsMessenger(conn, itemsMessenger),
    regions: new RegionsMessenger(conn),
  };
}
