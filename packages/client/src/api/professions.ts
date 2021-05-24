import {
  GetItemsRecipesResponse,
  IGetItemsRecipesResponseData,
  IItemsVendorPricesResponse,
  IProfessionsResponseData,
  IQueryRecipesResponseData,
  IQueryRequest,
  IRecipeResponseData,
  ISkillTierResponseData,
  ItemId,
  ItemsVendorPricesResponse,
  Locale,
  ProfessionId,
  ProfessionsResponse,
  QueryRecipesResponse,
  RecipeId,
  RecipeResponse,
  SkillTierId,
  SkillTierResponse,
} from "@sotah-inc/core";
import * as HTTPStatus from "http-status";

import { getApiEndpoint } from "./config";
import { gatherWithQuery } from "./gather";

export interface IGetProfessionsResult {
  response: IProfessionsResponseData | null;
  error: string | null;
}

export async function getProfessions(locale: Locale): Promise<IGetProfessionsResult> {
  const url = [getApiEndpoint(), "professions"];

  const { body, status } = await gatherWithQuery<{ locale: Locale }, ProfessionsResponse>({
    headers: new Headers({ "content-type": "application/json" }),
    method: "GET",
    query: { locale },
    url,
  });

  switch (status) {
  case HTTPStatus.OK:
    break;
  default:
    return { response: null, error: "Failure" };
  }

  return { response: body as IProfessionsResponseData, error: null };
}

export interface IGetSkillTierResult {
  response: ISkillTierResponseData | null;
  error: string | null;
}

export async function getSkillTier(
  professionId: ProfessionId,
  skillTierId: SkillTierId,
  locale: Locale,
): Promise<IGetSkillTierResult> {
  const url = [getApiEndpoint(), "skill-tier", professionId.toString(), skillTierId.toString()];

  const { body, status } = await gatherWithQuery<{ locale: Locale }, SkillTierResponse>({
    headers: new Headers({ "content-type": "application/json" }),
    method: "GET",
    query: { locale },
    url,
  });

  switch (status) {
  case HTTPStatus.OK:
    break;
  default:
    return { response: null, error: "Failure" };
  }

  return { response: body as ISkillTierResponseData, error: null };
}

export interface IGetRecipeResult {
  response: IRecipeResponseData | null;
  error: string | null;
}

export async function getRecipe(recipeId: RecipeId, locale: Locale): Promise<IGetRecipeResult> {
  const url = [getApiEndpoint(), "recipe", recipeId.toString()];

  const { body, status } = await gatherWithQuery<{ locale: Locale }, RecipeResponse>({
    headers: new Headers({ "content-type": "application/json" }),
    method: "GET",
    query: { locale },
    url,
  });

  switch (status) {
  case HTTPStatus.OK:
    break;
  default:
    return { response: null, error: "Failure" };
  }

  return { response: body as IRecipeResponseData, error: null };
}

export async function queryRecipes(req: IQueryRequest): Promise<IQueryRecipesResponseData | null> {
  const { body, status } = await gatherWithQuery<IQueryRequest, QueryRecipesResponse>({
    method: "GET",
    query: req,
    url: `${getApiEndpoint()}/recipes`,
  });
  if (status !== HTTPStatus.OK) {
    return null;
  }

  return body as IQueryRecipesResponseData;
}

export async function getItemsRecipes(
  locale: Locale,
  itemIds: ItemId[],
): Promise<IGetItemsRecipesResponseData | null> {
  const { body, status } = await gatherWithQuery<
    { locale: Locale; itemIds: ItemId[] },
    GetItemsRecipesResponse
  >({
    method: "GET",
    query: { locale, itemIds },
    url: `${getApiEndpoint()}/items-recipes`,
  });
  if (status !== HTTPStatus.OK) {
    return null;
  }

  return body as IGetItemsRecipesResponseData;
}

export async function getItemsVendorPrices(
  itemIds: ItemId[],
): Promise<IItemsVendorPricesResponse | null> {
  const { body, status } = await gatherWithQuery<{ itemIds: ItemId[] }, ItemsVendorPricesResponse>({
    method: "GET",
    query: { itemIds },
    url: `${getApiEndpoint()}/items-vendor-prices`,
  });
  if (status !== HTTPStatus.OK) {
    return null;
  }

  return body as IItemsVendorPricesResponse;
}
