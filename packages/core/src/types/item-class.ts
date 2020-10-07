import { IHrefReference, ILinksBase, LocaleMapping } from "./index";

export enum ItemSubClass {
  Misc = 0,
  Book = 0, // item-class: Recipe (9)
  CompanionPets = 2,
  Jewelcrafting = 4,
  Blacksmithing = 4,
  Leather = 6,
  MetalAndStone = 7,
  Cooking = 8,
  Herb = 9,
  Elemental = 10,
  Other = 11,
}

export type ItemSubClassId = number;

export interface IItemSubClass {
  key: IHrefReference;
  subclass: number;
  name: LocaleMapping;
  id: ItemSubClass | ItemSubClassId;
}

export enum ItemClass {
  Consumable = 0,
  Container = 1,
  Weapon = 2,
  Armor = 4,
  Tradeskill = 7,
  ItemEnhancement = 8,
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
