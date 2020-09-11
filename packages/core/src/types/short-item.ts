import { ItemId, ItemQuality } from "./item";
import { ISotahItemMeta } from "./sotah-item-meta";

export interface IShortItem {
  sotah_meta: ISotahItemMeta;

  id: ItemId;
  name: string;
  quality: {
    type: ItemQuality;
    name: string;
  };
}
