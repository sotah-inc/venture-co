import {
  GameVersion,
  IShortProfession,
  IShortRecipe,
  IShortSkillTier, ItemId,
  ItemRecipeKind,
  RecipeId,
} from "@sotah-inc/core";

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

export interface IItemsRecipesResponse {
  [itemId: number]: RecipeId[] | null | undefined;
}

export interface IResolveAllItemsRecipesResponseItem {
  kind: ItemRecipeKind;
  response: IItemsRecipesResponse;
}

export type ResolveAllItemsRecipesResponse = IResolveResponse<{
  itemRecipes: IResolveAllItemsRecipesResponseItem[];
}>

export type ResolveRecipesResponse = IResolveResponse<{
  recipes: IShortRecipe[];
  skillTiers: IShortSkillTier[];
  professions: IShortProfession[];
}>

export interface IItemRecipesIntakeRequest {
  [itemId: number]: RecipeId[];
}

export interface IItemRecipesRequest {
  kind: ItemRecipeKind;
  item_ids: ItemId[];
}

export interface IItemsVendorPricesRequest {
  item_ids: ItemId[];
  game_version: GameVersion;
}

export interface IItemsVendorPricesResponse {
  vendor_prices: { [id: string]: number | undefined };
}
