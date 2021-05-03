import { IShortItem } from "../../short-item";
import { IShortProfession, ItemRecipeKind } from "../../short-profession";
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

export interface IQueryRecipesResponseData {
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

export type QueryRecipesResponse =
  | IQueryRecipesResponseData
  | IErrorResponse
  | IValidationErrorResponse
  | null;

export interface IGetItemsRecipesResponseData {
  itemsRecipes: Array<{
    kind: ItemRecipeKind;
    ids: { [itemId: number]: RecipeId[] | null | undefined };
  }>;
  recipes: IShortRecipe[];
  skillTiers: IShortSkillTier[];
  professions: IShortProfession[];
}

export type GetItemsRecipesResponse =
  | IGetItemsRecipesResponseData
  | IErrorResponse
  | IValidationErrorResponse
  | null;

export interface IItemsVendorPricesResponse {
  vendor_prices: { [id: string]: number | undefined };
}

export type ItemsVendorPricesResponse =
  | IItemsVendorPricesResponse
  | IErrorResponse
  | IValidationErrorResponse
  | null;
