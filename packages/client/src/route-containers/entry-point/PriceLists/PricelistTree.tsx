import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { PricelistTreeContainer } from "../../../containers/entry-point/PriceLists/PricelistTree";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <PricelistTreeContainer
      browseToUserPricelist={(region, realm, pricelist) => {
        const userPricelistAsDest = [
          "data",
          region.name,
          realm.slug,
          "user",
          "professions",
          pricelist.slug,
        ].join("/");
        const userPricelistUrl = [
          "data",
          "[region_name]",
          "[realm_slug]",
          "user",
          "professions",
          "[pricelist_slug]",
        ].join("/");

        (async () => {
          await router.replace(`/${userPricelistUrl}`, `/${userPricelistAsDest}`);
        })();
      }}
      browseToExpansion={(region, realm, expansion) => {
        (async () => {
          await router.replace(
            "/data/[region_name]/[realm_slug]/[expansion_name]/professions",
            `/data/${region.name}/${realm.slug}/${expansion.name}/professions`,
          );
        })();
      }}
      browseToProfession={(region, realm, expansion, profession) => {
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

        (async () => {
          await router.replace(`/${url}`, `/${asDest}`);
        })();
      }}
      browseToProfessionPricelist={(region, realm, expansion, profession, pricelist) => {
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

        (async () => {
          await router.replace(`/${url}`, `/${asDest}`);
        })();
      }}
    />
  );
}

export const PricelistTreeRouteContainer = withRouter(RouteContainer);
