import { IItemPriceHistories, IPriceHistories, IPricesFlagged } from "@sotah-inc/core";
import { NatsConnection } from "nats";

import {
  code,
  IGetItemPriceHistoriesRequest,
  IQueryGeneralItem,
  IQueryGeneralRequest,
  ResolveItemPriceHistoriesResponse,
} from "../contracts";
import { BaseMessenger } from "./base";
import { ItemsMessenger } from "./items-messenger";
import { PetsMessenger } from "./pets-messenger";
import { PricelistHistoryMessenger } from "./pricelist-history-messenger";

export class GeneralMessenger extends BaseMessenger {
  private itemsMessenger: ItemsMessenger;

  private petsMessenger: PetsMessenger;

  private pricelistHistoryMessenger: PricelistHistoryMessenger;

  constructor(
    conn: NatsConnection,
    itemsMessenger: ItemsMessenger,
    petsMessenger: PetsMessenger,
    pricelistHistoryMessenger: PricelistHistoryMessenger,
  ) {
    super(conn);

    this.itemsMessenger = itemsMessenger;
    this.petsMessenger = petsMessenger;
    this.pricelistHistoryMessenger = pricelistHistoryMessenger;
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

  public async resolveItemPricesHistory(
    req: IGetItemPriceHistoriesRequest,
  ): Promise<ResolveItemPriceHistoriesResponse> {
    // gathering item-price-histories
    const itemPriceHistoriesMessage = await this.pricelistHistoryMessenger.getItemPricesHistory(
      req,
    );
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
}
