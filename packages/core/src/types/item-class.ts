import { IHrefReference, ILinksBase, LocaleMapping } from "./index";

export enum ItemSubClass {
  Misc = 0,
  Book = 0, // item-class: Recipe (9)
  Junk = 0, // item-class: Misc (15)
  Leatherworking = 1,
  Tailoring = 2,
  CompanionPets = 2,
  MiscOther = 4,
  Jewelcrafting = 4,
  Blacksmithing = 4,
  RecipeCooking = 5,
  MiscMount = 5,
  Cloth = 5,
  Leather = 6,
  MetalAndStone = 7,
  Cooking = 8,
  Enchanting = 8,
  Herb = 9,
  RecipeJewelcrafting = 10,
  Elemental = 10,
  TradeskillOther = 11,
  TradeskillEnchanting = 12,
  TradeskillInscription = 16,
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
  Gem = 3,
  Armor = 4,
  Tradeskill = 7,
  ItemEnhancement = 8,
  Recipe = 9,
  Quest = 12,
  Misc = 15,
  Glyph = 16,
  BattlePets = 17,
}

export type ItemClassId = number;

export interface IItemClass extends ILinksBase {
  class_id: ItemClass | ItemClassId;
  name: LocaleMapping;
  item_subclasses: IItemSubClass[];
}
