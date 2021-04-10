import { ItemId } from "./item";
import { ProfessionId } from "./short-profession";
import { SkillTierId } from "./short-skilltier";

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
  profession_id: ProfessionId;
  skilltier_id: SkillTierId;
  name: string;
  description: string;
  crafted_item: IShortRecipeItem;
  alliance_crafted_item: IShortRecipeItem;
  horde_crafted_item: IShortRecipeItem;
  reagents: IShortRecipeReagent[];
  rank: number;
  crafted_quantity: number;
  icon_url: string;
}

export function resolveCraftedItemIds(recipe: IShortRecipe): ItemId[] {
  const out: ItemId[] = [];

  if (recipe.crafted_item.id > 0) {
    out.push(recipe.crafted_item.id);
  }
  if (recipe.alliance_crafted_item.id > 0) {
    out.push(recipe.alliance_crafted_item.id);
  }
  if (recipe.horde_crafted_item.id > 0) {
    out.push(recipe.horde_crafted_item.id);
  }

  return out;
}
