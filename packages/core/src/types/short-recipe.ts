import { ItemId } from "./item";

export type RecipeId = number;

export interface IShortRecipeItem {
  id: ItemId;
  name: string;
}

export interface IShortRecipeReagent {
  reagent: IShortRecipeItem;
  quantity: number;
}

export interface IShortRecipe {
  id: RecipeId;
  name: string;
  description: string;
  crafted_item: IShortRecipeItem;
  alliance_crafted_item: IShortRecipeItem;
  horde_crafted_item: IShortRecipeItem;
  reagents: IShortRecipeReagent[];
  rank: number;
  crafted_quantity: number;
}
