import {
  IItemPriceHistories,
  IPricesFlagged,
  IQueryAuctionStatsResponseData,
  IRecipePriceHistories,
  IRecipePriceHistory,
  IRecipePrices,
  IShortTokenHistory,
  ItemId,
  UnixTimestamp,
} from "@sotah-inc/core";

import { ILineItemOpen, ILineItemOpenData } from "../../types/global";
import { zeroGraphValue } from "../graph";

export function convertTokenHistoriesToLineData(
  tokenHistories: IShortTokenHistory,
): ILineItemOpen[] {
  return Object.keys(tokenHistories).reduce<ILineItemOpen[]>((result, unixTimestampString) => {
    const unixTimestamp = Number(unixTimestampString);
    const item = tokenHistories[unixTimestamp];
    if (typeof item === "undefined") {
      return result;
    }

    const data = Object.keys(item).reduce<ILineItemOpenData>((resultData, regionName) => {
      const foundPrice = item[regionName];
      if (typeof foundPrice === "undefined" || foundPrice === 0) {
        return {
          [`${regionName}_token_price`]: null,
        };
      }

      return {
        ...resultData,
        [`${regionName}_token_price`]: foundPrice,
      };
    }, {});

    const resultItem: ILineItemOpen = {
      data,
      name: unixTimestamp / 1000,
    };

    return [...result, resultItem];
  }, []);
}

export function convertAuctionStatsToLineData(
  auctionStats: IQueryAuctionStatsResponseData,
): ILineItemOpen[] {
  // converting each grouping to line-item data
  return Object.keys(auctionStats).map<ILineItemOpen>(unixTimestamp => {
    const data = auctionStats[Number(unixTimestamp)];

    return {
      data: { ...data },
      name: Number(unixTimestamp),
    };
  });
}

export function mergeLineData(first: ILineItemOpen[], second: ILineItemOpen[]): ILineItemOpen[] {
  const unixTimestamps: UnixTimestamp[] = [...first.map(v => v.name), ...second.map(v => v.name)];
  let timestampDataMap: { [key: number]: ILineItemOpenData } = unixTimestamps.reduce(
    (result, v) => {
      return {
        ...result,
        [v]: {},
      };
    },
    {},
  );

  timestampDataMap = [...first, ...second].reduce((result, v) => {
    return {
      ...result,
      [v.name]: {
        ...result[v.name],
        ...v.data,
      },
    };
  }, timestampDataMap);

  return Object.keys(timestampDataMap).reduce<ILineItemOpen[]>((result, v) => {
    return [
      ...result,
      {
        data: timestampDataMap[Number(v)],
        name: Number(v),
      },
    ];
  }, []);
}

export function convertRecipePriceHistoriesToLineData(
  recipePriceHistories: IRecipePriceHistories,
): ILineItemOpen[] {
  return Object.keys(recipePriceHistories).reduce<ILineItemOpen[]>((result1, recipeId) => {
    const recipePriceHistory: IRecipePriceHistory = recipePriceHistories[Number(recipeId)];

    return Object.keys(recipePriceHistory).reduce<ILineItemOpen[]>((result2, unixTimestamp) => {
      const recipePrices: IRecipePrices = recipePriceHistory[Number(unixTimestamp)];

      const data: { [key: string]: number | null } = {};
      if (recipePrices.crafted_item_prices.id > 0) {
        data[`${recipePrices.crafted_item_prices.id}_buyout_per`] =
          recipePrices.crafted_item_prices.prices.min_buyout_per / 10 / 10;
      }
      if (recipePrices.alliance_crafted_item_prices.id > 0) {
        data[`${recipePrices.alliance_crafted_item_prices.id}_buyout_per`] =
          recipePrices.alliance_crafted_item_prices.prices.min_buyout_per / 10 / 10;
      }
      if (recipePrices.horde_crafted_item_prices.id > 0) {
        data[`${recipePrices.horde_crafted_item_prices.id}_buyout_per`] =
          recipePrices.horde_crafted_item_prices.prices.min_buyout_per / 10 / 10;
      }
      data["total_reagent_cost"] = recipePrices.total_reagent_prices.min_buyout_per / 10 / 10;

      result2.push({
        data,
        name: Number(unixTimestamp),
      });

      return result2;
    }, result1);
  }, []);
}

export function convertItemPriceHistoriesToLineData(
  itemPriceHistories: IItemPriceHistories<IPricesFlagged>,
): ILineItemOpen[] {
  // gathering unix timestamps
  const unixTimestamps = Object.values(itemPriceHistories).reduce<Set<UnixTimestamp>>(
    (result, priceHistories) => {
      const unixTimestampKeys = Object.keys(priceHistories);
      for (const unixTimestampKey of unixTimestampKeys) {
        result.add(Number(unixTimestampKey));
      }

      return result;
    },
    new Set<UnixTimestamp>(),
  );

  // gathering item-ids
  const itemIds: ItemId[] = Object.keys(itemPriceHistories).map(Number);

  // going over it all
  return Array.from(unixTimestamps).map<ILineItemOpen>(unixTimestamp => {
    const data = itemIds.reduce<ILineItemOpenData>((result, itemId) => {
      const itemPriceHistory = itemPriceHistories[itemId];
      if (typeof itemPriceHistory === "undefined") {
        return {
          ...result,
          [`${itemId}_buyout_per`]: null,
          [`${itemId}_volume`]: null,
        };
      }

      const prices = itemPriceHistory[unixTimestamp];
      if (typeof prices === "undefined" || prices.min_buyout_per === 0) {
        return {
          ...result,
          [`${itemId}_buyout_per`]: null,
          [`${itemId}_volume`]: null,
        };
      }

      const buyoutValue: number = (() => {
        if (prices.min_buyout_per === 0) {
          return zeroGraphValue;
        }

        return prices.min_buyout_per / 10 / 10;
      })();
      const volumeValue: number = (() => {
        if (prices.volume === 0) {
          return zeroGraphValue;
        }

        return prices.volume;
      })();

      return {
        ...result,
        [`${itemId}_buyout_per`]: buyoutValue,
        [`${itemId}_volume`]: volumeValue,
      };
    }, {});

    return {
      data,
      name: unixTimestamp,
    };
  });
}
