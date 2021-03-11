import * as nats from "nats";

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

export function getMessengers(natsClient: nats.Client): IMessengers {
  const itemsMessenger = new ItemsMessenger(natsClient);
  const petsMessenger = new PetsMessenger(natsClient);

  return {
    auctions: new AuctionsMessenger(natsClient, itemsMessenger, petsMessenger),
    items: itemsMessenger,
    pets: petsMessenger,
    general: new GeneralMessenger(natsClient, itemsMessenger, petsMessenger),
    professions: new ProfessionsMessenger(natsClient, itemsMessenger),
    regions: new RegionsMessenger(natsClient),
  };
}