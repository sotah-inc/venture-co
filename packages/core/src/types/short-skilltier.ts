import { RecipeId } from "./short-recipe";

export type SkillTierId = number;

export interface IShortSkillTierCategoryRecipe {
  id: RecipeId;
  name: string;
}

export interface IShortSkillTierCategory {
  name: string;
  recipes: IShortSkillTierCategoryRecipe[];
}

export interface IShortSkillTier {
  id: SkillTierId;
  name: string;
  minimum_skill_level: number;
  maximum_skill_level: number;
  categories: IShortSkillTierCategory[];
}
