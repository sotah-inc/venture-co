import {
  GameVersion,
  IConfigRegion,
  IExpansion,
  IPricelistJson,
  IShortProfession,
  IShortRecipe,
  IShortSkillTier,
  IShortSkillTierCategoryRecipe,
} from "@sotah-inc/core";
import { NextRouter } from "next/router";
import getSlug from "speakingurl";

import { IClientRealm, IRouteConfig } from "../types/global";

interface IRouteConfigParts {
  [key: string]: string | undefined | null;
}

function resolveRouteConfig(prefix: string, parts: IRouteConfigParts): IRouteConfig {
  const resolvedParts = Object.keys(parts).reduce<{ [key: string]: string }>((result, v) => {
    const partsMember = parts[v];
    if (!partsMember) {
      return result;
    }

    return {
      ...result,
      [v]: partsMember,
    };
  }, {});

  return {
    url: `/${[prefix, ...Object.keys(resolvedParts)].join("/")}`,
    asDest: `/${[prefix, ...Object.values(resolvedParts)].join("/")}`,
  };
}

export function toAuctions(
  gameVersion?: GameVersion | null,
  region?: IConfigRegion | null,
  realm?: IClientRealm | null,
): IRouteConfig {
  return resolveRouteConfig("auctions", {
    game_version: gameVersion,
    region_name: region?.name,
    realm_slug: realm?.realm.slug,
  });
}

export function toProfessionPricelist(
  gameVersion?: GameVersion | null,
  region?: IConfigRegion | null,
  realm?: IClientRealm | null,
  expansion?: IExpansion | null,
  profession?: IShortProfession | null,
  pricelist?: IPricelistJson | null,
): IRouteConfig {
  return resolveRouteConfig("profession-pricelists", {
    game_version: gameVersion,
    region_name: region?.name,
    realm_slug: realm?.realm.slug,
    expansion_name: expansion?.name,
    profession_id: profession?.id.toString(),
    pricelist_slug: pricelist?.slug,
  });
}

export function toRealmProfessions(region: IConfigRegion, realm: IClientRealm): IRouteConfig {
  const asDest = ["professions", region.name, realm.realm.slug].join("/");
  const url = ["professions", "[region_name]", "[realm_slug]"].join("/");

  return { url, asDest };
}

export function toRealmProfession(
  region: IConfigRegion,
  realm: IClientRealm,
  profession: IShortProfession,
): IRouteConfig {
  const asDest = [
    "professions",
    region.name,
    realm.realm.slug,
    `${profession.id}-${getSlug(profession.name)}`,
  ].join("/");
  const url = ["professions", "[region_name]", "[realm_slug]", "[profession_id]"].join("/");

  return { url, asDest };
}

export function toRealmSkillTier(
  region: IConfigRegion,
  realm: IClientRealm,
  profession: IShortProfession,
  skillTier: IShortProfession["skilltiers"][0],
): IRouteConfig {
  const asDest = [
    "professions",
    region.name,
    realm.realm.slug,
    `${profession.id}-${getSlug(profession.name)}`,
    `${skillTier.id}-${getSlug(skillTier.name)}`,
  ].join("/");
  const url = [
    "professions",
    "[region_name]",
    "[realm_slug]",
    "[profession_id]",
    "[skilltier_id]",
  ].join("/");

  return { url, asDest };
}

export function toRealmRecipe(
  region: IConfigRegion,
  realm: IClientRealm,
  profession: IShortProfession,
  skillTier: IShortSkillTier,
  recipe: IShortRecipe,
): IRouteConfig {
  const asDest = [
    "professions",
    region.name,
    realm.realm.slug,
    `${profession.id}-${getSlug(profession.name)}`,
    `${skillTier.id}-${getSlug(skillTier.name)}`,
    `${recipe.id}-${getSlug(recipe.name)}`,
  ].join("/");
  const url = [
    "professions",
    "[region_name]",
    "[realm_slug]",
    "[profession_id]",
    "[skilltier_id]",
    "[recipe_id]",
  ].join("/");

  return { url, asDest };
}

export function toRealmCategoryRecipe(
  region: IConfigRegion,
  realm: IClientRealm,
  profession: IShortProfession,
  skillTier: IShortSkillTier,
  recipe: IShortSkillTierCategoryRecipe,
): IRouteConfig {
  const asDest = [
    "professions",
    region.name,
    realm.realm.slug,
    `${profession.id}-${getSlug(profession.name)}`,
    `${skillTier.id}-${getSlug(skillTier.name)}`,
    `${recipe.id}-${getSlug(recipe.recipe.name)}`,
  ].join("/");
  const url = [
    "professions",
    "[region_name]",
    "[realm_slug]",
    "[profession_id]",
    "[skilltier_id]",
    "[recipe_id]",
  ].join("/");

  return { url, asDest };
}

export function toUserPricelist(
  region: IConfigRegion,
  realm: IClientRealm,
  pricelist: IPricelistJson,
): IRouteConfig {
  const asDest = ["data", region.name, realm.realm.slug, "user", pricelist.slug].join("/");
  const url = ["data", "[region_name]", "[realm_slug]", "user", "[pricelist_slug]"].join("/");

  return { url, asDest };
}

export function toWorkOrders(region: IConfigRegion, realm: IClientRealm): IRouteConfig {
  const asDest = ["marketplace", "work-orders", region.name, realm.realm.slug].join("/");
  const url = ["marketplace", "work-orders", "[region_name]", "[realm_slug]"].join("/");

  return { url, asDest };
}

export interface IResolveResult {
  url: string;
  as: string;
}

type ResolveFunc = (...args: unknown[]) => IResolveResult;

export function resolveWrapper(handler: ResolveFunc, router: NextRouter) {
  return async (...args: unknown[]): Promise<void> => {
    const { as, url } = handler(...args);

    await router.replace(url, as);
  };
}
