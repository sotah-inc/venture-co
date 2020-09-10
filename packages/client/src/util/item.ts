import { IItem, IItemClass, InventoryType, IPricelistJson, ItemQuality } from "@sotah-inc/core";

import { getApiEndpoint } from "../api";
import { IItemClasses, IItemClassWithSub, ISubItemClasses } from "../types/global";

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
  const foundName = item.blizzard_meta.name.en_US;
  if (typeof foundName !== "undefined" && foundName.length > 0) {
    return foundName;
  }

  return item.blizzard_meta.id.toString();
};

export const inventoryTypeToString = (iType: InventoryType): string => {
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
};

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

export const getItemFromPricelist = (items: IItem[], pricelist: IPricelistJson): IItem | null => {
  if (pricelist.pricelist_entries.length === 0) {
    return null;
  }

  const foundItem = items.find(v => v.blizzard_meta.id === pricelist.pricelist_entries[0].item_id);
  if (typeof foundItem === "undefined") {
    return null;
  }

  return foundItem;
};
