import React from "react";

import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import { PricelistTreeContainer } from "../../../../containers/App/Data/PriceLists/PricelistTree";

type Props = Readonly<WithRouterProps>;

function RouteContainer(props: Props) {
  const { history } = props;

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
        router.push(`/${professionPricelistUrl}`);
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
        router.push(`/${userPricelistUrl}`);
      }}
      browseToProfessions={(region, realm) => {
        router.push(`/data/${region.name}/${realm.slug}/professions`);
      }}
      browseToProfession={(region, realm, profession) => {
        router.push(`/data/${region.name}/${realm.slug}/professions/${profession.name}`);
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
        router.push(`/${url}`);
      }}
    />
  );
}

export const PricelistTreeRouteContainer = withRouter(RouteContainer);
