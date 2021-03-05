import { IShortItem } from "../../short-item";
import { IShortProfession } from "../../short-profession";
import { IShortRecipe, RecipeId } from "../../short-recipe";
import { IShortSkillTier } from "../../short-skilltier";
import { IErrorResponse, IValidationErrorResponse } from "../index";

export interface IProfessionsResponseData {
  professions: IShortProfession[];
}

export type ProfessionsResponse = IProfessionsResponseData | IValidationErrorResponse | null;

export interface ISkillTierResponseData {
  skillTier: IShortSkillTier;
}

export type SkillTierResponse = ISkillTierResponseData | IValidationErrorResponse | null;

export interface IRecipeResponseData {
  recipe: IShortRecipe;
  items: IShortItem[];
}

export type RecipeResponse = IRecipeResponseData | IValidationErrorResponse | null;

export interface IQueryRecipeResponseData {
  queryResponse: {
    items: Array<{
      recipe_id: RecipeId;
      target: string;
      rank: number;
    }>;
  };
  recipes: IShortRecipe[];
  professions: IShortProfession[];
  skillTiers: IShortSkillTier[];
}

export type QueryRecipeResponse =
  | IQueryRecipeResponseData
  | IErrorResponse
  | IValidationErrorResponse
  | null;
