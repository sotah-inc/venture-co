import { ItemId } from "./item";
import { ISotahItemMeta } from "./sotah-item-meta";

export interface IShortItem {
  sotah_meta: ISotahItemMeta;

  id: ItemId;
  name: string;
}
