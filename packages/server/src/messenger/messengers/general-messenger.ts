import {
  IItemPriceHistories,
  IPriceHistories,
  IPricesFlagged,
  IRegionTokenHistory,
  IRegionTuple,
} from "@sotah-inc/core";
import * as nats from "nats";

import {
  code,
  IGetBootResponse,
  IGetItemPriceHistoriesRequest,
  IGetItemPriceHistoriesResponse,
  IGetSessionSecretResponse,
  IQueryGeneralItem,
  IQueryGeneralRequest,
  ResolveItemPriceHistoriesResponse,
} from "../contracts";
import {
  IGetRecipePricesHistoryRequest,
  IGetRecipePricesHistoryResponse,
} from "../contracts/recipe-prices";
import { IShortTokenHistoryResponse } from "../contracts/tokens";
import { Message, ParseKind } from "../message";
import { BaseMessenger } from "./base";
import { ItemsMessenger } from "./items-messenger";
import { PetsMessenger } from "./pets-messenger";

enum subjects {
  boot = "boot",
  sessionSecret = "sessionSecret",

  regionTokenHistory = "regionTokenHistory",
  tokenHistory = "tokenHistory",

  itemPricesHistory = "itemPricesHistory",
  recipePricesHistory = "recipePricesHistory",
}

export class GeneralMessenger extends BaseMessenger {
  private itemsMessenger: ItemsMessenger;

  private petsMessenger: PetsMessenger;

  constructor(client: nats.Client, itemsMessenger: ItemsMessenger, petsMessenger: PetsMessenger) {
    super(client);

    this.itemsMessenger = itemsMessenger;
    this.petsMessenger = petsMessenger;
  }

  public getBoot(): Promise<Message<IGetBootResponse>> {
    return this.request(subjects.boot);
  }

  public getSessionSecret(): Promise<Message<IGetSessionSecretResponse>> {
    return this.request(subjects.sessionSecret);
  }

  public async queryGeneral(request: IQueryGeneralRequest): Promise<IQueryGeneralItem[] | null> {
    const queriedItems = await this.itemsMessenger.resolveQueryItems(request);
    if (queriedItems === null) {
      return null;
    }

    const queriedPets = await this.petsMessenger.resolveQueryPets(request);
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

        return a.rank < b.rank ? -1 : 1;
      })
      .slice(0, 10);
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
}
