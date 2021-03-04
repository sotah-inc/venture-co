import { IShortProfession, IShortRecipe, IShortSkillTier, RecipeId } from "@sotah-inc/core";

import { IGetItemsResponse, IResolveResponse } from "./index";

export interface IProfessionsResponse {
  professions: IShortProfession[];
}

export interface ISkillTierResponse {
  skilltier: IShortSkillTier;
}

export interface ISkillTiersResponse {
  skilltiers: IShortSkillTier[];
}

export interface IRecipeResponse {
  recipe: IShortRecipe;
}

export interface IRecipesResponse {
  recipes: IShortRecipe[];
}

export type ResolveRecipeResponse = IResolveResponse<{
  recipe: IRecipeResponse;
  items: IGetItemsResponse;
}>;

export interface IQueryRecipesResponse {
  items: Array<{
    recipe_id: RecipeId;
    target: string;
    rank: number;
  }>;
}

export type ResolveQueryRecipesResponse = IResolveResponse<{
  queryResponse: IQueryRecipesResponse;
  recipes: IShortRecipe[];
  professions: IShortProfession[];
  skillTiers: IShortSkillTier[];
}>