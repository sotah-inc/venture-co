import { ItemId, ItemQuality } from "./item";
import { ItemClass, ItemClassId } from "./item-class";
import { ISotahItemMeta } from "./sotah-item-meta";

export interface IShortItem {
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
  inventory_type: string;
  item_subclass: string;
  durability: string;
  stats: string[];
  armor: string;
}
