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

export function toAuctions(
  gameVersion?: GameVersion | null,
  region?: IConfigRegion | null,
  realm?: IClientRealm | null,
): IRouteConfig {
  if (!gameVersion) {
    return {
      url: "/auctions",
      asDest: "/auctions",
    };
  }

  if (!region) {
    return {
      url: "/auctions/[game_version]",
      asDest: `/auctions/${gameVersion}`,
    };
  }

  if (!realm) {
    return {
      url: "/auctions/[game_version]/[region_name]",
      asDest: `/auctions/${gameVersion}/${region.name}`,
    };
  }

  return {
    url: "/auctions/[game_version]/[region_name]/[realm_slug]",
    asDest: `/auctions/${gameVersion}/${region.name}/${realm.realm.slug}`,
  };
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

export function toRealmProfessionPricelists(
  region: IConfigRegion,
  realm: IClientRealm,
): IRouteConfig {
  const asDest = ["profession-pricelists", region.name, realm.realm.slug].join("/");
  const url = ["profession-pricelists", "[region_name]", "[realm_slug]"].join("/");

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

export function toProfessionPricelist(
  region: IConfigRegion,
  realm: IClientRealm,
  expansion: IExpansion,
  profession: IShortProfession,
  pricelist: IPricelistJson,
): IRouteConfig {
  const asDest = [
    "profession-pricelists",
    region.name,
    realm.realm.slug,
    expansion.name,
    `${profession.id}-${getSlug(profession.name)}`,
    pricelist.slug,
  ].join("/");
  const url = [
    "profession-pricelists",
    "[region_name]",
    "[realm_slug]",
    "[expansion_name]",
    "[profession_id]",
    "[pricelist_slug]",
  ].join("/");

  return { url, asDest };
}

export function toProfessionPricelistsProfession(
  region: IConfigRegion,
  realm: IClientRealm,
  expansion: IExpansion,
  profession: IShortProfession,
): IRouteConfig {
  const asDest = [
    "profession-pricelists",
    region.name,
    realm.realm.slug,
    expansion.name,
    `${profession.id}-${getSlug(profession.name)}`,
  ].join("/");
  const url = [
    "profession-pricelists",
    "[region_name]",
    "[realm_slug]",
    "[expansion_name]",
    "[profession_id]",
  ].join("/");

  return { url, asDest };
}

export function toExpansionProfessionPricelists(
  region: IConfigRegion,
  realm: IClientRealm,
  expansion: IExpansion,
): IRouteConfig {
  const asDest = ["profession-pricelists", region.name, realm.realm.slug, expansion.name].join("/");
  const url = ["profession-pricelists", "[region_name]", "[realm_slug]", "[expansion_name]"].join(
    "/",
  );

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
