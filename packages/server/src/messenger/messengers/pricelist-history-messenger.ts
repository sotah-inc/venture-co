import { IItemPriceHistories, IPriceHistories, IPricesFlagged } from "@sotah-inc/core";
import { NatsConnection } from "nats";

import {
  code,
  IGetItemPriceHistoriesRequest,
  IGetItemPriceHistoriesResponse,
  ResolveItemPriceHistoriesResponse,
} from "../contracts";
import {
  IItemsMarketPriceRequest,
  IItemsMarketPriceResponse,
} from "../contracts/items-market-price";
import {
  IGetRecipePricesHistoryRequest,
  IGetRecipePricesHistoryResponse,
} from "../contracts/recipe-prices";
import { Message, ParseKind } from "../message";
import { BaseMessenger } from "./base";

enum subjects {
  itemPricesHistory = "itemPricesHistory",
  itemsMarketPrice = "itemsMarketPrice",
  recipePricesHistory = "recipePricesHistory",
}

export class PricelistHistoryMessenger extends BaseMessenger {
  constructor(conn: NatsConnection) {
    super(conn);
  }

  public async itemPricesHistory(
    req: IGetItemPriceHistoriesRequest,
  ): Promise<Message<IGetItemPriceHistoriesResponse>> {
    return this.request(subjects.itemPricesHistory, {
      body: JSON.stringify(req),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  public itemsMarketPrice(
    req: IItemsMarketPriceRequest,
  ): Promise<Message<IItemsMarketPriceResponse>> {
    return this.request(subjects.itemsMarketPrice, {
      body: JSON.stringify(req),
    });
  }

  public async recipePricesHistory(
    req: IGetRecipePricesHistoryRequest,
  ): Promise<Message<IGetRecipePricesHistoryResponse>> {
    return this.request(subjects.recipePricesHistory, {
      body: JSON.stringify(req),
      parseKind: ParseKind.GzipJsonEncoded,
    });
  }

  public async resolveItemPricesHistory(
    req: IGetItemPriceHistoriesRequest,
  ): Promise<ResolveItemPriceHistoriesResponse> {
    // gathering item-price-histories
    const itemPriceHistoriesMessage = await this.itemPricesHistory(req);
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
