import { ProfessionId } from "./short-profession";
import { IShortRecipe, RecipeId } from "./short-recipe";

export type SkillTierId = number;

export interface IShortSkillTierCategoryRecipe {
  id: RecipeId;
  recipe: IShortRecipe;
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

export interface IProfessionSkillTierTuple {
  profession_id: ProfessionId;
  skilltier_id: SkillTierId;
}
