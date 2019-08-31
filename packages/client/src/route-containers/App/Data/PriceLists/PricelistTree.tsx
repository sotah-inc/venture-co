import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { PricelistTreeContainer } from "../../../../containers/App/Data/PriceLists/PricelistTree";

type Props = Readonly<WithRouterProps>;

function RouteContainer({ router }: Props) {
  return (
    <PricelistTreeContainer
      browseToProfessionPricelist={(region, realm, profession, expansion, pricelist) => {
        const professionPricelistUrl = [
          "data",
          region.name,
          realm.slug,
          "professions",
          profession.name,
          expansion.name,
          pricelist.slug,
        ].join("/");
        (async () => router.push(`/${professionPricelistUrl}`))();
      }}
      browseToUserPricelist={(region, realm, pricelist) => {
        const userPricelistUrl = [
          "data",
          region.name,
          realm.slug,
          "professions",
          "user",
          pricelist.slug,
        ].join("/");
        (async () => router.push(`/${userPricelistUrl}`))();
      }}
      browseToProfessions={(region, realm) => {
        (async () => router.push(`/data/${region.name}/${realm.slug}/professions`))();
      }}
      browseToProfession={(region, realm, profession) => {
        (async () =>
          router.push(`/data/${region.name}/${realm.slug}/professions/${profession.name}`))();
      }}
      browseToProfessionExpansion={(region, realm, profession, expansion) => {
        const url = [
          "data",
          region.name,
          realm.slug,
          "professions",
          profession.name,
          expansion.name,
        ].join("/");
        (async () => router.push(`/${url}`))();
      }}
    />
  );
}

export const PricelistTreeRouteContainer = withRouter(RouteContainer);
