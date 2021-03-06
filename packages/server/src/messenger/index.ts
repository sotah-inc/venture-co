import {
  IConnectedRealmComposite,
  IConnectedRealmModificationDates,
  IItemPriceHistories,
  IPriceHistories,
  IPricesFlagged,
  IProfessionSkillTierTuple,
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
  IItemsMarketPriceRequest,
  IItemsMarketPriceResponse,
} from "./contracts/items-market-price";
import {
  IProfessionsResponse,
  IQueryRecipesResponse,
  IRecipeResponse,
  IRecipesResponse,
  ISkillTierResponse,
  ISkillTiersResponse,
  ResolveQueryRecipesResponse,
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
  itemsMarketPrice = "itemsMarketPrice",

  itemPricesHistory = "itemPricesHistory",
  recipePricesHistory = "recipePricesHistory",

  professions = "professions",
  professionsFromIds = "professionsFromIds",
  skillTier = "skillTier",
  skillTiers = "skillTiers",
  recipe = "recipe",
  recipes = "recipes",
  recipesQuery = "recipesQuery",
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
    });
  }

  public itemsMarketPrice(
    req: IItemsMarketPriceRequest,
  ): Promise<Message<IItemsMarketPriceResponse>> {
    return this.request(subjects.itemsMarketPrice, {
      body: JSON.stringify(req),
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
                market_price_buyout_per: 0,
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
                market_price_buyout_per: 0,
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

    return {
      code: code.ok,
      data: {
        history: historyResult,
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

  public async getProfessionsFromIds(
    ids: ProfessionId[],
    locale: Locale,
  ): Promise<Message<IProfessionsResponse>> {
    return this.request(subjects.professionsFromIds, {
      body: JSON.stringify({ locale, profession_ids: ids }),
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

  public async getSkillTiers(
    tuples: IProfessionSkillTierTuple[],
    locale: Locale,
  ): Promise<Message<ISkillTiersResponse>> {
    return this.request(subjects.skillTiers, {
      body: JSON.stringify({ tuples, locale }),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  public async getRecipe(recipeId: RecipeId, locale: Locale): Promise<Message<IRecipeResponse>> {
    return this.request(subjects.recipe, {
      body: JSON.stringify({ recipe_id: recipeId, locale }),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  public async getRecipes(
    recipeIds: RecipeId[],
    locale: Locale,
  ): Promise<Message<IRecipesResponse>> {
    return this.request(subjects.recipes, {
      body: JSON.stringify({ recipe_ids: recipeIds, locale }),
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

  public queryRecipes(request: IQueryItemsRequest): Promise<Message<IQueryRecipesResponse>> {
    return this.request(subjects.recipesQuery, { body: JSON.stringify(request) });
  }

  public async resolveQueryRecipes(
    request: IQueryItemsRequest,
  ): Promise<ResolveQueryRecipesResponse> {
    // resolving items-query message
    const itemsQueryMessage = await this.queryRecipes(request);
    if (itemsQueryMessage.code !== code.ok) {
      return {
        data: null,
        code: itemsQueryMessage.code,
        error: null,
      };
    }

    const itemsQueryResult = await itemsQueryMessage.decode();
    if (itemsQueryResult === null) {
      return {
        data: null,
        code: code.msgJsonParseError,
        error: null,
      };
    }

    // resolving recipes from recipe-ids in items-query response data
    const getRecipesMessage = await this.getRecipes(
      itemsQueryResult.items.map(v => v.recipe_id),
      request.locale,
    );
    if (getRecipesMessage.code !== code.ok) {
      return {
        data: null,
        code: getRecipesMessage.code,
        error: null,
      };
    }

    const getRecipesResult = await getRecipesMessage.decode();
    if (getRecipesResult === null) {
      return {
        data: null,
        code: code.msgJsonParseError,
        error: null,
      };
    }

    const professionIds = Array.from<ProfessionId>(
      new Set<ProfessionId>(getRecipesResult.recipes.map(v => v.profession_id)),
    );
    const getProfessionsFromIdsMessage = await this.getProfessionsFromIds(
      professionIds,
      request.locale,
    );
    if (getProfessionsFromIdsMessage.code !== code.ok) {
      return {
        data: null,
        code: getProfessionsFromIdsMessage.code,
        error: null,
      };
    }

    const getProfessionsFromIdsResult = await getProfessionsFromIdsMessage.decode();
    if (getProfessionsFromIdsResult === null) {
      return {
        data: null,
        code: code.msgJsonParseError,
        error: null,
      };
    }

    const professionSkillTiers = getRecipesResult.recipes.reduce<{
      [professionId: number]: Set<SkillTierId> | undefined;
    }>((groupResult, recipe) => {
      const skillTiers: Set<SkillTierId> =
        groupResult[recipe.profession_id] ?? new Set<SkillTierId>();
      skillTiers.add(recipe.skilltier_id);

      return {
        ...groupResult,
        [recipe.profession_id]: skillTiers,
      };
    }, {});
    const professionSkillTierTuples = Object.keys(professionSkillTiers).reduce<
      IProfessionSkillTierTuple[]
    >((tuples, professionIdString) => {
      const skillTiers = professionSkillTiers[Number(professionIdString)];
      const skillTiersTuples = Array.from(
        skillTiers ?? new Set<SkillTierId>(),
      ).map<IProfessionSkillTierTuple>(skillTierId => {
        return {
          profession_id: Number(professionIdString),
          skilltier_id: skillTierId,
        };
      });

      return [...tuples, ...skillTiersTuples];
    }, []);
    const getSkillTiersMessage = await this.getSkillTiers(
      professionSkillTierTuples,
      request.locale,
    );
    if (getSkillTiersMessage.code !== code.ok) {
      return {
        data: null,
        code: getSkillTiersMessage.code,
        error: null,
      };
    }

    const getSkillTiersResult = await getSkillTiersMessage.decode();
    if (getSkillTiersResult === null) {
      return {
        data: null,
        code: code.msgJsonParseError,
        error: null,
      };
    }

    return {
      code: code.ok,
      data: {
        queryResponse: itemsQueryResult,
        recipes: getRecipesResult.recipes,
        professions: getProfessionsFromIdsResult.professions,
        skillTiers: getSkillTiersResult.skilltiers,
      },
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
