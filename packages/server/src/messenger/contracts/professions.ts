import { IShortProfession, IShortRecipe, IShortSkillTier } from "@sotah-inc/core";

export interface IProfessionsResponse {
  professions: IShortProfession[];
}

export interface ISkillTierResponse {
  skilltier: IShortSkillTier;
}

export interface IRecipeResponse {
  recipe: IShortRecipe;
}
