import {
  IItemPriceHistories,
  IPricesFlagged,
  IQueryAuctionStatsResponseData,
  IRecipePriceHistories,
} from "@sotah-inc/core";
import moment from "moment";
import { IRecipePriceHistory, IRecipePrices } from "../../../core/src/types";

import { ILineItemOpen } from "../types/global";
import { IRegionTokenHistories } from "../types/posts";

export function getXAxisTimeRestrictions() {
  const twoWeeksAgoDate = moment().subtract(14, "days");
  const roundedTwoWeeksAgoDate = moment()
    .subtract(16, "days")
    .subtract(twoWeeksAgoDate.hours(), "hours")
    .subtract(twoWeeksAgoDate.minutes(), "minutes")
    .subtract(twoWeeksAgoDate.seconds(), "seconds");
  const nowDate = moment().add(1, "days");
  const roundedNowDate = moment()
    .add(1, "days")
    .subtract(nowDate.hours(), "hours")
    .subtract(nowDate.minutes(), "minutes")
    .subtract(nowDate.seconds(), "seconds")
    .add(12, "hours");

  const xAxisTicks = Array.from(Array(9)).map((_, i) => {
    return roundedTwoWeeksAgoDate.unix() + i * 60 * 60 * 24 * 2;
  });

  return { roundedTwoWeeksAgoDate, roundedNowDate, xAxisTicks };
}

export const zeroGraphValue = 0.0001;

interface IRegionTokenHistoryIntermediate {
  [unixtimestamp: number]: {
    [regionName: string]: number | null;
  };
}

export function convertRegionTokenHistoriesToLineData(
  regionTokenHistories: IRegionTokenHistories,
): ILineItemOpen[] {
  // grouping data by unix timestamp, for easier consumption
  const dataIntermediate = Object.keys(regionTokenHistories).reduce<
    IRegionTokenHistoryIntermediate
  >((dataIntermediate1, regionName) => {
    const tokenHistory = regionTokenHistories[regionName];
    if (typeof tokenHistory === "undefined") {
      return dataIntermediate1;
    }

    return Object.keys(tokenHistory).reduce<IRegionTokenHistoryIntermediate>(
      (dataIntermediate2, unixTimestamp) => {
        const parsedUnixTimestamp = Number(unixTimestamp);
        const foundTokenHistory = tokenHistory[parsedUnixTimestamp];
        if (typeof foundTokenHistory === "undefined") {
          return dataIntermediate2;
        }

        if (typeof dataIntermediate2[parsedUnixTimestamp] === "undefined") {
          dataIntermediate2[parsedUnixTimestamp] = {
            [regionName]: foundTokenHistory,
          };
        } else {
          dataIntermediate2[parsedUnixTimestamp][regionName] = foundTokenHistory;
        }

        return dataIntermediate2;
      },
      dataIntermediate1,
    );
  }, {});

  // filling in missing data
  const filledDataIntermediate = Object.keys(dataIntermediate).reduce<
    IRegionTokenHistoryIntermediate
  >((dataIntermediate1, unixTimestamp) => {
    const foundIntermediate = dataIntermediate1[Number(unixTimestamp)];
    for (const regionName of Object.keys(regionTokenHistories)) {
      if (!Object.keys(foundIntermediate).some(v => v === regionName)) {
        foundIntermediate[regionName] = null;
      }
    }

    return {
      ...dataIntermediate1,
      [Number(unixTimestamp)]: foundIntermediate,
    };
  }, dataIntermediate);

  // converting each grouping to line-item data
  return Object.keys(filledDataIntermediate).map<ILineItemOpen>(unixTimestamp => {
    const data = Object.keys(dataIntermediate[Number(unixTimestamp)]).reduce<{
      [dataKey: string]: number | null;
    }>((data1, regionName) => {
      return {
        ...data1,
        [`${regionName}_token_price`]: dataIntermediate[Number(unixTimestamp)][regionName],
      };
    }, {});

    return {
      data,
      name: Number(unixTimestamp) / 1000,
    };
  });
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

export function convertRecipePriceHistoriesToLineData(
  recipePriceHistories: IRecipePriceHistories,
): ILineItemOpen[] {
  return Object.keys(recipePriceHistories).reduce<ILineItemOpen[]>((result1, recipeId) => {
    const recipePriceHistory: IRecipePriceHistory = recipePriceHistories[Number(recipeId)];

    return Object.keys(recipePriceHistory).reduce<ILineItemOpen[]>((result2, unixTimestamp) => {
      const recipePrices: IRecipePrices = recipePriceHistory[Number(unixTimestamp)];

      if (recipePrices.crafted_item_prices.id > 0) {
        result2.push({
          data: {
            [`${recipePrices.crafted_item_prices.id}_average_buyout_per`]: recipePrices
              .crafted_item_prices.prices.average_buyout_per,
          },
          name: Number(unixTimestamp),
        });
      }
      if (recipePrices.alliance_crafted_item_prices.id > 0) {
        result2.push({
          data: {
            [`${recipePrices.alliance_crafted_item_prices.id}_average_buyout_per`]: recipePrices
              .alliance_crafted_item_prices.prices.average_buyout_per,
          },
          name: Number(unixTimestamp),
        });
      }
      if (recipePrices.horde_crafted_item_prices.id > 0) {
        result2.push({
          data: {
            [`${recipePrices.horde_crafted_item_prices.id}_average_buyout_per`]: recipePrices
              .horde_crafted_item_prices.prices.average_buyout_per,
          },
          name: Number(unixTimestamp),
        });
      }

      result2.push({
        data: {
          ["total_reagent_prices_average_buyout_per"]:
            recipePrices.total_reagent_prices.average_buyout_per,
        },
        name: Number(unixTimestamp),
      });

      return result2;
    }, result1);
  }, []);
}

export function convertItemPriceHistoriesToLineData(
  itemPriceHistories: IItemPriceHistories<IPricesFlagged>,
): ILineItemOpen[] {
  return Object.keys(itemPriceHistories).reduce<ILineItemOpen[]>(
    (dataPreviousValue: ILineItemOpen[], itemIdKey: string) => {
      const itemPricelistHistory = itemPriceHistories[Number(itemIdKey)];
      const itemId = Number(itemIdKey);
      if (typeof itemPricelistHistory === "undefined") {
        return dataPreviousValue;
      }

      return Object.keys(itemPricelistHistory).reduce(
        (previousValue: ILineItemOpen[], unixTimestampKey) => {
          const unixTimestamp = Number(unixTimestampKey);
          const prices = itemPricelistHistory[unixTimestamp];
          if (typeof prices === "undefined" || prices.min_buyout_per === 0) {
            return previousValue;
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

          previousValue.push({
            data: {
              [`${itemId}_buyout`]: buyoutValue,
              [`${itemId}_volume`]: volumeValue,
            },
            name: unixTimestamp,
          });

          return previousValue;
        },
        dataPreviousValue,
      );
    },
    [],
  );
}
