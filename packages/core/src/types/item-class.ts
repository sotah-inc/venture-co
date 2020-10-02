import { IHrefReference, ILinksBase, LocaleMapping } from "./index";

export type ItemSubClassId = number;

export interface IItemSubClass {
  key: IHrefReference;
  subclass: number;
  name: LocaleMapping;
  id: ItemSubClassId;
}

export enum ItemClass {
  Container = 1,
  Armor = 4,
  Recipe = 9,
}

export type ItemClassId = number;

export interface IItemClass extends ILinksBase {
  class_id: ItemClass | ItemClassId;
  name: LocaleMapping;
  item_subclasses: IItemSubClass[];
}
