import { IShortItem } from "../../short-item";
import { IShortProfession } from "../../short-profession";
import { IShortRecipe } from "../../short-recipe";
import { IShortSkillTier } from "../../short-skilltier";
import { IValidationErrorResponse } from "../index";

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
