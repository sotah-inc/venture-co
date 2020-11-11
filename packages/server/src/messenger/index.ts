import {
  IConnectedRealmComposite,
  IConnectedRealmModificationDates,
  IQueryItem,
  IRegionComposite,
  IRegionConnectedRealmTuple,
  IRegionRealmTuple,
  IRegionTuple,
  IShortItem,
  IShortPet,
  ITokenHistory,
  Locale,
  ProfessionId,
  SkillTierId,
  SkillTierResponse,
} from "@sotah-inc/core";
import * as nats from "nats";

import {
  code,
  IGetAuctionsRequest,
  IGetAuctionsResponse,
  IGetBootResponse,
  IGetItemsRequest,
  IGetItemsResponse,
  IGetPetsRequest,
  IGetPetsResponse,
  IGetPricelistHistoriesRequest,
  IGetPricelistHistoriesResponse,
  IGetPricelistRequest,
  IGetPricelistResponse,
  IGetSessionSecretResponse,
  IQueryAuctionStatsResponse,
  IQueryGeneralItem,
  IQueryGeneralRequest,
  IQueryItemsRequest,
  IQueryItemsResponse,
  IQueryPetsResponse,
  IRealmModificationDatesResponse,
  IResolveConnectedRealmResponse,
  IValidateRegionConnectedRealmResponse,
  QueryPetsRequest,
  ResolveAuctionsResponse,
  ValidateRegionRealmResponse,
} from "./contracts";
import { IProfessionsResponse } from "./contracts/professions";
import { Message, ParseKind } from "./message";
import { MessageError } from "./message-error";

const DEFAULT_TIMEOUT = 5 * 1000;

export enum subjects {
  items = "items",
  itemsQuery = "itemsQuery",

  pets = "pets",
  petsQuery = "petsQuery",

  tokenHistory = "tokenHistory",

  status = "status",
  connectedRealms = "connectedRealms",
  validateRegionConnectedRealm = "validateRegionConnectedRealm",
  resolveConnectedRealm = "resolveConnectedRealm",
  validateRegionRealm = "validateRegionRealm",
  queryRealmModificationDates = "queryRealmModificationDates",
  connectedRealmModificationDates = "connectedRealmModificationDates",

  boot = "boot",
  sessionSecret = "sessionSecret",

  auctions = "auctions",
  queryAuctionStats = "queryAuctionStats",
  priceList = "priceList",

  priceListHistory = "priceListHistory",

  professions = "professions",
  skillTier = "skillTier",
}

export interface IMessage {
  data: string;
  error: string;
  code: number;
}

interface IRequestOptions {
  body?: string;
  parseKind?: ParseKind;
}

interface IDefaultRequestOptions {
  body: string;
  parseKind: ParseKind;
}

export class Messenger {
  private client: nats.Client;

  constructor(client: nats.Client) {
    this.client = client;
  }

  // via general
  public async queryGeneral(request: IQueryGeneralRequest): Promise<IQueryGeneralItem[] | null> {
    const queriedItems = await this.resolveQueryItems(request);
    if (queriedItems === null) {
      return null;
    }

    const queriedPets = await this.resolveQueryPets(request);
    if (queriedPets === null) {
      return null;
    }

    return [
      ...queriedItems.map<IQueryGeneralItem>(v => {
        return {
          item: {
            item: v.item,
            pet: null,
          },
          rank: v.rank,
          target: v.target,
        };
      }),
      ...queriedPets.map<IQueryGeneralItem>(v => {
        return {
          item: {
            item: null,
            pet: v.item,
          },
          rank: v.rank,
          target: v.target,
        };
      }),
    ]
      .sort((a, b) => {
        if (a.rank === b.rank) {
          return a.target.localeCompare(b.target);
        }

        return a.rank > b.rank ? -1 : 1;
      })
      .slice(0, 10);
  }

  // via items
  public async getItems(request: IGetItemsRequest): Promise<Message<IGetItemsResponse>> {
    return this.request(subjects.items, {
      body: JSON.stringify(request),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  public queryItems(request: IQueryItemsRequest): Promise<Message<IQueryItemsResponse>> {
    return this.request(subjects.itemsQuery, { body: JSON.stringify(request) });
  }

  public async resolveQueryItems(
    request: IQueryItemsRequest,
  ): Promise<Array<IQueryItem<IShortItem>> | null> {
    // resolving items-query message
    const itemsQueryMessage = await this.queryItems(request);
    if (itemsQueryMessage.code !== code.ok) {
      return null;
    }

    const itemsQueryResult = await itemsQueryMessage.decode();
    if (itemsQueryResult === null) {
      return null;
    }

    // resolving items from item-ids in items-query response data
    const getItemsMessage = await this.getItems({
      itemIds: itemsQueryResult.items.map(v => v.item_id),
      locale: request.locale,
    });
    if (getItemsMessage.code !== code.ok) {
      return null;
    }

    const getItemsResult = await getItemsMessage.decode();
    if (getItemsResult === null) {
      return null;
    }

    return itemsQueryResult.items.map(v => {
      return {
        item: getItemsResult.items.find(foundItem => foundItem.id === v.item_id) ?? null,
        rank: v.rank,
        target: v.target,
      };
    });
  }

  // via pets
  public async getPets(request: IGetPetsRequest): Promise<Message<IGetPetsResponse>> {
    return this.request(subjects.pets, {
      body: JSON.stringify(request),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  public queryPets(request: QueryPetsRequest): Promise<Message<IQueryPetsResponse>> {
    return this.request(subjects.petsQuery, { body: JSON.stringify(request) });
  }

  public async resolveQueryPets(
    request: IQueryItemsRequest,
  ): Promise<Array<IQueryItem<IShortPet>> | null> {
    // resolving pets-query message
    const petsQueryMessage = await this.queryPets(request);
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

  // via token-histories
  public getTokenHistory(tuple: IRegionTuple): Promise<Message<ITokenHistory>> {
    return this.request(subjects.tokenHistory, {
      body: JSON.stringify(tuple),
    });
  }

  // via regions
  public getStatus(tuple: IRegionTuple): Promise<Message<IRegionComposite>> {
    return this.request(subjects.status, {
      body: JSON.stringify(tuple),
    });
  }

  public getConnectedRealms(tuple: IRegionTuple): Promise<Message<IConnectedRealmComposite[]>> {
    return this.request(subjects.connectedRealms, {
      body: JSON.stringify(tuple),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  public validateRegionConnectedRealm(
    tuple: IRegionConnectedRealmTuple,
  ): Promise<Message<IValidateRegionConnectedRealmResponse>> {
    return this.request(subjects.validateRegionConnectedRealm, {
      body: JSON.stringify(tuple),
    });
  }

  public resolveConnectedRealm(
    tuple: IRegionRealmTuple,
  ): Promise<Message<IResolveConnectedRealmResponse>> {
    return this.request(subjects.resolveConnectedRealm, {
      body: JSON.stringify(tuple),
    });
  }

  public validateRegionRealm(
    tuple: IRegionRealmTuple,
  ): Promise<Message<ValidateRegionRealmResponse>> {
    return this.request(subjects.validateRegionRealm, {
      body: JSON.stringify(tuple),
    });
  }

  public queryRealmModificationDates(
    tuple: IRegionConnectedRealmTuple,
  ): Promise<Message<IConnectedRealmModificationDates>> {
    return this.request(subjects.queryRealmModificationDates, { body: JSON.stringify(tuple) });
  }

  public getConnectedRealmModificationDates(): Promise<Message<IRealmModificationDatesResponse>> {
    return this.request(subjects.connectedRealmModificationDates);
  }

  // via boot
  public getBoot(): Promise<Message<IGetBootResponse>> {
    return this.request(subjects.boot);
  }

  public getSessionSecret(): Promise<Message<IGetSessionSecretResponse>> {
    return this.request(subjects.sessionSecret);
  }

  // via live-auctions
  public async getAuctions(request: IGetAuctionsRequest): Promise<Message<IGetAuctionsResponse>> {
    return this.request(subjects.auctions, {
      body: JSON.stringify(request),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  public async resolveAuctions(
    request: IGetAuctionsRequest,
    locale: Locale,
  ): Promise<ResolveAuctionsResponse> {
    const auctionsMessage = await this.getAuctions(request);
    if (auctionsMessage.code !== code.ok) {
      return {
        code: auctionsMessage.code,
        data: null,
        error: auctionsMessage.error?.message ?? null,
      };
    }

    const auctionsResult = await auctionsMessage.decode();
    if (auctionsResult === null) {
      return {
        code: code.msgJsonParseError,
        data: null,
        error: "failed to decode auctions-message",
      };
    }

    const itemIds = [...Array.from(new Set(auctionsResult.auctions.map(v => v.itemId)))];
    const petIds = [...Array.from(new Set(auctionsResult.auctions.map(v => v.pet_species_id)))];
    const [itemsMsg, petsMsg] = await Promise.all([
      this.getItems({
        itemIds,
        locale,
      }),
      this.getPets({
        locale,
        petIds,
      }),
    ]);
    if (itemsMsg.code !== code.ok) {
      return {
        code: itemsMsg.code,
        data: null,
        error: itemsMsg.error?.message ?? null,
      };
    }

    const itemsResult = await itemsMsg.decode();
    if (itemsResult === null) {
      return {
        code: code.msgJsonParseError,
        data: null,
        error: "failed to decode items-message",
      };
    }

    if (petsMsg.code !== code.ok) {
      return {
        code: petsMsg.code,
        data: null,
        error: petsMsg.error?.message ?? null,
      };
    }

    const petsResult = await petsMsg.decode();
    if (petsResult === null) {
      return {
        code: code.msgJsonParseError,
        data: null,
        error: "failed to decode pets-message",
      };
    }

    return {
      code: code.ok,
      data: {
        auctions: auctionsResult,
        items: itemsResult,
        pets: petsResult,
      },
      error: null,
    };
  }

  public queryAuctionStats(
    tuple: Partial<IRegionConnectedRealmTuple>,
  ): Promise<Message<IQueryAuctionStatsResponse>> {
    return this.request(subjects.queryAuctionStats, { body: JSON.stringify(tuple) });
  }

  public async getPriceList(
    request: IGetPricelistRequest,
  ): Promise<Message<IGetPricelistResponse>> {
    return this.request(subjects.priceList, {
      body: JSON.stringify(request),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  // via pricelist-histories
  public async getPricelistHistories(
    req: IGetPricelistHistoriesRequest,
  ): Promise<Message<IGetPricelistHistoriesResponse>> {
    return this.request(subjects.priceListHistory, {
      body: JSON.stringify(req),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  // via professions
  public async getProfessions(locale: Locale): Promise<Message<IProfessionsResponse>> {
    return this.request(subjects.professions, {
      body: JSON.stringify({ locale }),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  public async getSkillTier(
    professionId: ProfessionId,
    skillTierId: SkillTierId,
    locale: Locale,
  ): Promise<Message<SkillTierResponse>> {
    return this.request(subjects.professions, {
      body: JSON.stringify({ profession_id: professionId, skilltier_id: skillTierId, locale }),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  // etc
  private request<T>(subject: string, opts?: IRequestOptions): Promise<Message<T>> {
    const { body, parseKind }: IDefaultRequestOptions = {
      body: "",
      parseKind: ParseKind.JsonEncoded,
      ...opts,
    };

    return new Promise<Message<T>>((resolve, reject) => {
      const tId = setTimeout(() => reject(new Error("Timed out!")), DEFAULT_TIMEOUT);

      this.client.request(subject, body, (natsMsg: string) => {
        (async () => {
          clearTimeout(tId);
          const parsedMsg: IMessage = JSON.parse(natsMsg.toString());
          const msg = new Message<T>(parsedMsg, parseKind);
          if (msg.error !== null && msg.code === code.genericError) {
            const reason: MessageError = {
              code: msg.code,
              message: msg.error.message,
            };
            reject(reason);

            return;
          }

          resolve(msg);
        })();
      });
    });
  }
}
