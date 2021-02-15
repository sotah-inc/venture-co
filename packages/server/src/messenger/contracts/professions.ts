import { IShortProfession, IShortRecipe, IShortSkillTier } from "@sotah-inc/core";

import { IGetItemsResponse, IResolveResponse } from "./index";

export interface IProfessionsResponse {
  professions: IShortProfession[];
}

export interface ISkillTierResponse {
  skilltier: IShortSkillTier;
}

export interface IRecipeResponse {
  recipe: IShortRecipe;
}

export type ResolveRecipeResponse = IResolveResponse<{
  recipe: IRecipeResponse;
  items: IGetItemsResponse;
}>;
