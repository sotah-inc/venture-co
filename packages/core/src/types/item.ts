import {
  IKeyHrefReference,
  ILinksBase,
  ItemClassId,
  ItemSubClassId,
  ITypeNameTuple,
  LocaleMapping,
  UnixTimestamp,
} from "./index";

export type ItemId = number;

export enum ItemQuality {
  Poor = "EPIC",
  Common = "COMMON",
  Uncommon = "UNCOMMON",
  Rare = "RARE",
  Epic = "EPIC",
  Legendary = "LEGENDARY",
  Artifact = "ARTIFACT",
  Heirloom = "HEIRLOOM",
}

export enum InventoryType {
  NonEquip = "NON_EQUIP",
  Bag = "BAG",
  Tabard = "TABARD",

  Ranged = "RANGED",
  RangedRight = "RANGEDRIGHT",
  Ammo = "AMMO",
  TwoWeapon = "TWOWEAPON",
  Weapon = "WEAPON",
  Shield = "SHIELD",
  OffHand = "HOLDABLE",

  Head = "HEAD",
  Neck = "NECK",
  Shoulder = "SHOULDER",
  Cloak = "CLOAK",
  Chest = "CHEST",
  Robe = "ROBE",
  Shirt = "BODY",
  Wrist = "WRIST",
  Hand = "HAND",
  Waist = "WAIST",
  Legs = "LEGS",
  Feet = "FEET",
  Finger = "FINGER",
  Trinket = "TRINKET",
}

export enum ItemBind {
  BindOnEquip = "ON_EQUIP",
  BindOnAccount = "TO_BNETACCOUNT",
  BindOnPickup = "ON_ACQUIRE",
}

export enum ItemClassClasses {
  Consumable = 0,
  Container = 1,
  Weapon = 2,
  Gem = 3,
  Armor = 4,
  Reagent = 5,
  Projectile = 6,
  Tradeskill = 7,
  Recipe = 9,
  Quiver = 11,
  Quest = 12,
  Key = 13,
  Misc = 15,
  Glyph = 16,
  BattlePet = 17,
  WowToken = 18,
}

export type ItemSpellId = number;

export enum ItemSpellTrigger {
  OnProc = "ON_PROC",
  OnUse = "ON_USE",
  OnLearn = "ON_LEARN",
  OnLooted = "ON_LOOTED",
  OnPickup = "ON_PICKUP",
  OnEquip = "ON_EQUIP",
}

interface IItemSpell {
  spell: IKeyHrefReference & {
    name: LocaleMapping;
    id: ItemSpellId;
  };
  description: LocaleMapping;
}

export interface IItemColor {
  r: string;
  g: string;
  b: string;
  a: number;
}

export enum StatType {
  Intellect = "INTELLECT",
}

export interface IItemStat {
  type: {
    type: StatType;
    name: LocaleMapping;
  };
  value: number;
  display: {
    display_string: LocaleMapping;
    color: IItemColor;
  };
}

export interface IItemQuality {
  type: ItemQuality;
  name: LocaleMapping;
}

export interface IPreviewItem {
  item: IKeyHrefReference & {
    id: ItemId;
  };
  quality: IItemQuality;
  name: LocaleMapping;
  item_class: IKeyHrefReference & {
    name: LocaleMapping;
    id: ItemClassId;
  };
  item_subclass: IKeyHrefReference & {
    name: LocaleMapping;
    id: ItemSubClassId;
  };
  inventory_type: ITypeNameTuple;
  binding: ITypeNameTuple;
  spells: IItemSpell[];
  stats: IItemStat[];
  sell_price: {
    value: number;
    header: LocaleMapping;
    gold: LocaleMapping;
    silver: LocaleMapping;
    copper: LocaleMapping;
  };
  is_subclass_hidden: boolean;
  name_description: {
    display_string: LocaleMapping;
    color: IItemColor;
  };
}

export interface IItem {
  blizzard_meta: ILinksBase & {
    id: ItemId;
    name: LocaleMapping;
    quality: IItemQuality;
    level: number;
    required_level: number;
    media: IKeyHrefReference & {
      id: ItemId;
    };
    item_class: IKeyHrefReference & {
      name: LocaleMapping;
      id: ItemClassId;
    };
    item_subclass: IKeyHrefReference & {
      name: LocaleMapping;
      id: ItemSubClassId;
    };
    inventory_type: ITypeNameTuple;
    purchase_price: number;
    sell_price: number;
    max_count: number;
    is_equippable: boolean;
    is_stackable: boolean;
    preview_item: IPreviewItem;
  };
  sotah_meta: {
    last_modified: UnixTimestamp;
    normalized_name: LocaleMapping;
    item_icon_meta: {
      icon_url: string;
      icon_object_name: string;
      icon: string;
    };
  };
}

export interface IItemsMap {
  [key: number]: IItem | undefined;
}
