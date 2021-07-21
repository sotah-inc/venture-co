import { IQueryItem, IShortPet } from "@sotah-inc/core";

import {
  code,
  IGetPetsRequest,
  IGetPetsResponse,
  IQueryItemsRequest,
  IQueryPetsResponse,
  QueryPetsRequest,
} from "../contracts";
import { Message, ParseKind } from "../message";
import { BaseMessenger } from "./base";

enum subjects {
  pets = "pets",
  petsQuery = "petsQuery",
}

export class PetsMessenger extends BaseMessenger {
  public async getPets(request: IGetPetsRequest): Promise<Message<IGetPetsResponse>> {
    return this.request(subjects.pets, {
      body: JSON.stringify(request),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  public petsQuery(request: QueryPetsRequest): Promise<Message<IQueryPetsResponse>> {
    return this.request(subjects.petsQuery, { body: JSON.stringify(request) });
  }

  public async resolveQueryPets(
    request: IQueryItemsRequest,
  ): Promise<Array<IQueryItem<IShortPet>> | null> {
    // resolving pets-query message
    const petsQueryMessage = await this.petsQuery(request);
    if (petsQueryMessage.code !== code.ok) {
      return null;
    }

    const petsQueryResult = await petsQueryMessage.decode();
    if (petsQueryResult === null) {
      return null;
    }

    // resolving pets from pet-ids in pets-query response data
    const getPetsMessage = await this.getPets({
      locale: request.locale,
      petIds: petsQueryResult.items.map(v => v.pet_id),
    });
    if (getPetsMessage.code !== code.ok) {
      return null;
    }

    const getPetsResult = await getPetsMessage.decode();
    if (getPetsResult === null) {
      return null;
    }

    return petsQueryResult.items.map(v => {
      return {
        item: getPetsResult.pets.find(foundPet => foundPet.id === v.pet_id) ?? null,
        rank: v.rank,
        target: v.target,
      };
    });
  }
}
