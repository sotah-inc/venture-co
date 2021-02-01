import {
  IExpansion,
  IPricelistJson,
  IProfession,
  IRegionComposite,
  IShortProfession,
  IShortRecipe,
  IShortSkillTier,
  IShortSkillTierCategoryRecipe,
} from "@sotah-inc/core";
import { IClientRealm } from "../types/global";
import { NextRouter } from "next/router";

export const toRealmProfessions = (region: IRegionComposite, realm: IClientRealm) => {
  const asDest = ["professions", region.config_region.name, realm.realm.slug].join("/");
  const url = ["professions", "[region_name]", "[realm_slug]"].join("/");

  return { url, asDest };
};

export const toRealmProfession = (
  region: IRegionComposite,
  realm: IClientRealm,
  profession: IShortProfession,
) => {
  const asDest = ["professions", region.config_region.name, realm.realm.slug, profession.id].join(
    "/",
  );
  const url = ["professions", "[region_name]", "[realm_slug]", "[profession_id]"].join("/");

  return { url, asDest };
};

export const toRealmSkillTier = (
  region: IRegionComposite,
  realm: IClientRealm,
  profession: IShortProfession,
  skillTier: IShortProfession["skilltiers"][0],
) => {
  const asDest = [
    "professions",
    region.config_region.name,
    realm.realm.slug,
    profession.id,
    skillTier.id,
  ].join("/");
  const url = [
    "professions",
    "[region_name]",
    "[realm_slug]",
    "[profession_id]",
    "[skilltier_id]",
  ].join("/");

  return { url, asDest };
};

export const toRealmRecipe = (
  region: IRegionComposite,
  realm: IClientRealm,
  profession: IShortProfession,
  skillTier: IShortSkillTier,
  recipe: IShortRecipe,
) => {
  const asDest = [
    "professions",
    region.config_region.name,
    realm.realm.slug,
    profession.id,
    skillTier.id,
    recipe.id,
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
};

export const toRealmCategoryRecipe = (
  region: IRegionComposite,
  realm: IClientRealm,
  profession: IShortProfession,
  skillTier: IShortSkillTier,
  recipe: IShortSkillTierCategoryRecipe,
) => {
  const asDest = [
    "professions",
    region.config_region.name,
    realm.realm.slug,
    profession.id,
    skillTier.id,
    recipe.id,
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
};

export const toRealmProfessionPricelists = (region: IRegionComposite, realm: IClientRealm) => {
  const asDest = ["profession-pricelists", region.config_region.name, realm.realm.slug].join("/");
  const url = ["profession-pricelists", "[region_name]", "[realm_slug]"].join("/");

  return { url, asDest };
};

export const toUserPricelist = (
  region: IRegionComposite,
  realm: IClientRealm,
  pricelist: IPricelistJson,
) => {
  const asDest = ["data", region.config_region.name, realm.realm.slug, "user", pricelist.slug].join(
    "/",
  );
  const url = ["data", "[region_name]", "[realm_slug]", "user", "[pricelist_slug]"].join("/");

  return { url, asDest };
};

export const toProfessionPricelist = (
  region: IRegionComposite,
  realm: IClientRealm,
  expansion: IExpansion,
  profession: IProfession,
  pricelist: IPricelistJson,
) => {
  const asDest = [
    "profession-pricelists",
    region.config_region.name,
    realm.realm.slug,
    expansion.name,
    profession.name,
    pricelist.slug,
  ].join("/");
  const url = [
    "profession-pricelists",
    "[region_name]",
    "[realm_slug]",
    "[expansion_name]",
    "[profession_name]",
    "[pricelist_slug]",
  ].join("/");

  return { url, asDest };
};

export const toProfessionPricelistsProfession = (
  region: IRegionComposite,
  realm: IClientRealm,
  expansion: IExpansion,
  profession: IProfession,
) => {
  const asDest = [
    "profession-pricelists",
    region.config_region.name,
    realm.realm.slug,
    expansion.name,
    profession.name,
  ].join("/");
  const url = [
    "profession-pricelists",
    "[region_name]",
    "[realm_slug]",
    "[expansion_name]",
    "[profession_name]",
  ].join("/");

  return { url, asDest };
};

export const toExpansionProfessionPricelists = (
  region: IRegionComposite,
  realm: IClientRealm,
  expansion: IExpansion,
) => {
  const asDest = [
    "profession-pricelists",
    region.config_region.name,
    realm.realm.slug,
    expansion.name,
  ].join("/");
  const url = ["profession-pricelists", "[region_name]", "[realm_slug]", "[expansion_name]"].join(
    "/",
  );

  return { url, asDest };
};

export const toWorkOrders = (region: IRegionComposite, realm: IClientRealm) => {
  const asDest = ["marketplace", "work-orders", region.config_region.name, realm.realm.slug].join(
    "/",
  );
  const url = ["marketplace", "work-orders", "[region_name]", "[realm_slug]"].join("/");

  return { url, asDest };
};

export interface ResolveResult {
  url: string;
  as: string;
}

type ResolveFunc = (...args: unknown[]) => ResolveResult;

export function resolveWrapper(handler: ResolveFunc, router: NextRouter) {
  return async (...args: unknown[]): Promise<void> => {
    const { as, url } = handler(...args);

    await router.replace(url, as);
  };
}
