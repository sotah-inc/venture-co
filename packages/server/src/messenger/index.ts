import {
  IBollingerBands,
  IConnectedRealmComposite,
  IConnectedRealmModificationDates,
  IItemPriceHistories,
  IItemPriceLimits,
  IPriceHistories,
  IPriceLimits,
  IPrices,
  IPricesFlagged,
  IQueryItem,
  IRegionComposite,
  IRegionConnectedRealmTuple,
  IRegionRealmTuple,
  IRegionTokenHistory,
  IRegionTuple,
  IShortItem,
  IShortPet,
  ItemId,
  Locale,
  ProfessionId,
  RecipeId,
  SkillTierId,
} from "@sotah-inc/core";
// @ts-ignore
import boll from "bollinger-bands";
import * as nats from "nats";

import {
  code,
  IGetAuctionsRequest,
  IGetAuctionsResponse,
  IGetBootResponse,
  IGetItemPriceHistoriesRequest,
  IGetItemPriceHistoriesResponse,
  IGetItemsRequest,
  IGetItemsResponse,
  IGetPetsRequest,
  IGetPetsResponse,
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
  ResolveItemPriceHistoriesResponse,
  ValidateRegionRealmResponse,
} from "./contracts";
import {
  IProfessionsResponse,
  IRecipeResponse,
  ISkillTierResponse,
  ResolveRecipeResponse,
} from "./contracts/professions";
import {
  IGetRecipePricesHistoryRequest,
  IGetRecipePricesHistoryResponse,
} from "./contracts/recipe-prices";
import { IShortTokenHistoryResponse } from "./contracts/tokens";
import { Message, ParseKind } from "./message";
import { MessageError } from "./message-error";

const DEFAULT_TIMEOUT = 5 * 1000;

export enum subjects {
  items = "items",
  itemsQuery = "itemsQuery",

  pets = "pets",
  petsQuery = "petsQuery",

  regionTokenHistory = "regionTokenHistory",
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

  itemPricesHistory = "itemPricesHistory",
  recipePricesHistory = "recipePricesHistory",

  professions = "professions",
  skillTier = "skillTier",
  recipe = "recipe",
}

export interface IMessage {
  data: string;
  error: string;
  code: number;
}

interface IRequestOptions {
  body?: string;
  parseKind?: ParseKind;
  timeout?: number;
}

interface IDefaultRequestOptions {
  body: string;
  parseKind: ParseKind;
  timeout: number;
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
  public getRegionTokenHistory(tuple: IRegionTuple): Promise<Message<IRegionTokenHistory>> {
    return this.request(subjects.regionTokenHistory, {
      body: JSON.stringify(tuple),
    });
  }

  public getTokenHistory(): Promise<Message<IShortTokenHistoryResponse>> {
    return this.request(subjects.tokenHistory, {
      parseKind: ParseKind.GzipJsonEncoded,
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
    return this.request(subjects.queryAuctionStats, {
      body: JSON.stringify(tuple),
      timeout: 15 * 1000,
    });
  }

  public async getPriceList(
    request: IGetPricelistRequest,
  ): Promise<Message<IGetPricelistResponse>> {
    return this.request(subjects.priceList, {
      body: JSON.stringify(request),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  // via item-price-histories
  public async getItemPricesHistory(
    req: IGetItemPriceHistoriesRequest,
  ): Promise<Message<IGetItemPriceHistoriesResponse>> {
    return this.request(subjects.itemPricesHistory, {
      body: JSON.stringify(req),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  public async resolveItemPricesHistory(
    req: IGetItemPriceHistoriesRequest,
  ): Promise<ResolveItemPriceHistoriesResponse> {
    // gathering item-price-histories
    const itemPriceHistoriesMessage = await this.getItemPricesHistory(req);
    if (itemPriceHistoriesMessage.code !== code.ok) {
      return {
        code: itemPriceHistoriesMessage.code,
        data: null,
        error: itemPriceHistoriesMessage.error?.message ?? null,
      };
    }

    const itemPriceHistoriesResult = await itemPriceHistoriesMessage.decode();
    if (itemPriceHistoriesResult === null) {
      return {
        code: code.msgJsonParseError,
        data: null,
        error: "failed to decode item-price histories",
      };
    }
    const foundHistory = itemPriceHistoriesResult.history;

    // gathering unix timestamps for all items
    const historyUnixTimestamps: number[] = req.item_ids.reduce(
      (previousHistoryUnixTimestamps: number[], itemId) => {
        const itemHistory = foundHistory[itemId];
        if (typeof itemHistory === "undefined") {
          return previousHistoryUnixTimestamps;
        }

        const itemUnixTimestamps = Object.keys(itemHistory).map(Number);
        for (const itemUnixTimestamp of itemUnixTimestamps) {
          if (previousHistoryUnixTimestamps.indexOf(itemUnixTimestamp) > -1) {
            continue;
          }

          previousHistoryUnixTimestamps.push(itemUnixTimestamp);
        }

        return previousHistoryUnixTimestamps;
      },
      [],
    );

    // normalizing all histories to have zeroed data where missing
    const historyResult = req.item_ids.reduce<IItemPriceHistories<IPricesFlagged>>(
      (previousHistory, itemId) => {
        // generating a full zeroed pricelist-history for this item
        const currentItemHistory = foundHistory[itemId];
        if (typeof currentItemHistory === "undefined") {
          const blankItemHistory = historyUnixTimestamps.reduce<IPriceHistories<IPricesFlagged>>(
            (previousBlankItemHistory, unixTimestamp) => {
              const blankPrices: IPricesFlagged = {
                average_buyout_per: 0,
                is_blank: true,
                max_buyout_per: 0,
                median_buyout_per: 0,
                min_buyout_per: 0,
                volume: 0,
              };

              return {
                ...previousBlankItemHistory,
                [unixTimestamp]: blankPrices,
              };
            },
            {},
          );

          return {
            ...previousHistory,
            [itemId]: blankItemHistory,
          };
        }

        // reforming the item-history with zeroed blank prices where none found
        const newItemHistory = historyUnixTimestamps.reduce<IPriceHistories<IPricesFlagged>>(
          (previousNewItemHistory, unixTimestamp) => {
            const itemHistoryAtTime = currentItemHistory[unixTimestamp];
            if (typeof itemHistoryAtTime === "undefined") {
              const blankPrices: IPricesFlagged = {
                average_buyout_per: 0,
                is_blank: true,
                max_buyout_per: 0,
                median_buyout_per: 0,
                min_buyout_per: 0,
                volume: 0,
              };

              return {
                ...previousNewItemHistory,
                [unixTimestamp]: blankPrices,
              };
            }

            return {
              ...previousNewItemHistory,
              [unixTimestamp]: {
                ...itemHistoryAtTime,
                is_blank: false,
              },
            };
          },
          {},
        );

        return {
          ...previousHistory,
          [itemId]: newItemHistory,
        };
      },
      {},
    );

    const itemPriceLimits = req.item_ids.reduce<IItemPriceLimits>(
      (previousItemPriceLimits, itemId) => {
        const out: IPriceLimits = {
          lower: 0,
          upper: 0,
        };

        const itemPriceHistory = historyResult[itemId];
        if (typeof itemPriceHistory === "undefined") {
          return {
            ...previousItemPriceLimits,
            [itemId]: out,
          };
        }

        const itemPrices = Object.keys(itemPriceHistory).reduce<IPrices[]>(
          (itemPricesResult, itemIdString) => {
            const foundItemPrices = itemPriceHistory[Number(itemIdString)];
            if (typeof foundItemPrices === "undefined") {
              return itemPricesResult;
            }

            return [...itemPricesResult, foundItemPrices];
          },
          [],
        );
        if (itemPrices.length > 0) {
          const bands: IBollingerBands = boll(
            itemPrices.map(v => v.min_buyout_per),
            Math.min(itemPrices.length, 4),
          );
          const minBandMid = bands.mid.reduce((previousValue, v) => {
            if (v === 0) {
              return previousValue;
            }

            if (previousValue === 0) {
              return v;
            }

            return Math.min(v, previousValue);
          }, 0);
          const maxBandUpper = bands.upper
            .filter(v => !!v)
            .reduce((previousValue, v) => Math.max(previousValue, v), 0);
          out.lower = minBandMid;
          out.upper = maxBandUpper;
        }

        return {
          ...previousItemPriceLimits,
          [itemId]: out,
        };
      },
      {},
    );

    const overallPriceLimits: IPriceLimits = { lower: 0, upper: 0 };
    overallPriceLimits.lower = req.item_ids.reduce((overallLower, itemId) => {
      const priceLimits = itemPriceLimits[itemId];
      if (typeof priceLimits === "undefined" || priceLimits.lower === 0) {
        return overallLower;
      }

      if (overallLower === 0) {
        return priceLimits.lower;
      }

      return Math.min(overallLower, priceLimits.lower);
    }, 0);
    overallPriceLimits.upper = req.item_ids.reduce((overallUpper, itemId) => {
      const priceLimits = itemPriceLimits[itemId];
      if (typeof priceLimits === "undefined") {
        return overallUpper;
      }

      return Math.max(priceLimits.upper, overallUpper);
    }, 0);

    return {
      code: code.ok,
      data: {
        history: historyResult,
        itemPriceLimits,
        overallPriceLimits,
      },
      error: null,
    };
  }

  // via recipe-price-histories
  public async getRecipePricesHistory(
    req: IGetRecipePricesHistoryRequest,
  ): Promise<Message<IGetRecipePricesHistoryResponse>> {
    return this.request(subjects.recipePricesHistory, {
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
  ): Promise<Message<ISkillTierResponse>> {
    return this.request(subjects.skillTier, {
      body: JSON.stringify({ profession_id: professionId, skilltier_id: skillTierId, locale }),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  public async getRecipe(recipeId: RecipeId, locale: Locale): Promise<Message<IRecipeResponse>> {
    return this.request(subjects.recipe, {
      body: JSON.stringify({ recipe_id: recipeId, locale }),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  public async resolveRecipe(recipeId: RecipeId, locale: Locale): Promise<ResolveRecipeResponse> {
    const recipeMsg = await this.getRecipe(recipeId, locale);
    if (recipeMsg.code !== code.ok) {
      return {
        code: recipeMsg.code,
        data: null,
        error: recipeMsg.error?.message ?? null,
      };
    }

    const recipeResult = await recipeMsg.decode();
    if (recipeResult === null) {
      return {
        code: code.msgJsonParseError,
        data: null,
        error: "failed to decode recipe message",
      };
    }

    const itemIds = ((): ItemId[] => {
      const out = new Set<ItemId>();
      if (recipeResult.recipe.crafted_item.id > 0) {
        out.add(recipeResult.recipe.crafted_item.id);
      }
      if (recipeResult.recipe.alliance_crafted_item.id > 0) {
        out.add(recipeResult.recipe.alliance_crafted_item.id);
      }
      if (recipeResult.recipe.horde_crafted_item.id > 0) {
        out.add(recipeResult.recipe.horde_crafted_item.id);
      }

      recipeResult.recipe.reagents.forEach(v => out.add(v.reagent.id));

      return Array.from(out);
    })();
    const itemsMsg = await this.getItems({
      itemIds,
      locale,
    });
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

    return {
      code: code.ok,
      data: { recipe: recipeResult, items: itemsResult },
      error: null,
    };
  }

  // etc
  private request<T>(subject: string, opts?: IRequestOptions): Promise<Message<T>> {
    const { body, parseKind, timeout }: IDefaultRequestOptions = {
      body: "",
      parseKind: ParseKind.JsonEncoded,
      timeout: DEFAULT_TIMEOUT,
      ...opts,
    };

    return new Promise<Message<T>>((resolve, reject) => {
      const tId = setTimeout(() => reject(new Error("Timed out!")), timeout);

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
