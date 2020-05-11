import { IHrefReference, ILinksBase, ILocaleMapping } from "./index";

export type ItemSubClassId = number;

export interface IItemSubClass {
  key: IHrefReference;
  subclass: number;
  name: ILocaleMapping;
  id: ItemSubClassId;
}

export type ItemClassId = number;

export interface IItemClass extends ILinksBase {
  class_id: ItemClassId;
  name: ILocaleMapping;
  item_subclasses: IItemSubClass[];
}
