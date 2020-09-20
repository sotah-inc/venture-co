import {
  IItemPricelistHistoryMap,
  IPricesFlagged,
  IQueryAuctionStatsResponseData,
} from "@sotah-inc/core";
import moment from "moment";

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

export function convertPricelistHistoryMapToLineData(
  pricelistHistoryMap: IItemPricelistHistoryMap<IPricesFlagged>,
): ILineItemOpen[] {
  return Object.keys(pricelistHistoryMap).reduce<ILineItemOpen[]>(
    (dataPreviousValue: ILineItemOpen[], itemIdKey: string) => {
      const itemPricelistHistory = pricelistHistoryMap[Number(itemIdKey)];
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
