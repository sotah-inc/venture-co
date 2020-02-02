import {
  IExpansion,
  IItem,
  IItemClass,
  IItemPricelistHistoryMap,
  IItemsMap,
  InventoryType,
  IPricelistHistoryMap,
  IPricelistJson,
  IPricesFlagged,
  IQueryAuctionsItem,
  IQueryAuctionStatsResponse,
  IRealm,
  IRegion,
  ItemQuality,
  ItemStat,
} from "@sotah-inc/core";
import { IStatusRealm } from "@sotah-inc/core/build/dist/types/contracts/data";
import moment from "moment";

import { getApiEndpoint } from "../api";
import {
  IItemClasses,
  IItemClassWithSub,
  ILineItemOpen,
  IRegions,
  ISubItemClasses,
} from "../types/global";
import { IRegionTokenHistories } from "../types/posts";

const hostname: string = (() => {
  if (typeof window === "undefined") {
    return "";
  }

  return window.location.hostname;
})();
export const title: string =
  hostname === "localhost" ? "SotAH (DEV)" : "Secrets of the Auction House";
export const setTitle = (prefix: string) => {
  if (typeof document === "undefined") {
    return;
  }

  document.title = `${prefix} - ${title}`;
};

export const currencyToText = (amount: number, hideCopper?: boolean): string => {
  if (amount === 0) {
    return "0g";
  }

  const copper = Math.floor(amount % 100);
  amount = amount / 100;
  const silver = Math.floor(amount % 100);
  const gold = Math.floor(amount / 100);

  const copperOutput = copper > 0 ? `${copper.toFixed()}c` : null;
  const silverOutput = silver > 0 ? `${silver.toFixed()}s` : null;
  const goldOutput = (() => {
    if (gold === 0) {
      return null;
    }

    if (gold > 1000 * 1000) {
      return `${Number((gold / 1000 / 1000).toFixed(0)).toLocaleString()}Mg`;
    }

    if (gold > 100 * 1000) {
      return `${Number((gold / 1000).toFixed(0)).toLocaleString()}Kg`;
    }

    return `${Number(gold.toFixed(0)).toLocaleString()}g`;
  })();
  const outputParams = [goldOutput, silverOutput];
  if (typeof hideCopper === "undefined" || !hideCopper) {
    outputParams.push(copperOutput);
  }

  return outputParams.filter(v => v !== null).join(" ");
};

export const unixTimestampToText = (unixTimestamp: number): string =>
  moment(new Date(unixTimestamp * 1000)).format("MMM D");

export const getColor = (index: number): string => {
  const choices = [
    "#AD99FF",
    "#669EFF",
    "#43BF4D",
    "#D99E0B",
    "#FF6E4A",
    "#C274C2",
    "#2EE6D6",
    "#FF66A1",
    "#D1F26D",
    "#C99765",
    "#669EFF",
  ];

  return choices[index % choices.length];
};

export const qualityToColorClass = (quality: ItemQuality): string => {
  switch (quality) {
    case ItemQuality.Legendary:
      return "legendary-text";
    case ItemQuality.Epic:
      return "epic-text";
    case ItemQuality.Rare:
      return "rare-text";
    case ItemQuality.Uncommon:
      return "uncommon-text";
    case ItemQuality.Poor:
      return "poor-text";
    case ItemQuality.Common:
    default:
      return "common-text";
  }
};

export const getItemIconUrl = (item: IItem): string | null => {
  if (item.icon_object_name !== "") {
    return `https://item-icons.sotah.info/${item.icon_object_name}`;
  }

  if (item.icon_url !== "") {
    return item.icon_url;
  }

  if (item.icon === "") {
    return null;
  }

  return `${getApiEndpoint()}/item-icons/${item.icon}.jpg`;
};

export const getItemTextValue = (item: IItem): string => {
  if (item.name !== "") {
    return item.name;
  }

  return item.id.toString();
};

export const inventoryTypeToString = (iType: InventoryType): string => {
  if (!(iType in InventoryType)) {
    return "n/a";
  }

  switch (iType) {
    case InventoryType.Wrist:
      return "Wrist";
    case InventoryType.Robe:
      return "Chest";
    case InventoryType.OneHand:
      return "One-Hand";
    case InventoryType.HeldInOffHand:
      return "Held in Off-hand";
    default:
      return InventoryType[iType];
  }
};

export const itemStatToString = (stat: ItemStat): string => {
  if (!(stat in ItemStat)) {
    return `#${stat}`;
  }

  switch (stat) {
    case ItemStat.Int:
      return "Intellect";
    case ItemStat.Stam:
      return "Stamina";
    case ItemStat.Crit:
      return "Critical Strike";
    case ItemStat.FireResist:
      return "Fire Resistance";
    case ItemStat.NatResist:
      return "Nature Resistance";
    case ItemStat.ShadowResist:
      return "Shadow Resistance";
    case ItemStat.Vers:
      return "Versatility";
    case ItemStat.PvPResil:
      return "PvP Resilience";
    case ItemStat.Agi:
      return "Agility";
    case ItemStat.PvpPow:
      return "PvP Power";
    case ItemStat.Str:
      return "Strength";
    case ItemStat.AgiOrInt:
      return "[Agility or Intellect]";
    case ItemStat.StrOrInt:
      return "[Strength or Intellect]";
    case ItemStat.AgiOrStr:
      return "[Agility or Strength]";
    default:
      return ItemStat[stat];
  }
};

export const getSelectedResultIndex = (
  result: IQueryAuctionsItem,
  selectedItems: IQueryAuctionsItem[],
): number => {
  if (selectedItems.length === 0) {
    return -1;
  }

  for (let i = 0; i < selectedItems.length; i++) {
    const selectedItem = selectedItems[i];

    if (selectedItem.item !== null) {
      if (result.item !== null && result.item.id === selectedItem.item.id) {
        return Number(i);
      }
    }
  }

  return -1;
};

export const didRegionChange = (prevRegion: IRegion | null, currentRegion: IRegion): boolean => {
  if (prevRegion === null) {
    return true;
  }

  return prevRegion.name !== currentRegion.name;
};

export const didRealmChange = (prevRealm: IRealm | null, currentRealm: IRealm): boolean => {
  if (prevRealm === null) {
    return true;
  }

  return !(
    prevRealm.regionName === currentRealm.regionName && prevRealm.slug === currentRealm.slug
  );
};

export const getPrimaryExpansion = (expansions: IExpansion[]): IExpansion => {
  return expansions.reduce((previousValue: IExpansion, currentValue: IExpansion) => {
    if (currentValue.primary) {
      return currentValue;
    }

    return previousValue;
  }, expansions[0]);
};

interface IExtractStringMap {
  [key: string]: string | string[];
}

export const extractString = (key: string, params: IExtractStringMap): string => {
  if (!(key in params)) {
    return "";
  }

  if (typeof params[key] === "string") {
    return params[key] as string;
  }

  return "";
};

export const FormatRegionList = (regionList: IRegion[]): IRegions =>
  regionList.reduce((result, region) => ({ ...result, [region.name]: region }), {});

export const FormatItemClassList = (itemClassList: IItemClass[]): IItemClasses =>
  itemClassList.reduce((previousItemClasses: IItemClasses, itemClass) => {
    const subClassesMap: ISubItemClasses = itemClass.subclasses.reduce(
      (previousSubClasses: ISubItemClasses, subItemClass) => {
        const nextSubClasses: ISubItemClasses = {
          ...previousSubClasses,
          [subItemClass.subclass]: subItemClass,
        };

        return nextSubClasses;
      },
      {},
    );

    const itemClassWithSub: IItemClassWithSub = { ...itemClass, subClassesMap };

    const nextItemClasses: IItemClasses = {
      ...previousItemClasses,
      [itemClass.class]: itemClassWithSub,
    };

    return nextItemClasses;
  }, {});

export const FormatRealmList = (realmList: IStatusRealm[]) =>
  realmList.reduce((result, realm) => ({ ...result, [realm.slug]: realm }), {});

export const getItemFromPricelist = (items: IItemsMap, pricelist: IPricelistJson): IItem | null => {
  if (pricelist.pricelist_entries.length === 0) {
    return null;
  }

  const foundItem = items[pricelist.pricelist_entries[0].item_id];
  if (typeof foundItem === "undefined") {
    return null;
  }

  return foundItem;
};

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

export const zeroGraphValue = 0.1;

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
        if (!(parsedUnixTimestamp in dataIntermediate2)) {
          dataIntermediate2[parsedUnixTimestamp] = {};
        }

        dataIntermediate2[parsedUnixTimestamp][regionName] = tokenHistory[parsedUnixTimestamp];

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
      if (!(regionName in foundIntermediate)) {
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
  auctionStats: IQueryAuctionStatsResponse,
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
      const itemPricelistHistory: IPricelistHistoryMap<IPricesFlagged> =
        pricelistHistoryMap[Number(itemIdKey)];
      const itemId = Number(itemIdKey);

      return Object.keys(itemPricelistHistory).reduce(
        (previousValue: ILineItemOpen[], unixTimestampKey) => {
          const unixTimestamp = Number(unixTimestampKey);
          const prices = itemPricelistHistory[unixTimestamp];

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
