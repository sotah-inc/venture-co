import React from "react";

import { RouteComponentProps, withRouter } from "react-router-dom";

import { AuctionTableContainer } from "../../../../containers/App/Data/AuctionList/AuctionTable";

type Props = Readonly<RouteComponentProps<{}>>;

function RouteContainer({ history }: Props) {
  return (
    <AuctionTableContainer
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
    />
  );
}

export const AuctionTableRouteContainer = withRouter(RouteContainer);
