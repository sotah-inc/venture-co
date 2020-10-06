import { IHrefReference, ILinksBase, LocaleMapping } from "./index";

export enum ItemSubClass {
  CompanionPets = 2,
  Herb = 9,
}

export type ItemSubClassId = number;

export interface IItemSubClass {
  key: IHrefReference;
  subclass: number;
  name: LocaleMapping;
  id: ItemSubClassId;
}

export enum ItemClass {
  Consumable = 0,
  Container = 1,
  Armor = 4,
  Tradeskill = 7,
  Recipe = 9,
  Misc = 15,
  BattlePets = 17,
}

export type ItemClassId = number;

export interface IItemClass extends ILinksBase {
  class_id: ItemClass | ItemClassId;
  name: LocaleMapping;
  item_subclasses: IItemSubClass[];
}
