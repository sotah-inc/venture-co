import {
  IProfessionsResponseData,
  IRecipeResponseData,
  ISkillTierResponseData,
  Locale,
  ProfessionId,
  ProfessionsResponse,
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
