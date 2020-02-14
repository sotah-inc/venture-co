import {
  IExpansion,
  IPricelistJson,
  IProfession,
  IRegion,
  IStatusRealm,
  OrderPerPage,
} from "@sotah-inc/core";
import * as queryString from "query-string";

export const toUserPricelist = (
  region: IRegion,
  realm: IStatusRealm,
  pricelist: IPricelistJson,
) => {
  const asDest = ["data", region.name, realm.slug, "user", pricelist.slug].join("/");
  const url = ["data", "[region_name]", "[realm_slug]", "user", "[pricelist_slug]"].join("/");

  return { url, asDest };
};

export const toProfessionPricelist = (
  region: IRegion,
  realm: IStatusRealm,
  expansion: IExpansion,
  profession: IProfession,
  pricelist: IPricelistJson,
) => {
  const asDest = [
    "data",
    region.name,
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
  region: IRegion,
  realm: IStatusRealm,
  expansion: IExpansion,
  profession: IProfession,
) => {
  const asDest = [
    "data",
    region.name,
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

export const toExpansion = (region: IRegion, realm: IStatusRealm, expansion: IExpansion) => {
  const asDest = ["data", region.name, realm.slug, expansion.name, "professions"].join("/");
  const url = ["data", "[region_name]", "[realm_slug]", "[expansion_name]", "professions"].join(
    "/",
  );

  return { url, asDest };
};

export const toWorkOrders = (
  region: IRegion,
  realm: IStatusRealm,
  page: number,
  perPage: OrderPerPage,
) => {
  const asDest = ["work-orders", region.name, realm.slug].join("/");
  const url = [].join("/");
  const params = queryString.stringify({ page, perPage });

  return { url: `${url}?${params}`, asDest: `${asDest}?${params}` };
};
