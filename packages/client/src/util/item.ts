import {
  IItemClass,
  InventoryType,
  IPricelistJson,
  IShortItem,
  IShortItemBase,
  ItemQuality,
} from "@sotah-inc/core";

import { getApiEndpoint } from "../api/config";
import { IItemClasses, IItemClassWithSub, ISubItemClasses } from "../types/global";

interface IItemQualityColorClassMap {
  [key: string]: string | undefined;
}

const itemQualityColorClassMap: IItemQualityColorClassMap = {
  [ItemQuality.Poor]: "poor-text",
  [ItemQuality.Common]: "common-text",
  [ItemQuality.Uncommon]: "uncommon-text",
  [ItemQuality.Rare]: "rare-text",
  [ItemQuality.Epic]: "epic-text",
  [ItemQuality.Legendary]: "legendary-text",
};

export function qualityToColorClass(quality: ItemQuality): string {
  return itemQualityColorClassMap[quality] ?? "common-text";
}

export function getItemIconUrl(item: IShortItem): string | null {
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
}

export function getItemTextValue(item: IShortItemBase): string {
  const foundName = item.name;
  if (typeof foundName !== "undefined" && foundName.length > 0) {
    return foundName;
  }

  return item.id.toString();
}

export function inventoryTypeToString(iType: InventoryType): string {
  if (!Object.values(InventoryType).some(v => v === iType)) {
    return "n/a";
  }

  switch (iType) {
  case InventoryType.Wrist:
    return "Wrist";
  case InventoryType.Robe:
    return "Chest";
  case InventoryType.OffHand:
    return "Held in Off-hand";
  default:
    return iType;
  }
}

export function FormatItemClassList(itemClassList: IItemClass[]): IItemClasses {
  return itemClassList.reduce((previousItemClasses: IItemClasses, itemClass) => {
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
}

export function getItemFromPricelist(
  items: IShortItem[],
  pricelist: IPricelistJson,
): IShortItem | null {
  if (pricelist.pricelist_entries.length === 0) {
    return null;
  }

  const foundItem = items.find(v => v.id === pricelist.pricelist_entries[0].item_id);
  if (typeof foundItem === "undefined") {
    return null;
  }

  return foundItem;
}
