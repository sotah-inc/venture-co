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
  Poor,
  Common,
  Uncommon,
  Rare,
  Epic,
  Legendary,
  Artifact,
  Heirloom,
}

export enum InventoryType {
  None,
  Head,
  Neck,
  Shoulder,
  Shirt,
  Chest,
  Waist,
  Legs,
  Feet,
  Wrist,
  Hands,
  Finger,
  Trinket,
  OneHand,
  Shield,
  Ranged,
  Cloak,
  TwoHand,
  Bag,
  Tabard,
  Robe,
  MainHand,
  OffHand,
  HeldInOffHand,
  Ammo,
  Thrown,
  RangedRight,
  Relic,
}

export enum ItemBind {
  none,
  bindOnPickup,
  bindOnEquip,
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

export enum ItemStat {
  Agi = 3,
  Str = 4,
  Int = 5,
  Stam = 7,
  Dodge = 13,
  Parry = 14,
  Crit = 32,
  PvPResil = 35,
  Haste = 36,
  Vers = 40,
  Mastery = 49,
  FireResist = 51,
  ShadowResist = 54,
  NatResist = 55,
  PvpPow = 57,
  AgiOrStr = 72,
  AgiOrInt = 73,
  StrOrInt = 74,
}

export const SecondaryItemStats: ItemStat[] = [ItemStat.Crit, ItemStat.PvPResil, ItemStat.Haste];

export interface IItemBonusStat {
  stat: number;
  amount: number;
}

export interface IItemQuality {
  type: string;
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
    color: {
      r: string;
      g: string;
      b: string;
      a: number;
    };
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
