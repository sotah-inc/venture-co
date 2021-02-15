import { IShortPet, Locale, PetId } from "@sotah-inc/core";

import { IQueryItemsRequest } from "./items";

export type QueryPetsRequest = IQueryItemsRequest;

export interface IQueryPetsResponse {
  items: Array<{
    pet_id: PetId;
    target: string;
    rank: number;
  }>;
}

export interface IGetPetsRequest {
  petIds: PetId[];
  locale: Locale;
}

export interface IGetPetsResponse {
  pets: IShortPet[];
}
