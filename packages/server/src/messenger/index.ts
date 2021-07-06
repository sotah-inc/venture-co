import { NatsConnection } from "nats";

import {
  AuctionsMessenger,
  GeneralMessenger,
  ItemsMessenger,
  PetsMessenger,
  ProfessionsMessenger, RegionsMessenger,
} from "./messengers";

export * from "./messengers";
export * from "./contracts";

export interface IMessengers {
  auctions: AuctionsMessenger;
  general: GeneralMessenger;
  items: ItemsMessenger;
  pets: PetsMessenger;
  professions: ProfessionsMessenger;
  regions: RegionsMessenger;
}

export function getMessengers(conn: NatsConnection): IMessengers {
  const itemsMessenger = new ItemsMessenger(conn);
  const petsMessenger = new PetsMessenger(conn);

  return {
    auctions: new AuctionsMessenger(conn, itemsMessenger, petsMessenger),
    items: itemsMessenger,
    pets: petsMessenger,
    general: new GeneralMessenger(conn, itemsMessenger, petsMessenger),
    professions: new ProfessionsMessenger(conn, itemsMessenger),
    regions: new RegionsMessenger(conn),
  };
}
