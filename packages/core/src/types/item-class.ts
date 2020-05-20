import { IHrefReference, ILinksBase, LocaleMapping } from "./index";

export type ItemSubClassId = number;

export interface IItemSubClass {
  key: IHrefReference;
  subclass: number;
  name: LocaleMapping;
  id: ItemSubClassId;
}

export type ItemClassId = number;

export interface IItemClass extends ILinksBase {
  class_id: ItemClassId;
  name: LocaleMapping;
  item_subclasses: IItemSubClass[];
}
