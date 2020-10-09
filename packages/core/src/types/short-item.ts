import { InventoryType, ItemId, ItemQuality } from "./item";
import { ItemClass, ItemClassId, ItemSubClass, ItemSubClassId } from "./item-class";
import { ISotahItemMeta } from "./sotah-item-meta";

export interface IShortItemStat {
  display_value: string;
  is_negated: boolean;
  value: number;
  type: string;
  is_equip_bonus: boolean;
}

export interface IShortItemSocket {
  type: string;
  name: string;
}

export enum PlayableClass {
  Hunter = 3,
}

export interface IShortItemPlayableClass {
  name: string;
  id: PlayableClass;
}

export interface IShortItemBase {
  sotah_meta: ISotahItemMeta;

  id: ItemId;
  name: string;
  quality: {
    type: ItemQuality;
    name: string;
  };
  max_count: number;
  level: number;
  item_class_id: ItemClass | ItemClassId;
  binding: string;
  sell_price: {
    value: number;
    header: string;
  };
  container_slots: string;
  description: string;
  level_requirement: string;
  inventory_type: {
    type: InventoryType;
    display_string: string;
  };
  item_subclass: string;
  durability: string;
  stats: IShortItemStat[];
  armor: string;
  spells: string[];
  skill_requirement: string;
  item_subclass_id: ItemSubClass | ItemSubClassId;
  crafting_reagent: string;
  damage: string;
  attack_speed: string;
  dps: string;
  socket_bonus: string;
  sockets: IShortItemSocket[];
  unique_equipped: string;
  gem_effect: string;
  gem_min_item_level: string;
  ability_requirement: string;
  limit_category: string;
  name_description: string;
  reputation_requirement: string;
  playable_classes: IShortItemPlayableClass[];
}

export interface IShortItem extends IShortItemBase {
  reagents_display_string: string;
  recipe_item: IShortItemBase;
}
