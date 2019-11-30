import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { PricelistTreeContainer } from "../../../containers/entry-point/PriceLists/PricelistTree";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <PricelistTreeContainer
      browseToProfessionPricelist={(region, realm, profession, expansion, pricelist) => {
        const professionPricelistAsDest = [
          "data",
          region.name,
          realm.slug,
          "professions",
          profession.name,
          expansion.name,
          pricelist.slug,
        ].join("/");
        const professionPricelistUrl = [
          "data",
          "[region_name]",
          "[realm_slug]",
          "professions",
          "[profession_name]",
          "[expansion_name]",
          "[pricelist_slug]",
        ].join("/");

        (async () => {
          await router.replace(`/${professionPricelistUrl}`, `/${professionPricelistAsDest}`);
        })();
      }}
      browseToUserPricelist={(region, realm, pricelist) => {
        const userPricelistAsDest = [
          "data",
          region.name,
          realm.slug,
          "professions",
          "user",
          pricelist.slug,
        ].join("/");
        const userPricelistUrl = [
          "data",
          "[region_name]",
          "[realm_slug]",
          "professions",
          "user",
          "[pricelist_slug]",
        ].join("/");

        (async () => {
          await router.replace(`/${userPricelistUrl}`, `/${userPricelistAsDest}`);
        })();
      }}
      browseToProfessions={(region, realm) => {
        (async () => {
          await router.replace(
            "/data/[region_name]/[realm_slug]/professions",
            `/data/${region.name}/${realm.slug}/professions`,
          );
        })();
      }}
      browseToProfession={(region, realm, profession) => {
        (async () => {
          await router.replace(
            "/data/[region_name]/[realm_slug]/professions/[profession_name]",
            `/data/${region.name}/${realm.slug}/professions/${profession.name}`,
          );
        })();
      }}
      browseToProfessionExpansion={(region, realm, profession, expansion) => {
        const asDest = [
          "data",
          region.name,
          realm.slug,
          "professions",
          profession.name,
          expansion.name,
        ].join("/");
        const url = [
          "data",
          "[region_name]",
          "[realm_slug]",
          "professions",
          "[profession_name]",
          "[expansion_name]",
        ].join("/");

        (async () => {
          await router.replace(`/${url}`, `/${asDest}`);
        })();
      }}
    />
  );
}

export const PricelistTreeRouteContainer = withRouter(RouteContainer);
