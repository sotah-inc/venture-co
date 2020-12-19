import {
  GetRecipePriceHistoriesResponse,
  IGetRecipePriceHistoriesResponseData,
  Locale,
  RealmSlug,
  RecipeId,
  RegionName,
} from "@sotah-inc/core";
import * as HTTPStatus from "http-status";

import { getApiEndpoint } from "./config";
import { gatherWithQuery } from "./gather";

export interface IGetRecipePriceHistoriesOptions {
  regionName: RegionName;
  realmSlug: RealmSlug;
  recipeId: RecipeId;
  locale: Locale;
}

export const getRecipePriceHistories = async (
  opts: IGetRecipePriceHistoriesOptions,
): Promise<IGetRecipePriceHistoriesResponseData | null> => {
  const { regionName, realmSlug, recipeId } = opts;
  const { body, status } = await gatherWithQuery<
    { locale: Locale },
    GetRecipePriceHistoriesResponse
  >({
    headers: new Headers({
      "content-type": "application/json",
    }),
    method: "POST",
    query: { locale: opts.locale },
    url: `${getApiEndpoint()}/recipe-price-histories/${regionName}/${realmSlug}/${recipeId}`,
  });
  if (status !== HTTPStatus.OK) {
    return null;
  }

  return body as IGetRecipePriceHistoriesResponseData;
};
