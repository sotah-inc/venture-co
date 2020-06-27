import {
  IExpansion,
  IItem,
  IItemClass,
  IItemPricelistHistoryMap,
  IItemsMap,
  InventoryType,
  IPrefillWorkOrderItemResponseData,
  IPricelistJson,
  IPricesFlagged,
  IQueryAuctionStatsResponseData,
  IQueryItemsItem,
  IRealm,
  IRegionComposite,
  ItemQuality,
  ItemStat,
} from "@sotah-inc/core";
import { IStatusRealm } from "@sotah-inc/core/build/dist/types/contracts/data";
import moment from "moment";

import { getApiEndpoint } from "../api";
import {
  IFetchData,
  IItemClasses,
  IItemClassWithSub,
  ILineItemOpen,
  IRegions,
  ISubItemClasses,
} from "../types/global";
import { FetchLevel } from "../types/main";
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

export type CurrencyToTextFormatter = (v: Array<string | null>) => string;

export const currencyToText = (
  amount: number,
  hideCopper?: boolean,
  formatter?: CurrencyToTextFormatter,
): string => {
  if (amount === 0) {
    return "0g";
  }

  if (typeof formatter === "undefined") {
    formatter = formatParams => formatParams.filter(v => v !== null).join(" ");
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

  return formatter(outputParams);
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
  if (item.sotah_meta.item_icon_meta.icon_object_name !== "") {
    return `https://item-icons.sotah.info/${item.sotah_meta.item_icon_meta.icon_object_name}`;
  }

  if (item.sotah_meta.item_icon_meta.icon_url !== "") {
    return item.sotah_meta.item_icon_meta.icon_url;
  }

  if (item.sotah_meta.item_icon_meta.icon === "") {
    return null;
  }

  return `${getApiEndpoint()}/item-icons/${item.sotah_meta.item_icon_meta.icon}.jpg`;
};

export const getItemTextValue = (item: IItem): string => {
  const foundName = item.sotah_meta.normalized_name.en_US;
  if (typeof foundName !== "undefined" && foundName.length > 0) {
    return foundName;
  }

  return item.blizzard_meta.id.toString();
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
  result: IQueryItemsItem,
  selectedItems: IQueryItemsItem[],
): number => {
  if (selectedItems.length === 0) {
    return -1;
  }

  for (let i = 0; i < selectedItems.length; i++) {
    const selectedItem = selectedItems[i];

    if (selectedItem.item !== null) {
      if (
        result.item !== null &&
        result.item.blizzard_meta.id === selectedItem.item.blizzard_meta.id
      ) {
        return Number(i);
      }
    }
  }

  return -1;
};

export const didRegionChange = (
  prevRegion: IRegionComposite | null,
  currentRegion: IRegionComposite,
): boolean => {
  if (prevRegion === null) {
    return true;
  }

  return prevRegion.config_region.name !== currentRegion.config_region.name;
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

export const FormatRegionList = (regionList: IRegionComposite[]): IRegions =>
  regionList.reduce((result, region) => ({ ...result, [region.config_region.name]: region }), {});

export const FormatItemClassList = (itemClassList: IItemClass[]): IItemClasses =>
  itemClassList.reduce((previousItemClasses: IItemClasses, itemClass) => {
    const subClassesMap: ISubItemClasses = itemClass.item_subclasses.reduce(
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
      [itemClass.class_id]: itemClassWithSub,
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
          if (typeof prices === "undefined") {
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

export interface ISliderData {
  min: number;
  max: number;
  range: number;
  step: number;
}

export function translateQuantityToSliderData(item?: IItem | null): ISliderData | null {
  if (typeof item === "undefined" || item === null) {
    return null;
  }

  switch (item.blizzard_meta.max_count) {
    case 200:
      return ((): ISliderData => {
        const step = 20;
        const max = item.blizzard_meta.max_count;
        const min = step;

        return {
          max,
          min,
          range: max - min,
          step,
        };
      })();
    case 20:
      return ((): ISliderData => {
        const step = 5;
        const max = item.blizzard_meta.max_count;
        const min = step;

        return {
          max,
          min,
          range: max - min,
          step,
        };
      })();
    case 1:
      return ((): ISliderData => {
        const step = 1;
        const max = 10;
        const min = step;

        return {
          max,
          min,
          range: max - min,
          step,
        };
      })();
    default:
      return ((): ISliderData => {
        const step = 1;
        const max = item.blizzard_meta.max_count;
        const min = step;

        return {
          max,
          min,
          range: max - min,
          step,
        };
      })();
  }
}

export function translatePriceToSliderData(
  prefillWorkOrderItem: IFetchData<IPrefillWorkOrderItemResponseData>,
): ISliderData | null {
  if (
    prefillWorkOrderItem.level !== FetchLevel.success ||
    prefillWorkOrderItem.data.currentPrice === null
  ) {
    return null;
  }

  const min = prefillWorkOrderItem.data.currentPrice / 2;
  const max = prefillWorkOrderItem.data.currentPrice * 2;
  const range = max - min;
  const step = range / 6;

  return { min, max, range, step };
}
