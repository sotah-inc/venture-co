import {
  IExpansion,
  IPricelistJson,
  IProfession,
  IRegionComposite,
  IStatusRealm,
} from "@sotah-inc/core";

export const toUserPricelist = (
  region: IRegionComposite,
  realm: IStatusRealm,
  pricelist: IPricelistJson,
) => {
  const asDest = ["data", region.config_region.name, realm.slug, "user", pricelist.slug].join("/");
  const url = ["data", "[region_name]", "[realm_slug]", "user", "[pricelist_slug]"].join("/");

  return { url, asDest };
};

export const toProfessionPricelist = (
  region: IRegionComposite,
  realm: IStatusRealm,
  expansion: IExpansion,
  profession: IProfession,
  pricelist: IPricelistJson,
) => {
  const asDest = [
    "data",
    region.config_region.name,
    realm.slug,
    expansion.name,
    "professions",
    profession.name,
    pricelist.slug,
  ].join("/");
  const url = [
    "data",
    "[region_name]",
    "[realm_slug]",
    "[expansion_name]",
    "professions",
    "[profession_name]",
    "[pricelist_slug]",
  ].join("/");

  return { url, asDest };
};

export const toProfession = (
  region: IRegionComposite,
  realm: IStatusRealm,
  expansion: IExpansion,
  profession: IProfession,
) => {
  const asDest = [
    "data",
    region.config_region.name,
    realm.slug,
    expansion.name,
    "professions",
    profession.name,
  ].join("/");
  const url = [
    "data",
    "[region_name]",
    "[realm_slug]",
    "[expansion_name]",
    "professions",
    "[profession_name]",
  ].join("/");

  return { url, asDest };
};

export const toExpansion = (
  region: IRegionComposite,
  realm: IStatusRealm,
  expansion: IExpansion,
) => {
  const asDest = [
    "data",
    region.config_region.name,
    realm.slug,
    expansion.name,
    "professions",
  ].join("/");
  const url = ["data", "[region_name]", "[realm_slug]", "[expansion_name]", "professions"].join(
    "/",
  );

  return { url, asDest };
};

export const toWorkOrders = (region: IRegionComposite, realm: IStatusRealm) => {
  const asDest = ["marketplace", "work-orders", region.config_region.name, realm.slug].join("/");
  const url = ["marketplace", "work-orders", "[region_name]", "[realm_slug]"].join("/");

  return { url, asDest };
};
