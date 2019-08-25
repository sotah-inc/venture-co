import React from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

import { PricelistTreeContainer } from "../../../../containers/App/Data/PriceLists/PricelistTree";

type Props = Readonly<RouteComponentProps<{}>>;

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
        history.push(`/${professionPricelistUrl}`);
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
        history.push(`/${userPricelistUrl}`);
      }}
      browseToProfessions={(region, realm) => {
        history.push(`/data/${region.name}/${realm.slug}/professions`);
      }}
      browseToProfession={(region, realm, profession) => {
        history.push(`/data/${region.name}/${realm.slug}/professions/${profession.name}`);
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
        history.push(`/${url}`);
      }}
    />
  );
}

export const PricelistTreeRouteContainer = withRouter(RouteContainer);
